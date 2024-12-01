class BoardRenderer {
  getLighterShade(baseColor) {
    switch (baseColor) {
      case SQUARE_COLORS.REGULAR:
        return '#6B8E23'
      case SQUARE_COLORS.WATER:
        return '#5F9EA0'
      case SQUARE_COLORS.TRAP:
        return '#DEB887'
      case SQUARE_COLORS.DEN:
        return '#8B6B4F'
      case PLAYER_COLORS.RED:
        return '#CC4444'
      case PLAYER_COLORS.YELLOW:
        return '#FFD700'
      default:
        return baseColor
    }
  }

  renderPieces(pieces) {
    const urlParams = new URLSearchParams(window.location.search)
    const debugMode = parseInt(urlParams.get('debug')) || 0
    const timestamp = debugMode ? `?t=${Date.now()}` : ''

    return Object.entries(pieces).map(([position, piece]) => {
      const [x, y] = position.split('_')
      const translateX = x * BOARD_SQUARE_WIDTH + BOARD_UPPER_LEFT_X + (BOARD_SQUARE_WIDTH - PIECE_SIZE) / 2
      const translateY = y * BOARD_SQUARE_HEIGHT + BOARD_UPPER_LEFT_Y + (BOARD_SQUARE_HEIGHT - PIECE_SIZE) / 2

      return React.createElement('g', {
          key: position,
          transform: `translate(${translateX}, ${translateY})`
        },
        React.createElement('image', {
          href: `images/${piece.player === PLAYERS.YELLOW ? 'a' : 'b'}piece.svg${timestamp}`,
          width: PIECE_SIZE,
          height: PIECE_SIZE
        }),
        React.createElement('image', {
          href: `images/${piece.player === PLAYERS.YELLOW ? 'a' : 'b'}${piece.animal}.svg${timestamp}`,
          width: PIECE_SIZE,
          height: PIECE_SIZE
        })
      )
    })
  }

  renderMoveIndicators(lastMove) {
    if (!lastMove) return null

    return [
      React.createElement('rect', {
        key: 'moveFrom',
        x: lastMove.from.x * BOARD_SQUARE_WIDTH + BOARD_UPPER_LEFT_X + BOARD_SQUARE_WIDTH - POTENTIAL_MOVE_LENGTH * 1.3,
        y: lastMove.from.y * BOARD_SQUARE_HEIGHT + BOARD_UPPER_LEFT_Y,
        width: POTENTIAL_MOVE_LENGTH,
        height: POTENTIAL_MOVE_LENGTH,
        fill: 'purple'
      }),
      React.createElement('rect', {
        key: 'moveTo',
        x: lastMove.to.x * BOARD_SQUARE_WIDTH + BOARD_UPPER_LEFT_X + BOARD_SQUARE_WIDTH - POTENTIAL_MOVE_LENGTH * 1.3,
        y: lastMove.to.y * BOARD_SQUARE_HEIGHT + BOARD_UPPER_LEFT_Y,
        width: POTENTIAL_MOVE_LENGTH,
        height: POTENTIAL_MOVE_LENGTH,
        fill: 'purple'
      })
    ]
  }
}

window.boardRenderer = new BoardRenderer()