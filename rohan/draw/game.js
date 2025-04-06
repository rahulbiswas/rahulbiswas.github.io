SIZE = 5

const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');
pieces = []
for (i = 0; i < SIZE; i++) {
	pieces.push(false)
}
console.log(pieces)
drawBoxes();

function drawBox(color, x, y) {
	ctx.fillStyle = color;
	ctx.fillRect(20 + y * 870 / SIZE, 20 + x * 870 / SIZE, 870 / SIZE - 10, 870 / SIZE - 10)
}

function drawBoxes() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx.fillStyle = getColor('background');
	ctx.fillRect(0, 0, 900, 900)

	for (x = 0; x < SIZE; x++) {
		p = pieces[x]
		if (p === false) {
			color = getColor('black')
		}
		if (p === true) {
			color = getColor('green')
			drawBox(color, x, 0)
		}
	}
}

canvas.addEventListener('click', function(event) {
	const rect = canvas.getBoundingClientRect();

	const px = event.clientX - rect.left;
	const py = event.clientY - rect.top;

	console.log('Click coordinates:', px, py);

	x = Math.floor((py - 20) * SIZE / 870);

	if ((x < 0) || (x >= SIZE)) {
		return
	}

	oldValue = pieces[x]
	newValue = !oldValue
	pieces[x] = newValue

	console.log('Click coordinates:', x);
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
