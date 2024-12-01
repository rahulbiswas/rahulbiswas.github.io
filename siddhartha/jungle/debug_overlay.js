const DebugOverlay = ({debugMode}) => {
  if (!debugMode) return null

  return React.createElement('g', null,
    Array.from({length: 9}, (_, row) =>
      Array.from({length: 7}, (_, col) =>
        React.createElement('text', {
          key: `debug-${col}-${row}`,
          x: col + 0.5,
          y: row + 0.5,
          fill: '#000',
          fontSize: '0.2',
          textAnchor: 'middle',
          alignmentBaseline: 'middle'
        }, `${col},${row}`)
      )
    )
  )
}

const DebugButton = ({debugMode, setDebugMode}) => {
  return React.createElement('g', {
      transform: 'translate(82, 2)',
      onClick: () => setDebugMode(!debugMode),
      style: {cursor: 'pointer'}
    },
    React.createElement('rect', {
      width: '17',
      height: '11',
      rx: '2',
      fill: debugMode ? '#A83232' : '#556B2F',
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
    }, 'DEBUG')
  )
}