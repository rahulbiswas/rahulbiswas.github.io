WIDTH = 4
HEIGHT = 3

const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');
pieces = []
for (i = 0; i < WIDTH*HEIGHT; i++) {
	pieces.push(false)
}
stringToPieces('{"pieces":[true,false,true,false,false,false,false,false,false,true,false,true],"width":4,"height":3}')
console.log(pieces)
drawBoxes();

function drawBox(color, x, y) {
	ctx.fillStyle = color;
	SIZE = Math.max(WIDTH, HEIGHT)
	ctx.fillRect(20 + x * 870 / SIZE, 20 + y * 870 / SIZE, 870 / SIZE - 10, 870 / SIZE - 10)
}

function xyToIndex(x, y) {
	return HEIGHT * x + y
}

function piecesToString() {
	data = {'pieces' : pieces, 'width' : WIDTH, 'height' : HEIGHT}
	const jsonString = JSON.stringify(data);
	console.log(jsonString);
	return jsonString
}

function stringToPieces(jsonString) {
	const data = JSON.parse(jsonString);
	pieces = data.pieces
	WIDTH = data.width
	HEIGHT = data.height
}

function drawBoxes() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx.fillStyle = getColor('background');
	ctx.fillRect(0, 0, 900, 900)
	
	for (x = 0; x < WIDTH; x++) {
		for (y = 0; y < HEIGHT; y++) {
			p = pieces[xyToIndex(x, y)]
			color = getColor('black')
			if (p === true) {
				color = getColor('green')
			}
			drawBox(color, x, y)
		}
	}
}

canvas.addEventListener('click', function(event) {
	const rect = canvas.getBoundingClientRect();

	const px = event.clientX - rect.left;
	const py = event.clientY - rect.top;

	console.log('Click coordinates:', px, py);

	SIZE = Math.max(WIDTH, HEIGHT)
	x = Math.floor((px - 20) * SIZE / 870);
	y = Math.floor((py - 20) * SIZE / 870);

	if ((x < 0) || (x >= WIDTH)) {
		return
	}
	if ((y < 0) || (y >= HEIGHT)) {
		return
	}

	i = xyToIndex(x, y)
	oldValue = pieces[i]
	newValue = !oldValue
	pieces[i] = newValue

	console.log('Click coordinates:', y);
	piecesToString()
	drawBoxes()
});

function getColor(str) {
	return {
		'background': '#00f',
		'black': '#000',
		'green': '#0f0',
	} [str];
}
