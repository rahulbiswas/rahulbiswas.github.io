const PlatformGame = () => {
  const {position, gameState, platforms, viewportOffset} = useGameLogic()

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <div className="mb-4 text-center">
        <span className="mr-4">Score: {gameState.score}</span>
        <span>High Score: {gameState.highScore}</span>
      </div>

      <div
        className="relative w-full h-96 bg-blue-100 rounded-lg overflow-hidden border-4 border-blue-300"
        style={{
          touchAction: 'none',
          WebkitUserSelect: 'none',
          userSelect: 'none'
        }}
      >
        <img
          src="panda.png"
          alt="Panda"
          className="absolute transform -translate-x-1/2 -translate-y-1/2"
          style={{
            left: 400,
            top: position.y,
            width: '56px',
            height: '40px'
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
              height: '10px'
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