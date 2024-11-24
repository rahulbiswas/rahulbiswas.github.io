const ANIMALS = {
  RAT: 1,
  CAT: 2,
  DOG: 3,
  WOLF: 4,
  LEOPARD: 5,
  TIGER: 6,
  LION: 7,
  ELEPHANT: 8
}

const BOARD_WIDTH = 7
const BOARD_HEIGHT = 9

const initialPieces = {
  '0_0': {'player': 0, 'animal': 7},
  '6_0': {'player': 0, 'animal': 6},
  '1_1': {'player': 0, 'animal': 4},
  '5_1': {'player': 0, 'animal': 2},
  '0_2': {'player': 0, 'animal': 1},
  '2_2': {'player': 0, 'animal': 5},
  '4_2': {'player': 0, 'animal': 3},
  '6_2': {'player': 0, 'animal': 8},
  '6_8': {'player': 1, 'animal': 7},
  '0_8': {'player': 1, 'animal': 6},
  '5_7': {'player': 1, 'animal': 4},
  '1_7': {'player': 1, 'animal': 2},
  '6_6': {'player': 1, 'animal': 1},
  '4_6': {'player': 1, 'animal': 5},
  '2_6': {'player': 1, 'animal': 3},
  '0_6': {'player': 1, 'animal': 8}
}