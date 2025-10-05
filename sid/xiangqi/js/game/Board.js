class Board {
  constructor() {
    this.grid = this.initializeBoard();
    this.capturedPieces = { red: [], black: [] };
    this.setupInitialPosition();
  }

  initializeBoard() {
    return Array(XIANGQI_CONSTANTS.BOARD_SIZE.ROWS)
      .fill(null)
      .map(() => Array(XIANGQI_CONSTANTS.BOARD_SIZE.COLS).fill(null));
  }

  setupInitialPosition() {
    for (let row = 0; row < XIANGQI_CONSTANTS.BOARD_SIZE.ROWS; row++) {
      for (let col = 0; col < XIANGQI_CONSTANTS.BOARD_SIZE.COLS; col++) {
        const pieceData = XIANGQI_CONSTANTS.INITIAL_BOARD_SETUP[row][col];
        if (pieceData) {
          const piece = new Piece(pieceData.type, pieceData.color, [row, col]);
          this.grid[row][col] = piece;
        }
      }
    }
  }

  getPiece(row, col) {
    if (!Helpers.isWithinBounds(row, col)) {
      return null;
    }
    return this.grid[row][col];
  }

  setPiece(row, col, piece) {
    if (!Helpers.isWithinBounds(row, col)) {
      return false;
    }
    
    this.grid[row][col] = piece;
    if (piece) {
      piece.position = [row, col];
    }
    return true;
  }

  movePiece(from, to) {
    const [fromRow, fromCol] = from;
    const [toRow, toCol] = to;
    
    if (!Helpers.isWithinBounds(fromRow, fromCol) || 
        !Helpers.isWithinBounds(toRow, toCol)) {
      return null;
    }
    
    const piece = this.getPiece(fromRow, fromCol);
    if (!piece) {
      return null;
    }
    
    const capturedPiece = this.getPiece(toRow, toCol);
    
    // Move the piece
    this.setPiece(toRow, toCol, piece);
    this.setPiece(fromRow, fromCol, null);
    piece.hasMoved = true;
    
    // Handle captured piece
    if (capturedPiece) {
      this.capturedPieces[capturedPiece.color].push(capturedPiece);
    }
    
    return {
      piece: piece,
      capturedPiece: capturedPiece,
      from: from,
      to: to
    };
  }

  undoMove(moveData) {
    const { piece, capturedPiece, from, to } = moveData;
    const [fromRow, fromCol] = from;
    const [toRow, toCol] = to;
    
    // Move piece back
    this.setPiece(fromRow, fromCol, piece);
    this.setPiece(toRow, toCol, capturedPiece);
    
    // Restore captured piece if any
    if (capturedPiece) {
      const capturedList = this.capturedPieces[capturedPiece.color];
      const index = capturedList.indexOf(capturedPiece);
      if (index > -1) {
        capturedList.splice(index, 1);
      }
    }
  }

  findPiece(type, color) {
    for (let row = 0; row < XIANGQI_CONSTANTS.BOARD_SIZE.ROWS; row++) {
      for (let col = 0; col < XIANGQI_CONSTANTS.BOARD_SIZE.COLS; col++) {
        const piece = this.grid[row][col];
        if (piece && piece.type === type && piece.color === color) {
          return piece;
        }
      }
    }
    return null;
  }

  findAllPieces(color) {
    const pieces = [];
    for (let row = 0; row < XIANGQI_CONSTANTS.BOARD_SIZE.ROWS; row++) {
      for (let col = 0; col < XIANGQI_CONSTANTS.BOARD_SIZE.COLS; col++) {
        const piece = this.grid[row][col];
        if (piece && piece.color === color) {
          pieces.push(piece);
        }
      }
    }
    return pieces;
  }

  getAllValidMoves(color) {
    const pieces = this.findAllPieces(color);
    const allMoves = [];
    
    for (const piece of pieces) {
      const validMoves = piece.getValidMoves(this);
      for (const move of validMoves) {
        allMoves.push({
          piece: piece,
          from: piece.position,
          to: move
        });
      }
    }
    
    return allMoves;
  }

  isSquareAttacked(row, col, byColor) {
    const attackingPieces = this.findAllPieces(byColor);
    
    for (const piece of attackingPieces) {
      const validMoves = piece.getValidMoves(this);
      if (validMoves.some(([r, c]) => r === row && c === col)) {
        return true;
      }
    }
    
    return false;
  }

  isInCheck(color) {
    const king = this.findPiece('general', color);
    if (!king) {
      return false;
    }
    
    const opponentColor = Helpers.getOpponentColor(color);
    return this.isSquareAttacked(king.position[0], king.position[1], opponentColor);
  }

  isValidMove(from, to, color) {
    const [fromRow, fromCol] = from;
    const [toRow, toCol] = to;
    
    // Basic bounds checking
    if (!Helpers.isWithinBounds(fromRow, fromCol) || 
        !Helpers.isWithinBounds(toRow, toCol)) {
      return false;
    }
    
    const piece = this.getPiece(fromRow, fromCol);
    if (!piece || piece.color !== color) {
      return false;
    }
    
    // Check if the move is valid for the piece
    if (!piece.canMoveTo(to, this)) {
      return false;
    }
    
    // Check if move would put own king in check
    const moveData = this.movePiece(from, to);
    const wouldBeInCheck = this.isInCheck(color);
    this.undoMove(moveData);
    
    return !wouldBeInCheck;
  }

  isCheckmate(color) {
    if (!this.isInCheck(color)) {
      return false;
    }
    
    const allMoves = this.getAllValidMoves(color);
    
    for (const move of allMoves) {
      if (this.isValidMove(move.from, move.to, color)) {
        return false;
      }
    }
    
    return true;
  }

  isStalemate(color) {
    if (this.isInCheck(color)) {
      return false;
    }
    
    const allMoves = this.getAllValidMoves(color);
    
    for (const move of allMoves) {
      if (this.isValidMove(move.from, move.to, color)) {
        return false;
      }
    }
    
    return true;
  }

  clone() {
    const clonedBoard = new Board();
    clonedBoard.grid = this.grid.map(row => 
      row.map(piece => piece ? piece.clone() : null)
    );
    clonedBoard.capturedPieces = {
      red: [...this.capturedPieces.red],
      black: [...this.capturedPieces.black]
    };
    return clonedBoard;
  }

  reset() {
    this.grid = this.initializeBoard();
    this.capturedPieces = { red: [], black: [] };
    this.setupInitialPosition();
  }

  getBoardState() {
    return {
      grid: this.grid.map(row => 
        row.map(piece => piece ? {
          type: piece.type,
          color: piece.color,
          position: piece.position,
          hasMoved: piece.hasMoved
        } : null)
      ),
      capturedPieces: this.capturedPieces
    };
  }

  setBoardState(state) {
    this.grid = state.grid.map((row, rowIndex) => 
      row.map((pieceData, colIndex) => {
        if (pieceData) {
          const piece = new Piece(pieceData.type, pieceData.color, [rowIndex, colIndex]);
          piece.hasMoved = pieceData.hasMoved;
          return piece;
        }
        return null;
      })
    );
    this.capturedPieces = state.capturedPieces;
  }

  toString() {
    let boardStr = '   0 1 2 3 4 5 6 7 8\n';
    for (let row = 0; row < XIANGQI_CONSTANTS.BOARD_SIZE.ROWS; row++) {
      boardStr += row + ' ';
      for (let col = 0; col < XIANGQI_CONSTANTS.BOARD_SIZE.COLS; col++) {
        const piece = this.grid[row][col];
        boardStr += piece ? piece.getChar() : '·';
        boardStr += ' ';
      }
      boardStr += '\n';
    }
    return boardStr;
  }
}

window.Board = Board;