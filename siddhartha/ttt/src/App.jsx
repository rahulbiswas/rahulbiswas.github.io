// src/App.jsx
import { useState } from 'react'
import './App.css'

function Square({ value, onSquareClick, isWinning }) {
  return (
    <button 
      className={`square ${isWinning ? 'winning' : ''} ${value === 'X' ? 'x' : 'o'}`} 
      onClick={onSquareClick}
    >
      {value}
    </button>
  )
}

function Board({ squares, onPlay, xIsNext }) {
  function handleClick(i) {
    if (squares[i] || calculateWinner(squares)) return
    
    const nextSquares = squares.slice()
    nextSquares[i] = xIsNext ? 'X' : 'O'
    onPlay(nextSquares)
  }

  const winInfo = calculateWinner(squares)
  const winner = winInfo?.winner
  const winningLine = winInfo?.line
  
  let status
  if (winner) {
    status = `Winner: ${winner}`
  } else if (squares.every(square => square)) {
    status = "Draw!"
  } else {
    status = `Next player: ${xIsNext ? 'X' : 'O'}`
  }

  return (
    <>
      <div className="status">{status}</div>
      <div className="board">
        {[0, 1, 2].map(row => (
          <div key={row} className="board-row">
            {[0, 1, 2].map(col => {
              const i = row * 3 + col
              return (
                <Square
                  key={i}
                  value={squares[i]}
                  onSquareClick={() => handleClick(i)}
                  isWinning={winningLine?.includes(i)}
                />
              )
            })}
          </div>
        ))}
      </div>
    </>
  )
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
  ]

  for (const [a, b, c] of lines) {
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { winner: squares[a], line: [a, b, c] }
    }
  }
  return null
}

function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)])
  const [currentMove, setCurrentMove] = useState(0)
  const xIsNext = currentMove % 2 === 0
  const currentSquares = history[currentMove]

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares]
    setHistory(nextHistory)
    setCurrentMove(nextHistory.length - 1)
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove)
  }

  return (
    <div className="game">
      <div className="game-board">
        <Board squares={currentSquares} xIsNext={xIsNext} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <div className="moves">
          <button onClick={() => jumpTo(0)}>Start New Game</button>
        </div>
      </div>
    </div>
  )
}

export default Game