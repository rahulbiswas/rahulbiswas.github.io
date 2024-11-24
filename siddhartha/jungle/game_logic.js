const ANIMALS = {
  RAT: 1,
  CAT: 2,
  DOG: 3,
  WOLF: 4,
  LEOPARD: 5,
  TIGER: 6,
  LION: 7,
  ELEPHANT: 8
}

const BOARD_WIDTH = 7
const BOARD_HEIGHT = 9

const isValidMove = (fromX, fromY, toX, toY, pieces, movingPiece) => {
  fromX = parseInt(fromX)
  fromY = parseInt(fromY)
  toX = parseInt(toX)
  toY = parseInt(toY)

  if (fromX < 0 || fromX >= BOARD_WIDTH || fromY < 0 || fromY >= BOARD_HEIGHT ||
    toX < 0 || toX >= BOARD_WIDTH || toY < 0 || toY >= BOARD_HEIGHT) {
    return false
  }

  const targetKey = `${toX}_${toY}`
  const targetPiece = pieces[targetKey]

  if (targetPiece && targetPiece.player === movingPiece.player) {
    return false
  }

  if ((movingPiece.player === 0 && toY === 0 && toX === 3) ||
    (movingPiece.player === 1 && toY === 8 && toX === 3)) {
    return false
  }

  const isWater = (x, y) => {
    return (x === 1 || x === 2 || x === 4 || x === 5) &&
      (y === 3 || y === 4 || y === 5)
  }

  const fromWater = isWater(fromX, fromY)
  const toWater = isWater(toX, toY)

  if (toWater && movingPiece.animal !== 1) {
    return false
  }

  const dx = Math.abs(toX - fromX)
  const dy = Math.abs(toY - fromY)

  if ((dx === 0 && dy === 1) || (dx === 1 && dy === 0)) {
    if (targetPiece) {
      if (movingPiece.animal === 1) {
        if (targetPiece.animal === 8 && !fromWater) {
          return true
        }
        return targetPiece.animal === 1
      }

      if (fromWater || toWater) {
        return false
      }

      return movingPiece.animal >= targetPiece.animal
    }

    return true
  } else if ((dx === 3 || dy === 4) &&
    (movingPiece.animal === 6 || movingPiece.animal === 7)) {
    if (!fromWater && !toWater) {
      if (dx === 0) {
        const minY = Math.min(fromY, toY)
        const maxY = Math.max(fromY, toY)
        for (let y = minY + 1; y < maxY; y++) {
          if (!isWater(fromX, y)) return false
          const key = `${fromX}_${y}`
          if (pieces[key] && pieces[key].animal === 1) return false
        }
      } else if (dy === 0) {
        const minX = Math.min(fromX, toX)
        const maxX = Math.max(fromX, toX)
        for (let x = minX + 1; x < maxX; x++) {
          if (!isWater(x, fromY)) return false
          const key = `${x}_${fromY}`
          if (pieces[key] && pieces[key].animal === 1) return false
        }
      }

      if (targetPiece) {
        return movingPiece.animal >= targetPiece.animal
      }

      return true
    }
  }

  return false
}

const initialPieces = {
  '0_0': {'player': 0, 'animal': 7},
  '6_0': {'player': 0, 'animal': 6},
  '1_1': {'player': 0, 'animal': 4},
  '5_1': {'player': 0, 'animal': 2},
  '0_2': {'player': 0, 'animal': 1},
  '2_2': {'player': 0, 'animal': 5},
  '4_2': {'player': 0, 'animal': 3},
  '6_2': {'player': 0, 'animal': 8},
  '6_8': {'player': 1, 'animal': 7},
  '0_8': {'player': 1, 'animal': 6},
  '5_7': {'player': 1, 'animal': 4},
  '1_7': {'player': 1, 'animal': 2},
  '6_6': {'player': 1, 'animal': 1},
  '4_6': {'player': 1, 'animal': 5},
  '2_6': {'player': 1, 'animal': 3},
  '0_6': {'player': 1, 'animal': 8}
}