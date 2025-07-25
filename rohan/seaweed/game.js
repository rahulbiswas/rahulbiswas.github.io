import { SIZE, countUnseen, isSeaweed, createSeaweeds, createBoard, toggleFish } from './board.js';
import { sleep, downloadConfigs, getSolvedPuzzles, markPuzzleAsSolved, isPuzzleSolved, getSolvedCount } from './utils.js';
import { checkAndUpdateMinFish, runGreedyAlgorithm } from './algorithms.js';
import { loadPuzzle, loadNextPuzzle, loadPrevPuzzle } from './puzzle-manager.js';
import { updateLayout, createGrid, updateGrid, updatePuzzleDisplay, updateStatusDisplay } from './ui.js';

// Parse URL parameters for game configuration
const urlParams = new URLSearchParams(window.location.search);
const mcmcIterations = parseInt(urlParams.get('iterations')) || 500000;  // Default 500k iterations
const numGames = parseInt(urlParams.get('games')) || 100;  // For puzzle generation mode
const creationMode = urlParams.get('mode') === 'create';  // Enable puzzle creation tools
const isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);

// Game state variables
let puzzleBook = [];           // All loaded puzzles
let currentPuzzleIndex = 0;    // Which puzzle we're on
let targetMinFish = -1;        // Optimal solution for current puzzle
let fishLocations = [];        // Current fish placements
let seaweedLocations = [];     // Current seaweed positions
let minFish = -1;             // Best solution found (creation mode)
let board = null;             // Current board state
let iteration = 0;            // MCMC iteration counter
let savedConfigs = [];        // Puzzles being generated
let currentConfig = 0;        // Current puzzle being generated
let previewX = -1;            // Mouse hover preview coordinates
let previewY = -1;

// Get DOM elements
const gridContainer = document.querySelector('.grid-container');
const boardContainer = document.querySelector('.board-container');
const controlsContainer = document.querySelector('.controls-container');
const gameContainer = document.querySelector('.game-container');

// Set up responsive layout
window.addEventListener('resize', () => updateLayout(gameContainer, boardContainer, controlsContainer));
updateLayout(gameContainer, boardContainer, controlsContainer);

createGrid(gridContainer);

// Navigation functions
window.prevPuzzle = function() {
    const gameState = {
        currentPuzzleIndex,
        seaweedLocations,
        fishLocations,
        minFish,
        board
    };
    
    const newState = loadPrevPuzzle(puzzleBook, gameState, { updateGrid, updateStatusDisplay });
    
    currentPuzzleIndex = newState.currentPuzzleIndex;
    seaweedLocations = newState.seaweedLocations;
    targetMinFish = newState.targetMinFish;
    fishLocations = newState.fishLocations;
    minFish = newState.minFish;
    board = newState.board;
    
    updateGrid(gridContainer, board, fishLocations, seaweedLocations, previewX, previewY, isTouchDevice);
    updateStatusDisplay(currentPuzzleIndex, puzzleBook, fishLocations, targetMinFish, board, minFish, iteration, creationMode, markPuzzleAsSolved);
}

window.nextPuzzle = function() {
    const gameState = {
        currentPuzzleIndex,
        seaweedLocations,
        fishLocations,
        minFish,
        board
    };
    
    const newState = loadNextPuzzle(puzzleBook, gameState, { updateGrid, updateStatusDisplay });
    
    currentPuzzleIndex = newState.currentPuzzleIndex;
    seaweedLocations = newState.seaweedLocations;
    targetMinFish = newState.targetMinFish;
    fishLocations = newState.fishLocations;
    minFish = newState.minFish;
    board = newState.board;
    
    updateGrid(gridContainer, board, fishLocations, seaweedLocations, previewX, previewY, isTouchDevice);
    updateStatusDisplay(currentPuzzleIndex, puzzleBook, fishLocations, targetMinFish, board, minFish, iteration, creationMode, markPuzzleAsSolved);
}

// Make functions available globally for onclick handlers
window.greedyButtonClick = greedyButtonClick;
window.mcmcButtonClick = mcmcButtonClick;
window.bookButtonClick = bookButtonClick;

// Load puzzle data from JSON file
fetch('seaweed-configs.json')
    .then(response => response.json())
    .then(data => {
        puzzleBook = data;
        const gameState = {
            currentPuzzleIndex,
            seaweedLocations,
            fishLocations,
            minFish,
            board
        };
        
        const newState = loadPuzzle(puzzleBook, 0, gameState, { updateGrid, updateStatusDisplay });
        
        currentPuzzleIndex = newState.currentPuzzleIndex;
        seaweedLocations = newState.seaweedLocations;
        targetMinFish = newState.targetMinFish;
        fishLocations = newState.fishLocations;
        minFish = newState.minFish;
        board = newState.board;
        
        updateGrid(gridContainer, board, fishLocations, seaweedLocations, previewX, previewY, isTouchDevice);
        updateStatusDisplay(currentPuzzleIndex, puzzleBook, fishLocations, targetMinFish, board, minFish, iteration, creationMode, markPuzzleAsSolved);
    });

// Mouse hover preview (desktop only)
if (!isTouchDevice) {
    gridContainer.addEventListener('mousemove', function(event) {
        if (!event.target.classList.contains('grid-cell')) return;
        
        const x = parseInt(event.target.dataset.x);
        const y = parseInt(event.target.dataset.y);
        
        // Only update if position changed
        if (x !== previewX || y !== previewY) {
            previewX = x;
            previewY = y;
            updateGrid(gridContainer, board, fishLocations, seaweedLocations, previewX, previewY, isTouchDevice);
        }
    });

    gridContainer.addEventListener('mouseleave', function() {
        previewX = -1;
        previewY = -1;
        updateGrid(gridContainer, board, fishLocations, seaweedLocations, previewX, previewY, isTouchDevice);
    });
}

// Handle cell clicks to place/remove fish
gridContainer.addEventListener('click', function(event) {
    if (!event.target.classList.contains('grid-cell')) return;
    
    const x = parseInt(event.target.dataset.x);
    const y = parseInt(event.target.dataset.y);
    
    if (x >= 0 && x < SIZE && y >= 0 && y < SIZE) {
        fishLocations = toggleFish(x, y, fishLocations, seaweedLocations);
        board = createBoard(fishLocations, seaweedLocations);
        minFish = checkAndUpdateMinFish(fishLocations, board, minFish, () => updateStatusDisplay(currentPuzzleIndex, puzzleBook, fishLocations, targetMinFish, board, minFish, iteration, creationMode, markPuzzleAsSolved));
        updateGrid(gridContainer, board, fishLocations, seaweedLocations, previewX, previewY, isTouchDevice);
        updateStatusDisplay(currentPuzzleIndex, puzzleBook, fishLocations, targetMinFish, board, minFish, iteration, creationMode, markPuzzleAsSolved);
    }
});

// Set up Web Worker for MCMC algorithm
const mcmcWorker = new Worker('mcmc-worker.js', { type: 'module' });

// Handle messages from MCMC worker
mcmcWorker.onmessage = function(e) {
    if (e.data.type === 'progress') {
        // Update iteration counter
        iteration = e.data.iteration;
        updateStatusDisplay(currentPuzzleIndex, puzzleBook, fishLocations, targetMinFish, board, minFish, iteration, creationMode, markPuzzleAsSolved);
        updateGrid(gridContainer, board, fishLocations, seaweedLocations, previewX, previewY, isTouchDevice);
    } else if (e.data.type === 'newBest') {
        // New best solution found
        fishLocations = e.data.fishLocations;
        board = createBoard(fishLocations, seaweedLocations);
        minFish = checkAndUpdateMinFish(fishLocations, board, minFish, () => updateStatusDisplay(currentPuzzleIndex, puzzleBook, fishLocations, targetMinFish, board, minFish, iteration, creationMode, markPuzzleAsSolved));
        updateGrid(gridContainer, board, fishLocations, seaweedLocations, previewX, previewY, isTouchDevice);
        sleep(3000);  // Brief pause to show solution
    } else if (e.data.type === 'complete') {
        // MCMC run complete
        savedConfigs.push({
            seaweedLocations: seaweedLocations,
            minFish: e.data.score
        });
        
        // Generate next puzzle if in batch mode
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
            downloadConfigs(savedConfigs);
        }
    }
};

// Show creation tools if in creation mode
if (creationMode) {
    document.querySelector('.creator-tools').style.display = 'block';
    document.querySelector('.creation-only').style.display = 'block';
}

/**
 * Greedy algorithm button click handler
 */
async function greedyButtonClick() {
    const result = await runGreedyAlgorithm(
        [],
        seaweedLocations,
        (newFishLocations, newBoard, newMinFish) => {
            fishLocations = newFishLocations;
            board = newBoard;
            minFish = newMinFish;
            updateGrid(gridContainer, board, fishLocations, seaweedLocations, previewX, previewY, isTouchDevice);
            updateStatusDisplay(currentPuzzleIndex, puzzleBook, fishLocations, targetMinFish, board, minFish, iteration, creationMode, markPuzzleAsSolved);
        },
        100
    );
    
    // Update final state
    fishLocations = result.fishLocations;
    board = result.board;
    minFish = result.minFish;
}

/**
 * Starts MCMC algorithm for current puzzle
 */
function mcmcButtonClick() {
    mcmcWorker.postMessage({
        type: 'start',
        seaweedLocations: seaweedLocations,
        iterations: mcmcIterations
    });
}

/**
 * Generates a book of new puzzles
 */
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
