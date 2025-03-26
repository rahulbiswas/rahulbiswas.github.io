score = 0
SIZE = 5

const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');

drawBoxes();
canvas.addEventListener('click', function() {
	drawBoxes();
});

PAIRS = 6
pieces = []
for (i = 0; i < PAIRS*2; i++) {
	pieces.push(i % PAIRS)
}
pieces = shuffleArray(pieces);
console.log(pieces)

console.log('Can I keep doing the pacman')

function drawBox(color, x, y) {
	ctx.fillStyle = color;
	ctx.fillRect(15 + y * 870 / SIZE + 5, 30 + x * 870 / SIZE + 5, 870 / SIZE - 10, 870 / SIZE - 10)
}

function drawBoxes() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx.fillStyle = getColor('background');
	ctx.fillRect(0, 0, 900, 900)

	for (x = 0; x < 4; x++) {
		for (y = 0; y < 3; y++) {
			drawBox(getColor('cards'), x, y)
		}
	}

	ctx.fillStyle = 'white';
	ctx.font = '24px Arial';
	ctx.fillText('score ' + score, 0, 20);
}

function getColor(str) {
  return {
	  'blinky': '#9C2C77',
		'background': '#050A30',
		'cards': '#f00'
  }[str];
}

function shuffleArray(array) {
  // Create a copy of the original array to avoid modifying it directly
  const shuffled = [...array];
  
  // Fisher-Yates shuffle algorithm
  for (let i = shuffled.length - 1; i > 0; i--) {
    // Generate a random index from 0 to i
    const j = Math.floor(Math.random() * (i + 1));
    
    // Swap elements at indices i and j
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  
  return shuffled;
}