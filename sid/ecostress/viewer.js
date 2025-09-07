let map;
let allEvents; // To store the list from events.json
let currentManifest; // To store the manifest for the currently selected event
let shardCache = {}; // A cache to store loaded daily data shards for smooth playback
let currentOverlay;
let currentIndex = 0;
let playInterval;
let isPlaying = false;

// The new home for our data in the cloud!
const GCS_BASE_URL = 'https://storage.googleapis.com/ecostress-siddhartha/';

// Initialize map
function initMap() {
    map = L.map('map').setView([36.7783, -119.4179], 6); // Center on California
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);
}

// Convert temperature array to color values
function temperatureToColor(temp, minTemp, maxTemp) {
    if (temp === null) return [0, 0, 0, 0]; // Transparent for null
    
    const clampedTemp = Math.max(minTemp, Math.min(temp, maxTemp));
    const normalized = (clampedTemp - minTemp) / (maxTemp - minTemp);
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

// Create image overlay from a daily data shard
function createThermalOverlay(shardData, manifest) {
    const canvas = document.createElement('canvas');
    canvas.width = shardData.shape[1];
    canvas.height = shardData.shape[0];
    const ctx = canvas.getContext('2d');
    const imageData = ctx.createImageData(canvas.width, canvas.height);
    
    const minTemp = manifest.display_temp_range.min;
    const maxTemp = manifest.display_temp_range.max;
    
    let pixelIndex = 0;
    for (let row = 0; row < shardData.shape[0]; row++) {
        for (let col = 0; col < shardData.shape[1]; col++) {
            const temp = shardData.temperatures[row][col];
            const color = temperatureToColor(temp, minTemp, maxTemp);
            imageData.data[pixelIndex + 0] = color[0]; // R
            imageData.data[pixelIndex + 1] = color[1]; // G
            imageData.data[pixelIndex + 2] = color[2]; // B
            imageData.data[pixelIndex + 3] = color[3]; // A
            pixelIndex += 4;
        }
    }
    
    ctx.putImageData(imageData, 0, 0);
    
    const bounds = L.latLngBounds(
        [shardData.bounds.south, shardData.bounds.west],
        [shardData.bounds.north, shardData.bounds.east]
    );
    
    return L.imageOverlay(canvas.toDataURL(), bounds, { opacity: 0.7 });
}

// Fetches a daily shard (from cache if possible) and updates the map
async function updateDisplay(index) {
    if (!currentManifest) return;
    
    const dateEntry = currentManifest.dates[index];
    const dateStr = dateEntry.date;
    document.getElementById('loading').style.display = 'block';

    try {
        let shardData;
        if (shardCache[dateStr]) {
            shardData = shardCache[dateStr]; // Use cached data
        } else {
            const shardFilename = dateEntry.shard_file;
            const response = await fetch(`${GCS_BASE_URL}${shardFilename}`);
            if (!response.ok) throw new Error(`Failed to fetch ${shardFilename}`);
            shardData = await response.json();
            shardCache[dateStr] = shardData; // Save to cache
        }

        if (currentOverlay) {
            map.removeLayer(currentOverlay);
        }
        
        currentOverlay = createThermalOverlay(shardData, currentManifest);
        currentOverlay.addTo(map);
        
        let displayTime = '';
        if (shardData.time_utc) {
            const timeString = shardData.time_utc.replace(' UTC', '');
            const utcDate = new Date(`${dateStr}T${timeString}Z`);
            displayTime = utcDate.toLocaleTimeString('en-US', {
                timeZone: 'America/Los_Angeles', hour: '2-digit', minute: '2-digit', hour12: true
            });
        }

        document.getElementById('current-date').textContent = `${dateStr} at ${displayTime}`;
        document.getElementById('temp-stats').textContent = `Min: ${shardData.stats.min}°F | Max: ${shardData.stats.max}°F | Mean: ${shardData.stats.mean}°F`;
        document.getElementById('time-slider').value = index;
        currentIndex = index;

    } catch (error) {
        console.error("Error fetching or displaying shard:", error);
    } finally {
        document.getElementById('loading').style.display = 'none';
    }
}

function togglePlay() {
    const playBtn = document.getElementById('play-pause-btn');
    if (!currentManifest) return;
    
    if (isPlaying) {
        clearInterval(playInterval);
        isPlaying = false;
        playBtn.textContent = '▶️ Play';
    } else {
        isPlaying = true;
        playBtn.textContent = '⏸️ Pause';
        playInterval = setInterval(() => {
            let nextIndex = (currentIndex + 1) % currentManifest.dates.length;
            updateDisplay(nextIndex);
        }, 1200);
    }
}

function initControls(manifest) {
    const slider = document.getElementById('time-slider');
    slider.max = manifest.dates.length - 1;
    slider.value = 0;
    document.getElementById('start-date').textContent = manifest.dates[0].date;
    document.getElementById('end-date').textContent = manifest.dates[manifest.dates.length - 1].date;
}

function generateManifestFilename(event) {
    const eventNameSlug = event.event_name.toLowerCase().replace(/ /g, '_').replace(/,/g, '');
    return `${String(event.event_id).padStart(2, '0')}_${eventNameSlug}_manifest.json`;
}

async function loadEventManifest(event) {
    shardCache = {};
    document.getElementById('loading').style.display = 'block';
    document.getElementById('loading').innerHTML = `<h3>🔥 Loading manifest for ${event.event_name}...</h3>`;
    document.getElementById('map-controls').style.display = 'none';
    document.getElementById('colorbar').style.display = 'none';

    try {
        const manifestFilename = generateManifestFilename(event);
        const response = await fetch(`${GCS_BASE_URL}${manifestFilename}`);
        if (!response.ok) throw new Error(`Failed to fetch ${manifestFilename}`);
        currentManifest = await response.json();
        
        console.log(`Loaded manifest for ${event.event_name}:`, currentManifest);

        if (playInterval) clearInterval(playInterval);
        isPlaying = false;
        document.getElementById('play-pause-btn').textContent = '▶️ Play';

        const bounds = currentManifest.overall_bounds;
        map.fitBounds([[bounds.south, bounds.west], [bounds.north, bounds.east]]);

        initControls(currentManifest);
        await updateDisplay(0);

        document.getElementById('map-controls').style.display = 'block';
        document.getElementById('colorbar').style.display = 'block';

    } catch (error) {
        console.error('Error loading event manifest:', error);
        document.getElementById('loading').innerHTML = `<h3>❌ Error loading manifest for ${event.event_name}</h3><p>Make sure the manifest file exists in the cloud.</p>`;
    }
}

function populateChooser(events) {
    const chooser = document.getElementById('event-chooser');
    chooser.innerHTML = ''; 
    events.forEach((event, index) => {
        const option = document.createElement('option');
        option.value = index;
        option.textContent = event.event_name;
        chooser.appendChild(option);
    });
    chooser.addEventListener('change', (e) => {
        const selectedEvent = allEvents[parseInt(e.target.value)];
        loadEventManifest(selectedEvent);
    });
}

async function initDashboard() {
    try {
        const response = await fetch(`${GCS_BASE_URL}events.json`);
        const eventsData = await response.json();
        allEvents = eventsData.california_environmental_events_2024;

        if (!allEvents || allEvents.length === 0) throw new Error('No events in manifest');

        populateChooser(allEvents);
        document.getElementById('controls').style.display = 'block';
        await loadEventManifest(allEvents[0]);

    } catch (error) {
        console.error('Error initializing dashboard:', error);
        document.getElementById('loading').innerHTML = '<h3>❌ Error loading event list</h3><p>Make sure events.json exists and is public.</p>';
    }
}

document.addEventListener('DOMContentLoaded', function() {
    initMap();
    initDashboard();
    document.getElementById('play-pause-btn').addEventListener('click', togglePlay);
    document.getElementById('time-slider').addEventListener('input', function() {
        updateDisplay(parseInt(this.value));
    });
});
