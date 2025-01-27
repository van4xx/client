import React, { useState, useEffect } from 'react';
import { BsCircle, BsX } from 'react-icons/bs';
import './Games.css';

const Battleship = ({ onGameEnd, opponent }) => {
  const GRID_SIZE = 10;
  const SHIPS = [
    { size: 4, count: 1, name: 'Линкор' },
    { size: 3, count: 2, name: 'Крейсер' },
    { size: 2, count: 3, name: 'Эсминец' },
    { size: 1, count: 4, name: 'Катер' }
  ];

  const [gameState, setGameState] = useState('setup'); // setup, playing, finished
  const [playerBoard, setPlayerBoard] = useState(Array(GRID_SIZE).fill().map(() => Array(GRID_SIZE).fill(null)));
  const [opponentBoard, setOpponentBoard] = useState(Array(GRID_SIZE).fill().map(() => Array(GRID_SIZE).fill(null)));
  const [playerShots, setPlayerShots] = useState(Array(GRID_SIZE).fill().map(() => Array(GRID_SIZE).fill(false)));
  const [opponentShots, setOpponentShots] = useState(Array(GRID_SIZE).fill().map(() => Array(GRID_SIZE).fill(false)));
  const [currentShip, setCurrentShip] = useState(null);
  const [isVertical, setIsVertical] = useState(false);
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [score, setScore] = useState({ player: 0, opponent: 0 });
  const [message, setMessage] = useState('');

  const generateRandomBoard = () => {
    const board = Array(GRID_SIZE).fill().map(() => Array(GRID_SIZE).fill(null));
    
    SHIPS.forEach(shipType => {
      for (let i = 0; i < shipType.count; i++) {
        let placed = false;
        while (!placed) {
          const vertical = Math.random() < 0.5;
          const x = Math.floor(Math.random() * GRID_SIZE);
          const y = Math.floor(Math.random() * GRID_SIZE);
          
          if (canPlaceShip(board, x, y, shipType.size, vertical)) {
            placeShip(board, x, y, shipType.size, vertical);
            placed = true;
          }
        }
      }
    });
    
    return board;
  };

  const canPlaceShip = (board, x, y, size, vertical) => {
    if (vertical) {
      if (y + size > GRID_SIZE) return false;
      for (let i = -1; i <= size; i++) {
        for (let j = -1; j <= 1; j++) {
          const newY = y + i;
          const newX = x + j;
          if (newY >= 0 && newY < GRID_SIZE && newX >= 0 && newX < GRID_SIZE) {
            if (board[newY][newX]) return false;
          }
        }
      }
    } else {
      if (x + size > GRID_SIZE) return false;
      for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= size; j++) {
          const newY = y + i;
          const newX = x + j;
          if (newY >= 0 && newY < GRID_SIZE && newX >= 0 && newX < GRID_SIZE) {
            if (board[newY][newX]) return false;
          }
        }
      }
    }
    return true;
  };

  const placeShip = (board, x, y, size, vertical) => {
    if (vertical) {
      for (let i = 0; i < size; i++) {
        board[y + i][x] = size;
      }
    } else {
      for (let i = 0; i < size; i++) {
        board[y][x + i] = size;
      }
    }
  };

  const handleCellClick = (x, y, isOpponentBoard) => {
    if (gameState !== 'playing' || !isPlayerTurn || (isOpponentBoard && playerShots[y][x])) {
      return;
    }

    if (isOpponentBoard) {
      const newShots = [...playerShots];
      newShots[y][x] = true;
      setPlayerShots(newShots);

      if (opponentBoard[y][x]) {
        setMessage('Попадание!');
        checkWinCondition(opponentBoard, newShots, true);
      } else {
        setMessage('Мимо!');
        setIsPlayerTurn(false);
        setTimeout(makeOpponentMove, 1000);
      }
    }
  };

  const makeOpponentMove = () => {
    let x, y;
    do {
      x = Math.floor(Math.random() * GRID_SIZE);
      y = Math.floor(Math.random() * GRID_SIZE);
    } while (opponentShots[y][x]);

    const newShots = [...opponentShots];
    newShots[y][x] = true;
    setOpponentShots(newShots);

    if (playerBoard[y][x]) {
      setMessage('Противник попал!');
      checkWinCondition(playerBoard, newShots, false);
    } else {
      setMessage('Противник промахнулся!');
      setIsPlayerTurn(true);
    }
  };

  const checkWinCondition = (board, shots, isPlayer) => {
    let allShipsHit = true;
    for (let y = 0; y < GRID_SIZE; y++) {
      for (let x = 0; x < GRID_SIZE; x++) {
        if (board[y][x] && !shots[y][x]) {
          allShipsHit = false;
          break;
        }
      }
    }

    if (allShipsHit) {
      setGameState('finished');
      setScore(prev => ({
        ...prev,
        [isPlayer ? 'player' : 'opponent']: prev[isPlayer ? 'player' : 'opponent'] + 1
      }));
      setMessage(isPlayer ? 'Вы победили!' : 'Противник победил!');
    }
  };

  const startNewGame = () => {
    setPlayerBoard(generateRandomBoard());
    setOpponentBoard(generateRandomBoard());
    setPlayerShots(Array(GRID_SIZE).fill().map(() => Array(GRID_SIZE).fill(false)));
    setOpponentShots(Array(GRID_SIZE).fill().map(() => Array(GRID_SIZE).fill(false)));
    setIsPlayerTurn(true);
    setGameState('playing');
    setMessage('');
  };

  const renderCell = (value, isShot, isOpponentBoard) => {
    if (!isShot) {
      return isOpponentBoard ? null : (value ? '■' : null);
    }
    return value ? <BsX className="hit" /> : <BsCircle className="miss" />;
  };

  const renderBoard = (board, shots, isOpponentBoard) => (
    <div className={`battleship-board ${isOpponentBoard ? 'opponent' : 'player'}`}>
      {board.map((row, y) => (
        <div key={y} className="board-row">
          {row.map((cell, x) => (
            <div
              key={x}
              className={`board-cell ${shots[y][x] ? 'shot' : ''} ${
                cell && shots[y][x] ? 'hit' : ''
              }`}
              onClick={() => handleCellClick(x, y, isOpponentBoard)}
            >
              {renderCell(cell, shots[y][x], isOpponentBoard)}
            </div>
          ))}
        </div>
      ))}
    </div>
  );

  return (
    <div className="battleship-game">
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
      </div>

      <div className="game-area">
        {gameState === 'setup' ? (
          <div className="setup-container">
            <h3>Морской бой</h3>
            <p>Потопите все корабли противника!</p>
            <button className="game-button" onClick={startNewGame}>
              Начать игру
            </button>
          </div>
        ) : (
          <>
            <div className="game-status">
              <div className="current-turn">
                Ход: {isPlayerTurn ? 'Вы' : opponent || 'Соперник'}
              </div>
              <div className="game-message">{message}</div>
            </div>

            <div className="boards-container">
              <div className="board-wrapper">
                <h4>Ваше поле</h4>
                {renderBoard(playerBoard, opponentShots, false)}
              </div>
              <div className="board-wrapper">
                <h4>Поле противника</h4>
                {renderBoard(opponentBoard, playerShots, true)}
              </div>
            </div>

            {gameState === 'finished' && (
              <div className="game-controls">
                <button className="game-button reset" onClick={startNewGame}>
                  Новая игра
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Battleship; 