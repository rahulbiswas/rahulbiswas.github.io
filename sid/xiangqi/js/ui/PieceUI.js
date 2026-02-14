class PieceUI {
  constructor(game) {
    this.game = game;
    this.capturedElements = {
      red: document.getElementById('red-captured'),
      black: document.getElementById('black-captured')
    };
    
    this.setupEventListeners();
  }

  updateCapturedPieces() {
    const boardState = this.game.getBoardState();
    
    // Update red captured pieces
    this.renderCapturedPieces(
      boardState.capturedPieces.red,
      this.capturedElements.red.querySelector('.captured-list')
    );
    
    // Update black captured pieces
    this.renderCapturedPieces(
      boardState.capturedPieces.black,
      this.capturedElements.black.querySelector('.captured-list')
    );
  }

  renderCapturedPieces(capturedPieces, container) {
    if (!container) return;
    
    container.innerHTML = '';
    
    // Group pieces by type
    const groupedPieces = this.groupPiecesByType(capturedPieces);
    
    for (const [type, pieces] of Object.entries(groupedPieces)) {
      for (let i = 0; i < pieces.length; i++) {
        const piece = pieces[i];
        const capturedPieceElement = this.createCapturedPieceElement(piece);
        container.appendChild(capturedPieceElement);
      }
    }
  }

  groupPiecesByType(pieces) {
    const grouped = {};
    
    for (const piece of pieces) {
      if (!grouped[piece.type]) {
        grouped[piece.type] = [];
      }
      grouped[piece.type].push(piece);
    }
    
    return grouped;
  }

  createCapturedPieceElement(piece) {
    const element = document.createElement('div');
    element.className = `captured-piece ${piece.color}-piece`;
    element.textContent = piece.getChar();
    element.title = `${piece.color} ${piece.type}`;
    
    // Add animation when piece is captured
    element.style.opacity = '0';
    element.style.transform = 'scale(0.5)';
    
    requestAnimationFrame(() => {
      element.style.transition = 'all 0.3s ease';
      element.style.opacity = '0.7';
      element.style.transform = 'scale(1)';
    });
    
    return element;
  }

  animatePieceCapture(piece, fromPosition) {
    // Create a temporary piece element that animates to the captured area
    const tempPiece = document.createElement('div');
    tempPiece.className = `piece ${piece.color}-piece captured-animation`;
    tempPiece.textContent = piece.getChar();
    tempPiece.style.position = 'fixed';
    tempPiece.style.zIndex = '1001';
    tempPiece.style.pointerEvents = 'none';
    
    // Position at the original board position
    const boardElement = document.getElementById('game-board');
    const intersection = boardElement.querySelector(`[data-row="${fromPosition[0]}"][data-col="${fromPosition[1]}"]`);
    
    if (intersection) {
      const rect = intersection.getBoundingClientRect();
      tempPiece.style.left = `${rect.left + rect.width / 2 - 22.5}px`;
      tempPiece.style.top = `${rect.top + rect.height / 2 - 22.5}px`;
    }
    
    document.body.appendChild(tempPiece);
    
    // Animate to captured pieces area
    const targetContainer = this.capturedElements[piece.color].querySelector('.captured-list');
    if (targetContainer) {
      const targetRect = targetContainer.getBoundingClientRect();
      
      requestAnimationFrame(() => {
        tempPiece.style.transition = 'all 0.6s ease';
        tempPiece.style.left = `${targetRect.right - 30}px`;
        tempPiece.style.top = `${targetRect.top + 10}px`;
        tempPiece.style.transform = 'scale(0.7)';
        tempPiece.style.opacity = '0.7';
        
        setTimeout(() => {
          document.body.removeChild(tempPiece);
          this.updateCapturedPieces();
        }, 600);
      });
    } else {
      // Fallback - just remove after delay
      setTimeout(() => {
        document.body.removeChild(tempPiece);
        this.updateCapturedPieces();
      }, 300);
    }
  }

  createPiecePreview(type, color, size = 'normal') {
    const preview = document.createElement('div');
    preview.className = `piece-preview ${color}-piece ${size}`;
    
    const char = Helpers.getPieceChar(type, color);
    preview.textContent = char;
    preview.title = `${color} ${type}`;
    
    return preview;
  }

  showPieceInformation(piece, position) {
    const info = document.createElement('div');
    info.className = 'piece-info-popup';
    info.innerHTML = `
      <div class="piece-info-header">
        <span class="piece-char ${piece.color}-piece">${piece.getChar()}</span>
        <span class="piece-name">${piece.color} ${piece.type}</span>
      </div>
      <div class="piece-info-details">
        <div>Position: ${Helpers.coordsToNotation(position[0], position[1])}</div>
        <div>Value: ${piece.getValue()}</div>
        <div>Has moved: ${piece.hasMoved ? 'Yes' : 'No'}</div>
      </div>
      <div class="piece-info-moves">
        Valid moves: ${this.game.getValidMoves(position).length}
      </div>
    `;
    
    // Position the popup
    info.style.position = 'fixed';
    info.style.zIndex = '1002';
    info.style.background = 'white';
    info.style.border = '2px solid #333';
    info.style.borderRadius = '8px';
    info.style.padding = '15px';
    info.style.boxShadow = '0 4px 12px rgba(0,0,0,0.3)';
    info.style.maxWidth = '200px';
    
    document.body.appendChild(info);
    
    // Auto-remove after delay
    setTimeout(() => {
      if (document.body.contains(info)) {
        document.body.removeChild(info);
      }
    }, 3000);
    
    return info;
  }

  highlightThreatenedPieces() {
    // Remove previous threat highlights
    document.querySelectorAll('.threatened').forEach(el => {
      el.classList.remove('threatened');
    });
    
    const currentPlayer = this.game.getCurrentPlayer();
    const opponentColor = Helpers.getOpponentColor(currentPlayer);
    
    // Find pieces that are under attack
    const threatenedPieces = [];
    
    for (let row = 0; row < XIANGQI_CONSTANTS.BOARD_SIZE.ROWS; row++) {
      for (let col = 0; col < XIANGQI_CONSTANTS.BOARD_SIZE.COLS; col++) {
        const piece = this.game.getPiece(row, col);
        if (piece && piece.color === currentPlayer) {
          if (this.game.board.isSquareAttacked(row, col, opponentColor)) {
            threatenedPieces.push({ piece, position: [row, col] });
          }
        }
      }
    }
    
    // Highlight threatened pieces
    for (const { piece, position } of threatenedPieces) {
      const boardElement = document.getElementById('game-board');
      const pieceElement = boardElement.querySelector(`[data-row="${position[0]}"][data-col="${position[1]}"]`);
      if (pieceElement && pieceElement.classList.contains('piece')) {
        pieceElement.classList.add('threatened');
      }
    }
    
    return threatenedPieces;
  }

  showPieceValue() {
    // Calculate total piece values for both sides
    let redValue = 0;
    let blackValue = 0;
    
    const boardState = this.game.getBoardState();
    
    // Count pieces on board
    for (let row = 0; row < XIANGQI_CONSTANTS.BOARD_SIZE.ROWS; row++) {
      for (let col = 0; col < XIANGQI_CONSTANTS.BOARD_SIZE.COLS; col++) {
        const piece = this.game.getPiece(row, col);
        if (piece) {
          if (piece.color === 'red') {
            redValue += piece.getValue();
          } else {
            blackValue += piece.getValue();
          }
        }
      }
    }
    
    // Update UI with material advantage
    const materialAdvantage = redValue - blackValue;
    let advantageText = '';
    
    if (materialAdvantage > 0) {
      advantageText = `Red +${materialAdvantage}`;
    } else if (materialAdvantage < 0) {
      advantageText = `Black +${Math.abs(materialAdvantage)}`;
    } else {
      advantageText = 'Equal';
    }
    
    // Display in game status or create a material indicator
    const statusElement = document.getElementById('game-status');
    if (statusElement) {
      const materialDisplay = statusElement.querySelector('.material-advantage') || 
                             document.createElement('span');
      materialDisplay.className = 'material-advantage';
      materialDisplay.textContent = ` (${advantageText})`;
      
      if (!statusElement.querySelector('.material-advantage')) {
        statusElement.appendChild(materialDisplay);
      }
    }
  }

  setupEventListeners() {
    this.game.on('moveMade', (data) => {
      if (data.moveData.capturedPiece) {
        this.animatePieceCapture(data.moveData.capturedPiece, data.moveData.to);
      }
      this.showPieceValue();
    });
    
    this.game.on('moveUndone', () => {
      this.updateCapturedPieces();
      this.showPieceValue();
    });
    
    this.game.on('gameStarted', () => {
      this.updateCapturedPieces();
      this.showPieceValue();
    });
    
    this.game.on('gameLoaded', () => {
      this.updateCapturedPieces();
      this.showPieceValue();
    });
  }

  reset() {
    // Clear captured pieces displays
    Object.values(this.capturedElements).forEach(container => {
      const capturedList = container.querySelector('.captured-list');
      if (capturedList) {
        capturedList.innerHTML = '';
      }
    });
    
    // Remove any piece info popups
    document.querySelectorAll('.piece-info-popup').forEach(popup => {
      popup.remove();
    });
    
    // Clear material advantage display
    const materialDisplays = document.querySelectorAll('.material-advantage');
    materialDisplays.forEach(display => display.remove());
  }
}

window.PieceUI = PieceUI;