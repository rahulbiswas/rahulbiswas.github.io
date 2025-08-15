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

function generateOrca(width, height) {
  const orcaY = Math.random() * height; // Can appear anywhere from top to bottom
  const orcaDrift = (Math.random() - 0.5) * 40; // Gentle up/down drift

  return `
    <!-- Majestic Orca -->
    <g opacity="0.7">
      <animateTransform attributeName="transform" type="translate" 
                        values="${-350},0; ${width + 350},${orcaDrift}" dur="45s" repeatCount="indefinite" begin="-20s"/>
      <g transform="translate(0, ${orcaY}) scale(1.9)">
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
  `;
}

function generateSharks(width, height) {
    let sharksHTML = '';
    const sharkCount = 3;

    for (let i = 0; i < sharkCount; i++) {
        const y = Math.random() * height;
        const duration = 12 + Math.random() * 8; // 12-20s
        const delay = Math.random() * duration;
        const scale = 0.6 + Math.random() * 0.5; // 60% to 110% size
        const direction = Math.random() < 0.5 ? 1 : -1; // 1 for LTR, -1 for RTL

        const animationValues = direction === 1 
            ? `${-80 / scale},0; ${width / scale + 80},0`
            : `${width / scale + 80},0; ${-80 / scale},0`;

        const sharkBody = `
            <g transform="scale(${direction}, 1)">
                <ellipse cx="50" cy="0" rx="25" ry="13" fill="#7c8691" stroke="#4b5563" stroke-width="2"/>
                <polygon points="25,0 16,-4 16,4" fill="#7c8691" stroke="#4b5563" stroke-width="2"/>
                <polygon points="50,-13 56,-20 62,-13" fill="#7c8691" stroke="#4b5563" stroke-width="2"/>
                <ellipse cx="46" cy="0" rx="6" ry="3" fill="#7c8691" stroke="#4b5563" stroke-width="2"/>
                <circle cx="62" cy="-3" r="5" fill="#ffffff"/>
                <circle cx="62" cy="-3" r="3" fill="#000000"/>
                <circle cx="63" cy="-5" r="1.5" fill="#ffffff"/>
                <ellipse cx="68" cy="2" rx="2" ry="1" fill="#4b5563"/>
            </g>
        `;

        sharksHTML += `
            <g transform="translate(0, ${y}) scale(${scale})" opacity="0.6">
                <g>
                    <animateTransform attributeName="transform" type="translate" 
                                    values="${animationValues}" dur="${duration}s" 
                                    repeatCount="indefinite" begin="-${delay}s"/>
                    ${sharkBody}
                </g>
            </g>
        `;
    }
    return sharksHTML;
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

      <!-- Swimming Sharks -->
      ${generateSharks(width, height)}

      <!-- Majestic Orca -->
      ${generateOrca(width, height)}
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
