import { SIZE, countUnseen, isSeaweed, createSeaweeds, createBoard, toggleFish } from './board.js';

const urlParams = new URLSearchParams(window.location.search);
const mcmcIterations = parseInt(urlParams.get('iterations')) || 500000;
const numGames = parseInt(urlParams.get('games')) || 100;
const creationMode = urlParams.get('mode') === 'create';

let puzzleBook = [];
let currentPuzzleIndex = 0;
let targetMinFish = -1;
let fishLocations = [];
let seaweedLocations = [];
let minFish = -1;
const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');
let board = null;
let iteration = 0;
let savedConfigs = [];
let currentConfig = 0;
let previewX = -1;
let previewY = -1;

window.prevPuzzle = function() {
    loadPuzzle(currentPuzzleIndex - 1);
}

window.nextPuzzle = function() {
    loadPuzzle(currentPuzzleIndex + 1);
}

window.greedyButtonClick = greedyButtonClick;
window.mcmcButtonClick = mcmcButtonClick;
window.randomNButtonClick = randomNButtonClick;
window.bookButtonClick = bookButtonClick;

function resizeCanvas() {
    const maxWidth = window.innerWidth * 0.9;
    const maxHeight = window.innerHeight * 0.7;
    const aspectRatio = 4/3;
    
    let width = maxWidth;
    let height = width / aspectRatio;
    
    if (height > maxHeight) {
        height = maxHeight;
        width = height * aspectRatio;
    }
    
    canvas.width = width;
    canvas.height = height;
    if (board) drawBoxes();
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();

function celebrateCompletion() {
    document.getElementById('completion-message').classList.remove('hidden');
}

function clearCelebration() {
    document.getElementById('completion-message').classList.add('hidden');
}

function updateStatusDisplay() {
    document.getElementById('puzzleCount').textContent = `${currentPuzzleIndex + 1}/${puzzleBook.length}`;
    const fishCount = document.getElementById('fishCount');
    fishCount.textContent = fishLocations.length;
    
    if (fishLocations.length === targetMinFish) {
        fishCount.className = 'count-matched';
        if (countUnseen(board) === 0) {
            celebrateCompletion();
        }
    } else {
        fishCount.className = 'count-normal';
        clearCelebration();
    }

    if (creationMode) {
        document.getElementById('minFishCount').textContent = minFish;
        document.getElementById('iterationCount').textContent = iteration;
        document.getElementById('targetCount').parentElement.style.display = 'none';
    } else {
        document.getElementById('targetCount').textContent = targetMinFish;
        document.getElementById('creationStats').style.display = 'none';
    }
}

fetch('seaweed-configs.json')
    .then(response => response.json())
    .then(data => {
        puzzleBook = data;
        loadPuzzle(0);
    });

function loadPuzzle(index) {
    if (index >= 0 && index < puzzleBook.length) {
        currentPuzzleIndex = index;
        seaweedLocations = puzzleBook[index].seaweedLocations;
        targetMinFish = puzzleBook[index].minFish;
        fishLocations = [];
        minFish = -1;
        board = createBoard(fishLocations, seaweedLocations);
        clearCelebration();
        drawBoxes();
        updateStatusDisplay();
    }
}

function getDrawingDimensions() {
    const gridSize = Math.min(canvas.width, canvas.height) * 0.9;
    const cellSize = gridSize / SIZE;
    const offsetX = (canvas.width - gridSize) / 2;
    const offsetY = (canvas.height - gridSize) / 2;
    return { gridSize, cellSize, offsetX, offsetY };
}

function drawBox(color, x, y, isPreview = false) {
    const { cellSize, offsetX, offsetY } = getDrawingDimensions();
    const margin = cellSize * 0.05;
    
    ctx.fillStyle = color;
    if (isPreview) {
        ctx.globalAlpha = 0.5;
    }
    ctx.fillRect(
        offsetX + y * cellSize + margin,
        offsetY + x * cellSize + margin,
        cellSize - 2 * margin,
        cellSize - 2 * margin
    );
    ctx.globalAlpha = 1.0;
}

function drawBoxes() {
    if (!board) return;
    
    const { gridSize, offsetX, offsetY } = getDrawingDimensions();
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = getColor('background');
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (let x = 0; x < SIZE; x++) {
        for (let y = 0; y < SIZE; y++) {
            let piece = board[x][y];
            let color = getColor(piece);
            drawBox(color, x, y);
        }
    }

    if (previewX >= 0 && previewX < SIZE && previewY >= 0 && previewY < SIZE) {
        if (board[previewX][previewY] === 'x' && !isSeaweed(previewX, previewY, seaweedLocations)) {
            let previewBoard = createBoard([...fishLocations, {x: previewX, y: previewY}], seaweedLocations);
            for (let x = 0; x < SIZE; x++) {
                for (let y = 0; y < SIZE; y++) {
                    if (previewBoard[x][y] === '.' && board[x][y] === 'x') {
                        drawBox(getColor('.'), x, y, true);
                    }
                }
            }
            drawBox(getColor('f'), previewX, previewY, true);
        }
    }
    
    updateStatusDisplay();
}

function getGridPosition(clientX, clientY) {
    const rect = canvas.getBoundingClientRect();
    const { cellSize, offsetX, offsetY } = getDrawingDimensions();
    
    const canvasX = (clientX - rect.left) * (canvas.width / rect.width);
    const canvasY = (clientY - rect.top) * (canvas.height / rect.height);
    
    const x = Math.floor((canvasY - offsetY) / cellSize);
    const y = Math.floor((canvasX - offsetX) / cellSize);
    
    return { x, y };
}

canvas.addEventListener('mousemove', function(event) {
    const { x, y } = getGridPosition(event.clientX, event.clientY);
    
    if (x !== previewX || y !== previewY) {
        previewX = x;
        previewY = y;
        drawBoxes();
    }
});

canvas.addEventListener('mouseleave', function() {
    previewX = -1;
    previewY = -1;
    drawBoxes();
});

canvas.addEventListener('click', function(event) {
    const { x, y } = getGridPosition(event.clientX, event.clientY);
    
    if (x >= 0 && x < SIZE && y >= 0 && y < SIZE) {
        fishLocations = toggleFish(x, y, fishLocations, seaweedLocations);
        board = createBoard(fishLocations, seaweedLocations);
        checkAndUpdateMinFish(fishLocations);
        drawBoxes();
    }
});

function checkAndUpdateMinFish(fishLocations) {
    if (countUnseen(board) === 0) {
        if (fishLocations.length < minFish || minFish === -1) {
            minFish = fishLocations.length;
            updateStatusDisplay();
        }
    }
}

const mcmcWorker = new Worker('mcmc-worker.js', { type: 'module' });

mcmcWorker.onmessage = function(e) {
    if (e.data.type === 'progress') {
        iteration = e.data.iteration;
        updateStatusDisplay();
        drawBoxes();
    } else if (e.data.type === 'newBest') {
        fishLocations = e.data.fishLocations;
        board = createBoard(fishLocations, seaweedLocations);
        checkAndUpdateMinFish(fishLocations);
        drawBoxes();
        sleep(3000);
    } else if (e.data.type === 'complete') {
        savedConfigs.push({
            seaweedLocations: seaweedLocations,
            minFish: e.data.score
        });
        
        currentConfig++;
        if (currentConfig < numGames) {
            seaweedLocations = createSeaweeds();
            minFish = -1;
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

if (creationMode) {
    document.querySelector('.creator-tools').style.display = 'block';
    document.querySelector('.creation-only').style.display = 'block';
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

function mcmcButtonClick() {
    mcmcWorker.postMessage({
        type: 'start',
        seaweedLocations: seaweedLocations,
        iterations: mcmcIterations
    });
}

function bookButtonClick() {
    savedConfigs = [];
    currentConfig = 0;
    minFish = -1;
    seaweedLocations = createSeaweeds();
    mcmcWorker.postMessage({
        type: 'start',
        seaweedLocations: seaweedLocations,
        iterations: mcmcIterations
    });
}

async function randomNButtonClick(numIterations) {
    for (let n = 0; n < numIterations; n++) {
        const x = Math.floor(Math.random() * SIZE);
        const y = Math.floor(Math.random() * SIZE);    
        iteration = n;
        fishLocations = toggleFish(x, y, fishLocations, seaweedLocations);
        board = createBoard(fishLocations, seaweedLocations);
        checkAndUpdateMinFish(fishLocations);
        drawBoxes();
        await sleep(1000);
    }
}
