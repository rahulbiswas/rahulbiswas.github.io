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

    window.addEventListener('touchstart', handleJump, {passive: false})
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
            const pandaBottom = newY + 40
            const pandaWidth = 29
            const relativeX = 400
            const platformLeft = platform.x - (newX - 400)

            if (relativeX - pandaWidth / 2 >= platformLeft &&
              relativeX + pandaWidth / 2 <= platformLeft + platform.width &&
              pandaBottom >= platform.y &&
              pandaBottom <= platform.y + 10 &&
              prev.velocityY >= 0) {
              newY = platform.y - 40
              newVelocityY = 0
              isJumping = false
            }
          })

          if (newY > 450) {
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