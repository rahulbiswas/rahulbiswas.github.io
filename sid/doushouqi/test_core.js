function parseEnumValue(enumString) {
  const [enumType, enumValue] = enumString.split('.')
  return window[enumType][enumValue]
}

function parsePiece(piece) {
  return {
    player: parseEnumValue(piece.player),
    animal: parseEnumValue(piece.animal)
  }
}

function parseBoard(board) {
  const parsedBoard = {}
  for (const [pos, piece] of Object.entries(board)) {
    parsedBoard[pos] = parsePiece(piece)
  }
  return parsedBoard
}

function runMoveValidation(scenario) {
  const [fromX, fromY] = scenario.startPos.split('_').map(Number)
  const [toX, toY] = scenario.endPos.split('_').map(Number)
  const parsedBoard = parseBoard(scenario.board)
  const currentPlayer = parseEnumValue(scenario.currentPlayer)
  const movingPiece = parsedBoard[scenario.startPos]
  if (movingPiece?.player !== currentPlayer) {
    return false
  }
  return isValidMove(fromX, fromY, toX, toY, parsedBoard, movingPiece, debug = true)
}

function runPositionEvaluation(scenario) {
  const parsedBoard = parseBoard(scenario.board)
  const evaluatingPlayer = parseEnumValue(scenario.evaluatingPlayer)
  const score = window.positionEvaluator.evaluatePosition(parsedBoard, evaluatingPlayer)
  return Math.round(score)
}

function assert(condition, message = 'Assertion failed') {
  if (!condition) {
    throw new Error(message)
  }
}

window.testCore = {
  runMoveValidation,
  runPositionEvaluation,
  assert
}