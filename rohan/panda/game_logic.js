const useGameLogic = () => {
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

   return {
      position,
      gameState,
      platforms,
      viewportOffset,
      resetGame
   };
};