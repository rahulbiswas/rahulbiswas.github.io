import { createBoard } from './board.js';
import { isPuzzleSolved } from './utils.js';

/**
 * Loads a specific puzzle by index
 * @param {Array} puzzleBook - Array of all puzzles
 * @param {number} index - Puzzle index to load
 * @param {Object} gameState - Current game state object
 * @param {Object} callbacks - UI update callbacks
 * @returns {Object} - Updated game state
 */
function loadPuzzle(puzzleBook, index, gameState, callbacks) {
    if (index >= 0 && index < puzzleBook.length) {
        const newGameState = {
            ...gameState,
            currentPuzzleIndex: index,
            seaweedLocations: puzzleBook[index].seaweedLocations,
            targetMinFish: puzzleBook[index].minFish,
            fishLocations: []
        };
        
        newGameState.board = createBoard(newGameState.fishLocations, newGameState.seaweedLocations);
        
        // Reset target count display
        document.getElementById('targetCount').textContent = newGameState.targetMinFish;
        document.getElementById('targetCount').style.display = 'none';
        
        return newGameState;
    }
    return gameState;
}

/**
 * Loads next puzzle
 * @param {Array} puzzleBook - Array of all puzzles
 * @param {Object} gameState - Current game state
 * @param {Object} callbacks - UI update callbacks
 * @returns {Object} - Updated game state
 */
function loadNextPuzzle(puzzleBook, gameState, callbacks) {
    return loadPuzzle(puzzleBook, gameState.currentPuzzleIndex + 1, gameState, callbacks);
}

/**
 * Loads previous puzzle
 * @param {Array} puzzleBook - Array of all puzzles
 * @param {Object} gameState - Current game state
 * @param {Object} callbacks - UI update callbacks
 * @returns {Object} - Updated game state
 */
function loadPrevPuzzle(puzzleBook, gameState, callbacks) {
    return loadPuzzle(puzzleBook, gameState.currentPuzzleIndex - 1, gameState, callbacks);
}

export { loadPuzzle, loadNextPuzzle, loadPrevPuzzle };
