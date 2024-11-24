class BoardRenderer {
  getLighterShade(baseColor) {
    switch (baseColor) {
      case '#4CAF50':
        return '#81c784'
      case '#2196F3':
        return '#64b5f6'
      case '#FFC107':
        return '#ffd54f'
      case '#9C27B0':
        return '#ce93d8'
      case PLAYER_COLORS.RED:
        return '#d77373'
      case PLAYER_COLORS.YELLOW:
        return '#ffe14d'
      default:
        return baseColor
    }
  }

  renderPieces(pieces) {
    return Object.entries(pieces).map(([position, piece]) => {
      const [x, y] = position.split('_')
      const translateX = x * BOARD_SQUARE_WIDTH + BOARD_UPPER_LEFT_X + (BOARD_SQUARE_WIDTH - PIECE_SIZE) / 2
      const translateY = y * BOARD_SQUARE_HEIGHT + BOARD_UPPER_LEFT_Y + (BOARD_SQUARE_HEIGHT - PIECE_SIZE) / 2

      return React.createElement('g', {
          key: position,
          transform: `translate(${translateX}, ${translateY})`
        },
        React.createElement('image', {
          href: `images/${piece.player === PLAYERS.YELLOW ? 'a' : 'b'}piece.svg`,
          width: PIECE_SIZE,
          height: PIECE_SIZE
        }),
        React.createElement('image', {
          href: `images/${piece.player === PLAYERS.YELLOW ? 'a' : 'b'}${piece.animal}.svg`,
          width: PIECE_SIZE,
          height: PIECE_SIZE
        })
      )
    })
  }

  renderMoveIndicators(movedPiece) {
    if (movedPiece[0][0] === '0') return null

    return [
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
  }
}

window.boardRenderer = new BoardRenderer()