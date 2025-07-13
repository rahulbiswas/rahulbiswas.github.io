import { SIZE, countUnseen, isSeaweed, createSeaweeds, createBoard, toggleFish } from './board.js';

const urlParams = new URLSearchParams(window.location.search);
const mcmcIterations = parseInt(urlParams.get('iterations')) || 500000;
const numGames = parseInt(urlParams.get('games')) || 100;
const creationMode = urlParams.get('mode') === 'create';
const isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);

const styles = getComputedStyle(document.documentElement);
const borderWidth = parseInt(styles.getPropertyValue('--border-width')) * 2;
const gameBorder = parseInt(styles.getPropertyValue('--game-border')) * 2;
const controlsHeight = parseInt(styles.getPropertyValue('--controls-height'));
const controlsPadding = parseInt(styles.getPropertyValue('--controls-padding')) * 2;

let puzzleBook = [];
let currentPuzzleIndex = 0;
let targetMinFish = -1;
let fishLocations = [];
let seaweedLocations = [];
let minFish = -1;
let board = null;
let iteration = 0;
let savedConfigs = [];
let currentConfig = 0;
let previewX = -1;
let previewY = -1;

const gridContainer = document.querySelector('.grid-container');
const boardContainer = document.querySelector('.board-container');
const controlsContainer = document.querySelector('.controls-container');
const gameContainer = document.querySelector('.game-container');

function logAllLayout() {
    const elements = {
        gameContainer: document.querySelector('.game-container'),
        boardContainer: document.querySelector('.board-container'),
        gridContainer: document.querySelector('.grid-container'),
        controlsContainer: document.querySelector('.controls-container')
    };

    console.log('=== COMPLETE LAYOUT ===');
    for (const [name, element] of Object.entries(elements)) {
        const rect = element.getBoundingClientRect();
        const styles = window.getComputedStyle(element);
        console.log(`${name}:`, {
            rect: {
                width: Math.round(rect.width),
                height: Math.round(rect.height),
                top: Math.round(rect.top),
                left: Math.round(rect.left)
            },
            computed: {
                width: styles.width,
                height: styles.height,
                padding: styles.padding,
                margin: styles.margin,
                border: styles.border
            },
            offset: {
                width: element.offsetWidth,
                height: element.offsetHeight
            }
        });
    }
    console.log('=====================');
}

function updateLayout() {
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    console.log('Window dimensions:', { windowWidth, windowHeight });
    
    gameContainer.style.width = `${windowWidth}px`;
    gameContainer.style.height = `${windowHeight}px`;
    
    const availableWidth = windowWidth - gameBorder;
    const availableHeight = windowHeight - gameBorder;
    
    const totalControlsHeight = controlsHeight + controlsPadding;
    const boardAvailableHeight = availableHeight - totalControlsHeight;
    const boardSize = Math.min(availableWidth - borderWidth, boardAvailableHeight - borderWidth);

    const isWidthConstrained = (availableWidth - borderWidth) < (boardAvailableHeight - borderWidth);
		console.log('isWidthConstrained ' + isWidthConstrained)
    
    boardContainer.style.position = 'absolute';
    if (isWidthConstrained) {
        boardContainer.style.left = `0`;
        boardContainer.style.top = `${(boardAvailableHeight - boardSize - borderWidth) / 2}px`;
    } else {
        boardContainer.style.top = '0';
        boardContainer.style.left = `${(availableWidth - boardSize - borderWidth) / 2 + gameBorder/2}px`;
    }
    boardContainer.style.width = `${boardSize}px`;
    boardContainer.style.height = `${boardSize}px`;
    
    controlsContainer.style.position = 'absolute';
    controlsContainer.style.bottom = `${gameBorder/2}px`;
    controlsContainer.style.left = `${gameBorder/2}px`;
    controlsContainer.style.width = `${availableWidth - borderWidth}px`;

    logAllLayout();
}

window.addEventListener('resize', updateLayout);
updateLayout();

function createGrid() {
    gridContainer.innerHTML = '';
    for (let x = 0; x < SIZE; x++) {
        for (let y = 0; y < SIZE; y++) {
            const cell = document.createElement('div');
            cell.className = 'grid-cell';
            cell.dataset.x = x;
            cell.dataset.y = y;
            gridContainer.appendChild(cell);
        }
    }
}

createGrid();

function updateGrid() {
    if (!board) return;
    
    const cells = gridContainer.children;
    for (let x = 0; x < SIZE; x++) {
        for (let y = 0; y < SIZE; y++) {
            const cell = cells[x * SIZE + y];
            const piece = board[x][y];
            
            cell.className = 'grid-cell';
            if (piece === '.') cell.classList.add('seen');
            if (piece === 'f') cell.classList.add('fish');
            if (piece === 's') cell.classList.add('seaweed');
        }
    }

    if (!isTouchDevice && previewX >= 0 && previewX < SIZE && previewY >= 0 && previewY < SIZE) {
        if (board[previewX][previewY] === 'x' && !isSeaweed(previewX, previewY, seaweedLocations)) {
            let previewBoard = createBoard([...fishLocations, {x: previewX, y: previewY}], seaweedLocations);
            for (let x = 0; x < SIZE; x++) {
                for (let y = 0; y < SIZE; y++) {
                    const cell = cells[x * SIZE + y];
                    if (previewBoard[x][y] === '.' && board[x][y] === 'x') {
                        cell.classList.add('seen', 'preview');
                    }
                }
            }
            cells[previewX * SIZE + previewY].classList.add('fish', 'preview');
        }
    }
}

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
        updateGrid();
        updateStatusDisplay();
    }
}

if (!isTouchDevice) {
    gridContainer.addEventListener('mousemove', function(event) {
        if (!event.target.classList.contains('grid-cell')) return;
        
        const x = parseInt(event.target.dataset.x);
        const y = parseInt(event.target.dataset.y);
        
        if (x !== previewX || y !== previewY) {
            previewX = x;
            previewY = y;
            updateGrid();
        }
    });

    gridContainer.addEventListener('mouseleave', function() {
        previewX = -1;
        previewY = -1;
        updateGrid();
    });
}

gridContainer.addEventListener('click', function(event) {
    if (!event.target.classList.contains('grid-cell')) return;
    
    const x = parseInt(event.target.dataset.x);
    const y = parseInt(event.target.dataset.y);
    
    if (x >= 0 && x < SIZE && y >= 0 && y < SIZE) {
        fishLocations = toggleFish(x, y, fishLocations, seaweedLocations);
        board = createBoard(fishLocations, seaweedLocations);
        checkAndUpdateMinFish(fishLocations);
        updateGrid();
        updateStatusDisplay();
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
        updateGrid();
    } else if (e.data.type === 'newBest') {
        fishLocations = e.data.fishLocations;
        board = createBoard(fishLocations, seaweedLocations);
        checkAndUpdateMinFish(fishLocations);
        updateGrid();
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
        updateGrid();
        updateStatusDisplay();
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
        updateGrid();
        updateStatusDisplay();
        await sleep(1000);
    }
}
