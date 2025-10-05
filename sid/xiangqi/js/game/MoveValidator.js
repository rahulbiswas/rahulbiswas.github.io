class MoveValidator {
  constructor(board) {
    this.board = board;
  }

  isValidMove(from, to, color) {
    const [fromRow, fromCol] = from;
    const [toRow, toCol] = to;
    
    // Basic validation
    if (!this.basicValidation(from, to, color)) {
      return false;
    }
    
    const piece = this.board.getPiece(fromRow, fromCol);
    
    // Piece-specific validation
    if (!this.pieceSpecificValidation(from, to, piece)) {
      return false;
    }
    
    // Check validation (ensure move doesn't put own king in check)
    if (!this.checkValidation(from, to, color)) {
      return false;
    }
    
    return true;
  }

  basicValidation(from, to, color) {
    const [fromRow, fromCol] = from;
    const [toRow, toCol] = to;
    
    // Check bounds
    if (!Helpers.isWithinBounds(fromRow, fromCol) || 
        !Helpers.isWithinBounds(toRow, toCol)) {
      return false;
    }
    
    // Check if moving to same position
    if (fromRow === toRow && fromCol === toCol) {
      return false;
    }
    
    // Check if there's a piece at the starting position
    const piece = this.board.getPiece(fromRow, fromCol);
    if (!piece) {
      return false;
    }
    
    // Check piece ownership
    if (piece.color !== color) {
      return false;
    }
    
    // Check if destination has own piece
    const targetPiece = this.board.getPiece(toRow, toCol);
    if (targetPiece && targetPiece.color === color) {
      return false;
    }
    
    return true;
  }

  pieceSpecificValidation(from, to, piece) {
    return piece.canMoveTo(to, this.board);
  }

  checkValidation(from, to, color) {
    // Temporarily make the move
    const moveData = this.board.movePiece(from, to);
    
    // Check if this move puts own king in check
    const isInCheck = this.board.isInCheck(color);
    
    // Undo the move
    this.board.undoMove(moveData);
    
    return !isInCheck;
  }

  getValidMoves(from, color) {
    const piece = this.board.getPiece(from[0], from[1]);
    if (!piece || piece.color !== color) {
      return [];
    }
    
    const potentialMoves = piece.getValidMoves(this.board);
    const validMoves = [];
    
    for (const move of potentialMoves) {
      if (this.isValidMove(from, move, color)) {
        validMoves.push(move);
      }
    }
    
    return validMoves;
  }

  findCheckingPieces(color) {
    const king = this.board.findPiece('general', color);
    if (!king) {
      return [];
    }
    
    const opponentColor = Helpers.getOpponentColor(color);
    const opponentPieces = this.board.findAllPieces(opponentColor);
    const checkingPieces = [];
    
    for (const piece of opponentPieces) {
      const validMoves = piece.getValidMoves(this.board);
      if (validMoves.some(([r, c]) => r === king.position[0] && c === king.position[1])) {
        checkingPieces.push(piece);
      }
    }
    
    return checkingPieces;
  }

  canBlockCheck(color) {
    const checkingPieces = this.findCheckingPieces(color);
    if (checkingPieces.length === 0 || checkingPieces.length > 1) {
      return false; // No check or double check
    }
    
    const checkingPiece = checkingPieces[0];
    const king = this.board.findPiece('general', color);
    const blockingSquares = this.getSquaresBetween(checkingPiece.position, king.position);
    
    const ownPieces = this.board.findAllPieces(color);
    
    for (const piece of ownPieces) {
      if (piece.type === 'general') continue; // King can't block
      
      const validMoves = piece.getValidMoves(this.board);
      for (const move of validMoves) {
        if (blockingSquares.some(([r, c]) => r === move[0] && c === move[1]) ||
            (move[0] === checkingPiece.position[0] && move[1] === checkingPiece.position[1])) {
          if (this.isValidMove(piece.position, move, color)) {
            return true;
          }
        }
      }
    }
    
    return false;
  }

  getSquaresBetween(from, to) {
    const [fromRow, fromCol] = from;
    const [toRow, toCol] = to;
    const squares = [];
    
    if (fromRow === toRow) {
      // Horizontal line
      const minCol = Math.min(fromCol, toCol);
      const maxCol = Math.max(fromCol, toCol);
      for (let col = minCol + 1; col < maxCol; col++) {
        squares.push([fromRow, col]);
      }
    } else if (fromCol === toCol) {
      // Vertical line
      const minRow = Math.min(fromRow, toRow);
      const maxRow = Math.max(fromRow, toRow);
      for (let row = minRow + 1; row < maxRow; row++) {
        squares.push([row, fromCol]);
      }
    } else if (Math.abs(fromRow - toRow) === Math.abs(fromCol - toCol)) {
      // Diagonal line (for elephant moves, etc.)
      const rowDir = toRow > fromRow ? 1 : -1;
      const colDir = toCol > fromCol ? 1 : -1;
      let row = fromRow + rowDir;
      let col = fromCol + colDir;
      
      while (row !== toRow && col !== toCol) {
        squares.push([row, col]);
        row += rowDir;
        col += colDir;
      }
    }
    
    return squares;
  }

  isMoveLegal(from, to, color) {
    // This is the main public method to check if a move is completely legal
    return this.isValidMove(from, to, color);
  }

  getAllLegalMoves(color) {
    const pieces = this.board.findAllPieces(color);
    const legalMoves = [];
    
    for (const piece of pieces) {
      const validMoves = this.getValidMoves(piece.position, color);
      for (const move of validMoves) {
        legalMoves.push({
          piece: piece,
          from: piece.position,
          to: move
        });
      }
    }
    
    return legalMoves;
  }

  hasLegalMoves(color) {
    return this.getAllLegalMoves(color).length > 0;
  }

  isCheckmate(color) {
    return this.board.isInCheck(color) && !this.hasLegalMoves(color);
  }

  isStalemate(color) {
    return !this.board.isInCheck(color) && !this.hasLegalMoves(color);
  }

  wouldBeCheck(from, to, color) {
    // Check if making this move would put the player in check
    const moveData = this.board.movePiece(from, to);
    const wouldBeInCheck = this.board.isInCheck(color);
    this.board.undoMove(moveData);
    return wouldBeInCheck;
  }

  wouldBeCheckmate(from, to, opponentColor) {
    // Check if making this move would put the opponent in checkmate
    const moveData = this.board.movePiece(from, to);
    const wouldBeCheckmate = this.isCheckmate(opponentColor);
    this.board.undoMove(moveData);
    return wouldBeCheckmate;
  }

  evaluateMove(from, to, color) {
    // Evaluate the quality of a move (for AI purposes)
    const piece = this.board.getPiece(from[0], from[1]);
    const targetPiece = this.board.getPiece(to[0], to[1]);
    
    let score = 0;
    
    // Basic piece value for captures
    if (targetPiece) {
      score += targetPiece.getValue();
    }
    
    // Penalty for putting own piece in danger
    const moveData = this.board.movePiece(from, to);
    const opponentColor = Helpers.getOpponentColor(color);
    
    if (this.board.isSquareAttacked(to[0], to[1], opponentColor)) {
      score -= piece.getValue() * 0.5;
    }
    
    // Bonus for checking the opponent
    if (this.board.isInCheck(opponentColor)) {
      score += 50;
    }
    
    // Bonus for checkmate
    if (this.isCheckmate(opponentColor)) {
      score += 10000;
    }
    
    this.board.undoMove(moveData);
    
    return score;
  }
}

window.MoveValidator = MoveValidator;