import React, { useState, useEffect } from 'react';
import { BsFlag, BsQuestionCircle } from 'react-icons/bs';
import './Games.css';

const Minesweeper = ({ onGameEnd, opponent }) => {
  const [board, setBoard] = useState([]);
  const [gameState, setGameState] = useState('setup');
  const [difficulty, setDifficulty] = useState('medium');
  const [minesLeft, setMinesLeft] = useState(0);
  const [time, setTime] = useState(0);
  const [firstClick, setFirstClick] = useState(true);

  // Конфигурация уровней сложности
  const DIFFICULTIES = {
    easy: { rows: 8, cols: 8, mines: 10 },
    medium: { rows: 12, cols: 12, mines: 20 },
    hard: { rows: 16, cols: 16, mines: 40 }
  };

  // Создание пустого поля
  const createEmptyBoard = (rows, cols) => {
    return Array(rows).fill().map(() =>
      Array(cols).fill().map(() => ({
        isMine: false,
        isRevealed: false,
        isFlagged: false,
        neighborMines: 0
      }))
    );
  };

  // Размещение мин
  const placeMines = (board, rows, cols, mines, firstRow, firstCol) => {
    let minesPlaced = 0;
    while (minesPlaced < mines) {
      const row = Math.floor(Math.random() * rows);
      const col = Math.floor(Math.random() * cols);
      
      // Не размещаем мину в первой открытой клетке и вокруг неё
      if (!board[row][col].isMine && 
          Math.abs(row - firstRow) > 1 || 
          Math.abs(col - firstCol) > 1) {
        board[row][col].isMine = true;
        minesPlaced++;
      }
    }
  };

  // Подсчет мин вокруг клетки
  const countNeighborMines = (board, rows, cols) => {
    const directions = [
      [-1, -1], [-1, 0], [-1, 1],
      [0, -1],           [0, 1],
      [1, -1],  [1, 0],  [1, 1]
    ];

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        if (!board[row][col].isMine) {
          let count = 0;
          directions.forEach(([dx, dy]) => {
            const newRow = row + dx;
            const newCol = col + dy;
            if (newRow >= 0 && newRow < rows && 
                newCol >= 0 && newCol < cols && 
                board[newRow][newCol].isMine) {
              count++;
            }
          });
          board[row][col].neighborMines = count;
        }
      }
    }
  };

  // Инициализация игры
  const initGame = (selectedDifficulty) => {
    const { rows, cols, mines } = DIFFICULTIES[selectedDifficulty];
    const newBoard = createEmptyBoard(rows, cols);
    
    setBoard(newBoard);
    setMinesLeft(mines);
    setTime(0);
    setFirstClick(true);
    setGameState('playing');
    setDifficulty(selectedDifficulty);
  };

  // Открытие клетки
  const revealCell = (row, col) => {
    if (!board[row][col].isRevealed && !board[row][col].isFlagged) {
      const newBoard = [...board];
      
      // Если это первый клик
      if (firstClick) {
        placeMines(newBoard, board.length, board[0].length, minesLeft, row, col);
        countNeighborMines(newBoard, board.length, board[0].length);
        setFirstClick(false);
      }

      // Если попали на мину
      if (newBoard[row][col].isMine) {
        revealAllMines(newBoard);
        setGameState('lost');
        return;
      }

      // Открываем клетку
      newBoard[row][col].isRevealed = true;

      // Если вокруг нет мин, открываем соседние клетки
      if (newBoard[row][col].neighborMines === 0) {
        revealEmptyCells(newBoard, row, col);
      }

      setBoard(newBoard);

      // Проверяем победу
      checkWin(newBoard);
    }
  };

  // Открытие пустых клеток
  const revealEmptyCells = (board, row, col) => {
    const directions = [
      [-1, -1], [-1, 0], [-1, 1],
      [0, -1],           [0, 1],
      [1, -1],  [1, 0],  [1, 1]
    ];

    directions.forEach(([dx, dy]) => {
      const newRow = row + dx;
      const newCol = col + dy;

      if (newRow >= 0 && newRow < board.length && 
          newCol >= 0 && newCol < board[0].length && 
          !board[newRow][newCol].isRevealed && 
          !board[newRow][newCol].isFlagged) {
        board[newRow][newCol].isRevealed = true;
        if (board[newRow][newCol].neighborMines === 0) {
          revealEmptyCells(board, newRow, newCol);
        }
      }
    });
  };

  // Установка флага
  const toggleFlag = (row, col) => {
    if (!board[row][col].isRevealed) {
      const newBoard = [...board];
      newBoard[row][col].isFlagged = !newBoard[row][col].isFlagged;
      setBoard(newBoard);
      setMinesLeft(prev => newBoard[row][col].isFlagged ? prev - 1 : prev + 1);
    }
  };

  // Открытие всех мин
  const revealAllMines = (board) => {
    board.forEach(row => {
      row.forEach(cell => {
        if (cell.isMine) {
          cell.isRevealed = true;
        }
      });
    });
  };

  // Проверка победы
  const checkWin = (board) => {
    const allNonMinesRevealed = board.every(row =>
      row.every(cell =>
        cell.isMine ? !cell.isRevealed : cell.isRevealed
      )
    );

    if (allNonMinesRevealed) {
      setGameState('won');
    }
  };

  // Таймер
  useEffect(() => {
    let timer;
    if (gameState === 'playing' && !firstClick) {
      timer = setInterval(() => {
        setTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [gameState, firstClick]);

  // Форматирование времени
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="minesweeper-game">
      <div className="game-info">
        <div className="score-board">
          <div className="score-item">
            <span className="player-name">Мины</span>
            <span className="score">{minesLeft}</span>
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
            <h3>Сапер</h3>
            <p>Найдите все мины, не подорвавшись</p>
            <div className="difficulty-buttons">
              <button 
                className="game-button" 
                onClick={() => initGame('easy')}
              >
                Легкий
              </button>
              <button 
                className="game-button" 
                onClick={() => initGame('medium')}
              >
                Средний
              </button>
              <button 
                className="game-button" 
                onClick={() => initGame('hard')}
              >
                Сложный
              </button>
            </div>
          </div>
        ) : (
          <div className="minesweeper-board">
            {board.map((row, rowIndex) => (
              <div key={rowIndex} className="minesweeper-row">
                {row.map((cell, colIndex) => (
                  <div
                    key={`${rowIndex}-${colIndex}`}
                    className={`minesweeper-cell ${
                      cell.isRevealed ? 'revealed' : ''
                    } ${cell.isFlagged ? 'flagged' : ''} ${
                      cell.isRevealed && cell.isMine ? 'mine' : ''
                    }`}
                    onClick={() => revealCell(rowIndex, colIndex)}
                    onContextMenu={(e) => {
                      e.preventDefault();
                      toggleFlag(rowIndex, colIndex);
                    }}
                  >
                    {cell.isRevealed ? (
                      cell.isMine ? (
                        '💣'
                      ) : cell.neighborMines > 0 ? (
                        cell.neighborMines
                      ) : null
                    ) : cell.isFlagged ? (
                      <BsFlag />
                    ) : null}
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}

        {(gameState === 'won' || gameState === 'lost') && (
          <div className="game-over">
            <h3>{gameState === 'won' ? 'Поздравляем!' : 'Игра окончена'}</h3>
            <p>
              {gameState === 'won' 
                ? `Вы нашли все мины за ${formatTime(time)}!` 
                : 'Вы подорвались на мине'}
            </p>
            <button className="game-button" onClick={() => initGame(difficulty)}>
              Играть снова
            </button>
          </div>
        )}
      </div>

      <div className="game-controls">
        <div className="control-hint">
          ЛКМ - открыть клетку
          <br />
          ПКМ - поставить флаг
        </div>
      </div>
    </div>
  );
};

export default Minesweeper; 