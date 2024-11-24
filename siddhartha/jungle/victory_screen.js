const VictoryScreen = ({winner, onPlayAgain}) => {
  return React.createElement('svg', {viewBox: '0 0 100 67'},
    React.createElement('defs', null,
      React.createElement('linearGradient', {id: 'buttonGradient', x1: '0%', y1: '0%', x2: '0%', y2: '100%'},
        React.createElement('stop', {offset: '0%', style: {stopColor: '#4299e1'}}),
        React.createElement('stop', {offset: '100%', style: {stopColor: '#3182ce'}})
      ),
      React.createElement('filter', {id: 'textShadow', x: '-20%', y: '-20%', width: '140%', height: '140%'},
        React.createElement('feDropShadow', {
          dx: '0.2',
          dy: '0.4',
          stdDeviation: '0.5',
          floodColor: '#000',
          floodOpacity: '0.5'
        })
      )
    ),

    React.createElement('rect', {
      width: '100',
      height: '67',
      fill: winner === PLAYERS.RED ? PLAYER_COLORS.RED : PLAYER_COLORS.YELLOW,
      opacity: 0.9
    }),

    React.createElement('text', {
      x: '50',
      y: '25',
      textAnchor: 'middle',
      fill: 'white',
      fontSize: '8',
      fontFamily: 'Impact',
      filter: 'url(#textShadow)'
    }, `${winner === PLAYERS.RED ? 'RED' : 'YELLOW'} WINS!`),

    React.createElement('g', {transform: 'translate(50, 40)'},
      React.createElement('rect', {
        x: '-20',
        y: '-6',
        width: '40',
        height: '12',
        rx: '2',
        fill: 'url(#buttonGradient)',
        stroke: '#2b6cb0',
        strokeWidth: '0.5'
      }),
      React.createElement('text', {
        textAnchor: 'middle',
        fill: 'white',
        fontSize: '5',
        fontFamily: 'Arial',
        filter: 'url(#textShadow)'
      }, 'PLAY AGAIN')
    )
  )
}