current_window = 'home'
moved_piece = ['0']

// Global variables.
// first_click_key
// is_first_click
// pieces
// turn
// winning_player

var url_string = window.location.href
var url = new URL(url_string)

const RAT = 1
const ELEPHANT = 8
const TIGER = 6
const LION = 7

// The game will be drawn with SVG images going forward.
// The full game will be 100x67.  All coordinates are in relation to that.

const DRAWING_WIDTH = 100
const DRAWING_HEIGHT = 67

const BOARD_UPPER_LEFT_X = 20.7
const BOARD_UPPER_LEFT_Y = 3
const BOARD_SQUARE_WIDTH = 8.6
const BOARD_SQUARE_HEIGHT = 6.82
const POTENTIAL_MOVE_LENGTH = 2

const HOME_LOCAL_X_START = 4
const HOME_LOCAL_X_END = 37
const HOME_LOCAL_Y_START = 13
const HOME_LOCAL_Y_END = 29
const HOME_RULES_X_START = 62
const HOME_RULES_X_END = 95
const HOME_RULES_Y_START = 23
const HOME_RULES_Y_END = 38
const HOME_ABOUT_X_START = 62
const HOME_ABOUT_X_STOP = 95
const HOME_ABOUT_Y_START = 40
const HOME_ABOUT_Y_END = 55
const HOME_PEWTER_X_START = 4
const HOME_PEWTER_X_END = 37
const HOME_PEWTER_Y_START = 31
const HOME_PEWTER_Y_END = 46

const BACK_X_START = 3
const BACK_Y_START = 2
const BACK_Y_END = 13
const PIECE_SIZE = 6.5
const RULES_NEXT_X_START = 80
const RULES_NEXT_Y_START = 0
const RULES_NEXT_X_END = 100
const RULES_NEXT_Y_END = 10

iw = window.innerWidth
ih = window.innerHeight
if (iw > DRAWING_WIDTH / DRAWING_HEIGHT * ih) {
	iw = ih * DRAWING_WIDTH / DRAWING_HEIGHT
} else {
	ih = iw * DRAWING_HEIGHT / DRAWING_WIDTH
}
paper = Raphael("container", iw, ih)

window.onload = function() {
	winning_player = ''
	setInitialBoard()
	draw()
}

function rdraw(img_name, x, y, w, h) {
	width = window.innerWidth
	height = window.innerHeight
	if (width > DRAWING_WIDTH / DRAWING_HEIGHT * height) {
		width = height * DRAWING_WIDTH / DRAWING_HEIGHT
	} else {
		height = width * DRAWING_HEIGHT / DRAWING_WIDTH
	}
	dx = x * width / DRAWING_WIDTH
	dy = y * height / DRAWING_HEIGHT
	dw = w * width / DRAWING_WIDTH
	dh = h * height / DRAWING_HEIGHT
	return paper.image('images/' + img_name, dx, dy, dw, dh)
}

function rrect(x, y, w, h, color) {
	width = window.innerWidth
	height = window.innerHeight
	if (width > DRAWING_WIDTH / DRAWING_HEIGHT * height) {
		width = height * DRAWING_WIDTH / DRAWING_HEIGHT
	} else {
		height = width * DRAWING_HEIGHT / DRAWING_WIDTH
	}
	dx = x * width / DRAWING_WIDTH
	dy = y * height / DRAWING_HEIGHT
	dw = w * width / DRAWING_WIDTH
	dh = h * height / DRAWING_HEIGHT
	paper.rect(dx, dy, dw, dh).attr({
		'fill': color,
		'opacity': 1.0
	})
}

function setInitialBoard() {
	pieces = {"0_0":{"player":0,"animal":7},"6_0":{"player":0,"animal":6},"1_1":{"player":0,"animal":4},"5_1":{"player":0,"animal":2},"0_2":{"player":0,"animal":1},"2_2":{"player":0,"animal":5},"4_2":{"player":0,"animal":3},"6_2":{"player":0,"animal":8},"6_8":{"player":1,"animal":7},"0_8":{"player":1,"animal":6},"5_7":{"player":1,"animal":4},"1_7":{"player":1,"animal":2},"6_6":{"player":1,"animal":1},"4_6":{"player":1,"animal":5},"2_6":{"player":1,"animal":3},"0_6":{"player":1,"animal":8}}
	is_first_click = true
	turn = 1
}

function click_key_with_event(clickX, clickY) {
	var row = Math.floor((clickX - BOARD_UPPER_LEFT_X) / BOARD_SQUARE_WIDTH)
	var column = Math.floor((clickY - BOARD_UPPER_LEFT_Y) / BOARD_SQUARE_HEIGHT)
	return row + '_' + column
}

function canvasClick(event) {
	iw = window.innerWidth
	ih = window.innerHeight
	if (iw > DRAWING_WIDTH / DRAWING_HEIGHT * ih) {
		iw = ih * DRAWING_WIDTH / DRAWING_HEIGHT
	} else {
		ih = iw * DRAWING_HEIGHT / DRAWING_WIDTH
	}
	click_xy = [event.clientX * DRAWING_WIDTH / iw, event.clientY * DRAWING_HEIGHT / ih]
	if (current_window == 'home') {
		homeScreen(click_xy)
	} else if (current_window == 'agilityrules' || current_window == 'eatinganimals' || current_window == 'howtowin' || current_window == 'jumpingoverwater' || current_window == 'ratsarespecial' || current_window == 'traps') {
		rulesScreen(click_xy)
	} else if (current_window == 'about') {
		aboutScreen(click_xy)
	}
	if (current_window == 'game') {
		gameScreen(click_xy)
	} else if (current_window == 'game_over') {
		gameEnd(click_xy)
	}
}

function homeScreen(click_xy) {
	if (click_xy[0] > HOME_LOCAL_X_START &&
		click_xy[0] < HOME_LOCAL_X_END &&
		click_xy[1] > HOME_LOCAL_Y_START &&
		click_xy[1] < HOME_LOCAL_Y_END) {
		current_window = 'game'
		draw()
	}
	if (click_xy[0] > HOME_RULES_X_START &&
		click_xy[0] < HOME_RULES_X_END &&
		click_xy[1] > HOME_RULES_Y_START &&
		click_xy[1] < HOME_RULES_Y_END) {
		current_window = 'agilityrules'
		draw()
	}
	if (click_xy[0] > HOME_ABOUT_X_START &&
		click_xy[0] < HOME_ABOUT_X_STOP &&
		click_xy[1] > HOME_ABOUT_Y_START &&
		click_xy[1] < HOME_ABOUT_Y_END) {
		current_window = 'about'
		draw()
	}
}

function rulesScreen(click_xy) {
	if (click_xy[0] > BACK_X_START &&
		click_xy[0] < BOARD_UPPER_LEFT_X &&
		click_xy[1] > BACK_Y_START &&
		click_xy[1] < BACK_Y_END) {
		if (current_window == 'agilityrules') {
			current_window = 'home'
			document.location.reload()
		} else {
			current_window = ruleTutorial('yes', 'yes')
			draw()
		}
	}
	if (click_xy[0] > RULES_NEXT_X_START && click_xy[0] < RULES_NEXT_X_END && click_xy[1] > RULES_NEXT_Y_START && click_xy[1] < RULES_NEXT_Y_END && current_window != 'traps') {
		current_window = ruleTutorial('yes', 'no')
		draw()
	}
}

function aboutScreen(click_xy) {
	if (click_xy[0] > BACK_X_START &&
		click_xy[0] < BOARD_UPPER_LEFT_X &&
		click_xy[1] > BACK_Y_START &&
		click_xy[1] < BACK_Y_END) {
		current_window = 'home'
		document.location.reload()
	}
}

function gameScreen(click_xy) {
	if (click_xy[0] > BACK_X_START &&
		click_xy[0] < BOARD_UPPER_LEFT_X &&
		click_xy[1] > BACK_Y_START &&
		click_xy[1] < BACK_Y_END) {
		current_window = 'home'
		window.location.replace('http://biswas.net/siddhartha/jungle/jungle.html')
	}
	if (current_window == 'game') {
		var click_key = click_key_with_event(click_xy[0], click_xy[1])
		if (is_first_click) {
			if (pieces[click_key] == null) {
				return
			}
			var player = pieces[click_key]['player']
			if (player != turn) {
				return
			}
			first_click_key = click_key
			// possible_moves_mapping()
			is_first_click = false
		} else {
			var second_click_key = click_key
			if (first_click_key == second_click_key) {
				is_first_click = true
				draw()
				return
			}
			if (!validMove(first_click_key, pieces, second_click_key, current_window)) {
				return
			}
			movePiece(first_click_key, second_click_key)
		}
		maybeEndGame()
	}
}

function maybeEndGame() {
	return false
}

function gameEnd(click_xy) {
	setTimeout('location.reload()', 1000)
}

function validMove(first_click_key, pieces, second_click_key, current_window) {
	return true
}

function movePiece(first_click_key, second_click_key) {
	var moving_piece = pieces[first_click_key]
	moved_piece[0] = first_click_key.split('_')
	moved_piece[1] = second_click_key.split('_')
	delete pieces[first_click_key]
	pieces[second_click_key] = moving_piece;
	is_first_click = true
	turn = 1 - turn
	draw()
}

function ruleTutorial(change, back) {
    if (current_window == 'eatinganimals') {
        if (change == 'yes' && back == 'yes') {
            current_window = 'agilityrules'  // Fixed
            return 'agilityrules'
        } else if (change == 'no') {
            return 'eatinganimals'
        } else if (change == 'yes' && back == 'no') {
            return 'howtowin'
        }
    }
    if (current_window == 'howtowin') {
        if (change == 'yes' && back == 'yes') {
            current_window = 'agilityrules'  // Fixed
            return 'eatinganimals'
        } else if (change == 'no') {
            return 'howtowin'
        } else if (change == 'yes' && back == 'no') {
            return 'jumpingoverwater'
        }
    }
    if (current_window == 'jumpingoverwater') {
        if (change == 'yes' && back == 'yes') {
            current_window = 'agilityrules'  // Fixed
            return 'howtowin'
        } else if (change == 'no') {
            return 'jumpingoverwater'
        } else if (change == 'yes' && back == 'no') {
            return 'ratsarespecial'
        }
    }
    if (current_window == 'ratsarespecial') {
        if (change == 'yes' && back == 'yes') {
            current_window = 'agilityrules'  // Fixed
            return 'jumpingoverwater'
        } else if (change == 'no') {
            return 'ratsarespecial'
        } else if (change == 'yes' && back == 'no') {
            return 'traps'
        }
    }
    if (current_window == 'traps') {
        if (change == 'yes' && back == 'yes') {
            current_window = 'agilityrules'  // Fixed
            return 'ratsarespecial'
        } else if (change == 'no') {
            return 'traps'
        }
    }
    if (current_window == 'agilityrules') {
        if (change == 'yes' && back == 'no') {
            return 'eatinganimals'
        }
        if (change == 'no') {
            return 'agilityrules'
        }
    }
}

function draw() {
	iw = window.innerWidth
	ih = window.innerHeight
	if (iw > DRAWING_WIDTH / DRAWING_HEIGHT * ih) {
		iw = ih * DRAWING_WIDTH / DRAWING_HEIGHT
	} else {
		ih = iw * DRAWING_HEIGHT / DRAWING_WIDTH
	}
	paper.setSize(iw, ih)
	if (current_window == 'home') {
		rdraw('menus_home.png', 0, 0, DRAWING_WIDTH, DRAWING_HEIGHT);
	} else if (current_window == 'agilityrules' || current_window == 'eatinganimals' || current_window == 'howtowin' || current_window == 'jumpingoverwater' || current_window == 'ratsarespecial' || current_window == 'traps') {
		window_to_draw = (ruleTutorial('no', 'no'))
		rdraw('' + window_to_draw + '.png', 0, 0, DRAWING_WIDTH, DRAWING_HEIGHT);
	} else if (current_window == 'about') {
		rdraw('menus_info.png', 0, 0, DRAWING_WIDTH, DRAWING_HEIGHT);
	} else if (current_window == 'game_over') {
		if (winning_player == 'red') {
			rdraw('menus_winred.png', 0, 0, DRAWING_WIDTH, DRAWING_HEIGHT);
		}
		if (winning_player == 'blue') {
			rdraw('menus_winblue.png', 0, 0, DRAWING_WIDTH, DRAWING_HEIGHT);
		}
	} else if (current_window == 'game') {
		drawBoard()
	}
	var clickArea = paper.rect(0, 0, iw, ih).attr({
		'fill': 'yellow',
		'opacity': 0.0
	})
	clickArea.mousedown(canvasClick)
}

function drawBoard() {
	if (turn == 1) {
		rdraw('menus_red.png', 0, 0, DRAWING_WIDTH, DRAWING_HEIGHT);
	} else if (turn == 0) {
		rdraw('menus_blue.png', 0, 0, DRAWING_WIDTH, DRAWING_HEIGHT);
	}
	rdraw('menus_game.png', 0, 0, DRAWING_WIDTH, DRAWING_HEIGHT);
	for (var player = 0; player < 2; player++) {
		for (var animal = 1; animal < 9; animal++) {
			is_alive = false
			for (var k in pieces) {
				if (pieces[k]['player'] == player && pieces[k]['animal'] == animal) {
					is_alive = true
					break
				}
			}
			if (is_alive) {
				alpha = 0.2
			} else {
				alpha = 1.0
			}
			x = 6 + (animal % 2) * PIECE_SIZE + player * 80
			y = 10 + (Math.ceil(animal / 2) * PIECE_SIZE)
			if (player == 0) {
				rdraw('apiece.svg', x, y, PIECE_SIZE, PIECE_SIZE).attr({
					'opacity': alpha
				})
				rdraw('a' + animal + '.svg', x, y, PIECE_SIZE, PIECE_SIZE).attr({
					'opacity': alpha
				})
			} else if (player == 1) {
				rdraw('bpiece.svg', x, y, PIECE_SIZE, PIECE_SIZE).attr({
					'opacity': alpha
				})
				rdraw('b' + animal + '.svg', x, y, PIECE_SIZE, PIECE_SIZE).attr({
					'opacity': alpha
				})
			}
		}
	}
	var pieces_position_list = Object.keys(pieces)
	for (var p_i = 0; p_i < pieces_position_list.length; p_i++) {
		var piece_position = pieces_position_list[p_i]
		var player = pieces[piece_position]['player']
		var animal = pieces[piece_position]['animal']
		var piece_components = piece_position.split('_')
		var x = piece_components[0] * BOARD_SQUARE_WIDTH
		var y = piece_components[1] * BOARD_SQUARE_HEIGHT
		if (player == 0) {
			rdraw('apiece.svg',
				(x + BOARD_UPPER_LEFT_X),
				(y + BOARD_UPPER_LEFT_Y),
				PIECE_SIZE,
				PIECE_SIZE)
			rdraw('a' + animal + '.svg',
				(x + BOARD_UPPER_LEFT_X),
				(y + BOARD_UPPER_LEFT_Y),
				PIECE_SIZE,
				PIECE_SIZE)
		}
		if (player == 1) {
			rdraw('bpiece.svg',
				(x + BOARD_UPPER_LEFT_X),
				(y + BOARD_UPPER_LEFT_Y),
				PIECE_SIZE,
				PIECE_SIZE)
			rdraw('b' + animal + '.svg',
				(x + BOARD_UPPER_LEFT_X),
				(y + BOARD_UPPER_LEFT_Y),
				PIECE_SIZE,
				PIECE_SIZE)
		}
	}
	if (moved_piece[0] != ['0']) {
		rrect(
			moved_piece[0][0] * BOARD_SQUARE_WIDTH + BOARD_UPPER_LEFT_X + BOARD_SQUARE_WIDTH - POTENTIAL_MOVE_LENGTH * 1.3,
			moved_piece[0][1] * BOARD_SQUARE_HEIGHT + BOARD_UPPER_LEFT_Y,
			POTENTIAL_MOVE_LENGTH,
			POTENTIAL_MOVE_LENGTH,
			'purple')
		rrect(
			moved_piece[1][0] * BOARD_SQUARE_WIDTH + BOARD_UPPER_LEFT_X + BOARD_SQUARE_WIDTH - POTENTIAL_MOVE_LENGTH * 1.3,
			moved_piece[1][1] * BOARD_SQUARE_HEIGHT + BOARD_UPPER_LEFT_Y,
			POTENTIAL_MOVE_LENGTH,
			POTENTIAL_MOVE_LENGTH,
			'purple')
	}
}
