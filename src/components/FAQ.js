import React from 'react';
import styled from 'styled-components';
import SpaceBackground from './SpaceBackground';

const FAQContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
  min-height: 100vh;
  position: relative;
`;

const Content = styled.div`
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  background: ${({ theme }) => 
    theme === 'day' 
      ? 'rgba(255, 255, 255, 0.95)' 
      : 'rgba(0, 0, 0, 0.8)'};
  border-radius: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  position: relative;
  z-index: 1;
`;

const FAQTitle = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 2rem;
  text-align: center;
  color: ${({ theme }) => 
    theme === 'day' ? '#000' : '#fff'};
  text-shadow: ${({ theme }) =>
    theme === 'day'
      ? '2px 2px 4px rgba(0, 0, 0, 0.1)'
      : '2px 2px 4px rgba(0, 0, 0, 0.5)'};
`;

const FAQSection = styled.div`
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: ${({ theme }) => 
    theme === 'day' 
      ? 'rgba(255, 255, 255, 0.98)' 
      : 'rgba(0, 0, 0, 0.6)'};
  border-radius: 10px;
  transition: all 0.3s ease;
  border: 1px solid ${({ theme }) => 
    theme === 'day' ? 'rgba(0, 0, 0, 0.1)' : 'rgba(255, 255, 255, 0.1)'};

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
`;

const Question = styled.h2`
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: ${({ theme }) => 
    theme === 'day' ? '#000' : '#fff'};
  font-weight: 600;
`;

const Answer = styled.p`
  font-size: 1.1rem;
  line-height: 1.6;
  margin-bottom: 1rem;
  color: ${({ theme }) => 
    theme === 'day' ? '#333' : 'rgba(255, 255, 255, 0.9)'};
`;

const FAQ = ({ currentTheme }) => {
  const faqData = [
    {
      question: "Почему выбирают Ruletka?",
      answer: "Ruletka предлагает уникальный опыт общения в космическом стиле. Наши преимущества: современный дизайн, высокая безопасность, отсутствие рекламы, качественная модерация и дружелюбное сообщество. Мы постоянно развиваем платформу, добавляя новые функции для комфортного общения."
    },
    {
      question: "Правила безопасности",
      answer: "Мы обеспечиваем безопасность пользователей через: шифрование всех видеозвонков, круглосуточную модерацию, систему жалоб, блокировку нарушителей. Рекомендуем не делиться личной информацией, соблюдать правила общения и сообщать о нарушениях."
    },
    {
      question: "Космические развлечения",
      answer: "В Ruletka вас ждут: уникальные космические темы оформления, мини-игры во время чата, система достижений и наград, возможность кастомизации профиля. Исследуйте космическое пространство общения вместе с нами!"
    },
    {
      question: "Как начать общение?",
      answer: "Просто нажмите кнопку 'Начать' на главной странице. Вам не нужно регистрироваться или устанавливать дополнительное программное обеспечение. Разрешите доступ к камере и микрофону, и вы сразу сможете начать общение."
    },
    {
      question: "Как работает система подбора собеседников?",
      answer: "Наш алгоритм учитывает несколько факторов: ваше местоположение, языковые предпочтения и интересы. Вы также можете использовать фильтры для более точного поиска собеседников."
    },
    {
      question: "Какие правила нужно соблюдать?",
      answer: "Основные правила: уважайте собеседников, не используйте оскорбительные выражения, не демонстрируйте неприемлемый контент. Полный список правил доступен в разделе 'Безопасность'."
    },
    {
      question: "Что делать при технических проблемах?",
      answer: "Убедитесь, что у вас стабильное интернет-соединение и современный браузер. Проверьте настройки камеры и микрофона. Если проблемы persist, обратитесь в нашу службу поддержки через форму контакта."
    },
    {
      question: "Как работает система наград?",
      answer: "За активное и позитивное общение вы получаете звезды и достижения. Чем больше времени вы проводите в чате и чем лучше ваши отзывы, тем выше ваш рейтинг и больше доступных возможностей."
    }
  ];

  return (
    <FAQContainer>
      <SpaceBackground theme={currentTheme} />
      <Content theme={currentTheme}>
        <FAQTitle theme={currentTheme}>Часто задаваемые вопросы</FAQTitle>
        {faqData.map((item, index) => (
          <FAQSection key={index} theme={currentTheme}>
            <Question theme={currentTheme}>{item.question}</Question>
            <Answer theme={currentTheme}>{item.answer}</Answer>
          </FAQSection>
        ))}
      </Content>
    </FAQContainer>
  );
};

export default FAQ;