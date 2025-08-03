import { SIZE, countUnseen, isSeaweed, createSeaweeds, createBoard, toggleFish } from './board.js';
import { sleep, downloadConfigs, markPuzzleAsSolved } from './utils.js';
import { checkAndUpdateMinFish, runGreedyAlgorithm } from './algorithms.js';
import { loadPuzzle, loadNextPuzzle, loadPrevPuzzle } from './puzzle-manager.js';
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
            gameState.minFish = checkAndUpdateMinFish(gameState.fishLocations, gameState.board, gameState.minFish, () => updateStatusDisplay(gameState.currentPuzzleIndex, gameState.puzzleBook, gameState.fishLocations, gameState.targetMinFish, gameState.board, gameState.minFish, gameState.iteration, gameState.creationMode, markPuzzleAsSolved));
            updateGrid(gridContainer, gameState.board, gameState.fishLocations, gameState.seaweedLocations, gameState.previewX, gameState.previewY, isTouchDevice, gameState.targetMinFish);
            updateStatusDisplay(gameState.currentPuzzleIndex, gameState.puzzleBook, gameState.fishLocations, gameState.targetMinFish, gameState.board, gameState.minFish, gameState.iteration, gameState.creationMode, markPuzzleAsSolved);
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
            minFish: gameState.minFish,
            board: gameState.board
        };
        
        const newState = loadPrevPuzzle(gameState.puzzleBook, currentGameState, { updateGrid, updateStatusDisplay });
        
        gameState.currentPuzzleIndex = newState.currentPuzzleIndex;
        gameState.seaweedLocations = newState.seaweedLocations;
        gameState.targetMinFish = newState.targetMinFish;
        gameState.fishLocations = newState.fishLocations;
        gameState.minFish = newState.minFish;
        gameState.board = newState.board;
        
        updateGrid(gridContainer, gameState.board, gameState.fishLocations, gameState.seaweedLocations, gameState.previewX, gameState.previewY, isTouchDevice, gameState.targetMinFish);
        updateStatusDisplay(gameState.currentPuzzleIndex, gameState.puzzleBook, gameState.fishLocations, gameState.targetMinFish, gameState.board, gameState.minFish, gameState.iteration, gameState.creationMode, markPuzzleAsSolved);
    };
}

function createNextPuzzleHandler(gameState, gridContainer, isTouchDevice) {
    return function() {
        const currentGameState = {
            currentPuzzleIndex: gameState.currentPuzzleIndex,
            seaweedLocations: gameState.seaweedLocations,
            fishLocations: gameState.fishLocations,
            minFish: gameState.minFish,
            board: gameState.board
        };
        
        const newState = loadNextPuzzle(gameState.puzzleBook, currentGameState, { updateGrid, updateStatusDisplay });
        
        gameState.currentPuzzleIndex = newState.currentPuzzleIndex;
        gameState.seaweedLocations = newState.seaweedLocations;
        gameState.targetMinFish = newState.targetMinFish;
        gameState.fishLocations = newState.fishLocations;
        gameState.minFish = newState.minFish;
        gameState.board = newState.board;
        
        updateGrid(gridContainer, gameState.board, gameState.fishLocations, gameState.seaweedLocations, gameState.previewX, gameState.previewY, isTouchDevice, gameState.targetMinFish);
        updateStatusDisplay(gameState.currentPuzzleIndex, gameState.puzzleBook, gameState.fishLocations, gameState.targetMinFish, gameState.board, gameState.minFish, gameState.iteration, gameState.creationMode, markPuzzleAsSolved);
    };
}

function createResetPuzzleHandler(gameState, gridContainer, isTouchDevice) {
    return function() {
        gameState.fishLocations = [];
        gameState.board = createBoard(gameState.fishLocations, gameState.seaweedLocations);
        updateGrid(gridContainer, gameState.board, gameState.fishLocations, gameState.seaweedLocations, gameState.previewX, gameState.previewY, isTouchDevice, gameState.targetMinFish);
        updateStatusDisplay(gameState.currentPuzzleIndex, gameState.puzzleBook, gameState.fishLocations, gameState.targetMinFish, gameState.board, gameState.minFish, gameState.iteration, gameState.creationMode, markPuzzleAsSolved);
    };
}

/**
 * Algorithm button handlers
 */
function createGreedyButtonHandler(gameState, gridContainer, isTouchDevice) {
    return async function() {
        const result = await runGreedyAlgorithm(
            [],
            gameState.seaweedLocations,
            (newFishLocations, newBoard, newMinFish) => {
                gameState.fishLocations = newFishLocations;
                gameState.board = newBoard;
                gameState.minFish = newMinFish;
                updateGrid(gridContainer, gameState.board, gameState.fishLocations, gameState.seaweedLocations, gameState.previewX, gameState.previewY, isTouchDevice, gameState.targetMinFish);
                updateStatusDisplay(gameState.currentPuzzleIndex, gameState.puzzleBook, gameState.fishLocations, gameState.targetMinFish, gameState.board, gameState.minFish, gameState.iteration, gameState.creationMode, markPuzzleAsSolved);
            },
            100
        );
        
        // Update final state
        gameState.fishLocations = result.fishLocations;
        gameState.board = result.board;
        gameState.minFish = result.minFish;
    };
}

function createMcmcButtonHandler(gameState, mcmcWorker, mcmcIterations) {
    return function() {
        mcmcWorker.postMessage({
            type: 'start',
            seaweedLocations: gameState.seaweedLocations,
            iterations: mcmcIterations
        });
    };
}

function createBookButtonHandler(gameState, mcmcWorker, mcmcIterations) {
    return function() {
        gameState.savedConfigs = [];
        gameState.currentConfig = 0;
        gameState.minFish = -1;
        gameState.seaweedLocations = createSeaweeds();
        mcmcWorker.postMessage({
            type: 'start',
            seaweedLocations: gameState.seaweedLocations,
            iterations: mcmcIterations
        });
    };
}

/**
 * MCMC Worker message handler
 */
function createWorkerMessageHandler(gameState, gridContainer, isTouchDevice, numGames, mcmcIterations, mcmcWorker) {
    return function(e) {
        if (e.data.type === 'progress') {
            // Update iteration counter
            gameState.iteration = e.data.iteration;
            updateStatusDisplay(gameState.currentPuzzleIndex, gameState.puzzleBook, gameState.fishLocations, gameState.targetMinFish, gameState.board, gameState.minFish, gameState.iteration, gameState.creationMode, markPuzzleAsSolved);
            updateGrid(gridContainer, gameState.board, gameState.fishLocations, gameState.seaweedLocations, gameState.previewX, gameState.previewY, isTouchDevice, gameState.targetMinFish);
        } else if (e.data.type === 'newBest') {
            // New best solution found
            gameState.fishLocations = e.data.fishLocations;
            gameState.board = createBoard(gameState.fishLocations, gameState.seaweedLocations);
            gameState.minFish = checkAndUpdateMinFish(gameState.fishLocations, gameState.board, gameState.minFish, () => updateStatusDisplay(gameState.currentPuzzleIndex, gameState.puzzleBook, gameState.fishLocations, gameState.targetMinFish, gameState.board, gameState.minFish, gameState.iteration, gameState.creationMode, markPuzzleAsSolved));
            updateGrid(gridContainer, gameState.board, gameState.fishLocations, gameState.seaweedLocations, gameState.previewX, gameState.previewY, isTouchDevice, gameState.targetMinFish);
            sleep(3000);  // Brief pause to show solution
        } else if (e.data.type === 'complete') {
            // MCMC run complete
            gameState.savedConfigs.push({
                seaweedLocations: gameState.seaweedLocations,
                minFish: e.data.score
            });
            
            // Generate next puzzle if in batch mode
            gameState.currentConfig++;
            if (gameState.currentConfig < numGames) {
                gameState.seaweedLocations = createSeaweeds();
                gameState.minFish = -1;
                mcmcWorker.postMessage({
                    type: 'start',
                    seaweedLocations: gameState.seaweedLocations,
                    iterations: mcmcIterations
                });
            } else {
                downloadConfigs(gameState.savedConfigs);
            }
        }
    };
}

export { 
    setupGridEventListeners, 
    createPrevPuzzleHandler, 
    createNextPuzzleHandler, 
    createResetPuzzleHandler,
    createGreedyButtonHandler,
    createMcmcButtonHandler,
    createBookButtonHandler,
    createWorkerMessageHandler
};
