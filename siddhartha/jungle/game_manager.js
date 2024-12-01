class GameManager {
  handleBackClick() {
    window.dispatchEvent(new CustomEvent('back-to-menu'))
  }

  handlePieceSelection(pos) {
    if (!window.gameState.isPlayerTurn || window.gameState.winner) return
    
    const piece = window.gameState.pieces[pos]
    if (piece?.player !== PLAYERS.RED) return
    
    window.dispatchEvent(new CustomEvent('select-piece', {
      detail: { position: pos }
    }))
  }

  handleSquareSelection(pos) {
    if (!window.gameState.isPlayerTurn || window.gameState.winner) return
    
    if (!window.gameState.selectedPieceKey) return
    
    const movingPiece = window.gameState.pieces[window.gameState.selectedPieceKey]
    if (!isValidMove(
      ...window.gameState.selectedPieceKey.split('_'),
      ...pos.split('_'),
      window.gameState.pieces,
      movingPiece
    )) {
      window.dispatchEvent(new CustomEvent('deselect-piece'))
      return
    }

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