const isWater = (x, y) => {
  return WATER_SQUARES.COLUMNS.includes(x) && WATER_SQUARES.ROWS.includes(y)
}

const isValidMove = (fromX, fromY, toX, toY, pieces, movingPiece, debug = false) => {
  const basicValidation = isBasicMoveValid(fromX, fromY, toX, toY, pieces, movingPiece, debug)
  if (!basicValidation.isValid) return false

  const {dx, dy, targetPiece} = basicValidation

  const fromWater = isWater(fromX, fromY)
  const toWater = isWater(toX, toY)
  debug && console.log(`Water squares - From: ${fromWater}, To: ${toWater}`)

  // Check water movement rules
  if (toWater && movingPiece.animal !== PIECES.RAT) {
    debug && console.log('INVALID: Only rat can enter water')
    return false
  }

  // Check normal movement
  if ((dx === 0 && dy === MOVEMENT.NORMAL_MOVE) || (dx === MOVEMENT.NORMAL_MOVE && dy === 0)) {
    debug && console.log('Checking normal move rules...')
    if (targetPiece) {
      if (movingPiece.animal === PIECES.RAT) {
        if (targetPiece.animal === PIECES.ELEPHANT && !fromWater) {
          debug && console.log('VALID: Rat can capture elephant')
          return true
        }
        const canCapture = targetPiece.animal === PIECES.RAT
        debug && console.log(canCapture ?
          'VALID: Rat can capture rat' :
          'INVALID: Rat cannot capture this piece')
        return canCapture
      }

      if (fromWater || toWater) {
        debug && console.log('INVALID: Cannot capture from/to water')
        return false
      }

      debug && console.log(`Comparing strengths: Moving(${movingPiece.animal}) vs Target(${targetPiece.animal})`)
      return movingPiece.animal >= targetPiece.animal
    }

    debug && console.log('VALID: Normal move to empty square')
    return true
  }
  // Check jump movement
  else if (((dx === MOVEMENT.HORIZONTAL_JUMP && dy === 0) || (dx === 0 && dy === MOVEMENT.VERTICAL_JUMP)) &&
    (movingPiece.animal === PIECES.TIGER || movingPiece.animal === PIECES.LION)) {
    debug && console.log('Checking jump move rules...')
    if (!fromWater && !toWater) {
      if (dx === 0) {
        debug && console.log('Checking vertical jump...')
        const minY = Math.min(fromY, toY)
        const maxY = Math.max(fromY, toY)
        for (let y = minY + 1; y < maxY; y++) {
          if (!isWater(fromX, y)) {
            debug && console.log(`INVALID: Non-water square in jump path at y=${y}`)
            return false
          }
          const key = `${fromX}_${y}`
          if (pieces[key] && pieces[key].animal === PIECES.RAT) {
            debug && console.log('INVALID: Rat blocking jump path')
            return false
          }
        }
      } else if (dy === 0) {
        debug && console.log('Checking horizontal jump...')
        const minX = Math.min(fromX, toX)
        const maxX = Math.max(fromX, toX)
        for (let x = minX + 1; x < maxX; x++) {
          if (!isWater(x, fromY)) {
            debug && console.log(`INVALID: Non-water square in jump path at x=${x}`)
            return false
          }
          const key = `${x}_${fromY}`
          if (pieces[key] && pieces[key].animal === PIECES.RAT) {
            debug && console.log('INVALID: Rat blocking jump path')
            return false
          }
        }
      }

      if (targetPiece) {
        debug && console.log(`Checking capture after jump: Moving(${movingPiece.animal}) vs Target(${targetPiece.animal})`)
        return movingPiece.animal >= targetPiece.animal
      }

      debug && console.log('VALID: Jump to empty square')
      return true
    }
  }

  debug && console.log('INVALID: Move does not match any valid pattern')
  return false
}

window.isValidMove = isValidMove