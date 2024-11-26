class AIPlayer {
  constructor(evaluator) {
    this.evaluator = evaluator
  }

  minimax(pieces, depth, isMaximizingPlayer, player) {
    if (depth === 0 || this.isGameOver(pieces)) {
      return [null, this.evaluator.evaluatePosition(pieces, player)]
    }

    const possibleMoves = this.getPossibleMoves(pieces,
      isMaximizingPlayer ? player : this.getOpponent(player))

    let bestMove = null
    let bestEval = isMaximizingPlayer ? -Infinity : Infinity
    const compareFn = isMaximizingPlayer ?
      (a, b) => a > b :
      (a, b) => a < b

    for (const move of possibleMoves) {
      const newPieces = this.makeMove(pieces, move)
      const [_, ev] = this.minimax(newPieces, depth - 1, !isMaximizingPlayer, player)

      if (compareFn(ev, bestEval)) {
        bestEval = ev
        bestMove = move
      }
    }

    return [bestMove, bestEval]
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

  getAIMove(pieces, player) {
    console.group('AI Move Evaluation')
    console.log('Evaluating moves for player:', player === PLAYERS.RED ? 'RED' : 'YELLOW')
    
    let bestMove = null
    
    for (let depth = 1; depth <= 3; depth++) {
      console.log(`Searching to depth ${depth}...`)
      const [move, score] = this.minimax(pieces, depth, true, player)
      bestMove = move

      if (score >= this.evaluator.WINNING_SCORE) {
        console.log(`Found winning move at depth ${depth}`)
        break
      }
    }

    const moveScores = []
    const possibleMoves = this.getPossibleMoves(pieces, player)

    for (const move of possibleMoves) {
        const newPieces = this.makeMove(pieces, move)
        const [_, score] = this.minimax(newPieces, 2, false, player)
        
        const fromPiece = pieces[move.from]
        moveScores.push({
            from: move.from,
            to: move.to,
            piece: `${fromPiece.player === PLAYERS.RED ? 'RED' : 'YELLOW'} ${Object.keys(PIECES).find(key => PIECES[key] === fromPiece.animal)}`,
            score: score
        })
    }

    moveScores.sort((a, b) => b.score - a.score)
    moveScores.forEach(move => {
        console.log(
            `${move.piece} ${move.from} → ${move.to}: ${move.score}`
        )
    })
    
    console.log('Selected move:', bestMove)
    console.groupEnd()
    
    return bestMove
  }
}

window.aiPlayer = new AIPlayer(window.positionEvaluator)