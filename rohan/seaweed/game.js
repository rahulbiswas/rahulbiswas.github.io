// Author: Rohan Biswas
import { markPuzzleAsSolved } from './utils.js';
import { loadPuzzle } from './puzzle-manager.js';
import { updateLayout, createGrid, updateGrid, updatePuzzleDisplay, updateStatusDisplay } from './ui.js';
import { 
    setupGridEventListeners, 
    createPrevPuzzleHandler, 
    createNextPuzzleHandler, 
    createResetPuzzleHandler
} from './event-handlers.js';

// Parse URL parameters for game configuration
const urlParams = new URLSearchParams(window.location.search);
const isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);

// Game state variables
const gameState = {
    puzzleBook: [],           // All loaded puzzles
    currentPuzzleIndex: 0,    // Which puzzle we're on
    targetMinFish: -1,        // Optimal solution for current puzzle
    fishLocations: [],        // Current fish placements
    seaweedLocations: [],     // Current seaweed positions
    board: null,             // Current board state
    previewX: -1,            // Mouse hover preview coordinates
    previewY: -1
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

// Setup event handlers
setupGridEventListeners(gridContainer, gameState, isTouchDevice);

// Create and assign navigation handlers
window.prevPuzzle = createPrevPuzzleHandler(gameState, gridContainer, isTouchDevice);
window.nextPuzzle = createNextPuzzleHandler(gameState, gridContainer, isTouchDevice);
window.resetPuzzle = createResetPuzzleHandler(gameState, gridContainer, isTouchDevice);

// Load puzzle data from JSON file
fetch('seaweed-configs.json')
    .then(response => response.json())
    .then(data => {
        gameState.puzzleBook = data;
        const currentGameState = {
            currentPuzzleIndex: gameState.currentPuzzleIndex,
            seaweedLocations: gameState.seaweedLocations,
            fishLocations: gameState.fishLocations,
            board: gameState.board
        };
        
        const newState = loadPuzzle(gameState.puzzleBook, 0, currentGameState, { updateGrid, updateStatusDisplay });
        
        gameState.currentPuzzleIndex = newState.currentPuzzleIndex;
        gameState.seaweedLocations = newState.seaweedLocations;
        gameState.targetMinFish = newState.targetMinFish;
        gameState.fishLocations = newState.fishLocations;
        gameState.board = newState.board;
        
        updateGrid(gridContainer, gameState.board, gameState.fishLocations, gameState.seaweedLocations, gameState.previewX, gameState.previewY, isTouchDevice, gameState.targetMinFish);
        updateStatusDisplay(gameState.currentPuzzleIndex, gameState.puzzleBook, gameState.fishLocations, gameState.targetMinFish, gameState.board, markPuzzleAsSolved);
    });
