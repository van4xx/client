import React, { useState, useEffect } from 'react';
import './ProfilePage.css';
import { 
  BsGearFill,
  BsPersonFill,
  BsGeoAltFill,
  BsCalendarEvent,
  BsHeartFill,
  BsImageFill,
  BsPencilFill,
  BsArrowLeft
} from 'react-icons/bs';

function ProfilePage({ onBack }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    age: '',
    location: '',
    about: '',
    interests: []
  });

  useEffect(() => {
    // Загрузка данных пользователя
    setCurrentUser({
      id: 'user1',
      name: 'Александр',
      age: 28,
      location: 'Москва',
      photos: [],
      interests: ['Спорт', 'Музыка', 'Путешествия'],
      about: 'Привет! Я люблю путешествовать и открывать новые места.',
      stats: {
        likes: 150,
        matches: 45,
        views: 320
      }
    });
  }, []);

  const handlePhotoUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Логика загрузки фото
      console.log('Uploading photo:', file);
    }
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    // Сохранение изменений профиля
    setCurrentUser(prev => ({
      ...prev,
      ...editForm
    }));
    setIsEditing(false);
  };

  return (
    <div className="profile-page">
      <div className="profile-header">
        <button className="back-button" onClick={onBack}>
          <BsArrowLeft /> Назад
        </button>
        <h1>Мой профиль</h1>
        <button className="edit-button" onClick={() => setIsEditing(!isEditing)}>
          <BsPencilFill />
        </button>
      </div>

      {currentUser && !isEditing ? (
        <div className="profile-content">
          <div className="profile-main">
            <div className="profile-photos">
              <div className="main-photo">
                <img src={currentUser.photos[0] || 'default-avatar.jpg'} alt="Profile" />
                <button className="change-photo-btn">
                  <BsImageFill /> Изменить фото
                </button>
              </div>
              <div className="photo-grid">
                {[...Array(5)].map((_, index) => (
                  <div key={index} className="photo-slot">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      id={`photo-upload-${index}`}
                      style={{ display: 'none' }}
                    />
                    <label htmlFor={`photo-upload-${index}`} className="photo-upload-label">
                      <BsImageFill />
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div className="profile-info">
              <h2>{currentUser.name}, {currentUser.age}</h2>
              <p className="location">
                <BsGeoAltFill /> {currentUser.location}
              </p>
              <div className="profile-stats">
                <div className="stat-item">
                  <BsHeartFill />
                  <span>{currentUser.stats.likes} лайков</span>
                </div>
                <div className="stat-item">
                  <BsPersonFill />
                  <span>{currentUser.stats.matches} совпадений</span>
                </div>
                <div className="stat-item">
                  <BsGearFill />
                  <span>{currentUser.stats.views} просмотров</span>
                </div>
              </div>
              <div className="profile-about">
                <h3>О себе</h3>
                <p>{currentUser.about}</p>
              </div>
              <div className="profile-interests">
                <h3>Интересы</h3>
                <div className="interests-list">
                  {currentUser.interests.map((interest, index) => (
                    <span key={index} className="interest-tag">{interest}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <form className="edit-profile-form" onSubmit={handleEditSubmit}>
          <div className="form-group">
            <label>Имя</label>
            <input
              type="text"
              value={editForm.name}
              onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
            />
          </div>
          <div className="form-group">
            <label>Возраст</label>
            <input
              type="number"
              value={editForm.age}
              onChange={(e) => setEditForm(prev => ({ ...prev, age: e.target.value }))}
            />
          </div>
          <div className="form-group">
            <label>Город</label>
            <input
              type="text"
              value={editForm.location}
              onChange={(e) => setEditForm(prev => ({ ...prev, location: e.target.value }))}
            />
          </div>
          <div className="form-group">
            <label>О себе</label>
            <textarea
              value={editForm.about}
              onChange={(e) => setEditForm(prev => ({ ...prev, about: e.target.value }))}
            />
          </div>
          <div className="form-group">
            <label>Интересы</label>
            <div className="interests-input">
              <input
                type="text"
                placeholder="Добавьте интерес и нажмите Enter"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    const newInterest = e.target.value.trim();
                    if (newInterest) {
                      setEditForm(prev => ({
                        ...prev,
                        interests: [...prev.interests, newInterest]
                      }));
                      e.target.value = '';
                    }
                  }
                }}
              />
              <div className="interests-list">
                {editForm.interests.map((interest, index) => (
                  <span key={index} className="interest-tag">
                    {interest}
                    <button
                      type="button"
                      onClick={() => setEditForm(prev => ({
                        ...prev,
                        interests: prev.interests.filter((_, i) => i !== index)
                      }))}
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>
          <div className="form-actions">
            <button type="button" onClick={() => setIsEditing(false)}>Отмена</button>
            <button type="submit">Сохранить</button>
          </div>
        </form>
      )}
    </div>
  );
}

export default ProfilePage; 