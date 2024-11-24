class GameManager {
  getClickKey(clickX, clickY) {
    const boardX = clickX - BOARD_UPPER_LEFT_X
    const boardY = clickY - BOARD_UPPER_LEFT_Y

    const col = Math.floor(boardY / BOARD_SQUARE_HEIGHT)
    const row = Math.floor(boardX / BOARD_SQUARE_WIDTH)

    if (row >= 0 && row < 7 && col >= 0 && col < 9) {
      return `${row}_${col}`
    }
    return null
  }

  handleMove(firstKey, secondKey, pieces, callbacks) {
    const [fromX, fromY] = firstKey.split('_')
    const [toX, toY] = secondKey.split('_')
    const movingPiece = pieces[firstKey]

    if (!isValidMove(fromX, fromY, toX, toY, pieces, movingPiece)) {
      callbacks.setIsFirstClick(true)
      callbacks.setFirstClickKey(null)
      return
    }

    callbacks.setMovedPiece([firstKey.split('_'), secondKey.split('_')])
    callbacks.setPieces(prev => {
      const newPieces = {...prev}
      delete newPieces[firstKey]
      newPieces[secondKey] = movingPiece
      return newPieces
    })
    callbacks.setIsFirstClick(true)
    callbacks.setFirstClickKey(null)
    callbacks.setTurn(prev => 1 - prev)
  }

  handleGameClick(clickX, clickY, gameState, callbacks) {
    if (clickX < BOARD_UPPER_LEFT_X && clickY < 13) {
      callbacks.setCurrentWindow('home')
      callbacks.setPieces(initialPieces)
      callbacks.setTurn(1)
      callbacks.setIsFirstClick(true)
      callbacks.setFirstClickKey(null)
      callbacks.setMovedPiece(['0'])
      return
    }

    const clickKey = this.getClickKey(clickX, clickY)
    if (!clickKey) return

    if (gameState.isFirstClick) {
      if (!gameState.pieces[clickKey]) return
      const player = gameState.pieces[clickKey].player
      if (player !== gameState.turn) return
      callbacks.setFirstClickKey(clickKey)
      callbacks.setIsFirstClick(false)
    } else {
      if (gameState.firstClickKey === clickKey) {
        callbacks.setFirstClickKey(null)
        callbacks.setIsFirstClick(true)
        return
      }
      this.handleMove(gameState.firstClickKey, clickKey, gameState.pieces, callbacks)
    }
  }
}

window.gameManager = new GameManager()