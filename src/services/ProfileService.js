import CurrencyService from './CurrencyService';

class ProfileService {
    constructor() {
        this.loadProfile();
        this.initDailyTasks();
    }

    loadProfile() {
        const savedProfile = localStorage.getItem('userProfile');
        if (savedProfile) {
            this.profile = JSON.parse(savedProfile);
        } else {
            this.profile = {
                id: this.generateTempId(),
                nickname: this.generateTempNickname(),
                level: 1,
                experience: 0,
                experienceToNextLevel: 100,
                achievements: [],
                inventory: [],
                dailyTasks: [],
                stats: {
                    totalChats: 0,
                    totalTime: 0,
                    giftsGiven: 0,
                    giftsReceived: 0,
                    tasksCompleted: 0
                },
                lastDailyReset: new Date().toISOString()
            };
            this.saveProfile();
        }
    }

    generateTempId() {
        return 'temp_' + Math.random().toString(36).substr(2, 9);
    }

    generateTempNickname() {
        const adjectives = ['Веселый', 'Добрый', 'Умный', 'Крутой', 'Классный'];
        const nouns = ['Пользователь', 'Гость', 'Собеседник', 'Друг'];
        const randomNumber = Math.floor(Math.random() * 1000);
        return `${adjectives[Math.floor(Math.random() * adjectives.length)]}${nouns[Math.floor(Math.random() * nouns.length)]}${randomNumber}`;
    }

    saveProfile() {
        localStorage.setItem('userProfile', JSON.stringify(this.profile));
    }

    getProfile() {
        return this.profile;
    }

    addExperience(amount) {
        this.profile.experience += amount;
        while (this.profile.experience >= this.profile.experienceToNextLevel) {
            this.levelUp();
        }
        this.saveProfile();
        return {
            currentLevel: this.profile.level,
            experience: this.profile.experience,
            experienceToNextLevel: this.profile.experienceToNextLevel
        };
    }

    levelUp() {
        this.profile.experience -= this.profile.experienceToNextLevel;
        this.profile.level += 1;
        this.profile.experienceToNextLevel = Math.floor(this.profile.experienceToNextLevel * 1.5);
        // Награда за новый уровень
        const reward = this.profile.level * 50; // RC за уровень
        CurrencyService.addFunds(reward / 2); // Конвертируем в RC
    }

    initDailyTasks() {
        const lastReset = new Date(this.profile.lastDailyReset);
        const now = new Date();
        
        // Проверяем, нужно ли обновить ежедневные задания
        if (lastReset.getDate() !== now.getDate() || !this.profile.dailyTasks || this.profile.dailyTasks.length === 0) {
            this.generateDailyTasks();
        }

        // Проверяем, нужно ли обновить недельное задание
        if (!this.profile.weeklyTask || new Date(this.profile.weeklyTask.expiresAt) < now) {
            this.generateWeeklyTask();
        }
    }

    generateDailyTasks() {
        const possibleDailyTasks = [
            {
                id: 'chat_3',
                title: 'Общительный',
                description: 'Проведите диалог минимум по 1 минуте с 3 разными людьми',
                reward: 50,
                target: 3,
                progress: 0,
                type: 'chats',
                taskType: 'daily',
                completed: false
            },
            {
                id: 'time_15',
                title: 'Активный собеседник',
                description: 'Проведите в чате суммарно 15 минут',
                reward: 30,
                target: 15,
                progress: 0,
                type: 'time',
                taskType: 'daily',
                completed: false
            },
            {
                id: 'gifts_3',
                title: 'Щедрая душа',
                description: 'Отправьте 3 подарка собеседникам',
                reward: 40,
                target: 3,
                progress: 0,
                type: 'gifts',
                taskType: 'daily',
                completed: false
            },
            {
                id: 'likes_5',
                title: 'Позитивный настрой',
                description: 'Поставьте 5 лайков собеседникам',
                reward: 25,
                target: 5,
                progress: 0,
                type: 'likes',
                taskType: 'daily',
                completed: false
            },
            {
                id: 'video_2',
                title: 'Видеочаты',
                description: 'Проведите 2 видеочата',
                reward: 60,
                target: 2,
                progress: 0,
                type: 'video',
                taskType: 'daily',
                completed: false
            }
        ];

        // Выбираем 3 случайных ежедневных задания
        this.profile.dailyTasks = this.shuffleArray(possibleDailyTasks).slice(0, 3);
        this.profile.lastDailyReset = new Date().toISOString();
        this.saveProfile();
    }

    generateWeeklyTask() {
        const possibleWeeklyTasks = [
            {
                id: 'weekly_chat_50',
                title: 'Общительная неделя',
                description: 'Пообщайтесь с 50 разными собеседниками',
                reward: 500,
                target: 50,
                progress: 0,
                type: 'chats',
                taskType: 'weekly',
                completed: false,
                expiresAt: this.getWeeklyExpiration()
            },
            {
                id: 'weekly_time_180',
                title: 'Марафонец',
                description: 'Проведите в чате 3 часа',
                reward: 400,
                target: 180,
                progress: 0,
                type: 'time',
                taskType: 'weekly',
                completed: false,
                expiresAt: this.getWeeklyExpiration()
            },
            {
                id: 'weekly_gifts_20',
                title: 'Щедрый даритель',
                description: 'Отправьте 20 подарков',
                reward: 450,
                target: 20,
                progress: 0,
                type: 'gifts',
                taskType: 'weekly',
                completed: false,
                expiresAt: this.getWeeklyExpiration()
            },
            {
                id: 'weekly_video_10',
                title: 'Видеомарафон',
                description: 'Проведите 10 видеочатов',
                reward: 600,
                target: 10,
                progress: 0,
                type: 'video',
                taskType: 'weekly',
                completed: false,
                expiresAt: this.getWeeklyExpiration()
            },
            {
                id: 'weekly_likes_50',
                title: 'Лайкомания',
                description: 'Поставьте 50 лайков',
                reward: 300,
                target: 50,
                progress: 0,
                type: 'likes',
                taskType: 'weekly',
                completed: false,
                expiresAt: this.getWeeklyExpiration()
            }
        ];

        // Выбираем 1 случайное недельное задание
        this.profile.weeklyTask = this.shuffleArray(possibleWeeklyTasks)[0];
        this.saveProfile();
    }

    getWeeklyExpiration() {
        const date = new Date();
        date.setDate(date.getDate() + 7);
        return date.toISOString();
    }

    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    updateTaskProgress(taskType, amount = 1) {
        let updated = false;
        
        // Обновляем ежедневные задания
        this.profile.dailyTasks = this.profile.dailyTasks.map(task => {
            if (task.type === taskType && task.progress < task.target) {
                task.progress = Math.min(task.progress + amount, task.target);
                if (task.progress === task.target && !task.completed) {
                    task.completed = true;
                    this.addExperience(task.reward);
                    this.profile.stats.tasksCompleted++;
                    updated = true;
                }
            }
            return task;
        });

        // Обновляем недельное задание
        if (this.profile.weeklyTask && 
            this.profile.weeklyTask.type === taskType && 
            this.profile.weeklyTask.progress < this.profile.weeklyTask.target &&
            new Date(this.profile.weeklyTask.expiresAt) > new Date()) {
            
            this.profile.weeklyTask.progress = Math.min(
                this.profile.weeklyTask.progress + amount,
                this.profile.weeklyTask.target
            );

            if (this.profile.weeklyTask.progress === this.profile.weeklyTask.target && 
                !this.profile.weeklyTask.completed) {
                this.profile.weeklyTask.completed = true;
                this.addExperience(this.profile.weeklyTask.reward);
                this.profile.stats.tasksCompleted++;
                updated = true;
            }
        }

        if (updated) {
            this.saveProfile();
        }
        return {
            dailyTasks: this.profile.dailyTasks,
            weeklyTask: this.profile.weeklyTask
        };
    }

    // Коллекционные предметы
    getShopItems() {
        return [
            {
                id: 'frame_gold',
                name: 'Золотая рамка',
                description: 'Украсьте свой профиль золотой рамкой',
                price: 1000,
                type: 'frame',
                rarity: 'rare'
            },
            {
                id: 'effect_sparkles',
                name: 'Эффект искр',
                description: 'Добавьте искры вокруг вашего аватара',
                price: 500,
                type: 'effect',
                rarity: 'uncommon'
            },
            {
                id: 'badge_vip',
                name: 'VIP значок',
                description: 'Особый значок для вашего профиля',
                price: 2000,
                type: 'badge',
                rarity: 'epic'
            },
            {
                id: 'title_master',
                name: 'Титул "Мастер общения"',
                description: 'Уникальный титул под именем',
                price: 1500,
                type: 'title',
                rarity: 'rare'
            },
            {
                id: 'effect_neon',
                name: 'Неоновое свечение',
                description: 'Добавьте неоновый эффект вокруг аватара',
                price: 800,
                type: 'effect',
                rarity: 'rare'
            },
            {
                id: 'badge_heart',
                name: 'Значок "Любимчик"',
                description: 'Показывает вашу популярность',
                price: 1200,
                type: 'badge',
                rarity: 'rare'
            },
            {
                id: 'effect_cool',
                name: 'Эффект "Крутой"',
                description: 'Добавляет солнечные очки на аватар',
                price: 700,
                type: 'effect',
                rarity: 'uncommon'
            },
            {
                id: 'frame_rainbow',
                name: 'Радужная рамка',
                description: 'Переливающаяся всеми цветами рамка',
                price: 1500,
                type: 'frame',
                rarity: 'epic'
            },
            {
                id: 'effect_music',
                name: 'Эффект "Меломан"',
                description: 'Добавляет музыкальные ноты вокруг аватара',
                price: 600,
                type: 'effect',
                rarity: 'uncommon'
            },
            {
                id: 'effect_wave',
                name: 'Звуковая волна',
                description: 'Анимированный эффект звуковой волны',
                price: 900,
                type: 'effect',
                rarity: 'rare'
            }
        ];
    }

    buyItem(itemId) {
        const item = this.getShopItems().find(i => i.id === itemId);
        if (!item) throw new Error('Предмет не найден');

        const currentBalance = CurrencyService.getBalance();
        if (currentBalance < item.price) {
            throw new Error('Недостаточно RC');
        }

        if (this.profile.inventory.some(i => i.id === itemId)) {
            throw new Error('Предмет уже куплен');
        }

        CurrencyService.spendCoins(item.price);
        this.profile.inventory.push(item);
        this.saveProfile();
        return item;
    }

    updateStats(type, value = 1) {
        if (type in this.profile.stats) {
            this.profile.stats[type] += value;
            this.saveProfile();
        }
    }
}

export default new ProfileService(); 