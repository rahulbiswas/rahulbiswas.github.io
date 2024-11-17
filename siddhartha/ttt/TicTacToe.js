const TicTacToe = () => {
    const [board, setBoard] = React.useState(Array(9).fill(null));
    const [isXNext, setIsXNext] = React.useState(true);

    const calculateWinner = (squares) => {
        const lines = [
            [0, 1, 2], // horizontal
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6], // vertical
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8], // diagonal
            [2, 4, 6]
        ];

        for (const [a, b, c] of lines) {
            if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
                return { winner: squares[a], line: [a, b, c] };
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
        const isWinningSquare = winner && winner.line && winner.line.includes(index);
        const value = board[index];
        const squareClass = 'square ' + 
            (isWinningSquare ? 'winning ' : '') + 
            (value === 'X' ? 'x-mark' : value === 'O' ? 'o-mark' : '');

        return (
            <button
                className={squareClass.trim()}
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

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="game-container">
                <div className="text-xl font-semibold text-center text-gray-800 mb-4">
                    {getStatus()}
                </div>
                
                <div className="game-grid mb-4">
                    {Array(9).fill(null).map((_, index) => (
                        <div key={index}>
                            {renderSquare(index)}
                        </div>
                    ))}
                </div>

                <button
                    onClick={resetGame}
                    className="reset-button w-full"
                >
                    Reset Game
                </button>
            </div>
        </div>
    );
};