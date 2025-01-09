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
  padding: 1rem 2rem;
  font-size: 1.5rem;
  background: linear-gradient(45deg, #FF4500, #FF8C00);
  color: white;
  text-decoration: none;
  border-radius: 50px;
  transition: all 0.3s ease;
  margin: 2rem 0;
  border: 2px solid transparent;
  box-shadow: 0 0 20px rgba(255, 69, 0, 0.4);

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 0 30px rgba(255, 69, 0, 0.6);
    border-color: rgba(255, 255, 255, 0.2);
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
          Исследуйте космические просторы общения в нашем уникальном видеочате. 
          Встречайте новых людей со всей галактики в захватывающем космическом приключении!
        </Subtitle>

        <StatsGrid>
          <StatBox theme={currentTheme} iconColor="#64ffda">
            <FaUsers />
            <StatNumber theme={currentTheme}>789</StatNumber>
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
          <InfoTitle>Почему выбирают Ruletka?</InfoTitle>
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
                правила сообщества, сохраняя дружелюбную атмосферу.
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