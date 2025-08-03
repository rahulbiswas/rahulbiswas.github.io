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

    // Calculate cell size (board size minus gaps, divided by grid size)
    const cellSize = (boardSize - ((SIZE + 1) * 2)) / SIZE;

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
        boardContainer.style.top = `${totalControlsHeight + (boardWindowHeight - boardSize - borderWidth) / 2}px`;
    } else {
        boardContainer.style.top = `${totalControlsHeight}px`;
        boardContainer.style.left = `${(windowWidth - boardSize - borderWidth) / 2}px`;
    }
    boardContainer.style.width = `${boardSize}px`;
    boardContainer.style.height = `${boardSize}px`;
    
    // Position controls at top
    controlsContainer.style.position = 'absolute';
    controlsContainer.style.top = `${borderWidth/2}px`;
    controlsContainer.style.left = `${borderWidth/2}px`;
    controlsContainer.style.width = `${windowWidth - borderWidth}px`;
}

/**
 * Creates the grid of cells
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
function updateGrid(gridContainer, board, fishLocations, seaweedLocations, previewX, previewY, isTouchDevice, targetMinFish) {
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
        // Check if we've reached the fish limit
        if (targetMinFish !== -1 && fishLocations.length >= targetMinFish) {
            return; // Don't show preview if at limit
        }
        
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
    const solvedDisplay = `${solvedCount} SOLVED`;
    
    document.getElementById('puzzleCount').innerHTML = 
        `${currentDisplay}${solvedIndicator}<p></p><span style="color: var(--seaweed-color);">${solvedDisplay}</span>`;
}

/**
 * Updates all UI status displays
 */
function updateStatusDisplay(currentPuzzleIndex, puzzleBook, fishLocations, targetMinFish, board, markPuzzleAsSolved) {
    // Update puzzle counter
    updatePuzzleDisplay(currentPuzzleIndex, puzzleBook);
    
    // Check if we matched the optimal solution
    if (fishLocations.length === targetMinFish && countUnseen(board) === 0) {
        markPuzzleAsSolved(currentPuzzleIndex);
        document.getElementById('targetCount').textContent = '🎉 SOLVED! 🎉';
        document.getElementById('targetCount').style.display = 'inline';
        updatePuzzleDisplay(currentPuzzleIndex, puzzleBook);
    } else {
        document.getElementById('targetCount').style.display = 'none';
    }
}

export { updateLayout, createGrid, updateGrid, updatePuzzleDisplay, updateStatusDisplay };
