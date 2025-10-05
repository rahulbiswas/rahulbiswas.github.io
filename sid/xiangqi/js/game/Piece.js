class Piece {
  constructor(type, color, position) {
    this.type = type;
    this.color = color;
    this.position = position;
    this.hasMoved = false;
  }

  getChar() {
    return Helpers.getPieceChar(this.type, this.color);
  }

  getValue() {
    return Helpers.getPieceValue(this.type, this.color);
  }

  getValidMoves(board) {
    switch (this.type) {
      case 'general':
        return this.getGeneralMoves(board);
      case 'advisor':
        return this.getAdvisorMoves(board);
      case 'elephant':
        return this.getElephantMoves(board);
      case 'horse':
        return this.getHorseMoves(board);
      case 'chariot':
        return this.getChariotMoves(board);
      case 'cannon':
        return this.getCannonMoves(board);
      case 'soldier':
        return this.getSoldierMoves(board);
      default:
        return [];
    }
  }

  getGeneralMoves(board) {
    let moves = [];
    const [row, col] = this.position;
    
    for (const [dr, dc] of XIANGQI_CONSTANTS.MOVE_DIRECTIONS.ORTHOGONAL) {
      const newRow = row + dr;
      const newCol = col + dc;
      
      if (Helpers.isInPalace(newRow, newCol, this.color)) {
        const targetPiece = board.getPiece(newRow, newCol);
        if (!targetPiece || targetPiece.color !== this.color) {
          moves.push([newRow, newCol]);
        }
      }
    }

    // Check for Flying General rule
    const opponentGeneral = board.findPiece('general', Helpers.getOpponentColor(this.color));
    if (opponentGeneral && opponentGeneral.position[1] === col) {
      // Check if there are any pieces between the generals
      const startRow = Math.min(row, opponentGeneral.position[0]) + 1;
      const endRow = Math.max(row, opponentGeneral.position[0]);
      let piecesInBetween = 0;
      
      for (let r = startRow; r < endRow; r++) {
        if (board.getPiece(r, col)) {
          piecesInBetween++;
        }
      }
      
      // Filter out moves that would put generals on the same file with no pieces between
      moves = moves.filter(([moveRow, moveCol]) => {
        if (moveCol !== col) return true;
        
        const newStartRow = Math.min(moveRow, opponentGeneral.position[0]) + 1;
        const newEndRow = Math.max(moveRow, opponentGeneral.position[0]);
        let newPiecesInBetween = 0;
        
        for (let r = newStartRow; r < newEndRow; r++) {
          if (r === row) continue; // Skip current position
          if (board.getPiece(r, col)) {
            newPiecesInBetween++;
          }
        }
        
        return newPiecesInBetween > 0;
      });
    }
    
    return moves;
  }

  getAdvisorMoves(board) {
    const moves = [];
    const [row, col] = this.position;
    
    for (const [dr, dc] of XIANGQI_CONSTANTS.MOVE_DIRECTIONS.DIAGONAL) {
      const newRow = row + dr;
      const newCol = col + dc;
      
      if (Helpers.isInPalace(newRow, newCol, this.color)) {
        const targetPiece = board.getPiece(newRow, newCol);
        if (!targetPiece || targetPiece.color !== this.color) {
          moves.push([newRow, newCol]);
        }
      }
    }
    
    return moves;
  }

  getElephantMoves(board) {
    const moves = [];
    const [row, col] = this.position;
    
    for (const { block, dest } of XIANGQI_CONSTANTS.ELEPHANT_MOVES) {
      const blockRow = row + block[0];
      const blockCol = col + block[1];
      const destRow = row + dest[0];
      const destCol = col + dest[1];
      
      // Check if blocking position is within bounds and not occupied
      if (Helpers.isWithinBounds(blockRow, blockCol) && !board.getPiece(blockRow, blockCol)) {
        // Check if destination is within bounds, on own side, and not occupied by own piece
        if (Helpers.isWithinBounds(destRow, destCol) && 
            Helpers.isOnOwnSide(destRow, this.color)) {
          const targetPiece = board.getPiece(destRow, destCol);
          if (!targetPiece || targetPiece.color !== this.color) {
            moves.push([destRow, destCol]);
          }
        }
      }
    }
    
    return moves;
  }

  getHorseMoves(board) {
    const moves = [];
    const [row, col] = this.position;
    
    for (const { block, dest } of XIANGQI_CONSTANTS.HORSE_MOVES) {
      const blockRow = row + block[0];
      const blockCol = col + block[1];
      const destRow = row + dest[0];
      const destCol = col + dest[1];
      
      // Check if blocking position is within bounds and not occupied
      if (Helpers.isWithinBounds(blockRow, blockCol) && !board.getPiece(blockRow, blockCol)) {
        // Check if destination is within bounds
        if (Helpers.isWithinBounds(destRow, destCol)) {
          const targetPiece = board.getPiece(destRow, destCol);
          if (!targetPiece || targetPiece.color !== this.color) {
            moves.push([destRow, destCol]);
          }
        }
      }
    }
    
    return moves;
  }

  getChariotMoves(board) {
    const moves = [];
    const [row, col] = this.position;
    
    for (const [dr, dc] of XIANGQI_CONSTANTS.MOVE_DIRECTIONS.ORTHOGONAL) {
      let r = row + dr;
      let c = col + dc;
      
      while (Helpers.isWithinBounds(r, c)) {
        const piece = board.getPiece(r, c);
        if (piece) {
          if (piece.color !== this.color) {
            moves.push([r, c]);
          }
          break;
        }
        moves.push([r, c]);
        r += dr;
        c += dc;
      }
    }
    
    return moves;
  }

  getCannonMoves(board) {
    const moves = [];
    const [row, col] = this.position;
    
    for (const [dr, dc] of XIANGQI_CONSTANTS.MOVE_DIRECTIONS.ORTHOGONAL) {
      // Normal moves (no jumping)
      let r = row + dr;
      let c = col + dc;
      
      while (Helpers.isWithinBounds(r, c) && !board.getPiece(r, c)) {
        moves.push([r, c]);
        r += dr;
        c += dc;
      }
      
      // Capture moves (with jumping)
      if (Helpers.isWithinBounds(r, c) && board.getPiece(r, c)) {
        // Found the jumping piece, continue to look for capture targets
        r += dr;
        c += dc;
        
        while (Helpers.isWithinBounds(r, c)) {
          const piece = board.getPiece(r, c);
          if (piece) {
            if (piece.color !== this.color) {
              moves.push([r, c]);
            }
            break;
          }
          r += dr;
          c += dc;
        }
      }
    }
    
    return moves;
  }

  getSoldierMoves(board) {
    const moves = [];
    const [row, col] = this.position;
    
    // Determine forward direction based on color
    const forwardDir = this.color === XIANGQI_CONSTANTS.COLORS.RED ? -1 : 1;
    
    // Check if soldier has crossed the river
    const hasNotivedRiver = Helpers.hasRiverBetween(
      this.color === XIANGQI_CONSTANTS.COLORS.RED ? 6 : 3, 
      row
    );
    
    // Forward move
    const forwardRow = row + forwardDir;
    if (Helpers.isWithinBounds(forwardRow, col)) {
      const targetPiece = board.getPiece(forwardRow, col);
      if (!targetPiece || targetPiece.color !== this.color) {
        moves.push([forwardRow, col]);
      }
    }
    
    // Sideways moves (only if crossed river)
    if (hasNotivedRiver) {
      for (const sideCol of [col - 1, col + 1]) {
        if (Helpers.isWithinBounds(row, sideCol)) {
          const targetPiece = board.getPiece(row, sideCol);
          if (!targetPiece || targetPiece.color !== this.color) {
            moves.push([row, sideCol]);
          }
        }
      }
    }
    
    return moves;
  }

  canMoveTo(position, board) {
    const validMoves = this.getValidMoves(board);
    return validMoves.some(([r, c]) => r === position[0] && c === position[1]);
  }

  clone() {
    const clonedPiece = new Piece(this.type, this.color, [...this.position]);
    clonedPiece.hasMoved = this.hasMoved;
    return clonedPiece;
  }

  toString() {
    return `${this.color} ${this.type} at [${this.position[0]}, ${this.position[1]}]`;
  }
}

window.Piece = Piece;