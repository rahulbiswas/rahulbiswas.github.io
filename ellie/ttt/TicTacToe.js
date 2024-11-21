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

    // Simplified AI that makes some intentional mistakes
    const findKidFriendlyMove = (board) => {
        // First, check if AI can win immediately
        const possibleMoves = [];
        const goodMoves = [];
        const okayMoves = [];

        // Collect all possible moves
        board.forEach((square, index) => {
            if (!square) {
                possibleMoves.push(index);
            }
        });

        // Randomly decide to make a suboptimal move (70% chance)
        if (Math.random() < 0.7) {
            // Just pick a random available spot
            return possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
        }

        // For the other 30%, try to play somewhat strategically
        // Check each possible move
        for (let i of possibleMoves) {
            const testBoard = [...board];
            testBoard[i] = 'O';
            
            // If this move would win, it's a good move
            if (calculateWinner(testBoard)) {
                goodMoves.push(i);
            } else {
                // Check if this prevents an immediate player win
                let isBlocking = false;
                const playerTestBoard = [...board];
                playerTestBoard[i] = 'X';
                if (calculateWinner(playerTestBoard)) {
                    isBlocking = true;
                }
                
                if (isBlocking) {
                    okayMoves.push(i);
                }
            }
        }

        // If there's a winning move, take it sometimes (50% chance)
        if (goodMoves.length > 0 && Math.random() < 0.5) {
            return goodMoves[Math.floor(Math.random() * goodMoves.length)];
        }
        
        // If there's a blocking move, take it sometimes (30% chance)
        if (okayMoves.length > 0 && Math.random() < 0.3) {
            return okayMoves[Math.floor(Math.random() * okayMoves.length)];
        }

        // Otherwise, just pick a random available spot
        return possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
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
                const aiMove = findKidFriendlyMove(newBoard);
                if (aiMove !== null) {
                    newBoard[aiMove] = 'O';
                    setBoard(newBoard);
                    setIsHumanNext(true);
                }
            }
        }, 500);
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
                aria-label={`Square ${index + 1}${value ? ` marked with ${value}` : ''}`}
            />
        );
    };

    const getStatus = () => {
        if (winner) {
            const winnerMessages = [
                `${winner.winner === 'X' ? 'You win!' : 'Good try!'} Want to play again?`,
                `${winner.winner === 'X' ? 'Amazing job!' : 'Almost got it!'} Let's play more!`,
                `${winner.winner === 'X' ? 'You did it!' : 'So close!'} Another round?`,
                `${winner.winner === 'X' ? 'Super win!' : 'Nice try!'} Once more?`,
                `${winner.winner === 'X' ? 'Wonderful!' : 'Keep trying!'} Play again?`
            ];
            return winnerMessages[Math.floor(Math.random() * winnerMessages.length)];
        }
        if (isDraw) {
            return "It's a tie! Want to try again?";
        }
        return isHumanNext ? "Your turn! Where do you want to go?" : "Thinking...";
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
                    Play Again
                </button>
            </div>
        </div>
    );
};

// export default TicTacToe;