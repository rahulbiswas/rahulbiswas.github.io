const PlatformGame = () => {
  // Game states
  const [position, setPosition] = React.useState({
    y: 200,
    velocityY: 0,
    isJumping: false
  });

  // Test platforms - each platform has x, y (from top), and width
  const platforms = [
    { x: 50, y: 300, width: 200 },  // Starting platform (wider)
    { x: 300, y: 250, width: 100 }, // Higher platform
    { x: 500, y: 350, width: 150 }, // Lower platform
    { x: 700, y: 200, width: 120 }  // Highest platform
  ];

  const gameLoopRef = React.useRef(null);
  
  // Physics constants
  const gravity = 0.5;
  const jumpForce = -12;

  // Handle jumping
  React.useEffect(() => {
    const handleJump = (e) => {
      if (e.code === 'Space' && !position.isJumping) {
        setPosition(prev => ({
          ...prev,
          velocityY: jumpForce,
          isJumping: true
        }));
      }
    };

    window.addEventListener('keydown', handleJump);
    return () => window.removeEventListener('keydown', handleJump);
  }, [position.isJumping]);

  // Game loop for physics
  React.useEffect(() => {
    const gameLoop = () => {
      setPosition(prev => {
        // Calculate new position with gravity
        let newY = prev.y + prev.velocityY;
        let newVelocityY = prev.velocityY + gravity;
        let isJumping = true;

        // Check platform collisions
        platforms.forEach(platform => {
          const pandaBottom = newY + 40; // 40 is panda height
          const onPlatformX = 100 >= platform.x && 100 <= platform.x + platform.width;
          
          if (onPlatformX && 
              pandaBottom >= platform.y && 
              pandaBottom <= platform.y + 10 && 
              prev.velocityY >= 0) {
            newY = platform.y - 40;
            newVelocityY = 0;
            isJumping = false;
          }
        });

        // Keep panda within game bounds
        if (newY > 400) { // Ground level
          newY = 400;
          newVelocityY = 0;
          isJumping = false;
        }

        return {
          y: newY,
          velocityY: newVelocityY,
          isJumping
        };
      });

      gameLoopRef.current = requestAnimationFrame(gameLoop);
    };

    gameLoopRef.current = requestAnimationFrame(gameLoop);
    return () => cancelAnimationFrame(gameLoopRef.current);
  }, []);

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <div className="relative w-full h-96 bg-blue-100 rounded-lg overflow-hidden border-4 border-blue-300">
        {/* Panda - fixed X position for now */}
        <div
          className="absolute text-4xl transform -translate-x-1/2 -translate-y-1/2"
          style={{ 
            left: 100, // Fixed X position
            top: position.y
          }}
        >
          🐼
        </div>

        {/* Platforms */}
        {platforms.map((platform, index) => (
          <div
            key={index}
            className="absolute bg-green-700 rounded"
            style={{
              left: platform.x,
              top: platform.y,
              width: platform.width,
              height: '10px'
            }}
          />
        ))}
      </div>

      <div className="mt-4 text-center text-gray-600">
        <p>Press SPACE to jump!</p>
      </div>
    </div>
  );
};