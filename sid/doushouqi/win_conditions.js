const checkWinCondition = (pieces) => {
  const redWinByDen = Object.entries(pieces).some(([pos, piece]) => {
    return piece.player === PLAYERS.RED && pos === `${DENS.YELLOW.X}_${DENS.YELLOW.Y}`
  })

  const yellowWinByDen = Object.entries(pieces).some(([pos, piece]) => {
    return piece.player === PLAYERS.YELLOW && pos === `${DENS.RED.X}_${DENS.RED.Y}`
  })

  const yellowPieces = Object.values(pieces).filter(piece => piece.player === PLAYERS.YELLOW)
  const redPieces = Object.values(pieces).filter(piece => piece.player === PLAYERS.RED)

  if (redWinByDen || yellowPieces.length === 0) return PLAYERS.RED
  if (yellowWinByDen || redPieces.length === 0) return PLAYERS.YELLOW
  return null
}

window.checkWinCondition = checkWinCondition