const PLATFORM_CONFIG = {
   minWidth: 150,
   maxWidth: 150,
   minGap: 90,
   maxGap: 120,
   minY: 200,
   maxY: 320,
   viewportBuffer: 800,
   heightVariation: 40
};

const GAME_CONSTANTS = {
   gravity: 0.2,
   jumpForce: -9,
   scrollSpeed: 1,
   initialPosition: {
      x: 100,
      y: 200,
      velocityY: 0,
      isJumping: false
   },
   initialPlatforms: [
      { x: 50, y: 300, width: 150 },
   ]
};

const generatePlatform = (lastPlatformX, lastPlatformY) => {
   const width = PLATFORM_CONFIG.minWidth +
      Math.random() * (PLATFORM_CONFIG.maxWidth - PLATFORM_CONFIG.minWidth);

   const gap = PLATFORM_CONFIG.minGap +
      Math.random() * (PLATFORM_CONFIG.maxGap - PLATFORM_CONFIG.minGap);

   const minHeightDiff = -PLATFORM_CONFIG.heightVariation;
   const maxHeightDiff = PLATFORM_CONFIG.heightVariation;
   const heightDiff = minHeightDiff + Math.random() * (maxHeightDiff - minHeightDiff);

   let y = Math.min(
      Math.max(
         lastPlatformY + heightDiff,
         PLATFORM_CONFIG.minY
      ),
      PLATFORM_CONFIG.maxY
   );

   return {
      x: lastPlatformX + gap + width/2,
      y,
      width
   };
};