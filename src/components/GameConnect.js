import React, { useState, useEffect } from 'react';
import './GameConnect.css';
import {
  BsController,
  BsGearFill,
  BsEnvelopeFill,
  BsBellFill,
  BsSearch,
  BsGrid,
  BsBookmarkFill,
  BsGraphUp,
  BsTrophy,
  BsPeopleFill,
  BsChatDotsFill,
  BsCalendarEventFill,
  BsPlayFill,
  BsChevronDown,
  BsHeartFill,
  BsBriefcaseFill,
  BsBook,
  BsDisplay,
  BsLightningFill,
  BsStar,
  BsStopwatch,
  BsPersonFill
} from 'react-icons/bs';

function GameConnect({ onSiteTypeChange }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [showSiteTypeDropdown, setShowSiteTypeDropdown] = useState(false);
  const [activeSection, setActiveSection] = useState('games');
  const [games, setGames] = useState([
    {
      id: 1,
      title: 'Counter-Strike 2',
      genre: 'Шутер',
      players: 1250,
      rating: 4.8,
      image: 'https://placekitten.com/301/301',
      platforms: ['PC', 'PS5', 'Xbox'],
      lookingFor: ['Команда', 'Напарник', 'Тренер']
    },
    {
      id: 2,
      title: 'Dota 2',
      genre: 'MOBA',
      players: 850,
      rating: 4.9,
      image: 'https://placekitten.com/302/302',
      platforms: ['PC'],
      lookingFor: ['Команда', 'Гильдия', 'Тренер']
    }
  ]);

  const [players, setPlayers] = useState([
    {
      id: 1,
      name: 'Максим',
      rank: 'Глобал Элита',
      games: ['CS2', 'Dota 2'],
      rating: 4.9,
      experience: '5 лет',
      photo: 'https://placekitten.com/303/303',
      availability: ['Вечер', 'Выходные'],
      description: 'Опытный игрок, ищу команду для турниров'
    }
  ]);

  useEffect(() => {
    setCurrentUser({
      id: 'user1',
      name: 'Александр',
      rank: 'Мастер',
      stats: {
        gamesPlayed: 150,
        winRate: 65,
        achievements: 12
      },
      photo: 'https://placekitten.com/300/300'
    });
  }, []);

  const renderGames = () => (
    <div className="game-list">
      <div className="games-header">
        <h2>Популярные игры</h2>
        <div className="games-filters">
          <button className="filter-button active">Все</button>
          <button className="filter-button">Шутеры</button>
          <button className="filter-button">MOBA</button>
          <button className="filter-button">RPG</button>
        </div>
      </div>

      <div className="games-grid">
        {games.map(game => (
          <div key={game.id} className="game-card">
            <div className="game-image">
              <img src={game.image} alt={game.title} />
              <div className="game-genre">{game.genre}</div>
            </div>
            <div className="game-info">
              <h3>{game.title}</h3>
              <div className="game-stats">
                <span className="rating"><BsStar /> {game.rating}</span>
                <span className="players"><BsPeopleFill /> {game.players}</span>
              </div>
              <div className="game-platforms">
                {game.platforms.map((platform, index) => (
                  <span key={index} className="platform-tag">{platform}</span>
                ))}
              </div>
              <div className="looking-for">
                {game.lookingFor.map((role, index) => (
                  <span key={index} className="role-tag">{role}</span>
                ))}
              </div>
              <button className="play-button">
                <BsPlayFill /> Играть
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderPlayers = () => (
    <div className="players-section">
      <div className="players-header">
        <h2>Поиск игроков</h2>
        <div className="players-filters">
          <div className="search-box">
            <BsSearch />
            <input type="text" placeholder="Поиск по играм, рангам..." />
          </div>
          <div className="filter-tags">
            <span className="filter-tag">Онлайн</span>
            <span className="filter-tag">С микрофоном</span>
            <span className="filter-tag">Рейтинговые</span>
          </div>
        </div>
      </div>

      <div className="players-grid">
        {players.map(player => (
          <div key={player.id} className="player-card">
            <div className="player-header">
              <img src={player.photo} alt={player.name} className="player-photo" />
              <div className="player-info">
                <h3>{player.name}</h3>
                <div className="player-games">
                  {player.games.map((game, index) => (
                    <span key={index} className="game-tag">{game}</span>
                  ))}
                </div>
              </div>
            </div>
            <div className="player-details">
              <div className="player-stats">
                <span className="rank">{player.rank}</span>
                <span className="rating"><BsStar /> {player.rating}</span>
              </div>
              <p className="player-description">{player.description}</p>
              <div className="player-availability">
                {player.availability.map((time, index) => (
                  <span key={index} className="time-tag">{time}</span>
                ))}
              </div>
              <div className="player-footer">
                <button className="invite-button">
                  <BsController /> Пригласить
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderTournaments = () => (
    <div className="tournaments-section">
      <div className="tournaments-header">
        <h2>Турниры</h2>
        <div className="tournament-filters">
          <button className="filter-button active">Все</button>
          <button className="filter-button">Регистрация</button>
          <button className="filter-button">Идут</button>
          <button className="filter-button">Завершенные</button>
        </div>
      </div>

      <div className="tournaments-grid">
        {/* Здесь будут карточки турниров */}
      </div>
    </div>
  );

  return (
    <div className="game-connect">
      <div className="game-header">
        <div className={`site-type-dropdown ${activeSection === 'search' ? 'hidden' : ''}`}>
          <button 
            className="dropdown-button"
            onClick={() => setShowSiteTypeDropdown(!showSiteTypeDropdown)}
          >
            <BsController /> GameConnect
            <BsChevronDown className={`chevron ${showSiteTypeDropdown ? 'open' : ''}`} />
          </button>
          {showSiteTypeDropdown && (
            <div className="dropdown-menu">
              <button 
                className="dropdown-item"
                onClick={() => {
                  if (typeof onSiteTypeChange === 'function') {
                    onSiteTypeChange('chat');
                  }
                  setShowSiteTypeDropdown(false);
                }}
              >
                <BsChatDotsFill /> Рулетка
              </button>
              <button 
                className="dropdown-item"
                onClick={() => {
                  if (typeof onSiteTypeChange === 'function') {
                    onSiteTypeChange('dating');
                  }
                  setShowSiteTypeDropdown(false);
                }}
              >
                <BsHeartFill /> Знакомства
              </button>
              <button 
                className="dropdown-item"
                onClick={() => {
                  if (typeof onSiteTypeChange === 'function') {
                    onSiteTypeChange('proconnect');
                  }
                  setShowSiteTypeDropdown(false);
                }}
              >
                <BsBriefcaseFill /> ProConnect
              </button>
              <button 
                className="dropdown-item"
                onClick={() => {
                  if (typeof onSiteTypeChange === 'function') {
                    onSiteTypeChange('eduhub');
                  }
                  setShowSiteTypeDropdown(false);
                }}
              >
                <BsBook /> EduHub
              </button>
              <button className="dropdown-item active">
                <BsController /> GameConnect
              </button>
            </div>
          )}
        </div>

        <div className="game-search">
          <BsSearch />
          <input type="text" placeholder="Поиск игр, игроков, турниров..." />
        </div>

        <div className="game-nav">
          <button className="nav-item">
            <BsEnvelopeFill />
            <span>Сообщения</span>
          </button>
          <button className="nav-item">
            <BsBellFill />
            <span>Уведомления</span>
          </button>
          <button className="nav-item">
            <BsGearFill />
            <span>Настройки</span>
          </button>
          <div className="user-profile">
            <img src={currentUser?.photo} alt={currentUser?.name} />
          </div>
        </div>
      </div>

      <div className="game-content">
        <div className="game-sidebar">
          <button 
            className={`sidebar-item ${activeSection === 'games' ? 'active' : ''}`}
            onClick={() => setActiveSection('games')}
          >
            <BsController /> Игры
          </button>
          <button 
            className={`sidebar-item ${activeSection === 'players' ? 'active' : ''}`}
            onClick={() => setActiveSection('players')}
          >
            <BsPersonFill /> Игроки
          </button>
          <button 
            className={`sidebar-item ${activeSection === 'tournaments' ? 'active' : ''}`}
            onClick={() => setActiveSection('tournaments')}
          >
            <BsTrophy /> Турниры
          </button>
          <button className="sidebar-item">
            <BsBookmarkFill /> Избранное
          </button>
          <button className="sidebar-item">
            <BsCalendarEventFill /> События
          </button>
          <button className="sidebar-item">
            <BsDisplay /> Стримы
          </button>
        </div>

        <div className="game-main">
          {activeSection === 'games' && renderGames()}
          {activeSection === 'players' && renderPlayers()}
          {activeSection === 'tournaments' && renderTournaments()}
        </div>

        <div className="game-aside">
          <div className="profile-summary">
            <div className="profile-header">
              <img src={currentUser?.photo} alt={currentUser?.name} />
              <h3>{currentUser?.name}</h3>
              <p>{currentUser?.rank}</p>
            </div>
            <div className="profile-stats">
              <div className="stat-item">
                <span className="stat-value">{currentUser?.stats?.winRate}%</span>
                <span className="stat-label">побед</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">{currentUser?.stats?.achievements}</span>
                <span className="stat-label">достижений</span>
              </div>
            </div>
          </div>

          <div className="active-matches">
            <h3>Активные матчи</h3>
            <div className="matches-list">
              {/* Здесь будет список активных матчей */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GameConnect; 