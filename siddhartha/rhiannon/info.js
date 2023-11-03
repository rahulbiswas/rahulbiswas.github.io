// The initial setup of the pieces.
// Dictionary entries are of the form:
// position : { "player" : which_player, "animal": animal_number }

test_only_piece_setup = {

    addPiece(pieces, Animal.BLUE_PLAYER, Animal.WOLF, "1_2");
    addPiece(pieces, Animal.RED_PLAYER, Animal.ELEPHANT, "1_1");
    addPiece(pieces, Animal.RED_PLAYER, Animal.CAT, "2_1");
    addPiece(pieces, Animal.BLUE_PLAYER, Animal.RAT, "0_1");


	"1_2": {
		"player": 0,
		"animal": 3
	},
	"1_1": {
		"player": 1,
		"animal": 8
	},
	"2_1": {
		"player": 1,
		"animal": 2,
	},
	"0_1": {
		"player": 0,
		"animal": 1
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

// A list of dens.
den = [
	[0, 3],
	[8, 3]
]
