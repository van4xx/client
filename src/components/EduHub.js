import React, { useState, useEffect } from 'react';
import './EduHub.css';
import {
  BsBook,
  BsCalendar3,
  BsChat,
  BsGearFill,
  BsGraphUp,
  BsGrid,
  BsHeartFill,
  BsJournalText,
  BsLightning,
  BsPeople,
  BsPersonBadge,
  BsSearch,
  BsStar,
  BsTrophy,
  BsChevronDown,
  BsChatDotsFill,
  BsBriefcaseFill,
  BsBookmarkFill,
  BsCollection,
  BsPersonVideo3,
  BsClockHistory,
  BsBellFill,
  BsGlobe
} from 'react-icons/bs';

function EduHub({ onSiteTypeChange }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [showSiteTypeDropdown, setShowSiteTypeDropdown] = useState(false);
  const [activeSection, setActiveSection] = useState('courses');
  const [courses, setCourses] = useState([
    {
      id: 1,
      title: 'Веб-разработка для начинающих',
      instructor: 'Анна Смирнова',
      level: 'Начальный',
      rating: 4.8,
      students: 1250,
      price: 2999,
      duration: '3 месяца',
      topics: ['HTML', 'CSS', 'JavaScript'],
      image: 'https://placekitten.com/301/301'
    },
    {
      id: 2,
      title: 'Английский для IT-специалистов',
      instructor: 'Джон Смит',
      level: 'Средний',
      rating: 4.9,
      students: 850,
      price: 3999,
      duration: '4 месяца',
      topics: ['Technical English', 'Communication', 'IT Terminology'],
      image: 'https://placekitten.com/302/302'
    }
  ]);

  const [tutors, setTutors] = useState([
    {
      id: 1,
      name: 'Мария Иванова',
      subjects: ['Математика', 'Физика'],
      rating: 4.9,
      experience: '5 лет',
      price: '1500 ₽/час',
      photo: 'https://placekitten.com/303/303',
      availability: ['ПН', 'СР', 'ПТ'],
      description: 'Опытный преподаватель точных наук'
    }
  ]);

  useEffect(() => {
    setCurrentUser({
      id: 'user1',
      name: 'Александр Иванов',
      role: 'Студент',
      progress: {
        coursesCompleted: 3,
        currentCourses: 2,
        achievements: 5
      },
      photo: 'https://placekitten.com/300/300'
    });
  }, []);

  const renderCourses = () => (
    <div className="edu-courses">
      <div className="courses-header">
        <h2>Популярные курсы</h2>
        <div className="courses-filters">
          <button className="filter-button active">Все</button>
          <button className="filter-button">Программирование</button>
          <button className="filter-button">Языки</button>
          <button className="filter-button">Дизайн</button>
        </div>
      </div>

      <div className="courses-grid">
        {courses.map(course => (
          <div key={course.id} className="course-card">
            <div className="course-image">
              <img src={course.image} alt={course.title} />
              <div className="course-level">{course.level}</div>
            </div>
            <div className="course-info">
              <h3>{course.title}</h3>
              <p className="instructor">{course.instructor}</p>
              <div className="course-stats">
                <span className="rating"><BsStar /> {course.rating}</span>
                <span className="students"><BsPeople /> {course.students}</span>
              </div>
              <div className="course-topics">
                {course.topics.map((topic, index) => (
                  <span key={index} className="topic-tag">{topic}</span>
                ))}
              </div>
              <div className="course-footer">
                <span className="price">{course.price} ₽</span>
                <span className="duration"><BsClockHistory /> {course.duration}</span>
              </div>
              <button className="enroll-button">Записаться</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderTutors = () => (
    <div className="edu-tutors">
      <div className="tutors-header">
        <h2>Репетиторы</h2>
        <div className="tutors-filters">
          <div className="search-box">
            <BsSearch />
            <input type="text" placeholder="Поиск по предметам..." />
          </div>
          <div className="filter-tags">
            <span className="filter-tag">Онлайн</span>
            <span className="filter-tag">Высокий рейтинг</span>
            <span className="filter-tag">Доступно сейчас</span>
          </div>
        </div>
      </div>

      <div className="tutors-grid">
        {tutors.map(tutor => (
          <div key={tutor.id} className="tutor-card">
            <div className="tutor-header">
              <img src={tutor.photo} alt={tutor.name} className="tutor-photo" />
              <div className="tutor-info">
                <h3>{tutor.name}</h3>
                <div className="tutor-subjects">
                  {tutor.subjects.map((subject, index) => (
                    <span key={index} className="subject-tag">{subject}</span>
                  ))}
                </div>
              </div>
            </div>
            <div className="tutor-details">
              <div className="tutor-stats">
                <span className="rating"><BsStar /> {tutor.rating}</span>
                <span className="experience">{tutor.experience}</span>
              </div>
              <p className="tutor-description">{tutor.description}</p>
              <div className="tutor-availability">
                {tutor.availability.map((day, index) => (
                  <span key={index} className="day-tag">{day}</span>
                ))}
              </div>
              <div className="tutor-footer">
                <span className="price">{tutor.price}</span>
                <button className="contact-button">Связаться</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderProgress = () => (
    <div className="edu-progress">
      <div className="progress-header">
        <h2>Мой прогресс</h2>
      </div>
      <div className="progress-stats">
        <div className="stat-card">
          <BsBook />
          <h3>{currentUser?.progress.coursesCompleted}</h3>
          <p>Завершенных курсов</p>
        </div>
        <div className="stat-card">
          <BsLightning />
          <h3>{currentUser?.progress.currentCourses}</h3>
          <p>Текущих курсов</p>
        </div>
        <div className="stat-card">
          <BsTrophy />
          <h3>{currentUser?.progress.achievements}</h3>
          <p>Достижений</p>
        </div>
      </div>
      <div className="current-courses">
        <h3>Текущие курсы</h3>
        {/* Здесь будет список текущих курсов */}
      </div>
    </div>
  );

  return (
    <div className="edu-hub">
      <div className="edu-header">
        <div className={`site-type-dropdown ${activeSection === 'search' ? 'hidden' : ''}`}>
          <button 
            className="dropdown-button"
            onClick={() => setShowSiteTypeDropdown(!showSiteTypeDropdown)}
          >
            <BsBook /> EduHub
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
              <button 
                className="dropdown-item"
                onClick={() => {
                  if (typeof onSiteTypeChange === 'function') {
                    onSiteTypeChange('dating');
                  }
                  setShowSiteTypeDropdown(false);
                }}
              >
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
              <button className="dropdown-item active">
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
            </div>
          )}
        </div>

        <div className="edu-search">
          <BsSearch />
          <input type="text" placeholder="Поиск курсов, репетиторов, материалов..." />
        </div>

        <div className="edu-nav">
          <button className="nav-item">
            <BsChat />
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
          <div className="user-profile">
            <img src={currentUser?.photo} alt={currentUser?.name} />
          </div>
        </div>
      </div>

      <div className="edu-content">
        <div className="edu-sidebar">
          <button 
            className={`sidebar-item ${activeSection === 'courses' ? 'active' : ''}`}
            onClick={() => setActiveSection('courses')}
          >
            <BsCollection /> Курсы
          </button>
          <button 
            className={`sidebar-item ${activeSection === 'tutors' ? 'active' : ''}`}
            onClick={() => setActiveSection('tutors')}
          >
            <BsPersonVideo3 /> Репетиторы
          </button>
          <button 
            className={`sidebar-item ${activeSection === 'progress' ? 'active' : ''}`}
            onClick={() => setActiveSection('progress')}
          >
            <BsGraphUp /> Мой прогресс
          </button>
          <button className="sidebar-item">
            <BsBookmarkFill /> Сохраненное
          </button>
          <button className="sidebar-item">
            <BsCalendar3 /> Расписание
          </button>
          <button className="sidebar-item">
            <BsJournalText /> Материалы
          </button>
        </div>

        <div className="edu-main">
          {activeSection === 'courses' && renderCourses()}
          {activeSection === 'tutors' && renderTutors()}
          {activeSection === 'progress' && renderProgress()}
        </div>

        <div className="edu-aside">
          <div className="profile-summary">
            <div className="profile-header">
              <img src={currentUser?.photo} alt={currentUser?.name} />
              <h3>{currentUser?.name}</h3>
              <p>{currentUser?.role}</p>
            </div>
            <div className="profile-stats">
              <div className="stat-item">
                <span className="stat-value">{currentUser?.progress?.coursesCompleted}</span>
                <span className="stat-label">курсов</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">{currentUser?.progress?.achievements}</span>
                <span className="stat-label">достижений</span>
              </div>
            </div>
          </div>

          <div className="upcoming-lessons">
            <h3>Ближайшие занятия</h3>
            <div className="lessons-list">
              {/* Здесь будет список ближайших занятий */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EduHub; 