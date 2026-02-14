class StatusDisplay {
  constructor(game) {
    this.game = game;
    this.elements = {
      gameStatus: document.getElementById('game-status'),
      currentPlayer: document.getElementById('current-player'),
      moveHistory: document.getElementById('moves-list')
    };
    
    this.setupEventListeners();
    this.updateDisplay();
  }

  setupEventListeners() {
    this.game.on('moveMade', () => {
      this.updateDisplay();
      this.highlightLastMove();
    });
    
    this.game.on('moveUndone', () => {
      this.updateDisplay();
    });
    
    this.game.on('gameStarted', () => {
      this.updateDisplay();
    });
    
    this.game.on('gameEnded', () => {
      this.updateDisplay();
    });
    
    this.game.on('gameLoaded', () => {
      this.updateDisplay();
      this.rebuildMoveHistory();
    });
  }

  updateDisplay() {
    this.updateGameStatus();
    this.updateCurrentPlayerDisplay();
    this.updateGameStatistics();
  }

  updateGameStatus() {
    const status = this.game.getGameStatus();
    const currentPlayer = this.game.getCurrentPlayer();
    let statusText = '';
    let statusClass = '';
    
    switch (status) {
      case XIANGQI_CONSTANTS.GAME_STATUS.ACTIVE:
        statusText = `${this.getPlayerDisplayName(currentPlayer)} to move`;
        statusClass = 'status-active';
        break;
        
      case XIANGQI_CONSTANTS.GAME_STATUS.CHECK:
        statusText = `${this.getPlayerDisplayName(currentPlayer)} is in check!`;
        statusClass = 'status-check';
        break;
        
      case XIANGQI_CONSTANTS.GAME_STATUS.CHECKMATE:
        const winner = this.game.gameState.metadata.winner;
        statusText = `Checkmate! ${this.getPlayerDisplayName(winner)} wins!`;
        statusClass = 'status-checkmate';
        break;
        
      case XIANGQI_CONSTANTS.GAME_STATUS.STALEMATE:
        statusText = 'Stalemate - Draw';
        statusClass = 'status-draw';
        break;
        
      case XIANGQI_CONSTANTS.GAME_STATUS.DRAW:
        statusText = 'Draw by agreement';
        statusClass = 'status-draw';
        break;
        
      case XIANGQI_CONSTANTS.GAME_STATUS.RESIGNED:
        const resignWinner = this.game.gameState.metadata.winner;
        statusText = `${this.getPlayerDisplayName(resignWinner)} wins by resignation`;
        statusClass = 'status-resigned';
        break;
        
      default:
        statusText = 'Unknown status';
        statusClass = 'status-unknown';
    }
    
    this.elements.gameStatus.textContent = statusText;
    
    // Update status styling
    this.elements.gameStatus.className = `game-status ${statusClass}`;
  }

  updateCurrentPlayerDisplay() {
    const currentPlayer = this.game.getCurrentPlayer();
    const indicators = document.querySelectorAll('.player-indicator');
    
    indicators.forEach(indicator => {
      const isActive = indicator.classList.contains(`${currentPlayer}-indicator`);
      indicator.classList.toggle('active', isActive);
    });
  }

  updateGameStatistics() {
    // Update move count
    const moveCount = this.game.gameState.moveCount;
    const movesPlayed = document.querySelector('.moves-played');
    if (movesPlayed) {
      movesPlayed.textContent = moveCount;
    }
    
    // Update game duration
    const duration = this.game.gameState.getGameDuration();
    const gameDuration = document.querySelector('.game-duration');
    if (gameDuration) {
      gameDuration.textContent = Helpers.formatTime(duration);
    }
    
    // Update material count
    this.updateMaterialCount();
  }

  updateMaterialCount() {
    let redMaterial = 0;
    let blackMaterial = 0;
    let redPieces = 0;
    let blackPieces = 0;
    
    // Count pieces on board
    for (let row = 0; row < XIANGQI_CONSTANTS.BOARD_SIZE.ROWS; row++) {
      for (let col = 0; col < XIANGQI_CONSTANTS.BOARD_SIZE.COLS; col++) {
        const piece = this.game.getPiece(row, col);
        if (piece) {
          if (piece.color === 'red') {
            redMaterial += piece.getValue();
            redPieces++;
          } else {
            blackMaterial += piece.getValue();
            blackPieces++;
          }
        }
      }
    }
    
    // Display material advantage
    const materialAdvantage = redMaterial - blackMaterial;
    const advantageElement = document.querySelector('.material-advantage');
    
    if (advantageElement) {
      if (materialAdvantage > 0) {
        advantageElement.textContent = `Red +${materialAdvantage}`;
        advantageElement.className = 'material-advantage red-advantage';
      } else if (materialAdvantage < 0) {
        advantageElement.textContent = `Black +${Math.abs(materialAdvantage)}`;
        advantageElement.className = 'material-advantage black-advantage';
      } else {
        advantageElement.textContent = 'Equal';
        advantageElement.className = 'material-advantage equal';
      }
    }
    
    // Update piece counts
    const redPieceCount = document.querySelector('.red-piece-count');
    const blackPieceCount = document.querySelector('.black-piece-count');
    
    if (redPieceCount) redPieceCount.textContent = redPieces;
    if (blackPieceCount) blackPieceCount.textContent = blackPieces;
  }

  rebuildMoveHistory() {
    this.elements.moveHistory.innerHTML = '';
    
    const history = this.game.getMoveHistory();
    for (const move of history) {
      this.addMoveToHistory(move);
    }
  }

  addMoveToHistory(move) {
    const moveElement = document.createElement('div');
    moveElement.className = 'move-entry';
    moveElement.dataset.moveNumber = move.moveNumber;
    
    const moveNumber = document.createElement('span');
    moveNumber.className = 'move-number';
    moveNumber.textContent = `${Math.ceil(move.moveNumber)}.`;
    
    const moveNotation = document.createElement('span');
    moveNotation.className = `move-notation ${move.player}`;
    moveNotation.textContent = move.notation;
    
    const movePlayer = document.createElement('span');
    movePlayer.className = 'move-player';
    movePlayer.textContent = move.player === 'red' ? '红' : '黑';
    
    // Add special indicators
    if (move.isCheck) {
      const checkIndicator = document.createElement('span');
      checkIndicator.className = 'move-indicator check';
      checkIndicator.textContent = '+';
      checkIndicator.title = 'Check';
      moveElement.appendChild(checkIndicator);
    }
    
    if (move.isCheckmate) {
      const checkmateIndicator = document.createElement('span');
      checkmateIndicator.className = 'move-indicator checkmate';
      checkmateIndicator.textContent = '#';
      checkmateIndicator.title = 'Checkmate';
      moveElement.appendChild(checkmateIndicator);
    }
    
    if (move.capturedPiece) {
      const captureIndicator = document.createElement('span');
      captureIndicator.className = 'move-indicator capture';
      captureIndicator.textContent = '×';
      captureIndicator.title = `Captured ${move.capturedPiece.type}`;
      moveElement.appendChild(captureIndicator);
    }
    
    moveElement.appendChild(moveNumber);
    moveElement.appendChild(moveNotation);
    moveElement.appendChild(movePlayer);
    
    // Add click handler for move review
    moveElement.addEventListener('click', () => {
      this.highlightMove(move);
    });
    
    this.elements.moveHistory.appendChild(moveElement);
    
    // Scroll to show latest move
    this.elements.moveHistory.scrollTop = this.elements.moveHistory.scrollHeight;
    
    return moveElement;
  }

  highlightLastMove() {
    // Remove previous highlights
    this.elements.moveHistory.querySelectorAll('.latest-move')
      .forEach(el => el.classList.remove('latest-move'));
    
    // Highlight the latest move
    const lastMove = this.elements.moveHistory.lastElementChild;
    if (lastMove) {
      lastMove.classList.add('latest-move');
    }
  }

  highlightMove(move) {
    // Remove previous highlights
    this.elements.moveHistory.querySelectorAll('.highlighted-move')
      .forEach(el => el.classList.remove('highlighted-move'));
    
    // Highlight the selected move
    const moveElement = this.elements.moveHistory.querySelector(`[data-move-number="${move.moveNumber}"]`);
    if (moveElement) {
      moveElement.classList.add('highlighted-move');
      moveElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
    
    // TODO: Show board position at this move (future feature)
    this.showMoveDetails(move);
  }

  showMoveDetails(move) {
    // Create or update move details popup
    let detailsPopup = document.querySelector('.move-details-popup');
    
    if (!detailsPopup) {
      detailsPopup = document.createElement('div');
      detailsPopup.className = 'move-details-popup';
      document.body.appendChild(detailsPopup);
    }
    
    const fromNotation = Helpers.coordsToNotation(move.from[0], move.from[1]);
    const toNotation = Helpers.coordsToNotation(move.to[0], move.to[1]);
    
    detailsPopup.innerHTML = `
      <div class="move-details-header">
        <h4>Move ${move.moveNumber}</h4>
        <span class="move-player-badge ${move.player}">${move.player === 'red' ? '红' : '黑'}</span>
      </div>
      <div class="move-details-content">
        <div class="move-notation-large">${move.notation}</div>
        <div class="move-coordinates">
          ${move.piece.type} from ${fromNotation} to ${toNotation}
        </div>
        ${move.capturedPiece ? `<div class="captured-piece">Captured: ${move.capturedPiece.type}</div>` : ''}
        <div class="move-timestamp">${new Date(move.timestamp).toLocaleString()}</div>
      </div>
    `;
    
    // Position popup
    detailsPopup.style.position = 'fixed';
    detailsPopup.style.top = '50%';
    detailsPopup.style.left = '50%';
    detailsPopup.style.transform = 'translate(-50%, -50%)';
    detailsPopup.style.zIndex = '1001';
    detailsPopup.style.background = 'white';
    detailsPopup.style.border = '2px solid #333';
    detailsPopup.style.borderRadius = '8px';
    detailsPopup.style.padding = '20px';
    detailsPopup.style.minWidth = '250px';
    detailsPopup.style.boxShadow = '0 8px 24px rgba(0,0,0,0.3)';
    
    // Auto-hide after delay
    setTimeout(() => {
      if (detailsPopup && document.body.contains(detailsPopup)) {
        detailsPopup.style.opacity = '0';
        setTimeout(() => {
          if (document.body.contains(detailsPopup)) {
            document.body.removeChild(detailsPopup);
          }
        }, 300);
      }
    }, 3000);
    
    // Click to close
    detailsPopup.addEventListener('click', () => {
      if (document.body.contains(detailsPopup)) {
        document.body.removeChild(detailsPopup);
      }
    });
  }

  getPlayerDisplayName(color) {
    return color === 'red' ? 'Red (红)' : 'Black (黑)';
  }

  showGameSummary() {
    const gameState = this.game.getGameState();
    const summary = {
      status: gameState.status,
      winner: gameState.metadata.winner,
      moves: gameState.moveCount,
      duration: Helpers.formatTime(this.game.gameState.getGameDuration()),
      startTime: new Date(gameState.metadata.startTime).toLocaleString(),
      endTime: gameState.metadata.endTime ? new Date(gameState.metadata.endTime).toLocaleString() : null
    };
    
    console.log('Game Summary:', summary);
    return summary;
  }

  exportGameData() {
    return {
      gameId: this.game.gameState.id,
      players: this.game.gameState.players,
      moves: this.game.gameState.exportMoveHistory(),
      result: this.game.gameState.metadata.result,
      winner: this.game.gameState.metadata.winner,
      duration: this.game.gameState.getGameDuration(),
      startTime: this.game.gameState.metadata.startTime,
      endTime: this.game.gameState.metadata.endTime
    };
  }

  reset() {
    this.elements.moveHistory.innerHTML = '';
    this.updateDisplay();
    
    // Remove any popups
    document.querySelectorAll('.move-details-popup').forEach(popup => {
      popup.remove();
    });
  }
}

window.StatusDisplay = StatusDisplay;