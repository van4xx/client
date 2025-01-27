import React, { useState } from 'react';
import { 
  BsController, 
  BsGrid3X3, 
  BsHandThumbsUp, 
  BsXLg,
  BsQuestionCircle,
  BsKeyboard,
  BsWater,
  BsJoystick,
  BsBoxes,
  BsLightning,
  BsDice5,
  BsPuzzle,
  BsGrid,
  BsArrowsMove,
  BsSpeedometer,
  BsTable,
  BsCardText,
  BsBricks,
  BsEgg,
  BsPeople,
  BsPerson,
  BsStar,
  BsCollection,
  BsEmojiSmile,
  BsCircle
} from 'react-icons/bs';
import TicTacToe from './TicTacToe';
import RockPaperScissors from './RockPaperScissors';
import NumberGuess from './NumberGuess';
import Hangman from './Hangman';
import Battleship from './Battleship';
import Snake from './Snake';
import Tetris from './Tetris';
import Game2048 from './Game2048';
import Memory from './Memory';
import PingPong from './PingPong';
import Puzzle from './Puzzle';
import Sudoku from './Sudoku';
import Minesweeper from './Minesweeper';
import Arkanoid from './Arkanoid';
import FlappyBird from './FlappyBird';
import WheelOfTasks from './WheelOfTasks';
import Charades from './Charades';
import './Games.css';

const GamesModal = ({ onClose, opponent }) => {
  const [selectedGame, setSelectedGame] = useState(null);
  const [filter, setFilter] = useState('all');
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem('favoriteGames');
    return saved ? JSON.parse(saved) : [];
  });

  const games = [
    // Игры с собеседником
    {
      id: 'tictactoe',
      title: 'Крестики-нолики',
      description: 'Классическая игра для двоих',
      icon: <BsGrid3X3 />,
      component: TicTacToe,
      type: 'multiplayer'
    },
    {
      id: 'rps',
      title: 'Камень, ножницы, бумага',
      description: 'Испытайте свою удачу!',
      icon: <BsHandThumbsUp />,
      component: RockPaperScissors,
      type: 'multiplayer'
    },
    {
      id: 'numberguess',
      title: 'Угадай число',
      description: 'Угадайте загаданное число',
      icon: <BsQuestionCircle />,
      component: NumberGuess,
      type: 'multiplayer'
    },
    {
      id: 'hangman',
      title: 'Виселица',
      description: 'Угадайте слово по буквам',
      icon: <BsKeyboard />,
      component: Hangman,
      type: 'multiplayer'
    },
    {
      id: 'battleship',
      title: 'Морской бой',
      description: 'Найдите и потопите корабли противника',
      icon: <BsWater />,
      component: Battleship,
      type: 'multiplayer'
    },
    {
      id: 'pingpong',
      title: 'Пинг-понг',
      description: 'Классическая игра в пинг-понг',
      icon: <BsSpeedometer />,
      component: PingPong,
      type: 'multiplayer'
    },

    // Одиночные игры
    {
      id: 'snake',
      title: 'Змейка',
      description: 'Классическая игра змейка',
      icon: <BsJoystick />,
      component: Snake,
      type: 'single'
    },
    {
      id: 'tetris',
      title: 'Тетрис',
      description: 'Собирайте линии из падающих фигур',
      icon: <BsBoxes />,
      component: Tetris,
      type: 'single'
    },
    {
      id: '2048',
      title: '2048',
      description: 'Объединяйте числа, чтобы получить 2048',
      icon: <BsPuzzle />,
      component: Game2048,
      type: 'single'
    },
    {
      id: 'memory',
      title: 'Memory',
      description: 'Найдите все пары карточек',
      icon: <BsGrid />,
      component: Memory,
      type: 'single'
    },
    {
      id: 'puzzle',
      title: 'Пятнашки',
      description: 'Соберите картинку из перемешанных частей',
      icon: <BsTable />,
      component: Puzzle,
      type: 'single'
    },
    {
      id: 'sudoku',
      title: 'Судоку',
      description: 'Заполните все клетки числами',
      icon: <BsGrid3X3 />,
      component: Sudoku,
      type: 'single'
    },
    {
      id: 'minesweeper',
      title: 'Сапер',
      description: 'Найдите все мины, не подорвавшись',
      icon: <BsBricks />,
      component: Minesweeper,
      type: 'single'
    },
    {
      id: 'arkanoid',
      title: 'Арканоид',
      description: 'Разбейте все блоки, не теряя мяч',
      icon: <BsBoxes />,
      component: Arkanoid,
      type: 'single'
    },
    {
      id: 'flappybird',
      title: 'Flappy Bird',
      description: 'Летите между труб, не задевая их',
      icon: <BsEgg />,
      component: FlappyBird,
      type: 'single'
    },

    // Развлечения
    {
      id: 'wheel',
      title: 'Колесо заданий',
      description: 'Выполняйте случайные задания',
      icon: <BsCircle />,
      component: WheelOfTasks,
      type: 'entertainment'
    },
    {
      id: 'charades',
      title: 'Крокодил',
      description: 'Покажите слово жестами',
      icon: <BsEmojiSmile />,
      component: Charades,
      type: 'entertainment'
    }
  ];

  const handleGameSelect = (game) => {
    setSelectedGame(game);
  };

  const handleCloseGame = () => {
    setSelectedGame(null);
  };

  const toggleFavorite = (gameId) => {
    const newFavorites = favorites.includes(gameId)
      ? favorites.filter(id => id !== gameId)
      : [...favorites, gameId];
    
    setFavorites(newFavorites);
    localStorage.setItem('favoriteGames', JSON.stringify(newFavorites));
  };

  const filteredGames = games.filter(game => {
    switch (filter) {
      case 'multiplayer':
        return game.type === 'multiplayer';
      case 'single':
        return game.type === 'single';
      case 'entertainment':
        return game.type === 'entertainment';
      case 'favorites':
        return favorites.includes(game.id);
      default:
        return true;
    }
  });

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal games-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2><BsController /> Мини-игры</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>

        {!selectedGame && (
          <div className="games-filters">
            <button 
              className={`filter-button ${filter === 'all' ? 'active' : ''}`}
              onClick={() => setFilter('all')}
            >
              <BsCollection /> Все игры
            </button>
            <button 
              className={`filter-button ${filter === 'multiplayer' ? 'active' : ''}`}
              onClick={() => setFilter('multiplayer')}
            >
              <BsPeople /> Игры с собеседником
            </button>
            <button 
              className={`filter-button ${filter === 'single' ? 'active' : ''}`}
              onClick={() => setFilter('single')}
            >
              <BsPerson /> Игры для одного
            </button>
            <button 
              className={`filter-button ${filter === 'entertainment' ? 'active' : ''}`}
              onClick={() => setFilter('entertainment')}
            >
              <BsEmojiSmile /> Развлечения
            </button>
            <button 
              className={`filter-button ${filter === 'favorites' ? 'active' : ''}`}
              onClick={() => setFilter('favorites')}
            >
              <BsStar /> Избранные
            </button>
          </div>
        )}

        <div className="games-content">
          {!selectedGame ? (
            <div className="games-grid">
              {filteredGames.map(game => (
                <div
                  key={game.id}
                  className="game-card"
                  onClick={() => handleGameSelect(game)}
                >
                  <div className="game-icon">
                    {game.icon}
                  </div>
                  <h3 className="game-title">{game.title}</h3>
                  <p className="game-description">{game.description}</p>
                  <button 
                    className={`favorite-button ${favorites.includes(game.id) ? 'active' : ''}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(game.id);
                    }}
                  >
                    <BsStar />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="active-game-container">
              <div className="game-header">
                <h3>{selectedGame.title}</h3>
                <button className="close-game" onClick={handleCloseGame}>
                  <BsXLg />
                </button>
              </div>
              <selectedGame.component opponent={opponent} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GamesModal; 
