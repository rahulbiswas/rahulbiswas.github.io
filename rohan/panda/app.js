const useWindowSize = () => {
  const [dimensions, setDimensions] = React.useState({
    width: window.innerWidth,
    height: window.innerHeight
  })

  React.useEffect(() => {
    const handleResize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      })
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return dimensions
}

const getResponsiveValues = (width) => {
  if (width < 375) {
    return {
      pandaSize: '40px',
      platformHeight: '8px'
    }
  } else if (width < 428) {
    return {
      pandaSize: '50px',
      platformHeight: '10px'
    }
  } else {
    return {
      pandaSize: '56px',
      platformHeight: '12px'
    }
  }
}

const PlatformGame = () => {
  const {position, gameState, platforms, viewportOffset} = useGameLogic()
  const dimensions = useWindowSize()
  const responsiveValues = getResponsiveValues(dimensions.width)

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <div className="mb-4 text-center">
        <span className="mr-4">Score: {gameState.score}</span>
        <span className="mr-4">High Score: {gameState.highScore}</span>
        <span>committed 1738</span>
      </div>

      <div
        className="relative w-full bg-blue-100 rounded-lg overflow-hidden border-4 border-blue-300"
        style={{
          touchAction: 'none',
          WebkitUserSelect: 'none',
          userSelect: 'none',
          WebkitTouchCallout: 'none',
          WebkitTapHighlightColor: 'transparent',
          height: '70vh',
          position: 'fixed',
          left: 0,
          right: 0
        }}
      >
        <img
          src="panda.png"
          alt="Panda"
          className="absolute transform -translate-x-1/2 -translate-y-1/2"
          style={{
            left: '50%',
            top: position.y,
            width: responsiveValues.pandaSize,
            height: 'auto',
            aspectRatio: '1.4'
          }}
        />

        {platforms.map((platform, index) => (
          <div
            key={index}
            className="absolute bg-amber-700 rounded"
            style={{
              left: `${platform.x - viewportOffset}px`,
              top: platform.y,
              width: platform.width,
              height: responsiveValues.platformHeight
            }}
          />
        ))}

        {gameState.isGameOver && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="text-white text-center">
              <h2 className="text-3xl mb-4">Game Over!</h2>
              <p className="text-xl mb-2">Score: {gameState.score}</p>
              <p className="text-lg">Press SPACE or tap to try again</p>
            </div>
          </div>
        )}
      </div>

      <div className="mt-4 text-center text-gray-600">
        <p>{gameState.isGameOver ? 'Press SPACE or tap to restart!' : 'Press SPACE or tap to jump!'}</p>
      </div>
    </div>
  )
}