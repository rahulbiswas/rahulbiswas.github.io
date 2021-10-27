loadPNGs()

current_window = 'home'

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
const BACK_X_START = 29
const BACK_Y_START = 24
const BACK_Y_END = 130
const DRAWING_WIDTH = 1500
const DRAWING_HEIGHT = 1000
const PIECE_LENGTH = 96
const GAME_WIDTH = 1180
const GAME_HEIGHT = 980

window.onload = function() {
	canvas = document.getElementById("drawingCanvas")
	context = canvas.getContext("2d")
	canvas.onmouseup = canvasClick
	setPieces()
	draw()
}

function loadPNGs() {
	animals_0 = {}
	for (a_i = 1; a_i < 9; a_i++) {
		img = new Image()
		img.src = 'png/a' + a_i + '.png'
		animals_0[a_i] = img
	}
	animals_1 = {}
	for (b_i = 1; b_i < 9; b_i++) {
		img_1 = new Image()
		img_1.src = 'png/b' + b_i + '.png'
		animals_1[b_i] = img_1
	}
	home_menu = new Image()
	home_menu.src = "png/menus_home.png"
	rule_menu = new Image()
	rule_menu.src = "png/menus_rules.png"
	game_menu = new Image()
	game_menu.src = "png/menus_game.png"
	about_menu = new Image()
	about_menu.src = "png/menus_info.png"
}

function setPieces() {
	pieces = JSON.parse(JSON.stringify(piece_setup))
	is_first_click = true
	turn = 1
	has_won = false
}

function clickXY(event) {
	clickX = event.pageX - canvas.offsetLeft;
	clickY = event.pageY - canvas.offsetTop;
	return [clickX,clickY]
}

function click_key_with_event(clickX, clickY) {
	row = Math.floor((clickX-BOARD_UPPER_LEFT_X) / BOARD_SQUARE_WIDTH)
	column = Math.floor((clickY-BOARD_UPPER_LEFT_Y) / BOARD_SQUARE_WIDTH)
	console.log(row, column)
	console.log(clickX, clickY)
	click_key = column + "_" + row
	return click_key
}

function possible_moves_mapping() {
	possible_moves = checkPossibleTurn()
	for (possible_move_index = 0; possible_move_index < possible_moves.length; possible_move_index++) {
		move = possible_moves[possible_move_index]
		move = move.split("_")
		move = move.map((i) => Number(i));
		context.fillStyle = "chocolate"
		context.fillRect(move[1] * BOARD_SQUARE_WIDTH+BOARD_UPPER_LEFT_X, move[0] * BOARD_SQUARE_WIDTH+BOARD_UPPER_LEFT_Y, POTENTIAL_MOVE_LENGTH, POTENTIAL_MOVE_LENGTH)
	}
}

class WaterJump {
	constructor(destination, water) {
		this.destination = destination
		this.water = water
	}
}

function canvasClick(event) {
	canvas = document.getElementById("drawingCanvas");
	context = canvas.getContext("2d");
	click_xy = clickXY(event)

	if (current_window == "home") {
		if (click_xy[0] > HOME_LOCAL_X_START && click_xy[0] < HOME_LOCAL_X_END && click_xy[1] > HOME_LOCAL_Y_START && click_xy[1] < HOME_LOCAL_Y_END) {
			current_window = "game"
			draw()
		}
		if (click_xy[0] > HOME_RULES_X_START && click_xy[0] < HOME_RULES_X_END && click_xy[1] > HOME_RULES_Y_START && click_xy[1] < HOME_RULES_Y_END) {
			current_window = "rules"
			draw()
		}
		if (click_xy[0] > HOME_RULES_X_START && click_xy[0] < HOME_RULES_X_END && click_xy[1] > HOME_ABOUT_Y_START && click_xy[1] < HOME_ABOUT_Y_END) {
			current_window = "about"
			draw()
		}
		return
	}
	if (current_window == "rules") {
		if (click_xy[0] > BACK_X_START && click_xy[0] < BOARD_UPPER_LEFT_X && click_xy[1] > BACK_Y_START && click_xy[1] < BACK_Y_END) {
			current_window = "home"
			draw()
		}
	}
	if (current_window == "game") {
		if (click_xy[0] > BACK_X_START && click_xy[0] < BOARD_UPPER_LEFT_X && click_xy[1] > BACK_Y_START && click_xy[1] < BACK_Y_END) {
			current_window = "home"
			draw()
		}
	}
	if (current_window == "about") {
		if (click_xy[0] > BACK_X_START && click_xy[0] < BOARD_UPPER_LEFT_X && click_xy[1] > BACK_Y_START && click_xy[1] < BACK_Y_END) {
			current_window = "home"
			draw()
		}
	}

	if (has_won) {
		setPieces()
		drawBoard()
		return
	}

	click_key = click_key_with_event(click_xy[0], click_xy[1])
	if (is_first_click && current_window == "game") {
		if (pieces[click_key] == null) {
			return
		}
		player = pieces[click_key]["player"]
		if (player != turn) {
			return
		}
		first_click_key = click_key
		possible_moves_mapping()
		is_first_click = false
		return
	}
	second_click_key = click_key
	if (first_click_key == second_click_key) {
		first_click_key = null
		second_click_key = null
		is_first_click = true
		moving_piece = null
		drawBoard()
	}
	if (first_click_key == null) {
		return
	}
	if (!validMove()) {
		return
	}
	movePiece()
	if (pieces["8_3"] != null || pieces["0_3"] != null) {
		"Next milestone here"
		has_won = true
	}
};

function playerTurn() {
	possible_pieces = []
	keys = Object.keys(pieces)
	for (piece = 0; piece < keys.length; piece++) {
		piece_0 = keys[piece]
		if (pieces[piece_0]["player"] == turn) {
			first_click_key = keys[piece]
			attacking_animal_player = pieces[first_click_key]["player"]
			checkpossibleturn = checkPossibleTurn()
			if (checkpossibleturn.length > 0) {
				possible_pieces.push(first_click_key)
			}
		}
	}
	return possible_pieces
}

function checkPossibleTurn() {
	possibleMoves = []
	for (column = 0; column < 7; column++) {
		for (row = 0; row < 9; row++) {
			second_click_key = row + "_" + column
			if (validMove()) {
				possibleMove = second_click_key
				possibleMoves.push(possibleMove)
			}
		}
	}
	return possibleMoves
}

function validMove() {
	first_coords = first_click_key.split("_")
	first_coords = first_coords.map((i) => Number(i));
	second_coords = second_click_key.split("_")
	second_coords = second_coords.map((i) => Number(i));
	attacking_animal_num = pieces[first_click_key]["animal"]
	attacking_animal_player = pieces[first_click_key]["player"]
	// Allow tigers and lions to jump over water.
	valid_moves = validMoveWater[first_click_key]
	if (valid_moves != null) {
		for (valid_move_index = 0; valid_move_index < valid_moves.length; valid_move_index++) {
			valid_move = valid_moves[valid_move_index]
			if (valid_move.destination == second_click_key) {
				if (attacking_animal_num == 6 || attacking_animal_num == 7) {
					for (w_s_i = 0; w_s_i < valid_move.water.length; w_s_i++) {
						if (pieces[valid_move.water[w_s_i]] != null) {
							return false
						}
					}
					return true
				}
			}
		}
	}
	is_moving_to_water_square = false
	for (w_s_i = 0; w_s_i < water.length; w_s_i++) {
		if (water[w_s_i][0] == second_coords[0] && water[w_s_i][1] == second_coords[1]) {
			is_moving_to_water_square = true
		}
	}
	if (is_moving_to_water_square) {
		if (attacking_animal_num != 1) {
			return false
		}
	}
	if (attacking_animal_player == 0) {
		is_attacking_own_den = ["0_3"].indexOf(second_click_key) > -1
	} else {
		is_attacking_own_den = ["8_3"].indexOf(second_click_key) > -1
	}
	if (is_attacking_own_den) {
		return false
	}
	// Disallow non-adjacent moves.
	x_diff = Math.abs(first_coords[0] - second_coords[0])
	y_diff = Math.abs(first_coords[1] - second_coords[1])
	if (((x_diff == 1) && (y_diff == 1)) || (x_diff > 1) || (y_diff > 1)) {
		return false
	}
	first_coords[0] = parseInt(first_coords[0])
	first_coords[1] = parseInt(first_coords[1])
	is_moving_from_water_square = false
	for (w_s_i = 0; w_s_i < water.length; w_s_i++) {
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
	defending_animal_num = pieces[second_click_key]["animal"]
	defending_animal_player = pieces[second_click_key]["player"]
	if (attacking_animal_player == defending_animal_player) {
		return false
	}
	if (attacking_animal_player == 0) {
		is_attacking_own_trap = ["0_2", "1_3", "0_4"].indexOf(second_click_key) > -1
		is_attacking_enemy_trap = ["8_2", "7_3", "8_4"].indexOf(second_click_key) > -1
	} else {
		is_attacking_own_trap = ["8_2", "7_3", "8_4"].indexOf(second_click_key) > -1
		is_attacking_enemy_trap = ["0_2", "1_3", "0_4"].indexOf(second_click_key) > -1
	}
	if (is_attacking_own_trap) {
		return true
	}
	if (is_attacking_enemy_trap) {
		return false
	}
	if (pieces[second_click_key] != null) {
		if ((attacking_animal_num == 8) && (defending_animal_num == 1)) {
			return false
		}
		if ((attacking_animal_num < defending_animal_num) &&
			((attacking_animal_num != 1) || (defending_animal_num != 8)) && (is_attacking_own_trap == false)) {
			return false
		}
	}
	return true
}

function movePiece() {
	var moving_piece = pieces[first_click_key]
	delete pieces[first_click_key]
	pieces[second_click_key] = moving_piece;
	is_first_click = true
	turn = 1 - turn
	drawBoard()
}

function draw() {
	context.clearRect(0,0,DRAWING_WIDTH,DRAWING_HEIGHT)
	if (current_window == 'home') {
		context.drawImage(home_menu, 0, 0, DRAWING_WIDTH, DRAWING_HEIGHT);
	} else if (current_window == 'rules') {
		context.drawImage(rule_menu, 0, 0, DRAWING_WIDTH, DRAWING_HEIGHT);
	} else if (current_window == 'about') {
		context.drawImage(about_menu, 0, 0, DRAWING_WIDTH, DRAWING_HEIGHT);
	} else {
		drawBoard()
	}
}

function drawBoard() {
	context.clearRect(0, 0, DRAWING_WIDTH, DRAWING_HEIGHT)
	context.drawImage(game_menu, 0, 0, GAME_WIDTH, GAME_HEIGHT);
	pieces_position_list = Object.keys(pieces)
	for (p_i = 0; p_i < pieces_position_list.length; p_i++) {
		piece_position = pieces_position_list[p_i]
		player = pieces[piece_position]["player"]
		animal = pieces[piece_position]["animal"]
		piece_components = piece_position.split("_")
		x = piece_components[1] * BOARD_SQUARE_WIDTH
		y = piece_components[0] * BOARD_SQUARE_WIDTH
		if (player == 0) {
			context.drawImage(animals_0[animal], x+BOARD_UPPER_LEFT_X, y+BOARD_UPPER_LEFT_Y, PIECE_LENGTH, PIECE_LENGTH);
		}
		if (player == 1) {
			context.drawImage(animals_1[animal], x+BOARD_UPPER_LEFT_X, y+BOARD_UPPER_LEFT_Y, PIECE_LENGTH, PIECE_LENGTH);
		}
	}	
	moving_pieces = playerTurn()
	for (p_i = 0; p_i < moving_pieces.length; p_i++) {
		context.fillStyle = "green"
		context.fillRect(moving_pieces[p_i][2] * BOARD_SQUARE_WIDTH+BOARD_UPPER_LEFT_X, moving_pieces[p_i][0] * BOARD_SQUARE_WIDTH+BOARD_UPPER_LEFT_Y, POTENTIAL_MOVE_LENGTH, POTENTIAL_MOVE_LENGTH)
	}
}
