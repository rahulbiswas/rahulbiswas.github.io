import React, { useState, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import HomeMenu from './HomeMenu';
import GameBoard from './GameBoard';
import { isValidMove, initialPieces } from './gameLogic';

// Constants for click areas
const HOME_LOCAL_X_START = 35; // -15 + 50 (center)
const HOME_LOCAL_X_END = 65;   // +15 + 50 (center)
const HOME_LOCAL_Y_START = 29; // -6 + 35 (center)
const HOME_LOCAL_Y_END = 41;   // +6 + 35 (center)
const HOME_RULES_X_START = 35; // -15 + 50 (center)
const HOME_RULES_X_END = 65;   // +15 + 50 (center)
const HOME_RULES_Y_START = 44; // -6 + 50 (center)
const HOME_RULES_Y_END = 56;   // +6 + 50 (center)
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

function JungleGame() {
    const [currentWindow, setCurrentWindow] = useState('home');
    const [pieces, setPieces] = useState(initialPieces);
    const [turn, setTurn] = useState(1);
    const [isFirstClick, setIsFirstClick] = useState(true);
    const [firstClickKey, setFirstClickKey] = useState(null);
    const [movedPiece, setMovedPiece] = useState(['0']);
    const contentRef = useRef(null);

    const getClickKey = (clickX, clickY) => {
        // Adjust coordinates relative to board origin
        const boardX = clickX - BOARD_UPPER_LEFT_X;
        const boardY = clickY - BOARD_UPPER_LEFT_Y;

        // Calculate grid position
        const col = Math.floor(boardY / BOARD_SQUARE_HEIGHT);  // Swapped X and Y
        const row = Math.floor(boardX / BOARD_SQUARE_WIDTH);   // Swapped X and Y

        // Verify the click is within bounds
        if (row >= 0 && row < 7 && col >= 0 && col < 9) {
            return `${row}_${col}`;
        }
        return null;
    };

    const handleMove = (firstKey, secondKey) => {
        const [fromX, fromY] = firstKey.split('_');
        const [toX, toY] = secondKey.split('_');
        const movingPiece = pieces[firstKey];

        if (!isValidMove(fromX, fromY, toX, toY, pieces, movingPiece)) {
            setIsFirstClick(true);
            setFirstClickKey(null);  // Clear selection on invalid move
            return;
        }

        setMovedPiece([firstKey.split('_'), secondKey.split('_')]);
        setPieces(prev => {
            const newPieces = { ...prev };
            delete newPieces[firstKey];
            newPieces[secondKey] = movingPiece;
            return newPieces;
        });
        setIsFirstClick(true);
        setFirstClickKey(null);  // Clear selection after successful move
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

        if (!clickKey) return; // Exit if click is outside board

        if (isFirstClick) {
            if (!pieces[clickKey]) return;
            const player = pieces[clickKey].player;
            if (player !== turn) return;
            setFirstClickKey(clickKey);
            setIsFirstClick(false);
        } else {
            if (firstClickKey === clickKey) {
                setFirstClickKey(null);  // Clear selection when clicking same piece
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
                        selectedPiece={firstClickKey}
                    />
                )}
            </div>
        </div>
    );
}

// Create root and render app
const root = createRoot(document.getElementById('root'));
root.render(<JungleGame />);

export default JungleGame;