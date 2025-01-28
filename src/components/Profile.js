import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    BsTrophy, 
    BsStar, 
    BsGem, 
    BsCoin, 
    BsCheckCircleFill,
    BsPersonCircle,
    BsBarChart,
    BsBoxSeam,
    BsListCheck,
    BsArrowLeft,
    BsShop,
    BsClock,
    BsCalendar,
    BsHeartFill,
    BsFillLightningFill,
    BsAward,
    BsEmojiSunglassesFill,
    BsPaletteFill,
    BsSpotify,
    BsVolumeUpFill
} from 'react-icons/bs';
import ProfileService from '../services/ProfileService';
import CurrencyService from '../services/CurrencyService';
import './Profile.css';

function Profile() {
    const navigate = useNavigate();
    const [profile, setProfile] = useState(ProfileService.getProfile());
    const [activeTab, setActiveTab] = useState('overview');
    const [showShop, setShowShop] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState('all');

    useEffect(() => {
        // Инициализируем задания при загрузке
        ProfileService.initDailyTasks();
        setProfile(ProfileService.getProfile());

        // Обновляем профиль каждую минуту для проверки ежедневных заданий
        const interval = setInterval(() => {
            ProfileService.initDailyTasks();
            setProfile(ProfileService.getProfile());
        }, 60000);

        return () => clearInterval(interval);
    }, []);

    const calculateLevelProgress = () => {
        return (profile.experience / profile.experienceToNextLevel) * 100;
    };

    const handleBuyItem = (itemId) => {
        try {
            const item = ProfileService.buyItem(itemId);
            setProfile(ProfileService.getProfile());
            alert(`Поздравляем! Вы приобрели ${item.name}`);
        } catch (error) {
            alert(error.message);
        }
    };

    const filterItems = (items) => {
        if (selectedCategory === 'all') return items;
        return items.filter(item => item.type === selectedCategory);
    };

    const handleCheckTask = (taskId) => {
        // Имитация выполнения задания
        const task = profile.dailyTasks.find(t => t.id === taskId) || profile.weeklyTask;
        if (task && !task.completed) {
            // Добавляем прогресс в зависимости от типа задания
            switch(task.type) {
                case 'chats':
                    ProfileService.updateStats('totalChats', task.target - task.progress);
                    break;
                case 'time':
                    ProfileService.updateStats('totalTime', task.target - task.progress);
                    break;
                case 'gifts':
                    ProfileService.updateStats('giftsGiven', task.target - task.progress);
                    break;
                case 'video':
                    ProfileService.updateStats('totalChats', task.target - task.progress);
                    break;
                case 'likes':
                    ProfileService.updateStats('totalChats', task.target - task.progress);
                    break;
            }
            
            // Обновляем прогресс задания
            ProfileService.updateTaskProgress(task.type, task.target - task.progress);
            setProfile(ProfileService.getProfile());
        }
    };

    const renderOverview = () => (
        <div className="profile-overview">
            <div className="profile-header-card">
                <div className="profile-avatar-container">
                    <div className="profile-avatar">
                        <BsPersonCircle />
                        {profile.inventory.find(item => item.type === 'effect') && (
                            <div className="profile-effect sparkles"></div>
                        )}
                        {profile.inventory.find(item => item.type === 'frame') && (
                            <div className="profile-frame gold"></div>
                        )}
                    </div>
                    <div className="profile-badges">
                        {profile.inventory.find(item => item.type === 'badge') && (
                            <div className="profile-badge vip">VIP</div>
                        )}
                    </div>
                </div>
                <div className="profile-info">
                    <h2>{profile.nickname}</h2>
                    {profile.inventory.find(item => item.type === 'title') && (
                        <div className="profile-title">Мастер общения</div>
                    )}
                    <div className="profile-level">
                        <div className="level-badge">
                            <BsTrophy /> Уровень {profile.level}
                        </div>
                        <div className="level-progress">
                            <div 
                                className="level-progress-bar" 
                                style={{width: `${calculateLevelProgress()}%`}}
                            ></div>
                        </div>
                        <span className="experience-text">
                            {profile.experience} / {profile.experienceToNextLevel} XP
                        </span>
                    </div>
                </div>
            </div>

            <div className="profile-stats-grid">
                <div className="stat-card">
                    <BsBarChart className="stat-icon" />
                    <div className="stat-info">
                        <span className="stat-label">Всего чатов</span>
                        <strong className="stat-value">{profile.stats.totalChats}</strong>
                    </div>
                </div>
                <div className="stat-card">
                    <BsClock className="stat-icon" />
                    <div className="stat-info">
                        <span className="stat-label">Время в чате</span>
                        <strong className="stat-value">{Math.floor(profile.stats.totalTime / 60)}ч {profile.stats.totalTime % 60}м</strong>
                    </div>
                </div>
                <div className="stat-card">
                    <BsGem className="stat-icon" />
                    <div className="stat-info">
                        <span className="stat-label">Подарков</span>
                        <strong className="stat-value">{profile.stats.giftsGiven}</strong>
                    </div>
                </div>
                <div className="stat-card">
                    <BsListCheck className="stat-icon" />
                    <div className="stat-info">
                        <span className="stat-label">Заданий</span>
                        <strong className="stat-value">{profile.stats.tasksCompleted}</strong>
                    </div>
                </div>
            </div>

            <div className="profile-achievements">
                <h3>Достижения</h3>
                <div className="achievements-grid">
                    <div className="achievement-card">
                        <div className="achievement-icon">
                            <BsTrophy />
                        </div>
                        <h4>Первые шаги</h4>
                        <p>Проведите первый чат</p>
                        <div className="achievement-progress">
                            <div className="progress-bar">
                                <div className="progress-fill" style={{width: '100%'}}></div>
                            </div>
                            <span>Выполнено!</span>
                        </div>
                    </div>
                    <div className="achievement-card locked">
                        <div className="achievement-icon">
                            <BsClock />
                        </div>
                        <h4>Марафонец</h4>
                        <p>Проведите в чате 24 часа</p>
                        <div className="achievement-progress">
                            <div className="progress-bar">
                                <div className="progress-fill" style={{width: '45%'}}></div>
                            </div>
                            <span>11/24 часов</span>
                        </div>
                    </div>
                    <div className="achievement-card locked">
                        <div className="achievement-icon">
                            <BsHeartFill />
                        </div>
                        <h4>Щедрая душа</h4>
                        <p>Отправьте 50 подарков</p>
                        <div className="achievement-progress">
                            <div className="progress-bar">
                                <div className="progress-fill" style={{width: '30%'}}></div>
                            </div>
                            <span>15/50 подарков</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="profile-activity">
                <h3>Активность</h3>
                <div className="activity-chart">
                    <div className="activity-days">
                        {Array.from({length: 7}).map((_, index) => (
                            <div key={index} className="activity-day">
                                <div className="activity-bar" style={{height: `${Math.random() * 80 + 20}%`}}></div>
                                <span>{['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'][index]}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );

    const renderDailyTasks = () => (
        <div className="daily-tasks">
            <h3>Ежедневные задания</h3>
            <div className="tasks-list">
                {profile.dailyTasks.map(task => (
                    <div key={task.id} className={`task-item ${task.completed ? 'completed' : ''}`}>
                        <div className="task-info">
                            <h4>{task.title}</h4>
                            <p>{task.description}</p>
                            <div className="task-progress">
                                <div className="progress-bar">
                                    <div 
                                        className="progress-fill"
                                        style={{width: `${(task.progress / task.target) * 100}%`}}
                                    ></div>
                                </div>
                                <span className="progress-text">
                                    {task.progress} / {task.target}
                                </span>
                            </div>
                        </div>
                        <div className="task-actions">
                            <div className="task-reward-preview">
                                <BsStar />
                                <span>{task.reward} XP</span>
                            </div>
                            <button 
                                className={`task-check-button ${task.completed ? 'completed' : ''}`}
                                onClick={() => handleCheckTask(task.id)}
                                disabled={task.completed}
                            >
                                {task.completed ? (
                                    <>
                                        <BsCheckCircleFill /> Выполнено
                                    </>
                                ) : (
                                    <>
                                        <BsListCheck /> Проверить
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {profile.weeklyTask && (
                <>
                    <h3 className="weekly-title">Недельное задание</h3>
                    <div className="tasks-list">
                        <div className={`task-item weekly ${profile.weeklyTask.completed ? 'completed' : ''}`}>
                            <div className="task-info">
                                <h4>{profile.weeklyTask.title}</h4>
                                <p>{profile.weeklyTask.description}</p>
                                <div className="task-progress">
                                    <div className="progress-bar">
                                        <div 
                                            className="progress-fill"
                                            style={{width: `${(profile.weeklyTask.progress / profile.weeklyTask.target) * 100}%`}}
                                        ></div>
                                    </div>
                                    <span className="progress-text">
                                        {profile.weeklyTask.progress} / {profile.weeklyTask.target}
                                    </span>
                                </div>
                                <div className="task-expiration">
                                    Осталось: {Math.max(0, Math.ceil((new Date(profile.weeklyTask.expiresAt) - new Date()) / (1000 * 60 * 60 * 24)))} дней
                                </div>
                            </div>
                            <div className="task-actions">
                                <div className="task-reward-preview">
                                    <BsStar />
                                    <span>{profile.weeklyTask.reward} XP</span>
                                </div>
                                <button 
                                    className={`task-check-button ${profile.weeklyTask.completed ? 'completed' : ''}`}
                                    onClick={() => handleCheckTask(profile.weeklyTask.id)}
                                    disabled={profile.weeklyTask.completed}
                                >
                                    {profile.weeklyTask.completed ? (
                                        <>
                                            <BsCheckCircleFill /> Выполнено
                                        </>
                                    ) : (
                                        <>
                                            <BsListCheck /> Проверить
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );

    const renderInventory = () => (
        <div className="inventory">
            <div className="inventory-header">
                <h3>Инвентарь</h3>
            </div>
            <div className="inventory-items">
                {profile.inventory.map(item => (
                    <div key={item.id} className={`inventory-item ${item.rarity}`}>
                        <div className="item-icon">
                            {item.type === 'frame' && <BsBoxSeam />}
                            {item.type === 'effect' && <BsStar />}
                            {item.type === 'badge' && <BsTrophy />}
                            {item.type === 'title' && <BsGem />}
                        </div>
                        <div className="item-info">
                            <h4>{item.name}</h4>
                            <p>{item.description}</p>
                        </div>
                    </div>
                ))}
                {profile.inventory.length === 0 && (
                    <div className="empty-inventory">
                        <p>У вас пока нет предметов</p>
                    </div>
                )}
            </div>
        </div>
    );

    const renderShop = () => (
        <div className="shop-container">
            <div className="shop-header">
                <div className="shop-balance">
                    <BsCoin className="balance-icon" /> {CurrencyService.getBalance()} RC
                </div>
            </div>
            <div className="shop-categories">
                <div className="category-tabs">
                    <button 
                        className={`category-tab ${selectedCategory === 'all' ? 'active' : ''}`}
                        onClick={() => setSelectedCategory('all')}
                    >
                        <BsBoxSeam /> Все товары
                    </button>
                    <button 
                        className={`category-tab ${selectedCategory === 'frame' ? 'active' : ''}`}
                        onClick={() => setSelectedCategory('frame')}
                    >
                        <BsGem /> Рамки
                    </button>
                    <button 
                        className={`category-tab ${selectedCategory === 'effect' ? 'active' : ''}`}
                        onClick={() => setSelectedCategory('effect')}
                    >
                        <BsStar /> Эффекты
                    </button>
                    <button 
                        className={`category-tab ${selectedCategory === 'badge' ? 'active' : ''}`}
                        onClick={() => setSelectedCategory('badge')}
                    >
                        <BsTrophy /> Значки
                    </button>
                </div>
                <div className="shop-items-grid">
                    {filterItems([
                        {
                            id: 'frame_gold',
                            name: 'Золотая рамка',
                            description: 'Роскошная золотая рамка для вашего профиля',
                            price: 1000,
                            type: 'frame',
                            rarity: 'rare',
                            icon: <BsGem />
                        },
                        {
                            id: 'effect_sparkles',
                            name: 'Эффект искр',
                            description: 'Сверкающие искры вокруг вашего аватара',
                            price: 500,
                            type: 'effect',
                            rarity: 'uncommon',
                            icon: <BsStar />
                        },
                        {
                            id: 'badge_vip',
                            name: 'VIP значок',
                            description: 'Эксклюзивный значок для особого статуса',
                            price: 2000,
                            type: 'badge',
                            rarity: 'epic',
                            icon: <BsAward />
                        },
                        {
                            id: 'title_master',
                            name: 'Титул "Мастер общения"',
                            description: 'Показывает ваше мастерство в общении',
                            price: 1500,
                            type: 'title',
                            rarity: 'rare',
                            icon: <BsGem />
                        },
                        {
                            id: 'effect_neon',
                            name: 'Неоновое свечение',
                            description: 'Стильное неоновое свечение вокруг аватара',
                            price: 800,
                            type: 'effect',
                            rarity: 'rare',
                            icon: <BsFillLightningFill />
                        },
                        {
                            id: 'badge_heart',
                            name: 'Значок "Любимчик"',
                            description: 'Особый значок для самых популярных',
                            price: 1200,
                            type: 'badge',
                            rarity: 'rare',
                            icon: <BsHeartFill />
                        },
                        {
                            id: 'effect_cool',
                            name: 'Эффект "Крутой"',
                            description: 'Добавляет стильные солнечные очки',
                            price: 700,
                            type: 'effect',
                            rarity: 'uncommon',
                            icon: <BsEmojiSunglassesFill />
                        },
                        {
                            id: 'frame_rainbow',
                            name: 'Радужная рамка',
                            description: 'Переливающаяся всеми цветами рамка',
                            price: 1500,
                            type: 'frame',
                            rarity: 'epic',
                            icon: <BsPaletteFill />
                        },
                        {
                            id: 'effect_music',
                            name: 'Эффект "Меломан"',
                            description: 'Музыкальные ноты вокруг аватара',
                            price: 600,
                            type: 'effect',
                            rarity: 'uncommon',
                            icon: <BsSpotify />
                        },
                        {
                            id: 'effect_wave',
                            name: 'Звуковая волна',
                            description: 'Анимированная звуковая волна',
                            price: 900,
                            type: 'effect',
                            rarity: 'rare',
                            icon: <BsVolumeUpFill />
                        },
                        // Новые предметы
                        {
                            id: 'frame_fire',
                            name: 'Огненная рамка',
                            description: 'Рамка с эффектом пылающего огня',
                            price: 1800,
                            type: 'frame',
                            rarity: 'epic',
                            icon: <BsFillLightningFill />
                        },
                        {
                            id: 'badge_diamond',
                            name: 'Бриллиантовый значок',
                            description: 'Сверкающий бриллиантовый значок',
                            price: 2500,
                            type: 'badge',
                            rarity: 'epic',
                            icon: <BsGem />
                        },
                        {
                            id: 'effect_galaxy',
                            name: 'Галактический эффект',
                            description: 'Космический эффект вокруг аватара',
                            price: 2000,
                            type: 'effect',
                            rarity: 'epic',
                            icon: <BsStar />
                        },
                        {
                            id: 'frame_ice',
                            name: 'Ледяная рамка',
                            description: 'Рамка с эффектом мерцающего льда',
                            price: 1600,
                            type: 'frame',
                            rarity: 'rare',
                            icon: <BsGem />
                        },
                        {
                            id: 'effect_hearts',
                            name: 'Летящие сердца',
                            description: 'Анимированные сердечки вокруг аватара',
                            price: 1000,
                            type: 'effect',
                            rarity: 'rare',
                            icon: <BsHeartFill />
                        }
                    ]).map(item => (
                        <div key={item.id} className={`shop-item ${item.rarity}`}>
                            <div className="shop-item-content">
                                <div className="shop-item-icon">
                                    {item.icon}
                                </div>
                                <div className="shop-item-info">
                                    <h4>{item.name}</h4>
                                    <p>{item.description}</p>
                                    <div className="shop-item-price">
                                        <BsCoin /> {item.price} RC
                                    </div>
                                </div>
                                <button 
                                    className={`buy-button ${profile.inventory.some(i => i.id === item.id) ? 'owned' : ''}`}
                                    onClick={() => handleBuyItem(item.id)}
                                    disabled={profile.inventory.some(i => i.id === item.id)}
                                >
                                    {profile.inventory.some(i => i.id === item.id) ? 'Куплено' : 'Купить'}
                                </button>
                            </div>
                            <div className={`shop-item-rarity ${item.rarity}`}>
                                {item.rarity === 'epic' && 'Эпический'}
                                {item.rarity === 'rare' && 'Редкий'}
                                {item.rarity === 'uncommon' && 'Необычный'}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );

    return (
        <div className="profile-page">
            <button 
                className="back-button"
                onClick={() => navigate('/')}
            >
                <BsArrowLeft /> Вернуться в чат
            </button>
            <div className="profile-navigation">
                <button 
                    className={`nav-button ${activeTab === 'overview' ? 'active' : ''}`}
                    onClick={() => setActiveTab('overview')}
                >
                    <BsPersonCircle /> Обзор
                </button>
                <button 
                    className={`nav-button ${activeTab === 'tasks' ? 'active' : ''}`}
                    onClick={() => setActiveTab('tasks')}
                >
                    <BsListCheck /> Задания
                </button>
                <button 
                    className={`nav-button ${activeTab === 'inventory' ? 'active' : ''}`}
                    onClick={() => setActiveTab('inventory')}
                >
                    <BsBoxSeam /> Инвентарь
                </button>
                <button 
                    className={`nav-button ${activeTab === 'shop' ? 'active' : ''}`}
                    onClick={() => setActiveTab('shop')}
                >
                    <BsShop /> Магазин
                </button>
            </div>

            <div className="profile-content">
                {activeTab === 'overview' && renderOverview()}
                {activeTab === 'tasks' && renderDailyTasks()}
                {activeTab === 'inventory' && renderInventory()}
                {activeTab === 'shop' && renderShop()}
            </div>
        </div>
    );
}

export default Profile; 