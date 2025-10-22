const JungleGame = () => {
  const [currentWindow, setCurrentWindow] = React.useState('game')
  const [pieces, setPieces] = React.useState(initialPieces)
  const [selectedPieceKey, setSelectedPieceKey] = React.useState(null)
  const [lastMove, setLastMove] = React.useState(null)
  const [winner, setWinner] = React.useState(null)
  const [isPlayerTurn, setIsPlayerTurn] = React.useState(true)
  const [validMoves, setValidMoves] = React.useState(new Set())

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
    const handleSelectPiece = (event) => {
      const position = event.detail.position
      setSelectedPieceKey(position)
      if (position) {
        const [fromX, fromY] = position.split('_').map(Number)
        const movingPiece = pieces[position]
        const newValidMoves = new Set()
        
        for (let toX = 0; toX < BOARD_WIDTH; toX++) {
          for (let toY = 0; toY < BOARD_HEIGHT; toY++) {
            if (window.isValidMove(fromX, fromY, toX, toY, pieces, movingPiece)) {
              newValidMoves.add(`${toX}_${toY}`)
            }
          }
        }
        setValidMoves(newValidMoves)
      } else {
        setValidMoves(new Set())
      }
    }
    
    const handleDeselectPiece = () => {
      setSelectedPieceKey(null)
      setValidMoves(new Set())
    }
    
    const handleMakeMove = (event) => {
      gameManager.handleMove(
        event.detail.from,
        event.detail.to,
        pieces,
        {setPieces, setSelectedPieceKey, setLastMove, setWinner},
        () => setIsPlayerTurn(false)
      )
      setValidMoves(new Set())
    }

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
    setValidMoves(new Set())
  }

  return React.createElement('div', {
    className: 'game-container'
  },
    winner !== null
      ? React.createElement(VictoryScreen, {
        winner: winner,
        onPlayAgain: resetGame
      })
      : React.createElement(GameBoardContainer, {
        pieces: pieces,
        lastMove: lastMove,
        selectedPieceKey: selectedPieceKey,
        isPlayerTurn: isPlayerTurn,
        validMoves: validMoves
      })
  )
}

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(React.createElement(JungleGame))
