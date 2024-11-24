const useGameLogic = () => {
  const [position, setPosition] = React.useState(GAME_CONSTANTS.initialPosition)

  const [gameState, setGameState] = React.useState({
    score: 0,
    isGameOver: false,
    highScore: parseInt(localStorage.getItem('highScore') || '0')
  })
  const [platforms, setPlatforms] = React.useState(GAME_CONSTANTS.initialPlatforms)

  const updatePlatforms = React.useCallback(() => {
    setPlatforms(currentPlatforms => {
      const validPlatforms = currentPlatforms.filter(
        platform => platform.x > position.x - PLATFORM_CONFIG.viewportBuffer
      )

      const lastPlatform = validPlatforms[validPlatforms.length - 1]
      if (lastPlatform.x < position.x + PLATFORM_CONFIG.viewportBuffer) {
        const newPlatforms = []
        let lastX = lastPlatform.x
        let lastY = lastPlatform.y

        while (lastX < position.x + PLATFORM_CONFIG.viewportBuffer + window.innerWidth) {
          const newPlatform = generatePlatform(lastX, lastY)
          newPlatforms.push(newPlatform)
          lastX = newPlatform.x
          lastY = newPlatform.y
        }

        return [...validPlatforms, ...newPlatforms]
      }

      return validPlatforms
    })
  }, [position.x])

  const resetGame = React.useCallback(() => {
    setPosition(GAME_CONSTANTS.initialPosition)
    setPlatforms(GAME_CONSTANTS.initialPlatforms)
    setGameState(prev => ({
      ...prev,
      score: 0,
      isGameOver: false
    }))
  }, [])

  useGameLoop({
    position,
    setPosition,
    gameState,
    setGameState,
    platforms,
    updatePlatforms,
    resetGame
  })

  const viewportOffset = position.x - (window.innerWidth * 0.5)

  return {
    position,
    gameState,
    platforms,
    viewportOffset,
    resetGame
  }
}