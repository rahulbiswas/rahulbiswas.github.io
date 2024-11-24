const checkWinCondition = (pieces) => {
  const blueWin = Object.entries(pieces).some(([pos, piece]) => {
    return piece.player === PLAYERS.RED && pos === '3_0'
  })

  const redWin = Object.entries(pieces).some(([pos, piece]) => {
    return piece.player === PLAYERS.YELLOW && pos === '3_8'
  })

  const yellowPieces = Object.values(pieces).filter(piece => piece.player === PLAYERS.YELLOW)
  const redPieces = Object.values(pieces).filter(piece => piece.player === PLAYERS.RED)

  if (blueWin || redPieces.length === 0) return PLAYERS.RED
  if (redWin || yellowPieces.length === 0) return PLAYERS.YELLOW
  return null
}