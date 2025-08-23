let map;
let thermalData;
let currentOverlay;
let currentIndex = 0;
let playInterval;
let isPlaying = false;

// Initialize map
function initMap() {
    map = L.map('map').setView([37.7749, -122.4194], 9);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);
}

// Convert temperature array to color values
function temperatureToColor(temp, minTemp, maxTemp) {
    if (temp === null) return [0, 0, 0, 0]; // Transparent for null
    
    const normalized = (temp - minTemp) / (maxTemp - minTemp);
    const colors = [
        [0, 0, 128],      // Dark blue
        [0, 128, 255],    // Light blue  
        [0, 255, 255],    // Cyan
        [128, 255, 0],    // Light green
        [255, 255, 0],    // Yellow
        [255, 128, 0],    // Orange
        [255, 0, 0]       // Red
    ];
    
    const segmentSize = 1 / (colors.length - 1);
    const segmentIndex = Math.floor(normalized / segmentSize);
    const segmentProgress = (normalized - segmentIndex * segmentSize) / segmentSize;
    
    const startColor = colors[Math.min(segmentIndex, colors.length - 1)];
    const endColor = colors[Math.min(segmentIndex + 1, colors.length - 1)];
    
    return [
        Math.round(startColor[0] + (endColor[0] - startColor[0]) * segmentProgress),
        Math.round(startColor[1] + (endColor[1] - startColor[1]) * segmentProgress),
        Math.round(startColor[2] + (endColor[2] - startColor[2]) * segmentProgress),
        255
    ];
}

// Create image overlay from temperature data
function createThermalOverlay(dateData) {
    const canvas = document.createElement('canvas');
    canvas.width = dateData.shape[1];
    canvas.height = dateData.shape[0];
    const ctx = canvas.getContext('2d');
    const imageData = ctx.createImageData(canvas.width, canvas.height);
    
    const minTemp = thermalData.global_temp_range.min;
    const maxTemp = thermalData.global_temp_range.max;
    
    let pixelIndex = 0;
    for (let row = 0; row < dateData.shape[0]; row++) {
        for (let col = 0; col < dateData.shape[1]; col++) {
            const temp = dateData.temperatures[row][col];
            const color = temperatureToColor(temp, minTemp, maxTemp);
            
            imageData.data[pixelIndex] = color[0];     // R
            imageData.data[pixelIndex + 1] = color[1]; // G
            imageData.data[pixelIndex + 2] = color[2]; // B
            imageData.data[pixelIndex + 3] = color[3]; // A
            pixelIndex += 4;
        }
    }
    
    ctx.putImageData(imageData, 0, 0);
    
    const bounds = L.latLngBounds(
        [dateData.bounds.south, dateData.bounds.west],
        [dateData.bounds.north, dateData.bounds.east]
    );
    
    return L.imageOverlay(canvas.toDataURL(), bounds, {
        opacity: 0.7
    });
}

// Update display for current date
function updateDisplay(index) {
    if (!thermalData || !thermalData.dates[index]) return;
    
    const dateData = thermalData.dates[index];
    
    // Remove current overlay
    if (currentOverlay) {
        map.removeLayer(currentOverlay);
    }
    
    // Add new overlay
    currentOverlay = createThermalOverlay(dateData);
    currentOverlay.addTo(map);
    
    // Update UI
    document.getElementById('current-date').textContent = dateData.date;
    document.getElementById('temp-stats').textContent = 
        `Min: ${dateData.stats.min}°F | Max: ${dateData.stats.max}°F | Mean: ${dateData.stats.mean}°F`;
    
    currentIndex = index;
}

// Toggle play/pause functionality
function togglePlay() {
    const playBtn = document.getElementById('play-pause-btn');
    
    if (isPlaying) {
        // Stop playing
        clearInterval(playInterval);
        isPlaying = false;
        playBtn.textContent = '▶️ Play';
        playBtn.classList.remove('playing');
    } else {
        // Start playing
        isPlaying = true;
        playBtn.textContent = '⏸️ Pause';
        playBtn.classList.add('playing');
        
        playInterval = setInterval(() => {
            let nextIndex = (currentIndex + 1) % thermalData.dates.length;
            updateDisplay(nextIndex);
            document.getElementById('time-slider').value = nextIndex;
        }, 1000); // 1 second per day
    }
}

// Initialize controls
function initControls() {
    const slider = document.getElementById('time-slider');
    const startDate = document.getElementById('start-date');
    const endDate = document.getElementById('end-date');
    const tempMin = document.getElementById('temp-min');
    const tempMax = document.getElementById('temp-max');
    const playBtn = document.getElementById('play-pause-btn');
    
    slider.max = thermalData.dates.length - 1;
    startDate.textContent = thermalData.dates[0].date;
    endDate.textContent = thermalData.dates[thermalData.dates.length - 1].date;
    tempMin.textContent = thermalData.global_temp_range.min + '°F';
    tempMax.textContent = thermalData.global_temp_range.max + '°F';
    
    slider.addEventListener('input', function() {
        updateDisplay(parseInt(this.value));
    });
    
    playBtn.addEventListener('click', togglePlay);
    
    // Show controls and colorbar
    document.getElementById('controls').style.display = 'block';
    document.getElementById('colorbar').style.display = 'block';
    document.getElementById('loading').style.display = 'none';
}

// Load thermal data
async function loadThermalData() {
    try {
        const response = await fetch('bayarea_data.json');
        thermalData = await response.json();
        
        console.log('Loaded thermal data:', thermalData);
        
        // Center map on first date bounds
        const firstBounds = thermalData.dates[0].bounds;
        const center = [
            (firstBounds.north + firstBounds.south) / 2,
            (firstBounds.east + firstBounds.west) / 2
        ];
        map.setView(center, 9);
        
        initControls();
        updateDisplay(0);
        
    } catch (error) {
        console.error('Error loading thermal data:', error);
        document.getElementById('loading').innerHTML = 
            '<h3>❌ Error loading data</h3><p>Make sure bayarea_data.json exists in the same directory</p>';
    }
}

// Initialize everything
document.addEventListener('DOMContentLoaded', function() {
    initMap();
    loadThermalData();
});
