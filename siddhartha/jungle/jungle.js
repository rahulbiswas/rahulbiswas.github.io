current_window = 'home'
menus = {}
moved_piece = ['0']
eaten_animals = []
ai_select = ''
s = {}

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

var url_string = window.location.href
var url = new URL(url_string)
var testBoard = url.searchParams.get("board")
var useLocal = url.searchParams.get("local")
var usePMCS = url.searchParams.get("pmcs")
var utilityPersona = url.searchParams.get("utility")

loadPNGs()
var TEST_MODE = 0
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
const RULES_NEXT_X_START = 1250
const RULES_NEXT_Y_START = 0
const RULES_NEXT_X_END = 1500
const RULES_NEXT_Y_END = 150


window.onload = function() {
	canvas = document.getElementById('drawingCanvas')
	context = canvas.getContext('2d')
	canvas.onmouseup = canvasClick
	winning_player = ''
	setInitialBoard()
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

function imageWithNameRules(src) {
	var menu = new Image()
	menu.src = 'rules/1x/' + src + '.png'
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
	menus['agilityrules'] = imageWithNameRules('agilityrules')
	menus['eatinganimals'] = imageWithNameRules('eatinganimals')
	menus['howtowin'] = imageWithNameRules('howtowin')
	menus['jumpingoverwater'] = imageWithNameRules('jumpingoverwater')
	menus['ratsarespecial'] = imageWithNameRules('ratsarespecial')
	menus['traps'] = imageWithNameRules('traps')
	menus['game_blank'] = imageWithName('menus_game')
	menus['game_blue'] = imageWithName('menus_blue')
	menus['game_red'] = imageWithName('menus_red')
	menus['about'] = imageWithName('menus_info')
	menus['win_red'] = imageWithName('menus_winred')
	menus['win_blue'] = imageWithName('menus_winblue')
	menus['cloud'] = imageWithName('menus_multiplayer')
	menus['pewter_select'] = imageWithName('menus_pewter_select')
}

function setInitialBoard() {
	combined = {
		"command": "setPieces",
		"test_mode": "0"
	}
	if (testBoard != null) {
		combined["board"] = testBoard
	}
	string_combined = JSON.stringify(combined)
	pieces = gcf(string_combined)
	pieces = JSON.parse(pieces)
	console.log("pieces = " + pieces)
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
	return row + '_' + column
}

function possible_moves_mapping() {
	combined = {
		"command": "checkPossibleTurn",
		"first_click_key": first_click_key,
		"pieces": JSON.stringify(pieces)
	}
	string_combined = JSON.stringify(combined)
	possible_moves = gcf(string_combined)
	possible_moves = JSON.parse(possible_moves)
	for (var possible_move_index = 0; possible_move_index < possible_moves.length; possible_move_index++) {
		var move = possible_moves[possible_move_index]
		move = move.split('_')
		move = move.map((i) => Number(i));
		context.fillStyle = 'chocolate'
		context.fillRect(
			move[0] * BOARD_SQUARE_WIDTH + BOARD_UPPER_LEFT_X,
			move[1] * BOARD_SQUARE_WIDTH + BOARD_UPPER_LEFT_Y,
			POTENTIAL_MOVE_LENGTH,
			POTENTIAL_MOVE_LENGTH)
	}
}


function canvasClick(event) {
	s = {
		piece_info: pieces,
		turn: turn
	}
	canvas = document.getElementById('drawingCanvas');
	context = canvas.getContext('2d');
	var click_xy = clickXY(event)
	if (current_window == 'home') {
		homeScreen(click_xy)
	} else if (current_window == 'agilityrules' || current_window == 'eatinganimals' || current_window == 'howtowin' || current_window == 'jumpingoverwater' || current_window == 'ratsarespecial' || current_window == 'traps') {
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
		current_window = 'agilityrules'
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
			if (JSON.stringify(s) != '{}') {
				Result(s, [first_click_key, second_click_key])
			}
		}
		maybeEndGame()
	}
}

function maybeEndGame() {
	checkIfGameEnded()
	if (JSON.stringify(s) != '{}') {
		isTerminal(s)
	}
	if (winning_player != '') {
		console.log('game is over')
		current_window = 'game_over'
		draw()
		return true
	}
	return false
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
	s = {
		"piece_info" : pieces,
		"turn_info" : turn
	}
	if (isTerminal(s)) {
		current_window = "game_over"
		draw()
	}
}

function validMove(first_click_key, pieces, second_click_key, current_window) {
	combined = {
		"command": "validMove",
		"first_click_key": first_click_key,
		"pieces": JSON.stringify(pieces),
		"second_click_key": second_click_key
	}
	string_combined = JSON.stringify(combined)
	return (gcf(string_combined) == "true")
}

function movePiece(first_click_key, second_click_key) {
	console.log(first_click_key, second_click_key)
	var moving_piece = pieces[first_click_key]
	console.log(moving_piece)
	moved_piece[0] = first_click_key.split('_')
	moved_piece[1] = second_click_key.split('_')
	delete pieces[first_click_key]
	pieces[second_click_key] = moving_piece;
	is_first_click = true
	turn = 1 - turn
	if (current_window == 'ai_game' && turn == 0 && ai_select != '') {
		if (!maybeEndGame()) {
			aiGame()
		}
	} else if (current_window == 'cloud_game') {
		setBoard()
	}
	drawBoard()
}

function aiGame() {
	console.log("HELLO MY NAME SID")
	combined = {
		"command": "miniMax",
		"pieces": JSON.stringify(pieces),
		"turn" : turn.toString(),
		"utility" : utilityPersona
	}
	if (usePMCS) {
		combined["command"] = "pmcs"
	}
	if (utilityPersona == null) {
		combined["utility"] = 0;
	}
	console.log(combined);
	string_combined = JSON.stringify(combined)
	move = gcf(string_combined)
	console.log(move)
	first = move[2] + move[3] + move[4]
	second = move[8] + move[9] + move[10]
	movePiece(first, second)
}

function ruleTutorial(change, back) {
	if (current_window == 'eatinganimals') {
		if (change == 'yes' && back == 'yes') {
			current_window == 'agilityrules'
			return 'agilityrules'
		} else if (change == 'no') {
			return 'eatinganimals'
		} else if (change == 'yes' && back == 'no') {
			return 'howtowin'
		}
	}
	if (current_window == 'howtowin') {
		if (change == 'yes' && back == 'yes') {
			current_window == 'agilityrules'
			return 'eatinganimals'
		} else if (change == 'no') {
			return 'howtowin'
		} else if (change == 'yes' && back == 'no') {
			return 'jumpingoverwater'
		}
	}
	if (current_window == 'jumpingoverwater') {
		if (change == 'yes' && back == 'yes') {
			current_window == 'agilityrules'
			return 'howtowin'
		} else if (change == 'no') {
			return 'jumpingoverwater'
		} else if (change == 'yes' && back == 'no') {
			return 'ratsarespecial'
		}
	}
	if (current_window == 'ratsarespecial') {
		if (change == 'yes' && back == 'yes') {
			current_window == 'agilityrules'
			return 'jumpingoverwater'
		} else if (change == 'no') {
			return 'ratsarespecial'
		} else if (change == 'yes' && back == 'no') {
			return 'traps'
		}
	}
	if (current_window == 'traps') {
		if (change == 'yes' && back == 'yes') {
			current_window == 'agilityrules'
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
	context.clearRect(0, 0, DRAWING_WIDTH, DRAWING_HEIGHT)
	if (current_window == 'home') {
		context.drawImage(menus['home'], 0, 0, DRAWING_WIDTH, DRAWING_HEIGHT);
	} else if (current_window == 'agilityrules' || current_window == 'eatinganimals' || current_window == 'howtowin' || current_window == 'jumpingoverwater' || current_window == 'ratsarespecial' || current_window == 'traps') {
		window_to_draw = (ruleTutorial('no', 'no'))
		context.drawImage(menus[window_to_draw], 0, 0, DRAWING_WIDTH, DRAWING_HEIGHT);
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
	if (joining_code.contains('game_code')) {
		return;
	}
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
	url = 'https://us-west2-animal-397104.cloudfunctions.net/readwrite/?create_game=1';
	console.log(url);
	createGameReq.open('GET', url);
	createGameReq.send();
}

function gcf(request) {
	var createGameReq = new XMLHttpRequest();
	url = 'https://animal-397104.uw.r.appspot.com/?request=' + request
	if (useLocal != null) {
		url = 'http://localhost:8080/?request=' + request
	}
	console.log(url)
	console.trace()
	createGameReq.open('GET', url, false);
	createGameReq.send(null);
	return createGameReq.responseText.replace('<span class="code" >', '').replace('</span>', '').replaceAll('&quot;', '"')
}

function setGameListener() {
	checkPeriodically()
}

function setBoard() {
	var setup = {
		piece_info: pieces,
		turn_info: turn,
		moved_piece_info: moved_piece
	}
	setup = JSON.stringify(setup)
	var url = encodeURIComponent(setup)
	document.getElementById('multiplayer_join_url').innerHTML = gameURL() + '?game_code=' + game_code
	var setGameReq = new XMLHttpRequest()
	setGameReq.addEventListener('load', setGameListener)
	url = 'https://us-west2-animal-397104.cloudfunctions.net/readwrite/?set=1&game_code=' + game_code + '&game_board=' + url
	console.log(url)
	setGameReq.open('GET', url)
	setGameReq.send()
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
	url = 'https://us-west2-animal-397104.cloudfunctions.net/readwrite/?get=1&game_code=' + game_code
	console.log(url)
	getReq.open('GET', url)
	getReq.send()
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
		var x = piece_components[0] * BOARD_SQUARE_WIDTH
		var y = piece_components[1] * BOARD_SQUARE_WIDTH
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
		context.fillRect(moved_piece[0][0] * BOARD_SQUARE_WIDTH + BOARD_UPPER_LEFT_X,
			moved_piece[0][1] * BOARD_SQUARE_WIDTH + BOARD_UPPER_LEFT_Y,
			POTENTIAL_MOVE_LENGTH,
			POTENTIAL_MOVE_LENGTH)
		context.fillRect(moved_piece[1][0] * BOARD_SQUARE_WIDTH + BOARD_UPPER_LEFT_X,
			moved_piece[1][1] * BOARD_SQUARE_WIDTH + BOARD_UPPER_LEFT_Y,
			POTENTIAL_MOVE_LENGTH,
			POTENTIAL_MOVE_LENGTH)
	}
	drawGreenSquares()
}

function drawGreenSquares() {
	combined = {
		"command": "playerTurn",
		"pieces": JSON.stringify(pieces),
		"turn": turn.toString()
	}
	string_combined = JSON.stringify(combined)
	moving_pieces = gcf(string_combined)
	moving_pieces = moving_pieces.replace('<span class="code" >', '').replace('</span>', '')
	moving_pieces = moving_pieces.replaceAll('&quot;', '"')
	moving_pieces = JSON.parse(moving_pieces)
	var show_green_squares = (current_window == 'game' || (current_window == 'ai_game' && turn == 1))
	if (show_green_squares) {
		for (var p_i = 0; p_i < moving_pieces.length; p_i++) {
			context.fillStyle = 'green'
			context.fillRect(moving_pieces[p_i][0] * BOARD_SQUARE_WIDTH + BOARD_UPPER_LEFT_X,
				moving_pieces[p_i][2] * BOARD_SQUARE_WIDTH + BOARD_UPPER_LEFT_Y,
				POTENTIAL_MOVE_LENGTH,
				POTENTIAL_MOVE_LENGTH)
		}
	}
}

function isTerminal(s) {
	combined = {
		"command": "whoWon",
		"pieces": JSON.stringify(pieces)
	}
	string_combined = JSON.stringify(combined)
	somebodyWon = gcf(string_combined)
	console.log(somebodyWon)
	if (somebodyWon == "false") {
		console.log("nobody won")
		return false
	} else if (somebodyWon == "red"){
		console.log("red won")
		winning_player = "red"
		return true
	} else {
		console.log("blue won")
		winning_player = "blue"
		return true
	}
}

function Result(s, a) {
	p = toMove(s)
	crd1 = a[0]
	crd2 = a[1]
	s[crd1] = s[crd2]
	s['turn'] = Math.abs(p - 1)
	return s
}

function toMove(s) {
	return s['turn']
}
