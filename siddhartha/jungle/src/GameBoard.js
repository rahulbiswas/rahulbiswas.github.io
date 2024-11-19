import React from 'react';

// Constants for layout
export const DRAWING_WIDTH = 100;
export const DRAWING_HEIGHT = 67;
export const BOARD_UPPER_LEFT_X = 20.7;
export const BOARD_UPPER_LEFT_Y = 3;
export const BOARD_SQUARE_WIDTH = 8.6;
export const BOARD_SQUARE_HEIGHT = 6.82;
export const PIECE_SIZE = 6.5;
export const POTENTIAL_MOVE_LENGTH = 2;

const GameBoard = ({ turn, pieces, movedPiece }) => (
    <svg viewBox="0 0 100 67">
        {/* Background with player color */}
        <rect
            width="100"
            height="67"
            fill={turn === 1 ? "#C25B5B" : "#87CEEB"}
        />

        {/* Game board */}
        <g transform={`translate(${BOARD_UPPER_LEFT_X}, ${BOARD_UPPER_LEFT_Y})`}>
            {/* Board grid - 7x9 */}
            {Array.from({ length: 9 }, (_, row) => (
                Array.from({ length: 7 }, (_, col) => {
                    // Determine square type
                    let fill = "#4CAF50"; // Default green

                    // Water squares (3x2 sections in middle)
                    if ((col === 1 || col === 2 || col === 4 || col === 5) &&
                        (row === 3 || row === 4 || row === 5)) {
                        fill = "#2196F3";
                    }

                    // Traps
                    if ((row === 0 || row === 8) && (col === 2 || col === 4) ||
                        ((row === 1 || row === 7) && col === 3)) {
                        fill = "#FFC107";
                    }

                    // Dens
                    if ((row === 0 || row === 8) && col === 3) {
                        fill = "#9C27B0";
                    }

                    return (
                        <rect
                            key={`${col}-${row}`}
                            x={col * BOARD_SQUARE_WIDTH}
                            y={row * BOARD_SQUARE_HEIGHT}
                            width={BOARD_SQUARE_WIDTH}
                            height={BOARD_SQUARE_HEIGHT}
                            fill={fill}
                            stroke="#000"
                            strokeWidth="0.1"
                        />
                    );
                })
            ))}
        </g>

        {/* Back button */}
        <g transform="translate(3, 2)">
            <rect width="17" height="11" rx="2" fill="#98FB98" stroke="#2F4F4F" strokeWidth="0.5"/>
            <text x="8.5" y="7.5" fill="#4A4A4A" fontSize="3" fontFamily="Impact, Arial Black, sans-serif" textAnchor="middle">
                BACK
            </text>
        </g>

        {/* Game pieces */}
        {Object.entries(pieces).map(([position, piece]) => {
            const [x, y] = position.split('_');
            // Center the piece in the square
            const translateX = x * BOARD_SQUARE_WIDTH + BOARD_UPPER_LEFT_X + (BOARD_SQUARE_WIDTH - PIECE_SIZE) / 2;
            const translateY = y * BOARD_SQUARE_HEIGHT + BOARD_UPPER_LEFT_Y + (BOARD_SQUARE_HEIGHT - PIECE_SIZE) / 2;

            return (
                <g key={position} transform={`translate(${translateX}, ${translateY})`}>
                    <image
                        href={`images/${piece.player === 0 ? 'a' : 'b'}piece.svg`}
                        width={PIECE_SIZE}
                        height={PIECE_SIZE}
                    />
                    <image
                        href={`images/${piece.player === 0 ? 'a' : 'b'}${piece.animal}.svg`}
                        width={PIECE_SIZE}
                        height={PIECE_SIZE}
                    />
                </g>
            );
        })}

        {/* Move indicators */}
        {movedPiece[0][0] !== '0' && (
            <>
                <rect
                    x={movedPiece[0][0] * BOARD_SQUARE_WIDTH + BOARD_UPPER_LEFT_X + BOARD_SQUARE_WIDTH - POTENTIAL_MOVE_LENGTH * 1.3}
                    y={movedPiece[0][1] * BOARD_SQUARE_HEIGHT + BOARD_UPPER_LEFT_Y}
                    width={POTENTIAL_MOVE_LENGTH}
                    height={POTENTIAL_MOVE_LENGTH}
                    fill="purple"
                />
                <rect
                    x={movedPiece[1][0] * BOARD_SQUARE_WIDTH + BOARD_UPPER_LEFT_X + BOARD_SQUARE_WIDTH - POTENTIAL_MOVE_LENGTH * 1.3}
                    y={movedPiece[1][1] * BOARD_SQUARE_HEIGHT + BOARD_UPPER_LEFT_Y}
                    width={POTENTIAL_MOVE_LENGTH}
                    height={POTENTIAL_MOVE_LENGTH}
                    fill="purple"
                />
            </>
        )}
    </svg>
);

export default GameBoard;