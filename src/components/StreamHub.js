import React, { useState, useEffect } from 'react';
import './StreamHub.css';
import StreamView from './StreamView';
import StreamCreate from './StreamCreate';
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
  BsPersonFill,
  BsCollectionPlay,
  BsCalendarEvent,
  BsCameraVideoFill,
  BsBoxArrowUp,
  BsPlusCircle,
  BsEyeFill,
  BsChatTextFill,
  BsPersonLinesFill,
  BsTagsFill,
  BsCollection
} from 'react-icons/bs';

function StreamHub({ onSiteTypeChange }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [showSiteTypeDropdown, setShowSiteTypeDropdown] = useState(false);
  const [activeSection, setActiveSection] = useState('featured');
  const [selectedStream, setSelectedStream] = useState(null);
  const [isCreatingStream, setIsCreatingStream] = useState(false);
  const [streams, setStreams] = useState([
    {
      id: 1,
      title: 'Мастер-класс по веб-разработке',
      streamer: 'Анна Смирнова',
      category: 'Образование',
      viewers: 1250,
      thumbnail: 'https://placekitten.com/301/301',
      tags: ['React', 'JavaScript', 'Программирование'],
      isLive: true,
      description: 'Изучаем современные технологии веб-разработки на практике',
      streamerAvatar: 'https://placekitten.com/100/100'
    },
    {
      id: 2,
      title: 'Турнир по CS2',
      streamer: 'Максим Петров',
      category: 'Киберспорт',
      viewers: 850,
      thumbnail: 'https://placekitten.com/302/302',
      tags: ['CS2', 'Киберспорт', 'Турнир'],
      isLive: true,
      description: 'Профессиональный турнир по CS2 с комментариями',
      streamerAvatar: 'https://placekitten.com/101/101'
    },
    {
      id: 3,
      title: 'Разговорный английский',
      streamer: 'John Smith',
      category: 'Языки',
      viewers: 450,
      thumbnail: 'https://placekitten.com/303/303',
      tags: ['Английский', 'Обучение', 'Практика'],
      isLive: true,
      description: 'Практика разговорного английского с носителем языка',
      streamerAvatar: 'https://placekitten.com/102/102'
    }
  ]);

  const [categories] = useState([
    { id: 'education', name: 'Образование', icon: <BsBook /> },
    { id: 'gaming', name: 'Игры', icon: <BsController /> },
    { id: 'professional', name: 'Профессии', icon: <BsBriefcaseFill /> },
    { id: 'entertainment', name: 'Развлечения', icon: <BsDisplay /> },
    { id: 'creative', name: 'Творчество', icon: <BsPlusCircle /> }
  ]);

  useEffect(() => {
    setCurrentUser({
      id: 'user1',
      name: 'Александр',
      role: 'Стример',
      stats: {
        followers: 150,
        totalViews: 1200,
        streamTime: '24ч'
      },
      photo: 'https://placekitten.com/300/300'
    });
  }, []);

  const handleStreamClick = (stream) => {
    setSelectedStream(stream);
  };

  const renderFeatured = () => (
    <div className="stream-featured">
      <div className="featured-header">
        <h2>Популярные трансляции</h2>
        <div className="featured-filters">
          <button className="filter-button active">Все</button>
          {categories.map(category => (
            <button key={category.id} className="filter-button">
              {category.icon} {category.name}
            </button>
          ))}
        </div>
      </div>

      <div className="streams-grid">
        {streams.map(stream => (
          <div 
            key={stream.id} 
            className="stream-card"
            onClick={() => handleStreamClick(stream)}
          >
            <div className="stream-thumbnail">
              <img src={stream.thumbnail} alt={stream.title} />
              {stream.isLive && <div className="live-badge">LIVE</div>}
              <div className="stream-viewers">
                <BsEyeFill /> {stream.viewers}
              </div>
            </div>
            <div className="stream-info">
              <h3>{stream.title}</h3>
              <p className="streamer-name">{stream.streamer}</p>
              <div className="stream-category">{stream.category}</div>
              <div className="stream-tags">
                {stream.tags.map((tag, index) => (
                  <span key={index} className="tag">{tag}</span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderCategories = () => (
    <div className="stream-categories">
      <div className="categories-header">
        <h2>Категории</h2>
      </div>
      <div className="categories-grid">
        {categories.map(category => (
          <div key={category.id} className="category-card">
            <div className="category-icon">{category.icon}</div>
            <h3>{category.name}</h3>
            <button className="browse-button">Смотреть</button>
          </div>
        ))}
      </div>
    </div>
  );

  const renderFollowing = () => (
    <div className="stream-following">
      <div className="following-header">
        <h2>Подписки</h2>
      </div>
      <div className="following-list">
        {/* Здесь будет список подписок */}
      </div>
    </div>
  );

  if (isCreatingStream) {
    return (
      <StreamCreate
        onClose={() => setIsCreatingStream(false)}
      />
    );
  }

  if (selectedStream) {
    return (
      <StreamView 
        stream={selectedStream}
        onClose={() => setSelectedStream(null)}
      />
    );
  }

  return (
    <div className="stream-hub">
      <div className="stream-header">
        <div className={`site-type-dropdown ${activeSection === 'search' ? 'hidden' : ''}`}>
          <button 
            className="dropdown-button"
            onClick={() => setShowSiteTypeDropdown(!showSiteTypeDropdown)}
          >
            <BsCollectionPlay /> StreamHub
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
              <button 
                className="dropdown-item"
                onClick={() => {
                  if (typeof onSiteTypeChange === 'function') {
                    onSiteTypeChange('gameconnect');
                  }
                  setShowSiteTypeDropdown(false);
                }}
              >
                <BsController /> GameConnect
              </button>
              <button className="dropdown-item active">
                <BsCollectionPlay /> StreamHub
              </button>
              <button 
                className="dropdown-item"
                onClick={() => {
                  if (typeof onSiteTypeChange === 'function') {
                    onSiteTypeChange('eventhub');
                  }
                  setShowSiteTypeDropdown(false);
                }}
              >
                <BsCalendarEvent /> EventHub
              </button>
            </div>
          )}
        </div>

        <div className="stream-search">
          <BsSearch />
          <input type="text" placeholder="Поиск трансляций, стримеров, категорий..." />
        </div>

        <div className="stream-actions">
          <button 
            className="create-stream-button"
            onClick={() => setIsCreatingStream(true)}
          >
            <BsCameraVideoFill /> Создать трансляцию
          </button>
        </div>

        <div className="stream-nav">
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

      <div className="stream-content">
        <div className="stream-sidebar">
          <button 
            className={`sidebar-item ${activeSection === 'featured' ? 'active' : ''}`}
            onClick={() => setActiveSection('featured')}
          >
            <BsCollection /> Популярное
          </button>
          <button 
            className={`sidebar-item ${activeSection === 'categories' ? 'active' : ''}`}
            onClick={() => setActiveSection('categories')}
          >
            <BsTagsFill /> Категории
          </button>
          <button 
            className={`sidebar-item ${activeSection === 'following' ? 'active' : ''}`}
            onClick={() => setActiveSection('following')}
          >
            <BsPersonLinesFill /> Подписки
          </button>
          <button className="sidebar-item">
            <BsBookmarkFill /> Сохраненное
          </button>
          <button className="sidebar-item">
            <BsGraphUp /> Статистика
          </button>
          <button className="sidebar-item">
            <BsChatTextFill /> Чат
          </button>
        </div>

        <div className="stream-main">
          {activeSection === 'featured' && renderFeatured()}
          {activeSection === 'categories' && renderCategories()}
          {activeSection === 'following' && renderFollowing()}
        </div>

        <div className="stream-aside">
          <div className="profile-summary">
            <div className="profile-header">
              <img src={currentUser?.photo} alt={currentUser?.name} />
              <h3>{currentUser?.name}</h3>
              <p>{currentUser?.role}</p>
            </div>
            <div className="profile-stats">
              <div className="stat-item">
                <span className="stat-value">{currentUser?.stats?.followers}</span>
                <span className="stat-label">подписчиков</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">{currentUser?.stats?.totalViews}</span>
                <span className="stat-label">просмотров</span>
              </div>
            </div>
          </div>

          <div className="recommended-channels">
            <h3>Рекомендуемые каналы</h3>
            <div className="channels-list">
              {/* Здесь будет список рекомендуемых каналов */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StreamHub; 