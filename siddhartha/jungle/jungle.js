current_window = 'home'
menus = {}
moved_piece = ['0']
eaten_animals = []
ai_select = ''

// Global variables.
// animals_0
// animals_1
// canvas
// cloud_player
// context
// first_click_key
// is_first_click
// pieces
// turn
// winning_player
// game_code
// current_window
// menus
// moved_piece

loadPNGs()
var TEST_MODE = 0
console.log(window.location.href)
if (window.location.href == "file:///Users/siddhartha/Documents/github/rahulbiswas.github.io/siddhartha/jungle/jungle.html") {
	TEST_MODE = 3
}

const RAT = 1
const ELEPHANT = 8
const TIGER = 6
const LION = 7

const BOARD_UPPER_LEFT_X = 242
const BOARD_UPPER_LEFT_Y = 42
const BOARD_SQUARE_WIDTH = 100
const POTENTIAL_MOVE_LENGTH = 20
const HOME_LOCAL_X_START = 69
const HOME_LOCAL_X_END = 559
const HOME_LOCAL_Y_START = 187
const HOME_LOCAL_Y_END = 396
const HOME_RULES_X_START = 948
const HOME_RULES_X_END = 1426
const HOME_RULES_Y_START = 317
const HOME_RULES_Y_END = 515
const HOME_ABOUT_Y_START = 545
const HOME_ABOUT_Y_END = 751
const HOME_PEWTER_X_START = 70
const HOME_PEWTER_X_END = 558
const HOME_PEWTER_Y_START = 464
const HOME_PEWTER_Y_END = 694
const BACK_X_START = 29
const BACK_Y_START = 24
const BACK_Y_END = 130
const DRAWING_WIDTH = 1500
const DRAWING_HEIGHT = 1000
const PIECE_LENGTH = 96
const GAME_WIDTH = 1180
const GAME_HEIGHT = 980
const BOARD_WIDTH = 800
const BOARD_HEIGHT = 900
const HOME_X_LEFT = 515
const HOME_Y_LEFT = 446
const HOME_X_RIGHT = 662
const HOME_Y_RIGHT = 664
const CLOUD_X_START = 69
const CLOUD_Y_START = 718
const CLOUD_X_END = 559
const CLOUD_Y_END = 950
const AI_A_X_START = 52
const AI_C_X_START = 52
const AI_E_X_START = 52
const AI_A_X_END = 595
const AI_C_X_END = 595
const AI_E_X_END = 595
const AI_A_Y_START = 62
const AI_B_Y_START = 62
const AI_A_Y_END = 207
const AI_B_Y_END = 207
const AI_B_X_START = 617
const AI_D_X_START = 617
const AI_F_X_START = 617
const AI_B_X_END = 1160
const AI_D_X_END = 1160
const AI_F_X_END = 1160
const AI_C_Y_START = 355
const AI_D_Y_START = 355
const AI_C_Y_END = 501
const AI_D_Y_END = 501
const AI_E_Y_START = 630
const AI_F_Y_START = 630
const AI_E_Y_END = 744
const AI_F_Y_END = 744


window.onload = function() {
	canvas = document.getElementById('drawingCanvas')
	context = canvas.getContext('2d')
	canvas.onmouseup = canvasClick
	winning_player = ''
	setPieces()
	draw()
	join_multiplayer()
}

function gameURL() {
	if (TEST_MODE == 1 || TEST_MODE == 3) {
		return 'file:///Users/siddhartha/Documents/github/rahulbiswas.github.io/siddhartha/jungle/jungle.html'
	} else {
		return 'http://biswas.net/siddhartha/jungle/jungle.html'
	}
}

function imageWithName(src) {
	var menu = new Image()
	menu.src = 'png/' + src + '.png'
	return menu
}

function loadPNGs() {
	animals_0 = {}
	for (var a_i = 1; a_i < 9; a_i++) {
		var img = new Image()
		img.src = 'png/a' + a_i + '.png'
		animals_0[a_i] = img
	}
	animals_1 = {}
	for (var b_i = 1; b_i < 9; b_i++) {
		var img_1 = new Image()
		img_1.src = 'png/b' + b_i + '.png'
		animals_1[b_i] = img_1
	}

	menus['home'] = imageWithName('menus_home')
	menus['rule'] = imageWithName('menus_rules')
	menus['game_blank'] = imageWithName('menus_game')
	menus['game_blue'] = imageWithName('menus_blue')
	menus['game_red'] = imageWithName('menus_red')
	menus['about'] = imageWithName('menus_info')
	menus['win_red'] = imageWithName('menus_winred')
	menus['win_blue'] = imageWithName('menus_winblue')
	menus['cloud'] = imageWithName('menus_multiplayer')
	menus['pewter_select'] = imageWithName('menus_pewter_select')
}

function setPieces() {
	pieces = JSON.parse(JSON.stringify(piece_setup))
	if (TEST_MODE == 1) {
		pieces = JSON.parse(JSON.stringify(test_only_piece_setup))
	}
	is_first_click = true
	turn = 1
}

function clickXY(event) {
	var clickX = event.pageX - canvas.offsetLeft;
	var clickY = event.pageY - canvas.offsetTop;
	return [clickX, clickY]
}

function click_key_with_event(clickX, clickY) {
	var row = Math.floor((clickX - BOARD_UPPER_LEFT_X) / BOARD_SQUARE_WIDTH)
	var column = Math.floor((clickY - BOARD_UPPER_LEFT_Y) / BOARD_SQUARE_WIDTH)
	return column + '_' + row
}

function possible_moves_mapping() {
	var possible_moves = checkPossibleTurn(first_click_key, pieces, current_window)
	for (var possible_move_index = 0; possible_move_index < possible_moves.length; possible_move_index++) {
		var move = possible_moves[possible_move_index]
		move = move.split('_')
		move = move.map((i) => Number(i));
		context.fillStyle = 'chocolate'
		context.fillRect(move[1] * BOARD_SQUARE_WIDTH + BOARD_UPPER_LEFT_X, move[0] * BOARD_SQUARE_WIDTH + BOARD_UPPER_LEFT_Y, POTENTIAL_MOVE_LENGTH, POTENTIAL_MOVE_LENGTH)
	}
}

class WaterJump {
	constructor(destination, water) {
		this.destination = destination
		this.water = water
	}
}

function canvasClick(event) {
	canvas = document.getElementById('drawingCanvas');
	context = canvas.getContext('2d');
	var click_xy = clickXY(event)
	if (current_window == 'home') {
		homeScreen(click_xy)
	} else if (current_window == 'rules') {
		rulesScreen(click_xy)
	} else if (current_window == 'about') {
		aboutScreen(click_xy)
	}
	if (current_window == 'game' || current_window == 'cloud_game' || current_window == 'ai_game') {
		gameScreen(click_xy)
	} else if (current_window == 'game_over') {
		gameEnd(click_xy)
	} else if (current_window == 'ai_select_game') {
		ai_select = 'F'
		current_window = 'ai_game'
		draw()
	} else if (current_window == 'cloud_game_menu') {
		draw()
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
		current_window = 'rules'
		draw()
	}
	if (click_xy[0] > HOME_RULES_X_START &&
		click_xy[0] < HOME_RULES_X_END &&
		click_xy[1] > HOME_ABOUT_Y_START &&
		click_xy[1] < HOME_ABOUT_Y_END) {
		current_window = 'about'
		draw()
	}
	if (click_xy[0] > CLOUD_X_START &&
		click_xy[0] < CLOUD_X_END &&
		click_xy[1] > CLOUD_Y_START &&
		click_xy[1] < CLOUD_Y_END) {
		current_window = 'cloud_game_menu'
			// cloud_player 1 means red
		cloud_player = 1
		draw()
		aws()
	}
	if (click_xy[0] > HOME_PEWTER_X_START &&
		click_xy[0] < HOME_PEWTER_X_END &&
		click_xy[1] > HOME_PEWTER_Y_START &&
		click_xy[1] < HOME_PEWTER_Y_END) {
		ai_select = 'F'
		current_window = 'ai_game'
		draw()
	}
}

function rulesScreen(click_xy) {
	if (click_xy[0] > BACK_X_START &&
		click_xy[0] < BOARD_UPPER_LEFT_X &&
		click_xy[1] > BACK_Y_START &&
		click_xy[1] < BACK_Y_END) {
		current_window = 'home'
		document.location.reload()
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
	if ((current_window == 'ai_game' && turn == 1) || current_window == 'game' || current_window == 'cloud_game') {
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
			possible_moves_mapping()
			is_first_click = false
		} else {
			var second_click_key = click_key
			if (first_click_key == second_click_key) {
				is_first_click = true
				drawBoard()
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

function aiGameAMove(ai_possible_moves) {
	ai_possible_move_index = -1
	for (move_index = 0; move_index < ai_possible_moves.length; move_index++) {
		if ((ai_possible_moves[move_index][0] == ['0_2'] || ai_possible_moves[move_index][0] == ['1_3'] || ai_possible_moves[move_index][0] == ['0_4']) && ai_select == 'F') {
			continue
		} else {
			ai_possible_move_index = move_index
			return move_index
		}
	}
	if (ai_possible_move_index == -1) {
		return Math.floor(Math.random() * ai_possible_moves.length)
	}
}

function aiGameBMove(ai_possible_moves) {
	ai_possible_moves_index = -1
	for (move_index = 0; move_index < ai_possible_moves.length; move_index++) {
		var first_coords = ai_possible_moves[move_index][0].split('_')
		first_coords = first_coords.map((i) => Number(i));
		var second_coords = ai_possible_moves[move_index][1].split('_')
		second_coords = second_coords.map((i) => Number(i));
		if (first_coords[0] < second_coords[0]) {
			ai_possible_moves_index = move_index
			break
		}
	}
	if (ai_possible_moves_index == -1) {
		return aiGameAMove(ai_possible_moves)
	}
	return ai_possible_moves_index
}

function aiGameCMove(ai_possible_moves) {
	ai_possible_moves_index = -1
	for (move_index = 0; move_index < ai_possible_moves.length; move_index++) {
		possible_square = ai_possible_moves[move_index][1]
		if (pieces[possible_square] != null) {
			ai_possible_moves_index = move_index
			break
		}
	}
	if (ai_possible_moves_index == -1 && ai_select != 'F') {
		return aiGameAMove(ai_possible_moves)
	} else if (ai_possible_moves_index == -1 && ai_select == 'F') {
		return null
	}
	return ai_possible_moves_index
}

function aiGameDMove(ai_possible_moves) {
	ai_possible_moves_index = -1
	for (move_index = 0; move_index < ai_possible_moves.length; move_index++) {
		if ((ai_possible_moves[move_index][0] == ['0_2'] || ai_possible_moves[move_index][0] == ['1_3'] || ai_possible_moves[move_index][0] == ['0_4']) && ai_select == 'F') {
			continue
		}
		den_square_coords = [8, 3]
		var first_coords = ai_possible_moves[move_index][0].split('_')
		first_coords = first_coords.map((i) => Number(i));
		var second_coords = ai_possible_moves[move_index][1].split('_')
		second_coords = second_coords.map((i) => Number(i));
		current_difference_x = Math.abs(den_square_coords[0] - first_coords[0])
		current_difference_y = Math.abs(den_square_coords[1] - first_coords[1])
		future_difference_x = Math.abs(den_square_coords[0] - second_coords[0])
		future_difference_y = Math.abs(den_square_coords[1] - second_coords[1])
		if (future_difference_y < current_difference_y || future_difference_x < current_difference_x) {
			ai_possible_moves_index = move_index
		}
	}
	if (ai_possible_moves_index == -1) {
		return aiGameAMove(ai_possible_moves)
	}
	return ai_possible_moves_index
}

function aiGameEMove(ai_possible_moves) {
	ai_possible_moves_index = -1
	possible_moves = []
	for (move_index = 0; move_index < ai_possible_moves.length; move_index++) {
		if ((ai_possible_moves[0][move_index] == ['0_2'] || ai_possible_moves[0][move_index] == ['1_3'] || ai_possible_moves[0][move_index] == ['0_4']) && ai_select == 'F') {
			continue
		} else if (pieces['0_2'] != null && pieces['1_3'] != null && pieces['0_4'] != null && ai_select == 'F') {
			return aiGameDMove(ai_possible_moves)
		}
		den_square_coords = [0, 3]
		var first_coords = ai_possible_moves[move_index][0].split('_')
		first_coords = first_coords.map((i) => Number(i));
		var second_coords = ai_possible_moves[move_index][1].split('_')
		second_coords = second_coords.map((i) => Number(i));
		current_difference_x = Math.abs(den_square_coords[0] - first_coords[0])
		current_difference_y = Math.abs(den_square_coords[1] - first_coords[1])
		future_difference_x = Math.abs(den_square_coords[0] - second_coords[0])
		future_difference_y = Math.abs(den_square_coords[1] - second_coords[1])
		if (future_difference_x < current_difference_x || future_difference_y < current_difference_y) {
			possible_moves.push([current_difference_x+current_difference_y, move_index])
		}
	}
	smallest_difference = 100
	console.log(possible_moves.length)
	for (move_index = 0; move_index < possible_moves.length; move_index++) {
		if (possible_moves[move_index][0] < smallest_difference) {
			ai_possible_moves_index = possible_moves[move_index][1]
			smallest_difference = possible_moves[move_index][0]
		}
	}
	if (ai_possible_moves_index == -1 && ai_select != 'F') {
		return aiGameAMove(ai_possible_moves)
	} else if (ai_possible_moves_index == -1 && ai_select == 'F') {
		return aiGameDMove(ai_possible_moves)
	}
	return ai_possible_moves_index
}

function aiGameFMove(ai_possible_moves) {
	possible_move = aiGameCMove(ai_possible_moves)
	if (possible_move == null) {
		possible_move = aiGameEMove(ai_possible_moves)
	}
	if (possible_move == null) {
		possible_move = aiGameAMove(ai_possible_moves)
	}
	return possible_move
}

function aiGame() {
	var ai_moves = playerTurn(pieces, current_window, turn)
	var ai_possible_moves = ai_moves[1]
	var ai_possible_moves_index = 0
	if (ai_select == 'A') {
		ai_possible_moves_index = aiGameAMove(ai_possible_moves)
	}
	if (ai_select == 'B') {
		ai_possible_moves_index = aiGameBMove(ai_possible_moves)
	}
	if (ai_select == 'C') {
		ai_possible_moves_index = aiGameCMove(ai_possible_moves)
	}
	if (ai_select == 'D') {
		ai_possible_moves_index = aiGameDMove(ai_possible_moves)
	}
	if (ai_select == 'E') {
		ai_possible_moves_index = aiGameEMove(ai_possible_moves)
	}
	if (ai_select == 'F') {
		ai_possible_moves_index = aiGameFMove(ai_possible_moves)
	}
	if (TEST_MODE == 1) {
		ai_possible_moves_index = 0
	}
	var ai_move = ai_possible_moves[ai_possible_moves_index]
	console.log(ai_move)
	if (TEST_MODE == 1) {
		if (pieces['0_0'] != null && pieces['0_0']['animal'] == 5) {
			ai_move = ['0_0', '8_3']
		}
	}
	var first_click_key = ai_move[0]
	var second_click_key = ai_move[1]
	movePiece(first_click_key, second_click_key)
}

function maybeEndGame() {
	checkIfGameEnded()
	if (winning_player != '') {
		current_window = 'game_over'
		draw()
	}
}

function gameEnd(click_xy) {
	if (click_xy[0] > HOME_X_LEFT && click_xy[0] < HOME_X_RIGHT && click_xy[1] > HOME_Y_LEFT && click_xy[1] < HOME_Y_RIGHT) {
		window.location.replace(gameURL())
		setTimeout('location.reload()', 1000)
	}
}

function checkNumberOfPieces(color_number) {
	var pieces_position_list = Object.keys(pieces)
	for (var p_i = 0; p_i < pieces_position_list.length; p_i++) {
		var piece_position = pieces_position_list[p_i]
		var player = pieces[piece_position]['player']
		if (player == color_number) {
			return false
		}
	}
	return true
}

function checkIfGameEnded() {
	if (pieces['0_3'] != null || checkNumberOfPieces(0)) {
		winning_player = 'red'
		current_window = 'game_over'
		draw()
	}
	if (pieces['8_3'] != null || checkNumberOfPieces(1)) {
		winning_player = 'blue'
		current_window = 'game_over'
		draw()
	}
}

function playerTurn(pieces, current_window, turn) {
	var possible_pieces = []
	var possible_moves = []
	var keys = Object.keys(pieces)
	for (var piece = 0; piece < keys.length; piece++) {
		var piece_0 = keys[piece]
		if (pieces[piece_0]['player'] == turn) {
			var first_click_key = keys[piece]
			var attacking_animal_player = pieces[first_click_key]['player']
			checkpossibleturn = checkPossibleTurn(first_click_key, pieces, current_window)
			for (turns = 0; turns < checkpossibleturn.length; turns++) {
				possible_moves.push([first_click_key, checkpossibleturn[turns]])
			}
			if (checkpossibleturn.length > 0) {
				possible_pieces.push(first_click_key)
			}
		}
	}
	return [possible_pieces, possible_moves]
}

function checkPossibleTurn(first_click_key, pieces, current_window) {
	var possibleMoves = []
	for (var column = 0; column < 7; column++) {
		for (var row = 0; row < 9; row++) {
			var second_click_key = row + '_' + column
			if (validMove(first_click_key, pieces, second_click_key, current_window)) {
				var possibleMove = second_click_key
				possibleMoves.push(possibleMove)
			}
		}
	}
	return possibleMoves
}

function validMove(first_click_key, pieces, second_click_key, current_window) {
	var first_coords = first_click_key.split('_')
	first_coords = first_coords.map((i) => Number(i));
	var second_coords = second_click_key.split('_')
	second_coords = second_coords.map((i) => Number(i));
	if (second_coords[0] < 0 || second_coords[1] < 0 || second_coords[0] > 8 || second_coords[1] > 6) {
		return false
	}
	var attacking_animal_num = pieces[first_click_key]['animal']
	var attacking_animal_player = pieces[first_click_key]['player']
	if (current_window == 'cloud_game' && typeof cloud_player != 'undefined' && cloud_player != turn) {
		return false
	}
	// Allow tigers and lions to jump over water.
	var valid_moves = validMoveWater[first_click_key]
	if (valid_moves != null) {
		for (var valid_move_index = 0; valid_move_index < valid_moves.length; valid_move_index++) {
			valid_move = valid_moves[valid_move_index]
			if (valid_move.destination == second_click_key) {
				if (attacking_animal_num == TIGER || attacking_animal_num == LION) {
					for (var w_s_i = 0; w_s_i < valid_move.water.length; w_s_i++) {
						if (pieces[valid_move.water[w_s_i]] != null) {
							return false
						}
					}
					if (pieces[second_click_key] != null && pieces[second_click_key]["player"] != pieces[first_click_key]["player"] && pieces[second_click_key]["animal"] <= pieces[first_click_key]["animal"]) {
						return true
					} else if (pieces[second_click_key] == null) {
						return true
					}
				}
			}
		}
	}
	var is_moving_to_water_square = false
	for (var w_s_i = 0; w_s_i < water.length; w_s_i++) {
		if (water[w_s_i][0] == second_coords[0] && water[w_s_i][1] == second_coords[1]) {
			is_moving_to_water_square = true
		}
	}
	if (is_moving_to_water_square) {
		if (attacking_animal_num != RAT) {
			return false
		}
	}
	if (attacking_animal_player == 0) {
		var is_attacking_own_den = ['0_3'].indexOf(second_click_key) > -1
	} else {
		var is_attacking_own_den = ['8_3'].indexOf(second_click_key) > -1
	}
	if (is_attacking_own_den) {
		return false
	}
	// Disallow non-adjacent moves.
	var x_diff = Math.abs(first_coords[0] - second_coords[0])
	var y_diff = Math.abs(first_coords[1] - second_coords[1])
	if (((x_diff == 1) && (y_diff == 1)) || (x_diff > 1) || (y_diff > 1)) {
		return TEST_MODE == 1
	}
	first_coords[0] = parseInt(first_coords[0])
	first_coords[1] = parseInt(first_coords[1])
	is_moving_from_water_square = false
	for (var w_s_i = 0; w_s_i < water.length; w_s_i++) {
		if (water[w_s_i][0] == first_coords[0] && water[w_s_i][1] == first_coords[1]) {
			is_moving_from_water_square = true
		}
	}
	if ((is_moving_from_water_square) && (pieces[second_click_key] != null)) {
		return false
	}
	if (pieces[second_click_key] == null) {
		return true
	}
	var defending_animal_num = pieces[second_click_key]['animal']
	var defending_animal_player = pieces[second_click_key]['player']
	if (attacking_animal_player == defending_animal_player) {
		return false
	}
	if (attacking_animal_player == 0) {
		var is_attacking_own_trap = ['0_2', '1_3', '0_4'].indexOf(second_click_key) > -1
		var is_attacking_enemy_trap = ['8_2', '7_3', '8_4'].indexOf(second_click_key) > -1
	} else {
		var is_attacking_own_trap = ['8_2', '7_3', '8_4'].indexOf(second_click_key) > -1
		var is_attacking_enemy_trap = ['0_2', '1_3', '0_4'].indexOf(second_click_key) > -1
	}
	if (is_attacking_own_trap) {
		return true
	}
	if (is_attacking_enemy_trap) {
		return false
	}
	if (pieces[second_click_key] != null) {
		if ((attacking_animal_num == ELEPHANT) && (defending_animal_num == RAT)) {
			return false
		}
		if ((attacking_animal_num < defending_animal_num) &&
			((attacking_animal_num != RAT) || (defending_animal_num != ELEPHANT)) && (is_attacking_own_trap == false)) {
			return false
		}
	}
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
	if (current_window == 'ai_game' && turn == 0 && ai_select != '') {
		maybeEndGame()
		aiGame()
	} else if (current_window == 'cloud_game') {
		setBoard()
	}
	drawBoard()
}

function draw() {
	context.clearRect(0, 0, DRAWING_WIDTH, DRAWING_HEIGHT)
	if (current_window == 'home') {
		context.drawImage(menus['home'], 0, 0, DRAWING_WIDTH, DRAWING_HEIGHT);
	} else if (current_window == 'rules') {
		context.drawImage(menus['rule'], 0, 0, DRAWING_WIDTH, DRAWING_HEIGHT);
	} else if (current_window == 'about') {
		context.drawImage(menus['about'], 0, 0, DRAWING_WIDTH, DRAWING_HEIGHT);
	} else if (current_window == 'cloud_game_menu') {
		context.drawImage(menus['cloud'], 0, 0, DRAWING_WIDTH, DRAWING_HEIGHT);
	} else if (current_window == 'game_over') {
		if (winning_player == 'red') {
			context.drawImage(menus['win_red'], 0, 0, GAME_WIDTH, GAME_HEIGHT);
		}
		if (winning_player == 'blue') {
			context.drawImage(menus['win_blue'], 0, 0, GAME_WIDTH, GAME_HEIGHT);
		}
	} else if (current_window == 'ai_select_game') {
		context.drawImage(menus['pewter_select'], 0, 0, GAME_WIDTH, GAME_HEIGHT);
	} else if (current_window == 'game' || current_window == 'ai_game') {
		drawBoard()
	}
}

function join_multiplayer() {
	var joining_code = window.location.search
	joining_code = joining_code.replace('?game_code=', '')
	if (joining_code != '') {
		turn = 1
		game_code = joining_code
		cloud_player = 0
		player = 0
		drawBoard()
		setBoard()
	}
}

function aws() {
	function createGameListener() {
		turn = 0
		game_code = this.responseText
		setBoard()
	}
	var createGameReq = new XMLHttpRequest();
	createGameReq.addEventListener('load', createGameListener);
	createGameReq.open('GET', 'https://06z51kydsh.execute-api.us-west-2.amazonaws.com/Prod/hello?siddhartha=fool&create_game=1');
	createGameReq.send();
}

function setBoard() {
	var setup = {
		piece_info: pieces,
		turn_info: turn,
		moved_piece_info: moved_piece
	}
	setup = JSON.stringify(setup)
	var url = encodeURIComponent(setup);
	document.getElementById('multiplayer_join_url').innerHTML = gameURL() + '?game_code=' + game_code;

	function setGameListener() {
		checkPeriodically()
	}
	var setGameReq = new XMLHttpRequest();
	setGameReq.addEventListener('load', setGameListener)
	setGameReq.open('GET', 'https://06z51kydsh.execute-api.us-west-2.amazonaws.com/Prod/hello?siddhartha=fool&set=1&game_code=' + game_code + '&game_board=' + url);
	setGameReq.send();
}

function checkPeriodically() {
	function getGameListener() {
		var return_info = JSON.parse(this.responseText)
		turn = return_info['turn_info']
		pieces = return_info['piece_info']
		moved_piece = return_info['moved_piece_info']
		checkIfGameEnded()
		if (winning_player != '') {
			current_window = 'game_over'
			draw()
			maybeEndGame()
		}
		if (turn != cloud_player) {
			setTimeout(checkPeriodically, 2000)
		} else if (current_window != 'game_over') {
			current_window = 'cloud_game'
			drawBoard()
		}
	}
	var getReq = new XMLHttpRequest();
	getReq.addEventListener('load', getGameListener)
	getReq.open('GET', 'https://06z51kydsh.execute-api.us-west-2.amazonaws.com/Prod/hello?siddhartha=fool&get=1&game_code=' + game_code);
	getReq.send();
}


function drawBoard() {
	context.clearRect(0, 0, DRAWING_WIDTH, DRAWING_HEIGHT)
	if (typeof cloud_player == 1) {
		context.drawImage(menus['game_red'], 0, 0, GAME_WIDTH, GAME_HEIGHT);
	} else if (typeof cloud_player == 0) {
		context.drawImage(menus['game_blue'], 0, 0, GAME_WIDTH, GAME_HEIGHT);
	} else if (turn == 1) {
		context.drawImage(menus['game_red'], 0, 0, GAME_WIDTH, GAME_HEIGHT);
	} else if (turn == 0) {
		context.drawImage(menus['game_blue'], 0, 0, GAME_WIDTH, GAME_HEIGHT);
	}
	context.drawImage(menus['game_blank'], 0, 0, GAME_WIDTH, GAME_HEIGHT);
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
			context.globalAlpha = alpha;
			x = ((BOARD_UPPER_LEFT_X + BOARD_WIDTH) * player) - ((animal % 2) * 100) + 5
			if (player == 0) {
				x += 100
			}
			y = BOARD_UPPER_LEFT_Y + (Math.ceil(animal / 2) * 100) + 100
			if (player == 0) {
				context.drawImage(animals_0[animal], x, y, 95, 95)
			} else if (player == 1) {
				context.drawImage(animals_1[animal], x, y, 95, 95)
			}
			context.globalAlpha = 1.0;
		}
	}
	var pieces_position_list = Object.keys(pieces)
	for (var p_i = 0; p_i < pieces_position_list.length; p_i++) {
		var piece_position = pieces_position_list[p_i]
		var player = pieces[piece_position]['player']
		var animal = pieces[piece_position]['animal']
		var piece_components = piece_position.split('_')
		var x = piece_components[1] * BOARD_SQUARE_WIDTH
		var y = piece_components[0] * BOARD_SQUARE_WIDTH
		if (player == 0) {
			context.drawImage(animals_0[animal],
				x + BOARD_UPPER_LEFT_X,
				y + BOARD_UPPER_LEFT_Y,
				PIECE_LENGTH,
				PIECE_LENGTH);
		}
		if (player == 1) {
			context.drawImage(animals_1[animal],
				x + BOARD_UPPER_LEFT_X,
				y + BOARD_UPPER_LEFT_Y,
				PIECE_LENGTH,
				PIECE_LENGTH);
		}
	}
	if (moved_piece[0] != ['0']) {
		context.fillStyle = 'purple'
		context.fillRect(moved_piece[0][1] * BOARD_SQUARE_WIDTH + BOARD_UPPER_LEFT_X,
			moved_piece[0][0] * BOARD_SQUARE_WIDTH + BOARD_UPPER_LEFT_Y,
			POTENTIAL_MOVE_LENGTH,
			POTENTIAL_MOVE_LENGTH)
		context.fillRect(moved_piece[1][1] * BOARD_SQUARE_WIDTH + BOARD_UPPER_LEFT_X,
			moved_piece[1][0] * BOARD_SQUARE_WIDTH + BOARD_UPPER_LEFT_Y,
			POTENTIAL_MOVE_LENGTH,
			POTENTIAL_MOVE_LENGTH)
	}
	var moving_pieces = playerTurn(pieces, current_window, turn)[0]
	var moves = playerTurn(pieces, current_window, turn)[1]
	var show_green_squares = (current_window == 'game' || (current_window == 'ai_game' && turn == 1))
	if (show_green_squares) {
		for (var p_i = 0; p_i < moving_pieces.length; p_i++) {
			context.fillStyle = 'green'
			context.fillRect(moving_pieces[p_i][2] * BOARD_SQUARE_WIDTH + BOARD_UPPER_LEFT_X,
				moving_pieces[p_i][0] * BOARD_SQUARE_WIDTH + BOARD_UPPER_LEFT_Y,
				POTENTIAL_MOVE_LENGTH,
				POTENTIAL_MOVE_LENGTH)
		}
	}
}
