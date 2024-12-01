const HomeMenu = () => React.createElement('svg', {viewBox: '0 0 100 67'},
  React.createElement('defs', null,
    React.createElement('linearGradient', {id: 'backgroundGradient', x1: '0%', y1: '0%', x2: '0%', y2: '100%'},
      React.createElement('stop', {offset: '0%', style: {stopColor: '#1a365d'}}),
      React.createElement('stop', {offset: '100%', style: {stopColor: '#2c5282'}})
    ),
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

  React.createElement('rect', {width: '100', height: '67', fill: 'url(#backgroundGradient)'}),

  React.createElement('circle', {cx: '50', cy: '0', r: '20', fill: '#4299e1', opacity: '0.1'}),
  React.createElement('circle', {cx: '85', cy: '60', r: '15', fill: '#4299e1', opacity: '0.1'}),
  React.createElement('circle', {cx: '15', cy: '50', r: '10', fill: '#4299e1', opacity: '0.1'}),

  React.createElement('g', {transform: 'translate(50, 18)'},
    React.createElement('text', {
      textAnchor: 'middle',
      fill: '#fff',
      fontSize: '12',
      fontFamily: 'Impact, Arial Black, sans-serif',
      filter: 'url(#textShadow)'
    }, 'Dou Shou Qi'),
    React.createElement('text', {
      y: '7',
      textAnchor: 'middle',
      fill: '#90cdf4',
      fontSize: '4',
      fontFamily: 'Arial, sans-serif'
    }, 'The Animal Chess Game')
  ),

  React.createElement('g', {transform: 'translate(50, 35)'},
    React.createElement('rect', {
      x: '-15',
      y: '-6',
      width: '30',
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
      fontFamily: 'Arial, sans-serif',
      filter: 'url(#textShadow)'
    }, 'PLAY')
  ),
  React.createElement('text', {
    x: '98',
    y: '65.5',
    fill: '#90cdf4',
    fontSize: '2',
    fontFamily: 'Arial, sans-serif',
    textAnchor: 'end'
  }, 'v1.0')
)