class PositionEvaluator {
  PIECE_VALUES = {
    [PIECES.RAT]: 2,
    [PIECES.CAT]: 2,
    [PIECES.DOG]: 3,
    [PIECES.WOLF]: 4,
    [PIECES.LEOPARD]: 5,
    [PIECES.TIGER]: 8,
    [PIECES.LION]: 8,
    [PIECES.ELEPHANT]: 7
  }

  WINNING_SCORE = 1000

  evaluatePosition(pieces, player, personality = 'hanfeizi') {
    const winner = window.checkWinCondition(pieces)
    if (winner !== null) {
      return winner === player ? this.WINNING_SCORE : -this.WINNING_SCORE
    }

    let score = 0
    const isAggressive = personality === 'meilin'
    const isDefensive = personality === 'hana'
    const denDistanceWeight = isDefensive ? 0.05 : (isAggressive ? 0.2 : 0.1)
    const trapBonus = isDefensive ? 0.6 : (isAggressive ? 1.0 : 0.5)
    const dangerPenalty = isDefensive ? 0.7 : (isAggressive ? 0.3 : 0.5)

    Object.entries(pieces).forEach(([pos, piece]) => {
      const [x, y] = pos.split('_').map(Number)
      const multiplier = piece.player === player ? 1 : -1

      score += this.PIECE_VALUES[piece.animal] * multiplier

      const targetDen = piece.player === PLAYERS.RED ? DENS.YELLOW : DENS.RED
      const distanceToDen = Math.abs(x - targetDen.X) + Math.abs(y - targetDen.Y)
      score += (10 - distanceToDen) * denDistanceWeight * multiplier

      const enemyTraps = piece.player === PLAYERS.RED ? TRAP_SQUARES.YELLOW : TRAP_SQUARES.RED
      if (enemyTraps.some(trap => trap.X === x && trap.Y === y)) {
        score += trapBonus * multiplier
      }

      if (this.isPieceInDanger(pos, piece, pieces)) {
        score -= this.PIECE_VALUES[piece.animal] * dangerPenalty * multiplier
      }
    })

    return score
  }

  isPieceInDanger(pos, piece, pieces) {
    const [x, y] = pos.split('_').map(Number)
    const adjacentSquares = [
      [x - 1, y], [x + 1, y], [x, y - 1], [x, y + 1]
    ]

    return adjacentSquares.some(([adjX, adjY]) => {
      if (adjX < 0 || adjX >= BOARD_WIDTH || adjY < 0 || adjY >= BOARD_HEIGHT) {
        return false
      }

      const adjacentPiece = pieces[`${adjX}_${adjY}`]
      if (!adjacentPiece || adjacentPiece.player === piece.player) {
        return false
      }

      return window.isValidMove(adjX, adjY, x, y, pieces, adjacentPiece)
    })
  }
}

window.positionEvaluator = new PositionEvaluator()
