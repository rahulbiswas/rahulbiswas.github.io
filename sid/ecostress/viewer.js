let map;
let allEvents; // To store the list from events.json
let currentManifest; // To store the manifest for the currently selected event
let shardCache = {}; // A cache to store loaded daily data shards for smooth playback
let currentOverlay;
let currentIndex = 0;
let playInterval;
let isPlaying = false;

const GCS_BASE_URL = 'https://storage.googleapis.com/ecostress-siddhartha/';

// Initialize map
function initMap() {
    map = L.map('map').setView([36.7783, -119.4179], 6); // Center on California
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);
}

// Create image overlay from a daily data shard
function createThermalOverlay(shardData) {
    const imageUrl = GCS_BASE_URL + shardData.image_file;
    
    const bounds = L.latLngBounds(
        [shardData.bounds.south, shardData.bounds.west],
        [shardData.bounds.north, shardData.bounds.east]
    );
    
    return L.imageOverlay(imageUrl, bounds, { opacity: 0.7 });
}

// Fetches a daily shard (from cache if possible) and updates the map
async function updateDisplay(index) {
    if (!currentManifest) return;
    
    const dateEntry = currentManifest.dates[index];
    document.getElementById('loading').style.display = 'block';

    try {
        let shardData;
        const shardFilename = dateEntry.shard_file;
        
        if (shardCache[shardFilename]) {
            shardData = shardCache[shardFilename]; // Use cached data
        } else {
            const response = await fetch(`${GCS_BASE_URL}${shardFilename}`);
            if (!response.ok) throw new Error(`Failed to fetch ${shardFilename}`);
            shardData = await response.json();
            shardCache[shardFilename] = shardData; // Save to cache
        }

        if (currentOverlay) {
            map.removeLayer(currentOverlay);
        }
        
        currentOverlay = createThermalOverlay(shardData);
        currentOverlay.addTo(map);
        
        const dateStr = shardData.date;
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
        }, 1000); // 1 second per frame for clear viewing
    }
}

function initControls(manifest) {
    const slider = document.getElementById('time-slider');
    slider.max = manifest.dates.length - 1;
    slider.value = 0;
    document.getElementById('start-date').textContent = manifest.dates[0].date;
    document.getElementById('end-date').textContent = manifest.dates[manifest.dates.length - 1].date;
}

async function loadEventManifest(event) {
    shardCache = {}; // Clear cache for the new event
    document.getElementById('map-controls').style.display = 'none';
    document.getElementById('colorbar').style.display = 'none';

    try {
        const eventNameSlug = event.event_name.toLowerCase().replace(/ /g, '_').replace(/,/g, '');
        const manifestFilename = `${String(event.event_id).padStart(2, '0')}_${eventNameSlug}_manifest.json`;
        
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
        await updateDisplay(0); // Load the first day's data

        document.getElementById('map-controls').style.display = 'block';
        document.getElementById('colorbar').style.display = 'block';

    } catch (error) {
        console.error('Error loading event manifest:', error);
        document.getElementById('loading').innerHTML = `<h3>❌ Error loading manifest for ${event.event_name}</h3><p>Make sure the manifest file exists and is public on GCS.</p>`;
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
        const response = await fetch('events.json'); // This stays local
        const eventsData = await response.json();
        allEvents = eventsData.california_environmental_events_2024;

        if (!allEvents || allEvents.length === 0) throw new Error('No events in manifest');

        populateChooser(allEvents);
        document.getElementById('controls').style.display = 'block';
        await loadEventManifest(allEvents[0]); // Load the first event by default

    } catch (error) {
        console.error('Error initializing dashboard:', error);
        document.getElementById('loading').innerHTML = '<h3>❌ Error loading event list</h3><p>Make sure events.json exists and is valid.</p>';
    }
}

document.addEventListener('DOMContentLoaded', function() {
    initMap();
    initDashboard();
    document.getElementById('play-pause-btn').addEventListener('click', togglePlay);
    document.getElementById('time-slider').addEventListener('input', function() {
        if(isPlaying) {
            togglePlay(); // Pause if user starts scrubbing
        }
        updateDisplay(parseInt(this.value));
    });
});
