import React, { useState, useEffect, useRef } from 'react';
import './Games.css';

const Arkanoid = ({ onGameEnd, opponent }) => {
  const canvasRef = useRef(null);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [gameState, setGameState] = useState('setup');
  const [isPaused, setIsPaused] = useState(false);
  const [level, setLevel] = useState(1);

  // Константы игры
  const PADDLE_HEIGHT = 10;
  const PADDLE_WIDTH = 75;
  const BALL_RADIUS = 5;
  const BRICK_ROW_COUNT = 5;
  const BRICK_COLUMN_COUNT = 8;
  const BRICK_WIDTH = 75;
  const BRICK_HEIGHT = 20;
  const BRICK_PADDING = 10;
  const BRICK_OFFSET_TOP = 30;
  const BRICK_OFFSET_LEFT = 30;

  // Состояние игры
  const gameRef = useRef({
    ball: {
      x: 0,
      y: 0,
      dx: 4,
      dy: -4
    },
    paddle: {
      x: 0,
      width: PADDLE_WIDTH
    },
    bricks: [],
    keys: {
      ArrowLeft: false,
      ArrowRight: false
    }
  });

  // Инициализация кирпичей
  const initBricks = () => {
    const bricks = [];
    for (let c = 0; c < BRICK_COLUMN_COUNT; c++) {
      bricks[c] = [];
      for (let r = 0; r < BRICK_ROW_COUNT; r++) {
        bricks[c][r] = { x: 0, y: 0, status: 1 };
      }
    }
    return bricks;
  };

  // Инициализация игры
  const initGame = () => {
    const canvas = canvasRef.current;
    const game = gameRef.current;

    game.ball.x = canvas.width / 2;
    game.ball.y = canvas.height - 30;
    game.ball.dx = 4 + level;
    game.ball.dy = -4 - level;
    game.paddle.x = (canvas.width - PADDLE_WIDTH) / 2;
    game.bricks = initBricks();

    setScore(0);
    setLives(3);
    setGameState('playing');
    setIsPaused(false);
  };

  // Обработка столкновений с кирпичами
  const collisionDetection = () => {
    const game = gameRef.current;
    
    for (let c = 0; c < BRICK_COLUMN_COUNT; c++) {
      for (let r = 0; r < BRICK_ROW_COUNT; r++) {
        const brick = game.bricks[c][r];
        if (brick.status === 1) {
          if (game.ball.x > brick.x && 
              game.ball.x < brick.x + BRICK_WIDTH && 
              game.ball.y > brick.y && 
              game.ball.y < brick.y + BRICK_HEIGHT) {
            game.ball.dy = -game.ball.dy;
            brick.status = 0;
            setScore(prev => prev + 10);

            // Проверка победы
            if (score + 10 === BRICK_ROW_COUNT * BRICK_COLUMN_COUNT * 10) {
              setLevel(prev => prev + 1);
              initGame();
            }
          }
        }
      }
    }
  };

  // Обработка нажатий клавиш
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        gameRef.current.keys[e.key] = true;
      }
      if (e.key === ' ') {
        setIsPaused(prev => !prev);
      }
    };

    const handleKeyUp = (e) => {
      if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        gameRef.current.keys[e.key] = false;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // Основной игровой цикл
  useEffect(() => {
    if (gameState !== 'playing' || isPaused) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const game = gameRef.current;

    const gameLoop = () => {
      // Очистка канваса
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Отрисовка кирпичей
      for (let c = 0; c < BRICK_COLUMN_COUNT; c++) {
        for (let r = 0; r < BRICK_ROW_COUNT; r++) {
          if (game.bricks[c][r].status === 1) {
            const brickX = c * (BRICK_WIDTH + BRICK_PADDING) + BRICK_OFFSET_LEFT;
            const brickY = r * (BRICK_HEIGHT + BRICK_PADDING) + BRICK_OFFSET_TOP;
            game.bricks[c][r].x = brickX;
            game.bricks[c][r].y = brickY;

            ctx.beginPath();
            ctx.rect(brickX, brickY, BRICK_WIDTH, BRICK_HEIGHT);
            ctx.fillStyle = `hsl(${(c * r * 360) / (BRICK_COLUMN_COUNT * BRICK_ROW_COUNT)}, 70%, 50%)`;
            ctx.fill();
            ctx.closePath();
          }
        }
      }

      // Отрисовка платформы
      ctx.beginPath();
      ctx.rect(game.paddle.x, canvas.height - PADDLE_HEIGHT, PADDLE_WIDTH, PADDLE_HEIGHT);
      ctx.fillStyle = '#fff';
      ctx.fill();
      ctx.closePath();

      // Отрисовка мяча
      ctx.beginPath();
      ctx.arc(game.ball.x, game.ball.y, BALL_RADIUS, 0, Math.PI * 2);
      ctx.fillStyle = '#fff';
      ctx.fill();
      ctx.closePath();

      // Проверка столкновений
      collisionDetection();

      // Отскок от стен
      if (game.ball.x + game.ball.dx > canvas.width - BALL_RADIUS || 
          game.ball.x + game.ball.dx < BALL_RADIUS) {
        game.ball.dx = -game.ball.dx;
      }
      if (game.ball.y + game.ball.dy < BALL_RADIUS) {
        game.ball.dy = -game.ball.dy;
      } else if (game.ball.y + game.ball.dy > canvas.height - BALL_RADIUS) {
        if (game.ball.x > game.paddle.x && 
            game.ball.x < game.paddle.x + PADDLE_WIDTH) {
          game.ball.dy = -game.ball.dy;
          
          // Изменение угла отскока в зависимости от места удара
          const hitPoint = (game.ball.x - game.paddle.x) / PADDLE_WIDTH;
          game.ball.dx = 8 * (hitPoint - 0.5);
        } else {
          setLives(prev => prev - 1);
          if (lives <= 1) {
            setGameState('gameover');
          } else {
            game.ball.x = canvas.width / 2;
            game.ball.y = canvas.height - 30;
            game.ball.dx = 4 + level;
            game.ball.dy = -4 - level;
            game.paddle.x = (canvas.width - PADDLE_WIDTH) / 2;
          }
        }
      }

      // Движение платформы
      if (game.keys.ArrowLeft && game.paddle.x > 0) {
        game.paddle.x -= 7;
      }
      if (game.keys.ArrowRight && game.paddle.x < canvas.width - PADDLE_WIDTH) {
        game.paddle.x += 7;
      }

      // Движение мяча
      game.ball.x += game.ball.dx;
      game.ball.y += game.ball.dy;
    };

    const animationId = setInterval(gameLoop, 1000 / 60);
    return () => clearInterval(animationId);
  }, [gameState, isPaused, lives, score, level]);

  return (
    <div className="arkanoid-game">
      <div className="game-info">
        <div className="score-board">
          <div className="score-item">
            <span className="player-name">Очки</span>
            <span className="score">{score}</span>
          </div>
          <div className="score-divider">|</div>
          <div className="score-item">
            <span className="player-name">Жизни</span>
            <span className="score">{lives}</span>
          </div>
          <div className="score-divider">|</div>
          <div className="score-item">
            <span className="player-name">Уровень</span>
            <span className="score">{level}</span>
          </div>
        </div>
      </div>

      <div className="game-area">
        {gameState === 'setup' ? (
          <div className="setup-container">
            <h3>Арканоид</h3>
            <p>Разбейте все блоки, не теряя мяч</p>
            <button className="game-button" onClick={initGame}>
              Начать игру
            </button>
          </div>
        ) : (
          <div className="canvas-container">
            <canvas
              ref={canvasRef}
              width={800}
              height={400}
              className="arkanoid-canvas"
            />
            {isPaused && (
              <div className="pause-overlay">
                <h3>Пауза</h3>
                <button className="game-button" onClick={() => setIsPaused(false)}>
                  Продолжить
                </button>
              </div>
            )}
          </div>
        )}

        {gameState === 'gameover' && (
          <div className="game-over">
            <h3>Игра окончена</h3>
            <p>Ваш счет: {score}</p>
            <button className="game-button" onClick={initGame}>
              Играть снова
            </button>
          </div>
        )}
      </div>

      <div className="game-controls">
        <div className="control-hint">
          ← / → - управление платформой
          <br />
          Пробел - пауза
        </div>
      </div>
    </div>
  );
};

export default Arkanoid; 