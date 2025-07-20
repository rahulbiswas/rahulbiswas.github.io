import { SIZE, countUnseen, isSeaweed, createBoard } from './board.js';

/**
 * Runs Monte Carlo Markov Chain algorithm to find optimal fish placement
 * This runs in a Web Worker to avoid blocking the main UI thread
 * @param {Array} seaweedLocations - Array of seaweed positions {x, y}
 * @param {number} iterations - Number of random trials to run
 */
async function runMCMC(seaweedLocations, iterations) {
    // Track the best solution found so far
    let bestScore = SIZE * SIZE;  // Start with worst case (all cells need fish)
    let bestFishLocations = [];
    
    // Try many random configurations
    for (let trial = 0; trial < iterations; trial++) {
        let fishLocations = [];
        let board = createBoard(fishLocations, seaweedLocations);
        
        // Keep adding fish randomly until all cells are visible
        while (countUnseen(board) > 0) {
            // Pick a random cell
            let x = Math.floor(Math.random() * SIZE);
            let y = Math.floor(Math.random() * SIZE);
            
            // Only place fish on unseen cells that aren't seaweed
            if (board[x][y] === 'x' && !isSeaweed(x, y, seaweedLocations)) {
                fishLocations.push({x: x, y: y});
                board = createBoard(fishLocations, seaweedLocations);
            }
        }
        
        // Check if this solution is better than our current best
        let score = fishLocations.length;
        if (score < bestScore) {
            bestScore = score;
            bestFishLocations = [...fishLocations];
            
            // Notify main thread of new best solution
            postMessage({
                type: 'newBest',
                fishLocations: bestFishLocations,
                score: bestScore
            });
        }
        
        // Send progress updates every 100 iterations
        if (trial % 100 === 0) {
            postMessage({
                type: 'progress',
                iteration: trial
            });
        }
    }

    // Send final result when done
    postMessage({
        type: 'complete',
        fishLocations: bestFishLocations,
        score: bestScore
    });
}

// Listen for messages from main thread
onmessage = function(e) {
    if (e.data.type === 'start') {
        runMCMC(e.data.seaweedLocations, e.data.iterations);
    }
}
