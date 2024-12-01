const GameBoard = ({pieces, lastMove, selectedPieceKey, isPlayerTurn}) => {
  const [debugMode, setDebugMode] = React.useState(false)
  const [lastMoveTime, setLastMoveTime] = React.useState(null)

  React.useEffect(() => {
    const handleAIMoveTime = (event) => {
      setLastMoveTime(event.detail.time)
    }
    window.addEventListener('ai-move-time', handleAIMoveTime)
    return () => window.removeEventListener('ai-move-time', handleAIMoveTime)
  }, [])

  const handleSquareClick = (x, y) => {
    const pos = `${x}_${y}`
    if (pieces[pos]) {
      window.gameManager.handlePieceSelection(pos)
    } else {
      window.gameManager.handleSquareSelection(pos)
    }
  }

  const renderSquares = () => {
    return Array.from({length: 9}, (_, row) =>
      Array.from({length: 7}, (_, col) => {
        let fill = SQUARE_COLORS.REGULAR

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

        const isSelected = selectedPieceKey === `${col}_${row}`
        const squareFill = isSelected ? window.boardRenderer.getLighterShade(fill) : fill

        return React.createElement('rect', {
          key: `${col}-${row}`,
          x: col,
          y: row,
          width: 1,
          height: 1,
          fill: squareFill,
          stroke: '#000',
          strokeWidth: '0.02',
          onClick: () => handleSquareClick(col, row),
          style: {cursor: 'pointer'},
          id: `square-${col}-${row}`,
          className: `square ${isTrap ? 'trap' : ''} ${(row === 0 || row === 8) && col === 3 ? 'den' : ''} ${
            (col === 1 || col === 2 || col === 4 || col === 5) &&
            (row === 3 || row === 4 || row === 5) ? 'water' : ''}`
        })
      })
    )
  }

  const urlParams = new URLSearchParams(window.location.search)
  debugEnabled = parseInt(urlParams.get('debug')) || 0

  return React.createElement('svg', {
    viewBox: '0 0 100 100',
    id: 'game-board',
    style: {
      backgroundColor: isPlayerTurn ? PLAYER_COLORS.RED : PLAYER_COLORS.YELLOW,
      transition: 'background-color 0.3s ease'
    }
  },
    React.createElement('defs', {id: 'game-board-defs'},
      React.createElement('linearGradient', {id: 'buttonGradient', x1: '0%', y1: '0%', x2: '0%', y2: '100%'},
        React.createElement('stop', {offset: '0%', style: {stopColor: '#8B4513'}, id: 'gradient-stop-1'}),
        React.createElement('stop', {offset: '100%', style: {stopColor: '#654321'}, id: 'gradient-stop-2'})
      )
    ),

    debugEnabled ? React.createElement(DebugButton, {debugMode, setDebugMode}) : null,

    React.createElement('g', {
        transform: 'translate(2, 2)',
        id: 'back-button',
        onClick: () => window.gameManager.handleBackClick()
      },
      React.createElement('rect', {
        width: '6',
        height: '4',
        fill: 'url(#buttonGradient)',
        stroke: '#2F4F4F',
        strokeWidth: '0.5',
        style: {cursor: 'pointer'},
        id: 'back-button-bg'
      }),
      React.createElement('text', {
        x: '3',
        y: '3',
        fill: '#F5E6D3',
        fontSize: '2',
        fontFamily: 'Impact, Arial Black, sans-serif',
        textAnchor: 'middle',
        id: 'back-button-text'
      }, 'BACK')
    ),

    debugEnabled ? React.createElement('text', {
      x: '3',
      y: '12',
      fill: '#4A4A4A',
      fontSize: '2',
      fontFamily: 'Arial',
      textAnchor: 'left',
      id: 'ai-depth-info'
    }, `AI Depth: ${window.aiPlayer.maxDepth}`) : null,

    debugEnabled ? (lastMoveTime && React.createElement('text', {
      x: '3',
      y: '16',
      fill: '#4A4A4A',
      fontSize: '2',
      fontFamily: 'Arial',
      textAnchor: 'left',
      id: 'ai-move-time'
    }, `Last AI move: ${lastMoveTime.toFixed(2)}ms`)) : null,

    React.createElement('svg', {
      viewBox: '0 0 7 9',
      x: '12',
      y: '2',
      width: '70',
      height: '90',
      id: 'board-grid',
    },
      renderSquares(),
      React.createElement(DebugOverlay, {debugMode}),
      window.boardRenderer.renderPieces(pieces, handleSquareClick),
      window.boardRenderer.renderMoveIndicators(lastMove, !isPlayerTurn ? PLAYERS.RED : PLAYERS.YELLOW)
    )
  )
}