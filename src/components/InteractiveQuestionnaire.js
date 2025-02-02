import React, { useState } from 'react';
import './InteractiveQuestionnaire.css';
import { 
  BsX, 
  BsCheck2, 
  BsArrowRight, 
  BsArrowLeft,
  BsHeart,
  BsStarFill,
  BsEmojiSmile,
  BsGlobe,
  BsBook,
  BsMusic,
  BsCamera,
  BsPalette
} from 'react-icons/bs';
import ProfileFeatures from '../services/ProfileFeatures';

const InteractiveQuestionnaire = ({ onClose, onSave }) => {
  const [currentSection, setCurrentSection] = useState(0);
  const [answers, setAnswers] = useState({});
  const [completed, setCompleted] = useState(false);

  const sections = ProfileFeatures.questionnaire.sections;

  const handleAnswer = (questionId, value) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const handleMultiSelect = (questionId, value) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: prev[questionId]
        ? prev[questionId].includes(value)
          ? prev[questionId].filter(v => v !== value)
          : [...prev[questionId], value]
        : [value]
    }));
  };

  const isCurrentSectionComplete = () => {
    const currentQuestions = sections[currentSection].questions;
    return currentQuestions.every(q => {
      if (q.type === 'multiselect') {
        return answers[q.id] && answers[q.id].length > 0;
      }
      return answers[q.id];
    });
  };

  const handleNext = () => {
    if (currentSection < sections.length - 1) {
      setCurrentSection(prev => prev + 1);
    } else {
      handleComplete();
    }
  };

  const handleBack = () => {
    if (currentSection > 0) {
      setCurrentSection(prev => prev - 1);
    }
  };

  const handleComplete = async () => {
    if (onSave) {
      await onSave(answers);
    }
    setCompleted(true);
    setTimeout(() => {
      onClose();
    }, 2000);
  };

  const getQuestionIcon = (questionId) => {
    const icons = {
      lifestyle: <BsHeart />,
      interests: <BsStarFill />,
      personality: <BsEmojiSmile />,
      languages: <BsGlobe />,
      education: <BsBook />,
      music: <BsMusic />,
      photos: <BsCamera />,
      art: <BsPalette />
    };
    return icons[questionId] || <BsHeart />;
  };

  const renderQuestion = (question) => {
    switch (question.type) {
      case 'select':
        return (
          <div className="question-container" key={question.id}>
            <div className="question-header">
              {getQuestionIcon(question.id)}
              <h3>{question.question}</h3>
            </div>
            <div className="options-grid">
              {question.options.map(option => (
                <button
                  key={option}
                  className={`option-button ${answers[question.id] === option ? 'selected' : ''}`}
                  onClick={() => handleAnswer(question.id, option)}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        );

      case 'multiselect':
        return (
          <div className="question-container" key={question.id}>
            <div className="question-header">
              {getQuestionIcon(question.id)}
              <h3>{question.question}</h3>
            </div>
            <div className="options-grid">
              {question.options.map(option => (
                <button
                  key={option}
                  className={`option-button ${answers[question.id]?.includes(option) ? 'selected' : ''}`}
                  onClick={() => handleMultiSelect(question.id, option)}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="questionnaire">
      <div className="questionnaire-header">
        <h2>Анкета</h2>
        <button className="close-button" onClick={onClose}>
          <BsX />
        </button>
      </div>

      {!completed ? (
        <div className="questionnaire-content">
          <div className="progress-bar">
            {sections.map((section, index) => (
              <div 
                key={index}
                className={`progress-step ${index === currentSection ? 'active' : ''} ${index < currentSection ? 'completed' : ''}`}
              >
                <div className="step-number">{index + 1}</div>
                <span className="step-title">{section.title}</span>
              </div>
            ))}
          </div>

          <div className="questions-section">
            {sections[currentSection].questions.map(question => renderQuestion(question))}
          </div>

          <div className="navigation-buttons">
            {currentSection > 0 && (
              <button className="nav-button back" onClick={handleBack}>
                <BsArrowLeft /> Назад
              </button>
            )}
            <button 
              className="nav-button next"
              onClick={handleNext}
              disabled={!isCurrentSectionComplete()}
            >
              {currentSection < sections.length - 1 ? (
                <>Далее <BsArrowRight /></>
              ) : (
                <>Завершить <BsCheck2 /></>
              )}
            </button>
          </div>
        </div>
      ) : (
        <div className="success-message">
          <BsCheck2 className="success-icon" />
          <h3>Анкета заполнена!</h3>
          <p>Теперь мы сможем находить вам более подходящие пары</p>
        </div>
      )}
    </div>
  );
};

export default InteractiveQuestionnaire; 