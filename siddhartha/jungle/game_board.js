const GameBoard = ({turn, pieces, movedPiece, selectedPiece}) => {
  return React.createElement('svg', {viewBox: '0 0 100 67'},
    React.createElement('rect', {
      width: '100',
      height: '67',
      fill: turn === 1 ? '#C25B5B' : '#87CEEB'
    }),

    React.createElement('g', {transform: `translate(${BOARD_UPPER_LEFT_X}, ${BOARD_UPPER_LEFT_Y})`},
      Array.from({length: 9}, (_, row) =>
        Array.from({length: 7}, (_, col) => {
          let fill = '#4CAF50'

          if ((col === 1 || col === 2 || col === 4 || col === 5) &&
            (row === 3 || row === 4 || row === 5)) {
            fill = '#2196F3'
          }

          if ((row === 0 || row === 8) && (col === 2 || col === 4) ||
            ((row === 1 || row === 7) && col === 3)) {
            fill = '#FFC107'
          }

          if ((row === 0 || row === 8) && col === 3) {
            fill = '#9C27B0'
          }

          const isSelected = selectedPiece === `${col}_${row}`
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