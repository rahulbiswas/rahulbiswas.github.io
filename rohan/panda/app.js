const PlatformGame = () => {
  const [position, setPosition] = React.useState(GAME_CONSTANTS.initialPosition);

  const [gameState, setGameState] = React.useState({
    score: 0,
    isGameOver: false,
    highScore: parseInt(localStorage.getItem('highScore') || '0')
  });

  const [platforms, setPlatforms] = React.useState(GAME_CONSTANTS.initialPlatforms);

  const updatePlatforms = React.useCallback(() => {
    setPlatforms(currentPlatforms => {
      const validPlatforms = currentPlatforms.filter(
         platform => platform.x > position.x - PLATFORM_CONFIG.viewportBuffer
      );

      const lastPlatform = validPlatforms[validPlatforms.length - 1];
      if (lastPlatform.x < position.x + PLATFORM_CONFIG.viewportBuffer) {
        const newPlatforms = [];
        let lastX = lastPlatform.x;
        let lastY = lastPlatform.y;

        while (lastX < position.x + PLATFORM_CONFIG.viewportBuffer + 400) {
          const newPlatform = generatePlatform(lastX, lastY);
          newPlatforms.push(newPlatform);
          lastX = newPlatform.x;
          lastY = newPlatform.y;
        }

        return [...validPlatforms, ...newPlatforms];
      }

      return validPlatforms;
    });
  }, [position.x]);

  const resetGame = React.useCallback(() => {
    setPosition(GAME_CONSTANTS.initialPosition);
    setPlatforms(GAME_CONSTANTS.initialPlatforms);
    setGameState(prev => ({
      ...prev,
      score: 0,
      isGameOver: false
    }));
  }, []);

  const gameLoopRef = React.useRef(null);

  React.useEffect(() => {
    const handleJump = (e) => {
      if (e.code === 'Space') {
        if (gameState.isGameOver) {
          resetGame();
        } else if (!position.isJumping) {
          setPosition(prev => ({
            ...prev,
            velocityY: GAME_CONSTANTS.jumpForce,
            isJumping: true
          }));
        }
      }
    };

    window.addEventListener('keydown', handleJump);
    return () => window.removeEventListener('keydown', handleJump);
  }, [position.isJumping, gameState.isGameOver, resetGame]);

  React.useEffect(() => {
    const gameLoop = () => {
      if (!gameState.isGameOver) {
        setPosition(prev => {
          const newX = prev.x + GAME_CONSTANTS.scrollSpeed;
          let newY = prev.y + prev.velocityY;
          let newVelocityY = prev.velocityY + GAME_CONSTANTS.gravity;
          let isJumping = true;

          platforms.forEach(platform => {
            const pandaBottom = newY + 40;
            const relativeX = 400;
            const platformLeft = platform.x - (newX - 400);

            if (relativeX >= platformLeft &&
               relativeX <= platformLeft + platform.width &&
               pandaBottom >= platform.y &&
               pandaBottom <= platform.y + 10 &&
               prev.velocityY >= 0) {
              newY = platform.y - 40;
              newVelocityY = 0;
              isJumping = false;
            }
          });

          if (newY > 450) {
            setGameState(prev => {
              const newHighScore = Math.max(prev.highScore, prev.score);
              localStorage.setItem('highScore', newHighScore.toString());
              return {
                ...prev,
                isGameOver: true,
                highScore: newHighScore
              };
            });
          }

          return {
            x: newX,
            y: newY,
            velocityY: newVelocityY,
            isJumping
          };
        });

        setGameState(prev => ({
          ...prev,
          score: Math.floor(position.x / 100)
        }));

        updatePlatforms();
      }

      gameLoopRef.current = requestAnimationFrame(gameLoop);
    };

    gameLoopRef.current = requestAnimationFrame(gameLoop);
    return () => cancelAnimationFrame(gameLoopRef.current);
  }, [updatePlatforms, gameState.isGameOver, position.x]);

  const viewportOffset = position.x - 400;

  return (
     <div className="w-full max-w-4xl mx-auto p-4">
       <div className="mb-4 text-center">
         <span className="mr-4">Score: {gameState.score}</span>
         <span>High Score: {gameState.highScore}</span>
       </div>

       <div className="relative w-full h-96 bg-blue-100 rounded-lg overflow-hidden border-4 border-blue-300">
         <div
            className="absolute text-4xl transform -translate-x-1/2 -translate-y-1/2"
            style={{
              left: 400,
              top: position.y
            }}
         >
           🐼
         </div>

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
                <p className="text-lg">Press SPACE to try again</p>
              </div>
            </div>
         )}
       </div>

       <div className="mt-4 text-center text-gray-600">
         <p>{gameState.isGameOver ? 'Press SPACE to restart!' : 'Press SPACE to jump!'}</p>
       </div>
     </div>
  );
};