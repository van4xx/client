import React, { useState, useEffect } from 'react';
import './Games.css';

const TicTacToe = ({ onGameEnd, opponent }) => {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const [winner, setWinner] = useState(null);
  const [score, setScore] = useState({ player: 0, opponent: 0 });

  const calculateWinner = (squares) => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // горизонтали
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // вертикали
      [0, 4, 8], [2, 4, 6] // диагонали
    ];

    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    return null;
  };

  const handleClick = (i) => {
    if (winner || board[i]) return;
    
    const newBoard = board.slice();
    newBoard[i] = isXNext ? 'X' : 'O';
    setBoard(newBoard);
    
    const gameWinner = calculateWinner(newBoard);
    if (gameWinner) {
      setWinner(gameWinner);
      if (gameWinner === 'X') {
        setScore({ ...score, player: score.player + 1 });
      } else {
        setScore({ ...score, opponent: score.opponent + 1 });
      }
    } else if (!newBoard.includes(null)) {
      setWinner('draw');
    }
    
    setIsXNext(!isXNext);
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setIsXNext(true);
    setWinner(null);
  };

  const renderSquare = (i) => (
    <button 
      className={`game-square ${board[i] ? 'filled' : ''} ${board[i] === 'X' ? 'x' : 'o'}`}
      onClick={() => handleClick(i)}
    >
      {board[i]}
    </button>
  );

  return (
    <div className="tictactoe-game">
      <div className="game-info">
        <div className="score-board">
          <div className="score-item">
            <span className="player-name">Вы</span>
            <span className="score">{score.player}</span>
          </div>
          <div className="score-divider">:</div>
          <div className="score-item">
            <span className="score">{score.opponent}</span>
            <span className="player-name">{opponent || 'Соперник'}</span>
          </div>
        </div>
        <div className="game-status">
          {winner ? (
            <div className="winner-message">
              {winner === 'draw' ? 'Ничья!' : `Победитель: ${winner === 'X' ? 'Вы' : opponent || 'Соперник'}!`}
            </div>
          ) : (
            <div className="turn-message">
              Ход: {isXNext ? 'Вы (X)' : `${opponent || 'Соперник'} (O)`}
            </div>
          )}
        </div>
      </div>
      <div className="game-board">
        <div className="board-row">
          {renderSquare(0)}
          {renderSquare(1)}
          {renderSquare(2)}
        </div>
        <div className="board-row">
          {renderSquare(3)}
          {renderSquare(4)}
          {renderSquare(5)}
        </div>
        <div className="board-row">
          {renderSquare(6)}
          {renderSquare(7)}
          {renderSquare(8)}
        </div>
      </div>
      <div className="game-controls">
        <button className="game-button reset" onClick={resetGame}>
          Новая игра
        </button>
      </div>
    </div>
  );
};

export default TicTacToe; 