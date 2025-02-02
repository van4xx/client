import React, { useState, useEffect } from 'react';
import './DatePlanner.css';
import { 
  BsCalendar3, 
  BsGeoAlt, 
  BsStar, 
  BsClock,
  BsCash,
  BsHeart,
  BsArrowRight,
  BsX
} from 'react-icons/bs';
import ProfileFeatures from '../services/ProfileFeatures';

const DatePlanner = ({ onClose, partner }) => {
  const [locations, setLocations] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [dateTime, setDateTime] = useState(null);
  const [preferences, setPreferences] = useState({
    maxDistance: 10,
    priceLevel: '₽₽',
    type: 'all'
  });

  useEffect(() => {
    // Получаем геолокацию пользователя
    navigator.geolocation.getCurrentPosition(
      position => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
      },
      error => console.log(error),
      { enableHighAccuracy: true }
    );
  }, []);

  useEffect(() => {
    if (userLocation) {
      const recommendations = ProfileFeatures.getDateRecommendations(preferences, userLocation);
      setLocations(recommendations);
    }
  }, [userLocation, preferences]);

  const handleLocationSelect = (location) => {
    setSelectedLocation(location);
  };

  const handleDateTimeSelect = (datetime) => {
    setDateTime(datetime);
  };

  const handleSendInvite = () => {
    if (selectedLocation && dateTime) {
      // Отправка приглашения
      console.log('Sending date invite:', {
        location: selectedLocation,
        datetime: dateTime,
        partner
      });
      onClose();
    }
  };

  return (
    <div className="date-planner">
      <div className="planner-header">
        <h2>Планировщик свиданий</h2>
        <button className="close-button" onClick={onClose}>
          <BsX />
        </button>
      </div>

      <div className="planner-content">
        <div className="preferences-section">
          <h3>Предпочтения</h3>
          <div className="preferences-controls">
            <div className="preference-item">
              <label>Расстояние</label>
              <select 
                value={preferences.maxDistance}
                onChange={(e) => setPreferences({...preferences, maxDistance: parseInt(e.target.value)})}
              >
                <option value="5">До 5 км</option>
                <option value="10">До 10 км</option>
                <option value="20">До 20 км</option>
              </select>
            </div>
            <div className="preference-item">
              <label>Бюджет</label>
              <select 
                value={preferences.priceLevel}
                onChange={(e) => setPreferences({...preferences, priceLevel: e.target.value})}
              >
                <option value="₽">Экономно</option>
                <option value="₽₽">Средний</option>
                <option value="₽₽₽">Премиум</option>
              </select>
            </div>
            <div className="preference-item">
              <label>Тип места</label>
              <select 
                value={preferences.type}
                onChange={(e) => setPreferences({...preferences, type: e.target.value})}
              >
                <option value="all">Все</option>
                <option value="restaurant">Рестораны</option>
                <option value="activity">Активности</option>
                <option value="culture">Культура</option>
              </select>
            </div>
          </div>
        </div>

        <div className="locations-section">
          <h3>Рекомендуемые места</h3>
          <div className="locations-grid">
            {locations.map(location => (
              <div 
                key={location.id}
                className={`location-card ${selectedLocation?.id === location.id ? 'selected' : ''}`}
                onClick={() => handleLocationSelect(location)}
              >
                <div className="location-image">
                  <img src={location.photos[0]} alt={location.name} />
                  <div className="location-price">{location.priceLevel}</div>
                </div>
                <div className="location-info">
                  <h4>{location.name}</h4>
                  <p className="location-description">{location.description}</p>
                  <div className="location-features">
                    {location.features.map((feature, index) => (
                      <span key={index} className="feature-tag">{feature}</span>
                    ))}
                  </div>
                  <div className="location-meta">
                    <span className="rating">
                      <BsStar /> {location.rating}
                    </span>
                    <span className="distance">
                      <BsGeoAlt /> {Math.round(ProfileFeatures.calculateDistance(userLocation, location.location))} км
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {selectedLocation && (
          <div className="datetime-section">
            <h3>Выберите время</h3>
            <div className="datetime-picker">
              <input 
                type="datetime-local" 
                onChange={(e) => handleDateTimeSelect(e.target.value)}
                min={new Date().toISOString().slice(0, 16)}
              />
            </div>
          </div>
        )}

        <div className="planner-actions">
          <button 
            className="send-invite-button"
            disabled={!selectedLocation || !dateTime}
            onClick={handleSendInvite}
          >
            <BsHeart /> Отправить приглашение
          </button>
        </div>
      </div>
    </div>
  );
};

export default DatePlanner; 