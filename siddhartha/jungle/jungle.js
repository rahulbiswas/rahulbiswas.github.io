current_window = 'home'
menus = {}

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

loadPNGs()

const TEST_MODE = 0

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
const BACK_X_START = 29
const BACK_Y_START = 24
const BACK_Y_END = 130
const DRAWING_WIDTH = 1500
const DRAWING_HEIGHT = 1000
const PIECE_LENGTH = 96
const GAME_WIDTH = 1180
const GAME_HEIGHT = 980
const HOME_X_LEFT = 515
const HOME_Y_LEFT = 446
const HOME_X_RIGHT = 662
const HOME_Y_RIGHT = 664
const CLOUD_X_START = 69
const CLOUD_Y_START = 718
const CLOUD_X_END = 559
const CLOUD_Y_END = 950

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
	if (TEST_MODE == 1) {
		return 'file:///Users/siddhartha/Documents/github/rahulbiswas.github.io/siddhartha/jungle/jungle.html'
	} else {
		return 'http://rahulbiswas.github.io/siddhartha/jungle/jungle.html'
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
}

function setPieces() {
	pieces = JSON.parse(JSON.stringify(piece_setup))
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
	var possible_moves = checkPossibleTurn()
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
	} else if (current_window == 'game' || current_window == 'cloud_game') {
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
		current_window = 'cloud_game'
			// cloud_player 1 means red
		cloud_player = 1
		draw()
		aws()
	}
}

function rulesScreen(click_xy) {
	if (click_xy[0] > BACK_X_START &&
		click_xy[0] < BOARD_UPPER_LEFT_X &&
		click_xy[1] > BACK_Y_START &&
		click_xy[1] < BACK_Y_END) {
		current_window = 'home'
		draw()
	}
}

function aboutScreen(click_xy) {
	if (click_xy[0] > BACK_X_START &&
		click_xy[0] < BOARD_UPPER_LEFT_X &&
		click_xy[1] > BACK_Y_START &&
		click_xy[1] < BACK_Y_END) {
		current_window = 'home'
		draw()
	}
}

function gameScreen(click_xy) {
	if (click_xy[0] > BACK_X_START &&
		click_xy[0] < BOARD_UPPER_LEFT_X &&
		click_xy[1] > BACK_Y_START &&
		click_xy[1] < BACK_Y_END) {
		current_window = 'home'
		draw()
	}
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
		if (!validMove(second_click_key)) {
			return
		}
		movePiece(second_click_key)
	}
	maybeEndGame()
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
		window.location.replace('http://rahulbiswas.github.io/siddhartha/jungle/jungle.html')
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

function playerTurn() {
	var possible_pieces = []
	var keys = Object.keys(pieces)
	for (var piece = 0; piece < keys.length; piece++) {
		var piece_0 = keys[piece]
		if (pieces[piece_0]['player'] == turn) {
			first_click_key = keys[piece]
			var attacking_animal_player = pieces[first_click_key]['player']
			checkpossibleturn = checkPossibleTurn()
			if (checkpossibleturn.length > 0) {
				possible_pieces.push(first_click_key)
			}
		}
	}
	return possible_pieces
}

function checkPossibleTurn() {
	var possibleMoves = []
	for (var column = 0; column < 7; column++) {
		for (var row = 0; row < 9; row++) {
			var second_click_key = row + '_' + column
			if (validMove(second_click_key)) {
				var possibleMove = second_click_key
				possibleMoves.push(possibleMove)
			}
		}
	}
	return possibleMoves
}

function validMove(second_click_key) {
	var first_coords = first_click_key.split('_')
	first_coords = first_coords.map((i) => Number(i));
	var second_coords = second_click_key.split('_')
	second_coords = second_coords.map((i) => Number(i));
	var attacking_animal_num = pieces[first_click_key]['animal']
	var attacking_animal_player = pieces[first_click_key]['player']
		// Allow tigers and lions to jump over water.
	if (current_window == 'cloud_game' && typeof cloud_player != 'undefined' && cloud_player != turn) {
		return false
	}
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

function movePiece(second_click_key) {
	var moving_piece = pieces[first_click_key]
	delete pieces[first_click_key]
	pieces[second_click_key] = moving_piece;
	is_first_click = true
	turn = 1 - turn
	if (current_window == 'cloud_game') {
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
	} else if (current_window == 'cloud_game') {
		context.drawImage(menus['cloud'], 0, 0, DRAWING_WIDTH, DRAWING_HEIGHT);
	} else if (current_window == 'game_over') {
		if (winning_player == 'red') {
			context.drawImage(menus['win_red'], 0, 0, GAME_WIDTH, GAME_HEIGHT);
		}
		if (winning_player == 'blue') {
			context.drawImage(menus['win_blue'], 0, 0, GAME_WIDTH, GAME_HEIGHT);
		}
	} else if (current_window == 'game') {
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
		turn_info: turn
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
	var moving_pieces = playerTurn()
	var show_green_squares = (current_window == 'game' || turn == cloud_player)
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
