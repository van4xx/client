import React, { useState, useEffect } from 'react';
import { 
  BsHeart, BsStar, BsLightning, BsSun, BsMoon, BsCloud,
  BsSnow, BsDroplet, BsFire, BsFlower1, BsEmojiSmile, BsGem
} from 'react-icons/bs';
import './Games.css';

const Memory = ({ onGameEnd, opponent }) => {
  const ICONS = [
    BsHeart, BsStar, BsLightning, BsSun, BsMoon, BsCloud,
    BsSnow, BsDroplet, BsFire, BsFlower1, BsEmojiSmile, BsGem
  ];

  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [solved, setSolved] = useState([]);
  const [disabled, setDisabled] = useState(false);
  const [score, setScore] = useState({ player: 0, opponent: 0 });
  const [moves, setMoves] = useState(0);
  const [gameState, setGameState] = useState('setup');

  // Инициализация игры
  const initializeGame = () => {
    // Создаем пары карт и перемешиваем их
    const shuffledCards = [...ICONS, ...ICONS]
      .map((Icon, index) => ({
        id: index,
        Icon,
        isFlipped: false,
        isSolved: false
      }))
      .sort(() => Math.random() - 0.5);

    setCards(shuffledCards);
    setFlipped([]);
    setSolved([]);
    setMoves(0);
    setGameState('playing');
  };

  // Обработка клика по карте
  const handleCardClick = (index) => {
    if (disabled || flipped.includes(index) || solved.includes(index)) return;

    // Переворачиваем карту
    const newFlipped = [...flipped, index];
    setFlipped(newFlipped);

    // Если перевернуты две карты
    if (newFlipped.length === 2) {
      setDisabled(true);
      setMoves(moves + 1);

      const [first, second] = newFlipped;
      if (cards[first].Icon === cards[second].Icon) {
        // Карты совпали
        setSolved([...solved, first, second]);
        setScore(prev => ({ ...prev, player: prev.player + 1 }));
        setFlipped([]);
        setDisabled(false);
      } else {
        // Карты не совпали
        setTimeout(() => {
          setFlipped([]);
          setDisabled(false);
        }, 1000);
      }
    }
  };

  // Проверка окончания игры
  useEffect(() => {
    if (solved.length === cards.length && cards.length > 0) {
      setGameState('finished');
    }
  }, [solved, cards]);

  return (
    <div className="memory-game">
      <div className="game-info">
        <div className="score-board">
          <div className="score-item">
            <span className="player-name">Пары</span>
            <span className="score">{score.player}</span>
          </div>
          <div className="score-divider">|</div>
          <div className="score-item">
            <span className="player-name">Ходы</span>
            <span className="score">{moves}</span>
          </div>
        </div>
      </div>

      <div className="game-area">
        {gameState === 'setup' ? (
          <div className="setup-container">
            <h3>Memory</h3>
            <p>Найдите все пары одинаковых карточек!</p>
            <button className="game-button" onClick={initializeGame}>
              Начать игру
            </button>
          </div>
        ) : (
          <>
            <div className="memory-board">
              {cards.map((card, index) => (
                <div
                  key={card.id}
                  className={`memory-card ${
                    flipped.includes(index) || solved.includes(index) ? 'flipped' : ''
                  } ${solved.includes(index) ? 'solved' : ''}`}
                  onClick={() => handleCardClick(index)}
                >
                  <div className="memory-card-inner">
                    <div className="memory-card-front">
                      <card.Icon />
                    </div>
                    <div className="memory-card-back">
                      ?
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {gameState === 'finished' && (
              <div className="game-over">
                <h3>Поздравляем!</h3>
                <p>Вы нашли все пары за {moves} ходов</p>
                <button className="game-button" onClick={initializeGame}>
                  Играть снова
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Memory; 