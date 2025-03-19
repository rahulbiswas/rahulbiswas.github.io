PELLETS = []
gx = 9
gy = 10
gx2 = 18
gy2 = 18
gx3 = 1
gy3 = 18
moveCount = 0
px = 1
py = 1
moves = 0
const MAZE = [
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
SIZE = MAZE.length

// Get the canvas element and its context
const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');
addSomePellets();
drawBoxes();
canvas.addEventListener('click', function() {
	drawBoxes();
	console.log('Green box changed color');
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
  PELLETS[3][3] = 1;
  PELLETS[3][5] = 1;
  PELLETS[6][3] = 1;
  PELLETS[5][5] = 1;
  PELLETS[10][11] = 1;
  PELLETS[15][15] = 1;
}

function drawBoxes() {
	// Start with an off white board.
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx.fillStyle = white();
	ctx.fillRect(0, 0, 900, 900)

	// Draw walls.
	for (x = 0; x < SIZE; x++) {
		for (y = 0; y < SIZE; y++) {
			if (MAZE[x][y] === 1) {
				drawBox(green(), x, y)
			}
			if (PELLETS[x][y] === 1) {
				drawBox(orange(), x, y)
			}
		}
	}

	// Draw ghost.
	drawBox(red(), gx, gy)
	
	drawBox(yellow(), gx2, gy2)

	drawBox(purple(), gx3, gy3)

	// Draw pacman.
	drawBox(blue(), px, py)

	// Show move count.
	ctx.fillStyle = 'purple';
	ctx.font = '24px Arial';
	ctx.fillText('move count ' + moveCount, 0, 20);
}

// Returns a number in [min,max].
function randInt(min, max) {
	return Math.floor(min + (max - min) * Math.random())
}

function yellow() {
	const r = 249;
	const g = 183;
	const b = 1;
	return `rgb(${r}, ${g}, ${b})`;
}
 
function orange() {
	const r = 255;
	const g = 165;
	const b = 0;
	return `rgb(${r}, ${g}, ${b})`;
}

function purple() {
	const r = 157;
	const g = 0;
	const b = 255;
	return `rgb(${r}, ${g}, ${b})`;
}

function green() {
	const r = 0;
	const g = 255;
	const b = 0;
	return `rgb(${r}, ${g}, ${b})`;
}

function blue() {
	const r = 0;
	const g = 0;
	const b = 255;
	return `rgb(${r}, ${g}, ${b})`;
}

function red() {
	const r = 255;
	const g = 0;
	const b = 0;
	return `rgb(${r}, ${g}, ${b})`;
}

function white() {
	const r = 240;
	const g = 247;
	const b = 238;
	return `rgb(${r}, ${g}, ${b})`;
}
function checkEaten1() {
	if ((px === gx) && (py === gy)) {
		px = 1
		py = 1
		gy = 10
		gx = 9
		gy2 = 18
		gx2 = 18
		gx3 = 1
		gy3 = 18
		moveCount = 0
	}
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
		moveCount = 0
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
		moveCount = moveCount + 1
		checkEaten()
	}
	drawBoxes()
});

// Basic structure
let timerName = setInterval(function() {
	console.log('ae oh ah');
	switch(Math.floor(Math.random() * 3)) {
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
	checkEaten()
	drawBoxes()
	if (gx === 19) { 
		gx = gx - 1
	} else if (gy === 19) {
		gy = gy - 1
	} else if (gx === 0) {
		gx = gx + 1
	} else if (gy === 0) {
		gy = gy + 1
	}
}, 1000);

let timerName2 = setInterval(function() {
	console.log('ae oh ah');
	switch(Math.floor(Math.random() * 3)) {
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
	checkEaten()
	drawBoxes()
	if (gx2 === 19) { 
		gx2 = gx2 - 1
	} else if (gy2 === 19) {
		gy2 = gy2 - 1
	} else if (gx2 === 0) {
		gx2 = gx2 + 1
	} else if (gy2 === 0) {
		gy2 = gy2 + 1
	}
}, 1000);

let timerName3 = setInterval(function() {
	console.log('ae oh ah');
	switch(Math.floor(Math.random() * 3)) {
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
	checkEaten()
	drawBoxes()
	if (gx3 === 19) { 
		gx3 = gx3 - 1
	} else if (gy3 === 19) {
		gy3 = gy3 - 1
	} else if (gx3 === 0) {
		gx3 = gx3 + 1
	} else if (gy3 === 0) {
		gy3 = gy3 + 1
	}
}, 1000);