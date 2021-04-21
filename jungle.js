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

window.onload = function() {
	canvas = document.getElementById("drawingCanvas");
	context = canvas.getContext("2d");

	canvas.onmouseup = canvasClick;

	is_first_click = true

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

turn = 1

function canvasClick(e) {
	var currentdate = new Date();
	var datetime = "beginning of canvasclick" +
		currentdate.getSeconds() + "." +
		currentdate.getMilliseconds();
	console.log(datetime)
	canvas = document.getElementById("drawingCanvas");
	context = canvas.getContext("2d");
	clickX = e.pageX - canvas.offsetLeft;
	clickY = e.pageY - canvas.offsetTop;
	future_reference = [clickX, clickY]
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
		first_click_coords = future_reference
		is_first_click = false
		return
	}
	second_click_key = click_key
	console.log("first_click false")
	console.log("click_key " + click_key)
	if (pieces[second_click_key] == null) {
		console.log("second square occupied")
		var moving_piece = pieces[first_click_key]
		console.log("moving_piece " + moving_piece)
		console.log("second_click_key " + second_click_key)
		delete pieces[first_click_key]
		console.log("pieces [after deletion] " + JSON.stringify(pieces))
		console.log("will replace pieces")
		pieces[click_key] = moving_piece;
		is_first_click = true
		console.log("pieces [after replacement] " + JSON.stringify(pieces))
		turn = 1 - turn
		drawBoard(first_click_coords)
		return
	}
	attacking_animal_num = pieces[first_click_key]["animal"]
	attacking_animal_player = pieces[first_click_key]["player"]
	defending_animal_num = pieces[second_click_key]["animal"]
	defending_animal_player = pieces[second_click_key]["player"]
	console.log("attacking_animal_num: " + attacking_animal_num)
	console.log("attacking_animal_player: " + attacking_animal_player)
	console.log("defending_animal_num: " + defending_animal_num)
	console.log("defending_animal_player: " + defending_animal_player)
	if (attacking_animal_player == defending_animal_player) {
		return
	}
	if (attacking_animal_num < defending_animal_num) {
		return
	}
	console.log("first_click_key " + first_click_key)
	console.log("pieces [before deletion] " + JSON.stringify(pieces))
	var moving_piece = pieces[first_click_key]
	console.log("moving_piece " + JSON.stringify(moving_piece))
	console.log("second_click_key " + second_click_key)
	delete pieces[first_click_key]
	console.log("pieces [after deletion] " + JSON.stringify(pieces))
	console.log("will replace pieces")
	pieces[second_click_key] = moving_piece;
	drawBoard(first_click_coords)
	is_first_click = true
	console.log("pieces [after replacement] " + JSON.stringify(pieces))
	turn = 1 - turn
};

function drawBoard(first_click_coords) {
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
	for (col = 0; col < 8; col++) {
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
	var currentdate = new Date();
	var datetime = "End of drawboard" +
		currentdate.getSeconds() + "." +
		currentdate.getMilliseconds();
	console.log(datetime)
}
