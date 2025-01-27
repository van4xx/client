import React, { useState, useEffect, useCallback } from 'react';
import { BsArrowLeft, BsArrowRight, BsArrowDown, BsArrowUp } from 'react-icons/bs';
import './Games.css';

const Game2048 = ({ onGameEnd, opponent }) => {
  const [board, setBoard] = useState(getInitialBoard());
  const [score, setScore] = useState({ player: 0, opponent: 0 });
  const [gameState, setGameState] = useState('setup');
  const [bestTile, setBestTile] = useState(2);

  function getInitialBoard() {
    const board = Array(4).fill().map(() => Array(4).fill(0));
    return addNewTile(addNewTile(board));
  }

  function addNewTile(board) {
    const emptyCells = [];
    board.forEach((row, i) => {
      row.forEach((cell, j) => {
        if (cell === 0) emptyCells.push([i, j]);
      });
    });

    if (emptyCells.length === 0) return board;

    const [i, j] = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    const newBoard = board.map(row => [...row]);
    newBoard[i][j] = Math.random() < 0.9 ? 2 : 4;
    return newBoard;
  }

  const moveBoard = useCallback((direction) => {
    let newBoard = board.map(row => [...row]);
    let moved = false;
    let addedScore = 0;

    const rotate = (matrix) => {
      return matrix[0].map((_, i) => matrix.map(row => row[i]).reverse());
    };

    // Поворачиваем доску, чтобы всегда двигать влево
    if (direction === 'right') {
      newBoard = rotate(rotate(newBoard));
    } else if (direction === 'up') {
      newBoard = rotate(newBoard);
    } else if (direction === 'down') {
      newBoard = rotate(rotate(rotate(newBoard)));
    }

    // Двигаем и объединяем плитки
    newBoard = newBoard.map(row => {
      let newRow = row.filter(cell => cell !== 0);
      for (let i = 0; i < newRow.length - 1; i++) {
        if (newRow[i] === newRow[i + 1]) {
          newRow[i] *= 2;
          addedScore += newRow[i];
          setBestTile(prev => Math.max(prev, newRow[i]));
          newRow.splice(i + 1, 1);
        }
      }
      while (newRow.length < 4) newRow.push(0);
      return newRow;
    });

    // Поворачиваем обратно
    if (direction === 'right') {
      newBoard = rotate(rotate(newBoard));
    } else if (direction === 'up') {
      newBoard = rotate(rotate(rotate(newBoard)));
    } else if (direction === 'down') {
      newBoard = rotate(newBoard);
    }

    // Проверяем, изменилась ли доска
    moved = JSON.stringify(board) !== JSON.stringify(newBoard);

    if (moved) {
      newBoard = addNewTile(newBoard);
      setBoard(newBoard);
      setScore(prev => ({ ...prev, player: prev.player + addedScore }));
    }

    // Проверяем окончание игры
    if (!canMove(newBoard)) {
      setGameState('finished');
    }

    return moved;
  }, [board]);

  function canMove(board) {
    // Проверяем наличие пустых ячеек
    if (board.some(row => row.some(cell => cell === 0))) return true;

    // Проверяем возможность объединения
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        const current = board[i][j];
        if (
          (j < 3 && current === board[i][j + 1]) ||
          (i < 3 && current === board[i + 1][j])
        ) {
          return true;
        }
      }
    }
    return false;
  }

  const handleKeyPress = useCallback((e) => {
    if (gameState !== 'playing') return;

    switch (e.key) {
      case 'ArrowLeft':
        moveBoard('left');
        break;
      case 'ArrowRight':
        moveBoard('right');
        break;
      case 'ArrowUp':
        moveBoard('up');
        break;
      case 'ArrowDown':
        moveBoard('down');
        break;
      default:
        break;
    }
  }, [gameState, moveBoard]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);

  const startGame = () => {
    setBoard(getInitialBoard());
    setScore({ player: 0, opponent: 0 });
    setBestTile(2);
    setGameState('playing');
  };

  const getTileColor = (value) => {
    const colors = {
      2: '#eee4da',
      4: '#ede0c8',
      8: '#f2b179',
      16: '#f59563',
      32: '#f67c5f',
      64: '#f65e3b',
      128: '#edcf72',
      256: '#edcc61',
      512: '#edc850',
      1024: '#edc53f',
      2048: '#edc22e'
    };
    return colors[value] || '#cdc1b4';
  };

  const renderControls = () => (
    <div className="game-2048-controls">
      <div className="control-row">
        <button className="control-button" onClick={() => moveBoard('up')}>
          <BsArrowUp />
        </button>
      </div>
      <div className="control-row">
        <button className="control-button" onClick={() => moveBoard('left')}>
          <BsArrowLeft />
        </button>
        <button className="control-button" onClick={() => moveBoard('down')}>
          <BsArrowDown />
        </button>
        <button className="control-button" onClick={() => moveBoard('right')}>
          <BsArrowRight />
        </button>
      </div>
    </div>
  );

  return (
    <div className="game-2048">
      <div className="game-info">
        <div className="score-board">
          <div className="score-item">
            <span className="player-name">Счет</span>
            <span className="score">{score.player}</span>
          </div>
          <div className="score-divider">|</div>
          <div className="score-item">
            <span className="player-name">Лучшая плитка</span>
            <span className="score">{bestTile}</span>
          </div>
        </div>
      </div>

      <div className="game-area">
        {gameState === 'setup' ? (
          <div className="setup-container">
            <h3>2048</h3>
            <p>Объединяйте одинаковые числа, чтобы получить 2048!</p>
            <button className="game-button" onClick={startGame}>
              Начать игру
            </button>
          </div>
        ) : (
          <>
            <div className="game-2048-board">
              {board.map((row, i) => (
                <div key={i} className="game-2048-row">
                  {row.map((cell, j) => (
                    <div
                      key={`${i}-${j}`}
                      className={`game-2048-cell ${cell ? 'filled' : ''}`}
                      style={{
                        backgroundColor: getTileColor(cell),
                        color: cell <= 4 ? '#776e65' : '#f9f6f2'
                      }}
                    >
                      {cell || ''}
                    </div>
                  ))}
                </div>
              ))}
            </div>

            {renderControls()}

            {gameState === 'finished' && (
              <div className="game-over">
                <h3>Игра окончена!</h3>
                <p>Ваш счет: {score.player}</p>
                <p>Лучшая плитка: {bestTile}</p>
                <button className="game-button" onClick={startGame}>
                  Играть снова
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Game2048; 