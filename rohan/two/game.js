gx = 9
gy = 10
score = 0
SIZE = 20

const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');

drawBoxes();
canvas.addEventListener('click', function() {
	drawBoxes();
});

function drawBox(color, x, y) {
	ctx.fillStyle = color;
	ctx.fillRect(15 + y * 870 / SIZE + 5, 30 + x * 870 / SIZE + 5, 870 / SIZE - 10, 870 / SIZE - 10)
}

function drawBoxes() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx.fillStyle = getColor('background');
	ctx.fillRect(0, 0, 900, 900)

	drawBox(getColor('blinky'), gx, gy)

	ctx.fillStyle = 'white';
	ctx.font = '24px Arial';
	ctx.fillText('score ' + score, 0, 20);
}

function getColor(str) {
  return {
	    'blinky': '#9C2C77',
			'background': '#050A30'
  }[str];
}