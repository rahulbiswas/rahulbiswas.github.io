// The initial setup of the pieces.
// Dictionary entries are of the form:
// position : { "player" : which_player, "animal": animal_number }

test_only_piece_setup = {
	"2_2": {
		"player": 0,
		"animal": 5
	},
	"4_6": {
		"player": 1,
		"animal": 5
	}
}

piece_setup = {
	"0_0": {
		"player": 0,
		"animal": 7
	},
	"6_0": {
		"player": 0,
		"animal": 6
	},
	"1_1": {
		"player": 0,
		"animal": 4
	},
	"5_1": {
		"player": 0,
		"animal": 2
	},
	"0_2": {
		"player": 0,
		"animal": 1
	},
	"2_2": {
		"player": 0,
		"animal": 5
	},
	"4_2": {
		"player": 0,
		"animal": 3
	},
	"6_2": {
		"player": 0,
		"animal": 8
	},
	"6_8": {
		"player": 1,
		"animal": 7
	},
	"0_8": {
		"player": 1,
		"animal": 6
	},
	"5_7": {
		"player": 1,
		"animal": 4
	},
	"1_7": {
		"player": 1,
		"animal": 2
	},
	"6_6": {
		"player": 1,
		"animal": 1
	},
	"4_6": {
		"player": 1,
		"animal": 5
	},
	"2_6": {
		"player": 1,
		"animal": 3
	},
	"0_6": {
		"player": 1,
		"animal": 8
	}
}

// A list of water tiles.
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

// A list of traps.
traps = [
	[7, 3],
	[8, 2],
	[8, 4],
	[0, 2],
	[1, 3],
	[0, 4]
]

// A list of dens.
den = [
	[0, 3],
	[8, 3]
]

// A list of water jumps.
validMoveWater = {
	"2_1": [new WaterJump("6_1", ["3_1", "4_1", "5_1"])],
	"2_2": [new WaterJump("6_2", ["3_2", "4_2", "5_2"])],
	"3_0": [new WaterJump("3_3", ["3_1", "3_2"])],
	"4_0": [new WaterJump("4_3", ["4_1", "4_2"])],
	"5_0": [new WaterJump("5_3", ["5_1", "5_2"])],
	"6_1": [new WaterJump("2_1", ["5_1", "4_1", "3_1"])],
	"6_2": [new WaterJump("2_2", ["5_2", "4_2", "3_2"])],
	"3_3": [new WaterJump("3_0", ["3_2", "3_1"]), new WaterJump("3_6", ["3_4", "3_5"])],
	"4_3": [new WaterJump("4_0", ["4_2", "4_1"]), new WaterJump("4_6", ["4_4", "4_5"])],
	"5_3": [new WaterJump("5_0", ["5_2", "5_1"]), new WaterJump("5_6", ["5_4", "5_5"])],
	"2_4": [new WaterJump("6_4", ["3_4", "4_4", "5_4"])],
	"2_5": [new WaterJump("6_5", ["3_5", "4_5", "5_5"])],
	"3_6": [new WaterJump("3_3", ["3_5", "3_4"])],
	"4_6": [new WaterJump("4_3", ["4_5", "4_4"])],
	"5_6": [new WaterJump("5_3", ["5_5", "5_4"])],
	"6_4": [new WaterJump("2_4", ["5_4", "4_4", "3_4"])],
	"6_5": [new WaterJump("2_5", ["5_5", "4_5", "3_5"])]
}
