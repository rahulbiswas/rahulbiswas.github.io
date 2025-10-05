// Main application entry point
class XiangqiApp {
  constructor() {
    this.game = null;
    this.boardUI = null;
    this.pieceUI = null;
    this.gameControls = null;
    this.statusDisplay = null;
    this.ai = null;
    this.gameMode = 'human'; // 'human' or 'ai'
    this.aiDifficulty = 'medium';
    
    this.init();
  }

  async init() {
    try {
      // Wait for DOM to be fully loaded
      if (document.readyState === 'loading') {
        await new Promise(resolve => {
          document.addEventListener('DOMContentLoaded', resolve);
        });
      }

      // Initialize game components
      this.initializeGame();
      this.initializeUI();
      this.loadSettings();
      this.loadGameModePreference();
      this.setupGlobalEventListeners();
      
      // Show welcome message
      this.showWelcomeMessage();
      
      console.log('Xiangqi game initialized successfully');
    } catch (error) {
      console.error('Failed to initialize Xiangqi game:', error);
      this.showErrorMessage('Failed to initialize game. Please refresh the page.');
    }
  }

  initializeGame() {
    this.game = new XiangqiGame();
    
    // Set up game event listeners
    this.game.on('gameStarted', () => {
      console.log('New game started');
      Helpers.showNotification('New game started!', 'success');
    });
    
    this.game.on('gameEnded', (data) => {
      console.log('Game ended:', data);
      this.handleGameEnd(data);
    });
    
    this.game.on('moveMade', (data) => {
      console.log('Move made:', data.move.notation);
      this.handleMoveMade(data);
    });
    
    // Initialize AI if needed
    if (this.gameMode === 'ai') {
      this.ai = new XiangqiAI(this.aiDifficulty, 'black');
    }
    
    this.game.on('moveUndone', (data) => {
      console.log('Move undone');
      Helpers.showNotification('Move undone', 'info');
    });
  }

  initializeUI() {
    const boardElement = document.getElementById('game-board');
    if (!boardElement) {
      throw new Error('Game board element not found');
    }

    this.boardUI = new BoardUI(this.game, boardElement);
    this.pieceUI = new PieceUI(this.game);
    this.gameControls = new GameControls(this.game);
    this.statusDisplay = new StatusDisplay(this.game);
    
    console.log('UI components initialized');
  }

  loadSettings() {
    // Load saved settings from localStorage
    const savedSettings = Helpers.loadFromStorage('settings', {
      soundEnabled: true,
      showValidMoves: true,
      animationSpeed: 'normal',
      theme: 'classic'
    });
    
    this.game.updateSettings(savedSettings);
    this.applySavedSettings(savedSettings);
  }

  applySavedSettings(settings) {
    // Apply theme
    if (settings.theme && settings.theme !== 'classic') {
      document.body.classList.add(`theme-${settings.theme}`);
    }
    
    // Apply animation speed
    if (settings.animationSpeed) {
      document.documentElement.style.setProperty('--animation-speed', 
        settings.animationSpeed === 'fast' ? '0.15s' : 
        settings.animationSpeed === 'slow' ? '0.5s' : '0.3s');
    }
  }

  setupGlobalEventListeners() {
    // Navigation buttons
    const rulesBtn = document.getElementById('rules-btn');
    if (rulesBtn) {
      rulesBtn.addEventListener('click', () => {
        window.location.href = 'rules.html';
      });
    }
    
    const gameModeBtn = document.getElementById('game-mode-btn');
    if (gameModeBtn) {
      gameModeBtn.addEventListener('click', () => {
        this.showGameModeDialog();
      });
    }
    
    // Keyboard shortcuts
    document.addEventListener('keydown', (event) => {
      if (event.ctrlKey || event.metaKey) {
        switch (event.key.toLowerCase()) {
          case 'z':
            event.preventDefault();
            if (this.game.gameState.gameSettings.allowUndo) {
              this.game.undoMove();
            }
            break;
          case 'n':
            event.preventDefault();
            this.gameControls.showNewGameConfirmation();
            break;
          case 's':
            event.preventDefault();
            this.showSaveDialog();
            break;
          case 'l':
            event.preventDefault();
            this.showLoadDialog();
            break;
        }
      } else {
        switch (event.key) {
          case 'Escape':
            this.boardUI.clearSelection();
            break;
          case 'r':
            if (!event.ctrlKey && !event.metaKey) {
              this.gameControls.showResignConfirmation();
            }
            break;
        }
      }
    });
    
    // Handle visibility changes (pause/resume timer)
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.game.gameState.pauseTimer();
      } else {
        this.game.gameState.resumeTimer();
      }
    });
    
    // Handle page unload (save game state)
    window.addEventListener('beforeunload', (event) => {
      if (this.game.gameState.moveHistory.length > 0) {
        this.autoSaveGame();
        
        // Show confirmation dialog if game is in progress
        if (this.game.getGameStatus() === XIANGQI_CONSTANTS.GAME_STATUS.ACTIVE ||
            this.game.getGameStatus() === XIANGQI_CONSTANTS.GAME_STATUS.CHECK) {
          event.preventDefault();
          event.returnValue = 'You have a game in progress. Are you sure you want to leave?';
          return event.returnValue;
        }
      }
    });
    
    // Context menu for right-click options
    document.addEventListener('contextmenu', (event) => {
      if (event.target.classList.contains('piece')) {
        event.preventDefault();
        this.showPieceContextMenu(event);
      }
    });
  }

  handleGameEnd(data) {
    // Play sound effect
    Helpers.playSound('GAME_END');
    
    // Auto-save the completed game
    this.autoSaveGame();
    
    // Show statistics
    setTimeout(() => {
      this.showGameStatistics(data);
    }, 2000);
  }

  async handleMoveMade(data) {
    // Auto-save every 10 moves
    if (this.game.gameState.moveCount % 10 === 0) {
      this.autoSaveGame();
    }
    
    // Handle AI move if it's the AI's turn
    if (this.gameMode === 'ai' && 
        this.game.getCurrentPlayer() === 'black' && 
        this.game.getGameStatus() === XIANGQI_CONSTANTS.GAME_STATUS.ACTIVE) {
      
      // Disable board interaction during AI thinking
      this.boardUI.disableInteraction();
      
      try {
        // Update status to show AI is thinking
        const statusElement = document.getElementById('game-status');
        if (statusElement) {
          statusElement.textContent = 'AI is thinking...';
        }
        
        // Get AI move
        const aiMove = await this.ai.makeMove(this.game);
        
        if (aiMove) {
          const result = this.game.makeMove(aiMove.from, aiMove.to);
          if (!result.success) {
            console.error('AI made invalid move:', aiMove);
            Helpers.showNotification('AI error - invalid move', 'error');
          }
        }
      } catch (error) {
        console.error('AI error:', error);
        Helpers.showNotification('AI encountered an error', 'error');
      } finally {
        // Re-enable board interaction
        this.boardUI.enableInteraction();
      }
    }
  }

  showWelcomeMessage() {
    if (Helpers.loadFromStorage('welcomeShown') !== true) {
      const welcomeModal = this.createWelcomeModal();
      this.showModal(welcomeModal);
      Helpers.saveToStorage('welcomeShown', true);
    }
  }

  createWelcomeModal() {
    const modal = document.createElement('div');
    modal.className = 'modal';
    
    const content = document.createElement('div');
    content.className = 'modal-content welcome-modal';
    content.innerHTML = `
      <h2>Welcome to Xiangqi! 象棋</h2>
      <p>Welcome to Chinese Chess! Here are some quick tips to get started:</p>
      <ul>
        <li>Click on a piece to select it, then click where you want to move</li>
        <li>Red pieces move first (bottom of the board)</li>
        <li>Use the control buttons to start a new game, undo moves, or resign</li>
        <li>Press Escape to deselect a piece</li>
        <li>Use Ctrl+Z to undo a move quickly</li>
      </ul>
      <p>Good luck and have fun playing!</p>
      <button class="btn btn-primary" onclick="this.closest('.modal').remove()">
        Start Playing
      </button>
    `;
    
    modal.appendChild(content);
    return modal;
  }

  showPieceContextMenu(event) {
    const pieceElement = event.target;
    const row = parseInt(pieceElement.dataset.row);
    const col = parseInt(pieceElement.dataset.col);
    const piece = this.game.getPiece(row, col);
    
    if (!piece) return;
    
    // Remove existing context menu
    const existingMenu = document.querySelector('.context-menu');
    if (existingMenu) {
      existingMenu.remove();
    }
    
    const contextMenu = document.createElement('div');
    contextMenu.className = 'context-menu';
    contextMenu.style.position = 'fixed';
    contextMenu.style.left = event.clientX + 'px';
    contextMenu.style.top = event.clientY + 'px';
    contextMenu.style.zIndex = '1002';
    contextMenu.style.background = 'white';
    contextMenu.style.border = '1px solid #ccc';
    contextMenu.style.borderRadius = '4px';
    contextMenu.style.padding = '8px 0';
    contextMenu.style.minWidth = '150px';
    contextMenu.style.boxShadow = '0 4px 12px rgba(0,0,0,0.3)';
    
    const menuItems = [
      {
        text: `${piece.color} ${piece.type}`,
        disabled: true
      },
      {
        text: `Position: ${Helpers.coordsToNotation(row, col)}`,
        disabled: true
      },
      {
        text: `Value: ${piece.getValue()}`,
        disabled: true
      },
      { separator: true },
      {
        text: 'Show valid moves',
        action: () => {
          this.boardUI.selectPiece(row, col);
          contextMenu.remove();
        }
      },
      {
        text: 'Piece information',
        action: () => {
          this.pieceUI.showPieceInformation(piece, [row, col]);
          contextMenu.remove();
        }
      }
    ];
    
    for (const item of menuItems) {
      if (item.separator) {
        const separator = document.createElement('hr');
        separator.style.margin = '4px 0';
        separator.style.border = 'none';
        separator.style.borderTop = '1px solid #eee';
        contextMenu.appendChild(separator);
      } else {
        const menuItem = document.createElement('div');
        menuItem.style.padding = '8px 16px';
        menuItem.style.cursor = item.disabled ? 'default' : 'pointer';
        menuItem.style.color = item.disabled ? '#999' : '#333';
        menuItem.textContent = item.text;
        
        if (!item.disabled && item.action) {
          menuItem.addEventListener('click', item.action);
          menuItem.addEventListener('mouseenter', () => {
            menuItem.style.background = '#f5f5f5';
          });
          menuItem.addEventListener('mouseleave', () => {
            menuItem.style.background = 'white';
          });
        }
        
        contextMenu.appendChild(menuItem);
      }
    }
    
    document.body.appendChild(contextMenu);
    
    // Close menu when clicking elsewhere
    setTimeout(() => {
      document.addEventListener('click', function closeMenu() {
        contextMenu.remove();
        document.removeEventListener('click', closeMenu);
      });
    }, 100);
  }

  showSaveDialog() {
    const modal = document.createElement('div');
    modal.className = 'modal';
    
    const content = document.createElement('div');
    content.className = 'modal-content';
    content.innerHTML = `
      <h2>Save Game</h2>
      <div style="margin: 20px 0;">
        <label for="save-name">Save name:</label>
        <input type="text" id="save-name" placeholder="My Game" style="width: 100%; padding: 8px; margin-top: 8px;">
      </div>
      <div class="modal-buttons">
        <button class="btn btn-secondary" onclick="this.closest('.modal').remove()">Cancel</button>
        <button class="btn btn-primary" onclick="window.app.saveGame(document.getElementById('save-name').value)">Save</button>
      </div>
    `;
    
    modal.appendChild(content);
    document.body.appendChild(modal);
    modal.classList.add('show');
    
    // Focus input
    setTimeout(() => {
      document.getElementById('save-name').focus();
    }, 100);
  }

  showLoadDialog() {
    const saves = this.game.getAllSaves();
    
    const modal = document.createElement('div');
    modal.className = 'modal';
    
    const content = document.createElement('div');
    content.className = 'modal-content';
    
    let savesHTML = '<h2>Load Game</h2>';
    
    if (saves.length === 0) {
      savesHTML += '<p>No saved games found.</p>';
    } else {
      savesHTML += '<div class="saves-list">';
      for (const save of saves) {
        const date = new Date(save.lastModified).toLocaleString();
        savesHTML += `
          <div class="save-item" onclick="window.app.loadGame('${save.name}')">
            <div class="save-name">${save.name}</div>
            <div class="save-date">${date}</div>
            <div class="save-moves">Moves: ${save.data.moveCount}</div>
          </div>
        `;
      }
      savesHTML += '</div>';
    }
    
    savesHTML += `
      <div class="modal-buttons">
        <button class="btn btn-secondary" onclick="this.closest('.modal').remove()">Cancel</button>
      </div>
    `;
    
    content.innerHTML = savesHTML;
    modal.appendChild(content);
    document.body.appendChild(modal);
    modal.classList.add('show');
  }

  saveGame(name = null) {
    const saveName = name || `Game_${Date.now()}`;
    const success = this.game.saveGame(saveName);
    
    if (success) {
      Helpers.showNotification(`Game saved as "${saveName}"`, 'success');
    } else {
      Helpers.showNotification('Failed to save game', 'error');
    }
    
    // Close modal
    document.querySelector('.modal').remove();
  }

  loadGame(saveName) {
    const result = this.game.loadGame(saveName);
    
    if (result.success) {
      Helpers.showNotification(`Loaded game "${saveName}"`, 'success');
      this.boardUI.reset();
      this.statusDisplay.reset();
    } else {
      Helpers.showNotification('Failed to load game', 'error');
    }
    
    // Close modal
    document.querySelector('.modal').remove();
  }

  autoSaveGame() {
    if (this.game.gameState.moveHistory.length > 0) {
      this.game.saveGame('autosave');
      console.log('Game auto-saved');
    }
  }

  showGameStatistics(gameData) {
    const stats = this.statusDisplay.exportGameData();
    
    console.log('Game completed:', stats);
    
    // You could show a statistics modal here
    // For now, just log to console
  }

  showModal(modal) {
    document.body.appendChild(modal);
    requestAnimationFrame(() => {
      modal.classList.add('show');
    });
  }

  showGameModeDialog() {
    const modal = document.createElement('div');
    modal.className = 'modal';
    
    const content = document.createElement('div');
    content.className = 'modal-content game-mode-modal';
    content.innerHTML = `
      <h2>Select Game Mode 选择游戏模式</h2>
      <div class="game-mode-options">
        <div class="mode-option ${this.gameMode === 'human' ? 'selected' : ''}" data-mode="human">
          <div class="mode-icon">👥</div>
          <h3>Human vs Human</h3>
          <p>Play against another person on the same device</p>
        </div>
        <div class="mode-option ${this.gameMode === 'ai' ? 'selected' : ''}" data-mode="ai">
          <div class="mode-icon">🤖</div>
          <h3>Human vs AI</h3>
          <p>Play against the computer</p>
        </div>
      </div>
      
      <div class="ai-difficulty-section ${this.gameMode === 'ai' ? 'visible' : 'hidden'}">
        <h3>AI Difficulty Level 难度等级</h3>
        <div class="difficulty-options">
          <button class="difficulty-btn ${this.aiDifficulty === 'easy' ? 'selected' : ''}" data-difficulty="easy">
            Easy 容易
          </button>
          <button class="difficulty-btn ${this.aiDifficulty === 'medium' ? 'selected' : ''}" data-difficulty="medium">
            Medium 中等
          </button>
          <button class="difficulty-btn ${this.aiDifficulty === 'hard' ? 'selected' : ''}" data-difficulty="hard">
            Hard 困难
          </button>
          <button class="difficulty-btn ${this.aiDifficulty === 'expert' ? 'selected' : ''}" data-difficulty="expert">
            Expert 专家
          </button>
        </div>
      </div>
      
      <div class="modal-buttons">
        <button class="btn btn-secondary" onclick="this.closest('.modal').remove()">Cancel</button>
        <button class="btn btn-primary" id="apply-game-mode">Apply & New Game</button>
      </div>
    `;
    
    modal.appendChild(content);
    
    // Add event listeners
    content.querySelectorAll('.mode-option').forEach(option => {
      option.addEventListener('click', () => {
        content.querySelectorAll('.mode-option').forEach(o => o.classList.remove('selected'));
        option.classList.add('selected');
        
        const mode = option.dataset.mode;
        const aiSection = content.querySelector('.ai-difficulty-section');
        
        if (mode === 'ai') {
          aiSection.classList.add('visible');
          aiSection.classList.remove('hidden');
        } else {
          aiSection.classList.add('hidden');
          aiSection.classList.remove('visible');
        }
      });
    });
    
    content.querySelectorAll('.difficulty-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        content.querySelectorAll('.difficulty-btn').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
      });
    });
    
    content.querySelector('#apply-game-mode').addEventListener('click', () => {
      const selectedMode = content.querySelector('.mode-option.selected').dataset.mode;
      const selectedDifficulty = content.querySelector('.difficulty-btn.selected')?.dataset.difficulty || 'medium';
      
      this.setGameMode(selectedMode, selectedDifficulty);
      modal.remove();
    });
    
    this.showModal(modal);
  }

  setGameMode(mode, difficulty = 'medium') {
    this.gameMode = mode;
    this.aiDifficulty = difficulty;
    
    // Update game mode button text
    const gameModeBtn = document.getElementById('game-mode-btn');
    if (gameModeBtn) {
      if (mode === 'ai') {
        gameModeBtn.innerHTML = `🤖 vs AI (${difficulty})`;
      } else {
        gameModeBtn.innerHTML = '👥 vs Human';
      }
    }
    
    // Initialize or remove AI
    if (mode === 'ai') {
      this.ai = new XiangqiAI(difficulty, 'black');
      Helpers.showNotification(`AI difficulty set to ${difficulty}`, 'success');
    } else {
      this.ai = null;
      Helpers.showNotification('Game mode set to Human vs Human', 'success');
    }
    
    // Start new game with new mode
    this.game.newGame();
    
    // Save preference
    Helpers.saveToStorage('gameMode', { mode, difficulty });
  }

  loadGameModePreference() {
    const saved = Helpers.loadFromStorage('gameMode');
    if (saved) {
      this.setGameMode(saved.mode, saved.difficulty);
    }
  }

  showErrorMessage(message) {
    Helpers.showNotification(message, 'error');
  }

  // Utility method to restart the app
  restart() {
    location.reload();
  }
}

// Initialize the application when the script loads
window.app = new XiangqiApp();

// Export for debugging
if (typeof module !== 'undefined' && module.exports) {
  module.exports = XiangqiApp;
}