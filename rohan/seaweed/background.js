// Author: Rohan Biswas
/**
 * Ocean background generator for Seaweed game
 * Creates dynamic SVG background with animated bubbles
 */

function generateBubbles(width, height) {
  const bubbleCount = Math.floor(width / 200); // 1 bubble per 200px width
  let bubblesHTML = '';
  
  for (let i = 0; i < bubbleCount; i++) {
    const x = (i + 0.5) * (width / bubbleCount); // Evenly spaced
    const size = 4 + Math.random() * 6; // 4-10px radius
    const duration = 6 + Math.random() * 4; // 6-10s
    const delay = Math.random() * duration; // Random start time
    const drift = -20 + Math.random() * 40; // -20 to +20px horizontal drift
    
    bubblesHTML += `
      <circle cx="${x}" cy="${height}" r="${size}" fill="rgba(255,255,255,0.3)" stroke="rgba(255,255,255,0.4)" opacity="0.3">
        <animateTransform attributeName="transform" type="translate" 
                          values="0,0; ${drift},-${height + 20}" 
                          dur="${duration}s" 
                          repeatCount="indefinite" 
                          begin="-${delay}s"/>
      </circle>
    `;
  }
  
  return `<g>${bubblesHTML}</g>`;
}

function createOceanBackground() {
  const width = window.innerWidth;
  const height = window.innerHeight;
  
  // Remove old background if exists
  const oldBg = document.querySelector('.ocean-background');
  if (oldBg) oldBg.remove();
  
  // Create new background
  const bgDiv = document.createElement('div');
  bgDiv.className = 'ocean-background';
  bgDiv.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;z-index:-1;pointer-events:none;';
  
  bgDiv.innerHTML = `
    <svg width="100%" height="100%" viewBox="0 0 ${width} ${height}" preserveAspectRatio="none">
      <defs>
        <linearGradient id="oceanGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#2563eb;stop-opacity:1" />
          <stop offset="50%" style="stop-color:#1e40af;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#1d4ed8;stop-opacity:1" />
        </linearGradient>
      </defs>
      
      <!-- Ocean gradient background -->
      <rect width="${width}" height="${height}" fill="url(#oceanGradient)"/>
      
      <!-- Center glow effect -->
      <ellipse cx="${width/2}" cy="${height/2}" 
               rx="${Math.min(width, height) * 0.3}" 
               ry="${Math.min(width, height) * 0.3}" 
               fill="rgba(255,255,255,0.05)"/>
      
      <!-- Animated bubbles -->
      ${generateBubbles(width, height)}
    </svg>
  `;
  
  document.body.prepend(bgDiv);
}

// Initialize on load
window.addEventListener('DOMContentLoaded', createOceanBackground);

// Recreate on resize (with debouncing)
let resizeTimeout;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(createOceanBackground, 300);
});

export { createOceanBackground };
