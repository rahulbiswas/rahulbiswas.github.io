score = 0
SIZE = 5

const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');
PAIRS = 6
pieces = []
for (i = 0; i < PAIRS*2; i++) {
	pieces.push(i % PAIRS)
}
drawBoxes();

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
			drawBox(color, x, y)
		}
	}
}

canvas.addEventListener('click', function(event) {
  const rect = canvas.getBoundingClientRect();
  
  const px = event.clientX - rect.left;
  const py = event.clientY - rect.top;
  	
	x = Math.floor((py - 35) * SIZE / 870);
	y = Math.floor((px - 20) * SIZE / 870);

	if ((x < 0) || (y < 0) || (x > 3) || (y > 2)) {
		return
	}

	q = coordinatesToIndex(x,y)
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
  }[str];
}