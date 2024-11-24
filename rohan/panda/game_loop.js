const useGameLoop = ({position, setPosition, gameState, setGameState, platforms, updatePlatforms, resetGame}) => {
  const gameLoopRef = React.useRef(null)

  React.useEffect(() => {
    const handleJump = (e) => {
      e.preventDefault()
      if (e.type === 'touchstart' || e.code === 'Space') {
        if (gameState.isGameOver) {
          resetGame()
        } else if (!position.isJumping) {
          setPosition(prev => ({
            ...prev,
            velocityY: GAME_CONSTANTS.jumpForce,
            isJumping: true
          }))
        }
      }
    }

    window.addEventListener('touchstart', handleJump, {
      passive: false,
      capture: true
    })
    window.addEventListener('keydown', handleJump)
    return () => {
      window.removeEventListener('touchstart', handleJump)
      window.removeEventListener('keydown', handleJump)
    }
  }, [position.isJumping, gameState.isGameOver, resetGame])

  React.useEffect(() => {
    const gameLoop = () => {
      if (!gameState.isGameOver) {
        setPosition(prev => {
          const newX = prev.x + GAME_CONSTANTS.scrollSpeed
          let newY = prev.y + prev.velocityY
          let newVelocityY = prev.velocityY + GAME_CONSTANTS.gravity
          let isJumping = true

          platforms.forEach(platform => {
            const responsiveValues = getResponsiveValues(window.innerWidth)
            const pandaSize = parseInt(responsiveValues.pandaSize)
            const platformHeight = parseInt(responsiveValues.platformHeight)

            const collisionBuffer = 5

            const pandaBottom = newY + (pandaSize * 0.8)
            const pandaWidth = pandaSize * 0.6

            const relativeX = window.innerWidth * 0.5
            const platformLeft = platform.x - (newX - window.innerWidth * 0.5)

            if (relativeX - pandaWidth / 2 >= platformLeft - collisionBuffer &&
              relativeX + pandaWidth / 2 <= platformLeft + platform.width + collisionBuffer &&
              pandaBottom >= platform.y - collisionBuffer &&
              pandaBottom <= platform.y + platformHeight + collisionBuffer &&
              prev.velocityY >= 0) {

              newY = platform.y - (pandaSize * 0.8)
              newVelocityY = 0
              isJumping = false
            }
          })

          if (newY > window.innerHeight * 0.9) {
            setGameState(prev => {
              const newHighScore = Math.max(prev.highScore, prev.score)
              localStorage.setItem('highScore', newHighScore.toString())
              return {
                ...prev,
                isGameOver: true,
                highScore: newHighScore
              }
            })
          }

          return {
            x: newX,
            y: newY,
            velocityY: newVelocityY,
            isJumping
          }
        })

        setGameState(prev => ({
          ...prev,
          score: Math.floor(position.x / 100)
        }))

        updatePlatforms()
      }

      gameLoopRef.current = requestAnimationFrame(gameLoop)
    }

    gameLoopRef.current = requestAnimationFrame(gameLoop)
    return () => cancelAnimationFrame(gameLoopRef.current)
  }, [updatePlatforms, gameState.isGameOver, position.x])
}