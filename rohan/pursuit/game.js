PELLETS = []
gx = 9
gy = 10
gx2 = 18
gy2 = 18
gx3 = 1
gy3 = 18
gx4 = 6
gy4 = 1
score = 0
px = 1
py = 1
moves = 0
const MAZE0 = [
	[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	[1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 1],
	[1, 0, 1, 0, 1, 0, 1, 1, 0, 1, 1, 1, 0, 0, 0, 1, 0, 1, 0, 1],
	[1, 0, 1, 0, 1, 0, 1, 1, 0, 0, 1, 0, 0, 1, 0, 1, 0, 1, 0, 1],
	[1, 0, 0, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 0, 0, 0, 0, 1, 1],
	[1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 0, 1, 1, 0, 1, 1, 0, 0, 1],
	[1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 0, 1, 0, 1],
	[1, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1],
	[1, 0, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 1, 0, 1, 0, 1, 1],
	[1, 0, 0, 1, 0, 1, 1, 1, 1, 0, 0, 1, 0, 1, 1, 0, 1, 0, 0, 1],
	[1, 1, 0, 0, 0, 1, 0, 0, 1, 0, 1, 0, 0, 1, 0, 0, 1, 1, 0, 1],
	[1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1, 0, 1, 1, 1, 0, 1, 0, 0, 1],
	[0, 1, 0, 0, 0, 1, 0, 0, 1, 1, 1, 0, 0, 1, 0, 0, 1, 0, 1, 1],
	[0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1, 1, 0, 0, 1],
	[0, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 0, 0, 1, 1, 0, 1],
	[0, 1, 1, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 1],
	[0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 1, 1, 1, 1, 0, 0, 1, 0, 1, 1],
	[1, 0, 1, 1, 1, 1, 1, 0, 1, 0, 0, 0, 0, 1, 1, 0, 1, 0, 0, 1],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 1, 0, 0, 0, 0, 1],
	[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
];
const MAZE1 = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
    [1, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 1, 1, 0, 1, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1],
    [1, 0, 1, 1, 1, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 1, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
    [1, 1, 1, 0, 1, 1, 1, 0, 0, 1, 0, 1, 1, 1, 0, 0, 0, 0, 1, 1],
    [1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 1, 1, 0, 0, 1],
    [1, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1],
    [1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
    [1, 0, 0, 0, 1, 0, 1, 1, 1, 1, 1, 0, 0, 1, 0, 1, 0, 1, 0, 1],
    [1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 1],
    [1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 0, 1, 0, 1],
    [1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1],
    [1, 0, 0, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 0, 1],
    [1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1],
    [1, 0, 0, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1],
    [1, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
];
const MAZE2 = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1],
    [1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1],
    [1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1],
    [1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1],
    [1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1],
    [1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1],
    [1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1],
    [1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1],
    [1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1],
    [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1],
    [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1],
    [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 1, 0, 1, 0, 1],
    [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 0, 1, 0, 1, 0, 1],
    [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 1],
    [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 0, 1, 0, 1],
    [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 1],
    [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1, 1, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
];
const MAZE3 = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1, 0, 1],
    [1, 0, 0, 1, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 1, 0, 0, 1],
    [1, 0, 0, 0, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 1, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 1, 0, 0, 0, 1, 1, 0, 0, 0, 1, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 1, 0, 0, 1, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 1, 0, 1, 1, 0, 1, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1],
    [1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 1, 0, 1, 1, 0, 1, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 1, 0, 0, 1, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 1, 0, 0, 0, 1, 1, 0, 0, 0, 1, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 1, 0, 0, 0, 1],
    [1, 0, 0, 1, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 1, 0, 0, 1],
    [1, 0, 1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
];
const MAZE4 = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1],
    [1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1],
    [1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 1],
    [1, 0, 1, 1, 0, 1, 0, 0, 0, 1, 0, 1, 0, 1, 0, 0, 1, 0, 0, 1],
    [1, 0, 1, 0, 0, 0, 1, 0, 1, 0, 1, 0, 0, 0, 1, 0, 1, 0, 1, 1],
    [1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 1],
    [1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1],
    [1, 0, 1, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 1],
    [1, 0, 1, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1],
    [1, 0, 1, 1, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1, 0, 1],
    [1, 0, 1, 1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1, 0, 1],
    [1, 1, 0, 1, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1],
    [1, 0, 1, 0, 1, 1, 0, 0, 0, 1, 1, 0, 0, 0, 1, 1, 0, 1, 0, 1],
    [1, 0, 1, 1, 0, 0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 0, 1, 1, 0, 1],
    [1, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 1],
    [1, 0, 0, 0, 1, 1, 0, 0, 0, 1, 1, 0, 0, 0, 1, 1, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
];
MAZE = MAZE0

const urlParams = new URLSearchParams(window.location.search);
const maze = urlParams.get('maze');
if (maze === '1') {
	MAZE = MAZE1
}
if (maze === '2') {
	MAZE = MAZE2
}
if (maze === '3') {
	MAZE = MAZE3
}
if (maze === '4') {
	MAZE = MAZE4
}

SIZE = MAZE.length

// Get the canvas element and its context
const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');
addSomePellets();

console.log (PELLETS)

drawBoxes();
canvas.addEventListener('click', function() {
	drawBoxes();
});

function drawBox(color, x, y) {
	ctx.fillStyle = color;
	ctx.fillRect(15 + y * 870 / SIZE + 5, 30 + x * 870 / SIZE + 5, 870 / SIZE - 10, 870 / SIZE - 10)
}

// This creates an empty pellets array with the same size as the maze
function initEmptyPellets() {
  PELLETS = [];
  for (let x = 0; x < SIZE; x++) {
    PELLETS[x] = [];
    for (let y = 0; y < SIZE; y++) {
      PELLETS[x][y] = 0;  // 0 means no pellet here
    }
  }
}

// This adds a few pellets to specific locations
function addSomePellets() {
  // First create empty pellets array
  initEmptyPellets();
  
  // Now add pellets at specific positions
	for (x = 0; x < SIZE; x++) {
		for (y = 0; y < SIZE; y++) {
			if (MAZE[x][y] === 0) {
				PELLETS[x][y] = 1
			}
		}
	}
}

function drawBoxes() {
	// Start with an off white board.
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx.fillStyle = getColor('background');
	ctx.fillRect(0, 0, 900, 900)

	// Draw walls.
	for (x = 0; x < SIZE; x++) {
		for (y = 0; y < SIZE; y++) {
			if (MAZE[x][y] === 1) {
				drawBox(getColor('wall'), x, y)
			}
			if (PELLETS[x][y] === 1) {
				drawBox(getColor('pellet'), x, y)
			}
		}
	}

	// Draw ghost.
	drawBox(getColor('blinky'), gx, gy)
	
	drawBox(getColor('pinky'), gx2, gy2)

	drawBox(getColor('inky'), gx3, gy3)
	
	drawBox(getColor('clinky'), gx4, gy4)

	// Draw pacman.
	drawBox(getColor('pacman'), px, py)

	// Show move count.
	ctx.fillStyle = 'white';
	ctx.font = '24px Arial';
	ctx.fillText('score ' + score, 0, 20);
}

// Returns a number in [min,max].
function randInt(min, max) {
	return Math.floor(min + (max - min) * Math.random())
}

function getColor(str) {
	const color = urlParams.get('color');
	if (color === 'earth') {
	  return {
	    'blinky': '#FF6B6B', // coral red
	    'pinky': '#4ECDC4', // teal
	    'pacman': '#FFD166', // golden yellow
	    'inky': '#6B5CA5', // purple
	    'wall': '#2F4858', // navy blue
	    'pellet': '#72B01D', // green
	    'background': '#333333'
	  }[str]
	}
	if (color === 'water') {
		return {
     'blinky': '#D44D5C',   // coral red
     'pinky': '#5E8B7E',    // sea foam
     'pacman': '#F2D7B6',   // sand
     'inky': '#1E3D59',     // deep ocean blue
     'wall': '#091F36',     // abyss blue
     'pellet': '#A7C5EB',   // pale water blue
     'background': '#020A18' // deep sea
   }[str];
	}
	if (color === 'orange') {
		return {
	     'background': '#F0A202',
	     'wall': '#270722',
	     'blinky': '#47FF47',
	     'pinky': '#FFFF7A',
	     'pacman': '#DD4444',
	     'inky': '#E3FF35',
	     'pellet': '#999999'
	   }[str];
	}
	if (color === 'wind') {
		return {
		     'blinky': '#9D7EA7',   // windswept lavender
		     'pinky': '#5D4954',    // pale sky blue
		     'pacman': '#FFE66D',   // dandelion yellow
		     'inky': '#7D6167',     // sage green
		     'wall': '#30475E',     // storm blue
		     'pellet': '#F0F8FF',   // breath white
		     'background': '#121420' // night wind
		   }[str];
	}
	if (color === 'cyberpunk') {
		return {
		     'blinky': '#FF003C',   // neon red
		     'pinky': '#FF00A0',    // hot pink
		     'pacman': '#FFE600',   // bright yellow
		     'inky': '#00FFF0',     // cyan
		     'wall': '#290661',     // deep purple
		     'pellet': '#6EE2FF',   // electric blue
		     'background': '#0D0221' // near-black purple
		   }[str];
	}
	if (color === 'retrowave') {
		return {
  'blinky': '#FE4A49',   // coral red
    'pinky': '#FF00FF',    // magenta
    'pacman': '#FFF64F',   // bright yellow
    'inky': '#00FEFF',     // bright cyan/turquoise
    'wall': '#2D1973',     // midnight purple
    'pellet': '#F736FF',   // neon purple-pink
    'background': '#16082E' // deep purple-black
		   }[str];
	}
	if (color === 'brightcolor') {
		return {
  'blinky': '#FE4A49',   
    'pinky': '#6EEB83',    
    'pacman': '#FFF64F',  
    'inky': '#00FEFF',    
    'wall': '#2D1973',     
    'pellet': '#EE6123',   
    'background': '#54C6EB', 
		   }[str];
	}
	if (color === 'water') {
		return {
     'blinky': '#D44D5C',   // coral red
     'pinky': '#5E8B7E',    // sea foam
     'pacman': '#F2D7B6',   // sand
     'inky': '#1E3D59',     // deep ocean blue
     'wall': '#091F36',     // abyss blue
     'pellet': '#A7C5EB',   // pale water blue
     'background': '#020A18' // deep sea
  	 		}[str];
	}
 
	if (color === 'halloween') {
		return {
    'blinky': '#EADF00',   // pumpkin orange
    'pinky': '#8A00C2',    // witch purple
    'pacman': '#CCFF00',   // slime green
    'inky': '#19A78B',     // teal 
    'wall': '#121113',     // eerie purple-black
    'pellet': '#FF6700',   // sickly yellow
    'background': '#2C1B2E' // near-black
				}[str];
	}
	if (color === 'sunset') {
		return {
'blinky': '#FF5E5B',   // coral red
    'pinky': '#FF9E7A',    // light coral/peach
    'pacman': '#FFDB00',   // golden yellow
    'inky': '#9649CB',     // twilight purple
    'wall': '#2D3A87',     // deep blue
    'pellet': '#FFBD59',   // orange gold
    'background': '#1A1B47' // night blue
				}[str];
	}
	 return {
	    'blinky': '#9C2C77',   // ghost - burgundy purple
	    'pinky': '#FFCF96',    // ghost - peach
	    'pacman': '#FFDE59',   // golden yellow (same as fire theme)
	    'inky': '#3FA796',     // ghost - teal
	    'wall': '#4A0C04',     // charred wood (same as fire theme)
	    'pellet': '#FFAA00',   // orange flame (same as fire theme)
	    'background': '#0F0702' // ash black (same as fire theme)
	  }[str];
	}
function checkEaten() {
	if (((gx === px) && (gy === py)) || ((gx2 === px) && (gy2 === py)) || ((gx3 === px) && (gy3 ===py))) {
		px = 1
		py = 1
		gy = 10
		gx = 9
		gy2 = 18
		gx2 = 18
		gx3 = 1
		gy3 = 18
		gx4 = 6
		gy4 = 1
		score = 0
		addSomePellets()
	}
}

// Add this after your existing event listeners
document.addEventListener('keydown', function(event) {
	console.log('Key pressed:', event.key);
	nx = px
	ny = py
	if (event.key === 'ArrowUp') {
		nx = nx - 1
	} else if (event.key === 'ArrowDown') {
		nx = nx + 1
	} else if (event.key === 'ArrowLeft') {
		ny = ny - 1
	} else if (event.key === 'ArrowRight') {
		ny = ny + 1
	} else {
		return
	}
	if (MAZE[nx][ny] === 0) {
		px = nx
		py = ny
		checkEaten()
		if (PELLETS[px][py] === 1) {
			score = score + 1 
		}
		PELLETS[px][py] = 0
	}
	drawBoxes()
});

// Basic structure
let timerName = setInterval(function() {
	console.log('ae oh ah');
	switch(Math.floor(Math.random() * 4)) {
	case 0:
		console.log("It's not that easy")
		gx = gx - 1
		break
	case 1:
		console.log("I like unicorns")
		gx = gx + 1
		break
	case 2:
		console.log("Fast is slow and slow is fast")
		gy = gy - 1
		break
	case 3:
		console.log("Winning is the only thing")
		gy = gy + 1
		break
	case 4:
		console.log("what")
		break	
	}
	if (gx === 19) { 
		gx = gx - 1
	} else if (gy === 19) {
		gy = gy - 1
	} else if (gx === 0) {
		gx = gx + 1
	} else if (gy === 0) {
		gy = gy + 1
	}
	checkEaten()
	drawBoxes()
}, 1000);

let timerName2 = setInterval(function() {
	console.log('ae oh ah');
	switch(Math.floor(Math.random() * 4)) {
	case 0:
		console.log("It's not that easy")
		gx2 = gx2 - 1
		break
	case 1:
		console.log("I like unicorns")
		gx2 = gx2 + 1
		break
	case 2:
		console.log("Fast is slow and slow is fast")
		gy2 = gy2 - 1
		break
	case 3:
		console.log("Winning is the only thing")
		gy2 = gy2 + 1
		break
	case 4:
		console.log("what")
		break	
	}
	if (gx2 === 19) { 
		gx2 = gx2 - 1
	} else if (gy2 === 19) {
		gy2 = gy2 - 1
	} else if (gx2 === 0) {
		gx2 = gx2 + 1
	} else if (gy2 === 0) {
		gy2 = gy2 + 1
	}
	checkEaten()
	drawBoxes()
}, 1000);

let timerName3 = setInterval(function() {
	console.log('ae oh ah');
	switch(Math.floor(Math.random() * 4)) {
	case 0:
		console.log("It's not that easy")
		gx3 = gx3 - 1
		break
	case 1:
		console.log("I like unicorns")
		gx3 = gx3 + 1
		break
	case 2:
		console.log("Fast is slow and slow is fast")
		gy3 = gy3 - 1
		break
	case 3:
		console.log("Winning is the only thing")
		gy3 = gy3 + 1
		break
	case 4:
		console.log("what")
		break	
	}
	if (gx3 === 19) { 
		gx3 = gx3 - 1
	} else if (gy3 === 19) {
		gy3 = gy3 - 1
	} else if (gx3 === 0) {
		gx3 = gx3 + 1
	} else if (gy3 === 0) {
		gy3 = gy3 + 1
	}
	checkEaten()
	drawBoxes()
}, 1000);
// Basic structure
let timerName = setInterval(function() {
	console.log('ae oh ah');
	switch(Math.floor(Math.random() * 4)) {
	case 0:
		console.log("It's not that easy")
		gx4 = gx4 - 1
		break
	case 1:
		console.log("I like unicorns")
		gx4 = gx4 + 1
		break
	case 2:
		console.log("Fast is slow and slow is fast")
		gy4 = gy4 - 1
		break
	case 3:
		console.log("Winning is the only thing")
		gy4 = gy4 + 1
		break
	case 4:
		console.log("what")
		break	
	}
	if (g4x === 19) { 
		gx4 = gx4 - 1
	} else if (gy4 === 19) {
		gy4 = gy4 - 1
	} else if (gx4 === 0) {
		gx4 = gx4 + 1
	} else if (gy === 0) {
		gy4 = gy4 + 1
	}
	checkEaten()
	drawBoxes()
}, 1000);
