import React, { useState, useEffect, useRef } from 'react';
import './Games.css';

const PingPong = ({ onGameEnd, opponent }) => {
  const canvasRef = useRef(null);
  const [score, setScore] = useState({ player: 0, opponent: 0 });
  const [gameState, setGameState] = useState('setup');
  const [isPaused, setIsPaused] = useState(false);

  // Константы игры
  const PADDLE_HEIGHT = 100;
  const PADDLE_WIDTH = 10;
  const BALL_SIZE = 10;
  const BALL_SPEED = 5;
  const PADDLE_SPEED = 8;

  // Состояние игры
  const gameRef = useRef({
    ball: {
      x: 0,
      y: 0,
      dx: BALL_SPEED,
      dy: BALL_SPEED
    },
    playerPaddle: {
      y: 0,
      score: 0
    },
    computerPaddle: {
      y: 0,
      score: 0
    },
    keys: {
      ArrowUp: false,
      ArrowDown: false
    }
  });

  // Инициализация игры
  const initGame = () => {
    const canvas = canvasRef.current;
    const game = gameRef.current;

    game.ball.x = canvas.width / 2;
    game.ball.y = canvas.height / 2;
    game.ball.dx = BALL_SPEED * (Math.random() > 0.5 ? 1 : -1);
    game.ball.dy = BALL_SPEED * (Math.random() > 0.5 ? 1 : -1);
    game.playerPaddle.y = canvas.height / 2 - PADDLE_HEIGHT / 2;
    game.computerPaddle.y = canvas.height / 2 - PADDLE_HEIGHT / 2;

    setGameState('playing');
    setIsPaused(false);
  };

  // Обработка нажатий клавиш
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
        gameRef.current.keys[e.key] = true;
      }
      if (e.key === ' ') {
        setIsPaused(prev => !prev);
      }
    };

    const handleKeyUp = (e) => {
      if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
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
      ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Обновление позиции мяча
      game.ball.x += game.ball.dx;
      game.ball.y += game.ball.dy;

      // Отскок от верхней и нижней стенки
      if (game.ball.y <= 0 || game.ball.y >= canvas.height - BALL_SIZE) {
        game.ball.dy *= -1;
      }

      // Движение ракетки игрока
      if (game.keys.ArrowUp && game.playerPaddle.y > 0) {
        game.playerPaddle.y -= PADDLE_SPEED;
      }
      if (game.keys.ArrowDown && game.playerPaddle.y < canvas.height - PADDLE_HEIGHT) {
        game.playerPaddle.y += PADDLE_SPEED;
      }

      // ИИ для компьютера
      const computerSpeed = PADDLE_SPEED * 0.8;
      const paddleCenter = game.computerPaddle.y + PADDLE_HEIGHT / 2;
      if (paddleCenter < game.ball.y - 35) {
        game.computerPaddle.y += computerSpeed;
      } else if (paddleCenter > game.ball.y + 35) {
        game.computerPaddle.y -= computerSpeed;
      }

      // Проверка столкновений с ракетками
      if (game.ball.x <= PADDLE_WIDTH && 
          game.ball.y >= game.playerPaddle.y && 
          game.ball.y <= game.playerPaddle.y + PADDLE_HEIGHT) {
        game.ball.dx *= -1;
        game.ball.x = PADDLE_WIDTH;
      }

      if (game.ball.x >= canvas.width - PADDLE_WIDTH - BALL_SIZE && 
          game.ball.y >= game.computerPaddle.y && 
          game.ball.y <= game.computerPaddle.y + PADDLE_HEIGHT) {
        game.ball.dx *= -1;
        game.ball.x = canvas.width - PADDLE_WIDTH - BALL_SIZE;
      }

      // Проверка голов
      if (game.ball.x <= 0) {
        setScore(prev => ({ ...prev, opponent: prev.opponent + 1 }));
        game.ball.x = canvas.width / 2;
        game.ball.y = canvas.height / 2;
        game.ball.dx = BALL_SPEED;
      }
      if (game.ball.x >= canvas.width) {
        setScore(prev => ({ ...prev, player: prev.player + 1 }));
        game.ball.x = canvas.width / 2;
        game.ball.y = canvas.height / 2;
        game.ball.dx = -BALL_SPEED;
      }

      // Отрисовка элементов
      // Ракетки
      ctx.fillStyle = '#fff';
      ctx.fillRect(0, game.playerPaddle.y, PADDLE_WIDTH, PADDLE_HEIGHT);
      ctx.fillRect(canvas.width - PADDLE_WIDTH, game.computerPaddle.y, PADDLE_WIDTH, PADDLE_HEIGHT);

      // Мяч
      ctx.beginPath();
      ctx.arc(game.ball.x, game.ball.y, BALL_SIZE / 2, 0, Math.PI * 2);
      ctx.fillStyle = '#fff';
      ctx.fill();
      ctx.closePath();

      // Центральная линия
      ctx.setLineDash([5, 15]);
      ctx.beginPath();
      ctx.moveTo(canvas.width / 2, 0);
      ctx.lineTo(canvas.width / 2, canvas.height);
      ctx.strokeStyle = '#fff';
      ctx.stroke();

      // Счет
      ctx.font = '48px Arial';
      ctx.fillText(score.player, canvas.width / 4, 50);
      ctx.fillText(score.opponent, 3 * canvas.width / 4, 50);
    };

    const animationId = setInterval(gameLoop, 1000 / 60);
    return () => clearInterval(animationId);
  }, [gameState, isPaused, score]);

  return (
    <div className="ping-pong-game">
      <div className="game-info">
        <div className="score-board">
          <div className="score-item">
            <span className="player-name">Вы</span>
            <span className="score">{score.player}</span>
          </div>
          <div className="score-divider">:</div>
          <div className="score-item">
            <span className="score">{score.opponent}</span>
            <span className="player-name">{opponent || 'Компьютер'}</span>
          </div>
        </div>
      </div>

      <div className="game-area">
        {gameState === 'setup' ? (
          <div className="setup-container">
            <h3>Пинг-понг</h3>
            <p>Используйте стрелки вверх и вниз для управления. Пробел для паузы.</p>
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
              className="ping-pong-canvas"
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
      </div>

      <div className="game-controls">
        <div className="control-hint">
          ↑ / ↓ - управление ракеткой
          <br />
          Пробел - пауза
        </div>
      </div>
    </div>
  );
};

export default PingPong; 