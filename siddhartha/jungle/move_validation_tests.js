describe('Basic Move Validation', function() {
    const emptyPieces = {};
    const simplePieces = {
        '0_0': {'player': PLAYERS.RED, 'animal': PIECES.RAT},
        '1_1': {'player': PLAYERS.YELLOW, 'animal': PIECES.CAT}
    };

    it('should reject moves outside left board boundary', 
        {
            moving: 'Red Rat',
            from: {x: -1, y: 0},
            to: {x: 0, y: 0},
            otherPieces: 'none'
        },
        function() {
            const result = isBasicMoveValid(-1, 0, 0, 0, emptyPieces, {'player': PLAYERS.RED, 'animal': PIECES.RAT});
            assert(!result.isValid);
        }
    );

    it('should reject moves outside right board boundary',
        {
            moving: 'Red Rat',
            from: {x: 7, y: 0},
            to: {x: 0, y: 0},
            otherPieces: 'none'
        },
        function() {
            const result = isBasicMoveValid(7, 0, 0, 0, emptyPieces, {'player': PLAYERS.RED, 'animal': PIECES.RAT});
            assert(!result.isValid);
        }
    );

    it('should reject moves outside top board boundary',
        {
            moving: 'Red Rat',
            from: {x: 0, y: -1},
            to: {x: 0, y: 0},
            otherPieces: 'none'
        },
        function() {
            const result = isBasicMoveValid(0, -1, 0, 0, emptyPieces, {'player': PLAYERS.RED, 'animal': PIECES.RAT});
            assert(!result.isValid);
        }
    );

    it('should reject moves outside bottom board boundary',
        {
            moving: 'Red Rat',
            from: {x: 0, y: 9},
            to: {x: 0, y: 0},
            otherPieces: 'none'
        },
        function() {
            const result = isBasicMoveValid(0, 9, 0, 0, emptyPieces, {'player': PLAYERS.RED, 'animal': PIECES.RAT});
            assert(!result.isValid);
        }
    );

    it('should allow moves to empty squares',
        {
            moving: 'Red Rat',
            from: {x: 0, y: 0},
            to: {x: 1, y: 0},
            otherPieces: 'none'
        },
        function() {
            const result = isBasicMoveValid(0, 0, 1, 0, emptyPieces, {'player': PLAYERS.RED, 'animal': PIECES.RAT});
            assert(result.isValid);
        }
    );

    it('should reject moves to squares occupied by same player',
        {
            moving: 'Red Rat',
            from: {x: 0, y: 0},
            to: {x: 1, y: 0},
            otherPieces: 'Red Cat at (1,0)'
        },
        function() {
            const pieces = {
                '1_0': {'player': PLAYERS.RED, 'animal': PIECES.CAT}
            };
            const result = isBasicMoveValid(0, 0, 1, 0, pieces, {'player': PLAYERS.RED, 'animal': PIECES.RAT});
            assert(!result.isValid);
        }
    );

    it('should allow moves to squares occupied by opponent',
        {
            moving: 'Red Rat',
            from: {x: 0, y: 0},
            to: {x: 1, y: 1},
            otherPieces: 'Yellow Cat at (1,1)'
        },
        function() {
            const result = isBasicMoveValid(0, 0, 1, 1, simplePieces, {'player': PLAYERS.RED, 'animal': PIECES.RAT});
            assert(result.isValid);
        }
    );
});

describe('Den Entry Rules', function() {
    const emptyPieces = {};

    it('should reject red piece entering red den',
        {
            moving: 'Red Rat',
            from: {x: 0, y: 0},
            to: {x: 3, y: 8},
            otherPieces: 'none'
        },
        function() {
            const result = isBasicMoveValid(0, 0, DENS.RED.X, DENS.RED.Y, emptyPieces, {'player': PLAYERS.RED, 'animal': PIECES.RAT});
            assert(!result.isValid);
        }
    );

    it('should reject yellow piece entering yellow den',
        {
            moving: 'Yellow Rat',
            from: {x: 0, y: 0},
            to: {x: 3, y: 0},
            otherPieces: 'none'
        },
        function() {
            const result = isBasicMoveValid(0, 0, DENS.YELLOW.X, DENS.YELLOW.Y, emptyPieces, {'player': PLAYERS.YELLOW, 'animal': PIECES.RAT});
            assert(!result.isValid);
        }
    );

    it('should allow red piece entering yellow den',
        {
            moving: 'Red Rat',
            from: {x: 2, y: 0},
            to: {x: 3, y: 0},
            otherPieces: 'none'
        },
        function() {
            const result = isBasicMoveValid(2, 0, DENS.YELLOW.X, DENS.YELLOW.Y, emptyPieces, {'player': PLAYERS.RED, 'animal': PIECES.RAT});
            assert(result.isValid);
        }
    );

    it('should allow yellow piece entering red den',
        {
            moving: 'Yellow Rat',
            from: {x: 2, y: 8},
            to: {x: 3, y: 8},
            otherPieces: 'none'
        },
        function() {
            const result = isBasicMoveValid(2, 8, DENS.RED.X, DENS.RED.Y, emptyPieces, {'player': PLAYERS.YELLOW, 'animal': PIECES.RAT});
            assert(result.isValid);
        }
    );
});

describe('Full Move Validation', function() {
    const emptyPieces = {};

    it('should allow normal one-square moves',
        {
            moving: 'Red Rat',
            from: {x: 0, y: 0},
            to: {x: 0, y: 1},
            otherPieces: 'none'
        },
        function() {
            const valid = isValidMove(0, 0, 0, 1, emptyPieces, {'player': PLAYERS.RED, 'animal': PIECES.RAT});
            assert(valid);
        }
    );

    it('should reject diagonal moves',
        {
            moving: 'Red Rat',
            from: {x: 0, y: 0},
            to: {x: 1, y: 1},
            otherPieces: 'none'
        },
        function() {
            const valid = isValidMove(0, 0, 1, 1, emptyPieces, {'player': PLAYERS.RED, 'animal': PIECES.RAT});
            assert(!valid);
        }
    );

    it('should reject moves greater than one square for normal pieces',
        {
            moving: 'Red Rat',
            from: {x: 0, y: 0},
            to: {x: 0, y: 2},
            otherPieces: 'none'
        },
        function() {
            const valid = isValidMove(0, 0, 0, 2, emptyPieces, {'player': PLAYERS.RED, 'animal': PIECES.RAT});
            assert(!valid);
        }
    );
});