class MinimaxEngine {
  constructor(evaluator) {
    this.evaluator = evaluator
    this.cache = new Map()
  }

  minimax(pieces, depth, isMaximizingPlayer, player, alpha = -Infinity, beta = Infinity) {
    if (depth === 0 || this.isGameOver(pieces)) {
      return [null, this.evaluator.evaluatePosition(pieces, player)]
    }

    const cacheKey = JSON.stringify([pieces, depth, isMaximizingPlayer])
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)
    }

    const possibleMoves = this.getPossibleMoves(pieces,
      isMaximizingPlayer ? player : this.getOpponent(player))

    let bestMove = null
    let bestEval = isMaximizingPlayer ? -Infinity : Infinity

    for (const move of possibleMoves) {
      const newPieces = this.makeMove(pieces, move)
      const [_, ev] = this.minimax(newPieces, depth - 1, !isMaximizingPlayer, player, alpha, beta)

      if (isMaximizingPlayer) {
        if (ev > bestEval) {
          bestEval = ev
          bestMove = move
        }
        alpha = Math.max(alpha, bestEval)
      } else {
        if (ev < bestEval) {
          bestEval = ev
          bestMove = move
        }
        beta = Math.min(beta, bestEval)
      }

      if (beta <= alpha) {
        break
      }
    }

    const result = [bestMove, bestEval]
    this.cache.set(cacheKey, result)
    return result
  }

  makeMove(pieces, move) {
    const newPieces = {...pieces}
    delete newPieces[move.from]
    newPieces[move.to] = pieces[move.from]
    return newPieces
  }

  getOpponent(player) {
    return player === PLAYERS.RED ? PLAYERS.YELLOW : PLAYERS.RED
  }

  isGameOver(pieces) {
    return window.checkWinCondition(pieces) !== null
  }

  getPossibleMoves(pieces, player) {
    let allMoves = []

    Object.entries(pieces).forEach(([fromPos, piece]) => {
      if (piece.player === player) {
        const [fromX, fromY] = fromPos.split('_').map(Number)

        for (let toX = 0; toX < BOARD_WIDTH; toX++) {
          for (let toY = 0; toY < BOARD_HEIGHT; toY++) {
            if (window.isValidMove(fromX, fromY, toX, toY, pieces, piece)) {
              allMoves.push({
                from: fromPos,
                to: `${toX}_${toY}`
              })
            }
          }
        }
      }
    })

    return allMoves
  }
}

window.minimaxEngine = new MinimaxEngine(window.positionEvaluator)