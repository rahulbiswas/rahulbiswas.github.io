class GameControls {
  constructor(game) {
    this.game = game;
    this.elements = {
      newGame: document.getElementById('new-game'),
      undoMove: document.getElementById('undo-move'),
      resign: document.getElementById('resign'),
      currentPlayer: document.getElementById('current-player'),
      gameStatus: document.getElementById('game-status'),
      redTimer: document.querySelector('.red-timer'),
      blackTimer: document.querySelector('.black-timer'),
      movesHistory: document.getElementById('moves-list')
    };
    
    this.setupEventListeners();
    this.updateUI();
  }

  setupEventListeners() {
    // Button click handlers
    this.elements.newGame.addEventListener('click', () => {
      this.showNewGameConfirmation();
    });
    
    this.elements.undoMove.addEventListener('click', () => {
      this.handleUndo();
    });
    
    this.elements.resign.addEventListener('click', () => {
      this.showResignConfirmation();
    });
    
    // Game event listeners
    this.game.on('moveMade', (data) => {
      this.updateUI();
      this.addMoveToHistory(data.move);
      this.updateUndoButton();
    });
    
    this.game.on('moveUndone', () => {
      this.updateUI();
      this.removeLastMoveFromHistory();
      this.updateUndoButton();
    });
    
    this.game.on('gameStarted', () => {
      this.updateUI();
      this.clearMoveHistory();
      this.updateUndoButton();
    });
    
    this.game.on('gameEnded', (data) => {
      this.updateUI();
      this.showGameEndModal(data);
      this.updateUndoButton();
    });
    
    this.game.on('settingsUpdated', () => {
      this.updateUndoButton();
    });
    
    // Timer updates
    this.game.gameState.on('timerUpdate', (data) => {
      this.updateTimers(data);
    });
  }

  updateUI() {
    this.updateCurrentPlayer();
    this.updateGameStatus();
    this.updatePlayerIndicators();
    this.updateTimers();
  }

  updateCurrentPlayer() {
    const currentPlayer = this.game.getCurrentPlayer();
    const indicators = this.elements.currentPlayer.querySelectorAll('.player-indicator');
    
    indicators.forEach(indicator => {
      indicator.classList.remove('active');
      if (indicator.classList.contains(`${currentPlayer}-indicator`)) {
        indicator.classList.add('active');
      }
    });
  }

  updateGameStatus() {
    const status = this.game.getGameStatus();
    const currentPlayer = this.game.getCurrentPlayer();
    let statusText = '';
    
    switch (status) {
      case XIANGQI_CONSTANTS.GAME_STATUS.ACTIVE:
        statusText = `${currentPlayer === 'red' ? 'Red' : 'Black'} to move`;
        break;
      case XIANGQI_CONSTANTS.GAME_STATUS.CHECK:
        statusText = `${currentPlayer === 'red' ? 'Red' : 'Black'} is in check!`;
        break;
      case XIANGQI_CONSTANTS.GAME_STATUS.CHECKMATE:
        const winner = this.game.gameState.metadata.winner;
        statusText = `Checkmate! ${winner === 'red' ? 'Red' : 'Black'} wins!`;
        break;
      case XIANGQI_CONSTANTS.GAME_STATUS.STALEMATE:
        statusText = 'Stalemate! Draw.';
        break;
      case XIANGQI_CONSTANTS.GAME_STATUS.DRAW:
        statusText = 'Game drawn by agreement.';
        break;
      case XIANGQI_CONSTANTS.GAME_STATUS.RESIGNED:
        const resignWinner = this.game.gameState.metadata.winner;
        statusText = `${resignWinner === 'red' ? 'Red' : 'Black'} wins by resignation!`;
        break;
      default:
        statusText = 'Unknown game state';
    }
    
    this.elements.gameStatus.textContent = statusText;
    
    // Add visual indication for check
    if (status === XIANGQI_CONSTANTS.GAME_STATUS.CHECK) {
      this.elements.gameStatus.classList.add('check-warning');
    } else {
      this.elements.gameStatus.classList.remove('check-warning');
    }
  }

  updatePlayerIndicators() {
    const currentPlayer = this.game.getCurrentPlayer();
    const redIndicator = document.querySelector('.red-indicator');
    const blackIndicator = document.querySelector('.black-indicator');
    
    if (redIndicator && blackIndicator) {
      redIndicator.classList.toggle('active', currentPlayer === 'red');
      blackIndicator.classList.toggle('active', currentPlayer === 'black');
    }
  }

  updateTimers(data = null) {
    if (!this.game.gameState.gameSettings.timer.enabled) {
      this.elements.redTimer.textContent = '--:--';
      this.elements.blackTimer.textContent = '--:--';
      return;
    }
    
    const timers = data || {
      red: this.game.gameState.timers.red,
      black: this.game.gameState.timers.black,
      current: this.game.getCurrentPlayer()
    };
    
    this.elements.redTimer.textContent = Helpers.formatTime(timers.red);
    this.elements.blackTimer.textContent = Helpers.formatTime(timers.black);
    
    // Update active timer styling
    this.elements.redTimer.classList.toggle('active', timers.current === 'red');
    this.elements.blackTimer.classList.toggle('active', timers.current === 'black');
    
    // Warning for low time
    this.elements.redTimer.classList.toggle('low-time', timers.red < 60);
    this.elements.blackTimer.classList.toggle('low-time', timers.black < 60);
  }

  updateUndoButton() {
    const canUndo = this.game.gameState.gameSettings.allowUndo && 
                   this.game.gameState.moveHistory.length > 0 &&
                   (this.game.getGameStatus() === XIANGQI_CONSTANTS.GAME_STATUS.ACTIVE ||
                    this.game.getGameStatus() === XIANGQI_CONSTANTS.GAME_STATUS.CHECK);
    
    this.elements.undoMove.disabled = !canUndo;
  }

  addMoveToHistory(move) {
    const moveElement = document.createElement('div');
    moveElement.className = 'move-entry';
    moveElement.innerHTML = `
      <span class="move-number">${move.moveNumber}.</span>
      <span class="move-notation ${move.player}">${move.notation}</span>
      <span class="move-player">${move.player === 'red' ? '红' : '黑'}</span>
    `;
    
    // Add click handler for move navigation (future feature)
    moveElement.addEventListener('click', () => {
      // TODO: Implement move navigation
      console.log('Navigate to move:', move.moveNumber);
    });
    
    this.elements.movesHistory.appendChild(moveElement);
    
    // Scroll to bottom to show latest move
    this.elements.movesHistory.scrollTop = this.elements.movesHistory.scrollHeight;
    
    // Add animation
    moveElement.classList.add('fade-in');
  }

  removeLastMoveFromHistory() {
    const lastMove = this.elements.movesHistory.lastElementChild;
    if (lastMove) {
      lastMove.style.opacity = '0';
      lastMove.style.transform = 'translateX(-20px)';
      setTimeout(() => {
        this.elements.movesHistory.removeChild(lastMove);
      }, 200);
    }
  }

  clearMoveHistory() {
    this.elements.movesHistory.innerHTML = '';
  }

  handleUndo() {
    if (!this.elements.undoMove.disabled) {
      const result = this.game.undoMove();
      if (!result.success) {
        Helpers.showNotification(result.error, 'error');
      }
    }
  }

  showNewGameConfirmation() {
    const modal = this.createModal(
      'Start New Game',
      'Are you sure you want to start a new game? Current progress will be lost.',
      [
        {
          text: 'Cancel',
          class: 'btn-secondary',
          action: (modal) => this.closeModal(modal)
        },
        {
          text: 'New Game',
          class: 'btn-primary',
          action: (modal) => {
            this.game.newGame();
            this.closeModal(modal);
          }
        }
      ]
    );
    
    this.showModal(modal);
  }

  showResignConfirmation() {
    const currentPlayer = this.game.getCurrentPlayer();
    const playerName = currentPlayer === 'red' ? 'Red' : 'Black';
    
    const modal = this.createModal(
      'Resign Game',
      `Are you sure ${playerName} wants to resign?`,
      [
        {
          text: 'Cancel',
          class: 'btn-secondary',
          action: (modal) => this.closeModal(modal)
        },
        {
          text: 'Resign',
          class: 'btn-danger',
          action: (modal) => {
            this.game.resign();
            this.closeModal(modal);
          }
        }
      ]
    );
    
    this.showModal(modal);
  }

  showGameEndModal(data) {
    let title = 'Game Over';
    let message = '';
    
    switch (data.result) {
      case 'checkmate':
        title = 'Checkmate!';
        message = `${data.winner === 'red' ? 'Red' : 'Black'} wins!`;
        break;
      case 'resignation':
        title = 'Game Resigned';
        message = `${data.winner === 'red' ? 'Red' : 'Black'} wins by resignation!`;
        break;
      case 'stalemate':
        title = 'Stalemate';
        message = 'The game ends in a draw.';
        break;
      case 'draw':
        title = 'Draw';
        message = 'The game ends in a draw by agreement.';
        break;
      default:
        message = 'The game has ended.';
    }
    
    const gameDuration = this.game.gameState.getGameDuration();
    const moveCount = this.game.gameState.moveCount;
    
    message += `\n\nMoves: ${moveCount}\nDuration: ${Helpers.formatTime(gameDuration)}`;
    
    const modal = this.createModal(
      title,
      message,
      [
        {
          text: 'View Game',
          class: 'btn-secondary',
          action: (modal) => this.closeModal(modal)
        },
        {
          text: 'New Game',
          class: 'btn-primary',
          action: (modal) => {
            this.game.newGame();
            this.closeModal(modal);
          }
        }
      ]
    );
    
    this.showModal(modal);
  }

  createModal(title, message, buttons) {
    const modal = document.createElement('div');
    modal.className = 'modal';
    
    const content = document.createElement('div');
    content.className = 'modal-content';
    
    const titleElement = document.createElement('h2');
    titleElement.textContent = title;
    content.appendChild(titleElement);
    
    const messageElement = document.createElement('p');
    messageElement.style.whiteSpace = 'pre-line';
    messageElement.textContent = message;
    content.appendChild(messageElement);
    
    const buttonContainer = document.createElement('div');
    buttonContainer.className = 'modal-buttons';
    
    for (const button of buttons) {
      const buttonElement = document.createElement('button');
      buttonElement.className = `btn ${button.class}`;
      buttonElement.textContent = button.text;
      buttonElement.addEventListener('click', () => button.action(modal));
      buttonContainer.appendChild(buttonElement);
    }
    
    content.appendChild(buttonContainer);
    modal.appendChild(content);
    
    // Close on background click
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        this.closeModal(modal);
      }
    });
    
    return modal;
  }

  showModal(modal) {
    document.body.appendChild(modal);
    requestAnimationFrame(() => {
      modal.classList.add('show');
    });
  }

  closeModal(modal) {
    modal.classList.remove('show');
    setTimeout(() => {
      if (document.body.contains(modal)) {
        document.body.removeChild(modal);
      }
    }, 300);
  }

  reset() {
    this.updateUI();
    this.clearMoveHistory();
    this.updateUndoButton();
  }
}

window.GameControls = GameControls;