/**
 * Simple sleep/delay function
 * @param {number} ms - Milliseconds to wait
 */
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Get list of solved puzzle indices from localStorage
 * @returns {Array} Array of solved puzzle indices
 */
function getSolvedPuzzles() {
    return JSON.parse(localStorage.getItem('seaweedSolvedPuzzles') || '[]');
}

/**
 * Mark a puzzle as solved
 * @param {number} puzzleIndex - Index of the solved puzzle
 */
function markPuzzleAsSolved(puzzleIndex) {
    const solved = getSolvedPuzzles();
    if (!solved.includes(puzzleIndex)) {
        solved.push(puzzleIndex);
        localStorage.setItem('seaweedSolvedPuzzles', JSON.stringify(solved));
    }
}

/**
 * Check if a specific puzzle is solved
 * @param {number} puzzleIndex - Puzzle index to check
 * @returns {boolean} True if puzzle is solved
 */
function isPuzzleSolved(puzzleIndex) {
    return getSolvedPuzzles().includes(puzzleIndex);
}

/**
 * Get total count of solved puzzles
 * @returns {number} Number of solved puzzles
 */
function getSolvedCount() {
    return getSolvedPuzzles().length;
}

export { sleep, getSolvedPuzzles, markPuzzleAsSolved, isPuzzleSolved, getSolvedCount };
