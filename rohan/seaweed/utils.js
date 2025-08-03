/**
 * Simple sleep/delay function
 * @param {number} ms - Milliseconds to wait
 */
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Downloads generated puzzles as JSON file
 * @param {Array} configs - Array of puzzle configurations to download
 */
function downloadConfigs(configs) {
    const blob = new Blob([JSON.stringify(configs, null, 2)], {type: 'application/json'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'seaweed-configs.json';
    a.click();
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

export { sleep, downloadConfigs, getSolvedPuzzles, markPuzzleAsSolved, isPuzzleSolved, getSolvedCount };
