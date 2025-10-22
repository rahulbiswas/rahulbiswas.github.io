const GameBoardContainer = ({pieces, lastMove, selectedPieceKey, isPlayerTurn, validMoves}) => {
  const [debugMode, setDebugMode] = React.useState(false)
  const [lastMoveTime, setLastMoveTime] = React.useState(null)
  const [boardDimensions, setBoardDimensions] = React.useState({
    width: 0,
    height: 0,
    x: 0,
    y: 0
  })

  const containerRef = React.useRef(null)
  const MARGIN_PERCENT = 2

  React.useEffect(() => {
    const updateBoardDimensions = () => {
      if (containerRef.current) {
        const containerRect = containerRef.current.getBoundingClientRect()
        const containerWidth = containerRect.width
        const containerHeight = containerRect.height

        const marginX = containerWidth * (MARGIN_PERCENT / 100)
        const marginY = containerHeight * (MARGIN_PERCENT / 100)
        const availableWidth = containerWidth - (2 * marginX)
        const availableHeight = containerHeight - (2 * marginY)

        const boardAspectRatio = 7 / 9
        let width, height

        if (availableWidth / availableHeight > boardAspectRatio) {
          height = availableHeight
          width = height * boardAspectRatio
        } else {
          width = availableWidth
          height = width / boardAspectRatio
        }

        const x = (containerWidth - width) / 2
        const y = (containerHeight - height) / 2

        setBoardDimensions({
          width,
          height,
          x,
          y
        })
      }
    }

    updateBoardDimensions()

    const resizeObserver = new ResizeObserver(updateBoardDimensions)
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current)
    }

    return () => resizeObserver.disconnect()
  }, [])

  React.useEffect(() => {
    const handleAIMoveTime = (event) => {
      setLastMoveTime(event.detail.time)
    }
    window.addEventListener('ai-move-time', handleAIMoveTime)
    return () => window.removeEventListener('ai-move-time', handleAIMoveTime)
  }, [])

  const urlParams = new URLSearchParams(window.location.search)
  debugEnabled = parseInt(urlParams.get('debug')) || 0

  return React.createElement('div', {
      id: 'game-board',
      ref: containerRef,
      style: {
        backgroundColor: isPlayerTurn ? PLAYER_COLORS.RED : PLAYER_COLORS.YELLOW,
        transition: 'background-color 0.3s ease',
        width: '100%',
        height: '100%',
        position: 'relative',
        overflow: 'hidden'
      }
    },
    React.createElement(GameBoardRenderer, {
      pieces,
      lastMove,
      selectedPieceKey,
      validMoves,
      debugMode,
      boardDimensions,
      isPlayerTurn
    }),
    debugEnabled ? React.createElement('div', {
      className: 'debug-info',
      id: 'ai-depth-info'
    }, `AI Depth: ${window.aiPlayer.maxDepth}`) : null,
    debugEnabled ? lastMoveTime && React.createElement('div', {
      className: 'debug-info',
      id: 'ai-move-time'
    }, `Last AI move: ${lastMoveTime.toFixed(2)}ms`) : null,
    debugEnabled ? React.createElement(DebugButton, {debugMode, setDebugMode}) : null
  )
}

window.GameBoardContainer = GameBoardContainer
