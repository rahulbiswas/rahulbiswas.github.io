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
  return React.createElement('button', {
    className: `debug-button ${debugMode ? 'active' : ''}`,
    onClick: () => setDebugMode(!debugMode)
  }, 'DEBUG')
}