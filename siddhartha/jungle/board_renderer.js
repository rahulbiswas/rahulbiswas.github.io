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

  renderPieces(pieces, onPieceClick) {
    const urlParams = new URLSearchParams(window.location.search)
    const debugMode = parseInt(urlParams.get('debug')) || 0
    const timestamp = debugMode ? `?t=${Date.now()}` : ''

    return Object.entries(pieces).map(([position, piece]) => {
      const [x, y] = position.split('_')
      const translateX = x * 1 + 0.125
      const translateY = y * 1 + 0.125

      return React.createElement('g', {
          key: position,
          transform: `translate(${translateX}, ${translateY})`,
          onClick: () => onPieceClick(x, y),
          style: {cursor: 'pointer'},
          id: `piece-${position}`
        },
        React.createElement('image', {
          href: `images/${piece.player === PLAYERS.YELLOW ? 'a' : 'b'}piece.svg${timestamp}`,
          width: 0.75,
          height: 0.75,
          id: `piece-base-${position}`
        }),
        React.createElement('image', {
          href: `images/${piece.player === PLAYERS.YELLOW ? 'a' : 'b'}${piece.animal}.svg${timestamp}`,
          width: 0.75,
          height: 0.75,
          id: `piece-animal-${position}`
        })
      )
    })
  }

  renderMoveIndicators(lastMove, player) {
    if (!lastMove) return null

    const arrowSize = 0.25
    const arrowColor = player === PLAYERS.RED ? ARROW_COLORS.RED : ARROW_COLORS.YELLOW

    const createArrow = (x, y) => {
      const baseX = x * 1 + 0.5
      const baseY = y * 1 + 0.5
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
        strokeWidth: 0.04,
        strokeLinecap: 'round',
        fill: 'none',
        id: `move-arrow-${x}-${y}`
      })
    }

    return [
      createArrow(lastMove.from.x, lastMove.from.y),
      React.createElement('rect', {
        key: 'moveTo',
        x: lastMove.to.x,
        y: lastMove.to.y,
        width: 1,
        height: 1,
        fill: arrowColor,
        opacity: '0.3',
        id: 'move-target-highlight'
      })
    ]
  }

  renderValidMoveIndicators(validMoves) {
    if (!validMoves?.size) return null
    
    return Array.from(validMoves).map(pos => {
      const [x, y] = pos.split('_').map(Number)
      return React.createElement('circle', {
        key: `move-indicator-${pos}`,
        cx: x + 0.5,
        cy: y + 0.5,
        r: 0.15,
        fill: 'rgba(255, 255, 255, 0.3)',
        stroke: 'rgba(255, 255, 255, 0.5)',
        strokeWidth: '0.05',
        className: 'move-indicator',
        pointerEvents: 'none'
      })
    })
  }
}

window.boardRenderer = new BoardRenderer()