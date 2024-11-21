const TicTacToe = () => {
    const [board, setBoard] = React.useState(Array(9).fill(null));
    const [isHumanNext, setIsHumanNext] = React.useState(true);

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

    // Minimax algorithm with alpha-beta pruning
    const minimax = (board, depth, isMaximizing, alpha = -Infinity, beta = Infinity) => {
        const winner = calculateWinner(board);
        if (winner) return winner.winner === 'O' ? 10 - depth : depth - 10;
        if (!board.includes(null)) return 0;

        if (isMaximizing) {
            let bestScore = -Infinity;
            for (let i = 0; i < board.length; i++) {
                if (!board[i]) {
                    board[i] = 'O';
                    const score = minimax(board, depth + 1, false, alpha, beta);
                    board[i] = null;
                    bestScore = Math.max(score, bestScore);
                    alpha = Math.max(alpha, bestScore);
                    if (beta <= alpha) break;
                }
            }
            return bestScore;
        } else {
            let bestScore = Infinity;
            for (let i = 0; i < board.length; i++) {
                if (!board[i]) {
                    board[i] = 'X';
                    const score = minimax(board, depth + 1, true, alpha, beta);
                    board[i] = null;
                    bestScore = Math.min(score, bestScore);
                    beta = Math.min(beta, bestScore);
                    if (beta <= alpha) break;
                }
            }
            return bestScore;
        }
    };

    const findBestMove = (board) => {
        let bestScore = -Infinity;
        let bestMove = null;

        for (let i = 0; i < board.length; i++) {
            if (!board[i]) {
                board[i] = 'O';
                const score = minimax(board, 0, false);
                board[i] = null;
                if (score > bestScore) {
                    bestScore = score;
                    bestMove = i;
                }
            }
        }
        return bestMove;
    };

    const winner = calculateWinner(board);
    const isDraw = !winner && board.every(square => square !== null);

    const handleClick = (index) => {
        if (board[index] || winner || !isHumanNext) return;

        const newBoard = [...board];
        newBoard[index] = 'X';
        setBoard(newBoard);
        setIsHumanNext(false);

        // AI's turn
        setTimeout(() => {
            if (!calculateWinner(newBoard) && !newBoard.every(square => square !== null)) {
                const aiMove = findBestMove(newBoard);
                if (aiMove !== null) {
                    newBoard[aiMove] = 'O';
                    setBoard(newBoard);
                    setIsHumanNext(true);
                }
            }
        }, 500); // Add delay for better UX
    };

    const resetGame = () => {
        setBoard(Array(9).fill(null));
        setIsHumanNext(true);
    };

    const renderSquare = (index) => {
        const value = board[index];
        const squareClass = `square ${value === 'X' ? 'x-mark' : value === 'O' ? 'o-mark' : ''}`;

        return (
            <button
                className={squareClass}
                onClick={() => handleClick(index)}
                disabled={board[index] || winner || !isHumanNext}
            />
        );
    };

    const getStatus = () => {
        if (winner) {
            const winnerMessages = [
                `${winner.winner === 'X' ? 'Neo' : 'Agent Smith'} has altered the Matrix!`,
                `${winner.winner === 'X' ? 'The One' : 'The System'} proves prophecy true!`,
                `${winner.winner === 'X' ? 'Humanity' : 'The Machines'} controls the code now!`,
                `${winner.winner === 'X' ? 'Zion' : 'The Matrix'} claims victory!`,
                `${winner.winner === 'X' ? 'The Oracle foresaw' : 'The Architect designed'} this victory!`
            ];
            return winnerMessages[Math.floor(Math.random() * winnerMessages.length)];
        }
        if (isDraw) {
            const drawMessages = [
                "A glitch in the Matrix creates perfect balance",
                "The System and Reality reach equilibrium",
                "Neither the red nor blue pill prevails",
                "The Oracle predicted this stalemate",
                "Balance maintained in the Matrix"
            ];
            return drawMessages[Math.floor(Math.random() * drawMessages.length)];
        }
        const nextPlayerMessages = [
            `${isHumanNext ? 'Neo, make' : 'Agent Smith executes'} your next move`,
            `${isHumanNext ? 'Free your mind with' : 'The System processes'} the next choice`,
            `${isHumanNext ? 'Humanity' : 'The Machine'} must choose wisely`,
            `${isHumanNext ? 'The One' : 'The Program'} must continue the sequence`,
            `${isHumanNext ? 'Break free' : 'Execute protocol'} with your next move`
        ];
        return nextPlayerMessages[Math.floor(Math.random() * nextPlayerMessages.length)];
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
                    <div className="game-grid-2">
                        {Array(9).fill(null).map((_, index) => (
                            <div key={index}>
                                {renderSquare(index)}
                            </div>
                        ))}
                        {winner && <div className={getLineClass()}></div>}
                    </div>
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