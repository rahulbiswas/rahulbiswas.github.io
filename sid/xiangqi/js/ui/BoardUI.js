class BoardUI {
  constructor(game, boardElement) {
    this.game = game;
    this.boardElement = boardElement;
    this.selectedPiece = null;
    this.validMoves = [];
    this.isInteractionEnabled = true;
    
    this.setupBoard();
    this.setupEventListeners();
  }

  setupBoard() {
    this.boardElement.innerHTML = '';
    
    // Create board lines
    this.createBoardLines();
    
    // Create river
    this.createRiver();
    
    // Create palace markers
    this.createPalaceMarkers();
    
    // Create intersections
    this.createIntersections();
    
    // Render pieces
    this.renderPieces();
  }

  createBoardLines() {
    // Horizontal lines
    for (let row = 0; row <= XIANGQI_CONSTANTS.BOARD_SIZE.ROWS; row++) {
      const line = document.createElement('div');
      line.className = 'board-line horizontal-line';
      line.style.top = `${(row / XIANGQI_CONSTANTS.BOARD_SIZE.ROWS) * 100}%`;
      
      // Skip middle horizontal lines in the river area for palace connections
      if (row > 0 && row < XIANGQI_CONSTANTS.BOARD_SIZE.ROWS) {
        line.style.left = '0%';
        line.style.width = '100%';
      }
      
      this.boardElement.appendChild(line);
    }

    // Vertical lines
    for (let col = 0; col <= XIANGQI_CONSTANTS.BOARD_SIZE.COLS; col++) {
      const line = document.createElement('div');
      line.className = 'board-line vertical-line';
      line.style.left = `${(col / XIANGQI_CONSTANTS.BOARD_SIZE.COLS) * 100}%`;
      
      // Full height for edge lines and center line
      if (col === 0 || col === XIANGQI_CONSTANTS.BOARD_SIZE.COLS || col === 4) {
        line.style.top = '0%';
        line.style.height = '100%';
      } else {
        // Split lines for river
        const topLine = line.cloneNode();
        topLine.style.top = '0%';
        topLine.style.height = '45%';
        this.boardElement.appendChild(topLine);
        
        line.style.top = '55%';
        line.style.height = '45%';
      }
      
      this.boardElement.appendChild(line);
    }
  }

  createRiver() {
    const river = document.createElement('div');
    river.className = 'river';
    this.boardElement.appendChild(river);
  }

  createPalaceMarkers() {
    // Red palace diagonal lines
    this.createPalaceDiagonal(7, 3, 9, 5, 'red');
    
    // Black palace diagonal lines
    this.createPalaceDiagonal(0, 3, 2, 5, 'black');
  }

  createPalaceDiagonal(startRow, startCol, endRow, endCol, color) {
    // Create diagonal lines for palace
    const diagonal1 = document.createElement('div');
    diagonal1.className = `palace-diagonal ${color}-palace`;
    diagonal1.style.position = 'absolute';
    diagonal1.style.background = '#8B4513';
    diagonal1.style.height = '2px';
    diagonal1.style.transformOrigin = 'left center';
    
    const startX = (startCol / XIANGQI_CONSTANTS.BOARD_SIZE.COLS) * 100;
    const startY = (startRow / XIANGQI_CONSTANTS.BOARD_SIZE.ROWS) * 100;
    const endX = (endCol / XIANGQI_CONSTANTS.BOARD_SIZE.COLS) * 100;
    const endY = (endRow / XIANGQI_CONSTANTS.BOARD_SIZE.ROWS) * 100;
    
    const width = Math.sqrt((endX - startX) ** 2 + (endY - startY) ** 2);
    const angle = Math.atan2(endY - startY, endX - startX) * 180 / Math.PI;
    
    diagonal1.style.left = `${startX}%`;
    diagonal1.style.top = `${startY}%`;
    diagonal1.style.width = `${width}%`;
    diagonal1.style.transform = `rotate(${angle}deg)`;
    
    this.boardElement.appendChild(diagonal1);

    // Create the other diagonal
    const diagonal2 = diagonal1.cloneNode();
    const startX2 = (endCol / XIANGQI_CONSTANTS.BOARD_SIZE.COLS) * 100;
    const endX2 = (startCol / XIANGQI_CONSTANTS.BOARD_SIZE.COLS) * 100;
    const angle2 = Math.atan2(endY - startY, endX2 - startX2) * 180 / Math.PI;
    
    diagonal2.style.left = `${startX2}%`;
    diagonal2.style.transform = `rotate(${angle2}deg)`;
    
    this.boardElement.appendChild(diagonal2);
  }

  createIntersections() {
    for (let row = 0; row < XIANGQI_CONSTANTS.BOARD_SIZE.ROWS; row++) {
      for (let col = 0; col < XIANGQI_CONSTANTS.BOARD_SIZE.COLS; col++) {
        const intersection = document.createElement('div');
        intersection.className = 'intersection';
        intersection.dataset.row = row;
        intersection.dataset.col = col;
        
        intersection.style.gridColumn = col + 1;
        intersection.style.gridRow = row + 1;
        
        this.boardElement.appendChild(intersection);
      }
    }
  }

  renderPieces() {
    // Clear existing pieces
    this.boardElement.querySelectorAll('.piece').forEach(piece => piece.remove());
    
    for (let row = 0; row < XIANGQI_CONSTANTS.BOARD_SIZE.ROWS; row++) {
      for (let col = 0; col < XIANGQI_CONSTANTS.BOARD_SIZE.COLS; col++) {
        const piece = this.game.getPiece(row, col);
        if (piece) {
          this.createPieceElement(piece, row, col);
        }
      }
    }
  }

  createPieceElement(piece, row, col) {
    const pieceElement = document.createElement('div');
    pieceElement.className = `piece ${piece.color}-piece`;
    pieceElement.textContent = piece.getChar();
    pieceElement.dataset.row = row;
    pieceElement.dataset.col = col;
    pieceElement.dataset.type = piece.type;
    pieceElement.dataset.color = piece.color;
    
    // Position the piece
    pieceElement.style.gridColumn = col + 1;
    pieceElement.style.gridRow = row + 1;
    
    // Add interaction events
    if (this.isInteractionEnabled) {
      pieceElement.addEventListener('click', this.handlePieceClick.bind(this));
      pieceElement.addEventListener('touchstart', this.handlePieceClick.bind(this));
    }
    
    this.boardElement.appendChild(pieceElement);
    
    return pieceElement;
  }

  handlePieceClick(event) {
    event.preventDefault();
    
    if (!this.isInteractionEnabled) return;
    
    const pieceElement = event.currentTarget;
    const row = parseInt(pieceElement.dataset.row);
    const col = parseInt(pieceElement.dataset.col);
    const piece = this.game.getPiece(row, col);
    
    if (!piece) return;
    
    // If clicking on a piece of the current player
    if (piece.color === this.game.getCurrentPlayer()) {
      this.selectPiece(row, col);
    } 
    // If clicking on an opponent's piece while having a piece selected
    else if (this.selectedPiece && this.isValidMoveTarget(row, col)) {
      this.attemptMove(this.selectedPiece, [row, col]);
    }
  }

  selectPiece(row, col) {
    // Clear previous selection
    this.clearSelection();
    
    const piece = this.game.getPiece(row, col);
    if (!piece || piece.color !== this.game.getCurrentPlayer()) {
      return;
    }
    
    this.selectedPiece = [row, col];
    this.validMoves = this.game.getValidMoves([row, col]);
    
    // Highlight selected piece
    const pieceElement = this.getPieceElement(row, col);
    if (pieceElement) {
      pieceElement.classList.add('selected');
    }
    
    // Show valid moves
    this.showValidMoves();
  }

  showValidMoves() {
    if (!this.game.getSettings().showValidMoves) return;
    
    for (const [row, col] of this.validMoves) {
      const intersection = this.getIntersectionElement(row, col);
      if (intersection) {
        const targetPiece = this.game.getPiece(row, col);
        
        if (targetPiece) {
          intersection.classList.add('valid-capture');
        } else {
          intersection.classList.add('valid-move');
        }
        
        // Add click handler for empty intersections
        if (!targetPiece) {
          intersection.addEventListener('click', this.handleIntersectionClick.bind(this));
        }
      }
    }
  }

  handleIntersectionClick(event) {
    const intersection = event.currentTarget;
    const row = parseInt(intersection.dataset.row);
    const col = parseInt(intersection.dataset.col);
    
    if (this.selectedPiece && this.isValidMoveTarget(row, col)) {
      this.attemptMove(this.selectedPiece, [row, col]);
    }
  }

  isValidMoveTarget(row, col) {
    return this.validMoves.some(([r, c]) => r === row && c === col);
  }

  attemptMove(from, to) {
    const result = this.game.makeMove(from, to);
    
    if (result.success) {
      this.clearSelection();
      this.renderPieces();
      
      // Highlight the last move
      this.highlightLastMove(from, to);
      
      // Update check state visual
      this.updateCheckVisual();
    } else {
      Helpers.showNotification(result.error, 'error');
    }
  }

  highlightLastMove(from, to) {
    // Remove previous move highlights
    this.boardElement.querySelectorAll('.last-move-from, .last-move-to')
      .forEach(el => el.classList.remove('last-move-from', 'last-move-to'));
    
    // Highlight from position
    const fromIntersection = this.getIntersectionElement(from[0], from[1]);
    if (fromIntersection) {
      fromIntersection.classList.add('last-move-from');
    }
    
    // Highlight to position
    const toIntersection = this.getIntersectionElement(to[0], to[1]);
    if (toIntersection) {
      toIntersection.classList.add('last-move-to');
    }
  }

  updateCheckVisual() {
    // Remove previous check highlights
    this.boardElement.querySelectorAll('.in-check')
      .forEach(el => el.classList.remove('in-check'));
    
    // Highlight king if in check
    const currentPlayer = this.game.getCurrentPlayer();
    if (this.game.isInCheck(currentPlayer)) {
      const king = this.game.board.findPiece('general', currentPlayer);
      if (king) {
        const kingElement = this.getPieceElement(king.position[0], king.position[1]);
        if (kingElement) {
          kingElement.classList.add('in-check');
        }
      }
    }
  }

  clearSelection() {
    // Clear selected piece
    this.boardElement.querySelectorAll('.selected')
      .forEach(el => el.classList.remove('selected'));
    
    // Clear valid move highlights
    this.boardElement.querySelectorAll('.valid-move, .valid-capture')
      .forEach(el => {
        el.classList.remove('valid-move', 'valid-capture');
        el.removeEventListener('click', this.handleIntersectionClick);
      });
    
    this.selectedPiece = null;
    this.validMoves = [];
  }

  getPieceElement(row, col) {
    return this.boardElement.querySelector(`.piece[data-row="${row}"][data-col="${col}"]`);
  }

  getIntersectionElement(row, col) {
    return this.boardElement.querySelector(`.intersection[data-row="${row}"][data-col="${col}"]`);
  }

  enableInteraction() {
    this.isInteractionEnabled = true;
    this.boardElement.classList.remove('disabled');
  }

  disableInteraction() {
    this.isInteractionEnabled = false;
    this.clearSelection();
    this.boardElement.classList.add('disabled');
  }

  setupEventListeners() {
    // Listen for game events
    this.game.on('moveMade', () => {
      this.renderPieces();
      this.updateCheckVisual();
    });
    
    this.game.on('moveUndone', () => {
      this.renderPieces();
      this.updateCheckVisual();
    });
    
    this.game.on('gameStarted', () => {
      this.renderPieces();
      this.clearSelection();
    });
    
    this.game.on('gameEnded', () => {
      this.disableInteraction();
    });
    
    // Handle window resize for responsive design
    window.addEventListener('resize', Helpers.debounce(() => {
      this.setupBoard();
    }, 250));
  }

  animateMove(from, to, callback) {
    const fromPiece = this.getPieceElement(from[0], from[1]);
    if (!fromPiece) {
      if (callback) callback();
      return;
    }
    
    const fromRect = fromPiece.getBoundingClientRect();
    const toIntersection = this.getIntersectionElement(to[0], to[1]);
    const toRect = toIntersection.getBoundingClientRect();
    
    const deltaX = toRect.left - fromRect.left;
    const deltaY = toRect.top - fromRect.top;
    
    fromPiece.style.transition = 'transform 0.3s ease';
    fromPiece.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
    fromPiece.style.zIndex = '1000';
    
    setTimeout(() => {
      fromPiece.style.transition = '';
      fromPiece.style.transform = '';
      fromPiece.style.zIndex = '';
      if (callback) callback();
    }, 300);
  }

  reset() {
    this.clearSelection();
    this.renderPieces();
    this.enableInteraction();
  }

  destroy() {
    this.clearSelection();
    this.boardElement.innerHTML = '';
    
    // Remove event listeners
    window.removeEventListener('resize', this.setupBoard);
  }
}

window.BoardUI = BoardUI;