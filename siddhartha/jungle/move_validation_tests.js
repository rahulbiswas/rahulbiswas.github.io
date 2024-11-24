const moveScenarios = [
    {
        description: "should allow normal one-square vertical move",
        board: {
            '0_0': { player: PLAYERS.RED, animal: PIECES.RAT }
        },
        startPos: '0_0',
        endPos: '0_1',
        currentPlayer: PLAYERS.RED,
        expectedValid: true
    },
    {
        description: "should allow normal one-square horizontal move",
        board: {
            '0_0': { player: PLAYERS.RED, animal: PIECES.RAT }
        },
        startPos: '0_0',
        endPos: '1_0',
        currentPlayer: PLAYERS.RED,
        expectedValid: true
    },
    {
        description: "should reject diagonal moves",
        board: {
            '0_0': { player: PLAYERS.RED, animal: PIECES.RAT }
        },
        startPos: '0_0',
        endPos: '1_1',
        currentPlayer: PLAYERS.RED,
        expectedValid: false
    },
    {
        description: "should reject moves to negative x",
        board: {
            '0_0': { player: PLAYERS.RED, animal: PIECES.RAT }
        },
        startPos: '0_0',
        endPos: '-1_0',
        currentPlayer: PLAYERS.RED,
        expectedValid: false
    },
    {
        description: "should reject moves beyond board width",
        board: {
            '6_0': { player: PLAYERS.RED, animal: PIECES.RAT }
        },
        startPos: '6_0',
        endPos: '7_0',
        currentPlayer: PLAYERS.RED,
        expectedValid: false
    },
    {
        description: "should allow capturing weaker opponent piece",
        board: {
            '0_0': { player: PLAYERS.RED, animal: PIECES.TIGER },
            '0_1': { player: PLAYERS.YELLOW, animal: PIECES.RAT }
        },
        startPos: '0_0',
        endPos: '0_1',
        currentPlayer: PLAYERS.RED,
        expectedValid: true
    },
    {
        description: "should reject capturing stronger opponent piece",
        board: {
            '0_0': { player: PLAYERS.RED, animal: PIECES.RAT },
            '0_1': { player: PLAYERS.YELLOW, animal: PIECES.ELEPHANT }
        },
        startPos: '0_0',
        endPos: '0_1',
        currentPlayer: PLAYERS.RED,
        expectedValid: false
    },
    {
        description: "should reject red piece entering red den",
        board: {
            '3_7': { player: PLAYERS.RED, animal: PIECES.RAT }
        },
        startPos: '3_7',
        endPos: '3_8',
        currentPlayer: PLAYERS.RED,
        expectedValid: false
    },
    {
        description: "should allow red piece entering yellow den",
        board: {
            '3_1': { player: PLAYERS.RED, animal: PIECES.RAT }
        },
        startPos: '3_1',
        endPos: '3_0',
        currentPlayer: PLAYERS.RED,
        expectedValid: true
    },
    {
        description: "should reject move of piece when not player's turn",
        board: {
            '0_0': { player: PLAYERS.RED, animal: PIECES.RAT }
        },
        startPos: '0_0',
        endPos: '0_1',
        currentPlayer: PLAYERS.YELLOW,
        expectedValid: false
    }
];

describe('Move Validation', function() {
    moveScenarios.forEach(scenario => {
        it(scenario.description, scenario);
    });
});