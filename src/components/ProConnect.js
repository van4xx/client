import React, { useState, useEffect } from 'react';
import './ProConnect.css';
import {
  BsPersonFill,
  BsBriefcaseFill,
  BsGearFill,
  BsEnvelopeFill,
  BsBellFill,
  BsSearch,
  BsGrid,
  BsBookmarkFill,
  BsGraphUp,
  BsLightningFill,
  BsPeopleFill,
  BsChatDotsFill,
  BsCalendarEventFill,
  BsAwardFill,
  BsX,
  BsChevronDown,
  BsStarFill,
  BsHeartFill
} from 'react-icons/bs';

function ProConnect({ onSiteTypeChange }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [showSiteTypeDropdown, setShowSiteTypeDropdown] = useState(false);
  const [activeSection, setActiveSection] = useState('feed');
  const [professionals, setProfessionals] = useState([
    {
      id: 1,
      name: 'Елена Петрова',
      position: 'Senior Product Manager',
      company: 'Tech Solutions Inc.',
      photo: 'https://placekitten.com/301/301',
      skills: ['Product Management', 'Agile', 'Team Leadership'],
      experience: '8+ years',
      connections: 500,
      about: 'Опытный продакт-менеджер с фокусом на B2B решения'
    },
    // Добавьте больше профессионалов
  ]);

  useEffect(() => {
    // Загрузка данных пользователя
    setCurrentUser({
      id: 'user1',
      name: 'Александр Иванов',
      position: 'Frontend Developer',
      company: 'Digital Innovations',
      connections: 287,
      skills: ['React', 'TypeScript', 'Node.js'],
      photo: 'https://placekitten.com/300/300'
    });
  }, []);

  const renderFeed = () => (
    <div className="pro-feed">
      <div className="post-composer">
        <img src={currentUser?.photo} alt={currentUser?.name} />
        <button className="compose-button">
          Поделитесь профессиональным опытом...
        </button>
      </div>
      
      <div className="feed-filters">
        <button className="filter-button active">Популярное</button>
        <button className="filter-button">Последнее</button>
        <button className="filter-button">Моя сеть</button>
      </div>

      <div className="posts-list">
        {/* Здесь будут посты */}
      </div>
    </div>
  );

  const renderNetwork = () => (
    <div className="pro-network">
      <div className="network-stats">
        <div className="stat-card">
          <BsPeopleFill />
          <h3>{currentUser?.connections}</h3>
          <p>Контактов</p>
        </div>
        <div className="stat-card">
          <BsGraphUp />
          <h3>45</h3>
          <p>Просмотров профиля</p>
        </div>
        <div className="stat-card">
          <BsAwardFill />
          <h3>12</h3>
          <p>Рекомендаций</p>
        </div>
      </div>

      <div className="network-suggestions">
        <h3>Рекомендуемые контакты</h3>
        <div className="professionals-grid">
          {professionals.map(pro => (
            <div key={pro.id} className="professional-card">
              <img src={pro.photo} alt={pro.name} />
              <h4>{pro.name}</h4>
              <p className="position">{pro.position}</p>
              <p className="company">{pro.company}</p>
              <div className="skills">
                {pro.skills.map((skill, index) => (
                  <span key={index} className="skill-tag">{skill}</span>
                ))}
              </div>
              <button className="connect-button">
                <BsPeopleFill /> Связаться
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderJobs = () => (
    <div className="pro-jobs">
      <div className="jobs-filters">
        <input 
          type="text" 
          placeholder="Поиск вакансий..."
          className="job-search"
        />
        <div className="filter-tags">
          <span className="filter-tag">Remote</span>
          <span className="filter-tag">Full-time</span>
          <span className="filter-tag">Tech</span>
        </div>
      </div>

      <div className="jobs-list">
        {/* Здесь будут вакансии */}
      </div>
    </div>
  );

  const renderMessages = () => (
    <div className="pro-messages">
      <div className="messages-list">
        {/* Здесь будут сообщения */}
      </div>
    </div>
  );

  return (
    <div className="pro-connect">
      <div className="pro-header">
        <div className={`site-type-dropdown ${activeSection === 'search' ? 'hidden' : ''}`}>
          <button 
            className="dropdown-button"
            onClick={() => setShowSiteTypeDropdown(!showSiteTypeDropdown)}
          >
            <BsBriefcaseFill /> ProConnect
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
              <button className="dropdown-item active">
                <BsBriefcaseFill /> ProConnect
              </button>
            </div>
          )}
        </div>

        <div className="pro-search">
          <BsSearch />
          <input type="text" placeholder="Поиск специалистов, компаний, вакансий..." />
        </div>

        <div className="pro-nav">
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

      <div className="pro-content">
        <div className="pro-sidebar">
          <button 
            className={`sidebar-item ${activeSection === 'feed' ? 'active' : ''}`}
            onClick={() => setActiveSection('feed')}
          >
            <BsGrid /> Лента
          </button>
          <button 
            className={`sidebar-item ${activeSection === 'network' ? 'active' : ''}`}
            onClick={() => setActiveSection('network')}
          >
            <BsPeopleFill /> Контакты
          </button>
          <button 
            className={`sidebar-item ${activeSection === 'jobs' ? 'active' : ''}`}
            onClick={() => setActiveSection('jobs')}
          >
            <BsBriefcaseFill /> Вакансии
          </button>
          <button 
            className={`sidebar-item ${activeSection === 'messages' ? 'active' : ''}`}
            onClick={() => setActiveSection('messages')}
          >
            <BsEnvelopeFill /> Сообщения
          </button>
          <button className="sidebar-item">
            <BsBookmarkFill /> Сохраненное
          </button>
          <button className="sidebar-item">
            <BsCalendarEventFill /> События
          </button>
        </div>

        <div className="pro-main">
          {activeSection === 'feed' && renderFeed()}
          {activeSection === 'network' && renderNetwork()}
          {activeSection === 'jobs' && renderJobs()}
          {activeSection === 'messages' && renderMessages()}
        </div>

        <div className="pro-aside">
          <div className="profile-summary">
            <div className="profile-header">
              <img src={currentUser?.photo} alt={currentUser?.name} />
              <h3>{currentUser?.name}</h3>
              <p>{currentUser?.position}</p>
            </div>
            <div className="profile-stats">
              <div className="stat-item">
                <span className="stat-value">{currentUser?.connections}</span>
                <span className="stat-label">контактов</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">45</span>
                <span className="stat-label">просмотров</span>
              </div>
            </div>
          </div>

          <div className="trending-topics">
            <h3>Актуальные темы</h3>
            <div className="topic-list">
              <div className="topic-item">
                <span className="topic-tag">#технологии</span>
                <p>Тренды в IT 2024</p>
              </div>
              <div className="topic-item">
                <span className="topic-tag">#карьера</span>
                <p>Развитие soft skills</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProConnect; 