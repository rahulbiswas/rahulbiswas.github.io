const SIZE = 10;

function countUnseen(board) {
    let count = 0;
    for (let x = 0; x < SIZE; x++) {
        for (let y = 0; y < SIZE; y++) {
            if (board[x][y] === 'x') count++;
        }
    }
    return count;
}

function isSeaweed(x, y, seaweedLocations) {
    return seaweedLocations.some(s => s.x === x && s.y === y);
}

function createBoard(fishLocations, seaweedLocations) {
    const board = []
    const SIDE = 10
    for (let i = 0; i < SIDE; i++) {
        const row = []
        for (let j = 0; j < SIDE; j++) {
            row.push('x')
        }
        board.push(row)
    }
    for (let fishLocation of fishLocations) {
        board[fishLocation.x][fishLocation.y] = 'f'
    }
    for (let seaweedLocation of seaweedLocations) {
        board[seaweedLocation.x][seaweedLocation.y] = 's'
    }

    for (let fishLocation of fishLocations) {
        let fx = fishLocation.x
        let fy = fishLocation.y

        // left
        for (let y = fy - 1; y >= 0; y--) {
            let c = board[fx][y]
            if ((c === 's') || (c === 'f')) break
            board[fx][y] = '.'
        }

        // up
        for (let x = fx - 1; x >= 0; x--) {
            let c = board[x][fy]
            if ((c === 's') || (c === 'f')) break
            board[x][fy] = '.'
        }

        // right
        for (let y = fy + 1; y <= 9; y++) {
            let c = board[fx][y]
            if ((c === 's') || (c === 'f')) break
            board[fx][y] = '.'
        }

        // down
        for (let x = fx + 1; x <= 9; x++) {
            let c = board[x][fy]
            if ((c === 's') || (c === 'f')) break
            board[x][fy] = '.'
        }
    }
    return board;
}

async function runMCMC(seaweedLocations) {
    let bestScore = SIZE * SIZE;
    let bestFishLocations = [];
    
    for (let trial = 0; trial < 500000; trial++) {
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
}

onmessage = function(e) {
    if (e.data.type === 'start') {
        runMCMC(e.data.seaweedLocations);
    }
}
