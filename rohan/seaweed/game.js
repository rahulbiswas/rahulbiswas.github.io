import { SIZE, countUnseen, isSeaweed, createSeaweeds, createBoard, toggleFish } from './board.js';

const urlParams = new URLSearchParams(window.location.search);
const mcmcIterations = parseInt(urlParams.get('iterations')) || 500000;

let fishLocations = []
let seaweedLocations = createSeaweeds()
let minFish = -1
const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');
let board = createBoard(fishLocations, seaweedLocations)
console.log(board)
let iteration = -1
let savedConfigs = [];
let currentConfig = 0;
drawBoxes();

function checkAndUpdateMinFish(fishLocations) {
    if (countUnseen(board) === 0) {
        if (fishLocations.length < minFish || minFish === -1) {
            minFish = fishLocations.length;
        }
    }
}

console.log('Creating MCMC worker');
const mcmcWorker = new Worker('mcmc-worker.js', { type: 'module' });

mcmcWorker.onmessage = function(e) {
    console.log('Received message from worker:', e.data);
    if (e.data.type === 'progress') {
        iteration = e.data.iteration;
        drawBoxes();
    } else if (e.data.type === 'newBest') {
        console.log('New best solution found:', e.data.score);
        fishLocations = e.data.fishLocations;
        board = createBoard(fishLocations, seaweedLocations);
        checkAndUpdateMinFish(fishLocations);
        drawBoxes();
        sleep(3000);
    } else if (e.data.type === 'complete') {
        savedConfigs.push({
            seaweedLocations: seaweedLocations,
            fishLocations: e.data.fishLocations,
            minFish: e.data.score,
            timestamp: new Date().toISOString()
        });
        
        currentConfig++;
        if (currentConfig < 100) {
            seaweedLocations = createSeaweeds();
            mcmcWorker.postMessage({
                type: 'start',
                seaweedLocations: seaweedLocations,
                iterations: mcmcIterations
            });
        } else {
            downloadConfigs();
        }
    }
};

function downloadConfigs() {
    const blob = new Blob([JSON.stringify(savedConfigs, null, 2)], {type: 'application/json'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'seaweed-configs.json';
    a.click();
}

function mcmcButtonClick() {
    console.log('Starting MCMC with seaweed locations:', seaweedLocations);
    mcmcWorker.postMessage({
        type: 'start',
        seaweedLocations: seaweedLocations,
        iterations: mcmcIterations
    });
}

function bookButtonClick() {
    savedConfigs = [];
    currentConfig = 0;
    seaweedLocations = createSeaweeds();
    mcmcWorker.postMessage({
        type: 'start',
        seaweedLocations: seaweedLocations,
        iterations: mcmcIterations
    });
}

async function greedyButtonClick() {
    fishLocations = [];
    board = createBoard(fishLocations, seaweedLocations);
    
    while (countUnseen(board) > 0) {
        let bestX = -1, bestY = -1, maxBenefit = -1;
        
        for (let x = 0; x < SIZE; x++) {
            for (let y = 0; y < SIZE; y++) {
                if (board[x][y] !== 'x') continue;
                
                let before = countUnseen(board);
                let tempFishLocations = [...fishLocations, {x: x, y: y}];
                let tempBoard = createBoard(tempFishLocations, seaweedLocations);
                let after = countUnseen(tempBoard);
                let benefit = before - after;
                
                if (benefit > maxBenefit) {
                    maxBenefit = benefit;
                    bestX = x;
                    bestY = y;
                }
            }
        }
        
        if (bestX === -1) break;
        
        fishLocations.push({x: bestX, y: bestY});
        board = createBoard(fishLocations, seaweedLocations);
        checkAndUpdateMinFish(fishLocations);
        drawBoxes();
        await sleep(100);
    }
}

function drawBox(color, x, y) {
	ctx.fillStyle = color;
	ctx.fillRect(20 + y * 870 / SIZE, 20 + x * 870 / SIZE, 870 / SIZE - 10, 870 / SIZE - 10)
}

function drawBoxes() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx.fillStyle = getColor('background');
	ctx.fillRect(0, 0, 900, 900)

	for (let x = 0; x < SIZE; x++) {
		for (let y = 0; y < SIZE; y++) {
			let piece = board[x][y]
			let color = getColor(piece)
			drawBox(color, x, y)
		}
	}
	
	ctx.fillStyle = "black";
    ctx.font = "24px Arial";
    ctx.textAlign = "right";
    ctx.fillText("Min Fish: " + minFish, 1120, 30);
    ctx.fillText("Iteration: " + iteration, 1120, 80);
    ctx.fillText("Config #: " + currentConfig, 1120, 130);
}

canvas.addEventListener('click', function(event) {
    const rect = canvas.getBoundingClientRect();
    
    const px = event.clientX - rect.left;
    const py = event.clientY - rect.top;
    	
	const x = Math.floor((py - 20) * SIZE / 870);
	const y = Math.floor((px - 20) * SIZE / 870);
	
	if ((x < 0) || (y < 0) || (x > SIZE) || (y > SIZE)) {
		return
	}

    fishLocations = toggleFish(x, y, fishLocations, seaweedLocations);
    board = createBoard(fishLocations, seaweedLocations);
    checkAndUpdateMinFish(fishLocations);
    drawBoxes();
});

function getColor(str) {
    return {
		'background': '#0D3B66',
		'x': '#05668D',
		'.': '#13B6F6',
		'f': '#E9724C',
		's': '#3CCD65'
    }[str];
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function randomNButtonClick(numIterations) {
    for (let n = 0; n < numIterations; n++) {
        const x = Math.floor(Math.random() * 9);
        const y = Math.floor(Math.random() * 9);	
        console.log('randomButtonClick', n, x, y);
		iteration = n;
        fishLocations = toggleFish(x, y, fishLocations, seaweedLocations);
        board = createBoard(fishLocations, seaweedLocations);
        checkAndUpdateMinFish(fishLocations);
        drawBoxes();
        await sleep(1000);
    }
}

window.greedyButtonClick = greedyButtonClick;
window.mcmcButtonClick = mcmcButtonClick;
window.randomNButtonClick = randomNButtonClick;
window.bookButtonClick = bookButtonClick;
