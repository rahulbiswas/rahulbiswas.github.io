class GameManager {
  getClickKey(clickX, clickY) {
    const boardX = clickX - BOARD_UPPER_LEFT_X
    const boardY = clickY - BOARD_UPPER_LEFT_Y

    const col = Math.floor(boardX / BOARD_SQUARE_WIDTH)
    const row = Math.floor(boardY / BOARD_SQUARE_HEIGHT)

    if (col >= 0 && col < 7 && row >= 0 && row < 9) {
      return `${col}_${row}`
    }
    return null
  }

  handlePlayerClick(clickX, clickY, gameState, callbacks) {
    if (clickX < BOARD_UPPER_LEFT_X && clickY < 13) {
      callbacks.setCurrentWindow('home')
      callbacks.resetGame()
      return
    }

    const clickKey = this.getClickKey(clickX, clickY)
    if (!clickKey) return

    if (!gameState.selectedPieceKey) {
      if (!gameState.pieces[clickKey]) return
      if (gameState.pieces[clickKey].player !== PLAYERS.RED) return
      callbacks.setSelectedPieceKey(clickKey)
    } else {
      if (gameState.selectedPieceKey === clickKey) {
        callbacks.setSelectedPieceKey(null)
        return
      }

      this.handleMove(
        gameState.selectedPieceKey,
        clickKey,
        gameState.pieces,
        callbacks,
        () => callbacks.setIsPlayerTurn(false)
      )
    }
  }

  handleMove(fromKey, toKey, pieces, callbacks, onMoveComplete) {
    const movingPiece = pieces[fromKey]
    if (!isValidMove(...fromKey.split('_'), ...toKey.split('_'), pieces, movingPiece, false)) {
      callbacks.setSelectedPieceKey(null)
      return
    }

    callbacks.setLastMove({
      from: {
        x: parseInt(fromKey.split('_')[0]),
        y: parseInt(fromKey.split('_')[1])
      },
      to: {
        x: parseInt(toKey.split('_')[0]),
        y: parseInt(toKey.split('_')[1])
      }
    })

    callbacks.setPieces(prev => {
      const newPieces = {...prev}
      delete newPieces[fromKey]
      newPieces[toKey] = movingPiece

      const winner = checkWinCondition(newPieces)
      if (winner !== null) {
        callbacks.setWinner(winner)
      }

      return newPieces
    })

    callbacks.setSelectedPieceKey(null)
    if (onMoveComplete) onMoveComplete()
  }
}

window.gameManager = new GameManager()