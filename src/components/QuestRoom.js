import React, { useState, useEffect } from 'react';
import './QuestRoom.css';
import { 
  BsArrowLeft, 
  BsLightbulb, 
  BsClock, 
  BsHeart, 
  BsStar,
  BsChatDots,
  BsEmojiSmile,
  BsTrophy,
  BsLightningCharge,
  BsCoin,
  BsGift,
  BsPersonBadge,
  BsBarChart,
  BsArrowRepeat
} from 'react-icons/bs';

function QuestRoom({ onBack, partner, quest, userLevel, completedQuests, onContinueChat, onStartNewQuest }) {
  const [currentStage, setCurrentStage] = useState(null);
  const [timeLeft, setTimeLeft] = useState(900); // 15 минут
  const [hints, setHints] = useState(3);
  const [showChat, setShowChat] = useState(false);
  const [compatibility, setCompatibility] = useState({ total: 0, traits: {} });
  const [messages, setMessages] = useState([]);
  const [choices, setChoices] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [questRewards, setQuestRewards] = useState(null);
  const [personalityAnalysis, setPersonalityAnalysis] = useState([]);
  const [showReactionPanel, setShowReactionPanel] = useState(false);
  const [partnerStatus, setPartnerStatus] = useState('thinking');
  const [questProgress, setQuestProgress] = useState({ percent: 0, stagesLeft: 0, totalStages: 0 });
  const [activeControl, setActiveControl] = useState(null);

  // Эмоции для реакций
  const reactions = [
    { emoji: '😊', name: 'smile' },
    { emoji: '😍', name: 'love' },
    { emoji: '🤔', name: 'thinking' },
    { emoji: '😮', name: 'surprised' },
    { emoji: '👏', name: 'applause' },
    { emoji: '❤️', name: 'heart' }
  ];

  useEffect(() => {
    if (quest) {
      setCurrentStage(quest.stages[0]);
      setQuestProgress({
        percent: 0,
        stagesLeft: quest.stages.length,
        totalStages: quest.stages.length
      });
    }
  }, [quest]);

  useEffect(() => {
    const timer = setInterval(() => {
      if (timeLeft > 0) {
        setTimeLeft(prev => prev - 1);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleOptionSelect = (option) => {
    // Сохраняем выбор
    const newChoice = {
      stageId: currentStage.id,
      optionId: option.id,
      timestamp: new Date()
    };
    setChoices(prev => [...prev, newChoice]);

    // Имитация ответа партнера
    setPartnerStatus('thinking');
    setTimeout(() => {
      setPartnerStatus('chose');
      // Случайная реакция партнера
      sendMessage('partner', `Интересный выбор! ${option.explanation}`);
    }, 2000);

    // Обновляем совместимость
    const newCompatibility = calculateCompatibility([...choices, newChoice]);
    setCompatibility(newCompatibility);

    // Проверяем, есть ли следующий этап
    const nextStageId = option.leads_to;
    const nextStage = quest.stages.find(stage => stage.id === nextStageId);

    if (nextStage) {
      setTimeout(() => {
        setCurrentStage(nextStage);
        updateProgress(nextStage.id);
      }, 1000);
    } else {
      // Квест завершен
      const rewards = calculateRewards(newCompatibility);
      setQuestRewards(rewards);
      const analysis = analyzePersonality(newCompatibility.traits);
      setPersonalityAnalysis(analysis);
      setShowResults(true);
    }
  };

  const calculateCompatibility = (currentChoices) => {
    return {
      total: Math.min(100, compatibility.total + 5),
      traits: {
        ...compatibility.traits,
        // Добавляем новые черты из текущего выбора
      }
    };
  };

  const calculateRewards = (finalCompatibility) => {
    const baseRewards = {
      coins: quest.rewards.coins,
      experience: quest.rewards.experience,
      special: quest.rewards.special
    };

    // Бонусы за высокую совместимость
    if (finalCompatibility.total >= 90) {
      baseRewards.coins *= 1.5;
      baseRewards.experience *= 1.5;
    } else if (finalCompatibility.total >= 70) {
      baseRewards.coins *= 1.3;
      baseRewards.experience *= 1.3;
    }

    return baseRewards;
  };

  const analyzePersonality = (traits) => {
    // Анализ личности на основе выборов
    return Object.entries(traits)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([trait, value]) => ({
        trait,
        value: Math.round(value * 10),
        description: getTraitDescription(trait)
      }));
  };

  const getTraitDescription = (trait) => {
    const descriptions = {
      brave: 'Смелость в принятии решений',
      romantic: 'Романтическая натура',
      analytical: 'Логическое мышление',
      // ... другие описания
    };
    return descriptions[trait] || '';
  };

  const useHint = () => {
    if (hints > 0) {
      setHints(prev => prev - 1);
      sendMessage('system', currentStage.hint);
      // Добавляем анимацию подсказки
      const hintElement = document.querySelector('.scene-description');
      hintElement.classList.add('hint-highlight');
      setTimeout(() => hintElement.classList.remove('hint-highlight'), 1000);
    }
  };

  const sendMessage = (sender, text) => {
    const newMessage = {
      id: Date.now(),
      text,
      sender,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const sendReaction = (reaction) => {
    sendMessage('user', reaction.emoji);
    setShowReactionPanel(false);
  };

  const updateProgress = (stageId) => {
    const progress = {
      percent: Math.round((stageId / quest.stages.length) * 100),
      stagesLeft: quest.stages.length - stageId,
      totalStages: quest.stages.length
    };
    setQuestProgress(progress);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleContinueChat = () => {
    if (onContinueChat) {
      onContinueChat(partner);
    }
    onBack();
  };

  const handleStartNewQuest = () => {
    if (onStartNewQuest) {
      onStartNewQuest(partner);
    }
    onBack();
  };

  const toggleChat = () => {
    setShowChat(!showChat);
    setActiveControl(showChat ? null : 'chat');
    setShowReactionPanel(false);
  };

  const toggleReactionPanel = () => {
    setShowReactionPanel(!showReactionPanel);
    setActiveControl(showReactionPanel ? null : 'reaction');
    setShowChat(false);
  };

  return (
    <div className="quest-room">
      <div className="quest-header">
        <button className="back-button" onClick={onBack}>
          <BsArrowLeft /> Выход
        </button>
        <div className="quest-info">
          <h2>{quest?.title}</h2>
          <div className="quest-stats">
            <div className="stat-item">
              <BsClock />
              <span>{formatTime(timeLeft)}</span>
            </div>
            <div className="stat-item">
              <BsLightbulb />
              <span>{hints} подсказки</span>
            </div>
            <div className="stat-item">
              <BsHeart />
              <span>{compatibility.total}% совместимость</span>
            </div>
            <div className="stat-item progress">
              <BsBarChart />
              <span>{questProgress.percent}% пройдено</span>
            </div>
          </div>
        </div>
      </div>

      <div className="quest-content">
        <div className="quest-scene" style={{ backgroundImage: `url(${currentStage?.background})` }}>
          <div className="scene-description">
            {currentStage?.description}
          </div>
          <div className="scene-options">
            {currentStage?.options.map(option => (
              <button
                key={option.id}
                className="quest-option"
                onClick={() => handleOptionSelect(option)}
              >
                {option.text}
              </button>
            ))}
          </div>
        </div>

        <div className="quest-partner">
          <div className="partner-info">
            <div className="partner-photo-container">
              <img src={partner?.photo} alt={partner?.name} className="partner-photo" />
              <div className={`partner-status ${partnerStatus}`}>
                {partnerStatus === 'thinking' && '🤔'}
                {partnerStatus === 'chose' && '✨'}
              </div>
            </div>
            <div className="partner-details">
              <h3>{partner?.name}</h3>
              <span className="status-text">
                {partnerStatus === 'thinking' ? 'Думает над решением...' : 'Сделал(а) выбор!'}
              </span>
              <div className="partner-stats">
                <div className="partner-stat">
                  <span className="partner-stat-label">
                    <BsHeart /> Совместимость
                  </span>
                  <span className="partner-stat-value">{compatibility.total}%</span>
                </div>
                <div className="partner-stat">
                  <span className="partner-stat-label">
                    <BsBarChart /> Прогресс
                  </span>
                  <span className="partner-stat-value">{questProgress.percent}%</span>
                </div>
                <div className="partner-stat">
                  <span className="partner-stat-label">
                    <BsClock /> Время в квесте
                  </span>
                  <span className="partner-stat-value">{formatTime(900 - timeLeft)}</span>
                </div>
                <div className="partner-stat">
                  <span className="partner-stat-label">
                    <BsLightningCharge /> Активность
                  </span>
                  <span className="partner-stat-value">Высокая</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="quest-controls">
        <button 
          className={`control-button hint ${hints === 0 ? 'disabled' : ''}`} 
          onClick={useHint} 
          disabled={hints === 0}
        >
          <BsLightbulb />
          <span>Подсказка ({hints})</span>
        </button>
        <button 
          className={`control-button chat ${activeControl === 'chat' ? 'active' : ''}`} 
          onClick={toggleChat}
        >
          <BsChatDots />
          <span>Чат {messages.length > 0 && `(${messages.length})`}</span>
        </button>
        <button 
          className={`control-button emoji ${activeControl === 'reaction' ? 'active' : ''}`} 
          onClick={toggleReactionPanel}
        >
          <BsEmojiSmile />
          <span>Реакция</span>
        </button>
      </div>

      {showReactionPanel && (
        <div className="reaction-panel">
          {reactions.map(reaction => (
            <button
              key={reaction.name}
              className="reaction-button"
              onClick={() => sendReaction(reaction)}
            >
              {reaction.emoji}
            </button>
          ))}
        </div>
      )}

      {showChat && (
        <div className="quest-chat">
          <div className="chat-messages">
            {messages.map(message => (
              <div key={message.id} className={`chat-message ${message.sender}`}>
                <div className="message-content">{message.text}</div>
                <div className="message-time">
                  {new Date(message.timestamp).toLocaleTimeString()}
                </div>
              </div>
            ))}
          </div>
          <div className="chat-input">
            <input
              type="text"
              placeholder="Написать сообщение..."
              onKeyPress={(e) => {
                if (e.key === 'Enter' && e.target.value.trim()) {
                  sendMessage('user', e.target.value);
                  e.target.value = '';
                }
              }}
            />
          </div>
        </div>
      )}

      {showResults && (
        <div className="quest-complete">
          <div className="complete-content">
            <BsTrophy className="complete-icon" />
            <h2>Квест пройден!</h2>
            
            <div className="complete-stats">
              <div className="stat-item">
                <BsLightningCharge />
                <span>Время: {formatTime(900 - timeLeft)}</span>
              </div>
              <div className="stat-item">
                <BsHeart />
                <span>Совместимость: {compatibility.total}%</span>
              </div>
            </div>

            <div className="rewards-section">
              <h3><BsGift /> Награды</h3>
              <div className="rewards-grid">
                <div className="reward-item">
                  <BsCoin />
                  <span>{questRewards.coins} монет</span>
                </div>
                <div className="reward-item">
                  <BsStar />
                  <span>{questRewards.experience} опыта</span>
                </div>
                {questRewards.special && (
                  <div className="reward-item special">
                    <BsPersonBadge />
                    <span>{questRewards.special}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="personality-section">
              <h3><BsBarChart /> Анализ совместимости</h3>
              <div className="personality-traits">
                {personalityAnalysis.map((trait, index) => (
                  <div key={index} className="trait-item">
                    <div className="trait-header">
                      <span className="trait-name">{trait.trait}</span>
                      <span className="trait-value">{trait.value}%</span>
                    </div>
                    <div className="trait-bar">
                      <div 
                        className="trait-progress" 
                        style={{ width: `${trait.value}%` }}
                      />
                    </div>
                    <p className="trait-description">{trait.description}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="complete-actions">
              <button className="action-button primary" onClick={handleContinueChat}>
                Продолжить общение
              </button>
              <button className="action-button secondary" onClick={handleStartNewQuest}>
                <BsArrowRepeat /> Новый квест
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default QuestRoom; 
