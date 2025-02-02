import React, { useState, useEffect } from 'react';
import './JobHub.css';
import {
  BsBriefcase,
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
  BsPalette,
  BsBuilding,
  BsCash,
  BsGeoAlt,
  BsClock,
  BsBookmark,
  BsShare,
  BsPlus,
  BsEnvelopeFill,
  BsBellFill,
  BsGearFill,
  BsPeople,
  BsStarFill,
  BsPersonBadge
} from 'react-icons/bs';
import { useNavigate } from 'react-router-dom';

function JobHub({ onSiteTypeChange }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [showSiteTypeDropdown, setShowSiteTypeDropdown] = useState(false);
  const [activeSection, setActiveSection] = useState('jobs');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const navigate = useNavigate();

  const [jobs, setJobs] = useState([
    {
      id: 1,
      title: 'Senior React Developer',
      company: 'TechCorp',
      category: 'development',
      location: 'Москва',
      type: 'Полная занятость',
      salary: '200,000 - 300,000 ₽',
      experience: '3+ года',
      description: 'Разработка и поддержка высоконагруженных веб-приложений',
      requirements: ['React', 'TypeScript', 'Node.js'],
      posted: '2 дня назад',
      companyLogo: 'https://placekitten.com/100/100'
    },
    {
      id: 2,
      title: 'UI/UX Designer',
      company: 'DesignStudio',
      category: 'design',
      location: 'Удаленно',
      type: 'Проектная работа',
      salary: '150,000 - 200,000 ₽',
      experience: '2+ года',
      description: 'Создание пользовательских интерфейсов для мобильных приложений',
      requirements: ['Figma', 'Adobe XD', 'Sketch'],
      posted: '1 день назад',
      companyLogo: 'https://placekitten.com/101/101'
    },
    {
      id: 3,
      title: 'Product Manager',
      company: 'StartupInc',
      category: 'management',
      location: 'Санкт-Петербург',
      type: 'Полная занятость',
      salary: '250,000 - 350,000 ₽',
      experience: '5+ лет',
      description: 'Управление продуктовой командой и развитие продукта',
      requirements: ['Agile', 'Scrum', 'Product Development'],
      posted: '3 дня назад',
      companyLogo: 'https://placekitten.com/102/102'
    }
  ]);

  const categories = [
    { id: 'all', name: 'Все категории', icon: <BsGrid /> },
    { id: 'development', name: 'Разработка', icon: <BsLaptop /> },
    { id: 'design', name: 'Дизайн', icon: <BsPalette /> },
    { id: 'management', name: 'Менеджмент', icon: <BsPeople /> },
    { id: 'marketing', name: 'Маркетинг', icon: <BsPersonBadge /> }
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

  const renderJobCard = (job) => (
    <div key={job.id} className="job-card">
      <div className="job-header">
        <img src={job.companyLogo} alt={job.company} className="company-logo" />
        <div className="job-title-info">
          <h3>{job.title}</h3>
          <div className="company-name">
            <BsBuilding /> {job.company}
          </div>
        </div>
        <div className="job-actions">
          <button className="icon-button">
            <BsBookmark />
          </button>
          <button className="icon-button">
            <BsShare />
          </button>
        </div>
      </div>

      <div className="job-details">
        <div className="detail-item">
          <BsGeoAlt /> {job.location}
        </div>
        <div className="detail-item">
          <BsCash /> {job.salary}
        </div>
        <div className="detail-item">
          <BsClock /> {job.type}
        </div>
        <div className="detail-item">
          <BsBriefcase /> {job.experience}
        </div>
      </div>

      <div className="job-description">
        {job.description}
      </div>

      <div className="job-requirements">
        {job.requirements.map((req, index) => (
          <span key={index} className="requirement-tag">{req}</span>
        ))}
      </div>

      <div className="job-footer">
        <span className="posted-date">{job.posted}</span>
        <button className="apply-button">Откликнуться</button>
      </div>
    </div>
  );

  return (
    <div className="job-hub">
      <div className="job-header">
        <div className="site-type-dropdown">
          <button 
            className="dropdown-button"
            onClick={() => setShowSiteTypeDropdown(!showSiteTypeDropdown)}
          >
            <BsBriefcase /> JobHub
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
              <button 
                className="dropdown-item"
                onClick={() => {
                  handleSiteChange('creativehub');
                  setShowSiteTypeDropdown(false);
                }}
              >
                <BsPalette /> CreativeHub
              </button>
              <button className="dropdown-item active">
                <BsBriefcase /> JobHub
              </button>
            </div>
          )}
        </div>

        <div className="job-search">
          <BsSearch />
          <input 
            type="text" 
            placeholder="Поиск вакансий, компаний..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="job-actions">
          <button className="post-job-button">
            <BsPlus /> Разместить вакансию
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

      <div className="job-content">
        <div className="job-filters">
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

        <div className="job-main">
          <div className="section-header">
            <div className="section-tabs">
              <button
                className={`tab-button ${activeSection === 'jobs' ? 'active' : ''}`}
                onClick={() => setActiveSection('jobs')}
              >
                <BsBriefcase /> Вакансии
              </button>
              <button
                className={`tab-button ${activeSection === 'companies' ? 'active' : ''}`}
                onClick={() => setActiveSection('companies')}
              >
                <BsBuilding /> Компании
              </button>
              <button
                className={`tab-button ${activeSection === 'resumes' ? 'active' : ''}`}
                onClick={() => setActiveSection('resumes')}
              >
                <BsPersonBadge /> Резюме
              </button>
            </div>
          </div>

          <div className="jobs-grid">
            {jobs
              .filter(job => {
                const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                    job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                    job.description.toLowerCase().includes(searchQuery.toLowerCase());
                const matchesCategory = filterCategory === 'all' || job.category === filterCategory;
                return matchesSearch && matchesCategory;
              })
              .map(renderJobCard)}
          </div>
        </div>
      </div>
    </div>
  );
}

export default JobHub; 