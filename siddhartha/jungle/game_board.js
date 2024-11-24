const GameBoard = ({pieces, movedPiece, selectedPieceKey, isPlayerTurn}) => {
  return React.createElement('svg', {viewBox: '0 0 100 67'},
    React.createElement('rect', {
      width: '100',
      height: '67',
      fill: isPlayerTurn ? PLAYER_COLORS.RED : PLAYER_COLORS.YELLOW
    }),

    React.createElement('g', {transform: `translate(${BOARD_UPPER_LEFT_X}, ${BOARD_UPPER_LEFT_Y})`},
      Array.from({length: 9}, (_, row) =>
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
            x: col * BOARD_SQUARE_WIDTH,
            y: row * BOARD_SQUARE_HEIGHT,
            width: BOARD_SQUARE_WIDTH,
            height: BOARD_SQUARE_HEIGHT,
            fill: squareFill,
            stroke: '#000',
            strokeWidth: '0.1'
          })
        })
      )
    ),

    React.createElement('g', {transform: 'translate(3, 2)'},
      React.createElement('rect', {
        width: '17',
        height: '11',
        rx: '2',
        fill: '#98FB98',
        stroke: '#2F4F4F',
        strokeWidth: '0.5'
      }),
      React.createElement('text', {
        x: '8.5',
        y: '7.5',
        fill: '#4A4A4A',
        fontSize: '3',
        fontFamily: 'Impact, Arial Black, sans-serif',
        textAnchor: 'middle'
      }, 'BACK')
    ),

    window.boardRenderer.renderPieces(pieces),
    window.boardRenderer.renderMoveIndicators(movedPiece)
  )
}