class ProfileFeatures {
  constructor() {
    this.dateLocations = [
      {
        id: 1,
        type: 'restaurant',
        name: 'Романтик Кафе',
        description: 'Уютное место для романтического ужина',
        rating: 4.8,
        priceLevel: '₽₽',
        photos: ['cafe1.jpg', 'cafe2.jpg'],
        features: ['Живая музыка', 'Панорамный вид'],
        location: { lat: 55.7558, lng: 37.6173 }
      },
      {
        id: 2,
        type: 'activity',
        name: 'Парк Горького',
        description: 'Идеальное место для активного отдыха',
        rating: 4.9,
        priceLevel: '₽',
        photos: ['park1.jpg', 'park2.jpg'],
        features: ['Велопрокат', 'Кафе'],
        location: { lat: 55.7298, lng: 37.6012 }
      }
    ];

    this.badges = {
      vip: {
        id: 'vip',
        name: 'VIP',
        icon: '👑',
        description: 'VIP-статус',
        benefits: ['Приоритет в поиске', 'Невидимый режим']
      },
      verified: {
        id: 'verified',
        name: 'Проверен',
        icon: '✓',
        description: 'Подтвержденный профиль',
        benefits: ['Повышенное доверие']
      },
      popular: {
        id: 'popular',
        name: 'Популярный',
        icon: '⭐',
        description: 'Популярный пользователь',
        benefits: ['Больше просмотров']
      }
    };

    this.ratings = {
      communication: {
        name: 'Общение',
        icon: '💬',
        description: 'Качество общения'
      },
      reliability: {
        name: 'Надежность',
        icon: '🤝',
        description: 'Пунктуальность и ответственность'
      },
      photos: {
        name: 'Фото',
        icon: '📸',
        description: 'Соответствие фото'
      }
    };

    this.questionnaire = {
      sections: [
        {
          id: 'basic',
          title: 'Основная информация',
          questions: [
            {
              id: 'lifestyle',
              type: 'select',
              question: 'Образ жизни',
              options: ['Активный', 'Спокойный', 'Смешанный']
            },
            {
              id: 'interests',
              type: 'multiselect',
              question: 'Интересы',
              options: ['Спорт', 'Музыка', 'Путешествия', 'Кино', 'Искусство']
            }
          ]
        },
        {
          id: 'preferences',
          title: 'Предпочтения',
          questions: [
            {
              id: 'dating_style',
              type: 'select',
              question: 'Предпочитаемый формат свиданий',
              options: ['Активный отдых', 'Рестораны', 'Культурные мероприятия']
            }
          ]
        }
      ]
    };
  }

  // Планировщик свиданий
  getDateRecommendations(userPreferences, location) {
    return this.dateLocations.filter(place => {
      // Фильтрация по предпочтениям и местоположению
      const distance = this.calculateDistance(location, place.location);
      return distance <= userPreferences.maxDistance;
    }).sort((a, b) => b.rating - a.rating);
  }

  calculateDistance(point1, point2) {
    // Расчет расстояния между точками
    const R = 6371; // Радиус Земли в км
    const dLat = this.deg2rad(point2.lat - point1.lat);
    const dLon = this.deg2rad(point2.lng - point1.lng);
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(this.deg2rad(point1.lat)) * Math.cos(this.deg2rad(point2.lat)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }

  deg2rad(deg) {
    return deg * (Math.PI/180);
  }

  // Система рейтинга
  calculateUserRating(reviews) {
    const ratings = {
      overall: 0,
      communication: 0,
      reliability: 0,
      photos: 0
    };

    if (reviews.length === 0) return ratings;

    reviews.forEach(review => {
      ratings.communication += review.communication;
      ratings.reliability += review.reliability;
      ratings.photos += review.photos;
    });

    const count = reviews.length;
    ratings.communication /= count;
    ratings.reliability /= count;
    ratings.photos /= count;
    ratings.overall = (ratings.communication + ratings.reliability + ratings.photos) / 3;

    return ratings;
  }

  // Управление VIP-статусом
  getVipFeatures(userId) {
    return {
      invisibleMode: true,
      prioritySearch: true,
      extendedStats: true,
      specialBadges: Object.values(this.badges)
    };
  }

  // Статистика профиля
  getProfileStats(userId) {
    return {
      views: {
        total: 1234,
        today: 56,
        byTime: [/* почасовая статистика */]
      },
      likes: {
        received: 89,
        given: 45,
        matches: 12
      },
      activity: {
        messages: 234,
        dateRequests: 8,
        responseRate: 0.85
      },
      popularity: {
        rank: 'Высокий',
        percentile: 85,
        trend: 'growing'
      }
    };
  }

  // Управление анкетой
  saveQuestionnaireAnswers(userId, answers) {
    // Сохранение ответов пользователя
    console.log('Saving answers for user:', userId, answers);
    return true;
  }

  // Управление голосовыми приветствиями
  saveVoiceGreeting(userId, audioBlob) {
    // Сохранение голосового приветствия
    console.log('Saving voice greeting for user:', userId);
    return {
      url: 'voice_greeting_url',
      duration: '15s'
    };
  }

  // Управление мини-блогом
  createBlogPost(userId, post) {
    // Создание поста в мини-блоге
    return {
      id: Date.now(),
      userId,
      content: post.content,
      media: post.media,
      timestamp: new Date(),
      likes: 0,
      comments: []
    };
  }

  // Невидимый режим
  toggleInvisibleMode(userId, enabled) {
    // Включение/выключение невидимого режима
    console.log('Invisible mode:', enabled ? 'enabled' : 'disabled', 'for user:', userId);
    return enabled;
  }
}

export default new ProfileFeatures(); 