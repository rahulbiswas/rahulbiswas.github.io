const isBasicMoveValid = (fromX, fromY, toX, toY, pieces, movingPiece, debug = false) => {
  fromX = parseInt(fromX)
  fromY = parseInt(fromY)
  toX = parseInt(toX)
  toY = parseInt(toY)

  if (debug) {
    console.log(`\nValidating move from (${fromX},${fromY}) to (${toX},${toY})`)
    console.log(`Moving piece:`, movingPiece)
  }

  // Check board boundaries
  if (fromX < 0 || fromX >= BOARD_WIDTH || fromY < 0 || fromY >= BOARD_HEIGHT ||
    toX < 0 || toX >= BOARD_WIDTH || toY < 0 || toY >= BOARD_HEIGHT) {
    debug && console.log('INVALID: Move outside board boundaries')
    return false
  }

  const targetKey = `${toX}_${toY}`
  const targetPiece = pieces[targetKey]
  if (debug && targetPiece) {
    console.log('Target square occupied by:', targetPiece)
  }

  // Check if trying to capture own piece
  if (targetPiece && targetPiece.player === movingPiece.player) {
    debug && console.log('INVALID: Cannot capture own piece')
    return false
  }

  // Check den rules
  if ((movingPiece.player === PLAYERS.YELLOW && toY === DENS.YELLOW.Y && toX === DENS.YELLOW.X) ||
    (movingPiece.player === PLAYERS.RED && toY === DENS.RED.Y && toX === DENS.RED.X)) {
    debug && console.log('INVALID: Cannot enter own den')
    return false
  }

  const dx = Math.abs(toX - fromX)
  const dy = Math.abs(toY - fromY)
  debug && console.log(`Movement delta - dx: ${dx}, dy: ${dy}`)

  return {isValid: true, dx, dy, targetPiece}
}

window.isBasicMoveValid = isBasicMoveValid