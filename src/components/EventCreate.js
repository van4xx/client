import React, { useState } from 'react';
import './EventCreate.css';
import {
  BsCalendarEvent,
  BsClock,
  BsGeoAlt,
  BsPeople,
  BsImages,
  BsLink45Deg,
  BsXCircle,
  BsCurrencyDollar,
  BsCheck2Circle
} from 'react-icons/bs';

function EventCreate({ onClose, onCreateEvent }) {
  const [eventData, setEventData] = useState({
    title: '',
    category: '',
    date: '',
    time: '',
    location: '',
    description: '',
    maxAttendees: '',
    price: '',
    isOnline: false,
    image: null,
    tags: []
  });

  const [newTag, setNewTag] = useState('');
  const [previewImage, setPreviewImage] = useState(null);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEventData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEventData(prev => ({ ...prev, image: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddTag = (e) => {
    if (e.key === 'Enter' && newTag.trim()) {
      setEventData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setEventData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onCreateEvent) {
      onCreateEvent({
        ...eventData,
        id: Date.now(),
        organizer: 'Текущий пользователь',
        attendees: 0
      });
    }
    onClose();
  };

  return (
    <div className="event-create-overlay">
      <div className="event-create">
        <div className="create-header">
          <h2>Создание мероприятия</h2>
          <button className="close-button" onClick={onClose}>
            <BsXCircle />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="create-form">
          <div className="form-grid">
            <div className="form-left">
              <div className="form-group">
                <label>Название мероприятия</label>
                <input
                  type="text"
                  name="title"
                  value={eventData.title}
                  onChange={handleInputChange}
                  placeholder="Введите название мероприятия"
                  required
                />
              </div>

              <div className="form-group">
                <label>Категория</label>
                <select
                  name="category"
                  value={eventData.category}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Выберите категорию</option>
                  <option value="education">Образование</option>
                  <option value="gaming">Игры</option>
                  <option value="professional">Профессии</option>
                  <option value="entertainment">Развлечения</option>
                </select>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Дата</label>
                  <input
                    type="date"
                    name="date"
                    value={eventData.date}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Время</label>
                  <input
                    type="time"
                    name="time"
                    value={eventData.time}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Место проведения</label>
                <input
                  type="text"
                  name="location"
                  value={eventData.location}
                  onChange={handleInputChange}
                  placeholder={eventData.isOnline ? 'Ссылка на онлайн-встречу' : 'Адрес проведения'}
                  required
                />
              </div>

              <div className="form-group">
                <label>Описание</label>
                <textarea
                  name="description"
                  value={eventData.description}
                  onChange={handleInputChange}
                  placeholder="Опишите ваше мероприятие"
                  required
                />
              </div>
            </div>

            <div className="form-right">
              <div className="form-group">
                <label>Изображение</label>
                <div className="image-upload">
                  {previewImage ? (
                    <div className="image-preview">
                      <img src={previewImage} alt="Preview" />
                      <button
                        type="button"
                        className="remove-image"
                        onClick={() => {
                          setPreviewImage(null);
                          setEventData(prev => ({ ...prev, image: null }));
                        }}
                      >
                        <BsXCircle />
                      </button>
                    </div>
                  ) : (
                    <label className="upload-label">
                      <BsImages />
                      <span>Загрузить изображение</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        style={{ display: 'none' }}
                      />
                    </label>
                  )}
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Максимум участников</label>
                  <input
                    type="number"
                    name="maxAttendees"
                    value={eventData.maxAttendees}
                    onChange={handleInputChange}
                    min="1"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Стоимость (₽)</label>
                  <input
                    type="number"
                    name="price"
                    value={eventData.price}
                    onChange={handleInputChange}
                    min="0"
                    placeholder="0 = Бесплатно"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="isOnline"
                    checked={eventData.isOnline}
                    onChange={handleInputChange}
                  />
                  Онлайн мероприятие
                </label>
              </div>

              <div className="form-group">
                <label>Теги</label>
                <input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyPress={handleAddTag}
                  placeholder="Добавьте теги (Enter)"
                />
                <div className="tags-list">
                  {eventData.tags.map((tag, index) => (
                    <span key={index} className="tag">
                      {tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="cancel-button" onClick={onClose}>
              Отмена
            </button>
            <button type="submit" className="create-button">
              <BsCheck2Circle /> Создать мероприятие
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EventCreate; 