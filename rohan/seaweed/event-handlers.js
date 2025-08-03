import { SIZE, createBoard, toggleFish } from './board.js';
import { markPuzzleAsSolved } from './utils.js';
import { loadNextPuzzle, loadPrevPuzzle } from './puzzle-manager.js';
import { updateGrid, updateStatusDisplay } from './ui.js';

/**
 * Sets up mouse and touch event listeners for the grid
 */
function setupGridEventListeners(gridContainer, gameState, isTouchDevice) {
    // Mouse hover preview (desktop only)
    if (!isTouchDevice) {
        gridContainer.addEventListener('mousemove', function(event) {
            if (!event.target.classList.contains('grid-cell')) return;
            
            const x = parseInt(event.target.dataset.x);
            const y = parseInt(event.target.dataset.y);
            
            // Only update if position changed
            if (x !== gameState.previewX || y !== gameState.previewY) {
                gameState.previewX = x;
                gameState.previewY = y;
                updateGrid(gridContainer, gameState.board, gameState.fishLocations, gameState.seaweedLocations, gameState.previewX, gameState.previewY, isTouchDevice, gameState.targetMinFish);
            }
        });

        gridContainer.addEventListener('mouseleave', function() {
            gameState.previewX = -1;
            gameState.previewY = -1;
            updateGrid(gridContainer, gameState.board, gameState.fishLocations, gameState.seaweedLocations, gameState.previewX, gameState.previewY, isTouchDevice, gameState.targetMinFish);
        });
    }

    // Handle cell clicks to place/remove fish
    gridContainer.addEventListener('click', function(event) {
        if (!event.target.classList.contains('grid-cell')) return;
        
        const x = parseInt(event.target.dataset.x);
        const y = parseInt(event.target.dataset.y);
        
        if (x >= 0 && x < SIZE && y >= 0 && y < SIZE) {
            gameState.fishLocations = toggleFish(x, y, gameState.fishLocations, gameState.seaweedLocations, gameState.targetMinFish);
            gameState.board = createBoard(gameState.fishLocations, gameState.seaweedLocations);
            updateGrid(gridContainer, gameState.board, gameState.fishLocations, gameState.seaweedLocations, gameState.previewX, gameState.previewY, isTouchDevice, gameState.targetMinFish);
            updateStatusDisplay(gameState.currentPuzzleIndex, gameState.puzzleBook, gameState.fishLocations, gameState.targetMinFish, gameState.board, markPuzzleAsSolved);
        }
    });
}

/**
 * Navigation functions
 */
function createPrevPuzzleHandler(gameState, gridContainer, isTouchDevice) {
    return function() {
        const currentGameState = {
            currentPuzzleIndex: gameState.currentPuzzleIndex,
            seaweedLocations: gameState.seaweedLocations,
            fishLocations: gameState.fishLocations,
            board: gameState.board
        };
        
        const newState = loadPrevPuzzle(gameState.puzzleBook, currentGameState, { updateGrid, updateStatusDisplay });
        
        gameState.currentPuzzleIndex = newState.currentPuzzleIndex;
        gameState.seaweedLocations = newState.seaweedLocations;
        gameState.targetMinFish = newState.targetMinFish;
        gameState.fishLocations = newState.fishLocations;
        gameState.board = newState.board;
        
        updateGrid(gridContainer, gameState.board, gameState.fishLocations, gameState.seaweedLocations, gameState.previewX, gameState.previewY, isTouchDevice, gameState.targetMinFish);
        updateStatusDisplay(gameState.currentPuzzleIndex, gameState.puzzleBook, gameState.fishLocations, gameState.targetMinFish, gameState.board, markPuzzleAsSolved);
    };
}

function createNextPuzzleHandler(gameState, gridContainer, isTouchDevice) {
    return function() {
        const currentGameState = {
            currentPuzzleIndex: gameState.currentPuzzleIndex,
            seaweedLocations: gameState.seaweedLocations,
            fishLocations: gameState.fishLocations,
            board: gameState.board
        };
        
        const newState = loadNextPuzzle(gameState.puzzleBook, currentGameState, { updateGrid, updateStatusDisplay });
        
        gameState.currentPuzzleIndex = newState.currentPuzzleIndex;
        gameState.seaweedLocations = newState.seaweedLocations;
        gameState.targetMinFish = newState.targetMinFish;
        gameState.fishLocations = newState.fishLocations;
        gameState.board = newState.board;
        
        updateGrid(gridContainer, gameState.board, gameState.fishLocations, gameState.seaweedLocations, gameState.previewX, gameState.previewY, isTouchDevice, gameState.targetMinFish);
        updateStatusDisplay(gameState.currentPuzzleIndex, gameState.puzzleBook, gameState.fishLocations, gameState.targetMinFish, gameState.board, markPuzzleAsSolved);
    };
}

function createResetPuzzleHandler(gameState, gridContainer, isTouchDevice) {
    return function() {
        gameState.fishLocations = [];
        gameState.board = createBoard(gameState.fishLocations, gameState.seaweedLocations);
        updateGrid(gridContainer, gameState.board, gameState.fishLocations, gameState.seaweedLocations, gameState.previewX, gameState.previewY, isTouchDevice, gameState.targetMinFish);
        updateStatusDisplay(gameState.currentPuzzleIndex, gameState.puzzleBook, gameState.fishLocations, gameState.targetMinFish, gameState.board, markPuzzleAsSolved);
    };
}

export { 
    setupGridEventListeners, 
    createPrevPuzzleHandler, 
    createNextPuzzleHandler, 
    createResetPuzzleHandler
};
