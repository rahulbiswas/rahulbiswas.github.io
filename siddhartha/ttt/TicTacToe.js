const TicTacToe = () => {
    const [board, setBoard] = React.useState(Array(9).fill(null));
    const [isXNext, setIsXNext] = React.useState(true);

    const calculateWinner = (squares) => {
        const lines = [
            [0, 1, 2], // h0
            [3, 4, 5], // h1
            [6, 7, 8], // h2
            [0, 3, 6], // v0
            [1, 4, 7], // v1
            [2, 5, 8], // v2
            [0, 4, 8], // d0
            [2, 4, 6]  // d1
        ];

        for (let i = 0; i < lines.length; i++) {
            const [a, b, c] = lines[i];
            if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
                return { winner: squares[a], line: i };
            }
        }
        return null;
    };

    const winner = calculateWinner(board);
    const isDraw = !winner && board.every(square => square !== null);

    const handleClick = (index) => {
        if (board[index] || winner) return;

        const newBoard = [...board];
        newBoard[index] = isXNext ? 'X' : 'O';
        setBoard(newBoard);
        setIsXNext(!isXNext);
    };

    const resetGame = () => {
        setBoard(Array(9).fill(null));
        setIsXNext(true);
    };

    const renderSquare = (index) => {
        const value = board[index];
        const squareClass = `square ${value === 'X' ? 'x-mark' : value === 'O' ? 'o-mark' : ''}`;

        return (
            <button
                className={squareClass}
                onClick={() => handleClick(index)}
                disabled={board[index] || winner}
                aria-label={`Square ${index + 1}${value ? ` marked with ${value}` : ''}`}
            >
                {value}
            </button>
        );
    };

    const getStatus = () => {
        if (winner) return `Winner: ${winner.winner}!`;
        if (isDraw) return "It's a draw!";
        return `Next player: ${isXNext ? 'X' : 'O'}`;
    };

    const getLineClass = () => {
        if (!winner) return null;
        const lineTypes = ['h0', 'h1', 'h2', 'v0', 'v1', 'v2', 'd0', 'd1'];
        return `winning-line ${lineTypes[winner.line]}`;
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="game-container">
                <div className="status-text">
                    {getStatus()}
                </div>

                <div className="game-grid">
                    {Array(9).fill(null).map((_, index) => (
                        <div key={index}>
                            {renderSquare(index)}
                        </div>
                    ))}
                    {winner && <div className={getLineClass()}></div>}
                </div>

                <button
                    onClick={resetGame}
                    className="reset-button"
                >
                    Reset Game
                </button>
            </div>
        </div>
    );
};