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
    const spacePerTile = this.tileSize + this.gap;
    const containerSize = window.innerHeight * 0.95;
    this.gridSize = Math.floor(containerSize / spacePerTile);
    
    const totalSize = (this.gridSize * this.tileSize) + ((this.gridSize - 1) * this.gap);
    this.container.style.width = `${totalSize}px`;
    this.container.style.height = `${totalSize}px`;
    
    this.emptyPosition = { x: this.gridSize - 1, y: this.gridSize - 1 };
    
    this.initializeTiles();
    this.render();
  }

  initializeTiles() {
    let colorIndex = 0;
    for (let y = 0; y < this.gridSize; y++) {
      for (let x = 0; x < this.gridSize; x++) {
        if (x === this.emptyPosition.x && y === this.emptyPosition.y) {
          console.log(`Skipping empty position at x:${x}, y:${y}`);
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
    console.log('Rendered board. Empty position:', this.emptyPosition);
  }

  isNextToEmpty(position) {
    const isNext = (
      (Math.abs(position.x - this.emptyPosition.x) === 1 && position.y === this.emptyPosition.y) ||
      (Math.abs(position.y - this.emptyPosition.y) === 1 && position.x === this.emptyPosition.x)
    );
    console.log('Checking if position', position, 'is next to empty:', isNext);
    return isNext;
  }

  moveTile(tile) {
    console.log('Attempting to move tile:', tile);
    if (this.isNextToEmpty(tile.position)) {
      console.log('Moving tile from', tile.position, 'to', this.emptyPosition);
      const oldPosition = {...tile.position};
      tile.position = {...this.emptyPosition};
      this.emptyPosition = oldPosition;
      this.render();
    }
  }
}

const board = new ColorBoard('puzzle-container');
