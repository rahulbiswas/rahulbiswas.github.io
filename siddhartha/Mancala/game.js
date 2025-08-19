document.addEventListener('DOMContentLoaded', () => {
    // --- Get DOM Elements ---
    const canvas = document.getElementById('mancalaCanvas');
    if (!canvas) { return; }
    const ctx = canvas.getContext('2d');

    const turnIndicator = document.getElementById('turn-indicator');
    const winnerModal = document.getElementById('winner-modal');
    const winnerMessageEl = document.getElementById('winner-message');
    const restartBtn = document.getElementById('restart-btn');
    const playAgainBtn = document.getElementById('play-again-btn');

    // --- Game Mode Setup ---
    const urlParams = new URLSearchParams(window.location.search);
    const gameMode = urlParams.get('mode') || 'pvp';

    // --- Game Configuration ---
    const PIT_COUNT = 6;
    const INITIAL_STONES = 4;
    const PLAYER_1_MANCALA = PIT_COUNT;
    const PLAYER_2_MANCALA = PIT_COUNT * 2 + 1;

    // --- Visual Configuration ---
    const STONE_COLOR = '#8B4513';
    const PIT_COLOR = '#D2B48C';
    const BOARD_COLOR = '#A0522D';
    const HIGHLIGHT_COLOR = 'rgba(255, 255, 224, 0.9)';

    let board = [];
    let currentPlayer = 0;
    let isAnimating = false;
    let gameOver = false;

    // --- Dynamic Layout Variables ---
    const layout = {};
    const pitCoordinates = [];

    // --- Main Setup Function ---
    function setupAndStartGame() {
        calculateLayout();
        initializeGame();
    }

    // --- Layout Calculation ---
    function calculateLayout() {
        const maxWidth = 900;
        const container = canvas.parentElement;
        const containerWidth = container.offsetWidth * 0.95;
        canvas.width = Math.min(containerWidth, maxWidth);
        layout.pitRadius = canvas.width / 22;
        layout.stoneRadius = layout.pitRadius / 6.5;
        layout.mancalaWidth = layout.pitRadius * 1.5;
        layout.mancalaHeight = layout.pitRadius * 5;
        layout.padding = layout.pitRadius * 1.2;
        layout.gap = layout.pitRadius * 0.7;
        canvas.height = layout.mancalaHeight + layout.padding * 1.5;
        calculatePitCoordinates();
    }
    
    function calculatePitCoordinates() {
        pitCoordinates.length = 0;
        const pr = layout.pitRadius;
        const mw = layout.mancalaWidth;
        const p = layout.padding;
        const gap = layout.gap;
        const pitsRowWidth = (PIT_COUNT * pr * 2) + ((PIT_COUNT - 1) * gap);
        const startX = (canvas.width - pitsRowWidth) / 2;
        const topRowY = p + pr;
        const bottomRowY = canvas.height - (p + pr);
        for (let i = 0; i < PIT_COUNT; i++) {
            const x = startX + (i * (pr * 2 + gap));
            pitCoordinates.push({ x: x + pr, y: bottomRowY, index: i });
        }
        pitCoordinates.push({ x: canvas.width - (p/2 + mw/2), y: canvas.height / 2, index: PLAYER_1_MANCALA });
        for (let i = 0; i < PIT_COUNT; i++) {
            const x = startX + (i * (pr * 2 + gap));
            pitCoordinates.push({ x: x + pr, y: topRowY, index: PLAYER_2_MANCALA - 1 - i });
        }
        pitCoordinates.push({ x: p/2 + mw/2, y: canvas.height / 2, index: PLAYER_2_MANCALA });
        pitCoordinates.sort((a, b) => a.index - b.index);
    }

    // --- Game Setup ---
    function initializeGame() {
        board = [];
        for (let i = 0; i < 2 * (PIT_COUNT + 1); i++) {
            board.push((i === PLAYER_1_MANCALA || i === PLAYER_2_MANCALA) ? 0 : INITIAL_STONES);
        }
        currentPlayer = 0;
        isAnimating = false;
        gameOver = false;
        
        if (winnerModal) winnerModal.style.display = 'none';
        updateTurnIndicator();
        drawGame();

        if (typeof startFactRotator === 'function') {
            startFactRotator();
        }
    }

    // --- Drawing & UI Update Functions ---
    function drawGame() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = BOARD_COLOR;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        pitCoordinates.forEach(coord => {
            const isMancala = coord.index === PLAYER_1_MANCALA || coord.index === PLAYER_2_MANCALA;
            drawPit(coord.x, coord.y, isMancala, coord.index);
            drawStonesInPit(coord.index);
        });
        drawLabels();
    }
    
    function updateTurnIndicator() {
        if (!turnIndicator) return;
        if (gameMode === 'ai') {
            turnIndicator.textContent = currentPlayer === 0 ? "Your Turn" : "AI is thinking...";
        } else {
            turnIndicator.textContent = `Player ${currentPlayer + 1}'s Turn`;
        }
    }

    function drawPit(x, y, isMancala, pitIndex) {
        const isPlayer1Pit = pitIndex < PLAYER_1_MANCALA;
        const isPlayer2Pit = pitIndex > PLAYER_1_MANCALA && pitIndex < PLAYER_2_MANCALA;
        const isPlayersTurn = (currentPlayer === 0 && isPlayer1Pit) || (currentPlayer === 1 && isPlayer2Pit);
        if (!isMancala && isPlayersTurn && board[pitIndex] > 0) {
            ctx.strokeStyle = HIGHLIGHT_COLOR;
            ctx.lineWidth = 6;
            ctx.beginPath();
            ctx.arc(x, y, layout.pitRadius + 4, 0, 2 * Math.PI);
            ctx.stroke();
        }
        ctx.fillStyle = PIT_COLOR;
        ctx.strokeStyle = '#654321';
        ctx.lineWidth = 4;
        ctx.beginPath();
        if (isMancala) {
            ctx.ellipse(x, y, layout.mancalaWidth / 2, layout.mancalaHeight / 2, 0, 0, 2 * Math.PI);
        } else {
            ctx.arc(x, y, layout.pitRadius, 0, 2 * Math.PI);
        }
        ctx.fill();
        ctx.stroke();
    }

    function drawStonesInPit(pitIndex) {
        const stoneCount = board[pitIndex];
        const coord = pitCoordinates.find(c => c.index === pitIndex);
        if (!coord || stoneCount === 0) return;
        ctx.fillStyle = STONE_COLOR;
        const isMancala = pitIndex === PLAYER_1_MANCALA || pitIndex === PLAYER_2_MANCALA;
        const goldenAngle = Math.PI * (3 - Math.sqrt(5));
        const maxRadiusX = isMancala ? (layout.mancalaWidth / 2 - layout.stoneRadius * 2) : (layout.pitRadius - layout.stoneRadius * 1.5);
        const maxRadiusY = isMancala ? (layout.mancalaHeight / 2 - layout.stoneRadius * 2) : (layout.pitRadius - layout.stoneRadius * 1.5);
        for (let i = 0; i < stoneCount; i++) {
            const radius_norm = Math.sqrt(i + 0.5) / Math.sqrt(stoneCount);
            const theta = i * goldenAngle;
            const offsetX = radius_norm * maxRadiusX * Math.cos(theta);
            const offsetY = radius_norm * maxRadiusY * Math.sin(theta);
            ctx.beginPath();
            ctx.arc(coord.x + offsetX, coord.y + offsetY, layout.stoneRadius, 0, 2 * Math.PI);
            ctx.fill();
        }
    }
    
    function drawLabels() {
        ctx.fillStyle = 'white';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.font = `bold ${layout.pitRadius / 2.2}px Arial`;
        const player2Text = gameMode === 'ai' ? "AI Opponent" : "Player 2";
        ctx.fillText(player2Text, canvas.width / 2, layout.padding / 2);
        ctx.fillText("Player 1", canvas.width / 2, canvas.height - layout.padding / 2);
        ctx.font = `bold ${layout.pitRadius}px Arial`;
        ctx.fillStyle = '#4a2c1a';
        const p1MancalaCoord = pitCoordinates.find(c => c.index === PLAYER_1_MANCALA);
        const p2MancalaCoord = pitCoordinates.find(c => c.index === PLAYER_2_MANCALA);
        if (p1MancalaCoord) ctx.fillText(board[PLAYER_1_MANCALA], p1MancalaCoord.x, p1MancalaCoord.y);
        if (p2MancalaCoord) ctx.fillText(board[PLAYER_2_MANCALA], p2MancalaCoord.x, p2MancalaCoord.y);
    }
    
    function displayWinner(message) {
        if (winnerModal && winnerMessageEl) {
            winnerMessageEl.textContent = message;
            winnerModal.style.display = 'flex';
        }
    }

    // --- AI Turn Logic ---
    function triggerAITurn() {
        if (gameOver || currentPlayer !== 1 || gameMode !== 'ai') return;
        
        isAnimating = true; // Block player clicks while AI is "thinking"
        updateTurnIndicator();

        setTimeout(() => {
            const bestMove = window.mancalaAI.findBestMove([...board]);
            if (bestMove !== -1) {
                executeMove(bestMove); // AI directly executes the move
            } else {
                isAnimating = false; // Unlock if AI has no moves
            }
        }, 1000); // 1-second delay to simulate thinking
    }

    // --- Game Logic ---
    function executeMove(pitIndex) {
        isAnimating = true; // Always set animating to true when a move starts
        let stonesInHand = board[pitIndex];
        board[pitIndex] = 0;
        animateSow(stonesInHand, pitIndex);
    }

    function animateSow(stonesLeft, currentPit) {
        if (stonesLeft === 0) {
            endTurn(currentPit);
            return;
        }
        currentPit = (currentPit + 1) % board.length;
        if ((currentPlayer === 0 && currentPit === PLAYER_2_MANCALA) || (currentPlayer === 1 && currentPit === PLAYER_1_MANCALA)) {
            currentPit = (currentPit + 1) % board.length;
        }
        const startCoord = pitCoordinates.find(c => c.index === (currentPit - 1 + board.length) % board.length);
        const endCoord = pitCoordinates.find(c => c.index === currentPit);
        let animFrame = 0;
        const totalFrames = 15;
        function singleStoneAnimation() {
            drawGame();
            animFrame++;
            const progress = animFrame / totalFrames;
            const animX = startCoord.x + (endCoord.x - startCoord.x) * progress;
            const animY = startCoord.y + (endCoord.y - startCoord.y) * progress;
            ctx.fillStyle = STONE_COLOR;
            ctx.beginPath();
            ctx.arc(animX, animY, layout.stoneRadius + 2, 0, 2 * Math.PI);
            ctx.fill();
            if (animFrame >= totalFrames) {
                board[currentPit]++;
                animateSow(stonesLeft - 1, currentPit);
            } else {
                requestAnimationFrame(singleStoneAnimation);
            }
        }
        requestAnimationFrame(singleStoneAnimation);
    }

    function endTurn(lastPit) {
        const lastStoneOnOwnSide = (currentPlayer === 0 && lastPit < PLAYER_1_MANCALA) || (currentPlayer === 1 && lastPit > PLAYER_1_MANCALA && lastPit < PLAYER_2_MANCALA);
        if (lastStoneOnOwnSide && board[lastPit] === 1) {
            const oppositePit = (PIT_COUNT * 2) - lastPit;
            if (board[oppositePit] > 0) {
                const targetMancala = currentPlayer === 0 ? PLAYER_1_MANCALA : PLAYER_2_MANCALA;
                board[targetMancala] += board[oppositePit] + 1;
                board[oppositePit] = 0;
                board[lastPit] = 0;
            }
        }
        if (!((currentPlayer === 0 && lastPit === PLAYER_1_MANCALA) || (currentPlayer === 1 && lastPit === PLAYER_2_MANCALA))) {
             currentPlayer = 1 - currentPlayer;
        }
        isAnimating = false; // Turn is over, animation is complete
        if (!checkGameOver()) {
            updateTurnIndicator();
            // If it's now the AI's turn, trigger it
            if (gameMode === 'ai' && currentPlayer === 1) {
                triggerAITurn();
            }
        }
        drawGame();
    }
    
    function checkGameOver() {
        const player1PitsSum = board.slice(0, PIT_COUNT).reduce((a, b) => a + b, 0);
        const player2PitsSum = board.slice(PIT_COUNT + 1, PLAYER_2_MANCALA).reduce((a, b) => a + b, 0);
        if (player1PitsSum === 0 || player2PitsSum === 0) {
            gameOver = true;
            board[PLAYER_1_MANCALA] += player1PitsSum;
            board[PLAYER_2_MANCALA] += player2PitsSum;
            for (let i = 0; i < board.length; i++) {
                if (i !== PLAYER_1_MANCALA && i !== PLAYER_2_MANCALA) board[i] = 0;
            }
            const p1Score = board[PLAYER_1_MANCALA];
            const p2Score = board[PLAYER_2_MANCALA];
            let message = p1Score > p2Score ? "Player 1 Wins!" : (p2Score > p1Score ? "Player 2 Wins!" : "It's a Draw!");
            displayWinner(message);
            drawGame();
            return true;
        }
        return false;
    }

    // --- Event Handling ---
    function handlePlayerClick(pitIndex) {
        // Guards for player clicks
        if (gameOver || isAnimating) return;
        if (gameMode === 'ai' && currentPlayer === 1) return; // Player can't click during AI turn

        // Validate move source based on current player
        const isPlayer1Pit = pitIndex < PLAYER_1_MANCALA;
        const isPlayer2Pit = pitIndex > PLAYER_1_MANCALA && pitIndex < PLAYER_2_MANCALA;

        if (currentPlayer === 0 && !isPlayer1Pit) return;
        if (currentPlayer === 1 && !isPlayer2Pit) return;
        
        if (board[pitIndex] === 0) return;

        // If all checks pass, execute the move
        executeMove(pitIndex);
    }

    function handleCanvasClick(event) {
        const rect = canvas.getBoundingClientRect();
        const mouseX = event.clientX - rect.left;
        const mouseY = event.clientY - rect.top;
        for (const coord of pitCoordinates) {
            const distance = Math.sqrt((mouseX - coord.x) ** 2 + (mouseY - coord.y) ** 2);
            if (distance < layout.pitRadius && coord.index !== PLAYER_1_MANCALA && coord.index !== PLAYER_2_MANCALA) {
                handlePlayerClick(coord.index);
                break;
            }
        }
    }

    function handleResize() {
        calculateLayout();
        drawGame();
    }
    
    canvas.addEventListener('click', handleCanvasClick);
    window.addEventListener('resize', handleResize);
    if (restartBtn) restartBtn.addEventListener('click', initializeGame);
    if (playAgainBtn) playAgainBtn.addEventListener('click', initializeGame);

    // --- Initial call ---
    setupAndStartGame();
});
