let score = 0;
let coordinate = 0;
const SIZE = 4; // Adjusted to match the number of rows in drawBoxes()

const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

document.addEventListener("DOMContentLoaded", () => {
    const element = document.querySelector(".container");

    function updateCanvas() {
        // Set canvas size dynamically
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    function drawBoxes() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = getColor('background');
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        const boxSize = 100; // Set a fixed box size for now

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