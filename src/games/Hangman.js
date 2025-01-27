import React, { useState, useEffect } from 'react';
import { BsKeyboard } from 'react-icons/bs';
import './Games.css';

const Hangman = ({ onGameEnd, opponent }) => {
  const words = [
    'ПРОГРАММИСТ', 'КОМПЬЮТЕР', 'ИНТЕРНЕТ', 'АЛГОРИТМ', 'РАЗРАБОТКА',
    'JAVASCRIPT', 'РЕАКТИВНЫЙ', 'ВИРТУАЛЬНЫЙ', 'ПРИЛОЖЕНИЕ', 'ТЕХНОЛОГИЯ'
  ];

  const [word, setWord] = useState('');
  const [guessedLetters, setGuessedLetters] = useState(new Set());
  const [wrongGuesses, setWrongGuesses] = useState(0);
  const [gameState, setGameState] = useState('setup'); // setup, playing, won, lost
  const [score, setScore] = useState({ player: 0, opponent: 0 });
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const maxWrongGuesses = 6;

  const startNewGame = () => {
    const randomWord = words[Math.floor(Math.random() * words.length)];
    setWord(randomWord);
    setGuessedLetters(new Set());
    setWrongGuesses(0);
    setGameState('playing');
    setIsPlayerTurn(true);
  };

  const getMaskedWord = () => {
    return word
      .split('')
      .map(letter => guessedLetters.has(letter) ? letter : '_')
      .join(' ');
  };

  const handleGuess = (letter) => {
    if (gameState !== 'playing' || !isPlayerTurn) return;

    const newGuessedLetters = new Set(guessedLetters);
    newGuessedLetters.add(letter);
    setGuessedLetters(newGuessedLetters);

    if (!word.includes(letter)) {
      const newWrongGuesses = wrongGuesses + 1;
      setWrongGuesses(newWrongGuesses);
      
      if (newWrongGuesses >= maxWrongGuesses) {
        setGameState('lost');
        setScore(prev => ({ ...prev, opponent: prev.opponent + 1 }));
      }
      
      setIsPlayerTurn(false);
    } else {
      const isWordGuessed = word
        .split('')
        .every(letter => newGuessedLetters.has(letter));
      
      if (isWordGuessed) {
        setGameState('won');
        setScore(prev => ({ ...prev, player: prev.player + 1 }));
      }
    }
  };

  const getHangmanFigure = () => {
    const parts = [
      <circle cx="50" cy="25" r="20" className="head" />, // голова
      <line x1="50" y1="45" x2="50" y2="90" className="body" />, // тело
      <line x1="50" y1="60" x2="20" y2="80" className="left-arm" />, // левая рука
      <line x1="50" y1="60" x2="80" y2="80" className="right-arm" />, // правая рука
      <line x1="50" y1="90" x2="20" y2="120" className="left-leg" />, // левая нога
      <line x1="50" y1="90" x2="80" y2="120" className="right-leg" /> // правая нога
    ];

    return (
      <svg width="100" height="150" className="hangman-figure">
        {/* Виселица */}
        <line x1="10" y1="140" x2="90" y2="140" className="base" />
        <line x1="30" y1="140" x2="30" y2="10" className="pole" />
        <line x1="30" y1="10" x2="50" y2="10" className="top" />
        <line x1="50" y1="10" x2="50" y2="5" className="rope" />
        
        {/* Части тела */}
        {parts.slice(0, wrongGuesses)}
      </svg>
    );
  };

  const keyboard = 'АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ'.split('');

  return (
    <div className="hangman-game">
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
        {gameState === 'setup' ? (
          <div className="setup-container">
            <h3>Виселица</h3>
            <p>Угадайте загаданное слово по буквам</p>
            <button className="game-button" onClick={startNewGame}>
              Начать игру
            </button>
          </div>
        ) : (
          <>
            <div className="hangman-container">
              {getHangmanFigure()}
              <div className="word-display">
                <span className="masked-word">{getMaskedWord()}</span>
              </div>
            </div>

            <div className="game-status">
              {gameState === 'won' && (
                <div className="win-message">Поздравляем! Вы угадали слово!</div>
              )}
              {gameState === 'lost' && (
                <div className="lose-message">
                  Игра окончена! Загаданное слово: {word}
                </div>
              )}
              {gameState === 'playing' && (
                <div className="current-turn">
                  Ход: {isPlayerTurn ? 'Вы' : opponent || 'Соперник'}
                </div>
              )}
            </div>

            <div className="keyboard">
              {keyboard.map((letter) => (
                <button
                  key={letter}
                  className={`keyboard-button ${
                    guessedLetters.has(letter) ? 'guessed' : ''
                  }`}
                  onClick={() => handleGuess(letter)}
                  disabled={
                    guessedLetters.has(letter) ||
                    gameState !== 'playing' ||
                    !isPlayerTurn
                  }
                >
                  {letter}
                </button>
              ))}
            </div>

            {(gameState === 'won' || gameState === 'lost') && (
              <div className="game-controls">
                <button className="game-button reset" onClick={startNewGame}>
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

export default Hangman; 