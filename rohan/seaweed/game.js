SIZE = 10
fishLocations = []
seaweedLocations = createSeaweeds()
minFish = -1
const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');
board = createBoard(fishLocations, seaweedLocations)
console.log(board)
iteration = -1
drawBoxes();

console.log('Creating MCMC worker');
const mcmcWorker = new Worker('mcmc-worker.js');

mcmcWorker.onmessage = function(e) {
    console.log('Received message from worker:', e.data);
    if (e.data.type === 'progress') {
        iteration = e.data.iteration;
        drawBoxes();
    } else if (e.data.type === 'newBest') {
        console.log('New best solution found:', e.data.score);
        fishLocations = e.data.fishLocations;
        board = createBoard(fishLocations, seaweedLocations);
        drawBoxes();
        sleep(3000);
    }
};

function countUnseen(board) {
    let count = 0;
    for (let x = 0; x < SIZE; x++) {
        for (let y = 0; y < SIZE; y++) {
            if (board[x][y] === 'x') count++;
        }
    }
    return count;
}

function isSeaweed(x, y) {
    return seaweedLocations.some(s => s.x === x && s.y === y);
}

function mcmcButtonClick() {
    console.log('Starting MCMC with seaweed locations:', seaweedLocations);
    mcmcWorker.postMessage({
        type: 'start',
        seaweedLocations: seaweedLocations
    });
}

async function greedyButtonClick() {
    fishLocations = [];
    board = createBoard(fishLocations, seaweedLocations);
    
    while (countUnseen(board) > 0) {
        let bestX = -1, bestY = -1, maxBenefit = -1;
        
        for (let x = 0; x < SIZE; x++) {
            for (let y = 0; y < SIZE; y++) {
                if (board[x][y] !== 'x') continue;
                
                let before = countUnseen(board);
                let tempFishLocations = [...fishLocations, {x: x, y: y}];
                let tempBoard = createBoard(tempFishLocations, seaweedLocations);
                let after = countUnseen(tempBoard);
                let benefit = before - after;
                
                if (benefit > maxBenefit) {
                    maxBenefit = benefit;
                    bestX = x;
                    bestY = y;
                }
            }
        }
        
        if (bestX === -1) break;
        
        fishLocations.push({x: bestX, y: bestY});
        board = createBoard(fishLocations, seaweedLocations);
        drawBoxes();
        await sleep(100);
    }
}

function createSeaweeds() {
	seaweedLocations = []
	numSeaweeds = 1 + Math.floor(Math.random() * 19);
	for (let seaweedIndex = 0; seaweedIndex < numSeaweeds; seaweedIndex++) {
		seaweedX = Math.floor(Math.random() * 9);
		seaweedY = Math.floor(Math.random() * 9);
		seaweedLocations.push({x:seaweedX, y:seaweedY})
	}
	return seaweedLocations
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
  for (fishLocation of fishLocations) {
    board[fishLocation.x][fishLocation.y] = 'f'
  }
  for (seaweedLocation of seaweedLocations) {
    board[seaweedLocation.x][seaweedLocation.y] = 's'
  }

  for (fishLocation of fishLocations) {
    fx = fishLocation.x
    fy = fishLocation.y

    // left
    for (y = fy - 1; y >= 0; y--) {
      c = board[fx][y]
      if ((c === 's') || (c === 'f')) {
        break
      }
      board[fx][y] = '.'
    }

    // up
    for (x = fx - 1; x >= 0; x--) {
      c = board[x][fy]
      if ((c === 's') || (c === 'f')) {
        break
      }
      board[x][fy] = '.'
    }

    // right
    for (let y = fy + 1; y <= 9; y++) {
      c = board[fx][y]
      if ((c === 's') || (c === 'f')) {
        break
      }
      board[fx][y] = '.'
    }

    // down
    for (let x = fx + 1; x <= 9; x++) {
      c = board[x][fy]
      if ((c === 's') || (c === 'f')) {
        break
      }
      board[x][fy] = '.'
    }
  }
	
	isSolved = true
	for (let x = 0; x < SIZE; x++) {
		for (let y = 0; y < SIZE; y++) {
		 	if (board[x][y] === 'x') {
				isSolved = false
		 	}
	  }
	}
	if (isSolved) {
		if ((fishLocations.length < minFish) || (minFish == -1)) {
			minFish = fishLocations.length
		}
	}	
  return board
}

function drawBox(color, x, y) {
	ctx.fillStyle = color;
	ctx.fillRect(20 + y * 870 / SIZE, 20 + x * 870 / SIZE, 870 / SIZE - 10, 870 / SIZE - 10)
}

function coordinatesToIndex(x, y) {
	return 3*x+y
}

function drawBoxes() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx.fillStyle = getColor('background');
	ctx.fillRect(0, 0, 900, 900)

	for (x = 0; x < SIZE; x++) {
		for (y = 0; y < SIZE; y++) {
			piece = board[x][y]
			color = getColor(piece)
			drawBox(color, x, y)
		}
	}
	
	ctx.fillStyle = "black";
  ctx.font = "24px Arial";
  ctx.textAlign = "right";
  ctx.fillText(minFish, 1080, 30);
  ctx.fillText(iteration, 1080, 60);
}

canvas.addEventListener('click', function(event) {
  const rect = canvas.getBoundingClientRect();
  
  const px = event.clientX - rect.left;
  const py = event.clientY - rect.top;
  	
	x = Math.floor((py - 20) * SIZE / 870);
	y = Math.floor((px - 20) * SIZE / 870);
	
	if ((x < 0) || (y < 0) || (x > SIZE) || (y > SIZE)) {
		return
	}

	toggleFish(x, y)
});

function toggleFish(x, y) {
  for (seaweedLocation of seaweedLocations) {
		if (seaweedLocation.x === x) {
			if (seaweedLocation.y === y) {
				return
			}
		}
	}
	fishExists = false
  for (fishLocation of fishLocations) {
		if (fishLocation.x === x) {
			if (fishLocation.y === y) {
				fishExists = true
			}
		}
	}
		
	if (fishExists) {
		fishLocations = fishLocations.filter(fish => !(fish.x === x && fish.y === y));
	} else {	
		fishLocations.push({x: x, y: y})
	}
	board = createBoard(fishLocations, seaweedLocations)
	drawBoxes()
}

function getColor(str) {
  return {
		'background': '#0D3B66',
		'x': '#05668D',
		'.': '#13B6F6',
		'f': '#E9724C',
		's': '#3CCD65'
  }[str];
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function randomNButtonClick(numIterations) {
  for (n = 0; n < numIterations; n++) {
    x = Math.floor(Math.random() * 9);
    y = Math.floor(Math.random() * 9);	
    console.log('randomButtonClick', n, x, y);
		iteration = n
    toggleFish(x, y);
    await sleep(1000);
  }
}
