SIZE = 10

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

	for (x = 0; x < 8; x++) {
		for (y = 0; y < 7; y++) {
			q = coordinatesToIndex(x,y)
			p = pieces[q]
			color = getColor('water')
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
		'background': '#050A30',
		'water': '#00f',
  }[str];
}