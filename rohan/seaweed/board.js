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

function createSeaweeds() {
    let newSeaweedLocations = [];
    let numSeaweeds = 1 + Math.floor(Math.random() * 19);
    for (let seaweedIndex = 0; seaweedIndex < numSeaweeds; seaweedIndex++) {
        let seaweedX = Math.floor(Math.random() * 9);
        let seaweedY = Math.floor(Math.random() * 9);
        newSeaweedLocations.push({x: seaweedX, y: seaweedY});
    }
    return newSeaweedLocations;
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

function toggleFish(x, y, fishLocations, seaweedLocations) {
    for (let seaweedLocation of seaweedLocations) {
        if (seaweedLocation.x === x) {
            if (seaweedLocation.y === y) {
                return fishLocations;
            }
        }
    }
    let fishExists = false;
    for (let fishLocation of fishLocations) {
        if (fishLocation.x === x) {
            if (fishLocation.y === y) {
                fishExists = true;
            }
        }
    }
        
    if (fishExists) {
        return fishLocations.filter(fish => !(fish.x === x && fish.y === y));
    } else {    
        return [...fishLocations, {x: x, y: y}];
    }
}

export { SIZE, countUnseen, isSeaweed, createSeaweeds, createBoard, toggleFish };
