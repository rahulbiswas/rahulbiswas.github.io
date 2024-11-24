const checkWinCondition = (pieces) => {
  const blueWin = Object.entries(pieces).some(([pos, piece]) => {
    return piece.player === 1 && pos === '3_0'
  })

  const redWin = Object.entries(pieces).some(([pos, piece]) => {
    return piece.player === 0 && pos === '3_8'
  })

  const bluePieces = Object.values(pieces).filter(piece => piece.player === 0)
  const redPieces = Object.values(pieces).filter(piece => piece.player === 1)

  if (blueWin || redPieces.length === 0) return 1
  if (redWin || bluePieces.length === 0) return 0
  return null
}