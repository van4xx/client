import React, { useState } from 'react';
import './VipStatus.css';
import { 
  BsX, 
  BsAwardFill, 
  BsEyeFill,
  BsBarChartFill,
  BsShieldFill,
  BsSpeedometer,
  BsGraphUp,
  BsPeopleFill,
  BsHeartFill,
  BsCalendarCheckFill,
  BsGearFill,
  BsStarFill,
  BsCheckCircleFill
} from 'react-icons/bs';
import ProfileFeatures from '../services/ProfileFeatures';

const VipStatus = ({ user, onClose }) => {
  const [activeTab, setActiveTab] = useState('vip'); // 'vip' или 'stats'
  const [isInvisible, setIsInvisible] = useState(false);

  const stats = ProfileFeatures.getProfileStats(user.id);
  const vipFeatures = ProfileFeatures.getVipFeatures(user.id);

  const renderVipFeatures = () => (
    <div className="vip-features">
      <div className="vip-header">
        <BsAwardFill className="vip-icon" />
        <h3>VIP-статус</h3>
        <p>Получите доступ к премиум возможностям</p>
      </div>

      <div className="features-grid">
        <div className="feature-card">
          <BsEyeFill />
          <h4>Невидимый режим</h4>
          <p>Просматривайте профили незаметно</p>
          <div className="feature-toggle">
            <label className="switch">
              <input 
                type="checkbox"
                checked={isInvisible}
                onChange={(e) => setIsInvisible(e.target.checked)}
              />
              <span className="slider" />
            </label>
          </div>
        </div>

        <div className="feature-card">
          <BsSpeedometer />
          <h4>Приоритет в поиске</h4>
          <p>Ваш профиль будет показываться чаще</p>
          <div className="feature-status active">
            <BsCheckCircleFill /> Активно
          </div>
        </div>

        <div className="feature-card">
          <BsBarChartFill />
          <h4>Расширенная статистика</h4>
          <p>Подробная аналитика профиля</p>
          <div className="feature-status active">
            <BsCheckCircleFill /> Активно
          </div>
        </div>

        <div className="feature-card">
          <BsShieldFill />
          <h4>Особые значки</h4>
          <p>Выделитесь среди других</p>
          <div className="badges-preview">
            {Object.values(ProfileFeatures.badges).map(badge => (
              <span key={badge.id} className="badge" title={badge.description}>
                {badge.icon}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderStatistics = () => (
    <div className="statistics">
      <div className="stats-header">
        <BsGraphUp className="stats-icon" />
        <h3>Статистика профиля</h3>
        <p>Подробная аналитика вашей активности</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card views">
          <div className="stat-header">
            <BsEyeFill />
            <h4>Просмотры</h4>
          </div>
          <div className="stat-numbers">
            <div className="main-stat">{stats.views.total}</div>
            <div className="sub-stat">+{stats.views.today} сегодня</div>
          </div>
        </div>

        <div className="stat-card likes">
          <div className="stat-header">
            <BsHeartFill />
            <h4>Лайки</h4>
          </div>
          <div className="stat-numbers">
            <div className="main-stat">{stats.likes.received}</div>
            <div className="sub-stat">{stats.likes.given} отправлено</div>
          </div>
        </div>

        <div className="stat-card matches">
          <div className="stat-header">
            <BsPeopleFill />
            <h4>Совпадения</h4>
          </div>
          <div className="stat-numbers">
            <div className="main-stat">{stats.likes.matches}</div>
            <div className="sub-stat">за всё время</div>
          </div>
        </div>

        <div className="stat-card activity">
          <div className="stat-header">
            <BsCalendarCheckFill />
            <h4>Активность</h4>
          </div>
          <div className="stat-numbers">
            <div className="main-stat">{stats.activity.messages}</div>
            <div className="sub-stat">сообщений</div>
          </div>
        </div>
      </div>

      <div className="popularity-section">
        <h4>Рейтинг популярности</h4>
        <div className="popularity-bar">
          <div 
            className="popularity-progress"
            style={{ width: `${stats.popularity.percentile}%` }}
          />
          <span className="popularity-label">
            Вы входите в топ {100 - stats.popularity.percentile}% пользователей
          </span>
        </div>
      </div>

      <div className="activity-chart">
        <h4>График активности</h4>
        <div className="chart-container">
          {/* Здесь можно добавить график активности */}
        </div>
      </div>
    </div>
  );

  return (
    <div className="vip-status">
      <div className="vip-header">
        <h2>VIP и Статистика</h2>
        <button className="close-button" onClick={onClose}>
          <BsX />
        </button>
      </div>

      <div className="vip-content">
        <div className="vip-tabs">
          <button 
            className={`tab ${activeTab === 'vip' ? 'active' : ''}`}
            onClick={() => setActiveTab('vip')}
          >
            <BsAwardFill /> VIP-статус
          </button>
          <button 
            className={`tab ${activeTab === 'stats' ? 'active' : ''}`}
            onClick={() => setActiveTab('stats')}
          >
            <BsBarChartFill /> Статистика
          </button>
        </div>

        <div className="tab-content">
          {activeTab === 'vip' ? renderVipFeatures() : renderStatistics()}
        </div>
      </div>
    </div>
  );
};

export default VipStatus; 