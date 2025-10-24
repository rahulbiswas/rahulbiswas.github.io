const GameBoardRenderer = ({
  pieces,
  lastMove,
  selectedPieceKey,
  validMoves,
  debugMode,
  boardDimensions,
  isPlayerTurn,
  language
}) => {
  const handleSquareClick = (x, y) => {
    const pos = `${x}_${y}`
    if (pieces[pos] && !selectedPieceKey) {
      window.gameManager.handlePieceSelection(pos)
    } else {
      window.gameManager.handleSquareSelection(pos)
    }
  }

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

  return React.createElement('svg', {
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
    window.boardRenderer.renderPieces(pieces, handleSquareClick, language),
    window.boardRenderer.renderValidMoveIndicators(validMoves),
    window.boardRenderer.renderMoveIndicators(lastMove, !isPlayerTurn ? PLAYERS.RED : PLAYERS.YELLOW)
  )
}

window.GameBoardRenderer = GameBoardRenderer
