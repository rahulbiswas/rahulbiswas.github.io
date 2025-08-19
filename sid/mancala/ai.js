document.addEventListener('DOMContentLoaded', () => {
    window.mancalaAI = {
        findBestMove: (board) => {
            console.log("AI is thinking (optimized)...");
            const depth = 3; // REDUCED from 5 to 3 for speed
            let bestScore = -Infinity;
            let bestMove = -1;
            const validMoves = getValidMoves(board, 1); // AI is player 1 (0-indexed)

            if (validMoves.length === 0) return -1;

            let alpha = -Infinity;
            let beta = Infinity;

            for (const move of validMoves) {
                let tempBoard = [...board];
                let score = minimax(simulateMove(tempBoard, move, 1), depth - 1, alpha, beta, false);
                if (score > bestScore) {
                    bestScore = score;
                    bestMove = move;
                }
                alpha = Math.max(alpha, bestScore); // Update alpha for the root
            }
            console.log(`AI chose move: ${bestMove} with score: ${bestScore}`);
            return bestMove;
        }
    };

    const PIT_COUNT = 6;
    const P1_MANCALA = 6;
    const P2_MANCALA = 13;

    // OPTIMIZED with Alpha-Beta Pruning
    function minimax(board, depth, alpha, beta, isMaximizing) {
        if (depth === 0 || isGameOver(board)) {
            return evaluate(board);
        }

        if (isMaximizing) {
            let maxEval = -Infinity;
            const moves = getValidMoves(board, 1);
            for (const move of moves) {
                let tempBoard = [...board];
                let newBoard = simulateMove(tempBoard, move, 1);
                let score = minimax(newBoard, depth - 1, alpha, beta, false);
                maxEval = Math.max(maxEval, score);
                alpha = Math.max(alpha, score);
                if (beta <= alpha) {
                    break; // Prune
                }
            }
            return maxEval;
        } else { // Minimizing player (human)
            let minEval = Infinity;
            const moves = getValidMoves(board, 0);
            for (const move of moves) {
                let tempBoard = [...board];
                let newBoard = simulateMove(tempBoard, move, 0);
                let score = minimax(newBoard, depth - 1, alpha, beta, true);
                minEval = Math.min(minEval, score);
                beta = Math.min(beta, score);
                if (beta <= alpha) {
                    break; // Prune
                }
            }
            return minEval;
        }
    }

    function evaluate(board) {
        // More advanced evaluation: consider stones in stores and on the board
        const aiScore = board[P2_MANCALA];
        const playerScore = board[P1_MANCALA];
        
        let aiStonesOnBoard = 0;
        for (let i = P1_MANCALA + 1; i < P2_MANCALA; i++) aiStonesOnBoard += board[i];

        let playerStonesOnBoard = 0;
        for (let i = 0; i < P1_MANCALA; i++) playerStonesOnBoard += board[i];

        // A higher score is better for the AI
        return (aiScore - playerScore) + (aiStonesOnBoard - playerStonesOnBoard) * 0.5;
    }

    function getValidMoves(board, player) {
        const moves = [];
        const start = player === 0 ? 0 : P1_MANCALA + 1;
        const end = player === 0 ? P1_MANCALA : P2_MANCALA;
        for (let i = start; i < end; i++) {
            if (board[i] > 0) {
                moves.push(i);
            }
        }
        return moves;
    }

    function isGameOver(board) {
        let p1Sum = 0;
        for (let i = 0; i < P1_MANCALA; i++) p1Sum += board[i];
        if (p1Sum === 0) return true;

        let p2Sum = 0;
        for (let i = P1_MANCALA + 1; i < P2_MANCALA; i++) p2Sum += board[i];
        if (p2Sum === 0) return true;

        return false;
    }

    function simulateMove(board, pitIndex, player) {
        // This is a critical function for the AI, ensure it's fast
        let stones = board[pitIndex];
        board[pitIndex] = 0;
        let currentPit = pitIndex;

        while (stones > 0) {
            currentPit = (currentPit + 1) % board.length;
            if ((player === 0 && currentPit === P2_MANCALA) || (player === 1 && currentPit === P1_MANCALA)) {
                continue;
            }
            board[currentPit]++;
            stones--;
        }

        const lastStoneOnOwnSide = (player === 0 && currentPit < P1_MANCALA) || (player === 1 && currentPit > P1_MANCALA && currentPit < P2_MANCALA);
        if (lastStoneOnOwnSide && board[currentPit] === 1) {
            const opposite = (PIT_COUNT * 2) - currentPit;
            if (board[opposite] > 0) {
                const targetMancala = player === 0 ? P1_MANCALA : P2_MANCALA;
                board[targetMancala] += board[opposite] + 1;
                board[opposite] = 0;
                board[currentPit] = 0;
            }
        }
        return board;
    }
});
