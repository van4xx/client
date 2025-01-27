import React, { useState, useEffect, useCallback } from 'react';
import { BsArrowLeft, BsArrowRight, BsArrowDown, BsArrowUp } from 'react-icons/bs';
import './Games.css';

const BOARD_WIDTH = 10;
const BOARD_HEIGHT = 20;
const INITIAL_SPEED = 1000;

const TETROMINOS = {
  I: {
    shape: [[1, 1, 1, 1]],
    color: '#00f0f0'
  },
  J: {
    shape: [
      [1, 0, 0],
      [1, 1, 1]
    ],
    color: '#0000f0'
  },
  L: {
    shape: [
      [0, 0, 1],
      [1, 1, 1]
    ],
    color: '#f0a000'
  },
  O: {
    shape: [
      [1, 1],
      [1, 1]
    ],
    color: '#f0f000'
  },
  S: {
    shape: [
      [0, 1, 1],
      [1, 1, 0]
    ],
    color: '#00f000'
  },
  T: {
    shape: [
      [0, 1, 0],
      [1, 1, 1]
    ],
    color: '#a000f0'
  },
  Z: {
    shape: [
      [1, 1, 0],
      [0, 1, 1]
    ],
    color: '#f00000'
  }
};

const Tetris = ({ onGameEnd, opponent }) => {
  const [board, setBoard] = useState(createEmptyBoard());
  const [currentPiece, setCurrentPiece] = useState(null);
  const [score, setScore] = useState({ player: 0, opponent: 0 });
  const [gameState, setGameState] = useState('setup');
  const [isPaused, setIsPaused] = useState(false);
  const [level, setLevel] = useState(1);
  const [linesCleared, setLinesCleared] = useState(0);

  function createEmptyBoard() {
    return Array.from({ length: BOARD_HEIGHT }, () =>
      Array(BOARD_WIDTH).fill(null)
    );
  }

  const generateNewPiece = useCallback(() => {
    const pieces = Object.keys(TETROMINOS);
    const tetromino = TETROMINOS[pieces[Math.floor(Math.random() * pieces.length)]];
    return {
      shape: tetromino.shape,
      color: tetromino.color,
      position: { x: Math.floor(BOARD_WIDTH / 2) - 1, y: 0 },
      rotation: 0
    };
  }, []);

  const rotatePiece = (piece) => {
    const rotatedShape = piece.shape[0].map((_, i) =>
      piece.shape.map(row => row[i]).reverse()
    );
    return { ...piece, shape: rotatedShape };
  };

  const isValidMove = (piece, board, offsetX = 0, offsetY = 0) => {
    return piece.shape.every((row, y) =>
      row.every((value, x) => {
        const newX = piece.position.x + x + offsetX;
        const newY = piece.position.y + y + offsetY;
        return (
          !value ||
          (newX >= 0 &&
            newX < BOARD_WIDTH &&
            newY >= 0 &&
            newY < BOARD_HEIGHT &&
            !board[newY][newX])
        );
      })
    );
  };

  const mergePieceWithBoard = useCallback((piece, board) => {
    const newBoard = board.map(row => [...row]);
    piece.shape.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value) {
          newBoard[piece.position.y + y][piece.position.x + x] = piece.color;
        }
      });
    });
    return newBoard;
  }, []);

  const checkLines = useCallback((board) => {
    let lines = 0;
    const newBoard = board.filter(row => {
      const isComplete = row.every(cell => cell !== null);
      if (isComplete) lines++;
      return !isComplete;
    });

    while (newBoard.length < BOARD_HEIGHT) {
      newBoard.unshift(Array(BOARD_WIDTH).fill(null));
    }

    return { newBoard, lines };
  }, []);

  const moveDown = useCallback(() => {
    if (!currentPiece || isPaused || gameState !== 'playing') return;

    if (isValidMove(currentPiece, board, 0, 1)) {
      setCurrentPiece(prev => ({
        ...prev,
        position: { ...prev.position, y: prev.position.y + 1 }
      }));
    } else {
      const newBoard = mergePieceWithBoard(currentPiece, board);
      const { newBoard: clearedBoard, lines } = checkLines(newBoard);
      
      if (lines > 0) {
        setLinesCleared(prev => prev + lines);
        setScore(prev => ({ ...prev, player: prev.player + (lines * 100 * level) }));
        setLevel(prev => Math.floor((linesCleared + lines) / 10) + 1);
      }

      setBoard(clearedBoard);
      
      if (currentPiece.position.y <= 0) {
        setGameState('finished');
        return;
      }

      setCurrentPiece(generateNewPiece());
    }
  }, [currentPiece, board, isPaused, gameState, level, linesCleared, generateNewPiece, mergePieceWithBoard, checkLines]);

  useEffect(() => {
    if (gameState === 'playing' && !isPaused) {
      const speed = Math.max(INITIAL_SPEED - (level - 1) * 100, 100);
      const gameLoop = setInterval(moveDown, speed);
      return () => clearInterval(gameLoop);
    }
  }, [moveDown, gameState, isPaused, level]);

  const handleKeyPress = useCallback((e) => {
    if (!currentPiece || gameState !== 'playing' || isPaused) return;

    switch (e.key) {
      case 'ArrowLeft':
        if (isValidMove(currentPiece, board, -1, 0)) {
          setCurrentPiece(prev => ({
            ...prev,
            position: { ...prev.position, x: prev.position.x - 1 }
          }));
        }
        break;
      case 'ArrowRight':
        if (isValidMove(currentPiece, board, 1, 0)) {
          setCurrentPiece(prev => ({
            ...prev,
            position: { ...prev.position, x: prev.position.x + 1 }
          }));
        }
        break;
      case 'ArrowDown':
        moveDown();
        break;
      case 'ArrowUp':
        const rotated = rotatePiece(currentPiece);
        if (isValidMove(rotated, board)) {
          setCurrentPiece(rotated);
        }
        break;
      case ' ':
        setIsPaused(prev => !prev);
        break;
      default:
        break;
    }
  }, [currentPiece, board, gameState, isPaused, moveDown]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);

  const startGame = () => {
    setBoard(createEmptyBoard());
    setCurrentPiece(generateNewPiece());
    setScore({ player: 0, opponent: 0 });
    setLevel(1);
    setLinesCleared(0);
    setGameState('playing');
    setIsPaused(false);
  };

  const renderBoard = () => {
    const displayBoard = board.map(row => [...row]);
    if (currentPiece) {
      currentPiece.shape.forEach((row, y) => {
        row.forEach((value, x) => {
          if (value) {
            const boardY = currentPiece.position.y + y;
            const boardX = currentPiece.position.x + x;
            if (boardY >= 0 && boardY < BOARD_HEIGHT && boardX >= 0 && boardX < BOARD_WIDTH) {
              displayBoard[boardY][boardX] = currentPiece.color;
            }
          }
        });
      });
    }

    return (
      <div className="tetris-board">
        {displayBoard.map((row, y) => (
          <div key={y} className="tetris-row">
            {row.map((cell, x) => (
              <div
                key={`${y}-${x}`}
                className={`tetris-cell ${cell ? 'filled' : ''}`}
                style={{ backgroundColor: cell || undefined }}
              />
            ))}
          </div>
        ))}
      </div>
    );
  };

  const renderControls = () => (
    <div className="tetris-controls">
      <div className="control-row">
        <button className="control-button" onClick={() => handleKeyPress({ key: 'ArrowUp' })}>
          <BsArrowUp />
        </button>
      </div>
      <div className="control-row">
        <button className="control-button" onClick={() => handleKeyPress({ key: 'ArrowLeft' })}>
          <BsArrowLeft />
        </button>
        <button className="control-button" onClick={() => handleKeyPress({ key: 'ArrowDown' })}>
          <BsArrowDown />
        </button>
        <button className="control-button" onClick={() => handleKeyPress({ key: 'ArrowRight' })}>
          <BsArrowRight />
        </button>
      </div>
    </div>
  );

  return (
    <div className="tetris-game">
      <div className="game-info">
        <div className="score-board">
          <div className="score-item">
            <span className="player-name">Вы</span>
            <span className="score">{score.player}</span>
          </div>
          <div className="score-divider">:</div>
          <div className="score-item">
            <span className="score">{score.opponent}</span>
            <span className="player-name">{opponent || 'Рекорд'}</span>
          </div>
        </div>
        <div className="level-info">
          <div>Уровень: {level}</div>
          <div>Линии: {linesCleared}</div>
        </div>
      </div>

      <div className="game-area">
        {gameState === 'setup' ? (
          <div className="setup-container">
            <h3>Тетрис</h3>
            <p>Собирайте линии и набирайте очки!</p>
            <button className="game-button" onClick={startGame}>
              Начать игру
            </button>
          </div>
        ) : (
          <>
            {renderBoard()}
            {renderControls()}

            {gameState === 'finished' && (
              <div className="game-over">
                <h3>Игра окончена!</h3>
                <p>Ваш счет: {score.player}</p>
                <button className="game-button" onClick={startGame}>
                  Играть снова
                </button>
              </div>
            )}

            <div className="game-controls">
              <button 
                className={`game-button ${isPaused ? 'resume' : 'pause'}`}
                onClick={() => setIsPaused(!isPaused)}
              >
                {isPaused ? 'Продолжить' : 'Пауза'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Tetris; 