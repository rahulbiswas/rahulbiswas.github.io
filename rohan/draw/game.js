SIZE = 5

const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');
pieces = []
hidden = []
for (i = 0; i < SIZE; i++) {
	pieces.push(0)
}
pieces = shuffleArray(pieces);
console.log(pieces)
drawBoxes();

console.log('Can I keep doing the pacman')

function drawBox(color, x, y) {
	ctx.fillStyle = color;
	ctx.fillRect(20 + y * 870 / SIZE, 35 + x * 870 / SIZE, 870 / SIZE - 10, 870 / SIZE - 10)
}

function coordinatesToIndex(x, y) {
	return 3*x+y
}

function drawBoxes() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx.fillStyle = getColor('background');
	ctx.fillRect(0, 0, 900, 900)

	for (x = 0; x < 4; x++) {
		for (y = 0; y < 3; y++) {
			q = coordinatesToIndex(x,y)
			p = pieces[q]
			color = getColor('card' + p)
			isHidden = hidden[q]
			if (isHidden) {
				color = getColor('hidden')
			}
			drawBox(color, x, y)
		}
	}
}

canvas.addEventListener('click', function(event) {
  // Get the canvas position
  const rect = canvas.getBoundingClientRect();
  
  // Calculate mouse position relative to the canvas
  const px = event.clientX - rect.left;
  const py = event.clientY - rect.top;
  
  console.log('Click coordinates:', px, py);
	
	x = Math.floor((py - 35) * SIZE / 870);
	y = Math.floor((px - 20) * SIZE / 870);

	if ((x < 0) || (y < 0) || (x > 3) || (y > 2)) {
		return
	}

	q = coordinatesToIndex(x,y)
	oldValue = hidden[q]
	newValue = !oldValue
	hidden[q] = newValue

  console.log('Click coordinates:', x, y);
	console.log('Hidden: ' + hidden)
	
	drawBoxes()
});

function getColor(str) {
  return {
	  'blinky': '#9C2C77',
		'background': '#050A30',
		'card0': '#f00',
		'card1': '#0f0',
		'card2': '#00f',
		'card3': '#ff0',
		'card4': '#f0f',
		'card5': '#0ff',
		'hidden': '#333'
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
