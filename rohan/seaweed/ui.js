import { SIZE, countUnseen, isSeaweed, createBoard } from './board.js';
import { isPuzzleSolved, getSolvedCount } from './utils.js';

/**
 * Updates layout to be responsive to window size
 * Centers the game board and adjusts cell sizes dynamically
 */
function updateLayout(gameContainer, boardContainer, controlsContainer) {
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    console.log('Window dimensions:', { windowWidth, windowHeight });

    // Get CSS variables for dynamic layout calculations
    const styles = getComputedStyle(document.documentElement);
    const borderWidth = parseInt(styles.getPropertyValue('--border-width')) * 2;
    const controlsHeight = parseInt(styles.getPropertyValue('--controls-height'));
    const controlsPadding = parseInt(styles.getPropertyValue('--controls-padding')) * 2;

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

/**
 * Creates the 10x10 grid of cells
 * Each cell stores its coordinates in data attributes
 */
function createGrid(gridContainer) {
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

/**
 * Updates the visual state of all grid cells
 * Applies appropriate CSS classes based on board state
 * Handles preview rendering for mouse hover
 */
function updateGrid(gridContainer, board, fishLocations, seaweedLocations, previewX, previewY, isTouchDevice) {
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
function updatePuzzleDisplay(currentPuzzleIndex, puzzleBook) {
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
function updateStatusDisplay(currentPuzzleIndex, puzzleBook, fishLocations, targetMinFish, board, minFish, iteration, creationMode, markPuzzleAsSolved) {
    // Update puzzle counter
    updatePuzzleDisplay(currentPuzzleIndex, puzzleBook);
    
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
        updatePuzzleDisplay(currentPuzzleIndex, puzzleBook);
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

export { updateLayout, createGrid, updateGrid, updatePuzzleDisplay, updateStatusDisplay };
