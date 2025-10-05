const PIECE_TYPES = {
  RED: {
    GENERAL: { char: '帥', value: 1000, type: 'general' },
    ADVISOR: { char: '仕', value: 20, type: 'advisor' },
    ELEPHANT: { char: '相', value: 20, type: 'elephant' },
    HORSE: { char: '馬', value: 40, type: 'horse' },
    CHARIOT: { char: '車', value: 90, type: 'chariot' },
    CANNON: { char: '炮', value: 45, type: 'cannon' },
    SOLDIER: { char: '兵', value: 20, type: 'soldier' }
  },
  BLACK: {
    GENERAL: { char: '將', value: 1000, type: 'general' },
    ADVISOR: { char: '士', value: 20, type: 'advisor' },
    ELEPHANT: { char: '象', value: 20, type: 'elephant' },
    HORSE: { char: '馬', value: 40, type: 'horse' },
    CHARIOT: { char: '車', value: 90, type: 'chariot' },
    CANNON: { char: '砲', value: 45, type: 'cannon' },
    SOLDIER: { char: '卒', value: 20, type: 'soldier' }
  }
};

const COLORS = {
  RED: 'red',
  BLACK: 'black'
};

const GAME_STATUS = {
  ACTIVE: 'active',
  CHECK: 'check',
  CHECKMATE: 'checkmate',
  STALEMATE: 'stalemate',
  DRAW: 'draw',
  RESIGNED: 'resigned'
};

const BOARD_SIZE = {
  ROWS: 10,
  COLS: 9
};

const PALACE_BOUNDS = {
  RED: {
    minRow: 7,
    maxRow: 9,
    minCol: 3,
    maxCol: 5
  },
  BLACK: {
    minRow: 0,
    maxRow: 2,
    minCol: 3,
    maxCol: 5
  }
};

const RIVER_ROW = 4.5;

const INITIAL_BOARD_SETUP = [
  // Row 0 (Black back rank)
  [
    { type: 'chariot', color: 'black' },
    { type: 'horse', color: 'black' },
    { type: 'elephant', color: 'black' },
    { type: 'advisor', color: 'black' },
    { type: 'general', color: 'black' },
    { type: 'advisor', color: 'black' },
    { type: 'elephant', color: 'black' },
    { type: 'horse', color: 'black' },
    { type: 'chariot', color: 'black' }
  ],
  // Row 1 (Empty)
  [null, null, null, null, null, null, null, null, null],
  // Row 2 (Black cannons)
  [null, { type: 'cannon', color: 'black' }, null, null, null, null, null, { type: 'cannon', color: 'black' }, null],
  // Row 3 (Black soldiers)
  [
    { type: 'soldier', color: 'black' }, null, { type: 'soldier', color: 'black' }, null, 
    { type: 'soldier', color: 'black' }, null, { type: 'soldier', color: 'black' }, null, 
    { type: 'soldier', color: 'black' }
  ],
  // Row 4 (Empty - river)
  [null, null, null, null, null, null, null, null, null],
  // Row 5 (Empty - river)
  [null, null, null, null, null, null, null, null, null],
  // Row 6 (Red soldiers)
  [
    { type: 'soldier', color: 'red' }, null, { type: 'soldier', color: 'red' }, null, 
    { type: 'soldier', color: 'red' }, null, { type: 'soldier', color: 'red' }, null, 
    { type: 'soldier', color: 'red' }
  ],
  // Row 7 (Red cannons)
  [null, { type: 'cannon', color: 'red' }, null, null, null, null, null, { type: 'cannon', color: 'red' }, null],
  // Row 8 (Empty)
  [null, null, null, null, null, null, null, null, null],
  // Row 9 (Red back rank)
  [
    { type: 'chariot', color: 'red' },
    { type: 'horse', color: 'red' },
    { type: 'elephant', color: 'red' },
    { type: 'advisor', color: 'red' },
    { type: 'general', color: 'red' },
    { type: 'advisor', color: 'red' },
    { type: 'elephant', color: 'red' },
    { type: 'horse', color: 'red' },
    { type: 'chariot', color: 'red' }
  ]
];

const MOVE_DIRECTIONS = {
  ORTHOGONAL: [[0, 1], [0, -1], [1, 0], [-1, 0]],
  DIAGONAL: [[1, 1], [1, -1], [-1, 1], [-1, -1]]
};

const HORSE_MOVES = [
  { block: [0, 1], dest: [1, 1] },   // Right, then down-right
  { block: [0, 1], dest: [-1, 1] },  // Right, then up-right
  { block: [0, -1], dest: [1, -1] }, // Left, then down-left
  { block: [0, -1], dest: [-1, -1] }, // Left, then up-left
  { block: [1, 0], dest: [1, 1] },   // Down, then down-right
  { block: [1, 0], dest: [1, -1] },  // Down, then down-left
  { block: [-1, 0], dest: [-1, 1] }, // Up, then up-right
  { block: [-1, 0], dest: [-1, -1] } // Up, then up-left
];

const ELEPHANT_MOVES = [
  { block: [1, 1], dest: [2, 2] },
  { block: [1, -1], dest: [2, -2] },
  { block: [-1, 1], dest: [-2, 2] },
  { block: [-1, -1], dest: [-2, -2] }
];

const SOUNDS = {
  MOVE: 'assets/sounds/move.mp3',
  CAPTURE: 'assets/sounds/capture.mp3',
  CHECK: 'assets/sounds/check.mp3',
  GAME_END: 'assets/sounds/game_end.mp3'
};

window.XIANGQI_CONSTANTS = {
  PIECE_TYPES,
  COLORS,
  GAME_STATUS,
  BOARD_SIZE,
  PALACE_BOUNDS,
  RIVER_ROW,
  INITIAL_BOARD_SETUP,
  MOVE_DIRECTIONS,
  HORSE_MOVES,
  ELEPHANT_MOVES,
  SOUNDS
};