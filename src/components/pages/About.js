import React from 'react';
import styled from 'styled-components';
import SpaceBackground from '../SpaceBackground';
import { FaRocket, FaUsers, FaGlobe, FaHeart } from 'react-icons/fa';

const PageContainer = styled.div`
  min-height: 100vh;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  color: white;
  padding: 100px 20px 40px;
`;

const Content = styled.div`
  max-width: 1000px;
  width: 100%;
  z-index: 1;
  color: ${props => props.theme === 'day' ? '#1a237e' : 'white'};
`;

const Title = styled.h1`
  font-size: 3rem;
  margin-bottom: 2rem;
  text-align: center;
  background: ${props => props.theme === 'day' ? 'linear-gradient(to right, #1a237e, #0d47a1)' : 'linear-gradient(to right, #64ffda, #00b0ff)'};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: ${props => props.theme === 'day' ? '0 0 15px rgba(26, 35, 126, 0.3)' : '0 0 15px rgba(100, 255, 218, 0.3)'};
`;

const Section = styled.section`
  background: ${props => props.theme === 'day' ? 'rgba(255, 255, 255, 0.85)' : 'rgba(0, 0, 0, 0.5)'};
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 2rem;
  margin-bottom: 2rem;
  border: 1px solid ${props => props.theme === 'day' ? 'rgba(26, 35, 126, 0.2)' : 'rgba(255, 255, 255, 0.1)'};

  h2 {
    font-size: 2rem;
    margin-bottom: 1.5rem;
    color: ${props => props.theme === 'day' ? '#1a237e' : '#64ffda'};
  }

  p {
    font-size: 1.1rem;
    line-height: 1.6;
    margin-bottom: 1rem;
    color: ${props => props.theme === 'day' ? '#1a237e' : 'rgba(255, 255, 255, 0.9)'};
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 2rem;
  margin: 2rem 0;
`;

const StatBox = styled.div`
  background: rgba(255, 255, 255, 0.1);
  padding: 1.5rem;
  border-radius: 15px;
  text-align: center;
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-5px);
  }

  svg {
    font-size: 2.5rem;
    color: #64ffda;
    margin-bottom: 1rem;
  }

  h3 {
    font-size: 1.8rem;
    margin-bottom: 0.5rem;
    color: #fff;
  }

  p {
    color: rgba(255, 255, 255, 0.7);
  }
`;

const TeamGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
`;

const TeamMember = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 15px;
  padding: 1.5rem;
  text-align: center;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    background: rgba(255, 255, 255, 0.1);
  }

  img {
    width: 120px;
    height: 120px;
    border-radius: 50%;
    margin-bottom: 1rem;
    border: 3px solid #64ffda;
  }

  h3 {
    color: #64ffda;
    margin-bottom: 0.5rem;
  }

  p {
    color: rgba(255, 255, 255, 0.7);
    font-size: 0.9rem;
  }
`;

const About = () => {
  const theme = window.localStorage.getItem('theme') || 'night';
  
  return (
    <PageContainer>
      <SpaceBackground theme={theme} />
      <Content theme={theme}>
        <Title theme={theme}>О нас</Title>
        
        <Section theme={theme}>
          <h2>Наша миссия</h2>
          <p>
            Мы создаем уникальное пространство для общения, где каждый может найти новых друзей
            и интересных собеседников со всего мира. Наша цель - сделать онлайн-общение
            безопасным, увлекательным и незабываемым.
          </p>
          
          <StatsGrid>
            <StatBox>
              <FaUsers />
              <h3>1M+</h3>
              <p>Активных пользователей</p>
            </StatBox>
            <StatBox>
              <FaGlobe />
              <h3>150+</h3>
              <p>Стран</p>
            </StatBox>
            <StatBox>
              <FaRocket />
              <h3>10M+</h3>
              <p>Видеочатов в день</p>
            </StatBox>
            <StatBox>
              <FaHeart />
              <h3>500K+</h3>
              <p>Счастливых знакомств</p>
            </StatBox>
          </StatsGrid>
        </Section>

        <Section theme={theme}>
          <h2>История проекта</h2>
          <p>
            Проект Ruletka был основан в 2023 году группой энтузиастов, объединенных идеей
            создания нового формата онлайн-общения. Мы начинали как небольшой стартап,
            но быстро выросли благодаря уникальному подходу к видеочату и особому вниманию
            к потребностям пользователей.
          </p>
          <p>
            Сегодня мы продолжаем развиваться, внедряя инновационные технологии и создавая
            новые возможности для общения. Наша команда постоянно работает над улучшением
            качества связи, безопасности и удобства использования платформы.
          </p>
        </Section>

        <Section theme={theme}>
          <h2>Наша команда</h2>
          <TeamGrid>
            <TeamMember>
              <img src="/team/ceo.jpg" alt="CEO" />
              <h3>Александр Петров</h3>
              <p>CEO & Основатель</p>
            </TeamMember>
            <TeamMember>
              <img src="/team/cto.jpg" alt="CTO" />
              <h3>Мария Иванова</h3>
              <p>Технический директор</p>
            </TeamMember>
            <TeamMember>
              <img src="/team/designer.jpg" alt="Designer" />
              <h3>Дмитрий Сидоров</h3>
              <p>Главный дизайнер</p>
            </TeamMember>
          </TeamGrid>
        </Section>

        <Section theme={theme}>
          <h2>Наши ценности</h2>
          <p>
            <strong>Безопасность</strong> - Мы обеспечиваем максимальную защиту личных данных
            и создаем безопасную среду для общения.
          </p>
          <p>
            <strong>Инновации</strong> - Постоянно внедряем новые технологии для улучшения
            качества связи и пользовательского опыта.
          </p>
          <p>
            <strong>Сообщество</strong> - Создаем дружелюбное и открытое сообщество, где
            каждый может найти единомышленников.
          </p>
          <p>
            <strong>Доступность</strong> - Делаем качественное онлайн-общение доступным
            для пользователей со всего мира.
          </p>
        </Section>
      </Content>
    </PageContainer>
  );
};

export default About; 