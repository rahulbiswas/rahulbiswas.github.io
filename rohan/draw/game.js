SIZE = 5

const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');
pieces = []
hidden = []
for (i = 0; i < SIZE; i++) {
	pieces.push(0)
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
		p = pieces[0]
		color = getColor('card' + p)
		drawBox(color, x, 0)
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

	oldValue = hidden[0]
	newValue = !oldValue
	hidden[0] = newValue

  console.log('Click coordinates:', x);
	
	drawBoxes()
});

function getColor(str) {
  return {
		'background': '#050A30',
		'card0': '#000',
		'card1': '#0f0',
  }[str];
}