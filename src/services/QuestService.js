class QuestService {
  constructor() {
    this.quests = [
      {
        id: 'detective-1',
        title: 'Тайна старого особняка',
        description: 'Вместе раскройте загадку исчезновения ценной картины',
        difficulty: 'medium',
        duration: '15min',
        type: 'detective',
        unlockRequirements: null, // Доступен сразу
        rewards: {
          coins: 100,
          experience: 150,
          special: 'detective_badge'
        },
        stages: [
          {
            id: 1,
            scene: 'entrance',
            description: 'Вы стоите перед старинным особняком. Дверь приоткрыта...',
            background: 'mansion_entrance.jpg',
            mood: 'mysterious',
            options: [
              { 
                id: 1, 
                text: 'Войти через главный вход', 
                leads_to: 2,
                compatibility: 5,
                personality: ['brave', 'direct'],
                explanation: 'Прямолинейный подход показывает открытость'
              },
              { 
                id: 2, 
                text: 'Осмотреть окрестности', 
                leads_to: 3,
                compatibility: 8,
                personality: ['careful', 'analytical'],
                explanation: 'Внимательность к деталям и осторожность'
              },
              { 
                id: 3, 
                text: 'Позвонить в дверь', 
                leads_to: 4,
                compatibility: 3,
                personality: ['polite', 'conventional'],
                explanation: 'Вежливость, но недостаток авантюризма'
              }
            ],
            hint: 'Обратите внимание на следы у входа'
          },
          {
            id: 2,
            scene: 'hall',
            description: 'В холле темно и пыльно. Слева - лестница наверх, справа - дверь в библиотеку...',
            options: [
              {
                id: 1,
                text: 'Подняться по лестнице',
                leads_to: 5,
                compatibility: 7,
                explanation: 'Стремление к исследованию'
              },
              {
                id: 2,
                text: 'Войти в библиотеку',
                leads_to: 6,
                compatibility: 6,
                explanation: 'Интерес к знаниям'
              },
              {
                id: 3,
                text: 'Осмотреть холл внимательнее',
                leads_to: 7,
                compatibility: 9,
                explanation: 'Высокая наблюдательность'
              }
            ],
            hint: 'В пыли видны чьи-то следы'
          }
          // Добавьте больше этапов...
        ]
      },
      {
        id: 'romantic-1',
        title: 'Вечер в Париже',
        description: 'Проведите незабываемый вечер в городе любви',
        difficulty: 'easy',
        duration: '10min',
        type: 'romantic',
        unlockRequirements: null,
        rewards: {
          coins: 80,
          experience: 100,
          special: 'romantic_soul'
        },
        stages: [
          {
            id: 1,
            scene: 'cafe',
            description: 'Вы сидите в уютном парижском кафе. Закат окрашивает небо в розовые тона...',
            background: 'paris_cafe.jpg',
            mood: 'romantic',
            options: [
              {
                id: 1,
                text: 'Заказать вино и круассаны',
                leads_to: 2,
                compatibility: 7,
                personality: ['romantic', 'sophisticated'],
                explanation: 'Чувство стиля и романтичность'
              },
              {
                id: 2,
                text: 'Предложить прогуляться по набережной',
                leads_to: 3,
                compatibility: 8,
                personality: ['adventurous', 'spontaneous'],
                explanation: 'Спонтанность и любовь к приключениям'
              },
              {
                id: 3,
                text: 'Обсудить любимые фильмы о Париже',
                leads_to: 4,
                compatibility: 6,
                personality: ['intellectual', 'cultural'],
                explanation: 'Интерес к культуре и искусству'
              }
            ],
            hint: 'Подумайте, что создаст самую романтичную атмосферу'
          }
        ]
      },
      {
        id: 'adventure-1',
        title: 'Затерянный храм',
        description: 'Исследуйте древний храм и найдите легендарные сокровища',
        difficulty: 'hard',
        duration: '20min',
        type: 'adventure',
        unlockRequirements: {
          questsCompleted: ['detective-1'],
          level: 5
        },
        rewards: {
          coins: 200,
          experience: 300,
          special: 'adventurer_trophy'
        },
        stages: [
          {
            id: 1,
            scene: 'temple_entrance',
            description: 'Перед вами древний храм, покрытый загадочными символами...',
            background: 'temple.jpg',
            mood: 'mysterious',
            options: [
              {
                id: 1,
                text: 'Изучить символы на стенах',
                leads_to: 2,
                compatibility: 9,
                personality: ['intellectual', 'patient'],
                explanation: 'Глубокий интерес к загадкам и истории'
              },
              {
                id: 2,
                text: 'Искать тайный вход',
                leads_to: 3,
                compatibility: 7,
                personality: ['adventurous', 'intuitive'],
                explanation: 'Следование интуиции и жажда приключений'
              },
              {
                id: 3,
                text: 'Подождать заката для особых знаков',
                leads_to: 4,
                compatibility: 8,
                personality: ['mystical', 'observant'],
                explanation: 'Внимание к деталям и вера в мистическое'
              }
            ],
            hint: 'Символы могут указывать на время активации храма'
          }
        ]
      }
    ];

    this.rewards = {
      badges: {
        detective_badge: {
          name: 'Детектив',
          icon: '🔍',
          description: 'Мастер распутывания загадок',
          bonuses: ['Доступ к специальным детективным квестам']
        },
        romantic_soul: {
          name: 'Романтическая душа',
          icon: '💝',
          description: 'Эксперт в создании романтической атмосферы',
          bonuses: ['Увеличенный шанс на взаимную симпатию']
        },
        adventurer_trophy: {
          name: 'Искатель приключений',
          icon: '🏆',
          description: 'Бесстрашный исследователь',
          bonuses: ['Доступ к экстремальным квестам']
        },
        perfect_match: {
          name: 'Идеальная пара',
          icon: '✨',
          description: 'Достигнута высшая совместимость',
          bonuses: ['Бесплатный Premium на 24 часа']
        }
      },
      items: {
        super_like: {
          name: 'Супер-лайк',
          icon: '⭐',
          description: 'Гарантированно показывает ваш профиль выбранному пользователю',
          duration: null
        },
        profile_boost: {
          name: 'Буст профиля',
          icon: '🚀',
          description: 'Ваш профиль будет показываться чаще в течение 24 часов',
          duration: '24h'
        },
        instant_match: {
          name: 'Мгновенный матч',
          icon: '⚡',
          description: 'Мгновенное совпадение с выбранным профилем',
          duration: null
        }
      }
    };

    this.personalityTraits = {
      brave: { name: 'Смелость', weight: 1.2 },
      direct: { name: 'Прямолинейность', weight: 1.0 },
      careful: { name: 'Осторожность', weight: 1.1 },
      analytical: { name: 'Аналитический склад', weight: 1.3 },
      polite: { name: 'Вежливость', weight: 0.9 },
      romantic: { name: 'Романтичность', weight: 1.4 },
      adventurous: { name: 'Авантюризм', weight: 1.2 },
      intellectual: { name: 'Интеллектуальность', weight: 1.3 },
      mystical: { name: 'Мистичность', weight: 1.1 }
    };
  }

  getQuests() {
    return this.quests;
  }

  getQuestById(id) {
    return this.quests.find(quest => quest.id === id);
  }

  getAvailableQuests(userLevel, completedQuests) {
    return this.quests.filter(quest => {
      if (!quest.unlockRequirements) return true;
      
      const levelOk = !quest.unlockRequirements.level || userLevel >= quest.unlockRequirements.level;
      const questsOk = !quest.unlockRequirements.questsCompleted || 
        quest.unlockRequirements.questsCompleted.every(questId => completedQuests.includes(questId));
      
      return levelOk && questsOk;
    });
  }

  calculateCompatibility(questId, choices) {
    const quest = this.getQuestById(questId);
    if (!quest) return { total: 0, traits: {} };

    let totalCompatibility = 0;
    let maxPossibleCompatibility = 0;
    const personalityTraits = {};

    choices.forEach(choice => {
      const stage = quest.stages.find(s => s.id === choice.stageId);
      if (stage) {
        const option = stage.options.find(o => o.id === choice.optionId);
        if (option) {
          // Базовая совместимость
          totalCompatibility += option.compatibility;
          maxPossibleCompatibility += 10;

          // Анализ черт личности
          option.personality.forEach(trait => {
            if (!personalityTraits[trait]) {
              personalityTraits[trait] = 0;
            }
            personalityTraits[trait] += this.personalityTraits[trait].weight;
          });
        }
      }
    });

    const compatibilityScore = Math.round((totalCompatibility / maxPossibleCompatibility) * 100);

    return {
      total: compatibilityScore,
      traits: personalityTraits
    };
  }

  getQuestRewards(questId, compatibility) {
    const quest = this.getQuestById(questId);
    if (!quest) return null;

    const rewards = {
      base: { ...quest.rewards },
      bonus: {
        badges: [],
        items: [],
        coins: 0,
        experience: 0
      }
    };

    // Бонусные награды за высокую совместимость
    if (compatibility.total >= 90) {
      rewards.bonus.badges.push(this.rewards.badges.perfect_match);
      rewards.bonus.items.push(this.rewards.items.instant_match);
      rewards.bonus.coins = Math.round(quest.rewards.coins * 0.5);
      rewards.bonus.experience = Math.round(quest.rewards.experience * 0.5);
    } else if (compatibility.total >= 70) {
      rewards.bonus.items.push(this.rewards.items.profile_boost);
      rewards.bonus.coins = Math.round(quest.rewards.coins * 0.3);
      rewards.bonus.experience = Math.round(quest.rewards.experience * 0.3);
    } else if (compatibility.total >= 50) {
      rewards.bonus.items.push(this.rewards.items.super_like);
      rewards.bonus.coins = Math.round(quest.rewards.coins * 0.1);
      rewards.bonus.experience = Math.round(quest.rewards.experience * 0.1);
    }

    return rewards;
  }

  getPersonalityAnalysis(traits) {
    const sortedTraits = Object.entries(traits)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3);

    return sortedTraits.map(([trait, value]) => ({
      trait: this.personalityTraits[trait].name,
      value: Math.round(value * 10),
      description: this.getTraitDescription(trait)
    }));
  }

  getTraitDescription(trait) {
    const descriptions = {
      brave: 'Вы не боитесь принимать смелые решения и идти на риск',
      direct: 'Предпочитаете прямой подход и честность в общении',
      careful: 'Внимательны к деталям и предпочитаете все тщательно обдумывать',
      analytical: 'Обладаете сильными аналитическими способностями',
      polite: 'Всегда соблюдаете этикет и уважаете других',
      romantic: 'У вас романтическая натура и тяга к прекрасному',
      adventurous: 'Любите приключения и новые впечатления',
      intellectual: 'Цените интеллектуальные беседы и саморазвитие',
      mystical: 'Вас привлекает все таинственное и необъяснимое'
    };

    return descriptions[trait] || '';
  }

  getQuestProgress(questId, currentStageId) {
    const quest = this.getQuestById(questId);
    if (!quest) return { percent: 0, stagesLeft: 0 };

    const totalStages = quest.stages.length;
    const currentIndex = quest.stages.findIndex(stage => stage.id === currentStageId);
    const stagesLeft = totalStages - (currentIndex + 1);

    return {
      percent: Math.round(((currentIndex + 1) / totalStages) * 100),
      stagesLeft,
      totalStages
    };
  }
}

export default new QuestService(); 
