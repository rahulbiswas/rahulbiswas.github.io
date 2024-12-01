const JungleGame = () => {
  const [currentWindow, setCurrentWindow] = React.useState('home')
  const [pieces, setPieces] = React.useState(initialPieces)
  const [selectedPieceKey, setSelectedPieceKey] = React.useState(null)
  const [lastMove, setLastMove] = React.useState(null)
  const [winner, setWinner] = React.useState(null)
  const [isPlayerTurn, setIsPlayerTurn] = React.useState(true)

  React.useEffect(() => {
    if (!isPlayerTurn && !winner) {
      const timeoutId = setTimeout(() => {
        const startTime = performance.now()
        const aiMove = window.aiPlayer.getAIMove(pieces, PLAYERS.YELLOW)
        const moveTime = performance.now() - startTime

        window.dispatchEvent(new CustomEvent('ai-move-time', {
          detail: {time: moveTime}
        }))

        if (aiMove) {
          gameManager.handleMove(
            aiMove.from,
            aiMove.to,
            pieces,
            {setPieces, setSelectedPieceKey, setLastMove, setWinner},
            () => setIsPlayerTurn(true)
          )
        }
      }, 500)
      return () => clearTimeout(timeoutId)
    }
  }, [pieces, winner, isPlayerTurn])

  React.useEffect(() => {
    const handleBackToMenu = () => {
      setCurrentWindow('home')
      resetGame()
    }
    
    const handleStartGame = () => {
      setCurrentWindow('game')
    }
    
    const handleSelectPiece = (event) => {
      setSelectedPieceKey(event.detail.position)
    }
    
    const handleDeselectPiece = () => {
      setSelectedPieceKey(null)
    }
    
    const handleMakeMove = (event) => {
      gameManager.handleMove(
        event.detail.from,
        event.detail.to,
        pieces,
        {setPieces, setSelectedPieceKey, setLastMove, setWinner},
        () => setIsPlayerTurn(false)
      )
    }

    window.addEventListener('back-to-menu', handleBackToMenu)
    window.addEventListener('start-game', handleStartGame)
    window.addEventListener('select-piece', handleSelectPiece)
    window.addEventListener('deselect-piece', handleDeselectPiece)
    window.addEventListener('make-move', handleMakeMove)
    
    window.gameState = {
      pieces,
      selectedPieceKey,
      isPlayerTurn,
      winner
    }

    return () => {
      window.removeEventListener('back-to-menu', handleBackToMenu)
      window.removeEventListener('start-game', handleStartGame)
      window.removeEventListener('select-piece', handleSelectPiece)
      window.removeEventListener('deselect-piece', handleDeselectPiece)
      window.removeEventListener('make-move', handleMakeMove)
    }
  }, [pieces, selectedPieceKey, isPlayerTurn, winner])

  const resetGame = () => {
    setPieces(initialPieces)
    setSelectedPieceKey(null)
    setLastMove(null)
    setWinner(null)
    setIsPlayerTurn(true)
  }

  return React.createElement('div', {
    className: 'game-container'
  },
    currentWindow === 'home' && React.createElement(HomeMenu),
    currentWindow === 'game' && (
      winner !== null
        ? React.createElement(VictoryScreen, {
          winner: winner,
          onPlayAgain: resetGame
        })
        : React.createElement(GameBoard, {
          pieces: pieces,
          lastMove: lastMove,
          selectedPieceKey: selectedPieceKey,
          isPlayerTurn: isPlayerTurn
        })
    )
  )
}

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(React.createElement(JungleGame))