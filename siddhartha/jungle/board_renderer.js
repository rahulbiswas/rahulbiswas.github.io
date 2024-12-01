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

  renderMoveIndicators(lastMove, player) {
    if (!lastMove) return null

    const arrowSize = 2.5
    const arrowColor = player === PLAYERS.RED ? ARROW_COLORS.RED : ARROW_COLORS.YELLOW

    const createArrow = (x, y) => {
      const baseX = x * BOARD_SQUARE_WIDTH + BOARD_UPPER_LEFT_X + BOARD_SQUARE_WIDTH / 2
      const baseY = y * BOARD_SQUARE_HEIGHT + BOARD_UPPER_LEFT_Y + BOARD_SQUARE_HEIGHT / 2
      const dx = lastMove.to.x - lastMove.from.x
      const dy = lastMove.to.y - lastMove.from.y

      let angle
      if (dx > 0) angle = 180
      else if (dx < 0) angle = 0
      else if (dy > 0) angle = 270
      else if (dy < 0) angle = 90

      const midpoint = [
        baseX - arrowSize * Math.cos(angle * Math.PI / 180),
        baseY - arrowSize * Math.sin(angle * Math.PI / 180)
      ]
      const leftTip = [
        baseX - 1.5 * arrowSize * Math.cos(angle * Math.PI / 180) + arrowSize * Math.cos((angle - 25) * Math.PI / 180),
        baseY - 1.5 * arrowSize * Math.sin(angle * Math.PI / 180) + arrowSize * Math.sin((angle - 25) * Math.PI / 180)
      ]
      const rightTip = [
        baseX - 1.5 * arrowSize * Math.cos(angle * Math.PI / 180) + arrowSize * Math.cos((angle + 25) * Math.PI / 180),
        baseY - 1.5 * arrowSize * Math.sin(angle * Math.PI / 180) + arrowSize * Math.sin((angle + 25) * Math.PI / 180)
      ]

      return React.createElement('path', {
        d: `M ${midpoint[0]},${midpoint[1]} l ${leftTip[0] - midpoint[0]},${leftTip[1] - midpoint[1]} M ${midpoint[0]},${midpoint[1]} l ${rightTip[0] - midpoint[0]},${rightTip[1] - midpoint[1]}`,
        stroke: arrowColor,
        strokeWidth: 0.4,
        strokeLinecap: 'round',
        fill: 'none'
      })
    }

    return [
      createArrow(lastMove.from.x, lastMove.from.y),
      React.createElement('rect', {
        key: 'moveTo',
        x: lastMove.to.x * BOARD_SQUARE_WIDTH + BOARD_UPPER_LEFT_X,
        y: lastMove.to.y * BOARD_SQUARE_HEIGHT + BOARD_UPPER_LEFT_Y,
        width: BOARD_SQUARE_WIDTH,
        height: BOARD_SQUARE_HEIGHT,
        fill: arrowColor,
        opacity: '0.3'
      })
    ]
  }
}

window.boardRenderer = new BoardRenderer()