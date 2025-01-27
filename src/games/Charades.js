import React, { useState, useEffect } from 'react';
import { BsCheck2Circle, BsXCircle, BsClock } from 'react-icons/bs';
import './Games.css';

const Charades = ({ onGameEnd, opponent }) => {
  const [gameState, setGameState] = useState('setup'); // setup, playing, finished
  const [currentWord, setCurrentWord] = useState('');
  const [timeLeft, setTimeLeft] = useState(60);
  const [score, setScore] = useState({ player: 0, opponent: 0 });
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [category, setCategory] = useState('random');

  const categories = {
    animals: [
      'Слон', 'Жираф', 'Кенгуру', 'Обезьяна', 'Пингвин',
      'Крокодил', 'Лев', 'Тигр', 'Медведь', 'Заяц'
    ],
    professions: [
      'Врач', 'Учитель', 'Повар', 'Художник', 'Строитель',
      'Пожарный', 'Полицейский', 'Программист', 'Музыкант', 'Актер'
    ],
    actions: [
      'Плавать', 'Танцевать', 'Готовить', 'Рисовать', 'Бегать',
      'Прыгать', 'Спать', 'Читать', 'Петь', 'Смеяться'
    ],
    emotions: [
      'Радость', 'Грусть', 'Злость', 'Удивление', 'Страх',
      'Любовь', 'Смущение', 'Восторг', 'Скука', 'Интерес'
    ],
    random: []
  };

  // Заполняем категорию random словами из всех категорий
  categories.random = [
    ...categories.animals,
    ...categories.professions,
    ...categories.actions,
    ...categories.emotions
  ];

  const getRandomWord = () => {
    const words = categories[category];
    return words[Math.floor(Math.random() * words.length)];
  };

  const startGame = (selectedCategory = 'random') => {
    setCategory(selectedCategory);
    setCurrentWord(getRandomWord());
    setTimeLeft(60);
    setGameState('playing');
    setIsPlayerTurn(true);
  };

  const handleCorrect = () => {
    setScore(prev => ({
      ...prev,
      [isPlayerTurn ? 'player' : 'opponent']: prev[isPlayerTurn ? 'player' : 'opponent'] + 1
    }));
    nextTurn();
  };

  const handleWrong = () => {
    nextTurn();
  };

  const nextTurn = () => {
    setCurrentWord(getRandomWord());
    setTimeLeft(60);
    setIsPlayerTurn(!isPlayerTurn);
  };

  useEffect(() => {
    let timer;
    if (gameState === 'playing' && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            nextTurn();
            return 60;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [gameState, timeLeft]);

  const formatTime = (seconds) => {
    return `${Math.floor(seconds / 60)}:${(seconds % 60).toString().padStart(2, '0')}`;
  };

  return (
    <div className="charades-game">
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
            <h3>Крокодил</h3>
            <p>Покажите загаданное слово жестами, без слов!</p>
            <div className="category-buttons">
              <button 
                className="game-button"
                onClick={() => startGame('animals')}
              >
                Животные
              </button>
              <button 
                className="game-button"
                onClick={() => startGame('professions')}
              >
                Профессии
              </button>
              <button 
                className="game-button"
                onClick={() => startGame('actions')}
              >
                Действия
              </button>
              <button 
                className="game-button"
                onClick={() => startGame('emotions')}
              >
                Эмоции
              </button>
              <button 
                className="game-button"
                onClick={() => startGame('random')}
              >
                Случайно
              </button>
            </div>
          </div>
        ) : (
          <div className="game-content">
            <div className="turn-info">
              Ход: {isPlayerTurn ? 'Вы' : opponent || 'Соперник'}
            </div>

            <div className="word-display">
              <h3>Загаданное слово:</h3>
              <div className="current-word">{currentWord}</div>
            </div>

            <div className="timer">
              <BsClock />
              <span className="time-left">{formatTime(timeLeft)}</span>
            </div>

            <div className="game-controls">
              <button 
                className="game-button success"
                onClick={handleCorrect}
              >
                <BsCheck2Circle /> Угадано
              </button>
              <button 
                className="game-button danger"
                onClick={handleWrong}
              >
                <BsXCircle /> Не угадано
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="game-rules">
        <h4>Правила игры:</h4>
        <ul>
          <li>Показывайте слово жестами</li>
          <li>Нельзя произносить слова</li>
          <li>Нельзя показывать буквы</li>
          <li>На каждое слово 60 секунд</li>
        </ul>
      </div>
    </div>
  );
};

export default Charades; 