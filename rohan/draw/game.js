WIDTH = 6
HEIGHT = 5

const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');
pieces = []
for (i = 0; i < WIDTH*HEIGHT; i++) {
	pieces.push(false)
}
console.log(pieces)
drawBoxes();

function drawBox(color, x, y) {
	ctx.fillStyle = color;
	SIZE = Math.max(WIDTH, HEIGHT)
	ctx.fillRect(20 + x * 870 / SIZE, 20 + y * 870 / SIZE, 870 / SIZE - 10, 870 / SIZE - 10)
}

function drawBoxes() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx.fillStyle = getColor('background');
	ctx.fillRect(0, 0, 900, 900)

	for (x = 0; x < WIDTH; x++) {
		p = pieces[x]
		color = getColor('black')
		if (p === true) {
			color = getColor('green')
		}
		drawBox(color, x, 0)
	}
}

canvas.addEventListener('click', function(event) {
	const rect = canvas.getBoundingClientRect();

	const px = event.clientX - rect.left;
	const py = event.clientY - rect.top;

	console.log('Click coordinates:', px, py);

	SIZE = Math.max(WIDTH, HEIGHT)
	y = Math.floor((py - 20) * SIZE / 870);

	if ((y < 0) || (y >= HEIGHT)) {
		return
	}

	oldValue = pieces[y]
	newValue = !oldValue
	pieces[y] = newValue

	console.log('Click coordinates:', y);
	console.log(pieces)

	drawBoxes()
});

function getColor(str) {
	return {
		'background': '#00f',
		'black': '#000',
		'green': '#0f0',
	} [str];
}
