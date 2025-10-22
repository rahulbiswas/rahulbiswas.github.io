class GameManager {
  debugLog(message, data) {
    const urlParams = new URLSearchParams(window.location.search)
    const debugMode = parseInt(urlParams.get('debug')) || 0
    if (debugMode && message) {
      if (data !== undefined) {
        console.log(message, data)
      } else {
        console.log(message)
      }
    }
  }

  handlePieceSelection(pos) {
    this.debugLog('Piece selection:', pos)
    if (!window.gameState.isPlayerTurn || window.gameState.winner) {
      this.debugLog('Cannot select piece - not player turn or game over')
      return
    }
    
    const piece = window.gameState.pieces[pos]
    this.debugLog('Selected piece:', piece)
    if (piece?.player !== PLAYERS.RED) {
      this.debugLog('Cannot select piece - not player piece')
      return
    }
    
    window.dispatchEvent(new CustomEvent('select-piece', {
      detail: { position: pos }
    }))
  }

  handleSquareSelection(pos) {
    this.debugLog('Square selection:', pos)
    if (!window.gameState.isPlayerTurn || window.gameState.winner) {
      this.debugLog('Cannot move - not player turn or game over')
      return
    }
    
    if (!window.gameState.selectedPieceKey) {
      this.debugLog('No piece selected')
      return
    }
    
    const [fromX, fromY] = window.gameState.selectedPieceKey.split('_').map(Number)
    const [toX, toY] = pos.split('_').map(Number)
    const movingPiece = window.gameState.pieces[window.gameState.selectedPieceKey]
    
    this.debugLog('Attempting move:', {
      from: window.gameState.selectedPieceKey,
      to: pos,
      piece: movingPiece
    })

    if (!isValidMove(fromX, fromY, toX, toY, window.gameState.pieces, movingPiece)) {
      this.debugLog('Move is invalid')
      window.dispatchEvent(new CustomEvent('deselect-piece'))
      return
    }

    this.debugLog('Move is valid - executing')
    window.dispatchEvent(new CustomEvent('make-move', {
      detail: {
        from: window.gameState.selectedPieceKey,
        to: pos
      }
    }))
  }

  handleMove(fromKey, toKey, pieces, callbacks, onMoveComplete) {
    const movingPiece = pieces[fromKey]

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
