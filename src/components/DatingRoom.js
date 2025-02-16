import React, { useState, useEffect } from 'react';
import './DatingRoom.css';
import { 
  BsMicFill, 
  BsCameraVideoFill,
  BsGearFill,
  BsStars,
  BsQuestionCircle,
  BsPeopleFill,
  BsHeartFill,
  BsFilterCircleFill,
  BsGeoAltFill,
  BsPersonFill,
  BsChat,
  BsChevronDown,
  BsSliders,
  BsSearch,
  BsEnvelopeFill,
  BsBellFill,
  BsImageFill,
  BsXLg,
  BsGenderFemale,
  BsGenderMale,
  BsCalendarEvent,
  BsGeoAlt,
  BsFilter,
  BsX,
  BsHeart,
  BsArrowRight,
  BsArrowLeft,
  BsLightningFill,
  BsPersonCircle,
  BsJournalText,
  BsBriefcaseFill,
  BsBook,
  BsController,
  BsChatDotsFill,
  BsCollectionPlay
} from 'react-icons/bs';
import ProfilePage from './ProfilePage';
import MessagesPage from './MessagesPage';
import QuestRoom from './QuestRoom';
import QuestService from '../services/QuestService';
import Stories from './Stories';
import { storiesData } from '../data/storiesData';
import UserIcon from './UserIcon';
import DatePlanner from './DatePlanner';
import RatingSystem from './RatingSystem';
import VoiceGreeting from './VoiceGreeting';
import InteractiveQuestionnaire from './InteractiveQuestionnaire';
import MiniBlog from './MiniBlog';
import VipStatus from './VipStatus';

function DatingRoom({ onSiteTypeChange }) {
  // Основные состояния
  const [showSiteTypeDropdown, setShowSiteTypeDropdown] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [profiles, setProfiles] = useState([
    {
      id: 1,
      name: 'Анна',
      age: 25,
      location: 'Москва',
      photo: 'https://placekitten.com/300/300',
      interests: ['Путешествия', 'Музыка', 'Спорт'],
      gender: 'female',
      about: 'Люблю путешествовать и открывать новые места',
      lastOnline: new Date(),
      isOnline: true
    },
    // Добавьте больше профилей для демонстрации
  ]);

  // Состояния для модальных окон
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [showMessagesModal, setShowMessagesModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showPhotosModal, setShowPhotosModal] = useState(false);
  const [showNotificationsModal, setShowNotificationsModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [currentPage, setCurrentPage] = useState('main'); // 'main', 'profile', 'messages'

  // Состояния для фильтров поиска
  const [searchFilters, setSearchFilters] = useState({
    ageRange: [18, 50],
    distance: 50,
    gender: 'all',
    withPhoto: true,
    onlineOnly: false,
    interests: []
  });

  // Состояния для чатов и уведомлений
  const [messages, setMessages] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [hasUnreadMessages, setHasUnreadMessages] = useState(false);
  const [hasUnreadNotifications, setHasUnreadNotifications] = useState(false);

  // Состояния для профиля пользователя
  const [userPhotos, setUserPhotos] = useState([]);
  const [userSettings, setUserSettings] = useState({
    showOnline: true,
    showDistance: true,
    showAge: true,
    notifications: {
      messages: true,
      matches: true,
      likes: true
    }
  });

  const [currentProfileIndex, setCurrentProfileIndex] = useState(0);
  const [mutualLikes, setMutualLikes] = useState([]);
  const [showMutualLikes, setShowMutualLikes] = useState(false);

  // Новые состояния для квеста
  const [showQuestRoom, setShowQuestRoom] = useState(false);
  const [currentQuest, setCurrentQuest] = useState(null);
  const [selectedPartner, setSelectedPartner] = useState(null);

  // Новые состояния для фотопревью
  const [showPhotoPreview, setShowPhotoPreview] = useState(false);

  // Новые состояния для новых функций
  const [showDatePlanner, setShowDatePlanner] = useState(false);
  const [showRating, setShowRating] = useState(false);
  const [showVoiceGreeting, setShowVoiceGreeting] = useState(false);
  const [showQuestionnaire, setShowQuestionnaire] = useState(false);
  const [showMiniBlog, setShowMiniBlog] = useState(false);
  const [showVipStatus, setShowVipStatus] = useState(false);

  // Функции для работы с профилями
  const handleLike = () => {
    const currentProfile = profiles[currentProfileIndex];
    // В реальном приложении здесь был бы API запрос
    console.log('Liked profile:', currentProfile.id);
    showNextProfile();
  };

  const handleSkip = () => {
    showNextProfile();
  };

  const showNextProfile = () => {
    if (currentProfileIndex < profiles.length - 1) {
      setCurrentProfileIndex(prev => prev + 1);
    } else {
      // Если профили закончились, можно начать сначала или показать сообщение
      setCurrentProfileIndex(0);
    }
  };

  const handleMessage = (profileId) => {
    // Логика отправки сообщения
    setShowMessagesModal(true);
    console.log('Messaging profile:', profileId);
  };

  const handleFilter = (filters) => {
    setSearchFilters(filters);
    // Применить фильтры к списку профилей
    // В реальном приложении здесь был бы API запрос
  };

  // Функции для работы с фото
  const handlePhotoUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Логика загрузки фото
      console.log('Uploading photo:', file);
    }
  };

  // Функции для настроек
  const updateSettings = (newSettings) => {
    setUserSettings(prev => ({
      ...prev,
      ...newSettings
    }));
  };

  // Функции для работы с сообщениями
  const sendMessage = (recipientId, message) => {
    // Логика отправки сообщения
    const newMessage = {
      id: Date.now(),
      recipientId,
      text: message,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, newMessage]);
  };

  // Модальные окна
  const renderModal = (title, content, isOpen, onClose, className) => {
    if (!isOpen) return null;

    return (
      <div className={`modal-overlay ${className}`} onClick={onClose}>
        <div className="modal" onClick={e => e.stopPropagation()}>
          <div className="modal-header">
            <h2>{title}</h2>
            <button className="close-button" onClick={onClose}>
              <BsXLg />
            </button>
          </div>
          <div className="modal-content">
            {content}
          </div>
        </div>
      </div>
    );
  };

  // Эффекты
  useEffect(() => {
    // Загрузка данных пользователя
    // В реальном приложении здесь был бы API запрос
    setCurrentUser({
      id: 'user1',
      name: 'Александр',
      age: 28,
      location: 'Москва',
      photos: [],
      interests: ['Спорт', 'Музыка', 'Путешествия']
    });
  }, []);

  useEffect(() => {
    // Проверка непрочитанных сообщений и уведомлений
    setHasUnreadMessages(messages.some(msg => !msg.read));
    setHasUnreadNotifications(notifications.some(notif => !notif.read));
  }, [messages, notifications]);

  const handleStartQuest = (partner) => {
    setSelectedPartner(partner);
    const availableQuests = QuestService.getQuests();
    setCurrentQuest(availableQuests[0]); // Для демо берем первый квест
    setShowQuestRoom(true);
  };

  if (currentPage === 'profile') {
    return <ProfilePage onBack={() => setCurrentPage('main')} />;
  }

  if (currentPage === 'messages') {
    return <MessagesPage onBack={() => setCurrentPage('main')} />;
  }

  if (showMutualLikes) {
    return (
      <div className="mutual-likes-page">
        <div className="mutual-likes-header">
          <button className="back-button" onClick={() => setShowMutualLikes(false)}>
            <BsArrowLeft /> Назад
          </button>
          <h1>Взаимные симпатии</h1>
        </div>
        <div className="mutual-likes-grid">
          {mutualLikes.map(profile => (
            <div key={profile.id} className="profile-card">
              <div className="profile-photo">
                <img src={profile.photo} alt={profile.name} />
                {profile.isOnline && <div className="online-status" />}
              </div>
              <div className="profile-info">
                <h3>{profile.name}, {profile.age}</h3>
                <p><BsGeoAltFill /> {profile.location}</p>
                <div className="profile-interests">
                  {profile.interests.map((interest, index) => (
                    <span key={index} className="interest-tag">{interest}</span>
                  ))}
                </div>
              </div>
              <div className="profile-actions">
                <button className="chat-button" onClick={() => handleMessage(profile.id)}>
                  <BsCameraVideoFill /> Начать чат
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (showQuestRoom) {
    return (
      <QuestRoom 
        onBack={() => setShowQuestRoom(false)}
        partner={selectedPartner}
        quest={currentQuest}
      />
    );
  }

  return (
    <div className="dating-room">
      <div className="dating-content">
        <div className={`site-type-dropdown ${showSearchModal ? 'hidden' : ''}`}>
          <button 
            className="dropdown-button"
            onClick={() => setShowSiteTypeDropdown(!showSiteTypeDropdown)}
          >
            <BsHeartFill /> Знакомства
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
              <button className="dropdown-item active">
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
              <button 
                className="dropdown-item"
                onClick={() => {
                  if (typeof onSiteTypeChange === 'function') {
                    onSiteTypeChange('streamhub');
                  }
                  setShowSiteTypeDropdown(false);
                }}
              >
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

        <div className="dating-header">
          <div className="site-name">
            Знакомства<span>.TOP</span>
          </div>
          <div className="dating-filters">
            <button className="filter-button" onClick={() => setShowSearchModal(true)}>
              <BsFilterCircleFill /> <span>Фильтры</span>
            </button>
            <button className="location-button">
              <BsGeoAltFill /> <span>Местоположение</span>
            </button>
          </div>
        </div>
        
        <div className="profile-carousel">
          <Stories stories={storiesData} currentUser={currentUser} />
          
          <div className="current-profile">
            {profiles[currentProfileIndex] && (
              <div className="profile-card large">
                <div className="profile-photo-container" onClick={() => setShowPhotoPreview(true)}>
                  <div className="profile-photo">
                    {profiles[currentProfileIndex].photo ? (
                      <img src={profiles[currentProfileIndex].photo} alt={profiles[currentProfileIndex].name} />
                    ) : (
                      <UserIcon size={150} color="#666" />
                    )}
                    {profiles[currentProfileIndex].isOnline && <div className="online-status" />}
                  </div>
                </div>
                
                <div className="profile-info">
                  <h3>{profiles[currentProfileIndex].name}, {profiles[currentProfileIndex].age}</h3>
                  <p><BsGeoAltFill /> {profiles[currentProfileIndex].location}</p>
                  <div className="profile-about">
                    <p>{profiles[currentProfileIndex].about}</p>
                  </div>
                  <div className="profile-interests">
                    {profiles[currentProfileIndex].interests.map((interest, index) => (
                      <span key={index} className="interest-tag">{interest}</span>
                    ))}
                  </div>
                  <button 
                    className="start-quest-button"
                    onClick={() => handleStartQuest(profiles[currentProfileIndex])}
                  >
                    <BsLightningFill /> Начать квест
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="profile-controls">
            <button className="control-button mutual-likes" onClick={() => setShowMutualLikes(true)}>
              <BsPeopleFill />
              {mutualLikes.length > 0 && (
                <span className="mutual-likes-count">{mutualLikes.length}</span>
              )}
            </button>
            <button className="control-button like" onClick={handleLike}>
              <BsHeart />
            </button>
            <button className="control-button skip" onClick={handleSkip}>
              <BsX />
            </button>
          </div>
        </div>

        <div className="bottom-menus">
          <button 
            className={`menu-item messages-button ${hasUnreadMessages ? 'has-unread' : ''}`}
            onClick={() => setCurrentPage('messages')}
          >
            <BsEnvelopeFill /> <span>Сообщения</span>
          </button>
          <button 
            className="menu-item profile-button"
            onClick={() => setCurrentPage('profile')}
          >
            <BsPersonFill /> <span>Мой профиль</span>
          </button>
          <button 
            className={`menu-item notifications-button ${hasUnreadNotifications ? 'has-unread' : ''}`}
            onClick={() => setShowNotificationsModal(true)}
          >
            <BsBellFill /> <span>Уведомления</span>
          </button>
          <button 
            className="menu-item settings-button"
            onClick={() => setShowSettingsModal(true)}
          >
            <BsSliders /> <span>Настройки</span>
          </button>
          <button 
            className="menu-item premium-button"
            onClick={() => setShowPremiumModal(true)}
          >
            <BsStars /> <span>Premium</span>
          </button>
          <button 
            className="menu-item blog-button"
            onClick={() => setShowMiniBlog(true)}
          >
            <BsJournalText /> <span>Блог</span>
          </button>
          <button 
            className="menu-item planner-button"
            onClick={() => setShowDatePlanner(true)}
          >
            <BsCalendarEvent /> <span>Свидания</span>
          </button>
          <button 
            className="menu-item vip-button"
            onClick={() => setShowVipStatus(true)}
          >
            <BsStars /> <span>VIP</span>
          </button>
        </div>
      </div>

      {/* Модальные окна */}
      {renderModal(
        'Фильтры поиска',
        <div className="search-content">
          <div className="filter-group">
            <label>Возраст</label>
            <div className="age-range">
              <input 
                type="number" 
                value={searchFilters.ageRange[0]}
                onChange={(e) => setSearchFilters(prev => ({
                  ...prev,
                  ageRange: [parseInt(e.target.value), prev.ageRange[1]]
                }))}
                min="18"
                max="100"
              />
              <span>—</span>
              <input 
                type="number"
                value={searchFilters.ageRange[1]}
                onChange={(e) => setSearchFilters(prev => ({
                  ...prev,
                  ageRange: [prev.ageRange[0], parseInt(e.target.value)]
                }))}
                min="18"
                max="100"
              />
            </div>
          </div>

          <div className="filter-group">
            <label>Расстояние</label>
            <input 
              type="range"
              min="1"
              max="100"
              value={searchFilters.distance}
              onChange={(e) => setSearchFilters(prev => ({
                ...prev,
                distance: parseInt(e.target.value)
              }))}
            />
            <div className="distance-value">{searchFilters.distance} км</div>
          </div>

          <div className="filter-group">
            <label>Пол</label>
            <select
              value={searchFilters.gender}
              onChange={(e) => setSearchFilters(prev => ({
                ...prev,
                gender: e.target.value
              }))}
            >
              <option value="all">Все</option>
              <option value="female">Женский</option>
              <option value="male">Мужской</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Дополнительно</label>
            <div className="filter-options">
              <label>
                <input 
                  type="checkbox"
                  checked={searchFilters.withPhoto}
                  onChange={(e) => setSearchFilters(prev => ({
                    ...prev,
                    withPhoto: e.target.checked
                  }))}
                />
                Только с фото
              </label>
              <label>
                <input 
                  type="checkbox"
                  checked={searchFilters.onlineOnly}
                  onChange={(e) => setSearchFilters(prev => ({
                    ...prev,
                    onlineOnly: e.target.checked
                  }))}
                />
                Только онлайн
              </label>
            </div>
          </div>
        </div>,
        showSearchModal,
        () => setShowSearchModal(false),
        'search-modal'
      )}

      {renderModal(
        'Фото',
        <div className="photos-content">
          <div className="photos-grid">
            {userPhotos.map((photo, index) => (
              <div key={index} className="photo-item">
                <img src={photo.url} alt={`Photo ${index + 1}`} />
                <button className="delete-photo-btn">Удалить</button>
              </div>
            ))}
            <div className="add-photo">
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                style={{ display: 'none' }}
                id="photo-upload"
              />
              <label htmlFor="photo-upload" className="upload-btn">
                + Добавить фото
              </label>
            </div>
          </div>
        </div>,
        showPhotosModal,
        () => setShowPhotosModal(false)
      )}

      {renderModal(
        'Уведомления',
        <div className="notifications-content">
          <div className="notifications-list">
            {notifications.map(notification => (
              <div key={notification.id} className="notification-item">
                <div className="notification-icon">
                  {notification.type === 'like' && <BsHeartFill />}
                  {notification.type === 'message' && <BsEnvelopeFill />}
                  {notification.type === 'match' && <BsStars />}
                </div>
                <div className="notification-text">{notification.text}</div>
                <div className="notification-time">
                  {new Date(notification.timestamp).toLocaleTimeString()}
                </div>
              </div>
            ))}
          </div>
        </div>,
        showNotificationsModal,
        () => setShowNotificationsModal(false)
      )}

      {renderModal(
        'Настройки',
        <div className="settings-content">
          <div className="settings-section">
            <h4>Приватность</h4>
            <div className="settings-options">
              <label>
                <input
                  type="checkbox"
                  checked={userSettings.showOnline}
                  onChange={(e) => updateSettings({ showOnline: e.target.checked })}
                />
                Показывать онлайн статус
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={userSettings.showDistance}
                  onChange={(e) => updateSettings({ showDistance: e.target.checked })}
                />
                Показывать расстояние
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={userSettings.showAge}
                  onChange={(e) => updateSettings({ showAge: e.target.checked })}
                />
                Показывать возраст
              </label>
            </div>
          </div>
          <div className="settings-section">
            <h4>Уведомления</h4>
            <div className="settings-options">
              <label>
                <input
                  type="checkbox"
                  checked={userSettings.notifications.messages}
                  onChange={(e) => updateSettings({
                    notifications: {
                      ...userSettings.notifications,
                      messages: e.target.checked
                    }
                  })}
                />
                Новые сообщения
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={userSettings.notifications.matches}
                  onChange={(e) => updateSettings({
                    notifications: {
                      ...userSettings.notifications,
                      matches: e.target.checked
                    }
                  })}
                />
                Новые совпадения
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={userSettings.notifications.likes}
                  onChange={(e) => updateSettings({
                    notifications: {
                      ...userSettings.notifications,
                      likes: e.target.checked
                    }
                  })}
                />
                Новые лайки
              </label>
            </div>
          </div>
        </div>,
        showSettingsModal,
        () => setShowSettingsModal(false)
      )}

      {renderModal(
        'Premium',
        <div className="premium-content">
          <div className="premium-features">
            <h3>Получите больше возможностей с Premium!</h3>
            <div className="feature-list">
              <div className="feature-item">
                <BsStars />
                <h4>Неограниченные лайки</h4>
                <p>Ставьте лайки без ограничений</p>
              </div>
              <div className="feature-item">
                <BsGeoAlt />
                <h4>Поиск по всему миру</h4>
                <p>Находите людей в любой точке мира</p>
              </div>
              <div className="feature-item">
                <BsHeartFill />
                <h4>Узнайте, кому вы нравитесь</h4>
                <p>Видите тех, кто поставил вам лайк</p>
              </div>
            </div>
            <button className="premium-subscribe-btn">
              Получить Premium
            </button>
          </div>
        </div>,
        showPremiumModal,
        () => setShowPremiumModal(false)
      )}

      {/* Photo Preview Modal */}
      {showPhotoPreview && (
        <div className="profile-photo-preview" onClick={() => setShowPhotoPreview(false)}>
          <button className="close-preview" onClick={() => setShowPhotoPreview(false)}>
            <BsX />
          </button>
          {profiles[currentProfileIndex].photo ? (
            <img 
              src={profiles[currentProfileIndex].photo} 
              alt={profiles[currentProfileIndex].name}
              onClick={(e) => e.stopPropagation()}
            />
          ) : (
            <div onClick={(e) => e.stopPropagation()}>
              <UserIcon size={300} color="#666" />
            </div>
          )}
        </div>
      )}

      {/* Модальные окна для новых функций */}
      {showDatePlanner && (
        <div className="modal-overlay">
          <DatePlanner 
            user={currentUser}
            onClose={() => setShowDatePlanner(false)}
          />
        </div>
      )}

      {showRating && (
        <div className="modal-overlay">
          <RatingSystem 
            user={currentUser}
            onClose={() => setShowRating(false)}
          />
        </div>
      )}

      {showVoiceGreeting && (
        <div className="modal-overlay">
          <VoiceGreeting 
            user={currentUser}
            onClose={() => setShowVoiceGreeting(false)}
          />
        </div>
      )}

      {showQuestionnaire && (
        <div className="modal-overlay">
          <InteractiveQuestionnaire 
            user={currentUser}
            onClose={() => setShowQuestionnaire(false)}
          />
        </div>
      )}

      {showMiniBlog && (
        <div className="modal-overlay">
          <MiniBlog 
            user={currentUser}
            onClose={() => setShowMiniBlog(false)}
          />
        </div>
      )}

      {showVipStatus && (
        <div className="modal-overlay">
          <VipStatus 
            user={currentUser}
            onClose={() => setShowVipStatus(false)}
          />
        </div>
      )}
    </div>
  );
}

export default DatingRoom; 