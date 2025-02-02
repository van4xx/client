import React, { useState } from 'react';
import './RatingSystem.css';
import { 
  BsStar, 
  BsStarFill, 
  BsStarHalf,
  BsChat,
  BsShieldCheck,
  BsX,
  BsCheckCircle
} from 'react-icons/bs';
import ProfileFeatures from '../services/ProfileFeatures';

const RatingSystem = ({ user, onClose }) => {
  const [activeTab, setActiveTab] = useState('rating'); // 'rating' или 'reviews'
  const [ratings, setRatings] = useState({
    communication: 0,
    reliability: 0,
    photos: 0
  });
  const [review, setReview] = useState('');
  const [hoveredRating, setHoveredRating] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const handleRatingChange = (category, value) => {
    setRatings(prev => ({
      ...prev,
      [category]: value
    }));
  };

  const handleSubmit = () => {
    const reviewData = {
      userId: user.id,
      ratings,
      review,
      timestamp: new Date()
    };
    
    // Здесь будет отправка на сервер
    console.log('Submitting review:', reviewData);
    setSubmitted(true);
    
    setTimeout(() => {
      onClose();
    }, 2000);
  };

  const renderStars = (category, currentRating) => {
    return (
      <div className="stars-container">
        {[1, 2, 3, 4, 5].map(star => (
          <span 
            key={star}
            className="star"
            onMouseEnter={() => setHoveredRating({ category, value: star })}
            onMouseLeave={() => setHoveredRating(null)}
            onClick={() => handleRatingChange(category, star)}
          >
            {star <= (hoveredRating?.category === category ? hoveredRating.value : currentRating) ? (
              <BsStarFill className="filled" />
            ) : (
              <BsStar />
            )}
          </span>
        ))}
      </div>
    );
  };

  return (
    <div className="rating-system">
      <div className="rating-header">
        <h2>Оценка пользователя</h2>
        <button className="close-button" onClick={onClose}>
          <BsX />
        </button>
      </div>

      {!submitted ? (
        <div className="rating-content">
          <div className="user-info">
            <img src={user.photo} alt={user.name} className="user-photo" />
            <div className="user-details">
              <h3>{user.name}</h3>
              <div className="verification-badge">
                <BsShieldCheck /> Проверенный профиль
              </div>
            </div>
          </div>

          <div className="rating-tabs">
            <button 
              className={`tab ${activeTab === 'rating' ? 'active' : ''}`}
              onClick={() => setActiveTab('rating')}
            >
              <BsStar /> Оценка
            </button>
            <button 
              className={`tab ${activeTab === 'reviews' ? 'active' : ''}`}
              onClick={() => setActiveTab('reviews')}
            >
              <BsChat /> Отзыв
            </button>
          </div>

          {activeTab === 'rating' && (
            <div className="rating-categories">
              {Object.entries(ProfileFeatures.ratings).map(([key, value]) => (
                <div key={key} className="rating-category">
                  <div className="category-header">
                    <span className="category-icon">{value.icon}</span>
                    <div className="category-info">
                      <h4>{value.name}</h4>
                      <p>{value.description}</p>
                    </div>
                  </div>
                  {renderStars(key, ratings[key])}
                </div>
              ))}
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="review-section">
              <textarea
                placeholder="Напишите ваш отзыв..."
                value={review}
                onChange={(e) => setReview(e.target.value)}
              />
            </div>
          )}

          <div className="rating-actions">
            <button 
              className="submit-button"
              onClick={handleSubmit}
              disabled={Object.values(ratings).some(r => r === 0) || (activeTab === 'reviews' && !review.trim())}
            >
              Отправить оценку
            </button>
          </div>
        </div>
      ) : (
        <div className="success-message">
          <BsCheckCircle />
          <h3>Спасибо за вашу оценку!</h3>
          <p>Ваш отзыв поможет другим пользователям.</p>
        </div>
      )}
    </div>
  );
};

export default RatingSystem; 