import React, { useState, useEffect } from 'react';
import './Games.css';

const Puzzle = ({ onGameEnd, opponent }) => {
  const [tiles, setTiles] = useState([]);
  const [isComplete, setIsComplete] = useState(false);
  const [moves, setMoves] = useState(0);
  const [gameState, setGameState] = useState('setup');
  const [time, setTime] = useState(0);

  // Размер сетки
  const GRID_SIZE = 3;
  const TILE_COUNT = GRID_SIZE * GRID_SIZE;

  // Инициализация игры
  const initGame = () => {
    const newTiles = Array.from({ length: TILE_COUNT - 1 }, (_, i) => ({
      value: i + 1,
      position: i
    }));
    newTiles.push({ value: null, position: TILE_COUNT - 1 }); // Пустая ячейка

    // Перемешивание плиток
    for (let i = newTiles.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newTiles[i], newTiles[j]] = [newTiles[j], newTiles[i]];
    }

    // Проверка решаемости
    if (!isSolvable(newTiles)) {
      // Если нерешаемая, меняем местами первые две плитки
      [newTiles[0], newTiles[1]] = [newTiles[1], newTiles[0]];
    }

    setTiles(newTiles);
    setMoves(0);
    setTime(0);
    setIsComplete(false);
    setGameState('playing');
  };

  // Проверка решаемости пазла
  const isSolvable = (tiles) => {
    let inversions = 0;
    const values = tiles.map(tile => tile.value).filter(value => value !== null);
    
    for (let i = 0; i < values.length - 1; i++) {
      for (let j = i + 1; j < values.length; j++) {
        if (values[i] > values[j]) inversions++;
      }
    }

    const emptyRowFromBottom = Math.floor((TILE_COUNT - 1 - tiles.findIndex(tile => tile.value === null)) / GRID_SIZE);
    
    if (GRID_SIZE % 2 === 1) {
      return inversions % 2 === 0;
    } else {
      return (inversions + emptyRowFromBottom) % 2 === 0;
    }
  };

  // Проверка возможности перемещения
  const canMove = (index) => {
    const emptyIndex = tiles.findIndex(tile => tile.value === null);
    const row = Math.floor(index / GRID_SIZE);
    const emptyRow = Math.floor(emptyIndex / GRID_SIZE);
    const col = index % GRID_SIZE;
    const emptyCol = emptyIndex % GRID_SIZE;

    return (
      (Math.abs(row - emptyRow) === 1 && col === emptyCol) ||
      (Math.abs(col - emptyCol) === 1 && row === emptyRow)
    );
  };

  // Обработка клика по плитке
  const handleTileClick = (index) => {
    if (!canMove(index) || isComplete) return;

    const newTiles = [...tiles];
    const emptyIndex = tiles.findIndex(tile => tile.value === null);
    
    [newTiles[index], newTiles[emptyIndex]] = [newTiles[emptyIndex], newTiles[index]];
    
    setTiles(newTiles);
    setMoves(moves + 1);

    // Проверка на завершение
    const isWin = newTiles.every((tile, index) => 
      tile.value === null ? index === TILE_COUNT - 1 : tile.value === index + 1
    );
    
    if (isWin) {
      setIsComplete(true);
    }
  };

  // Таймер
  useEffect(() => {
    let timer;
    if (gameState === 'playing' && !isComplete) {
      timer = setInterval(() => {
        setTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [gameState, isComplete]);

  // Форматирование времени
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="puzzle-game">
      <div className="game-info">
        <div className="score-board">
          <div className="score-item">
            <span className="player-name">Ходы</span>
            <span className="score">{moves}</span>
          </div>
          <div className="score-divider">|</div>
          <div className="score-item">
            <span className="player-name">Время</span>
            <span className="score">{formatTime(time)}</span>
          </div>
        </div>
      </div>

      <div className="game-area">
        {gameState === 'setup' ? (
          <div className="setup-container">
            <h3>Пятнашки</h3>
            <p>Соберите картинку, перемещая плитки на пустое место</p>
            <button className="game-button" onClick={initGame}>
              Начать игру
            </button>
          </div>
        ) : (
          <div className="puzzle-board">
            {tiles.map((tile, index) => (
              <div
                key={tile.value || 'empty'}
                className={`puzzle-tile ${tile.value === null ? 'empty' : ''} ${
                  canMove(index) ? 'movable' : ''
                }`}
                onClick={() => handleTileClick(index)}
              >
                {tile.value}
              </div>
            ))}
          </div>
        )}

        {isComplete && (
          <div className="game-over">
            <h3>Поздравляем!</h3>
            <p>
              Вы собрали пазл за {moves} ходов
              <br />
              Время: {formatTime(time)}
            </p>
            <button className="game-button" onClick={initGame}>
              Играть снова
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Puzzle; 