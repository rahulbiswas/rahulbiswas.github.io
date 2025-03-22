PELLETS = []
gx = 9
gy = 10
gx2 = 18
gy2 = 18
gx3 = 1
gy3 = 18
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


MAZE = MAZE0

SIZE = MAZE.length


const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');
addSomePellets();

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
		score = 0
		addSomePellets()
	}
}