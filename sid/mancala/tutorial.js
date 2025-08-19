document.addEventListener('DOMContentLoaded', () => {
    // --- Get DOM Elements ---
    const canvas = document.getElementById('mancalaCanvas');
    if (!canvas) { return; }
    const ctx = canvas.getContext('2d');
    const tutorialText = document.getElementById('tutorial-text');
    const stepCounter = document.getElementById('step-counter');
    const prevBtn = document.getElementById('prev-step');
    const nextBtn = document.getElementById('next-step');

    // --- Game Configuration ---
    const PIT_COUNT = 6;
    const P1_MANCALA = PIT_COUNT;
    const P2_MANCALA = PIT_COUNT * 2 + 1;

    // --- Visual Configuration ---
    const STONE_COLOR = '#8B4513';
    const PIT_COLOR = '#D2B48C';
    const BOARD_COLOR = '#A0522D';
    const HIGHLIGHT_COLOR = 'rgba(255, 255, 0, 0.8)';
    const HIGHLIGHT_WRONG_COLOR = 'rgba(255, 0, 0, 0.6)';

    let board = [];
    let isAnimating = false;
    let isWaitingForClick = false;
    let currentStep = 0;
    let autoActionPlayedForStep = -1;
    let animatedStones = [];
    
    // --- Dynamic Layout Variables ---
    const layout = {};
    const pitCoordinates = [];

    // --- INTERACTIVE TUTORIAL STEPS ---
    const tutorialSteps = [
        {
            text: "Welcome! Your pits are on the bottom row. Click the glowing pit to make a move.",
            setup: () => [4, 4, 4, 4, 4, 4, 0, 4, 4, 4, 4, 4, 4, 0],
            highlightPit: 2,
            onCompleteText: "Great! See how the stones were dropped one by one? This is 'sowing'. Click 'Next'."
        },
        {
            text: "RULE 1: If your last stone lands in your own store, you get a FREE turn! Click the glowing pit.",
            setup: () => [1, 1, 1, 1, 1, 1, 5, 4, 4, 4, 4, 4, 4, 0],
            highlightPit: 5,
            onCompleteText: "You got a free turn! In a real game, you would play again. Click 'Next'."
        },
        {
            text: "RULE 2 (CAPTURE): If your last stone lands in an EMPTY pit on your side... click the glowing pit.",
            setup: () => [1, 1, 0, 7, 7, 7, 1, 0, 1, 7, 7, 7, 0, 10],
            highlightPit: 1,
            onCompleteText: "...you CAPTURE that stone AND all opposite stones! Fantastic! Click 'Next'."
        },
        {
            text: "RULE 3: You always SKIP your opponent's store. Click 'Next' to see an opponent's move.",
            setup: () => [0, 0, 0, 0, 0, 1, 10, 0, 0, 0, 0, 0, 8, 5],
            autoAction: { pit: 12, player: 1 },
            onCompleteText: "See? The stones went past your store. Now let's see how the game ends."
        },
        {
            text: "GAME END: The game ends when one player's side is empty. The other player then sweeps all remaining stones to their store.",
            setup: () => [0,0,0,0,0,0,20, 1,1,1,1,1,1,22],
            autoAction: { sweep: { player: 1 } },
            onCompleteText: "The player with the most stones wins! Player 2 wins 28 to 20."
        },
        {
            text: "You're ready to play! Click 'Back to Rules' below or head back to the main menu to start a game.",
            setup: () => [0,0,0,0,0,0,20, 0,0,0,0,0,0,28],
            onCompleteText: ""
        }
    ];

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
        pitCoordinates.push({ x: canvas.width - (p/2 + mw/2), y: canvas.height / 2, index: P1_MANCALA });
        for (let i = 0; i < PIT_COUNT; i++) {
            const x = startX + (i * (pr * 2 + gap));
            pitCoordinates.push({ x: x + pr, y: topRowY, index: P2_MANCALA - 1 - i });
        }
        pitCoordinates.push({ x: p/2 + mw/2, y: canvas.height / 2, index: P2_MANCALA });
        pitCoordinates.sort((a, b) => a.index - b.index);
    }
    
    // --- Drawing Functions ---
    function drawGame(highlightPit = null, wrongPit = null) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = BOARD_COLOR;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        pitCoordinates.forEach(coord => {
            const isMancala = coord.index === P1_MANCALA || coord.index === P2_MANCALA;
            drawPit(coord.x, coord.y, isMancala, coord.index, highlightPit, wrongPit);
            drawStonesInPit(coord.index);
        });
        ctx.fillStyle = STONE_COLOR;
        animatedStones.forEach(stone => {
             ctx.beginPath();
             ctx.arc(stone.x, stone.y, layout.stoneRadius + 2, 0, 2 * Math.PI);
             ctx.fill();
        });
        drawLabels();
    }

    function drawPit(x, y, isMancala, pitIndex, highlightPit, wrongPit) {
        if (!isMancala && (pitIndex === highlightPit || pitIndex === wrongPit)) {
            ctx.strokeStyle = (pitIndex === highlightPit) ? HIGHLIGHT_COLOR : HIGHLIGHT_WRONG_COLOR;
            ctx.lineWidth = 6;
            ctx.beginPath();
            ctx.arc(x, y, layout.pitRadius + 4, 0, 2 * Math.PI);
            ctx.stroke();
        }
        ctx.fillStyle = PIT_COLOR;
        ctx.strokeStyle = '#654321';
        ctx.lineWidth = 4;
        ctx.beginPath();
        if (isMancala) ctx.ellipse(x, y, layout.mancalaWidth / 2, layout.mancalaHeight / 2, 0, 0, 2 * Math.PI);
        else ctx.arc(x, y, layout.pitRadius, 0, 2 * Math.PI);
        ctx.fill();
        ctx.stroke();
    }
    
    function drawStonesInPit(pitIndex) {
        const stoneCount = board[pitIndex];
        const coord = pitCoordinates.find(c => c.index === pitIndex);
        if (!coord || stoneCount === 0) return;
        ctx.fillStyle = STONE_COLOR;
        const isMancala = pitIndex === P1_MANCALA || pitIndex === P2_MANCALA;
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
        ctx.fillText("Opponent", canvas.width / 2, layout.padding / 2);
        ctx.fillText("You", canvas.width / 2, canvas.height - layout.padding / 2);
        ctx.font = `bold ${layout.pitRadius}px Arial`;
        ctx.fillStyle = '#4a2c1a';
        const p1MancalaCoord = pitCoordinates.find(c => c.index === P1_MANCALA);
        const p2MancalaCoord = pitCoordinates.find(c => c.index === P2_MANCALA);
        if (p1MancalaCoord) ctx.fillText(board[P1_MANCALA], p1MancalaCoord.x, p1MancalaCoord.y);
        if (p2MancalaCoord) ctx.fillText(board[P2_MANCALA], p2MancalaCoord.x, p2MancalaCoord.y);
    }

    // --- Animation Logic (Synced with game.js) ---
    function animateCapture(fromPit, oppositePit, targetMancala, onComplete) {
        const fromCoord = pitCoordinates.find(c => c.index === fromPit);
        const oppositeCoord = pitCoordinates.find(c => c.index === oppositePit);
        const targetCoord = pitCoordinates.find(c => c.index === targetMancala);
        const stonesToCapture = board[oppositePit];
        board[fromPit] = 0;
        board[oppositePit] = 0;
        animatedStones.push({ sx: fromCoord.x, sy: fromCoord.y, tx: targetCoord.x, ty: targetCoord.y, x: fromCoord.x, y: fromCoord.y, progress: 0 });
        for (let i = 0; i < stonesToCapture; i++) {
            animatedStones.push({ sx: oppositeCoord.x, sy: oppositeCoord.y, tx: targetCoord.x, ty: targetCoord.y, x: oppositeCoord.x, y: oppositeCoord.y, progress: Math.random() * -0.3 });
        }
        function animationLoop() {
            let allDone = true;
            animatedStones.forEach(stone => {
                if (stone.progress < 1) {
                    allDone = false;
                    if (stone.progress >= 0) {
                        stone.x = stone.sx + (stone.tx - stone.sx) * stone.progress;
                        stone.y = stone.sy + (stone.ty - stone.sy) * stone.progress;
                    }
                    stone.progress += 0.05;
                }
            });
            drawGame();
            if (allDone) {
                animatedStones = [];
                board[targetMancala] += stonesToCapture + 1;
                drawGame();
                onComplete();
            } else {
                requestAnimationFrame(animationLoop);
            }
        }
        requestAnimationFrame(animationLoop);
    }

    function animateSweep(player, onComplete) {
        const startPit = player === 1 ? P1_MANCALA + 1 : 0;
        const endPit = player === 1 ? P2_MANCALA : P1_MANCALA;
        const targetMancala = player === 1 ? P2_MANCALA : P1_MANCALA;
        const targetCoord = pitCoordinates.find(c => c.index === targetMancala);
        let totalStonesSwept = 0;
        for (let i = startPit; i < endPit; i++) {
            if (board[i] > 0) {
                totalStonesSwept += board[i];
                const startCoord = pitCoordinates.find(c => c.index === i);
                for (let j = 0; j < board[i]; j++) {
                    animatedStones.push({ sx: startCoord.x, sy: startCoord.y, tx: targetCoord.x, ty: targetCoord.y, x: startCoord.x, y: startCoord.y, progress: Math.random() * -0.5 });
                }
                board[i] = 0;
            }
        }
        function animationLoop() {
             let allDone = true;
            animatedStones.forEach(stone => {
                if (stone.progress < 1) {
                    allDone = false;
                    if (stone.progress >= 0) {
                        stone.x = stone.sx + (stone.tx - stone.sx) * stone.progress;
                        stone.y = stone.sy + (stone.ty - stone.sy) * stone.progress;
                    }
                    stone.progress += 0.04;
                }
            });
            drawGame();
            if (allDone) {
                animatedStones = [];
                board[targetMancala] += totalStonesSwept;
                drawGame();
                onComplete();
            } else {
                requestAnimationFrame(animationLoop);
            }
        }
        requestAnimationFrame(animationLoop);
    }
    
    // --- Tutorial Control Logic ---
    function showStep(index) {
        if (isAnimating) return;
        currentStep = index;
        const step = tutorialSteps[currentStep];

        tutorialText.textContent = step.text;
        stepCounter.textContent = `Step ${currentStep + 1} / ${tutorialSteps.length}`;
        prevBtn.disabled = currentStep === 0;
        nextBtn.disabled = true;

        board = step.setup();
        isWaitingForClick = !step.autoAction && step.highlightPit !== null;
        drawGame(step.highlightPit);

        if (step.autoAction) nextBtn.disabled = false;
        if (currentStep >= tutorialSteps.length -1) nextBtn.disabled = true;
    }

    function executeMove(pitIndex, player = 0) {
        isAnimating = true;
        isWaitingForClick = false;
        let stonesInHand = board[pitIndex];
        let originalPit = pitCoordinates.find(c => c.index === pitIndex);
        board[pitIndex] = 0;
        for (let i = 0; i < stonesInHand; i++) {
            animatedStones.push({ x: originalPit.x, y: originalPit.y, progress: 0, targetPit: -1 });
        }
        animateSow(stonesInHand, pitIndex, player);
    }

    function animateSow(stonesLeft, currentPit, player) {
        if (stonesLeft === 0) {
            animatedStones = [];
            tutorialEndTurn(currentPit, player);
            return;
        }
        const previousPit = currentPit;
        currentPit = (currentPit + 1) % board.length;
        if ((player === 0 && currentPit === P2_MANCALA) || (player === 1 && currentPit === P1_MANCALA)) {
            currentPit = (currentPit + 1) % board.length;
        }

        const stoneToAnimate = animatedStones[animatedStones.length - stonesLeft];
        stoneToAnimate.targetPit = currentPit;
        const startCoord = pitCoordinates.find(c => c.index === previousPit);
        const endCoord = pitCoordinates.find(c => c.index === currentPit);
        stoneToAnimate.sx = startCoord.x;
        stoneToAnimate.sy = startCoord.y;
        stoneToAnimate.tx = endCoord.x;
        stoneToAnimate.ty = endCoord.y;
        
        function singleStoneAnimation() {
            if (stoneToAnimate.progress >= 1) {
                board[currentPit]++;
                animateSow(stonesLeft - 1, currentPit, player);
            } else {
                stoneToAnimate.progress += 0.1; // Animation speed control
                stoneToAnimate.x = stoneToAnimate.sx + (stoneToAnimate.tx - stoneToAnimate.sx) * stoneToAnimate.progress;
                stoneToAnimate.y = stoneToAnimate.sy + (stoneToAnimate.ty - stoneToAnimate.sy) * stoneToAnimate.progress;
                drawGame();
                requestAnimationFrame(singleStoneAnimation);
            }
        }
        requestAnimationFrame(singleStoneAnimation);
    }

    function tutorialEndTurn(lastPit, player) {
        const step = tutorialSteps[currentStep];
        const onComplete = () => {
            isAnimating = false;
            if (step.onCompleteText) tutorialText.textContent = step.onCompleteText;
            if (currentStep < tutorialSteps.length - 1) nextBtn.disabled = false;
            drawGame();
        };

        const lastStoneOnOwnSide = (player === 0 && lastPit < P1_MANCALA);
        if (lastStoneOnOwnSide && board[lastPit] === 1) {
            const oppositePit = (PIT_COUNT * 2) - lastPit;
            if (board[oppositePit] > 0) {
                animateCapture(lastPit, oppositePit, P1_MANCALA, onComplete);
                return;
            }
        }
        onComplete();
    }
    
    function handleCanvasClick(event) {
        if (!isWaitingForClick || isAnimating) return;
        const rect = canvas.getBoundingClientRect();
        const mouseX = event.clientX - rect.left;
        const mouseY = event.clientY - rect.top;
        const step = tutorialSteps[currentStep];
        for (const coord of pitCoordinates) {
            const distance = Math.sqrt((mouseX - coord.x) ** 2 + (mouseY - coord.y) ** 2);
            if (distance < layout.pitRadius && coord.index < P1_MANCALA) {
                if (coord.index === step.highlightPit) {
                    executeMove(coord.index, 0);
                } else {
                    drawGame(step.highlightPit, coord.index);
                    setTimeout(() => drawGame(step.highlightPit), 300);
                }
                break;
            }
        }
    }
    
    function handleNextClick() {
        if (isAnimating) return;
        const step = tutorialSteps[currentStep];
        if (step.autoAction && autoActionPlayedForStep !== currentStep) {
            autoActionPlayedForStep = currentStep;
            nextBtn.disabled = true;
            const action = step.autoAction;
            if(action.pit) {
                executeMove(action.pit, action.player);
            } else if (action.sweep) {
                isAnimating = true;
                animateSweep(action.sweep.player, () => {
                    isAnimating = false;
                    tutorialText.textContent = step.onCompleteText;
                    if (currentStep < tutorialSteps.length - 1) nextBtn.disabled = false;
                });
            }
        } else {
            showStep(currentStep + 1);
        }
    }

    function setupAndStartTutorial() {
        calculateLayout();
        showStep(0);
        prevBtn.addEventListener('click', () => showStep(currentStep - 1));
        nextBtn.addEventListener('click', handleNextClick);
        canvas.addEventListener('click', handleCanvasClick);
        window.addEventListener('resize', () => {
             calculateLayout();
             drawGame(tutorialSteps[currentStep]?.highlightPit);
        });
    }

    // --- Initial call ---
    setupAndStartTutorial();
});
