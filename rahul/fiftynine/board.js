class ColorBoard {
  constructor(containerId) {
    console.log('Creating new ColorBoard!');
    this.tiles = [];
    this.container = document.getElementById(containerId);
    this.pastelColors = [
      '#FFD1DC',  // pink
      '#98FF98',  // mint
      '#E6E6FA',  // lavender
      '#89CFF0',  // baby blue
      '#FFDAB9',  // peach
      '#FFFACD'   // yellow
    ];
    
    const style = getComputedStyle(document.documentElement);
    this.tileSize = parseInt(style.getPropertyValue('--tile-size'));
    this.gap = parseInt(style.getPropertyValue('--tile-gap'));
    this.moveDelay = parseInt(style.getPropertyValue('--move-delay'));
    const spacePerTile = this.tileSize + this.gap;
    
    this.columns = Math.floor((window.innerWidth * 0.95) / spacePerTile);
    this.rows = Math.floor((window.innerHeight * 0.95) / spacePerTile);
    
    const totalWidth = (this.columns * this.tileSize) + ((this.columns - 1) * this.gap);
    const totalHeight = (this.rows * this.tileSize) + ((this.rows - 1) * this.gap);
    this.container.style.width = `${totalWidth}px`;
    this.container.style.height = `${totalHeight}px`;
    
    this.initializeTiles();
    this.render();
    this.startAutoMove();
  }

  initializeTiles() {
    const style = getComputedStyle(document.documentElement);
    const emptyPercent = parseInt(style.getPropertyValue('--empty-percent'));
    
    let colorIndex = 0;
    for (let y = 0; y < this.rows; y++) {
      for (let x = 0; x < this.columns; x++) {
        if (Math.random() * 100 < emptyPercent) {
          console.log(`Skipping position at x:${x}, y:${y}`);
          continue;
        }
        
        this.tiles.push({
          color: this.pastelColors[colorIndex % 6],
          position: { x, y }
        });
        colorIndex++;
      }
    }
    console.log('Initialized tiles:', this.tiles);
  }

  render() {
    if (this.container.children.length === 0) {
      this.tiles.forEach(tile => {
        const tileElement = document.createElement('div');
        tileElement.className = 'tile';
        tileElement.style.backgroundColor = tile.color;
        tileElement.style.left = `${tile.position.x * (this.tileSize + this.gap)}px`;
        tileElement.style.top = `${tile.position.y * (this.tileSize + this.gap)}px`;
        tileElement.addEventListener('click', () => this.moveTile(tile));
        this.container.appendChild(tileElement);
      });
    } else {
      this.tiles.forEach((tile, index) => {
        const tileElement = this.container.children[index];
        tileElement.style.left = `${tile.position.x * (this.tileSize + this.gap)}px`;
        tileElement.style.top = `${tile.position.y * (this.tileSize + this.gap)}px`;
      });
    }
  }

  isPositionEmpty(x, y) {
    return !this.tiles.some(tile => 
      tile.position.x === x && tile.position.y === y
    );
  }

  getEmptyNeighbor(position) {
    const adjacentPositions = [
      {x: position.x - 1, y: position.y},
      {x: position.x + 1, y: position.y},
      {x: position.x, y: position.y - 1},
      {x: position.x, y: position.y + 1}
    ];
    
    const validEmptyPositions = adjacentPositions.filter(pos => 
      pos.x >= 0 && pos.x < this.columns &&
      pos.y >= 0 && pos.y < this.rows &&
      this.isPositionEmpty(pos.x, pos.y)
    );
    
    if (validEmptyPositions.length > 0) {
      return validEmptyPositions[Math.floor(Math.random() * validEmptyPositions.length)];
    }
    return null;
  }

  moveTile(tile) {
    const emptyNeighbor = this.getEmptyNeighbor(tile.position);
    if (emptyNeighbor) {
      tile.position = {...emptyNeighbor};
      this.render();
    }
  }

  autoMove() {
    const movableTiles = this.tiles.filter(tile => this.getEmptyNeighbor(tile.position));
    if (movableTiles.length > 0) {
      const randomTile = movableTiles[Math.floor(Math.random() * movableTiles.length)];
      this.moveTile(randomTile);
    }
  }

  startAutoMove() {
    this.autoMoveInterval = setInterval(() => this.autoMove(), this.moveDelay);
  }

  stopAutoMove() {
    clearInterval(this.autoMoveInterval);
  }
}

const board = new ColorBoard('puzzle-container');
