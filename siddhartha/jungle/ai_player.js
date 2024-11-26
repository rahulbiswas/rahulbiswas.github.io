class AIPlayer {
  constructor(engine) {
    this.engine = engine
  }

  getAIMove(pieces, player) {
    console.group('AI Move Evaluation')
    console.log('Evaluating moves for player:', player === PLAYERS.RED ? 'RED' : 'YELLOW')
    
    let bestMove = null
    
    for (let depth = 1; depth <= 3; depth++) {
      console.group(`Searching to depth ${depth}...`)
      
      const possibleMoves = this.engine.getPossibleMoves(pieces, player)
      const moveScores = []
      
      for (const move of possibleMoves) {
        const newPieces = this.engine.makeMove(pieces, move)
        const [_, score] = this.engine.minimax(newPieces, depth - 1, false, player)
        
        const fromPiece = pieces[move.from]
        moveScores.push({
          from: move.from,
          to: move.to,
          piece: `${fromPiece.player === PLAYERS.RED ? 'RED' : 'YELLOW'} ${
            Object.keys(PIECES).find(key => PIECES[key] === fromPiece.animal)
          }`,
          score: score
        })
      }

      moveScores.sort((a, b) => b.score - a.score)
      moveScores.forEach(move => {
        console.log(
          `${move.piece} ${move.from} → ${move.to}: ${move.score}`
        )
      })
      
      const [move, score] = this.engine.minimax(pieces, depth, true, player)
      bestMove = move
      
      console.groupEnd()

      if (score >= this.engine.evaluator.WINNING_SCORE) {
        console.log(`Found winning move at depth ${depth}`)
        break
      }
    }
    
    console.log('Selected move:', bestMove)
    console.groupEnd()
    
    return bestMove
  }
}

window.aiPlayer = new AIPlayer(window.minimaxEngine)