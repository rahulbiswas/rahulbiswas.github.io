const JungleGame = () => {
  const [currentWindow, setCurrentWindow] = React.useState('home')
  const [pieces, setPieces] = React.useState(initialPieces)
  const [turn, setTurn] = React.useState(1)
  const [isFirstClick, setIsFirstClick] = React.useState(true)
  const [firstClickKey, setFirstClickKey] = React.useState(null)
  const [movedPiece, setMovedPiece] = React.useState(['0'])
  const contentRef = React.useRef(null)

  const handleClick = (e) => {
    if (!contentRef.current) return

    const rect = contentRef.current.getBoundingClientRect()
    const clickX = (e.clientX - rect.left) * 100 / rect.width
    const clickY = (e.clientY - rect.top) * 67 / rect.height

    if (currentWindow === 'game') {
      gameManager.handleGameClick(
        clickX,
        clickY,
        {pieces, turn, isFirstClick, firstClickKey},
        {setPieces, setTurn, setIsFirstClick, setFirstClickKey, setMovedPiece, setCurrentWindow}
      )
    } else {
      gameManager.handleMenuNavigation(clickX, clickY, currentWindow, setCurrentWindow)
    }
  }

  return (
    React.createElement('div', {className: 'game-container'},
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
        currentWindow === 'game' && React.createElement(GameBoard, {
          turn: turn,
          pieces: pieces,
          movedPiece: movedPiece,
          selectedPiece: firstClickKey
        })
      )
    )
  )
}

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(React.createElement(JungleGame))