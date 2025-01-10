import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import SpaceBackground from './SpaceBackground';
import Footer from './Footer';
import { FaUsers, FaVideo, FaGlobe, FaRocket, FaStar, FaHeart, FaUserAstronaut, FaComments, FaShieldAlt, FaBan, FaGamepad, FaGift, FaMedal } from 'react-icons/fa';

const Container = styled.div`
  min-height: 100vh;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  color: white;
  text-align: center;
  padding: 80px 0 0 0;
  overflow: hidden;
`;

const Content = styled.div`
  position: relative;
  z-index: 2;
  max-width: 1200px;
  width: 100%;
  padding: 0 20px;
  margin-bottom: 0;
  color: ${props => props.theme === 'day' ? '#000' : 'white'};
`;

const Title = styled.h1`
  font-size: 4rem;
  margin-bottom: 1rem;
  color: #FFD700;
  text-shadow: 0 0 20px rgba(255, 215, 0, 0.3);
`;

const Subtitle = styled.p`
  font-size: 1.5rem;
  margin-bottom: 2rem;
  color: rgba(255, 255, 255, 0.9);
  max-width: 800px;
  margin: 0 auto 2rem;
  font-weight: 400;
`;

const StartButton = styled(Link)`
  display: inline-block;
  padding: 1.2rem 2.5rem;
  font-size: 1.5rem;
  background: linear-gradient(45deg, #2ecc71, #1abc9c, #16a085);
  background-size: 200% 200%;
  color: white;
  text-decoration: none;
  border-radius: 50px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  margin: 2rem 0;
  border: 3px solid transparent;
  box-shadow: 
    0 0 20px rgba(46, 213, 115, 0.4),
    0 0 30px rgba(26, 188, 156, 0.2),
    0 0 40px rgba(22, 160, 133, 0.1);
  position: relative;
  overflow: hidden;
  z-index: 1;
  animation: 
    float 6s ease-in-out infinite,
    gradientBG 8s ease infinite,
    pulse 2s ease-in-out infinite;

  /* Основная градиентная анимация */
  @keyframes gradientBG {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }

  /* Анимация парения */
  @keyframes float {
    0% { transform: translateY(0) rotate(0deg); }
    25% { transform: translateY(-8px) rotate(2deg); }
    50% { transform: translateY(0) rotate(0deg); }
    75% { transform: translateY(8px) rotate(-2deg); }
    100% { transform: translateY(0) rotate(0deg); }
  }

  /* Пульсация свечения */
  @keyframes pulse {
    0% { box-shadow: 0 0 20px rgba(46, 213, 115, 0.4), 0 0 30px rgba(26, 188, 156, 0.2); }
    50% { box-shadow: 0 0 25px rgba(46, 213, 115, 0.6), 0 0 40px rgba(26, 188, 156, 0.3); }
    100% { box-shadow: 0 0 20px rgba(46, 213, 115, 0.4), 0 0 30px rgba(26, 188, 156, 0.2); }
  }

  /* Космические частицы */
  &:after {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: linear-gradient(
      45deg,
      transparent 30%,
      rgba(46, 213, 115, 0.8) 40%,
      rgba(26, 188, 156, 0.9) 50%,
      rgba(46, 213, 115, 0.8) 60%,
      transparent 70%
    );
    transform: rotate(45deg);
    animation: shine 6s ease-in-out infinite;
    pointer-events: none;
  }

  @keyframes shine {
    0% { transform: translateX(-200%) rotate(45deg); }
    50% { transform: translateX(100%) rotate(45deg); }
    100% { transform: translateX(-200%) rotate(45deg); }
  }

  /* Эффект при наведении */
  &:hover {
    transform: translateY(-5px) scale(1.05);
    background-size: 150% 150%;
    box-shadow: 
      0 0 30px rgba(46, 213, 115, 0.6),
      0 0 50px rgba(26, 188, 156, 0.3),
      0 0 70px rgba(22, 160, 133, 0.2);
    border-color: rgba(46, 213, 115, 0.3);

    &:before {
      opacity: 1;
      transform: scale(1.2);
    }

    svg {
      transform: translate(3px, -3px) rotate(15deg) scale(1.2);
      filter: drop-shadow(0 0 10px rgba(46, 213, 115, 0.5));
    }
  }

  /* Анимация иконки ракеты */
  svg {
    transition: all 0.3s ease;
    margin-right: 10px;
    animation: rocketShake 2s ease-in-out infinite;
    color: white;
  }

  @keyframes rocketShake {
    0%, 100% { transform: translate(0, 0) rotate(0deg); }
    25% { transform: translate(2px, -2px) rotate(5deg); }
    50% { transform: translate(0, 0) rotate(0deg); }
    75% { transform: translate(-2px, 2px) rotate(-5deg); }
  }

  /* Эффект при клике */
  &:active {
    transform: scale(0.95);
    box-shadow: 
      0 0 50px rgba(46, 213, 115, 0.8),
      0 0 100px rgba(26, 188, 156, 0.4);
    
    svg {
      transform: translate(-2px, 2px) rotate(-10deg);
    }
  }

  /* Космический след */
  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: radial-gradient(
      circle at center,
      rgba(46, 213, 115, 0.8) 0%,
      rgba(255, 255, 255, 0) 70%
    );
    opacity: 0;
    transition: all 0.5s ease;
    z-index: -1;
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin: 3rem 0;
`;

const StatBox = styled.div.attrs(props => ({
  'data-icon-color': props.iconColor
}))`
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  transition: all 0.3s ease;

  svg {
    font-size: 32px;
    margin-bottom: 16px;
    color: ${props => props['data-icon-color']};
  }

  &:hover {
    transform: translateY(-5px);
    border-color: #64ffda;
  }
`;

const StatNumber = styled.div`
  font-size: 36px;
  font-weight: 700;
  margin-bottom: 8px;
  color: #ffffff;
`;

const StatLabel = styled.div`
  font-size: 16px;
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.4;
`;

const FeatureGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin: 3rem 0;
`;

const FeatureBox = styled.div`
  background: ${props => props.theme === 'day'
    ? 'rgba(255, 255, 255, 0.98)'
    : 'rgba(0, 0, 0, 0.3)'};
  backdrop-filter: blur(10px);
  padding: 2rem;
  border-radius: 20px;
  border: 1px solid ${props => props.theme === 'day'
    ? 'rgba(0, 0, 0, 0.1)'
    : 'rgba(255, 255, 255, 0.1)'};
  text-align: left;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: ${props => props.theme === 'day'
      ? '0 5px 15px rgba(0, 0, 0, 0.1)'
      : '0 5px 15px rgba(0, 0, 0, 0.3)'};
  }

  h3 {
    font-size: 1.5rem;
    margin-bottom: 1rem;
    color: ${props => props.theme === 'day' ? '#000' : '#FFD700'};
    font-weight: 600;
  }

  p {
    color: ${props => props.theme === 'day' ? '#000' : 'rgba(255, 255, 255, 0.8)'};
    line-height: 1.6;
    font-weight: ${props => props.theme === 'day' ? '500' : '400'};
  }
`;

const InfoSection = styled.div`
  margin: 4rem 0;
  width: 100%;
  max-width: 1200px;
`;

const InfoTitle = styled.h2`
  font-size: 2.5rem;
  margin-bottom: 2rem;
  color: ${props => props.theme === 'day' ? '#000' : '#fff'};
  font-weight: 600;
  text-shadow: ${props => props.theme === 'day'
    ? '2px 2px 4px rgba(0, 0, 0, 0.1)'
    : '0 0 15px rgba(100, 255, 218, 0.3)'};
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
  margin: 2rem 0;
`;

const InfoCard = styled.div`
  background: ${props => props.theme === 'day'
    ? 'rgba(255, 255, 255, 0.98)'
    : 'rgba(0, 0, 0, 0.4)'};
  backdrop-filter: blur(10px);
  padding: 2rem;
  border-radius: 20px;
  border: 1px solid ${props => props.theme === 'day'
    ? 'rgba(0, 0, 0, 0.1)'
    : 'rgba(255, 255, 255, 0.1)'};
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: ${props => props.theme === 'day'
      ? '0 5px 15px rgba(0, 0, 0, 0.1)'
      : '0 5px 15px rgba(0, 0, 0, 0.3)'};
  }

  svg {
    font-size: 2.5rem;
    color: ${props => props.theme === 'day' ? '#000' : '#64ffda'};
    margin-bottom: 1rem;
  }
`;

const InfoCardTitle = styled.h3`
  font-size: 1.5rem;
  color: ${props => props.theme === 'day' ? '#000' : '#fff'};
  margin-bottom: 1rem;
  font-weight: 600;
`;

const InfoCardText = styled.p`
  color: ${props => props.theme === 'day' ? '#000' : 'rgba(255, 255, 255, 0.8)'};
  line-height: 1.6;
  font-size: 1.1rem;
  font-weight: ${props => props.theme === 'day' ? '500' : '400'};
`;

const RewardsSection = styled(InfoSection)`
  background: ${props => props.theme === 'day'
    ? 'rgba(255, 255, 255, 0.98)'
    : 'rgba(0, 0, 0, 0.3)'};
  border-radius: 20px;
  padding: 2rem;
  margin: 4rem auto;
  border: 1px solid ${props => props.theme === 'day'
    ? 'rgba(0, 0, 0, 0.1)'
    : 'rgba(255, 255, 255, 0.1)'};
`;

const RewardsList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
`;

const RewardItem = styled.div`
  text-align: center;
  padding: 1.5rem;
  background: ${props => props.theme === 'day'
    ? 'rgba(255, 255, 255, 0.98)'
    : 'rgba(255, 255, 255, 0.05)'};
  border-radius: 15px;
  transition: all 0.3s ease;
  border: 1px solid ${props => props.theme === 'day'
    ? 'rgba(0, 0, 0, 0.1)'
    : 'rgba(255, 255, 255, 0.1)'};

  &:hover {
    transform: translateY(-5px);
    background: ${props => props.theme === 'day'
      ? '#fff'
      : 'rgba(255, 255, 255, 0.1)'};
    box-shadow: ${props => props.theme === 'day'
      ? '0 5px 15px rgba(0, 0, 0, 0.1)'
      : '0 5px 15px rgba(0, 0, 0, 0.3)'};
  }

  svg {
    font-size: 2rem;
    color: ${props => props.theme === 'day' ? '#000' : '#FFD700'};
    margin-bottom: 1rem;
  }

  h4 {
    color: ${props => props.theme === 'day' ? '#000' : '#fff'};
    margin-bottom: 0.5rem;
    font-weight: 600;
  }

  p {
    color: ${props => props.theme === 'day' ? '#000' : 'rgba(255, 255, 255, 0.7)'};
    font-size: 0.9rem;
    font-weight: ${props => props.theme === 'day' ? '500' : '400'};
  }
`;

const GamificationSection = styled(InfoSection)`
  text-align: center;
`;

const Home = ({ currentTheme, onlineUsers }) => {
  return (
    <Container>
      <SpaceBackground theme={currentTheme} />
      <Content theme={currentTheme}>
        <Title theme={currentTheme}>Ruletka</Title>
        <Subtitle theme={currentTheme}>
          Привет, искатели приключений!
          Готовы отправиться в увлекательное путешествие по вселенной знакомств? Пусть звезды укажут путь к вашим новым друзьям!
        </Subtitle>

        <StatsGrid>
          <StatBox theme={currentTheme} iconColor="#64ffda">
            <FaUsers />
            <StatNumber theme={currentTheme}>{onlineUsers}</StatNumber>
            <StatLabel theme={currentTheme}>Онлайн пользователей</StatLabel>
          </StatBox>
          <StatBox theme={currentTheme} iconColor="#64ffda">
            <FaVideo />
            <StatNumber theme={currentTheme}>1M+</StatNumber>
            <StatLabel theme={currentTheme}>Видеочатов в день</StatLabel>
          </StatBox>
          <StatBox theme={currentTheme} iconColor="#64ffda">
            <FaGlobe />
            <StatNumber theme={currentTheme}>150+</StatNumber>
            <StatLabel theme={currentTheme}>Стран</StatLabel>
          </StatBox>
          <StatBox theme={currentTheme} iconColor="#64ffda">
            <FaHeart />
            <StatNumber theme={currentTheme}>500K+</StatNumber>
            <StatLabel theme={currentTheme}>Счастливых знакомств</StatLabel>
          </StatBox>
        </StatsGrid>

        <StartButton to="/chat">
          <FaRocket style={{ marginRight: '10px' }} />
          Начать путешествие
        </StartButton>

        <InfoSection>
          <InfoTitle>Да пребудет с вами сила!</InfoTitle>
          <InfoGrid>
            <InfoCard>
            <FaUserAstronaut />
              <InfoCardTitle>Анонимность</InfoCardTitle>
              <InfoCardText>
                Общайтесь свободно и безопасно. Мы не храним историю чатов и не требуем регистрации.
                Ваша приватность - наш главный приоритет.
              </InfoCardText>
            </InfoCard>
            <InfoCard>
              <FaVideo />
              <InfoCardTitle>HD Качество</InfoCardTitle>
              <InfoCardText>
                Кристально чистое видео и звук. Современные технологии WebRTC обеспечивают
                стабильное соединение и высокое качество трансляции.
              </InfoCardText>
            </InfoCard>
            <InfoCard>
              <FaComments />
              <InfoCardTitle>Умный подбор</InfoCardTitle>
              <InfoCardText>
                Наш алгоритм подбирает собеседников с учетом ваших интересов и предпочтений,
                делая каждую встречу особенной.
              </InfoCardText>
            </InfoCard>
          </InfoGrid>
        </InfoSection>

        <FeatureGrid>
          <FeatureBox>
            <h3>🌌 Космические темы</h3>
            <p>Погрузитесь в атмосферу космоса с нашими уникальными темами оформления. День и ночь - каждая тема создает особое настроение для общения. Наблюдайте за движением планет, полетом комет и мерцанием звезд.</p>
          </FeatureBox>
          <FeatureBox>
            <h3>🛸 Мгновенные соединения</h3>
            <p>Наша передовая технология обеспечивает мгновенное соединение с собеседниками. Никаких задержек - только чистое общение через космические просторы. Поддержка всех современных браузеров и устройств.</p>
          </FeatureBox>
          <FeatureBox>
            <h3>👾 Уникальные встречи</h3>
            <p>Каждый разговор - это новое приключение. Встречайте интересных собеседников со всего мира, делитесь историями и находите новых друзей. Фильтры по языку и региону помогут найти близких по духу людей.</p>
          </FeatureBox>
        </FeatureGrid>

        <InfoSection>
          <InfoTitle>Правила безопасности</InfoTitle>
          <InfoGrid>
            <InfoCard>
              <FaStar />
              <InfoCardTitle>Модерация 24/7</InfoCardTitle>
              <InfoCardText>
                Наша команда модераторов работает круглосуточно, обеспечивая
                безопасную и комфортную атмосферу для всех пользователей.
              </InfoCardText>
            </InfoCard>
            <InfoCard>
              <FaShieldAlt />
              <InfoCardTitle>Защита данных</InfoCardTitle>
              <InfoCardText>
                Все видеозвонки защищены современными методами шифрования.
                Ваши личные данные в безопасности.
              </InfoCardText>
            </InfoCard>
            <InfoCard>
              <FaBan />
              <InfoCardTitle>Блокировка нарушителей</InfoCardTitle>
              <InfoCardText>
                Система автоматически блокирует пользователей, нарушающих
                правила, сохраняя дружелюбную атмосферу.
              </InfoCardText>
            </InfoCard>
          </InfoGrid>
        </InfoSection>

        <GamificationSection>
          <InfoTitle>Космические развлечения</InfoTitle>
          <InfoGrid>
            <InfoCard>
              <FaGamepad />
              <InfoCardTitle>Мини-игры</InfoCardTitle>
              <InfoCardText>
                Играйте в космические мини-игры с собеседником во время общения.
                Соревнуйтесь в головоломках, викторинах и других увлекательных играх.
              </InfoCardText>
            </InfoCard>
            <InfoCard>
              <FaGift />
              <InfoCardTitle>Подарки</InfoCardTitle>
              <InfoCardText>
                Отправляйте виртуальные подарки собеседникам. Выбирайте из коллекции
                космических сувениров и делитесь позитивными эмоциями.
              </InfoCardText>
            </InfoCard>
            <InfoCard>
              <FaMedal />
              <InfoCardTitle>Достижения</InfoCardTitle>
              <InfoCardText>
                Получайте космические звания и награды за активное общение.
                Открывайте новые возможности и уникальные функции.
              </InfoCardText>
            </InfoCard>
          </InfoGrid>
        </GamificationSection>

        <RewardsSection>
          <InfoTitle>Система наград</InfoTitle>
          <RewardsList>
            <RewardItem>
              <FaStar />
              <h4>Звездный рейтинг</h4>
              <p>Получайте звезды за позитивное общение и помощь другим пользователям</p>
            </RewardItem>
            <RewardItem>
              <FaRocket />
              <h4>Космические бустеры</h4>
              <p>Ускоряйте поиск собеседников и получайте приоритетный доступ</p>
            </RewardItem>
            <RewardItem>
              <FaHeart />
              <h4>Симпатии</h4>
              <p>Отмечайте понравившихся собеседников и создавайте список друзей</p>
            </RewardItem>
          </RewardsList>
        </RewardsSection>
      </Content>
      <Footer />
    </Container>
  );
};

export default Home; 