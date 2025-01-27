import React, { useState } from 'react';
import { BsArrowUp, BsArrowDown, BsCheck2 } from 'react-icons/bs';
import './Games.css';

const NumberGuess = ({ onGameEnd, opponent }) => {
  const [gameState, setGameState] = useState('setup'); // setup, guessing, result
  const [secretNumber, setSecretNumber] = useState(null);
  const [guess, setGuess] = useState('');
  const [attempts, setAttempts] = useState([]);
  const [score, setScore] = useState({ player: 0, opponent: 0 });
  const [range, setRange] = useState({ min: 1, max: 100 });
  const [message, setMessage] = useState('');
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);

  const startNewGame = () => {
    if (gameState === 'setup') {
      const number = Math.floor(Math.random() * (range.max - range.min + 1)) + range.min;
      setSecretNumber(number);
      setGameState('guessing');
      setAttempts([]);
      setMessage(`Загадано число от ${range.min} до ${range.max}`);
      setIsPlayerTurn(true);
    }
  };

  const handleGuess = () => {
    const guessNum = parseInt(guess);
    if (isNaN(guessNum) || guessNum < range.min || guessNum > range.max) {
      setMessage(`Введите число от ${range.min} до ${range.max}`);
      return;
    }

    const newAttempts = [...attempts, { number: guessNum, result: getGuessResult(guessNum) }];
    setAttempts(newAttempts);
    setGuess('');

    if (guessNum === secretNumber) {
      setScore(prev => ({
        ...prev,
        [isPlayerTurn ? 'player' : 'opponent']: prev[isPlayerTurn ? 'player' : 'opponent'] + 1
      }));
      setGameState('result');
      setMessage(isPlayerTurn ? 'Вы угадали число!' : `${opponent || 'Соперник'} угадал число!`);
    } else {
      setMessage(guessNum > secretNumber ? 'Меньше' : 'Больше');
      setIsPlayerTurn(!isPlayerTurn);
    }
  };

  const getGuessResult = (num) => {
    if (num === secretNumber) return 'correct';
    return num > secretNumber ? 'high' : 'low';
  };

  const resetGame = () => {
    setGameState('setup');
    setSecretNumber(null);
    setGuess('');
    setAttempts([]);
    setMessage('');
  };

  return (
    <div className="number-guess-game">
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
        {gameState === 'setup' && (
          <div className="setup-container">
            <h3>Угадай число</h3>
            <p>Компьютер загадает число от {range.min} до {range.max}</p>
            <button className="game-button" onClick={startNewGame}>
              Начать игру
            </button>
          </div>
        )}

        {gameState !== 'setup' && (
          <>
            <div className="game-status">
              <div className="current-turn">
                Ход: {isPlayerTurn ? 'Вы' : opponent || 'Соперник'}
              </div>
              <div className="game-message">{message}</div>
            </div>

            <div className="guess-input-container">
              <input
                type="number"
                value={guess}
                onChange={(e) => setGuess(e.target.value)}
                placeholder="Введите число"
                min={range.min}
                max={range.max}
                className="guess-input"
              />
              <button 
                className="game-button guess"
                onClick={handleGuess}
                disabled={!guess}
              >
                Угадать
              </button>
            </div>

            <div className="attempts-list">
              {attempts.map((attempt, index) => (
                <div 
                  key={index} 
                  className={`attempt-item ${attempt.result}`}
                >
                  <span className="attempt-number">{attempt.number}</span>
                  {attempt.result === 'high' && <BsArrowDown />}
                  {attempt.result === 'low' && <BsArrowUp />}
                  {attempt.result === 'correct' && <BsCheck2 />}
                </div>
              ))}
            </div>

            {gameState === 'result' && (
              <div className="game-controls">
                <button className="game-button reset" onClick={resetGame}>
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

export default NumberGuess; 