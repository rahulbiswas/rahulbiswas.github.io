const isValidPieceMove = (fromX, fromY, toX, toY, pieces, movingPiece, targetPiece, debug = false) => {
  const dx = Math.abs(toX - fromX)
  const dy = Math.abs(toY - fromY)

  if ((dx === 0 && dy === MOVEMENT.NORMAL_MOVE) || (dx === MOVEMENT.NORMAL_MOVE && dy === 0)) {
    return validateNormalMove(movingPiece, targetPiece, fromX, fromY, toX, toY, pieces, debug)
  }

  if (((dx === MOVEMENT.HORIZONTAL_JUMP && dy === 0) || (dx === 0 && dy === MOVEMENT.VERTICAL_JUMP)) &&
    (movingPiece.animal === PIECES.TIGER || movingPiece.animal === PIECES.LION)) {
    if (targetPiece) {
      debug && console.log(`Checking capture after jump: Moving(${movingPiece.animal}) vs Target(${targetPiece.animal})`)
      return movingPiece.animal >= targetPiece.animal
    }
    debug && console.log('VALID: Jump to empty square')
    return true
  }

  debug && console.log('INVALID: Move does not match any valid pattern')
  return false
}

const validateNormalMove = (movingPiece, targetPiece, fromX, fromY, toX, toY, pieces, debug) => {
  if (!targetPiece) {
    debug && console.log('VALID: Normal move to empty square')
    return true
  }

  const isInOwnTrap = (
    (targetPiece.player === PLAYERS.YELLOW &&
      TRAP_SQUARES.YELLOW.some(trap => trap.X === toX && trap.Y === toY)) ||
    (targetPiece.player === PLAYERS.RED &&
      TRAP_SQUARES.RED.some(trap => trap.X === toX && trap.Y === toY))
  )

  if (isInOwnTrap) {
    debug && console.log('INVALID: Target piece is in own trap')
    return false
  }

  if (movingPiece.animal === PIECES.RAT) {
    if (targetPiece.animal === PIECES.ELEPHANT && !isWater(fromX, fromY)) {
      debug && console.log('VALID: Rat can capture elephant')
      return true
    }
    const canCapture = targetPiece.animal === PIECES.RAT
    debug && console.log(canCapture ? 'VALID: Rat can capture rat' : 'INVALID: Rat cannot capture this piece')
    return canCapture
  }

  if (isWater(fromX, fromY) || isWater(toX, toY)) {
    debug && console.log('INVALID: Cannot capture from/to water')
    return false
  }

  debug && console.log(`Comparing strengths: Moving(${movingPiece.animal}) vs Target(${targetPiece.animal})`)
  return movingPiece.animal >= targetPiece.animal
}

window.isValidPieceMove = isValidPieceMove