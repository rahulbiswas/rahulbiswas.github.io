// Constants for click areas
const HOME_LOCAL_X_START = 4;
const HOME_LOCAL_X_END = 37;
const HOME_LOCAL_Y_START = 13;
const HOME_LOCAL_Y_END = 29;
const HOME_RULES_X_START = 62;
const HOME_RULES_X_END = 95;
const HOME_RULES_Y_START = 23;
const HOME_RULES_Y_END = 38;
const BACK_X_START = 3;
const BACK_X_END = 20;
const BACK_Y_START = 2;
const BACK_Y_END = 13;
const NEXT_X_START = 80;
const NEXT_X_END = 100;
const NEXT_Y_START = 0;
const NEXT_Y_END = 10;

// Board layout constants
const BOARD_UPPER_LEFT_X = 20.7;
const BOARD_UPPER_LEFT_Y = 3;
const BOARD_SQUARE_WIDTH = 8.6;
const BOARD_SQUARE_HEIGHT = 6.82;

const ruleScreens = [
    'agilityrules',
    'eatinganimals',
    'howtowin',
    'jumpingoverwater',
    'ratsarespecial',
    'traps'
];

// Initial piece setup
const initialPieces = {
    "0_0": { "player": 0, "animal": 7 }, // Lion
    "6_0": { "player": 0, "animal": 6 }, // Tiger
    "1_1": { "player": 0, "animal": 4 },
    "5_1": { "player": 0, "animal": 2 },
    "0_2": { "player": 0, "animal": 1 }, // Rat
    "2_2": { "player": 0, "animal": 5 },
    "4_2": { "player": 0, "animal": 3 },
    "6_2": { "player": 0, "animal": 8 }, // Elephant
    "6_8": { "player": 1, "animal": 7 },
    "0_8": { "player": 1, "animal": 6 },
    "5_7": { "player": 1, "animal": 4 },
    "1_7": { "player": 1, "animal": 2 },
    "6_6": { "player": 1, "animal": 1 },
    "4_6": { "player": 1, "animal": 5 },
    "2_6": { "player": 1, "animal": 3 },
    "0_6": { "player": 1, "animal": 8 }
};

window.JungleGame = function JungleGame() {
    const [currentWindow, setCurrentWindow] = React.useState('home');
    const [pieces, setPieces] = React.useState(initialPieces);
    const [turn, setTurn] = React.useState(1);
    const [isFirstClick, setIsFirstClick] = React.useState(true);
    const [firstClickKey, setFirstClickKey] = React.useState(null);
    const [movedPiece, setMovedPiece] = React.useState(['0']);
    const contentRef = React.useRef(null);

    const getClickKey = (clickX, clickY) => {
        const row = Math.floor((clickX - BOARD_UPPER_LEFT_X) / BOARD_SQUARE_WIDTH);
        const column = Math.floor((clickY - BOARD_UPPER_LEFT_Y) / BOARD_SQUARE_HEIGHT);
        return `${row}_${column}`;
    };

    const handleMove = (firstKey, secondKey) => {
        const movingPiece = pieces[firstKey];
        setMovedPiece([firstKey.split('_'), secondKey.split('_')]);
        setPieces(prev => {
            const newPieces = { ...prev };
            delete newPieces[firstKey];
            newPieces[secondKey] = movingPiece;
            return newPieces;
        });
        setIsFirstClick(true);
        setTurn(prev => 1 - prev);
    };

    const handleGameClick = (clickX, clickY) => {
        // Back button
        if (clickX < BOARD_UPPER_LEFT_X && clickY < 13) {
            setCurrentWindow('home');
            setPieces(initialPieces);
            setTurn(1);
            setIsFirstClick(true);
            setFirstClickKey(null);
            setMovedPiece(['0']);
            return;
        }

        const clickKey = getClickKey(clickX, clickY);

        if (isFirstClick) {
            if (!pieces[clickKey]) return;
            const player = pieces[clickKey].player;
            if (player !== turn) return;
            setFirstClickKey(clickKey);
            setIsFirstClick(false);
        } else {
            if (firstClickKey === clickKey) {
                setIsFirstClick(true);
                return;
            }
            handleMove(firstClickKey, clickKey);
        }
    };

    const handleClick = (e) => {
        if (!contentRef.current) return;

        const rect = contentRef.current.getBoundingClientRect();
        const clickX = (e.clientX - rect.left) * 100 / rect.width;
        const clickY = (e.clientY - rect.top) * 67 / rect.height;

        console.log('Click coordinates:', clickX, clickY);

        if (currentWindow === 'home') {
            if (clickX > HOME_LOCAL_X_START &&
                clickX < HOME_LOCAL_X_END &&
                clickY > HOME_LOCAL_Y_START &&
                clickY < HOME_LOCAL_Y_END) {
                setCurrentWindow('game');
            }
            else if (clickX > HOME_RULES_X_START &&
                clickX < HOME_RULES_X_END &&
                clickY > HOME_RULES_Y_START &&
                clickY < HOME_RULES_Y_END) {
                setCurrentWindow('agilityrules');
            }
        }
        else if (ruleScreens.includes(currentWindow)) {
            // Back button
            if (clickX > BACK_X_START &&
                clickX < BACK_X_END &&
                clickY > BACK_Y_START &&
                clickY < BACK_Y_END) {
                setCurrentWindow('home');
            }
            // Next button
            else if (currentWindow !== 'traps' &&
                clickX > NEXT_X_START &&
                clickX < NEXT_X_END &&
                clickY > NEXT_Y_START &&
                clickY < NEXT_Y_END) {
                const currentIndex = ruleScreens.indexOf(currentWindow);
                setCurrentWindow(ruleScreens[currentIndex + 1]);
            }
        }
        else if (currentWindow === 'game') {
            handleGameClick(clickX, clickY);
        }
    };

    return (
        <div className="game-container">
            <div
                ref={contentRef}
                className="game-content"
                onClick={handleClick}
            >
                {currentWindow === 'home' && <HomeMenu />}
                {ruleScreens.includes(currentWindow) && (
                    <img
                        src={`images/${currentWindow}.png`}
                        alt={`${currentWindow} rules`}
                    />
                )}
                {currentWindow === 'game' && (
                    <GameBoard
                        turn={turn}
                        pieces={pieces}
                        movedPiece={movedPiece}
                    />
                )}
            </div>
        </div>
    );
};