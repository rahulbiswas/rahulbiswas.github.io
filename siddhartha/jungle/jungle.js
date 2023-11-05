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

var TEST_MODE = 0
if (window.location.href == "file:///Users/siddhartha/Documents/github/rahulbiswas.github.io/siddhartha/jungle/jungle.html") {
	TEST_MODE = 3
}

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
const CLOUD_X_START = 69
const CLOUD_Y_START = 718
const CLOUD_X_END = 559
const CLOUD_Y_END = 950
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
	return paper.image(img_name, dx, dy, dw, dh)
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
	is_first_click = true
	turn = 1
}

function click_key_with_event(clickX, clickY) {
	var row = Math.floor((clickX - BOARD_UPPER_LEFT_X) / BOARD_SQUARE_WIDTH)
	var column = Math.floor((clickY - BOARD_UPPER_LEFT_Y) / BOARD_SQUARE_HEIGHT)
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
		rrect(
			move[0] * BOARD_SQUARE_WIDTH + BOARD_UPPER_LEFT_X + BOARD_SQUARE_WIDTH - POTENTIAL_MOVE_LENGTH * 1.3,
			move[1] * BOARD_SQUARE_HEIGHT + BOARD_UPPER_LEFT_Y,
			POTENTIAL_MOVE_LENGTH,
			POTENTIAL_MOVE_LENGTH,
			'brown')
	}
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
	console.log('clicked ' + click_xy)
	s = {
		piece_info: pieces,
		turn: turn
	}
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
	if (click_xy[0] > HOME_ABOUT_X_START &&
		click_xy[0] < HOME_ABOUT_X_STOP &&
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
				draw()
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
		"piece_info": pieces,
		"turn_info": turn
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
	var moving_piece = pieces[first_click_key]
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
	draw()
}

function aiGame() {
	combined = {
		"command": "miniMax",
		"pieces": JSON.stringify(pieces),
		"turn": turn.toString(),
		"utility": utilityPersona
	}
	if (usePMCS) {
		combined["command"] = "pmcs"
	}
	if (utilityPersona == null) {
		combined["utility"] = 0;
	}
	string_combined = JSON.stringify(combined)
	move = gcf(string_combined)
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
	console.log('draw')
	iw = window.innerWidth
	ih = window.innerHeight
	if (iw > DRAWING_WIDTH / DRAWING_HEIGHT * ih) {
		iw = ih * DRAWING_WIDTH / DRAWING_HEIGHT
	} else {
		ih = iw * DRAWING_HEIGHT / DRAWING_WIDTH
	}
	paper.setSize(iw, ih)
	if (current_window == 'home') {
		rdraw('png/menus_home.png', 0, 0, DRAWING_WIDTH, DRAWING_HEIGHT);
	} else if (current_window == 'agilityrules' || current_window == 'eatinganimals' || current_window == 'howtowin' || current_window == 'jumpingoverwater' || current_window == 'ratsarespecial' || current_window == 'traps') {
		window_to_draw = (ruleTutorial('no', 'no'))
		rdraw('rules/' + window_to_draw + '.png', 0, 0, DRAWING_WIDTH, DRAWING_HEIGHT);
	} else if (current_window == 'about') {
		rdraw('png/menus_info.png', 0, 0, DRAWING_WIDTH, DRAWING_HEIGHT);
	} else if (current_window == 'cloud_game_menu') {
		rdraw('png/menus_multiplayer.png', 0, 0, DRAWING_WIDTH, DRAWING_HEIGHT);
	} else if (current_window == 'game_over') {
		if (winning_player == 'red') {
			rdraw('png/menus_winred.png', 0, 0, DRAWING_WIDTH, DRAWING_HEIGHT);
		}
		if (winning_player == 'blue') {
			rdraw('png/menus_winblue.png', 0, 0, DRAWING_WIDTH, DRAWING_HEIGHT);
		}
	} else if (current_window == 'game' || current_window == 'ai_game') {
		drawBoard()
	}
	console.log('adding yellow')
	var clickArea = paper.rect(0, 0, iw, ih).attr({
		'fill': 'yellow',
		'opacity': 0.0
	})
	clickArea.mousedown(canvasClick)
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
		draw()
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
	createGameReq.open('GET', url);
	createGameReq.send();
}

function gcf(request) {
	var createGameReq = new XMLHttpRequest();
	url = 'https://animal-397104.uw.r.appspot.com/?request=' + request
	if (useLocal != null) {
		url = 'http://localhost:8080/?request=' + request
	}
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
			draw()
		}
	}
	var getReq = new XMLHttpRequest();
	getReq.addEventListener('load', getGameListener)
	url = 'https://us-west2-animal-397104.cloudfunctions.net/readwrite/?get=1&game_code=' + game_code
	getReq.open('GET', url)
	getReq.send()
}

function drawBoard() {
	if (typeof cloud_player == 1) {
		rdraw('png/menus_red.png', 0, 0, DRAWING_WIDTH, DRAWING_HEIGHT);
	} else if (typeof cloud_player == 0) {
		rdraw('png/menus_blue.png', 0, 0, DRAWING_WIDTH, DRAWING_HEIGHT);
	} else if (turn == 1) {
		rdraw('png/menus_red.png', 0, 0, DRAWING_WIDTH, DRAWING_HEIGHT);
	} else if (turn == 0) {
		rdraw('png/menus_blue.png', 0, 0, DRAWING_WIDTH, DRAWING_HEIGHT);
	}
	rdraw('png/menus_game.png', 0, 0, DRAWING_WIDTH, DRAWING_HEIGHT);
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
				rdraw('png/apiece.svg', x, y, PIECE_SIZE, PIECE_SIZE).attr({
					'opacity': alpha
				})
				rdraw('png/a' + animal + '.svg', x, y, PIECE_SIZE, PIECE_SIZE).attr({
					'opacity': alpha
				})
			} else if (player == 1) {
				rdraw('png/bpiece.svg', x, y, PIECE_SIZE, PIECE_SIZE).attr({
					'opacity': alpha
				})
				rdraw('png/b' + animal + '.svg', x, y, PIECE_SIZE, PIECE_SIZE).attr({
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
			rdraw('png/apiece.svg',
				(x + BOARD_UPPER_LEFT_X),
				(y + BOARD_UPPER_LEFT_Y),
				PIECE_SIZE,
				PIECE_SIZE)
			rdraw('png/a' + animal + '.svg',
				(x + BOARD_UPPER_LEFT_X),
				(y + BOARD_UPPER_LEFT_Y),
				PIECE_SIZE,
				PIECE_SIZE)
		}
		if (player == 1) {
			rdraw('png/bpiece.svg',
				(x + BOARD_UPPER_LEFT_X),
				(y + BOARD_UPPER_LEFT_Y),
				PIECE_SIZE,
				PIECE_SIZE)
			rdraw('png/b' + animal + '.svg',
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
			console.log('drawing green square')
			rrect(
				moving_pieces[p_i][0] * BOARD_SQUARE_WIDTH + BOARD_UPPER_LEFT_X + BOARD_SQUARE_WIDTH - POTENTIAL_MOVE_LENGTH * 1.3,
				moving_pieces[p_i][2] * BOARD_SQUARE_HEIGHT + BOARD_UPPER_LEFT_Y,
				POTENTIAL_MOVE_LENGTH,
				POTENTIAL_MOVE_LENGTH,
				'green')
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
	if (somebodyWon == "false") {
		return false
	} else if (somebodyWon == "red") {
		winning_player = "red"
		return true
	} else {
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
