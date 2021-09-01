// My list of the global variables.
// animals_0, animals_1, canvas, context, is_first_click, pieces, water, traps, den, turn

animals_0 = {}
for (a_i = 1; a_i < 9; a_i++) {
	console.log(a_i)
	img = new Image()
	img.src = 'a' + a_i + '.png'
	animals_0[a_i] = img
}
animals_1 = {}
for (b_i = 1; b_i < 9; b_i++) {
	console.log(b_i)
	img_1 = new Image()
	img_1.src = "b" + b_i + '.png'
	animals_1[b_i] = img_1
}

function setPieces() {
	pieces = {
		"0_0": {
			"player": 0,
			"animal": 7
		},
		"0_6": {
			"player": 0,
			"animal": 6
		},
		"1_1": {
			"player": 0,
			"animal": 4
		},
		"1_5": {
			"player": 0,
			"animal": 2
		},
		"2_0": {
			"player": 0,
			"animal": 1
		},
		"2_2": {
			"player": 0,
			"animal": 5
		},
		"2_4": {
			"player": 0,
			"animal": 3
		},
		"2_6": {
			"player": 0,
			"animal": 8
		},
		"8_6": {
			"player": 1,
			"animal": 7
		},
		"8_0": {
			"player": 1,
			"animal": 6
		},
		"7_5": {
			"player": 1,
			"animal": 4
		},
		"7_1": {
			"player": 1,
			"animal": 2
		},
		"6_6": {
			"player": 1,
			"animal": 1
		},
		"6_4": {
			"player": 1,
			"animal": 5
		},
		"6_2": {
			"player": 1,
			"animal": 3
		},
		"6_0": {
			"player": 1,
			"animal": 8
		}
	};
	is_first_click = true
	turn = 1
	has_won = false
}

function rules() {
	context.font = "20px Georgia";
	context.fillText("Dou Shou Qi : Rules and Info", 710, 50)
	context.fillText("1. This is a two player game, so grab a family member or buddy to play with you. ", 710, 80)
	context.fillText("2. When all of the pieces of one color have green squares in the top corner, it is that player's turn.", 710, 110)
	context.fillText("3. When a square is colored brown, it means that the piece selected can move to that square", 710, 140)
	context.fillText("3. All pieces can move one square vertically or horizontally.", 710, 170)
	context.fillText("4. When pieces attack each other, whichever piece has the higher number wins.", 710, 200)
	context.fillText("5. Rats can traverse through water, but cannot eat the elephant from the water", 710, 230)
	context.fillText("6. Rats can eat elephants, elephants cannot eat rats.", 710, 260)
	context.fillText("7. Lions and Tigers can jump across the water in any direction, as long as a rat is not in the water blocking the path, and there is no higher ranking player on the other side.", 710, 290)
	context.fillText("8. Now have fun and get started!!!", 710, 350)
	context.fillText("This wonderful and exciting game was created by your favorite person, Siddhartha Biswas")
	
}

window.onload = function() {
	canvas = document.getElementById("drawingCanvas");
	context = canvas.getContext("2d");
	rules()

	canvas.onmouseup = canvasClick;

	setPieces()

	water = [
		[3, 1],
		[4, 1],
		[5, 1],
		[3, 2],
		[4, 2],
		[5, 2],
		[3, 4],
		[4, 4],
		[5, 4],
		[3, 5],
		[4, 5],
		[5, 5]
	]
	traps = [
		[7, 3],
		[8, 2],
		[8, 4],
		[0, 2],
		[1, 3],
		[0, 4]
	]
	den = [
		[0, 3],
		[8, 3]
	]
	drawBoard()
}

class WaterJump {
	constructor(destination, water) {
		this.destination = destination;
		this.water = water;
	}
}

validMoveWater = {
	"2_1": [new WaterJump("6_1", ["3_1","4_1","5_1"])],
	"2_2": [new WaterJump("6_2", ["3_2","4_2","5_2"])],
	"3_0": [new WaterJump("3_3", ["3_1","3_2"])],
	"4_0": [new WaterJump("4_3", ["4_1","4_2"])],
	"5_0": [new WaterJump("5_3", ["5_1","5_2"])],
	"6_1": [new WaterJump("2_1", ["5_1","4_1","3_1"])],
	"6_2": [new WaterJump("2_2", ["5_2","4_2","3_2"])],
	"3_3": [new WaterJump("3_0", ["3_2","3_1"]), new WaterJump("3_6", ["3_4","3_5"])],
	"4_3": [new WaterJump("4_0", ["4_2","4_1"]), new WaterJump("4_6", ["4_4","4_5"])],
	"5_3": [new WaterJump("5_0", ["5_2","5_1"]), new WaterJump("5_6", ["5_4","5_5"])],
	"2_4": [new WaterJump("6_4", ["3_4","4_4","5_4"])],
	"2_5": [new WaterJump("6_5", ["3_5","4_5","5_5"])],
	"3_6": [new WaterJump("3_3", ["3_5","3_4"])],
	"4_6": [new WaterJump("4_3", ["4_5","4_4"])],
	"5_6": [new WaterJump("5_3", ["5_5","5_4"])],
	"6_4": [new WaterJump("2_4", ["5_4","4_4","3_4"])],
	"6_5": [new WaterJump("2_5", ["5_5","4_5","3_5"])]
}

function canvasClick(e) {
	var currentdate = new Date();
	var datetime = "beginning of canvasclick" +
		currentdate.getSeconds() + "." +
		currentdate.getMilliseconds();
	console.log(datetime)
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
		console.log("first_click true")
		if (pieces[click_key] == null) {
			console.log("no piece ; will return")
			return
		}
		player = pieces[click_key]["player"]
		console.log(player)
		if (player != turn) {
			return
		}
		first_click_key = click_key
		console.log("I will now proceed to call the function")
		attacking_animal_num = pieces[first_click_key]["animal"]
		attacking_animal_player = pieces[first_click_key]["player"]
		possiblemove = checkPossibleTurn()
		console.log("The function returned: " + possiblemove)
		console.log("I have now called the function")
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
	for (possible_move_index=0; possible_move_index<possiblemove.length; possible_move_index++) {
		move = possiblemove[possible_move_index]
		move = move.split("_")
		move = move.map((i) => Number(i));
		context.fillStyle = "chocolate"
		context.fillRect(move[1]*100, move[0]*100, 20, 20)
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
			console.log("checkpossibleturn = " + checkpossibleturn)
			if (checkpossibleturn.length > 0) {
				possible_pieces.push(first_click_key)
			}
		}
	}
	return possible_pieces
}

function checkPossibleTurn() {
	possibleMoves = []
	for (column=0; column<7; column++) {
		for (row=0; row<9; row++) {
			second_click_key = row + "_" + column
			if (validMove()) {
				console.log("Possible square identified. Row =" + row + "Column =" + column)
				possibleMove = second_click_key
				possibleMoves.push(possibleMove)
				console.log(possibleMoves)
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
		console.log('validMoveWater ' + JSON.stringify(valid_moves))
		for (valid_move_index = 0; valid_move_index < valid_moves.length; valid_move_index++) {
			valid_move = valid_moves[valid_move_index]
			if (valid_move.destination == second_click_key) {
				if (attacking_animal_num == 6 || attacking_animal_num == 7) {
					for (w_s_i = 0; w_s_i < valid_move.water.length; w_s_i ++) {
						console.log(pieces[valid_move.water[w_s_i]])
						if (pieces[valid_move.water[w_s_i]] != null) {
							console.log("blocking = "  + JSON.stringify(pieces[valid_move.water[w_s_i]]))
							return false
						}
					}
					return true
				}
			}
		}
	}
	is_water_square = false
	for (w_s_i=0; w_s_i<water.length; w_s_i++) {
		if (water[w_s_i][0] == second_coords[0] && water[w_s_i][1] == second_coords[1]) {
			is_water_square = true
		}
	}
	if (is_water_square) {
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
	console.log("pieces.length = " + Object.keys(pieces).length)
	pieces_position_list = Object.keys(pieces)
	for (p_i = 0; p_i < pieces_position_list.length; p_i++) {
		piece_position = pieces_position_list[p_i]
		player = pieces[piece_position]["player"]
		animal = pieces[piece_position]["animal"]
		console.log("piece_position " + piece_position + ", player " + player)
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
	console.log("Moving pieces =" + moving_pieces)
	for (p_i=0; p_i<moving_pieces.length; p_i++) {
		context.fillStyle = "green"
		context.fillRect(moving_pieces[p_i][2]*100, moving_pieces[p_i][0]*100, 20, 20)
	}
	var currentdate = new Date();
	var datetime = "End of drawboard" +
		currentdate.getSeconds() + "." +
		currentdate.getMilliseconds();
	console.log(datetime)
}
