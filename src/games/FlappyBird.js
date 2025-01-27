import React, { useState, useEffect, useRef } from 'react';
import './Games.css';

const FlappyBird = ({ onGameEnd, opponent }) => {
  const canvasRef = useRef(null);
  const requestRef = useRef();
  const [score, setScore] = useState(0);
  const [gameState, setGameState] = useState('setup');
  const [isPaused, setIsPaused] = useState(false);
  const [bestScore, setBestScore] = useState(() => {
    const saved = localStorage.getItem('flappyBirdBestScore');
    return saved ? parseInt(saved) : 0;
  });

  // Константы игры
  const BIRD_WIDTH = 30;
  const BIRD_HEIGHT = 24;
  const PIPE_WIDTH = 50;
  const PIPE_GAP = 120;
  const GRAVITY = 0.5;
  const JUMP_FORCE = -8;
  const PIPE_SPEED = 3;
  const CANVAS_WIDTH = 800;
  const CANVAS_HEIGHT = 400;

  // Состояние игры
  const gameRef = useRef({
    bird: {
      x: CANVAS_WIDTH / 3,
      y: CANVAS_HEIGHT / 2,
      velocity: 0
    },
    pipes: [],
    frame: 0
  });

  // Инициализация canvas при монтировании
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = CANVAS_WIDTH;
      canvas.height = CANVAS_HEIGHT;
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = '#70c5ce';
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    }
  }, []);

  // Инициализация игры
  const initGame = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const game = gameRef.current;
    game.bird = {
      x: CANVAS_WIDTH / 3,
      y: CANVAS_HEIGHT / 2,
      velocity: 0
    };
    game.pipes = [];
    game.frame = 0;

    // Отмена предыдущего игрового цикла
    if (requestRef.current) {
      cancelAnimationFrame(requestRef.current);
    }

    setScore(0);
    setGameState('playing');
    setIsPaused(false);
  };

  // Создание новой трубы
  const createPipe = () => ({
    x: CANVAS_WIDTH,
    height: Math.floor(Math.random() * (CANVAS_HEIGHT - PIPE_GAP - 100) + 50),
    scored: false
  });

  // Обработка прыжка
  const jump = () => {
    if (gameState === 'playing' && !isPaused) {
      gameRef.current.bird.velocity = JUMP_FORCE;
    }
  };

  // Обработка нажатий клавиш
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === 'Space') {
        e.preventDefault();
        if (gameState === 'setup') {
          initGame();
        } else {
          jump();
        }
      }
      if (e.key === 'p') {
        setIsPaused(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState]);

  // Сохранение лучшего результата
  useEffect(() => {
    if (score > bestScore) {
      setBestScore(score);
      localStorage.setItem('flappyBirdBestScore', score.toString());
    }
  }, [score, bestScore]);

  // Основной игровой цикл
  useEffect(() => {
    if (gameState !== 'playing' || isPaused) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const game = gameRef.current;

    const animate = () => {
      // Очистка канваса
      ctx.fillStyle = '#70c5ce';
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

      // Обновление позиции птицы
      game.bird.velocity += GRAVITY;
      game.bird.y += game.bird.velocity;

      // Отрисовка птицы
      ctx.fillStyle = '#f7d51d';
      ctx.fillRect(game.bird.x, game.bird.y, BIRD_WIDTH, BIRD_HEIGHT);

      // Добавление новых труб
      if (game.frame % 100 === 0) {
        game.pipes.push(createPipe());
      }

      // Обновление и отрисовка труб
      game.pipes = game.pipes.filter(pipe => {
        pipe.x -= PIPE_SPEED;

        // Отрисовка труб
        ctx.fillStyle = '#2ecc71';
        ctx.fillRect(pipe.x, 0, PIPE_WIDTH, pipe.height);
        ctx.fillRect(
          pipe.x,
          pipe.height + PIPE_GAP,
          PIPE_WIDTH,
          CANVAS_HEIGHT - pipe.height - PIPE_GAP
        );

        // Проверка столкновений
        if (
          game.bird.x + BIRD_WIDTH > pipe.x &&
          game.bird.x < pipe.x + PIPE_WIDTH &&
          (game.bird.y < pipe.height || game.bird.y + BIRD_HEIGHT > pipe.height + PIPE_GAP)
        ) {
          setGameState('gameover');
          return false;
        }

        // Подсчет очков
        if (!pipe.scored && game.bird.x > pipe.x + PIPE_WIDTH) {
          pipe.scored = true;
          setScore(prev => prev + 1);
        }

        return pipe.x + PIPE_WIDTH > 0;
      });

      // Проверка столкновения с границами экрана
      if (game.bird.y <= 0 || game.bird.y + BIRD_HEIGHT >= CANVAS_HEIGHT) {
        setGameState('gameover');
        return;
      }

      game.frame++;
      requestRef.current = requestAnimationFrame(animate);
    };

    requestRef.current = requestAnimationFrame(animate);

    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [gameState, isPaused]);

  return (
    <div className="flappy-bird-game">
      <div className="game-info">
        <div className="score-board">
          <div className="score-item">
            <span className="player-name">Счет</span>
            <span className="score">{score}</span>
          </div>
          <div className="score-divider">|</div>
          <div className="score-item">
            <span className="player-name">Рекорд</span>
            <span className="score">{bestScore}</span>
          </div>
        </div>
      </div>

      <div className="game-area">
        {gameState === 'setup' ? (
          <div className="setup-container">
            <h3>Flappy Bird</h3>
            <p>Нажмите пробел или кликните, чтобы взлететь</p>
            <button className="game-button" onClick={initGame}>
              Начать игру
            </button>
          </div>
        ) : (
          <div className="canvas-container">
            <canvas
              ref={canvasRef}
              width={CANVAS_WIDTH}
              height={CANVAS_HEIGHT}
              className="flappy-bird-canvas"
              onClick={jump}
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
            <p>
              Счет: {score}
              <br />
              Рекорд: {bestScore}
            </p>
            <button className="game-button" onClick={initGame}>
              Играть снова
            </button>
          </div>
        )}
      </div>

      <div className="game-controls">
        <div className="control-hint">
          Пробел/Клик - прыжок
          <br />
          P - пауза
        </div>
      </div>
    </div>
  );
};

export default FlappyBird; 