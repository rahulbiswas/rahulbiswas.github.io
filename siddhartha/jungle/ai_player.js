class AIPlayer {
  PIECE_VALUES = {
    [PIECES.RAT]: 2,
    [PIECES.CAT]: 2,
    [PIECES.DOG]: 3,
    [PIECES.WOLF]: 4,
    [PIECES.LEOPARD]: 5,
    [PIECES.TIGER]: 8,
    [PIECES.LION]: 8,
    [PIECES.ELEPHANT]: 7
  };

  evaluatePosition(pieces, player) {
    let score = 0;
    
    Object.entries(pieces).forEach(([pos, piece]) => {
      const [x, y] = pos.split('_').map(Number);
      const multiplier = piece.player === player ? 1 : -1;
      
      score += this.PIECE_VALUES[piece.animal] * multiplier;
      
      const targetDen = piece.player === PLAYERS.RED ? DENS.YELLOW : DENS.RED;
      const distanceToDen = Math.abs(x - targetDen.X) + Math.abs(y - targetDen.Y);
      score += (10 - distanceToDen) * 0.1 * multiplier;
      
      const enemyTraps = piece.player === PLAYERS.RED ? TRAP_SQUARES.YELLOW : TRAP_SQUARES.RED;
      if (enemyTraps.some(trap => trap.X === x && trap.Y === y)) {
        score += 0.5 * multiplier;
      }
      
      if (this.isPieceInDanger(pos, piece, pieces)) {
        score -= this.PIECE_VALUES[piece.animal] * 0.5 * multiplier;
      }
    });
    
    return score;
  }

  isPieceInDanger(pos, piece, pieces) {
    const [x, y] = pos.split('_').map(Number);
    const adjacentSquares = [
      [x-1, y], [x+1, y], [x, y-1], [x, y+1]
    ];
    
    return adjacentSquares.some(([adjX, adjY]) => {
      if (adjX < 0 || adjX >= BOARD_WIDTH || adjY < 0 || adjY >= BOARD_HEIGHT) {
        return false;
      }
      
      const adjacentPiece = pieces[`${adjX}_${adjY}`];
      if (!adjacentPiece || adjacentPiece.player === piece.player) {
        return false;
      }
      
      return window.isValidMove(adjX, adjY, x, y, pieces, adjacentPiece);
    });
  }

  getBestMove(pieces, player) {
    const possibleMoves = this.getPossibleMoves(pieces, player);
    if (possibleMoves.length === 0) return null;
    
    let bestScore = -Infinity;
    let bestMove = null;
    
    possibleMoves.forEach(move => {
      const newPieces = {...pieces};
      delete newPieces[move.from];
      newPieces[move.to] = pieces[move.from];
      
      const score = this.evaluatePosition(newPieces, player);
      
      if (score > bestScore) {
        bestScore = score;
        bestMove = move;
      }
    });
    
    return bestMove;
  }

  getRandomMove(pieces, player) {
    return this.getBestMove(pieces, player);
  }

  getPossibleMoves(pieces, player) {
    let allMoves = [];

    Object.entries(pieces).forEach(([fromPos, piece]) => {
      if (piece.player === player) {
        const [fromX, fromY] = fromPos.split('_').map(Number);
        
        for (let toX = 0; toX < BOARD_WIDTH; toX++) {
          for (let toY = 0; toY < BOARD_HEIGHT; toY++) {
            if (window.isValidMove(fromX, fromY, toX, toY, pieces, piece)) {
              allMoves.push({
                from: fromPos,
                to: `${toX}_${toY}`
              });
            }
          }
        }
      }
    });

    return allMoves;
  }
}

window.aiPlayer = new AIPlayer();