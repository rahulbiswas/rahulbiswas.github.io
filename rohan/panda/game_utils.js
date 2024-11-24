const PLATFORM_CONFIG = {
  minWidth: window.innerWidth * 0.3,
  maxWidth: window.innerWidth * 0.3,
  minGap: window.innerWidth * 0.2,
  maxGap: window.innerWidth * 0.25,
  minY: window.innerHeight * 0.3,
  maxY: window.innerHeight * 0.5,
  viewportBuffer: window.innerWidth,
  heightVariation: window.innerHeight * 0.08
}

const GAME_CONSTANTS = {
  gravity: window.innerHeight * 0.0003,
  jumpForce: window.innerHeight * -0.015,
  scrollSpeed: window.innerWidth * 0.002,
  initialPosition: {
    x: window.innerWidth * 0.25,
    y: window.innerHeight * 0.3,
    velocityY: 0,
    isJumping: false,
    canJump: true
  },
  initialPlatforms: [
    {x: window.innerWidth * 0.1, y: window.innerHeight * 0.6, width: window.innerWidth * 0.3},
  ]
}

const generatePlatform = (lastPlatformX, lastPlatformY) => {
  const width = PLATFORM_CONFIG.minWidth +
    Math.random() * (PLATFORM_CONFIG.maxWidth - PLATFORM_CONFIG.minWidth)

  const gap = PLATFORM_CONFIG.minGap +
    Math.random() * (PLATFORM_CONFIG.maxGap - PLATFORM_CONFIG.minGap)

  const minHeightDiff = -PLATFORM_CONFIG.heightVariation
  const maxHeightDiff = PLATFORM_CONFIG.heightVariation
  const heightDiff = minHeightDiff + Math.random() * (maxHeightDiff - minHeightDiff)

  let y = Math.min(
    Math.max(
      lastPlatformY + heightDiff,
      PLATFORM_CONFIG.minY
    ),
    PLATFORM_CONFIG.maxY
  )

  return {
    x: lastPlatformX + gap + width / 2,
    y,
    width
  }
}