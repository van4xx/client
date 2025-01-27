import React, { useState, useEffect } from 'react';
import './Games.css';

const Sudoku = ({ onGameEnd, opponent }) => {
  const [board, setBoard] = useState([]);
  const [selectedCell, setSelectedCell] = useState(null);
  const [gameState, setGameState] = useState('setup');
  const [difficulty, setDifficulty] = useState('medium');
  const [mistakes, setMistakes] = useState(0);
  const [time, setTime] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  // Генерация решенного судоку
  const generateSolvedBoard = () => {
    const board = Array(9).fill().map(() => Array(9).fill(0));
    
    // Заполняем диагональные блоки 3x3
    for (let i = 0; i < 9; i += 3) {
      fillBox(board, i, i);
    }
    
    // Решаем оставшуюся часть судоку
    solveSudoku(board);
    
    return board;
  };

  // Заполнение блока 3x3
  const fillBox = (board, row, col) => {
    const nums = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        const randomIndex = Math.floor(Math.random() * nums.length);
        board[row + i][col + j] = nums[randomIndex];
        nums.splice(randomIndex, 1);
      }
    }
  };

  // Проверка возможности размещения числа
  const isValid = (board, row, col, num) => {
    // Проверка строки
    for (let x = 0; x < 9; x++) {
      if (board[row][x] === num) return false;
    }
    
    // Проверка столбца
    for (let x = 0; x < 9; x++) {
      if (board[x][col] === num) return false;
    }
    
    // Проверка блока 3x3
    const startRow = row - row % 3;
    const startCol = col - col % 3;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (board[i + startRow][j + startCol] === num) return false;
      }
    }
    
    return true;
  };

  // Решение судоку
  const solveSudoku = (board) => {
    let row = -1;
    let col = -1;
    let isEmpty = false;
    
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        if (board[i][j] === 0) {
          row = i;
          col = j;
          isEmpty = true;
          break;
        }
      }
      if (isEmpty) break;
    }
    
    if (!isEmpty) return true;
    
    for (let num = 1; num <= 9; num++) {
      if (isValid(board, row, col, num)) {
        board[row][col] = num;
        if (solveSudoku(board)) return true;
        board[row][col] = 0;
      }
    }
    return false;
  };

  // Создание игрового поля с удаленными числами
  const createPuzzle = (solvedBoard, difficulty) => {
    const puzzle = solvedBoard.map(row => [...row]);
    const cellsToRemove = {
      easy: 30,
      medium: 40,
      hard: 50
    }[difficulty];

    let removed = 0;
    while (removed < cellsToRemove) {
      const row = Math.floor(Math.random() * 9);
      const col = Math.floor(Math.random() * 9);
      if (puzzle[row][col] !== 0) {
        puzzle[row][col] = 0;
        removed++;
      }
    }

    return puzzle;
  };

  // Инициализация игры
  const initGame = (selectedDifficulty) => {
    const solvedBoard = generateSolvedBoard();
    const puzzle = createPuzzle(solvedBoard, selectedDifficulty);
    
    setBoard({
      current: puzzle.map(row => [...row]),
      solution: solvedBoard,
      initial: puzzle.map(row => [...row])
    });
    
    setMistakes(0);
    setTime(0);
    setIsComplete(false);
    setGameState('playing');
    setDifficulty(selectedDifficulty);
  };

  // Обработка ввода числа
  const handleNumberInput = (num) => {
    if (!selectedCell || isComplete) return;
    
    const [row, col] = selectedCell;
    if (board.initial[row][col] !== 0) return;

    const newBoard = {
      ...board,
      current: board.current.map((r, i) =>
        i === row ? r.map((c, j) => j === col ? num : c) : r
      )
    };

    if (num !== 0 && num !== board.solution[row][col]) {
      setMistakes(prev => prev + 1);
    }

    setBoard(newBoard);

    // Проверка завершения игры
    const isWin = newBoard.current.every((row, i) =>
      row.every((cell, j) => cell === board.solution[i][j])
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
    <div className="sudoku-game">
      <div className="game-info">
        <div className="score-board">
          <div className="score-item">
            <span className="player-name">Ошибки</span>
            <span className="score">{mistakes}</span>
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
            <h3>Судоку</h3>
            <p>Заполните все клетки числами от 1 до 9</p>
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
          <>
            <div className="sudoku-board">
              {board.current.map((row, i) => (
                <div key={i} className="sudoku-row">
                  {row.map((cell, j) => (
                    <div
                      key={`${i}-${j}`}
                      className={`sudoku-cell ${
                        selectedCell?.[0] === i && selectedCell?.[1] === j ? 'selected' : ''
                      } ${board.initial[i][j] !== 0 ? 'initial' : ''}`}
                      onClick={() => setSelectedCell([i, j])}
                    >
                      {cell !== 0 && cell}
                    </div>
                  ))}
                </div>
              ))}
            </div>

            <div className="number-pad">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
                <button
                  key={num}
                  className="number-button"
                  onClick={() => handleNumberInput(num)}
                >
                  {num}
                </button>
              ))}
              <button
                className="number-button clear"
                onClick={() => handleNumberInput(0)}
              >
                ✕
              </button>
            </div>
          </>
        )}

        {isComplete && (
          <div className="game-over">
            <h3>Поздравляем!</h3>
            <p>
              Вы решили судоку за {formatTime(time)}
              <br />
              Сделано ошибок: {mistakes}
            </p>
            <button className="game-button" onClick={() => initGame(difficulty)}>
              Играть снова
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sudoku; 