const isWater = (x, y) => {
  const numX = parseInt(x)
  const numY = parseInt(y)
  console.log(`Checking water square: x=${x}(${typeof x})->${numX}, y=${y}(${typeof y})->${numY}`)
  const inColumns = WATER_SQUARES.COLUMNS.includes(numX)
  const inRows = WATER_SQUARES.ROWS.includes(numY)
  console.log(`COLUMNS check (${WATER_SQUARES.COLUMNS}): ${inColumns}`)
  console.log(`ROWS check (${WATER_SQUARES.ROWS}): ${inRows}`)
  return inColumns && inRows
}

const validateRatWaterMove = (fromWater, toWater, fromX, fromY, toX, toY, pieces, debug) => {
  if (fromWater && !toWater) {
    debug && console.log('Rat leaving water')
    return true
  }

  if (!fromWater && toWater) {
    debug && console.log('Rat entering water')
    return true
  }

  if (fromWater && toWater) {
    debug && console.log('Rat moving within water')
    return true
  }

  return true
}

const validateJumpOverWater = (fromX, fromY, toX, toY, pieces, debug) => {
  if (fromX === toX) {
    const minY = Math.min(fromY, toY)
    const maxY = Math.max(fromY, toY)
    for (let y = minY + 1; y < maxY; y++) {
      if (!isWater(fromX, y)) {
        debug && console.log(`INVALID: Non-water square in jump path at x=${fromX} y=${y}`)
        return false
      }
      const key = `${fromX}_${y}`
      if (pieces[key] && pieces[key].animal === PIECES.RAT) {
        debug && console.log('INVALID: Rat blocking jump path')
        return false
      }
    }
  } else if (fromY === toY) {
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
  return true
}

const isValidWaterMove = (fromX, fromY, toX, toY, movingPiece, pieces, debug = false) => {
  const fromWater = isWater(fromX, fromY)
  const toWater = isWater(toX, toY)

  if (debug) {
    console.log(`Water squares - From: ${fromWater}, To: ${toWater}`)
  }

  if (toWater && movingPiece.animal !== PIECES.RAT) {
    debug && console.log('INVALID: Only rat can enter water')
    return false
  }

  if (movingPiece.animal === PIECES.RAT) {
    return validateRatWaterMove(fromWater, toWater, fromX, fromY, toX, toY, pieces, debug)
  }

  if (movingPiece.animal === PIECES.TIGER || movingPiece.animal === PIECES.LION) {
    return validateJumpOverWater(fromX, fromY, toX, toY, pieces, debug)
  }

  return true
}

window.isWater = isWater
window.isValidWaterMove = isValidWaterMove