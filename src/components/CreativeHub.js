import React, { useState, useEffect } from 'react';
import './CreativeHub.css';
import {
  BsPalette,
  BsChevronDown,
  BsSearch,
  BsGrid,
  BsHeartFill,
  BsChatDotsFill,
  BsBook,
  BsController,
  BsBriefcaseFill,
  BsCollectionPlay,
  BsCalendarEvent,
  BsLaptop,
  BsBriefcase,
  BsCamera,
  BsImage,
  BsVectorPen,
  BsMusic,
  BsFilm,
  BsPlus,
  BsShare,
  BsBookmark,
  BsThreeDots,
  BsEnvelopeFill,
  BsBellFill,
  BsGearFill,
  BsEye,
  BsChat,
  BsHeart,
  BsTrophy,
  BsPeople
} from 'react-icons/bs';
import { useNavigate } from 'react-router-dom';

function CreativeHub({ onSiteTypeChange }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [showSiteTypeDropdown, setShowSiteTypeDropdown] = useState(false);
  const [activeSection, setActiveSection] = useState('gallery');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const navigate = useNavigate();

  const [artworks, setArtworks] = useState([
    {
      id: 1,
      title: 'Городской пейзаж',
      artist: 'Анна Смирнова',
      category: 'digital',
      image: 'https://placekitten.com/800/600',
      likes: 245,
      views: 1200,
      comments: 18,
      price: '5000 ₽',
      tags: ['Пейзаж', 'Диджитал', 'Город'],
      description: 'Городской пейзаж в стиле киберпанк'
    },
    {
      id: 2,
      title: 'Портрет незнакомки',
      artist: 'Максим Петров',
      category: 'traditional',
      image: 'https://placekitten.com/801/600',
      likes: 189,
      views: 850,
      comments: 12,
      price: '3000 ₽',
      tags: ['Портрет', 'Масло', 'Живопись'],
      description: 'Портрет маслом в классическом стиле'
    },
    {
      id: 3,
      title: 'Абстрактная композиция',
      artist: 'John Smith',
      category: 'abstract',
      image: 'https://placekitten.com/802/600',
      likes: 156,
      views: 720,
      comments: 8,
      price: '4000 ₽',
      tags: ['Абстракция', 'Современное искусство'],
      description: 'Абстрактная композиция в смешанной технике'
    }
  ]);

  const categories = [
    { id: 'all', name: 'Все категории', icon: <BsGrid /> },
    { id: 'digital', name: 'Диджитал', icon: <BsVectorPen /> },
    { id: 'traditional', name: 'Традиционное', icon: <BsPalette /> },
    { id: 'photography', name: 'Фотография', icon: <BsCamera /> },
    { id: 'abstract', name: 'Абстрактное', icon: <BsImage /> }
  ];

  useEffect(() => {
    setCurrentUser({
      id: 'user1',
      name: 'Александр',
      photo: 'https://placekitten.com/100/100'
    });
  }, []);

  const handleSiteChange = (type) => {
    onSiteTypeChange(type);
    navigate(`/${type}`);
  };

  const renderArtworkCard = (artwork) => (
    <div key={artwork.id} className="artwork-card">
      <div className="artwork-image">
        <img src={artwork.image} alt={artwork.title} />
        <div className="artwork-overlay">
          <div className="artwork-actions">
            <button className="action-button">
              <BsHeart /> {artwork.likes}
            </button>
            <button className="action-button">
              <BsChat /> {artwork.comments}
            </button>
            <button className="action-button">
              <BsEye /> {artwork.views}
            </button>
          </div>
        </div>
      </div>
      <div className="artwork-info">
        <div className="artwork-header">
          <h3>{artwork.title}</h3>
          <div className="artwork-buttons">
            <button className="icon-button">
              <BsBookmark />
            </button>
            <button className="icon-button">
              <BsShare />
            </button>
          </div>
        </div>
        <div className="artist-info">
          <img src="https://placekitten.com/50/50" alt={artwork.artist} className="artist-avatar" />
          <span>{artwork.artist}</span>
        </div>
        <div className="artwork-tags">
          {artwork.tags.map((tag, index) => (
            <span key={index} className="tag">{tag}</span>
          ))}
        </div>
        <div className="artwork-footer">
          <div className="artwork-price">{artwork.price}</div>
          <button className="buy-button">Купить</button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="creative-hub">
      <div className="creative-header">
        <div className="site-type-dropdown">
          <button 
            className="dropdown-button"
            onClick={() => setShowSiteTypeDropdown(!showSiteTypeDropdown)}
          >
            <BsPalette /> CreativeHub
            <BsChevronDown className={`chevron ${showSiteTypeDropdown ? 'open' : ''}`} />
          </button>
          {showSiteTypeDropdown && (
            <div className="dropdown-menu">
              <button 
                className="dropdown-item"
                onClick={() => {
                  handleSiteChange('chat');
                  setShowSiteTypeDropdown(false);
                }}
              >
                <BsChatDotsFill /> Рулетка
              </button>
              <button 
                className="dropdown-item"
                onClick={() => {
                  handleSiteChange('dating');
                  setShowSiteTypeDropdown(false);
                }}
              >
                <BsHeartFill /> Знакомства
              </button>
              <button 
                className="dropdown-item"
                onClick={() => {
                  handleSiteChange('proconnect');
                  setShowSiteTypeDropdown(false);
                }}
              >
                <BsBriefcaseFill /> ProConnect
              </button>
              <button 
                className="dropdown-item"
                onClick={() => {
                  handleSiteChange('eduhub');
                  setShowSiteTypeDropdown(false);
                }}
              >
                <BsBook /> EduHub
              </button>
              <button 
                className="dropdown-item"
                onClick={() => {
                  handleSiteChange('gameconnect');
                  setShowSiteTypeDropdown(false);
                }}
              >
                <BsController /> GameConnect
              </button>
              <button 
                className="dropdown-item"
                onClick={() => {
                  handleSiteChange('streamhub');
                  setShowSiteTypeDropdown(false);
                }}
              >
                <BsCollectionPlay /> StreamHub
              </button>
              <button 
                className="dropdown-item"
                onClick={() => {
                  handleSiteChange('eventhub');
                  setShowSiteTypeDropdown(false);
                }}
              >
                <BsCalendarEvent /> EventHub
              </button>
              <button 
                className="dropdown-item"
                onClick={() => {
                  handleSiteChange('skillshare');
                  setShowSiteTypeDropdown(false);
                }}
              >
                <BsLaptop /> SkillShare
              </button>
              <button className="dropdown-item active">
                <BsPalette /> CreativeHub
              </button>
              <button 
                className="dropdown-item"
                onClick={() => {
                  handleSiteChange('jobhub');
                  setShowSiteTypeDropdown(false);
                }}
              >
                <BsBriefcase /> JobHub
              </button>
            </div>
          )}
        </div>

        <div className="creative-search">
          <BsSearch />
          <input 
            type="text" 
            placeholder="Поиск работ, художников..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="creative-actions">
          <button className="upload-button">
            <BsPlus /> Загрузить работу
          </button>
        </div>

        <div className="user-nav">
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
          {currentUser && (
            <div className="user-profile">
              <img src={currentUser.photo} alt={currentUser.name} />
            </div>
          )}
        </div>
      </div>

      <div className="creative-content">
        <div className="creative-filters">
          <div className="category-filters">
            {categories.map(category => (
              <button
                key={category.id}
                className={`filter-button ${filterCategory === category.id ? 'active' : ''}`}
                onClick={() => setFilterCategory(category.id)}
              >
                {category.icon} {category.name}
              </button>
            ))}
          </div>
        </div>

        <div className="creative-main">
          <div className="section-header">
            <div className="section-tabs">
              <button
                className={`tab-button ${activeSection === 'gallery' ? 'active' : ''}`}
                onClick={() => setActiveSection('gallery')}
              >
                <BsGrid /> Галерея
              </button>
              <button
                className={`tab-button ${activeSection === 'challenges' ? 'active' : ''}`}
                onClick={() => setActiveSection('challenges')}
              >
                <BsTrophy /> Челленджи
              </button>
              <button
                className={`tab-button ${activeSection === 'collaborations' ? 'active' : ''}`}
                onClick={() => setActiveSection('collaborations')}
              >
                <BsPeople /> Коллаборации
              </button>
            </div>
          </div>

          <div className="artworks-grid">
            {artworks
              .filter(artwork => {
                const matchesSearch = artwork.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                    artwork.artist.toLowerCase().includes(searchQuery.toLowerCase());
                const matchesCategory = filterCategory === 'all' || artwork.category === filterCategory;
                return matchesSearch && matchesCategory;
              })
              .map(renderArtworkCard)}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreativeHub; 