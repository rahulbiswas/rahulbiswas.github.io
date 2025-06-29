import { SIZE, countUnseen, isSeaweed, createBoard } from './board.js';

async function runMCMC(seaweedLocations, iterations) {
    let bestScore = SIZE * SIZE;
    let bestFishLocations = [];
    
    for (let trial = 0; trial < iterations; trial++) {
        let fishLocations = [];
        let board = createBoard(fishLocations, seaweedLocations);
        
        while (countUnseen(board) > 0) {
            let x = Math.floor(Math.random() * SIZE);
            let y = Math.floor(Math.random() * SIZE);
            if (board[x][y] === 'x' && !isSeaweed(x, y, seaweedLocations)) {
                fishLocations.push({x: x, y: y});
                board = createBoard(fishLocations, seaweedLocations);
            }
        }
        
        let score = fishLocations.length;
        if (score < bestScore) {
            bestScore = score;
            bestFishLocations = [...fishLocations];
            postMessage({
                type: 'newBest',
                fishLocations: bestFishLocations,
                score: bestScore
            });
        }
        
        if (trial % 100 === 0) {
            postMessage({
                type: 'progress',
                iteration: trial
            });
        }
    }

    postMessage({
        type: 'complete',
        fishLocations: bestFishLocations,
        score: bestScore
    });
}

onmessage = function(e) {
    if (e.data.type === 'start') {
        runMCMC(e.data.seaweedLocations, e.data.iterations);
    }
}
