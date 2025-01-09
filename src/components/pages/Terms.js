import React from 'react';
import styled from 'styled-components';
import SpaceBackground from '../SpaceBackground';
import { FaShieldAlt, FaUserFriends, FaBan, FaExclamationTriangle } from 'react-icons/fa';

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
  max-width: 900px;
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

const Section = styled.section`
  background: ${props => props.theme === 'light'
    ? 'rgba(255, 255, 255, 0.8)'
    : 'rgba(0, 0, 0, 0.5)'};
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 2rem;
  margin-bottom: 2rem;
  border: 1px solid ${props => props.theme === 'light'
    ? 'rgba(26, 35, 126, 0.2)'
    : 'rgba(255, 255, 255, 0.1)'};

  h2 {
    font-size: 1.8rem;
    margin-bottom: 1.5rem;
    color: ${props => props.theme === 'light' ? '#1a237e' : '#64ffda'};
    display: flex;
    align-items: center;
    gap: 1rem;

    svg {
      font-size: 1.5rem;
    }
  }

  h3 {
    font-size: 1.3rem;
    color: ${props => props.theme === 'light' ? '#1a237e' : '#64ffda'};
    margin: 1.5rem 0 1rem;
  }

  p {
    font-size: 1.1rem;
    line-height: 1.6;
    margin-bottom: 1rem;
    color: ${props => props.theme === 'light'
      ? 'rgba(26, 35, 126, 0.9)'
      : 'rgba(255, 255, 255, 0.9)'};
  }

  ul {
    list-style: none;
    padding: 0;
    margin: 1rem 0;

    li {
      margin-bottom: 0.8rem;
      padding-left: 1.5rem;
      position: relative;
      color: ${props => props.theme === 'light'
        ? 'rgba(26, 35, 126, 0.9)'
        : 'rgba(255, 255, 255, 0.9)'};

      &::before {
        content: '•';
        position: absolute;
        left: 0;
        color: ${props => props.theme === 'light' ? '#1a237e' : '#64ffda'};
      }
    }
  }
`;

const WarningBox = styled.div`
  background: ${props => props.theme === 'light'
    ? 'rgba(255, 87, 34, 0.05)'
    : 'rgba(255, 87, 34, 0.1)'};
  border: 1px solid rgba(255, 87, 34, 0.3);
  border-radius: 10px;
  padding: 1rem;
  margin: 1rem 0;
  display: flex;
  align-items: flex-start;
  gap: 1rem;

  svg {
    color: #ff5722;
    font-size: 1.5rem;
    margin-top: 0.2rem;
  }

  p {
    margin: 0;
    font-size: 1rem;
  }
`;

const LastUpdate = styled.p`
  text-align: center;
  color: rgba(255, 255, 255, 0.6);
  margin-top: 2rem;
  font-size: 0.9rem;
`;

const Terms = ({ currentTheme }) => {
  return (
    <PageContainer theme={currentTheme}>
      <SpaceBackground theme={currentTheme} />
      <Content>
        <Title theme={currentTheme}>Условия использования</Title>

        <Section theme={currentTheme}>
          <h2><FaShieldAlt /> Общие положения</h2>
          <p>
            Добро пожаловать в Ruletka! Используя наш сервис, вы соглашаетесь с
            настоящими условиями использования. Пожалуйста, внимательно прочитайте
            их перед началом использования сервиса.
          </p>
          <p>
            Ruletka предоставляет платформу для видеообщения между
            пользователями. Мы стремимся создать безопасное и дружелюбное
            пространство для всех участников.
          </p>
        </Section>

        <Section theme={currentTheme}>
          <h2><FaUserFriends /> Правила поведения</h2>
          <p>
            Все пользователи обязаны соблюдать следующие правила при использовании
            сервиса:
          </p>
          <ul>
            <li>Уважительно относиться к другим пользователям</li>
            <li>Не распространять спам или вредоносный контент</li>
            <li>Не использовать сервис для противозаконной деятельности</li>
            <li>Не передавать личную информацию незнакомым людям</li>
            <li>Не демонстрировать неприемлемый или шокирующий контент</li>
          </ul>

          <WarningBox theme={currentTheme}>
            <FaExclamationTriangle />
            <p>
              Нарушение правил может привести к временной или постоянной
              блокировке аккаунта без предварительного уведомления.
            </p>
          </WarningBox>
        </Section>

        <Section theme={currentTheme}>
          <h2><FaBan /> Запрещенный контент</h2>
          <p>
            На платформе строго запрещено:
          </p>
          <ul>
            <li>Демонстрация или распространение материалов для взрослых</li>
            <li>Пропаганда насилия или дискриминации</li>
            <li>Распространение личной информации других пользователей</li>
            <li>Использование ботов или автоматизированных скриптов</li>
            <li>Попытки взлома или нарушения работы сервиса</li>
          </ul>
        </Section>

        <Section theme={currentTheme}>
          <h2><FaShieldAlt /> Конфиденциальность и безопасность</h2>
          <h3>Сбор данных</h3>
          <p>
            Мы собираем минимально необходимое количество данных для обеспечения
            работы сервиса. Подробную информацию можно найти в нашей Политике
            конфиденциальности.
          </p>

          <h3>Безопасность</h3>
          <p>
            Мы используем современные методы шифрования и защиты данных, но также
            рекомендуем пользователям соблюдать базовые правила безопасности при
            общении в интернете.
          </p>

          <h3>Модерация</h3>
          <p>
            Сервис модерируется 24/7 для обеспечения безопасной среды общения.
            Мы оставляем за собой право удалять неприемлемый контент и блокировать
            нарушителей.
          </p>
        </Section>

        <LastUpdate>
          Последнее обновление: 1 января 2024 года
        </LastUpdate>
      </Content>
    </PageContainer>
  );
};

export default Terms; 