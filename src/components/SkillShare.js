import React, { useState, useEffect } from 'react';
import './SkillShare.css';
import {
  BsLaptop,
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
  BsPalette,
  BsBriefcase,
  BsStarFill,
  BsPersonBadge,
  BsClock,
  BsPeople,
  BsBookmark,
  BsPlay,
  BsEnvelopeFill,
  BsBellFill,
  BsGearFill,
  BsPlus
} from 'react-icons/bs';

function SkillShare({ onSiteTypeChange }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [showSiteTypeDropdown, setShowSiteTypeDropdown] = useState(false);
  const [activeSection, setActiveSection] = useState('courses');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');

  const [courses, setCourses] = useState([
    {
      id: 1,
      title: 'Веб-разработка с React',
      instructor: 'Анна Смирнова',
      category: 'programming',
      level: 'Средний',
      duration: '20 часов',
      students: 1250,
      rating: 4.8,
      price: '5000 ₽',
      image: 'https://placekitten.com/800/400',
      tags: ['React', 'JavaScript', 'Веб-разработка']
    },
    {
      id: 2,
      title: 'Основы UI/UX дизайна',
      instructor: 'Максим Петров',
      category: 'design',
      level: 'Начальный',
      duration: '15 часов',
      students: 850,
      rating: 4.6,
      price: '4000 ₽',
      image: 'https://placekitten.com/801/400',
      tags: ['UI', 'UX', 'Figma']
    },
    {
      id: 3,
      title: 'Продвинутый JavaScript',
      instructor: 'John Smith',
      category: 'programming',
      level: 'Продвинутый',
      duration: '25 часов',
      students: 750,
      rating: 4.9,
      price: '6000 ₽',
      image: 'https://placekitten.com/802/400',
      tags: ['JavaScript', 'ES6', 'Node.js']
    }
  ]);

  const [mentors, setMentors] = useState([
    {
      id: 1,
      name: 'Анна Смирнова',
      specialization: 'Веб-разработка',
      rating: 4.8,
      students: 150,
      experience: '5 лет',
      price: '2000 ₽/час',
      photo: 'https://placekitten.com/100/100',
      tags: ['React', 'JavaScript', 'Node.js']
    },
    {
      id: 2,
      name: 'Максим Петров',
      specialization: 'UI/UX Дизайн',
      rating: 4.7,
      students: 120,
      experience: '4 года',
      price: '1800 ₽/час',
      photo: 'https://placekitten.com/101/101',
      tags: ['Figma', 'Adobe XD', 'Sketch']
    }
  ]);

  const categories = [
    { id: 'all', name: 'Все категории', icon: <BsGrid /> },
    { id: 'programming', name: 'Программирование', icon: <BsLaptop /> },
    { id: 'design', name: 'Дизайн', icon: <BsPalette /> },
    { id: 'business', name: 'Бизнес', icon: <BsBriefcase /> },
    { id: 'marketing', name: 'Маркетинг', icon: <BsPersonBadge /> }
  ];

  useEffect(() => {
    setCurrentUser({
      id: 'user1',
      name: 'Александр',
      photo: 'https://placekitten.com/100/100'
    });
  }, []);

  const renderCourseCard = (course) => (
    <div key={course.id} className="course-card">
      <div className="course-image">
        <img src={course.image} alt={course.title} />
        <div className="course-category">
          {categories.find(cat => cat.id === course.category)?.icon}
          {categories.find(cat => cat.id === course.category)?.name}
        </div>
        <button className="bookmark-button">
          <BsBookmark />
        </button>
      </div>
      <div className="course-info">
        <h3>{course.title}</h3>
        <div className="instructor-info">
          <span>{course.instructor}</span>
          <div className="rating">
            <BsStarFill /> {course.rating}
          </div>
        </div>
        <div className="course-details">
          <div className="detail-item">
            <BsClock /> {course.duration}
          </div>
          <div className="detail-item">
            <BsPeople /> {course.students} учеников
          </div>
          <div className="detail-item">
            <BsBook /> {course.level}
          </div>
        </div>
        <div className="course-tags">
          {course.tags.map((tag, index) => (
            <span key={index} className="tag">{tag}</span>
          ))}
        </div>
        <div className="course-footer">
          <div className="course-price">{course.price}</div>
          <button className="start-course-button">
            <BsPlay /> Начать обучение
          </button>
        </div>
      </div>
    </div>
  );

  const renderMentorCard = (mentor) => (
    <div key={mentor.id} className="mentor-card">
      <div className="mentor-header">
        <img src={mentor.photo} alt={mentor.name} className="mentor-photo" />
        <div className="mentor-info">
          <h3>{mentor.name}</h3>
          <p>{mentor.specialization}</p>
          <div className="mentor-rating">
            <BsStarFill /> {mentor.rating} · {mentor.students} учеников
          </div>
        </div>
      </div>
      <div className="mentor-details">
        <div className="detail-item">
          <strong>Опыт:</strong> {mentor.experience}
        </div>
        <div className="detail-item">
          <strong>Стоимость:</strong> {mentor.price}
        </div>
      </div>
      <div className="mentor-tags">
        {mentor.tags.map((tag, index) => (
          <span key={index} className="tag">{tag}</span>
        ))}
      </div>
      <button className="contact-mentor-button">
        Связаться с ментором
      </button>
    </div>
  );

  return (
    <div className="skillshare">
      <div className="skillshare-header">
        <div className="site-type-dropdown">
          <button 
            className="dropdown-button"
            onClick={() => setShowSiteTypeDropdown(!showSiteTypeDropdown)}
          >
            <BsLaptop /> SkillShare
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
              <button 
                className="dropdown-item"
                onClick={() => {
                  onSiteTypeChange('eventhub');
                  setShowSiteTypeDropdown(false);
                }}
              >
                <BsCalendarEvent /> EventHub
              </button>
              <button className="dropdown-item active">
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

        <div className="skillshare-search">
          <BsSearch />
          <input 
            type="text" 
            placeholder="Поиск курсов, менторов..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="skillshare-actions">
          <button className="create-course-button">
            <BsPlus /> Создать курс
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

      <div className="skillshare-content">
        <div className="skillshare-filters">
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

        <div className="skillshare-main">
          <div className="section-header">
            <div className="section-tabs">
              <button
                className={`tab-button ${activeSection === 'courses' ? 'active' : ''}`}
                onClick={() => setActiveSection('courses')}
              >
                <BsBook /> Курсы
              </button>
              <button
                className={`tab-button ${activeSection === 'mentors' ? 'active' : ''}`}
                onClick={() => setActiveSection('mentors')}
              >
                <BsPersonBadge /> Менторы
              </button>
            </div>
          </div>

          <div className="section-content">
            {activeSection === 'courses' ? (
              <div className="courses-grid">
                {courses
                  .filter(course => {
                    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                        course.instructor.toLowerCase().includes(searchQuery.toLowerCase());
                    const matchesCategory = filterCategory === 'all' || course.category === filterCategory;
                    return matchesSearch && matchesCategory;
                  })
                  .map(renderCourseCard)}
              </div>
            ) : (
              <div className="mentors-grid">
                {mentors
                  .filter(mentor => {
                    const matchesSearch = mentor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                        mentor.specialization.toLowerCase().includes(searchQuery.toLowerCase());
                    return matchesSearch;
                  })
                  .map(renderMentorCard)}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SkillShare; 