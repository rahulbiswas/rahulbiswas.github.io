import { SIZE, countUnseen, isSeaweed, createSeaweeds, createBoard, toggleFish } from './board.js';
import { sleep, downloadConfigs, getSolvedPuzzles, markPuzzleAsSolved, isPuzzleSolved, getSolvedCount } from './utils.js';
import { checkAndUpdateMinFish, runGreedyAlgorithm } from './algorithms.js';
import { loadPuzzle, loadNextPuzzle, loadPrevPuzzle } from './puzzle-manager.js';

// Parse URL parameters for game configuration
const urlParams = new URLSearchParams(window.location.search);
const mcmcIterations = parseInt(urlParams.get('iterations')) || 500000;  // Default 500k iterations
const numGames = parseInt(urlParams.get('games')) || 100;  // For puzzle generation mode
const creationMode = urlParams.get('mode') === 'create';  // Enable puzzle creation tools
const isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);

// Get CSS variables for dynamic layout calculations
const styles = getComputedStyle(document.documentElement);
const borderWidth = parseInt(styles.getPropertyValue('--border-width')) * 2;
const controlsHeight = parseInt(styles.getPropertyValue('--controls-height'));
const controlsPadding = parseInt(styles.getPropertyValue('--controls-padding')) * 2;

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

/**
 * Updates layout to be responsive to window size
 * Centers the game board and adjusts cell sizes dynamically
 */
function updateLayout() {
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    console.log('Window dimensions:', { windowWidth, windowHeight });

    // Set game container to full viewport
    gameContainer.style.width = `${windowWidth}px`;
    gameContainer.style.height = `${windowHeight}px`;
    
    // Calculate available space for board (minus controls)
    const totalControlsHeight = controlsHeight + controlsPadding;
    const boardWindowHeight = windowHeight - totalControlsHeight;
    const boardSize = Math.min(windowWidth - borderWidth, boardWindowHeight - borderWidth);

    // Calculate cell size (board size minus gaps, divided by 10 cells)
    const cellSize = (boardSize - (11 * 2)) / 10;  // 11 gaps (9 between cells + 2 edges)

    // Set dynamic border radius (15% of cell size)
    const dynamicRadius = Math.max(2, Math.round(cellSize * 0.15));
    document.documentElement.style.setProperty('--cell-border-radius', dynamicRadius + 'px');

    // Check if width or height is the limiting factor
    const isWidthConstrained = (windowWidth - borderWidth) < (boardWindowHeight - borderWidth);
    console.log('isWidthConstrained ' + isWidthConstrained)
    
    // Position board container (centered in available space)
    boardContainer.style.position = 'absolute';
    if (isWidthConstrained) {
        boardContainer.style.left = `0`;
        boardContainer.style.top = `${(boardWindowHeight - boardSize - borderWidth) / 2}px`;
    } else {
        boardContainer.style.top = '0';
        boardContainer.style.left = `${(windowWidth - boardSize - borderWidth) / 2}px`;
    }
    boardContainer.style.width = `${boardSize}px`;
    boardContainer.style.height = `${boardSize}px`;
    
    // Position controls at bottom
    controlsContainer.style.position = 'absolute';
    controlsContainer.style.bottom = `${borderWidth/2}px`;
    controlsContainer.style.left = `${borderWidth/2}px`;
    controlsContainer.style.width = `${windowWidth - borderWidth}px`;
}

// Set up responsive layout
window.addEventListener('resize', updateLayout);
updateLayout();

/**
 * Creates the 10x10 grid of cells
 * Each cell stores its coordinates in data attributes
 */
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

/**
 * Updates the visual state of all grid cells
 * Applies appropriate CSS classes based on board state
 * Handles preview rendering for mouse hover
 */
function updateGrid() {
    if (!board) return;
    
    const cells = gridContainer.children;
    for (let x = 0; x < SIZE; x++) {
        for (let y = 0; y < SIZE; y++) {
            const cell = cells[x * SIZE + y];
            const piece = board[x][y];
            
            // Reset classes and apply current state
            cell.className = 'grid-cell';
            if (piece === '.') cell.classList.add('seen');      // Visible cell
            if (piece === 'f') cell.classList.add('fish');      // Fish placement
            if (piece === 's') cell.classList.add('seaweed');   // Seaweed obstacle
        }
    }

    // Show preview on hover (desktop only)
    if (!isTouchDevice && previewX >= 0 && previewX < SIZE && previewY >= 0 && previewY < SIZE) {
        // Only preview on empty cells (not seaweed)
        if (board[previewX][previewY] === 'x' && !isSeaweed(previewX, previewY, seaweedLocations)) {
            // Create temporary board with preview fish
            let previewBoard = createBoard([...fishLocations, {x: previewX, y: previewY}], seaweedLocations);
            
            // Show which cells would become visible
            for (let x = 0; x < SIZE; x++) {
                for (let y = 0; y < SIZE; y++) {
                    const cell = cells[x * SIZE + y];
                    if (previewBoard[x][y] === '.' && board[x][y] === 'x') {
                        cell.classList.add('seen', 'preview');
                    }
                }
            }
            // Show preview fish
            cells[previewX * SIZE + previewY].classList.add('fish', 'preview');
        }
    }
}

/**
 * Updates puzzle counter display with solved count
 */
function updatePuzzleDisplay() {
    const solvedCount = getSolvedCount();
    const totalPuzzles = puzzleBook.length;
    const currentDisplay = `${currentPuzzleIndex + 1} / ${totalPuzzles}`;
    const isCurrentSolved = isPuzzleSolved(currentPuzzleIndex);
    const solvedIndicator = isCurrentSolved ? ' ✓' : '';
    const solvedDisplay = `(${solvedCount} SOLVED)`;
    
    document.getElementById('puzzleCount').innerHTML = 
        `${currentDisplay}${solvedIndicator} <span style="color: var(--seaweed-color);">${solvedDisplay}</span>`;
}

/**
 * Updates all UI status displays
 * Shows different info based on play mode vs creation mode
 */
function updateStatusDisplay() {
    // Update puzzle counter
    updatePuzzleDisplay();
    
    // Update fish count with appropriate styling
    const fishCount = document.getElementById('fishCount');
    fishCount.textContent = fishLocations.length;
    
    // Check if we matched the optimal solution
    if (fishLocations.length === targetMinFish && countUnseen(board) === 0) {
        markPuzzleAsSolved(currentPuzzleIndex);
        fishCount.className = 'count-matched';
        // Hide everything and just show congratulations
        document.querySelector('.fish-label').style.display = 'none';
        document.querySelector('.fish-counter').style.display = 'none';
        document.querySelector('.fish-counter-separator').style.display = 'none';
        document.getElementById('targetCount').textContent = '🎉 SOLVED! 🎉';
        document.getElementById('targetCount').style.display = 'inline';
        updatePuzzleDisplay();
    } else if (fishLocations.length === targetMinFish) {
        fishCount.className = 'count-matched';
        // Show normal display if optimal but not complete
        document.querySelector('.fish-label').style.display = 'inline';
        document.querySelector('.fish-counter').style.display = 'inline-block';
        document.querySelector('.fish-counter-separator').style.display = 'inline';
        document.getElementById('targetCount').textContent = targetMinFish;
    } else {
        fishCount.className = 'count-normal';
        // Show normal display
        document.querySelector('.fish-label').style.display = 'inline';
        document.querySelector('.fish-counter').style.display = 'inline-block';
        document.querySelector('.fish-counter-separator').style.display = 'inline';
        document.getElementById('targetCount').textContent = targetMinFish;
    }

    // Show different stats for creation mode
    if (creationMode) {
        document.getElementById('minFishCount').textContent = minFish;
        document.getElementById('iterationCount').textContent = iteration;
        document.getElementById('targetCount').parentElement.style.display = 'none';
    } else {
        document.getElementById('creationStats').style.display = 'none';
    }
}

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
    
    updateGrid();
    updateStatusDisplay();
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
    
    updateGrid();
    updateStatusDisplay();
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
        
        updateGrid();
        updateStatusDisplay();
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
            updateGrid();
        }
    });

    gridContainer.addEventListener('mouseleave', function() {
        previewX = -1;
        previewY = -1;
        updateGrid();
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
        minFish = checkAndUpdateMinFish(fishLocations, board, minFish, updateStatusDisplay);
        updateGrid();
        updateStatusDisplay();
    }
});

// Set up Web Worker for MCMC algorithm
const mcmcWorker = new Worker('mcmc-worker.js', { type: 'module' });

// Handle messages from MCMC worker
mcmcWorker.onmessage = function(e) {
    if (e.data.type === 'progress') {
        // Update iteration counter
        iteration = e.data.iteration;
        updateStatusDisplay();
        updateGrid();
    } else if (e.data.type === 'newBest') {
        // New best solution found
        fishLocations = e.data.fishLocations;
        board = createBoard(fishLocations, seaweedLocations);
        minFish = checkAndUpdateMinFish(fishLocations, board, minFish, updateStatusDisplay);
        updateGrid();
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
            updateGrid();
            updateStatusDisplay();
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
