import { SIZE, countUnseen, isSeaweed, createSeaweeds, createBoard, toggleFish } from './board.js';
import { sleep, downloadConfigs, getSolvedPuzzles, markPuzzleAsSolved, isPuzzleSolved, getSolvedCount } from './utils.js';
import { checkAndUpdateMinFish, runGreedyAlgorithm } from './algorithms.js';
import { loadPuzzle, loadNextPuzzle, loadPrevPuzzle } from './puzzle-manager.js';
import { updateLayout, createGrid, updateGrid, updatePuzzleDisplay, updateStatusDisplay } from './ui.js';
import { 
    setupGridEventListeners, 
    createPrevPuzzleHandler, 
    createNextPuzzleHandler, 
    createResetPuzzleHandler,
    createGreedyButtonHandler,
    createMcmcButtonHandler,
    createBookButtonHandler,
    createWorkerMessageHandler
} from './event-handlers.js';

// Parse URL parameters for game configuration
const urlParams = new URLSearchParams(window.location.search);
const mcmcIterations = parseInt(urlParams.get('iterations')) || 500000;  // Default 500k iterations
const numGames = parseInt(urlParams.get('games')) || 100;  // For puzzle generation mode
const creationMode = urlParams.get('mode') === 'create';  // Enable puzzle creation tools
const isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);

// Game state variables
const gameState = {
    puzzleBook: [],           // All loaded puzzles
    currentPuzzleIndex: 0,    // Which puzzle we're on
    targetMinFish: -1,        // Optimal solution for current puzzle
    fishLocations: [],        // Current fish placements
    seaweedLocations: [],     // Current seaweed positions
    minFish: -1,             // Best solution found (creation mode)
    board: null,             // Current board state
    iteration: 0,            // MCMC iteration counter
    savedConfigs: [],        // Puzzles being generated
    currentConfig: 0,        // Current puzzle being generated
    previewX: -1,            // Mouse hover preview coordinates
    previewY: -1,
    creationMode: creationMode
};

// Get DOM elements
const gridContainer = document.querySelector('.grid-container');
const boardContainer = document.querySelector('.board-container');
const controlsContainer = document.querySelector('.controls-container');
const gameContainer = document.querySelector('.game-container');

// Set up responsive layout
window.addEventListener('resize', () => updateLayout(gameContainer, boardContainer, controlsContainer));
updateLayout(gameContainer, boardContainer, controlsContainer);

createGrid(gridContainer);

// Set up Web Worker for MCMC algorithm
const mcmcWorker = new Worker('mcmc-worker.js', { type: 'module' });

// Setup event handlers
setupGridEventListeners(gridContainer, gameState, isTouchDevice);

// Create and assign navigation handlers
window.prevPuzzle = createPrevPuzzleHandler(gameState, gridContainer, isTouchDevice);
window.nextPuzzle = createNextPuzzleHandler(gameState, gridContainer, isTouchDevice);
window.resetPuzzle = createResetPuzzleHandler(gameState, gridContainer, isTouchDevice);

// Create and assign algorithm button handlers
window.greedyButtonClick = createGreedyButtonHandler(gameState, gridContainer, isTouchDevice);
window.mcmcButtonClick = createMcmcButtonHandler(gameState, mcmcWorker, mcmcIterations);
window.bookButtonClick = createBookButtonHandler(gameState, mcmcWorker, mcmcIterations);

// Setup worker message handler
mcmcWorker.onmessage = createWorkerMessageHandler(gameState, gridContainer, isTouchDevice, numGames, mcmcIterations, mcmcWorker);

// Load puzzle data from JSON file
fetch('seaweed-configs.json')
    .then(response => response.json())
    .then(data => {
        gameState.puzzleBook = data;
        const currentGameState = {
            currentPuzzleIndex: gameState.currentPuzzleIndex,
            seaweedLocations: gameState.seaweedLocations,
            fishLocations: gameState.fishLocations,
            minFish: gameState.minFish,
            board: gameState.board
        };
        
        const newState = loadPuzzle(gameState.puzzleBook, 0, currentGameState, { updateGrid, updateStatusDisplay });
        
        gameState.currentPuzzleIndex = newState.currentPuzzleIndex;
        gameState.seaweedLocations = newState.seaweedLocations;
        gameState.targetMinFish = newState.targetMinFish;
        gameState.fishLocations = newState.fishLocations;
        gameState.minFish = newState.minFish;
        gameState.board = newState.board;
        
        updateGrid(gridContainer, gameState.board, gameState.fishLocations, gameState.seaweedLocations, gameState.previewX, gameState.previewY, isTouchDevice);
        updateStatusDisplay(gameState.currentPuzzleIndex, gameState.puzzleBook, gameState.fishLocations, gameState.targetMinFish, gameState.board, gameState.minFish, gameState.iteration, gameState.creationMode, markPuzzleAsSolved);
    });

// Show creation tools if in creation mode
if (creationMode) {
    document.querySelector('.creator-tools').style.display = 'block';
    document.querySelector('.creation-only').style.display = 'block';
}
