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
            ? `${-100 / scale},0; ${width / scale + 100},0`
            : `${width / scale + 100},0; ${-100 / scale},0`;

        let sharkBody = '';
        const isHappy = Math.random() < 0.4; // 40% chance of being a happy shark

        if (isHappy) {
            sharkBody = `
                <g transform="scale(${direction}, 1)">
                    <ellipse cx="55" cy="0" rx="30" ry="12" fill="#6b7280" stroke="#374151" stroke-width="2"/>
                    <polygon points="25,0 15,-5 15,5" fill="#6b7280" stroke="#374151" stroke-width="2"/>
                    <polygon points="55,-12 62,-20 70,-12" fill="#6b7280" stroke="#374151" stroke-width="2"/>
                    <ellipse cx="50" cy="0" rx="8" ry="4" fill="#6b7280" stroke="#374151" stroke-width="2"/>
                    <circle cx="68" cy="-3" r="4" fill="#ffffff"/>
                    <circle cx="68" cy="-3" r="2" fill="#000000"/>
                    <path d="M72 0 Q75 3 78 0" stroke="#374151" stroke-width="2" fill="none"/>
                </g>
            `;
        } else {
            sharkBody = `
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
        }

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

function generateSubmarines(width, height) {
    let subsHTML = '';

    // 1. Yellow Submarine (RTL)
    const y1 = Math.random() * height;
    const d1 = 18 + Math.random() * 8;
    const del1 = Math.random() * d1;
    subsHTML += `
        <g transform="translate(0, ${y1}) scale(0.9)" opacity="0.7">
            <animateTransform attributeName="transform" type="translate" 
                            values="${width+100},${y1}; -100,${y1}" dur="${d1}s" 
                            repeatCount="indefinite" begin="-${del1}s"/>
            <g transform="scale(-1, 1)">
                <ellipse cx="50" cy="0" rx="40" ry="15" fill="#fbbf24" stroke="#f59e0b" stroke-width="2"/>
                <rect x="45" y="-15" width="10" height="15" rx="5" fill="#fbbf24" stroke="#f59e0b" stroke-width="2"/>
                <rect x="49" y="-20" width="2" height="8" fill="#6b7280"/>
                <ellipse cx="90" cy="0" rx="8" ry="4" fill="none" stroke="#f59e0b" stroke-width="2"/>
                <line x1="82" y1="0" x2="98" y2="0" stroke="#f59e0b" stroke-width="2"/>
                <line x1="90" y1="-8" x2="90" y2="8" stroke="#f59e0b" stroke-width="2"/>
                <circle cx="30" cy="0" r="6" fill="#60a5fa" stroke="#1d4ed8" stroke-width="2"/>
                <circle cx="40" cy="0" r="4" fill="#60a5fa" stroke="#1d4ed8" stroke-width="2"/>
            </g>
        </g>
    `;

    // 2. Steampunk Submarine (LTR)
    const y2 = Math.random() * height;
    const d2 = 15 + Math.random() * 6;
    const del2 = Math.random() * d2;
    subsHTML += `
        <g transform="translate(0, ${y2}) scale(0.8)" opacity="0.7">
            <animateTransform attributeName="transform" type="translate" 
                            values="-100,${y2}; ${width+100},${y2}" dur="${d2}s" 
                            repeatCount="indefinite" begin="-${del2}s"/>
            <ellipse cx="40" cy="0" rx="25" ry="10" fill="#ea580c" stroke="#c2410c" stroke-width="2"/>
            <rect x="37" y="-15" width="6" height="10" rx="3" fill="#ea580c" stroke="#c2410c" stroke-width="2"/>
            <rect x="39" y="-20" width="1.5" height="5" fill="#92400e"/>
            <ellipse cx="5" cy="0" rx="5" ry="3" fill="none" stroke="#c2410c" stroke-width="2"/>
            <line x1="0" y1="0" x2="10" y2="0" stroke="#c2410c" stroke-width="2"/>
            <line x1="5" y1="-5" x2="5" y2="5" stroke="#c2410c" stroke-width="2"/>
            <circle cx="55" cy="0" r="4" fill="#fbbf24" stroke="#f59e0b" stroke-width="2"/>
            <circle cx="48" cy="0" r="2.5" fill="#fbbf24" stroke="#f59e0b" stroke-width="2"/>
            <rect x="32" y="8" width="16" height="2" rx="1" fill="#92400e"/>
            <circle cx="35" cy="12" r="1.5" fill="#92400e"/>
            <circle cx="45" cy="12" r="1.5" fill="#92400e"/>
        </g>
    `;

    // 3. Luxury Submarine (RTL)
    const y3 = Math.random() * height;
    const d3 = 25 + Math.random() * 10;
    const del3 = Math.random() * d3;
    subsHTML += `
        <g transform="translate(0, ${y3}) scale(1.1)" opacity="0.7">
            <animateTransform attributeName="transform" type="translate" 
                            values="${width+150},${y3}; -150,${y3}" dur="${d3}s" 
                            repeatCount="indefinite" begin="-${del3}s"/>
            <g transform="scale(-1, 1)">
                <ellipse cx="70" cy="0" rx="55" ry="18" fill="#1e293b" stroke="#0f172a" stroke-width="2"/>
                <ellipse cx="70" cy="0" rx="55" ry="18" fill="none" stroke="#fbbf24" stroke-width="1"/>
                <rect x="60" y="-18" width="20" height="15" rx="8" fill="#1e293b" stroke="#fbbf24" stroke-width="2"/>
                <rect x="20" y="-3" width="30" height="6" rx="3" fill="#92400e"/>
                <ellipse cx="45" cy="0" rx="12" ry="8" fill="#dbeafe" stroke="#0284c7" stroke-width="2"/>
                <rect x="27" y="-5" width="8" height="10" rx="4" fill="#dbeafe" stroke="#0284c7" stroke-width="2"/>
                <g transform="translate(125, 0)">
                    <circle cx="0" cy="0" r="7" fill="none" stroke="#fbbf24" stroke-width="2"/>
                    <path d="M-5,-5 Q0,0 5,-5" stroke="#fbbf24" stroke-width="2" fill="none"/>
                    <path d="M-5,5 Q0,0 5,5" stroke="#fbbf24" stroke-width="2" fill="none"/>
                </g>
            </g>
        </g>
    `;

    return subsHTML;
}

function generateSeaweed(width, height) {
    let seaweedHTML = '';
    const seaweedCount = Math.floor(width / 60);
    const maxHeight = height * 0.25;

    for (let i = 0; i < seaweedCount; i++) {
        const x = (i + 0.5) * (width / seaweedCount) + (Math.random() - 0.5) * 30;
        const h = maxHeight * (0.6 + Math.random() * 0.4);
        const dur = 4 + Math.random() * 2;
        const delay = Math.random() * dur;
        const sway = 3 + Math.random() * 2;
        const q1 = h * 0.3, q2 = h * 0.6, q3 = h;

        const path = `M${x} ${height} Q${x - 2} ${height - q1} ${x + 2} ${height - q2} Q${x - 4} ${height - (q2 + q1)} ${x} ${height - q3}`;
        
        seaweedHTML += `
            <g>
                <animateTransform attributeName="transform" type="rotate" 
                                values="0 ${x} ${height}; ${sway} ${x} ${height}; -${sway} ${x} ${height}; 0 ${x} ${height}" 
                                dur="${dur}s" repeatCount="indefinite" begin="-${delay}s"/>
                <path d="${path}" stroke="#10b981" stroke-width="3" fill="none" stroke-linecap="round"/>
            </g>
        `;
    }

    return `<g opacity="0.4">${seaweedHTML}</g>`;
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
      
      <!-- Swimming Submarines -->
      ${generateSubmarines(width, height)}

      <!-- Swimming Sharks -->
      ${generateSharks(width, height)}

      <!-- Majestic Orca -->
      ${generateOrca(width, height)}

      <!-- Seaweed Forest -->
      ${generateSeaweed(width, height)}

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
