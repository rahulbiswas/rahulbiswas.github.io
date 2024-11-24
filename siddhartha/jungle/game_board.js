const GameBoard = ({turn, pieces, movedPiece, selectedPiece}) => {
  const getLighterShade = (baseColor) => {
    switch (baseColor) {
      case '#4CAF50':
        return '#81c784'
      case '#2196F3':
        return '#64b5f6'
      case '#FFC107':
        return '#ffd54f'
      case '#9C27B0':
        return '#ce93d8'
      default:
        return baseColor
    }
  }

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
          const squareFill = isSelected ? getLighterShade(fill) : fill

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

    Object.entries(pieces).map(([position, piece]) => {
      const [x, y] = position.split('_')
      const translateX = x * BOARD_SQUARE_WIDTH + BOARD_UPPER_LEFT_X + (BOARD_SQUARE_WIDTH - PIECE_SIZE) / 2
      const translateY = y * BOARD_SQUARE_HEIGHT + BOARD_UPPER_LEFT_Y + (BOARD_SQUARE_HEIGHT - PIECE_SIZE) / 2

      return React.createElement('g', {
          key: position,
          transform: `translate(${translateX}, ${translateY})`
        },
        React.createElement('image', {
          href: `images/${piece.player === 0 ? 'a' : 'b'}piece.svg`,
          width: PIECE_SIZE,
          height: PIECE_SIZE
        }),
        React.createElement('image', {
          href: `images/${piece.player === 0 ? 'a' : 'b'}${piece.animal}.svg`,
          width: PIECE_SIZE,
          height: PIECE_SIZE
        })
      )
    }),

    movedPiece[0][0] !== '0' && [
      React.createElement('rect', {
        key: 'move1',
        x: movedPiece[0][0] * BOARD_SQUARE_WIDTH + BOARD_UPPER_LEFT_X + BOARD_SQUARE_WIDTH - POTENTIAL_MOVE_LENGTH * 1.3,
        y: movedPiece[0][1] * BOARD_SQUARE_HEIGHT + BOARD_UPPER_LEFT_Y,
        width: POTENTIAL_MOVE_LENGTH,
        height: POTENTIAL_MOVE_LENGTH,
        fill: 'purple'
      }),
      React.createElement('rect', {
        key: 'move2',
        x: movedPiece[1][0] * BOARD_SQUARE_WIDTH + BOARD_UPPER_LEFT_X + BOARD_SQUARE_WIDTH - POTENTIAL_MOVE_LENGTH * 1.3,
        y: movedPiece[1][1] * BOARD_SQUARE_HEIGHT + BOARD_UPPER_LEFT_Y,
        width: POTENTIAL_MOVE_LENGTH,
        height: POTENTIAL_MOVE_LENGTH,
        fill: 'purple'
      })
    ]
  )
}