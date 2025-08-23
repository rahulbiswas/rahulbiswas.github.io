let score = 0;
let coordinate = 0;
const SIZE = 4; // Adjusted to match the number of rows in drawBoxes()

const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");
const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');
PAIRS = 6
pieces = []
hidden = []
for (i = 0; i < PAIRS*2; i++) {
	pieces.push(i % PAIRS)
	hidden.push(true)
}
pieces = shuffleArray(pieces);
console.log(pieces)
drawBoxes();

document.addEventListener("DOMContentLoaded", () => {
    const element = document.querySelector(".container");

    function updateCanvas() {
        // Set canvas size dynamically
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
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
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        const boxSize = 100; // Set a fixed box size for now
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

        for (let x = 0; x < 3; x++) {
            for (let y = 0; y < 4; y++) {
                let q = 3 * x + y;
                let p = pieces[q];
                drawBox(getColor('card' + p), x * boxSize, y * boxSize);
            }
        }

        ctx.fillStyle = 'white';
        ctx.font = '24px Arial';
        ctx.fillText('Score: ' + score, 10, 30);
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

    function drawBox(color, x, y) {
        ctx.fillStyle = color;
        ctx.fillRect(x + 15, y + 30, 80, 80); // Adjusted for better visibility
    }

    function getColor(str) {
        return {
            'blinky': '#9C2C77',
            'background': '#050A30',
            'card0': '#e4ff1a',
            'card1': '#e8aa14',
            'card2': '#f21b3f',
            'card3': '#00bbf9',
            'card4': '#00f5d4',
            'card5': '#ffc07f',
        }[str];
    }

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    const PAIRS = 6;
    let pieces = [];
    for (let i = 0; i < PAIRS * 2; i++) {
        pieces.push(i % PAIRS);
    }
    
	pieces = shuffleArray(pieces);
    console.log(pieces);

    drawBoxes();
    
    canvas.addEventListener('click', function(event) {
		drawBoxes();
		x = event.clientX;
		y = event.clientY;
		
		xreal = Math.trunc((x-15) / (80 + 15))
		yreal = Math.trunc((y-30) / (80 + 15))
		
		console.log(xreal,yreal)
    });

    window.addEventListener("resize", () => {
        updateCanvas();
        drawBoxes();
    });

    updateCanvas();
});
    // Swap elements at indices i and j
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  
  return shuffled;
}
