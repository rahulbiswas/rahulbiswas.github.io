class AIPlayer {
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

  getRandomMove(pieces, player) {
    const possibleMoves = this.getPossibleMoves(pieces, player)
    if (possibleMoves.length === 0) return null

    const randomIndex = Math.floor(Math.random() * possibleMoves.length)
    return possibleMoves[randomIndex]
  }
}

window.aiPlayer = new AIPlayer()