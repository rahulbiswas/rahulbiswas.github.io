const BOARD_WIDTH = 7
const BOARD_HEIGHT = 9

const initialPieces = {
  '0_0': {'player': PLAYERS.YELLOW, 'animal': PIECES.LION},
  '6_0': {'player': PLAYERS.YELLOW, 'animal': PIECES.TIGER},
  '1_1': {'player': PLAYERS.YELLOW, 'animal': PIECES.WOLF},
  '5_1': {'player': PLAYERS.YELLOW, 'animal': PIECES.CAT},
  '0_2': {'player': PLAYERS.YELLOW, 'animal': PIECES.RAT},
  '2_2': {'player': PLAYERS.YELLOW, 'animal': PIECES.LEOPARD},
  '4_2': {'player': PLAYERS.YELLOW, 'animal': PIECES.DOG},
  '6_2': {'player': PLAYERS.YELLOW, 'animal': PIECES.ELEPHANT},
  '6_8': {'player': PLAYERS.RED, 'animal': PIECES.LION},
  '0_8': {'player': PLAYERS.RED, 'animal': PIECES.TIGER},
  '5_7': {'player': PLAYERS.RED, 'animal': PIECES.WOLF},
  '1_7': {'player': PLAYERS.RED, 'animal': PIECES.CAT},
  '6_6': {'player': PLAYERS.RED, 'animal': PIECES.RAT},
  '4_6': {'player': PLAYERS.RED, 'animal': PIECES.LEOPARD},
  '2_6': {'player': PLAYERS.RED, 'animal': PIECES.DOG},
  '0_6': {'player': PLAYERS.RED, 'animal': PIECES.ELEPHANT}
}