import { SIZE, countUnseen, createBoard } from './board.js';
import { sleep } from './utils.js';

/**
 * Checks if current solution is complete and updates best score
 * @param {Array} fishLocations - Current fish placements
 * @param {Array} board - Current board state
 * @param {number} currentMinFish - Current best score (-1 if none)
 * @param {Function} updateCallback - Callback to trigger UI updates
 * @returns {number} - Updated minimum fish count
 */
function checkAndUpdateMinFish(fishLocations, board, currentMinFish, updateCallback) {
    if (countUnseen(board) === 0) {
        if (fishLocations.length < currentMinFish || currentMinFish === -1) {
            const newMinFish = fishLocations.length;
            updateCallback();
            return newMinFish;
        }
    }
    return currentMinFish;
}

/**
 * Greedy algorithm - always places fish that reveals the most cells
 * Good for finding quick solutions but not always optimal
 * @param {Array} initialFishLocations - Starting fish positions
 * @param {Array} seaweedLocations - Seaweed obstacle positions  
 * @param {Function} updateCallback - Callback for UI updates (fishLocations, board, minFish)
 * @param {number} sleepMs - Animation delay in milliseconds
 * @returns {Object} - {fishLocations, board, minFish}
 */
async function runGreedyAlgorithm(initialFishLocations, seaweedLocations, updateCallback, sleepMs = 100) {
    let fishLocations = [...initialFishLocations];
    let board = createBoard(fishLocations, seaweedLocations);
    let minFish = -1;
    
    while (countUnseen(board) > 0) {
        let bestX = -1, bestY = -1, maxBenefit = -1;
        
        // Try every empty cell
        for (let x = 0; x < SIZE; x++) {
            for (let y = 0; y < SIZE; y++) {
                if (board[x][y] !== 'x') continue;
                
                // Calculate how many new cells this fish would reveal
                let before = countUnseen(board);
                let tempFishLocations = [...fishLocations, {x: x, y: y}];
                let tempBoard = createBoard(tempFishLocations, seaweedLocations);
                let after = countUnseen(tempBoard);
                let benefit = before - after;
                
                // Track the best position
                if (benefit > maxBenefit) {
                    maxBenefit = benefit;
                    bestX = x;
                    bestY = y;
                }
            }
        }
        
        if (bestX === -1) break;  // No valid positions left
        
        // Place fish at best position
        fishLocations.push({x: bestX, y: bestY});
        board = createBoard(fishLocations, seaweedLocations);
        minFish = checkAndUpdateMinFish(fishLocations, board, minFish, () => {});
        
        // Update UI through callback
        updateCallback(fishLocations, board, minFish);
        await sleep(sleepMs);  // Animation delay
    }
    
    return { fishLocations, board, minFish };
}

export { checkAndUpdateMinFish, runGreedyAlgorithm };
