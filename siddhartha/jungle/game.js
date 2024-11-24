const JungleGame = () => {
  const [currentWindow, setCurrentWindow] = React.useState('home')
  const [pieces, setPieces] = React.useState(initialPieces)
  const [selectedPieceKey, setSelectedPieceKey] = React.useState(null)
  const [movedPiece, setMovedPiece] = React.useState(['0'])
  const [winner, setWinner] = React.useState(null)
  const [isPlayerTurn, setIsPlayerTurn] = React.useState(true)
  const contentRef = React.useRef(null)

  React.useEffect(() => {
    if (!isPlayerTurn && !winner) {
      const timeoutId = setTimeout(() => {
        const aiMove = window.aiPlayer.getRandomMove(pieces, 0)
        if (aiMove) {
          gameManager.handleMove(
            aiMove.from,
            aiMove.to,
            pieces,
            {setPieces, setSelectedPieceKey, setMovedPiece, setWinner}
          )
          setIsPlayerTurn(true)
        }
      }, 500)
      return () => clearTimeout(timeoutId)
    }
  }, [pieces, winner, isPlayerTurn])

  const resetGame = () => {
    setPieces(initialPieces)
    setSelectedPieceKey(null)
    setMovedPiece(['0'])
    setWinner(null)
    setIsPlayerTurn(true)
  }

  const handleClick = (e) => {
    if (!contentRef.current) return

    const rect = contentRef.current.getBoundingClientRect()
    const clickX = (e.clientX - rect.left) * 100 / rect.width
    const clickY = (e.clientY - rect.top) * 67 / rect.height

    if (currentWindow === 'game') {
      if (!isPlayerTurn || winner !== null) return

      gameManager.handlePlayerClick(
        clickX,
        clickY,
        {pieces, selectedPieceKey},
        {setPieces, setSelectedPieceKey, setMovedPiece, setCurrentWindow, setWinner, setIsPlayerTurn}
      )
    } else {
      navigationManager.handleMenuNavigation(clickX, clickY, currentWindow, setCurrentWindow)
    }
  }

  return React.createElement('div', {className: 'game-container'},
    React.createElement('div', {
        ref: contentRef,
        className: 'game-content',
        onClick: handleClick
      },
      currentWindow === 'home' && React.createElement(HomeMenu),
      window.ruleScreens?.includes(currentWindow) &&
      React.createElement('img', {
        src: `images/${currentWindow}.png`,
        alt: `${currentWindow} rules`
      }),
      currentWindow === 'game' && (
        winner !== null
          ? React.createElement(VictoryScreen, {
            winner: winner,
            onPlayAgain: resetGame
          })
          : React.createElement(GameBoard, {
            pieces: pieces,
            movedPiece: movedPiece,
            selectedPieceKey: selectedPieceKey,
            isPlayerTurn: isPlayerTurn
          })
      )
    )
  )
}

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(React.createElement(JungleGame))