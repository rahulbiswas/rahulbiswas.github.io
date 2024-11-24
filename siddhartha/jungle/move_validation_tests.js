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

const additionalMoveScenarios = [
    {
        description: "should allow rat to enter water",
        board: {
            '0_2': { player: PLAYERS.RED, animal: PIECES.RAT }
        },
        startPos: '0_2',
        endPos: '1_3',
        currentPlayer: PLAYERS.RED,
        expectedValid: true
    },
    {
        description: "should allow rat to move within water",
        board: {
            '1_3': { player: PLAYERS.RED, animal: PIECES.RAT }
        },
        startPos: '1_3',
        endPos: '2_3',
        currentPlayer: PLAYERS.RED,
        expectedValid: true
    },
    {
        description: "should allow rat to exit water",
        board: {
            '1_3': { player: PLAYERS.RED, animal: PIECES.RAT }
        },
        startPos: '1_3',
        endPos: '1_2',
        currentPlayer: PLAYERS.RED,
        expectedValid: true
    },
    {
        description: "should prevent elephant from entering water",
        board: {
            '0_2': { player: PLAYERS.RED, animal: PIECES.ELEPHANT }
        },
        startPos: '0_2',
        endPos: '1_3',
        currentPlayer: PLAYERS.RED,
        expectedValid: false
    },
    {
        description: "should allow lion to jump across water horizontally",
        board: {
            '0_3': { player: PLAYERS.RED, animal: PIECES.LION }
        },
        startPos: '0_3',
        endPos: '3_3',
        currentPlayer: PLAYERS.RED,
        expectedValid: true
    },
    {
        description: "should allow tiger to jump across water vertically",
        board: {
            '1_2': { player: PLAYERS.RED, animal: PIECES.TIGER }
        },
        startPos: '1_2',
        endPos: '1_6',
        currentPlayer: PLAYERS.RED,
        expectedValid: true
    },
    {
        description: "should prevent lion jump when rat is in water path",
        board: {
            '0_3': { player: PLAYERS.RED, animal: PIECES.LION },
            '1_3': { player: PLAYERS.YELLOW, animal: PIECES.RAT }
        },
        startPos: '0_3',
        endPos: '3_3',
        currentPlayer: PLAYERS.RED,
        expectedValid: false
    },
    {
        description: "should allow capturing stronger piece in opponent's trap",
        board: {
            '2_7': { player: PLAYERS.YELLOW, animal: PIECES.ELEPHANT },
            '2_6': { player: PLAYERS.RED, animal: PIECES.RAT }
        },
        startPos: '2_6',
        endPos: '2_7',
        currentPlayer: PLAYERS.RED,
        expectedValid: true
    },
    {
        description: "should prevent capturing piece in own trap",
        board: {
            '2_0': { player: PLAYERS.YELLOW, animal: PIECES.RAT },
            '2_1': { player: PLAYERS.RED, animal: PIECES.ELEPHANT }
        },
        startPos: '2_1',
        endPos: '2_0',
        currentPlayer: PLAYERS.RED,
        expectedValid: false
    },
    {
        description: "should allow rat to capture elephant from land",
        board: {
            '0_2': { player: PLAYERS.RED, animal: PIECES.RAT },
            '0_3': { player: PLAYERS.YELLOW, animal: PIECES.ELEPHANT }
        },
        startPos: '0_2',
        endPos: '0_3',
        currentPlayer: PLAYERS.RED,
        expectedValid: true
    },
    {
        description: "should prevent rat from capturing elephant while in water",
        board: {
            '1_3': { player: PLAYERS.RED, animal: PIECES.RAT },
            '1_4': { player: PLAYERS.YELLOW, animal: PIECES.ELEPHANT }
        },
        startPos: '1_3',
        endPos: '1_4',
        currentPlayer: PLAYERS.RED,
        expectedValid: false
    },
    {
        description: "should allow equal rank captures",
        board: {
            '0_0': { player: PLAYERS.RED, animal: PIECES.DOG },
            '0_1': { player: PLAYERS.YELLOW, animal: PIECES.DOG }
        },
        startPos: '0_0',
        endPos: '0_1',
        currentPlayer: PLAYERS.RED,
        expectedValid: true
    },
    {
        description: "should allow rat to capture opponent rat in water",
        board: {
            '1_3': { player: PLAYERS.RED, animal: PIECES.RAT },
            '1_4': { player: PLAYERS.YELLOW, animal: PIECES.RAT }
        },
        startPos: '1_3',
        endPos: '1_4',
        currentPlayer: PLAYERS.RED,
        expectedValid: true
    },
    {
        description: "should prevent rat in water from capturing land piece",
        board: {
            '1_3': { player: PLAYERS.RED, animal: PIECES.RAT },
            '1_2': { player: PLAYERS.YELLOW, animal: PIECES.CAT }
        },
        startPos: '1_3',
        endPos: '1_2',
        currentPlayer: PLAYERS.RED,
        expectedValid: false
    },
    {
        description: "should prevent jumping if not lion/tiger",
        board: {
            '0_3': { player: PLAYERS.RED, animal: PIECES.ELEPHANT }
        },
        startPos: '0_3',
        endPos: '3_3',
        currentPlayer: PLAYERS.RED,
        expectedValid: false
    },
    {
        description: "should prevent diagonal water jumps for lion/tiger",
        board: {
            '0_2': { player: PLAYERS.RED, animal: PIECES.LION }
        },
        startPos: '0_2',
        endPos: '2_4',
        currentPlayer: PLAYERS.RED,
        expectedValid: false
    },
    {
        description: "should prevent moves that leave own den exposed",
        board: {
            '3_8': { player: PLAYERS.RED, animal: PIECES.ELEPHANT },
            '3_7': { player: PLAYERS.YELLOW, animal: PIECES.TIGER }
        },
        startPos: '3_8',
        endPos: '4_8',
        currentPlayer: PLAYERS.RED,
        expectedValid: false
    }
];

const allMoveScenarios = [...moveScenarios, ...additionalMoveScenarios];

describe('Move Validation', function() {
    allMoveScenarios.forEach(scenario => {
        it(scenario.description, scenario);
    });
});