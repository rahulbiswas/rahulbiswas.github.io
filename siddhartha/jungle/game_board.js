const BackButton = ({}) => {
  return React.createElement('button', {
    id: 'back-button',
    onClick: () => window.gameManager.handleBackClick(),
    className: 'back-button'
  }, 'BACK')
}

const GameBoard = ({pieces, lastMove, selectedPieceKey, isPlayerTurn, validMoves}) => {
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

  const renderSquares = () => {
    return Array.from({length: 9}, (_, row) =>
      Array.from({length: 7}, (_, col) => {
        let fill = SQUARE_COLORS.REGULAR
        const pos = `${col}_${row}`

        if ((col === 1 || col === 2 || col === 4 || col === 5) &&
          (row === 3 || row === 4 || row === 5)) {
          fill = SQUARE_COLORS.WATER
        }

        const isTrap = TRAP_SQUARES.YELLOW.some(trap => trap.X === col && trap.Y === row) ||
          TRAP_SQUARES.RED.some(trap => trap.X === col && trap.Y === row)
        if (isTrap) {
          fill = SQUARE_COLORS.TRAP
        }

        if ((row === 0 || row === 8) && col === 3) {
          fill = SQUARE_COLORS.DEN
        }

        return React.createElement('rect', {
          key: `square-${col}-${row}`,
          x: col,
          y: row,
          width: 1,
          height: 1,
          fill: fill,
          stroke: '#000',
          strokeWidth: '0.02',
          onClick: () => handleSquareClick(col, row),
          style: {cursor: 'pointer'},
          id: `square-${col}-${row}`,
          className: `square ${validMoves.has(pos) ? 'valid-move' : ''}`
        })
      })
    )
  }

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

  const handleSquareClick = (x, y) => {
    const pos = `${x}_${y}`
    if (pieces[pos] && !selectedPieceKey) {
      window.gameManager.handlePieceSelection(pos)
    } else {
      window.gameManager.handleSquareSelection(pos)
    }
  }

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
    React.createElement('svg', {
        viewBox: '0 0 7 9',
        style: {
          position: 'absolute',
          left: `${boardDimensions.x}px`,
          top: `${boardDimensions.y}px`,
          width: `${boardDimensions.width}px`,
          height: `${boardDimensions.height}px`,
          transition: 'all 0.3s ease'
        },
        id: 'board-grid'
      },
      renderSquares(),
      React.createElement(DebugOverlay, {debugMode}),
      window.boardRenderer.renderPieces(pieces, handleSquareClick),
      window.boardRenderer.renderValidMoveIndicators(validMoves),
      window.boardRenderer.renderMoveIndicators(lastMove, !isPlayerTurn ? PLAYERS.RED : PLAYERS.YELLOW)
    ),

    React.createElement(BackButton),
    debugEnabled ? React.createElement('div', {
      className: 'debug-info',
      id: 'ai-depth-info'
    }, `AI Depth: ${window.aiPlayer.maxDepth}`) : null,
    debugEnabled ? lastMoveTime && React.createElement('div', {
      className: 'debug-info',
      id: 'ai-move-time'
    }, `Last AI move: ${lastMoveTime.toFixed(2)}ms`) : null,
    debugEnabled ? React.createElement(DebugButton, {debugMode, setDebugMode}) : null,
  )
}