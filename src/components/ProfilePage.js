import React, { useState } from 'react';
import './ProfilePage.css';
import { 
  BsArrowLeft, 
  BsCamera, 
  BsPencil, 
  BsSpotify, 
  BsInstagram,
  BsTrophy,
  BsCalendar3,
  BsGeoAlt,
  BsHeart,
  BsChatDots,
  BsEye,
  BsStar,
  BsMusicNote,
  BsLink45Deg,
  BsImage,
  BsMic
} from 'react-icons/bs';
import UserIcon from './UserIcon';

const ProfilePage = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState('photos');
  const [isEditing, setIsEditing] = useState(false);
  
  const [profile, setProfile] = useState({
    name: 'Александр',
    age: 28,
    location: 'Москва',
    bio: 'Люблю путешествия, музыку и активный отдых. Ищу человека со схожими интересами.',
    photos: ['https://source.unsplash.com/random/400x400?portrait'],
    interests: ['Путешествия', 'Музыка', 'Спорт', 'Кино', 'Фотография'],
    achievements: [
      { id: 1, title: 'Популярный профиль', icon: '🌟', description: '1000+ просмотров' },
      { id: 2, title: 'Верифицирован', icon: '✓', description: 'Подтвержденный профиль' },
      { id: 3, title: 'Активный пользователь', icon: '🔥', description: '30 дней подряд' }
    ],
    stats: {
      views: 1234,
      likes: 89,
      matches: 12
    },
    spotify: {
      connected: true,
      topArtists: ['The Weeknd', 'Drake', 'Ed Sheeran'],
      favoriteTrack: 'Blinding Lights - The Weeknd'
    },
    schedule: {
      availability: [
        { day: 'ПН', time: '19:00-22:00' },
        { day: 'СБ', time: '12:00-20:00' },
        { day: 'ВС', time: '12:00-20:00' }
      ]
    },
    verification: {
      photo: true,
      phone: true,
      social: true
    }
  });

  const renderPhotoGallery = () => (
    <div className="profile-photos">
      <div className="photo-grid">
        {profile.photos.map((photo, index) => (
          <div key={index} className="photo-item">
            <img src={photo} alt={`Фото ${index + 1}`} />
            {isEditing && (
              <div className="photo-actions">
                <button className="delete-photo"><BsCamera /></button>
              </div>
            )}
          </div>
        ))}
        {isEditing && (
          <div className="add-photo">
            <BsCamera />
            <span>Добавить фото</span>
          </div>
        )}
      </div>
    </div>
  );

  const renderAchievements = () => (
    <div className="profile-achievements">
      <h3>Достижения</h3>
      <div className="achievements-grid">
        {profile.achievements.map(achievement => (
          <div key={achievement.id} className="achievement-card">
            <div className="achievement-icon">{achievement.icon}</div>
            <h4>{achievement.title}</h4>
            <p>{achievement.description}</p>
          </div>
        ))}
      </div>
    </div>
  );

  const renderStats = () => (
    <div className="profile-stats">
      <div className="stat-item">
        <BsEye />
        <span className="stat-value">{profile.stats.views}</span>
        <span className="stat-label">просмотров</span>
      </div>
      <div className="stat-item">
        <BsHeart />
        <span className="stat-value">{profile.stats.likes}</span>
        <span className="stat-label">лайков</span>
      </div>
      <div className="stat-item">
        <BsChatDots />
        <span className="stat-value">{profile.stats.matches}</span>
        <span className="stat-label">мэтчей</span>
      </div>
    </div>
  );

  const renderSpotify = () => (
    <div className="spotify-integration">
      <div className="section-header">
        <BsSpotify />
        <h3>Музыкальные предпочтения</h3>
      </div>
      <div className="spotify-content">
        <div className="current-track">
          <BsMusicNote />
          <span>{profile.spotify.favoriteTrack}</span>
        </div>
        <div className="top-artists">
          <h4>Любимые исполнители:</h4>
          <ul>
            {profile.spotify.topArtists.map((artist, index) => (
              <li key={index}>{artist}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );

  const renderSchedule = () => (
    <div className="availability-schedule">
      <div className="section-header">
        <BsCalendar3 />
        <h3>Расписание для встреч</h3>
      </div>
      <div className="schedule-grid">
        {profile.schedule.availability.map((slot, index) => (
          <div key={index} className="schedule-slot">
            <span className="day">{slot.day}</span>
            <span className="time">{slot.time}</span>
          </div>
        ))}
      </div>
    </div>
  );

  const renderVerification = () => (
    <div className="verification-status">
      <h3>Верификация</h3>
      <div className="verification-items">
        <div className={`verification-item ${profile.verification.photo ? 'verified' : ''}`}>
          <BsCamera />
          <span>Фото</span>
        </div>
        <div className={`verification-item ${profile.verification.phone ? 'verified' : ''}`}>
          <BsLink45Deg />
          <span>Телефон</span>
        </div>
        <div className={`verification-item ${profile.verification.social ? 'verified' : ''}`}>
          <BsInstagram />
          <span>Соцсети</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="profile-page">
      <div className="profile-header">
        <button className="back-button" onClick={onBack}>
          <BsArrowLeft /> Назад
        </button>
        <button 
          className="edit-button"
          onClick={() => setIsEditing(!isEditing)}
        >
          <BsPencil /> {isEditing ? 'Сохранить' : 'Редактировать'}
        </button>
      </div>

      <div className="profile-content">
        <div className="profile-main">
          <div className="profile-photo-large">
            {profile.photos[0] ? (
              <img src={profile.photos[0]} alt={profile.name} />
            ) : (
              <UserIcon size={200} />
            )}
            {isEditing && (
              <button className="change-photo">
                <BsCamera />
              </button>
            )}
          </div>

          <div className="profile-info-main">
            <h1>{profile.name}, {profile.age}</h1>
            <p className="location"><BsGeoAlt /> {profile.location}</p>
            <div className="profile-bio">
              {isEditing ? (
                <textarea 
                  value={profile.bio}
                  onChange={(e) => setProfile({...profile, bio: e.target.value})}
                />
              ) : (
                <p>{profile.bio}</p>
              )}
            </div>
          </div>

          {renderStats()}
          {renderVerification()}

          <div className="profile-tabs">
            <button 
              className={`tab ${activeTab === 'photos' ? 'active' : ''}`}
              onClick={() => setActiveTab('photos')}
            >
              <BsImage /> Фото
            </button>
            <button 
              className={`tab ${activeTab === 'achievements' ? 'active' : ''}`}
              onClick={() => setActiveTab('achievements')}
            >
              <BsTrophy /> Достижения
            </button>
            <button 
              className={`tab ${activeTab === 'interests' ? 'active' : ''}`}
              onClick={() => setActiveTab('interests')}
            >
              <BsStar /> Интересы
            </button>
          </div>

          <div className="tab-content">
            {activeTab === 'photos' && renderPhotoGallery()}
            {activeTab === 'achievements' && renderAchievements()}
            {activeTab === 'interests' && (
              <div className="profile-interests">
                {profile.interests.map((interest, index) => (
                  <span key={index} className="interest-tag">{interest}</span>
                ))}
                {isEditing && (
                  <button className="add-interest">+ Добавить</button>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="profile-sidebar">
          {renderSpotify()}
          {renderSchedule()}
          
          <div className="voice-greeting">
            <div className="section-header">
              <BsMic />
              <h3>Голосовое приветствие</h3>
            </div>
            <button className="record-voice">
              {isEditing ? 'Записать приветствие' : 'Прослушать'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage; 