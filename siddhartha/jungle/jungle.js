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
const HOME_X_LEFT = 515
const HOME_Y_LEFT = 446
const HOME_X_RIGHT = 662
const HOME_Y_RIGHT = 664
const CLOUD_X_START = 69
const CLOUD_Y_START = 718
const CLOUD_X_END = 559
const CLOUD_Y_END = 950

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
	game_menu_blank = new Image()
	game_menu_blank.src = "png/menus_game.png"
	game_menu_blue = new Image()
	game_menu_blue.src = "png/menus_blue.png"
	game_menu_red = new Image()
	game_menu_red.src = "png/menus_red.png"
	about_menu = new Image()
	about_menu.src = "png/menus_info.png"
	win_red_menu = new Image()
	win_red_menu.src = "png/menus_WinRed.png"
	win_blue_menu = new Image()
	win_blue_menu.src = "png/menus_WinBlue.png"
	cloud_menu = new Image()
	cloud_menu.src = "png/menus_multiplayer.png"
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
	console.log(clickX)
	console.log(clickY)
	return [clickX, clickY]
}

function click_key_with_event(clickX, clickY) {
	row = Math.floor((clickX - BOARD_UPPER_LEFT_X) / BOARD_SQUARE_WIDTH)
	column = Math.floor((clickY - BOARD_UPPER_LEFT_Y) / BOARD_SQUARE_WIDTH)
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
	canvas = document.getElementById("drawingCanvas");
	context = canvas.getContext("2d");
	click_xy = clickXY(event)
	if (current_window == "home") {
		if (click_xy[0] > HOME_LOCAL_X_START &&
			click_xy[0] < HOME_LOCAL_X_END &&
			click_xy[1] > HOME_LOCAL_Y_START &&
			click_xy[1] < HOME_LOCAL_Y_END) {
			current_window = "game"
			draw()
		}
		if (click_xy[0] > HOME_RULES_X_START &&
			click_xy[0] < HOME_RULES_X_END &&
			click_xy[1] > HOME_RULES_Y_START &&
			click_xy[1] < HOME_RULES_Y_END) {
			current_window = "rules"
			draw()
		}
		if (click_xy[0] > HOME_RULES_X_START &&
			click_xy[0] < HOME_RULES_X_END &&
			click_xy[1] > HOME_ABOUT_Y_START &&
			click_xy[1] < HOME_ABOUT_Y_END) {
			current_window = "about"
			draw()
		}
		if (click_xy[0] > CLOUD_X_START &&
			click_xy[0] < CLOUD_X_END &&
			click_xy[1] > CLOUD_Y_START &&
			click_xy[1] < CLOUD_Y_END) {
			current_window = "cloud_game"
			// cloud_player 1 means red
			cloud_player = 1
			draw()
		}
	}
	if (current_window == "rules") {
		if (click_xy[0] > BACK_X_START &&
			click_xy[0] < BOARD_UPPER_LEFT_X &&
			click_xy[1] > BACK_Y_START &&
			click_xy[1] < BACK_Y_END) {
			current_window = "home"
			draw()
		}
	}
	if (current_window == "game" || current_window == "cloud_game") {
		if (click_xy[0] > BACK_X_START &&
			click_xy[0] < BOARD_UPPER_LEFT_X &&
			click_xy[1] > BACK_Y_START &&
			click_xy[1] < BACK_Y_END) {
			current_window = "home"
			draw()
		}
	}
	if (current_window == "about") {
		if (click_xy[0] > BACK_X_START &&
			click_xy[0] < BOARD_UPPER_LEFT_X &&
			click_xy[1] > BACK_Y_START &&
			click_xy[1] < BACK_Y_END) {
			current_window = "home"
			draw()
		}
	}
	console.log("Before function")
	if (has_won) {
		setPieces()
		drawBoard()
		console.log("In function has_won")
		if (clickX > HOME_X_LEFT && clickX < HOME_X_RIGHT && clickY > HOME_Y_LEFT && clickY < HOME_Y_RIGHT) {
			console.log("In if function")
			current_window = "home"
			draw()
		}
		return
	}

	click_key = click_key_with_event(click_xy[0], click_xy[1])
	if (is_first_click && (current_window == "game" || current_window == "cloud_game")) {
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
	if (current_window == "game" || current_window == "cloud_game") {
		if (first_click_key == second_click_key) {
			first_click_key = null
			second_click_key = null
			is_first_click = true
			moving_piece = null
			drawBoard()
		}
		if (!validMove()) {
			return
		}
		movePiece()
	}
	if (pieces["0_3"] != null) {
		has_won = true
		context.drawImage(win_red_menu, 0,0,GAME_WIDTH,GAME_HEIGHT);
	}
	if (pieces["8_3"] != null) {
		has_won = true
		context.drawImage(win_blue_menu, 0,0,GAME_WIDTH,GAME_HEIGHT);
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
	if (current_window == "cloud_game" && typeof cloud_player != 'undefined' && cloud_player != turn) {
		return false
	}
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
	if (current_window == "cloud_game") {
		setBoard()
	}
	drawBoard()
}

function draw() {
	context.clearRect(0, 0, DRAWING_WIDTH, DRAWING_HEIGHT)
	if (current_window == 'home') {
		context.drawImage(home_menu, 0, 0, DRAWING_WIDTH, DRAWING_HEIGHT);
		join_multiplayer()
	} else if (current_window == 'rules') {
		context.drawImage(rule_menu, 0, 0, DRAWING_WIDTH, DRAWING_HEIGHT);
	} else if (current_window == 'about') {
		context.drawImage(about_menu, 0, 0, DRAWING_WIDTH, DRAWING_HEIGHT);
	} else if (current_window == 'cloud_game') {
		context.drawImage(cloud_menu, 0, 0, DRAWING_WIDTH, DRAWING_HEIGHT);
		aws()
	} else {
		drawBoard()
	}
}

function join_multiplayer() {
	joining_code = window.location.search
	joining_code = joining_code.replace("?game_code=", "")
	console.log('joining_code [' + joining_code + ']')
	if (joining_code != "") {
		turn = 1
		game_code = joining_code
		cloud_player = 0
		console.log("turn ="+turn)
		console.log("cloud_player ="+cloud_player)
		drawBoard()
		setBoard()
	}
}

function aws() {
	function createGameListener() {
		turn = 0
		game_code = this.responseText
		console.log(turn)
		setBoard()
	}
	var createGameReq = new XMLHttpRequest();
	createGameReq.addEventListener("load", createGameListener);
	createGameReq.open("GET", "https://06z51kydsh.execute-api.us-west-2.amazonaws.com/Prod/hello?siddhartha=fool&create_game=1");
	createGameReq.send();
}

function setBoard() {
	var setup = {piece_info : pieces, turn_info : turn}
	setup = JSON.stringify(setup)
	var url = encodeURIComponent(setup);
	document.getElementById("multiplayer_join_url").innerHTML = "http://rahulbiswas.github.io/siddhartha/jungle/jungle.html?game_code="+game_code;
	console.log("https://06z51kydsh.execute-api.us-west-2.amazonaws.com/Prod/hello?siddhartha=fool&set=1&game_code="+ game_code +"&game_board="+url)
	function setGameListener() {
		checkPeriodically()
	}
	setGameReq = new XMLHttpRequest();
	setGameReq.addEventListener("load", setGameListener)
	setGameReq.open("GET", "https://06z51kydsh.execute-api.us-west-2.amazonaws.com/Prod/hello?siddhartha=fool&set=1&game_code="+ game_code +"&game_board="+url);
	setGameReq.send();
}

function checkPeriodically() {
	function getGameListener() {
		console.log(this.responseText)
		return_info = JSON.parse(this.responseText)
		turn = return_info["turn_info"]
		pieces = return_info["piece_info"]
		console.log(pieces)
		console.log(turn)
		if (pieces["0_3"] != null) {
			has_won = true
			context.drawImage(win_red_menu, 0,0,GAME_WIDTH,GAME_HEIGHT);
			setTimeout(checkPeriodically, 2000)
			window.location.replace("http://rahulbiswas.github.io/siddhartha/jungle/jungle.html");
		}
		if (pieces["8_3"] != null) {
			has_won = true
			context.drawImage(win_blue_menu, 0,0,GAME_WIDTH,GAME_HEIGHT);
			setTimeout(checkPeriodically, 2000)
			window.location.replace("http://rahulbiswas.github.io/siddhartha/jungle/jungle.html");
		}
		if (turn != cloud_player) {
			setTimeout(checkPeriodically, 2000)
		} else {
			current_window = "cloud_game"
			drawBoard()
		}
	}
	var getReq = new XMLHttpRequest();
	getReq.addEventListener("load", getGameListener)
	getReq.open("GET", "https://06z51kydsh.execute-api.us-west-2.amazonaws.com/Prod/hello?siddhartha=fool&get=1&game_code="+ game_code);
	console.log("Time")
	getReq.send();
}


function drawBoard() {
	context.clearRect(0, 0, DRAWING_WIDTH, DRAWING_HEIGHT)
	if (typeof cloud_player == 1) {
		context.drawImage(game_menu_red, 0, 0, GAME_WIDTH, GAME_HEIGHT);
	} else if (typeof cloud_player == 0) {
		context.drawImage(game_menu_blue, 0, 0, GAME_WIDTH, GAME_HEIGHT);
	} else if (turn == 1) {
		context.drawImage(game_menu_red, 0, 0, GAME_WIDTH, GAME_HEIGHT);
	} else if (turn == 0) {
		context.drawImage(game_menu_blue, 0, 0, GAME_WIDTH, GAME_HEIGHT);
	}
	context.drawImage(game_menu_blank, 0, 0, GAME_WIDTH, GAME_HEIGHT);
	pieces_position_list = Object.keys(pieces)
	for (p_i = 0; p_i < pieces_position_list.length; p_i++) {
		piece_position = pieces_position_list[p_i]
		player = pieces[piece_position]["player"]
		animal = pieces[piece_position]["animal"]
		piece_components = piece_position.split("_")
		x = piece_components[1] * BOARD_SQUARE_WIDTH
		y = piece_components[0] * BOARD_SQUARE_WIDTH
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
	moving_pieces = playerTurn()
	for (p_i = 0; p_i < moving_pieces.length; p_i++) {
		context.fillStyle = "green"
		context.fillRect(moving_pieces[p_i][2] * BOARD_SQUARE_WIDTH + BOARD_UPPER_LEFT_X,
			moving_pieces[p_i][0] * BOARD_SQUARE_WIDTH + BOARD_UPPER_LEFT_Y,
			POTENTIAL_MOVE_LENGTH,
			POTENTIAL_MOVE_LENGTH)
	}
}
