SIZE = 10
fishLocations = [],
seaweedLocations = [{x: 6, y: 1}, {x: 6, y: 3}]
const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');
board = createBoard(fishLocations, seaweedLocations)
console.log(board)
drawBoxes();

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
});

function getColor(str) {
  return {
		'background': '#0D3B66',
		'x': '#05668D',
		'.': '#13B6F6',
		'f': '#E9724C',
		's': '#3CCD65'
  }[str];
}