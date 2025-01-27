import React, { useState, useEffect, useCallback } from 'react';
import { BsArrowUp, BsArrowDown, BsArrowLeft, BsArrowRight } from 'react-icons/bs';
import './Games.css';

const Snake = ({ onGameEnd, opponent }) => {
  const GRID_SIZE = 20;
  const INITIAL_SNAKE = [{ x: 10, y: 10 }];
  const INITIAL_DIRECTION = 'RIGHT';
  const GAME_SPEED = 150;

  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [direction, setDirection] = useState(INITIAL_DIRECTION);
  const [food, setFood] = useState({ x: 15, y: 15 });
  const [score, setScore] = useState({ player: 0, opponent: 0 });
  const [gameState, setGameState] = useState('setup'); // setup, playing, finished
  const [isPaused, setIsPaused] = useState(false);

  const generateFood = useCallback(() => {
    let newFood;
    do {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE)
      };
    } while (snake.some(segment => segment.x === newFood.x && segment.y === newFood.y));
    return newFood;
  }, [snake]);

  const moveSnake = useCallback(() => {
    if (isPaused || gameState !== 'playing') return;

    const head = { ...snake[0] };
    switch (direction) {
      case 'UP':
        head.y -= 1;
        break;
      case 'DOWN':
        head.y += 1;
        break;
      case 'LEFT':
        head.x -= 1;
        break;
      case 'RIGHT':
        head.x += 1;
        break;
      default:
        break;
    }

    // Check collision with walls
    if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
      setGameState('finished');
      return;
    }

    // Check collision with self
    if (snake.some(segment => segment.x === head.x && segment.y === head.y)) {
      setGameState('finished');
      return;
    }

    const newSnake = [head, ...snake];
    
    // Check if snake ate food
    if (head.x === food.x && head.y === food.y) {
      setScore(prev => ({ ...prev, player: prev.player + 1 }));
      setFood(generateFood());
    } else {
      newSnake.pop();
    }

    setSnake(newSnake);
  }, [snake, direction, food, gameState, isPaused, generateFood]);

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (gameState !== 'playing') return;

      switch (e.key) {
        case 'ArrowUp':
          if (direction !== 'DOWN') setDirection('UP');
          break;
        case 'ArrowDown':
          if (direction !== 'UP') setDirection('DOWN');
          break;
        case 'ArrowLeft':
          if (direction !== 'RIGHT') setDirection('LEFT');
          break;
        case 'ArrowRight':
          if (direction !== 'LEFT') setDirection('RIGHT');
          break;
        case ' ':
          setIsPaused(prev => !prev);
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [direction, gameState]);

  useEffect(() => {
    if (gameState === 'playing' && !isPaused) {
      const gameLoop = setInterval(moveSnake, GAME_SPEED);
      return () => clearInterval(gameLoop);
    }
  }, [moveSnake, gameState, isPaused]);

  const startGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setFood(generateFood());
    setGameState('playing');
    setIsPaused(false);
  };

  const renderCell = (x, y) => {
    const isSnake = snake.some(segment => segment.x === x && segment.y === y);
    const isFood = food.x === x && food.y === y;
    const isHead = snake[0].x === x && snake[0].y === y;

    return (
      <div
        key={`${x}-${y}`}
        className={`snake-cell ${isSnake ? 'snake' : ''} ${isHead ? 'head' : ''} ${isFood ? 'food' : ''}`}
      />
    );
  };

  const renderControls = () => (
    <div className="snake-controls">
      <div className="control-row">
        <button className="control-button" onClick={() => direction !== 'DOWN' && setDirection('UP')}>
          <BsArrowUp />
        </button>
      </div>
      <div className="control-row">
        <button className="control-button" onClick={() => direction !== 'RIGHT' && setDirection('LEFT')}>
          <BsArrowLeft />
        </button>
        <button className="control-button" onClick={() => direction !== 'UP' && setDirection('DOWN')}>
          <BsArrowDown />
        </button>
        <button className="control-button" onClick={() => direction !== 'LEFT' && setDirection('RIGHT')}>
          <BsArrowRight />
        </button>
      </div>
    </div>
  );

  return (
    <div className="snake-game">
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
      </div>

      <div className="game-area">
        {gameState === 'setup' ? (
          <div className="setup-container">
            <h3>Змейка</h3>
            <p>Собирайте еду и не врезайтесь в стены и хвост!</p>
            <button className="game-button" onClick={startGame}>
              Начать игру
            </button>
          </div>
        ) : (
          <>
            <div className="snake-grid">
              {Array.from({ length: GRID_SIZE }, (_, y) => (
                <div key={y} className="snake-row">
                  {Array.from({ length: GRID_SIZE }, (_, x) => renderCell(x, y))}
                </div>
              ))}
            </div>

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

export default Snake; 