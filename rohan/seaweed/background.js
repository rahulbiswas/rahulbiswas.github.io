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

      <!-- Majestic Orca (swimming left to right on bottom) -->
      <g opacity="0.7">
        <animateTransform attributeName="transform" type="translate" 
                          values="${-350},0; ${width + 350},0" dur="45s" repeatCount="indefinite" begin="-20s"/>
        <g transform="translate(0, ${height - 64}) scale(1.9)">
          <!-- Dynamic curved body -->
          <path d="M -62 2 Q -40 -20 -10 -18 Q 20 -16 50 -12 Q 75 -5 85 2 Q 75 9 50 16 Q 20 20 -10 18 Q -40 22 -62 2" fill="#000000" stroke="#1a1a1a" stroke-width="1"/>
          <!-- Angled dorsal fin -->
          <path d="M -18 -18 Q -12 -35 -6 -18 Q -12 -14 -18 -18" fill="#000000" stroke="#1a1a1a" stroke-width="1"/>
          <!-- Reduced white belly -->
          <ellipse cx="8" cy="12" rx="32" ry="8" fill="#ffffff"/>
          <!-- Eye patch -->
          <ellipse cx="68" cy="-8" rx="8" ry="5" fill="#ffffff" transform="rotate(-5 68 -8)"/>
          <!-- Eye -->
          <circle cx="71" cy="-6" r="2.5" fill="#000000"/>
          <circle cx="71" cy="-6" r="1" fill="#ffffff"/>
          <!-- Small chin mark -->
          <ellipse cx="78" cy="10" rx="5" ry="3" fill="#ffffff"/>
          <!-- Curved tail -->
          <path d="M -62 2 Q -80 -10 -90 -4 Q -82 2 -80 8 Q -90 14 -80 8 Q -70 2 -62 2" fill="#000000" stroke="#1a1a1a" stroke-width="1"/>
        </g>
      </g>
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
