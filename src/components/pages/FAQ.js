import React, { useState } from 'react';
import styled from 'styled-components';
import SpaceBackground from '../SpaceBackground';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';

const PageContainer = styled.div`
  min-height: 100vh;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  color: ${props => props.theme === 'light' ? '#1a237e' : 'white'};
  padding: 100px 20px 40px;
`;

const Content = styled.div`
  max-width: 800px;
  width: 100%;
  z-index: 1;
`;

const Title = styled.h1`
  font-size: 3rem;
  margin-bottom: 2rem;
  text-align: center;
  background: ${props => props.theme === 'light' 
    ? 'linear-gradient(to right, #1a237e, #0d47a1)'
    : 'linear-gradient(to right, #64ffda, #00b0ff)'};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: ${props => props.theme === 'light'
    ? '0 0 15px rgba(26, 35, 126, 0.3)'
    : '0 0 15px rgba(100, 255, 218, 0.3)'};
`;

const FAQSection = styled.div`
  background: ${props => props.theme === 'light'
    ? 'rgba(255, 255, 255, 0.9)'
    : 'rgba(0, 0, 0, 0.5)'};
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 2rem;
  margin-bottom: 2rem;
  border: 1px solid ${props => props.theme === 'light'
    ? 'rgba(26, 35, 126, 0.2)'
    : 'rgba(255, 255, 255, 0.1)'};
`;

const FAQItem = styled.div`
  margin-bottom: 1rem;
  border-bottom: 1px solid ${props => props.theme === 'light'
    ? 'rgba(26, 35, 126, 0.1)'
    : 'rgba(255, 255, 255, 0.1)'};
  padding-bottom: 1rem;

  &:last-child {
    border-bottom: none;
    margin-bottom: 0;
    padding-bottom: 0;
  }
`;

const Question = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  padding: 1rem;
  background: ${props => props.theme === 'light'
    ? 'rgba(26, 35, 126, 0.05)'
    : 'rgba(255, 255, 255, 0.05)'};
  border-radius: 10px;
  transition: all 0.3s ease;

  &:hover {
    background: ${props => props.theme === 'light'
      ? 'rgba(26, 35, 126, 0.1)'
      : 'rgba(255, 255, 255, 0.1)'};
  }

  h3 {
    margin: 0;
    font-size: 1.2rem;
    color: ${props => props.theme === 'light' ? '#1a237e' : '#64ffda'};
  }

  svg {
    color: ${props => props.theme === 'light' ? '#1a237e' : '#64ffda'};
    transition: transform 0.3s ease;
  }
`;

const Answer = styled.div`
  padding: ${props => props.isOpen ? '1rem' : '0'};
  max-height: ${props => props.isOpen ? '500px' : '0'};
  overflow: hidden;
  transition: all 0.3s ease;
  opacity: ${props => props.isOpen ? '1' : '0'};
  color: ${props => props.theme === 'light' 
    ? 'rgba(26, 35, 126, 0.9)'
    : 'rgba(255, 255, 255, 0.9)'};
  line-height: 1.6;
`;

const CategoryTitle = styled.h2`
  color: ${props => props.theme === 'light' ? '#1a237e' : '#64ffda'};
  margin-bottom: 1.5rem;
  font-size: 1.8rem;
  text-align: center;
`;

const FAQ = ({ currentTheme }) => {
  const [openItems, setOpenItems] = useState({});

  const toggleItem = (id) => {
    setOpenItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const faqData = {
    general: [
      {
        id: 'what-is',
        question: 'Что такое Ruletka?',
        answer: 'Ruletka - это современная платформа для видеочатов, которая позволяет общаться с людьми со всего мира. Наш сервис использует случайный подбор собеседников, обеспечивая интересные и неожиданные знакомства.'
      },
      {
        id: 'how-to-start',
        question: 'Как начать общение?',
        answer: 'Просто нажмите кнопку "Начать чат" на главной странице. Вам не нужно регистрироваться или устанавливать дополнительное программное обеспечение. Разрешите доступ к камере и микрофону, и вы сразу сможете начать общение.'
      },
      {
        id: 'is-free',
        question: 'Сервис бесплатный?',
        answer: 'Да, основные функции сервиса полностью бесплатны. В будущем мы планируем добавить премиум-возможности, но базовое использование всегда останется бесплатным.'
      }
    ],
    technical: [
      {
        id: 'requirements',
        question: 'Какие технические требования?',
        answer: 'Для использования Ruletka вам нужен современный браузер (Chrome, Firefox, Safari или Edge), веб-камера и микрофон. Рекомендуемая скорость интернет-соединения - от 1 Мбит/с.'
      },
      {
        id: 'connection-issues',
        question: 'Что делать при проблемах с соединением?',
        answer: 'Проверьте подключение к интернету, перезагрузите страницу или попробуйте использовать другой браузер. Если проблемы сохраняются, обратитесь в нашу службу поддержки.'
      }
    ],
    privacy: [
      {
        id: 'data-collection',
        question: 'Какие данные вы собираете?',
        answer: 'Мы собираем минимум необходимой информации для работы сервиса. Мы не храним видео или аудио ваших разговоров. Подробнее можно узнать в нашей Политике конфиденциальности.'
      },
      {
        id: 'safety',
        question: 'Как обеспечивается безопасность?',
        answer: 'Мы используем шифрование данных, модерацию контента и систему быстрого реагирования на жалобы. Вы всегда можете заблокировать неприятного собеседника и сообщить о нарушении правил.'
      }
    ]
  };

  return (
    <PageContainer theme={currentTheme}>
      <SpaceBackground theme={currentTheme} />
      <Content>
        <Title theme={currentTheme}>Часто задаваемые вопросы</Title>

        <FAQSection theme={currentTheme}>
          <CategoryTitle theme={currentTheme}>Общие вопросы</CategoryTitle>
          {faqData.general.map(item => (
            <FAQItem key={item.id} theme={currentTheme}>
              <Question onClick={() => toggleItem(item.id)} theme={currentTheme}>
                <h3>{item.question}</h3>
                {openItems[item.id] ? <FaChevronUp /> : <FaChevronDown />}
              </Question>
              <Answer isOpen={openItems[item.id]} theme={currentTheme}>
                {item.answer}
              </Answer>
            </FAQItem>
          ))}
        </FAQSection>

        <FAQSection theme={currentTheme}>
          <CategoryTitle theme={currentTheme}>Технические вопросы</CategoryTitle>
          {faqData.technical.map(item => (
            <FAQItem key={item.id} theme={currentTheme}>
              <Question onClick={() => toggleItem(item.id)} theme={currentTheme}>
                <h3>{item.question}</h3>
                {openItems[item.id] ? <FaChevronUp /> : <FaChevronDown />}
              </Question>
              <Answer isOpen={openItems[item.id]} theme={currentTheme}>
                {item.answer}
              </Answer>
            </FAQItem>
          ))}
        </FAQSection>

        <FAQSection theme={currentTheme}>
          <CategoryTitle theme={currentTheme}>Конфиденциальность и безопасность</CategoryTitle>
          {faqData.privacy.map(item => (
            <FAQItem key={item.id} theme={currentTheme}>
              <Question onClick={() => toggleItem(item.id)} theme={currentTheme}>
                <h3>{item.question}</h3>
                {openItems[item.id] ? <FaChevronUp /> : <FaChevronDown />}
              </Question>
              <Answer isOpen={openItems[item.id]} theme={currentTheme}>
                {item.answer}
              </Answer>
            </FAQItem>
          ))}
        </FAQSection>
      </Content>
    </PageContainer>
  );
};

export default FAQ; 