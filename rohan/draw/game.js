// Firebase configuration - you need to replace these values with your own Firebase project details
// Your web app's Firebase configuration
const firebaseConfig = {
	apiKey: "AIzaSyBpItRBJOvTs-6j5hyY84Mx6orog0PKuuU",
	authDomain: "rohanbiswasdraw.firebaseapp.com",
	projectId: "rohanbiswasdraw",
	storageBucket: "rohanbiswasdraw.firebasestorage.app",
	messagingSenderId: "474232330675",
	appId: "1:474232330675:web:62bf4d04809725cbded3c6"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const gridsCollection = db.collection('grids');

// Canvas setup
let WIDTH = 40
let HEIGHT = 30
let	MARGIN = 3
let EXTENT = 900 - 3 * MARGIN
const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');
let pieces = [];
for (let i = 0; i < WIDTH * HEIGHT; i++) {
	pieces.push(false);
}

// Status element
const statusEl = document.getElementById('status');
const gridIdEl = document.getElementById('gridId');

// UI Controls
document.getElementById('saveBtn').addEventListener('click', saveToFirebase);
document.getElementById('loadBtn').addEventListener('click', loadFromFirebase);

// Initialize the grid
drawBoxes();

// Save the current grid state to Firebase
async function saveToFirebase() {
	try {
		statusEl.textContent = 'Status: Saving...';
		const gridData = {
			pieces: pieces,
			width: WIDTH,
			height: HEIGHT,
			updatedAt: firebase.firestore.FieldValue.serverTimestamp()
		};

		let gridId = gridIdEl.value.trim();
		let docRef;

		if (gridId) {
			// Save with custom ID
			docRef = await gridsCollection.doc(gridId).set(gridData);
			statusEl.textContent = `Status: Saved successfully! Grid ID: ${gridId}`;
		} else {
			// Generate automatic ID
			docRef = await gridsCollection.add(gridData);
			gridIdEl.value = docRef.id;
			statusEl.textContent = `Status: Saved successfully! Grid ID: ${docRef.id}`;
		}
	} catch (error) {
		console.error("Error saving to Firebase:", error);
		statusEl.textContent = `Status: Error saving - ${error.message}`;
	}
}

// Load a grid state from Firebase
async function loadFromFirebase() {
	const gridId = gridIdEl.value.trim();
	if (!gridId) {
		statusEl.textContent = 'Status: Please enter a Grid ID to load';
		return;
	}

	try {
		statusEl.textContent = 'Status: Loading...';
		const docRef = gridsCollection.doc(gridId);
		const doc = await docRef.get();

		if (doc.exists) {
			const data = doc.data();
			pieces = data.pieces;
			// If the loaded grid has different dimensions, update them
			if (data.width && data.height) {
				WIDTH = data.width;
				HEIGHT = data.height;
			}
			drawBoxes();
			statusEl.textContent = 'Status: Loaded successfully!';
		} else {
			statusEl.textContent = `Status: No grid found with ID: ${gridId}`;
		}
	} catch (error) {
		console.error("Error loading from Firebase:", error);
		statusEl.textContent = `Status: Error loading - ${error.message}`;
	}
}

// Setup a real-time listener to get updates
function setupRealtimeListener(gridId) {
	if (!gridId) return null;

	const docRef = gridsCollection.doc(gridId);
	return docRef.onSnapshot((doc) => {
		if (doc.exists) {
			const data = doc.data();
			pieces = data.pieces;
			if (data.width && data.height) {
				WIDTH = data.width;
				HEIGHT = data.height;
			}
			drawBoxes();
			statusEl.textContent = 'Status: Updated from Firebase';
		}
	}, (error) => {
		console.error("Realtime listener error:", error);
		statusEl.textContent = `Status: Realtime update error - ${error.message}`;
	});
}

function drawBox(color, x, y) {
	ctx.fillStyle = color;
	const SIZE = Math.max(WIDTH, HEIGHT);
	ctx.fillRect(
		2 * MARGIN + x * EXTENT / SIZE,
		2 * MARGIN + y * EXTENT / SIZE,
	  EXTENT / SIZE - MARGIN,
		EXTENT / SIZE - MARGIN
	);
}

function xyToIndex(x, y) {
	return HEIGHT * x + y;
}

function piecesToString() {
	const data = {
		'pieces': pieces,
		'width': WIDTH,
		'height': HEIGHT
	};
	const jsonString = JSON.stringify(data);
	console.log(jsonString);
	return jsonString;
}

function stringToPieces(jsonString) {
	const data = JSON.parse(jsonString);
	pieces = data.pieces;
	WIDTH = data.width;
	HEIGHT = data.height;
}

function drawBoxes() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx.fillStyle = getColor('background');
	ctx.fillRect(0, 0, 900, 900);

	for (let x = 0; x < WIDTH; x++) {
		for (let y = 0; y < HEIGHT; y++) {
			const p = pieces[xyToIndex(x, y)];
			let color = getColor('black');
			if (p === true) {
				color = getColor('green');
			}
			drawBox(color, x, y);
		}
	}
}

canvas.addEventListener('click', function(event) {
	const rect = canvas.getBoundingClientRect();
	const px = event.clientX - rect.left;
	const py = event.clientY - rect.top;

	const SIZE = Math.max(WIDTH, HEIGHT);
	const x = Math.floor((px - 2 * MARGIN) * SIZE / EXTENT);
	const y = Math.floor((py - 2 * MARGIN) * SIZE / EXTENT);

	if ((x < 0) || (x >= WIDTH) || (y < 0) || (y >= HEIGHT)) {
		return;
	}

	const i = xyToIndex(x, y);
	const oldValue = pieces[i];
	const newValue = !oldValue;
	pieces[i] = newValue;

	piecesToString();
	drawBoxes();
});

function getColor(str) {
	return {
		'background': '#00f',
		'black': '#000',
		'green': '#0f0'
	} [str];
}
