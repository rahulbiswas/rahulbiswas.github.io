const isBasicMoveValid = (fromX, fromY, toX, toY, pieces, movingPiece, debug = false) => {
  fromX = parseInt(fromX)
  fromY = parseInt(fromY)
  toX = parseInt(toX)
  toY = parseInt(toY)

  if (debug) {
    console.log(`\nValidating move from (${fromX},${fromY}) to (${toX},${toY})`)
    console.log(`Moving piece:`, movingPiece)
  }

  if (fromX < 0 || fromX >= BOARD_WIDTH || fromY < 0 || fromY >= BOARD_HEIGHT ||
    toX < 0 || toX >= BOARD_WIDTH || toY < 0 || toY >= BOARD_HEIGHT) {
    debug && console.log('INVALID: Move outside board boundaries')
    return {isValid: false}
  }

  const targetKey = `${toX}_${toY}`
  const targetPiece = pieces[targetKey]
  if (debug && targetPiece) {
    console.log('Target square occupied by:', targetPiece)
  }

  if (targetPiece && targetPiece.player === movingPiece.player) {
    debug && console.log('INVALID: Cannot capture own piece')
    return {isValid: false}
  }

  if ((movingPiece.player === PLAYERS.YELLOW && toY === DENS.YELLOW.Y && toX === DENS.YELLOW.X) ||
    (movingPiece.player === PLAYERS.RED && toY === DENS.RED.Y && toX === DENS.RED.X)) {
    debug && console.log('INVALID: Cannot enter own den')
    return {isValid: false}
  }

  const dx = Math.abs(toX - fromX)
  const dy = Math.abs(toY - fromY)
  debug && console.log(`Movement delta - dx: ${dx}, dy: ${dy}`)

  return {isValid: true, dx, dy, targetPiece}
}

const isValidMove = (fromX, fromY, toX, toY, pieces, movingPiece, debug = false) => {
  const basicValidation = isBasicMoveValid(fromX, fromY, toX, toY, pieces, movingPiece, debug)
  if (!basicValidation.isValid) return false

  const {dx, dy, targetPiece} = basicValidation

  if (!isValidWaterMove(fromX, fromY, toX, toY, movingPiece, pieces, debug)) {
    return false
  }

  return isValidPieceMove(fromX, fromY, toX, toY, pieces, movingPiece, targetPiece, debug)
}

window.isBasicMoveValid = isBasicMoveValid
window.isValidMove = isValidMove