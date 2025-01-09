import React from 'react';
import styled from 'styled-components';
import SpaceBackground from '../SpaceBackground';
import { FaShieldAlt, FaDatabase, FaUserSecret, FaCookie } from 'react-icons/fa';

const PageContainer = styled.div`
  min-height: 100vh;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  color: ${props => props.theme === 'day' ? '#1a237e' : 'white'};
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
  background: ${props => props.theme === 'day' 
    ? 'linear-gradient(to right, #1a237e, #0d47a1)'
    : 'linear-gradient(to right, #64ffda, #00b0ff)'};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: ${props => props.theme === 'day'
    ? '0 0 15px rgba(26, 35, 126, 0.3)'
    : '0 0 15px rgba(100, 255, 218, 0.3)'};
`;

const Section = styled.section`
  background: ${props => props.theme === 'day'
    ? 'rgba(255, 255, 255, 0.9)'
    : 'rgba(0, 0, 0, 0.5)'};
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 2rem;
  margin-bottom: 2rem;
  border: 1px solid ${props => props.theme === 'day'
    ? 'rgba(26, 35, 126, 0.2)'
    : 'rgba(255, 255, 255, 0.1)'};

  h2 {
    font-size: 1.8rem;
    margin-bottom: 1.5rem;
    color: ${props => props.theme === 'day' ? '#1a237e' : '#64ffda'};
    display: flex;
    align-items: center;
    gap: 1rem;

    svg {
      font-size: 1.5rem;
    }
  }

  h3 {
    font-size: 1.3rem;
    color: ${props => props.theme === 'day' ? '#1a237e' : '#64ffda'};
    margin: 1.5rem 0 1rem;
  }

  p {
    font-size: 1.1rem;
    line-height: 1.6;
    margin-bottom: 1rem;
    color: ${props => props.theme === 'day' 
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
      color: ${props => props.theme === 'day'
        ? 'rgba(26, 35, 126, 0.9)'
        : 'rgba(255, 255, 255, 0.9)'};

      &::before {
        content: '•';
        position: absolute;
        left: 0;
        color: ${props => props.theme === 'day' ? '#1a237e' : '#64ffda'};
      }
    }
  }
`;

const InfoBox = styled.div`
  background: ${props => props.theme === 'day'
    ? 'rgba(26, 35, 126, 0.1)'
    : 'rgba(100, 255, 218, 0.1)'};
  border: 1px solid ${props => props.theme === 'day'
    ? 'rgba(26, 35, 126, 0.3)'
    : 'rgba(100, 255, 218, 0.3)'};
  border-radius: 10px;
  padding: 1rem;
  margin: 1rem 0;

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

const Privacy = ({ currentTheme }) => {
  return (
    <PageContainer theme={currentTheme}>
      <SpaceBackground theme={currentTheme} />
      <Content>
        <Title theme={currentTheme}>Политика конфиденциальности</Title>

        <Section theme={currentTheme}>
          <h2><FaShieldAlt /> Введение</h2>
          <p>
            Мы серьезно относимся к защите ваших персональных данных. Эта политика
            конфиденциальности объясняет, какую информацию мы собираем, как ее
            используем и как защищаем.
          </p>
          <InfoBox theme={currentTheme}>
            <p>
              Используя наш сервис, вы соглашаетесь с условиями данной политики
              конфиденциальности.
            </p>
          </InfoBox>
        </Section>

        <Section theme={currentTheme}>
          <h2><FaDatabase /> Сбор данных</h2>
          <h3>Информация, которую мы собираем:</h3>
          <ul>
            <li>Технические данные (IP-адрес, тип браузера, устройства)</li>
            <li>Данные о использовании сервиса (время сессий, настройки)</li>
            <li>Временные медиа-данные для обеспечения видеосвязи</li>
          </ul>

          <h3>Мы НЕ собираем:</h3>
          <ul>
            <li>Записи ваших разговоров или видеочатов</li>
            <li>Личную информацию без вашего согласия</li>
            <li>Платежные данные или банковскую информацию</li>
          </ul>
        </Section>

        <Section theme={currentTheme}>
          <h2><FaUserSecret /> Использование данных</h2>
          <p>
            Собранные данные используются для:
          </p>
          <ul>
            <li>Обеспечения работы видеочата</li>
            <li>Улучшения качества сервиса</li>
            <li>Предотвращения нарушений и спама</li>
            <li>Технической поддержки пользователей</li>
            <li>Анализа и улучшения производительности</li>
          </ul>
        </Section>

        <Section theme={currentTheme}>
          <h2><FaCookie /> Файлы cookie</h2>
          <p>
            Мы используем файлы cookie для улучшения работы сервиса. Они помогают нам:
          </p>
          <ul>
            <li>Сохранять ваши настройки и предпочтения</li>
            <li>Обеспечивать безопасность сессий</li>
            <li>Анализировать производительность сайта</li>
            <li>Улучшать пользовательский опыт</li>
          </ul>
          <InfoBox theme={currentTheme}>
            <p>
              Вы можете отключить файлы cookie в настройках браузера, но это может
              повлиять на функциональность сервиса.
            </p>
          </InfoBox>
        </Section>

        <Section theme={currentTheme}>
          <h2><FaShieldAlt /> Защита данных</h2>
          <p>
            Мы применяем следующие меры для защиты ваших данных:
          </p>
          <ul>
            <li>Шифрование всех передаваемых данных</li>
            <li>Регулярные проверки безопасности</li>
            <li>Ограниченный доступ к данным для персонала</li>
            <li>Автоматическое удаление временных данных</li>
            <li>Мониторинг безопасности 24/7</li>
          </ul>
        </Section>

        <LastUpdate>
          Последнее обновление: 1 января 2024 года
        </LastUpdate>
      </Content>
    </PageContainer>
  );
};

export default Privacy; 