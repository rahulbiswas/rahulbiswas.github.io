loadPNGs()

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
}

function setPieces() {
	pieces = JSON.parse(JSON.stringify(piece_setup))
	is_first_click = true
	turn = 1
	has_won = false
}

window.onload = function() {
	canvas = document.getElementById("drawingCanvas")
	context = canvas.getContext("2d")
	print_rules()

	canvas.onmouseup = canvasClick

	setPieces()
	drawBoard()
}

class WaterJump {
	constructor(destination, water) {
		this.destination = destination
		this.water = water
	}
}

function canvasClick(e) {
	canvas = document.getElementById("drawingCanvas");
	context = canvas.getContext("2d");
	if (has_won) {
		setPieces()
		drawBoard()
		return
	}
	clickX = e.pageX - canvas.offsetLeft;
	clickY = e.pageY - canvas.offsetTop;
	row = Math.floor(clickX / 100)
	column = Math.floor(clickY / 100)
	click_key = column + "_" + row
	if (is_first_click == true) {
		if (pieces[click_key] == null) {
			return
		}
		player = pieces[click_key]["player"]
		if (player != turn) {
			return
		}
		first_click_key = click_key
		attacking_animal_num = pieces[first_click_key]["animal"]
		attacking_animal_player = pieces[first_click_key]["player"]
			possiblemove = checkPossibleTurn()
			for (possible_move_index=0; possible_move_index<possiblemove.length; possible_move_index++) {
				move = possiblemove[possible_move_index]
				move = move.split("_")
				move = move.map((i) => Number(i));
				context.fillStyle = "chocolate"
				context.fillRect(move[1]*100, move[0]*100, 20, 20)
			}
		is_first_click = false
		return
	}
	second_click_key = click_key
	if (first_click_key == second_click_key) {
		first_click_key = null
		second_click_key = null
	}
	if (first_click_key == null) {
		return
	}
	if (!validMove()) {
		return
	}
	movePiece()
	if (pieces["8_3"] != null || pieces["0_3"] != null) {
		context.font = "20px Georgia";
		context.fillText("Dude, you so smart, you just won!!!", 10, 50);
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
			attacking_animal_num = pieces[first_click_key]["animal"]
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

function drawBoard() {
	context.clearRect(0, 0, 700, 900)
	for (w_i = 0; w_i < water.length; w_i++) {
		context.fillStyle = "blue";
		context.fillRect(water[w_i][1] * 100, water[w_i][0] * 100, 100, 100);
	}
	for (t_i = 0; t_i < traps.length; t_i++) {
		context.fillStyle = "yellow";
		context.fillRect(traps[t_i][1] * 100, traps[t_i][0] * 100, 100, 100);
	}
	for (d_i = 0; d_i < den.length; d_i++) {
		context.fillStyle = "gray";
		context.fillRect(den[d_i][1] * 100, den[d_i][0] * 100, 100, 100)
	}
	pieces_position_list = Object.keys(pieces)
	for (p_i = 0; p_i < pieces_position_list.length; p_i++) {
		piece_position = pieces_position_list[p_i]
		player = pieces[piece_position]["player"]
		animal = pieces[piece_position]["animal"]
		piece_components = piece_position.split("_")
		x = piece_components[1] * 100
		y = piece_components[0] * 100
		if (player == 0) {
			context.drawImage(animals_0[animal], x, y, 100, 100);
		}
		if (player == 1) {
			context.drawImage(animals_1[animal], x, y, 100, 100);
		}
	}
	context.beginPath()
	context.lineWidth = 4;
	context.strokeStyle = "rgb(60,60,60)";
	for (col = 0; col < 7; col++) {
		for (row = 0; row < 10; row++) {
			x = col * 100
			y = row * 100
			context.moveTo(x, y)
			context.lineTo(x + 100, y)
			context.lineTo(x + 100, y + 100)
			context.lineTo(x, y + 100)
			context.lineTo(x, y)
			context.stroke();
		}
	}
	moving_pieces = playerTurn()
	for (p_i=0; p_i<moving_pieces.length; p_i++) {
		context.fillStyle = "green"
		context.fillRect(moving_pieces[p_i][2]*100, moving_pieces[p_i][0]*100, 20, 20)
	}
}
