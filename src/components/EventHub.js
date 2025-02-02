import React, { useState, useEffect } from 'react';
import './EventHub.css';
import {
  BsCalendarEvent,
  BsChevronDown,
  BsSearch,
  BsGrid,
  BsHeartFill,
  BsGeoAlt,
  BsClock,
  BsPeople,
  BsPlus,
  BsFilter,
  BsChatDotsFill,
  BsShare,
  BsBookmark,
  BsThreeDots,
  BsCalendarCheck,
  BsCalendarX,
  BsPencil,
  BsTrash,
  BsPersonPlus,
  BsImages,
  BsLink45Deg,
  BsEnvelopeFill,
  BsBellFill,
  BsGearFill,
  BsCollectionPlay,
  BsBook,
  BsController,
  BsBriefcaseFill,
  BsPalette,
  BsLaptop,
  BsBriefcase
} from 'react-icons/bs';
import EventCreate from './EventCreate';

function EventHub({ onSiteTypeChange }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [showSiteTypeDropdown, setShowSiteTypeDropdown] = useState(false);
  const [activeSection, setActiveSection] = useState('upcoming');
  const [showCreateEvent, setShowCreateEvent] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');

  const [events, setEvents] = useState([
    {
      id: 1,
      title: 'Мастер-класс по веб-разработке',
      organizer: 'Анна Смирнова',
      category: 'education',
      date: '2024-04-15',
      time: '15:00',
      location: 'Москва, Технопарк',
      description: 'Практический мастер-класс по современной веб-разработке',
      attendees: 45,
      maxAttendees: 50,
      image: 'https://placekitten.com/800/400',
      tags: ['Программирование', 'Веб-разработка', 'React'],
      price: 'Бесплатно',
      isOnline: false
    },
    {
      id: 2,
      title: 'Турнир по CS2',
      organizer: 'Максим Петров',
      category: 'gaming',
      date: '2024-04-20',
      time: '12:00',
      location: 'Online',
      description: 'Онлайн турнир по CS2 с призовым фондом',
      attendees: 28,
      maxAttendees: 32,
      image: 'https://placekitten.com/801/400',
      tags: ['Киберспорт', 'CS2', 'Турнир'],
      price: '500 ₽',
      isOnline: true
    },
    {
      id: 3,
      title: 'Разговорный клуб английского',
      organizer: 'John Smith',
      category: 'education',
      date: '2024-04-18',
      time: '19:00',
      location: 'Online',
      description: 'Практика разговорного английского с носителем языка',
      attendees: 12,
      maxAttendees: 15,
      image: 'https://placekitten.com/802/400',
      tags: ['Английский', 'Общение', 'Обучение'],
      price: '300 ₽',
      isOnline: true
    }
  ]);

  const categories = [
    { id: 'all', name: 'Все категории', icon: <BsGrid /> },
    { id: 'education', name: 'Образование', icon: <BsBook /> },
    { id: 'gaming', name: 'Игры', icon: <BsController /> },
    { id: 'professional', name: 'Профессии', icon: <BsBriefcaseFill /> },
    { id: 'entertainment', name: 'Развлечения', icon: <BsCollectionPlay /> }
  ];

  useEffect(() => {
    // Имитация загрузки данных пользователя
    setCurrentUser({
      id: 'user1',
      name: 'Александр',
      photo: 'https://placekitten.com/100/100'
    });
  }, []);

  const handleCreateEvent = (newEvent) => {
    setEvents(prev => [...prev, newEvent]);
    setShowCreateEvent(false);
  };

  const handleEventClick = (event) => {
    setSelectedEvent(event);
  };

  const handleJoinEvent = (eventId) => {
    setEvents(events.map(event => {
      if (event.id === eventId && event.attendees < event.maxAttendees) {
        return { ...event, attendees: event.attendees + 1 };
      }
      return event;
    }));
  };

  const renderEventCard = (event) => (
    <div key={event.id} className="event-card" onClick={() => handleEventClick(event)}>
      <div className="event-image">
        <img src={event.image} alt={event.title} />
        <div className="event-category">
          {categories.find(cat => cat.id === event.category)?.icon}
          {categories.find(cat => cat.id === event.category)?.name}
        </div>
      </div>
      <div className="event-info">
        <div className="event-header">
          <h3>{event.title}</h3>
          <button className="bookmark-button">
            <BsBookmark />
          </button>
        </div>
        <div className="event-details">
          <div className="detail-item">
            <BsCalendarEvent />
            {new Date(event.date).toLocaleDateString()}
          </div>
          <div className="detail-item">
            <BsClock />
            {event.time}
          </div>
          <div className="detail-item">
            <BsGeoAlt />
            {event.location}
          </div>
          <div className="detail-item">
            <BsPeople />
            {event.attendees}/{event.maxAttendees}
          </div>
        </div>
        <div className="event-tags">
          {event.tags.map((tag, index) => (
            <span key={index} className="tag">{tag}</span>
          ))}
        </div>
        <div className="event-footer">
          <div className="event-price">{event.price}</div>
          <button 
            className="join-button"
            onClick={(e) => {
              e.stopPropagation();
              handleJoinEvent(event.id);
            }}
            disabled={event.attendees >= event.maxAttendees}
          >
            {event.attendees >= event.maxAttendees ? 'Мест нет' : 'Участвовать'}
          </button>
        </div>
      </div>
    </div>
  );

  const renderUpcomingEvents = () => (
    <div className="events-grid">
      {events
        .filter(event => {
          const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                              event.description.toLowerCase().includes(searchQuery.toLowerCase());
          const matchesCategory = filterCategory === 'all' || event.category === filterCategory;
          return matchesSearch && matchesCategory;
        })
        .map(renderEventCard)}
    </div>
  );

  return (
    <div className="event-hub">
      <div className="event-header">
        <div className="site-type-dropdown">
          <button 
            className="dropdown-button"
            onClick={() => setShowSiteTypeDropdown(!showSiteTypeDropdown)}
          >
            <BsCalendarEvent /> EventHub
            <BsChevronDown className={`chevron ${showSiteTypeDropdown ? 'open' : ''}`} />
          </button>
          {showSiteTypeDropdown && (
            <div className="dropdown-menu">
              <button 
                className="dropdown-item"
                onClick={() => {
                  onSiteTypeChange('chat');
                  setShowSiteTypeDropdown(false);
                }}
              >
                <BsChatDotsFill /> Рулетка
              </button>
              <button 
                className="dropdown-item"
                onClick={() => {
                  onSiteTypeChange('dating');
                  setShowSiteTypeDropdown(false);
                }}
              >
                <BsHeartFill /> Знакомства
              </button>
              <button 
                className="dropdown-item"
                onClick={() => {
                  onSiteTypeChange('proconnect');
                  setShowSiteTypeDropdown(false);
                }}
              >
                <BsBriefcaseFill /> ProConnect
              </button>
              <button 
                className="dropdown-item"
                onClick={() => {
                  onSiteTypeChange('eduhub');
                  setShowSiteTypeDropdown(false);
                }}
              >
                <BsBook /> EduHub
              </button>
              <button 
                className="dropdown-item"
                onClick={() => {
                  onSiteTypeChange('gameconnect');
                  setShowSiteTypeDropdown(false);
                }}
              >
                <BsController /> GameConnect
              </button>
              <button 
                className="dropdown-item"
                onClick={() => {
                  onSiteTypeChange('streamhub');
                  setShowSiteTypeDropdown(false);
                }}
              >
                <BsCollectionPlay /> StreamHub
              </button>
              <button className="dropdown-item active">
                <BsCalendarEvent /> EventHub
              </button>
              <button 
                className="dropdown-item"
                onClick={() => {
                  onSiteTypeChange('skillshare');
                  setShowSiteTypeDropdown(false);
                }}
              >
                <BsLaptop /> SkillShare
              </button>
              <button 
                className="dropdown-item"
                onClick={() => {
                  onSiteTypeChange('creativehub');
                  setShowSiteTypeDropdown(false);
                }}
              >
                <BsPalette /> CreativeHub
              </button>
              <button 
                className="dropdown-item"
                onClick={() => {
                  onSiteTypeChange('jobhub');
                  setShowSiteTypeDropdown(false);
                }}
              >
                <BsBriefcase /> JobHub
              </button>
            </div>
          )}
        </div>

        <div className="event-search">
          <BsSearch />
          <input 
            type="text" 
            placeholder="Поиск мероприятий..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="event-actions">
          <button className="create-event-button" onClick={() => setShowCreateEvent(true)}>
            <BsPlus /> Создать мероприятие
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

      <div className="event-content">
        <div className="event-filters">
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

        <div className="event-main">
          <div className="section-header">
            <h2>Предстоящие мероприятия</h2>
            <div className="view-options">
              <button className="view-button active">
                <BsGrid /> Сетка
              </button>
              <button className="view-button">
                <BsFilter /> Фильтры
              </button>
            </div>
          </div>

          {renderUpcomingEvents()}
        </div>
      </div>

      {showCreateEvent && (
        <EventCreate
          onClose={() => setShowCreateEvent(false)}
          onCreateEvent={handleCreateEvent}
        />
      )}
    </div>
  );
}

export default EventHub; 