import React from 'react';
import styled from 'styled-components';
import SpaceBackground from '../SpaceBackground';
import { FaShieldAlt, FaUserSecret, FaExclamationTriangle, FaLock, FaUserFriends } from 'react-icons/fa';

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
    ? 'rgba(255, 255, 255, 0.9)'
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

  p {
    font-size: 1.1rem;
    line-height: 1.6;
    margin-bottom: 1rem;
    color: ${props => props.theme === 'light'
      ? 'rgba(26, 35, 126, 0.9)'
      : 'rgba(255, 255, 255, 0.9)'};
  }
`;

const SafetyTips = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin: 2rem 0;
`;

const TipCard = styled.div`
  background: ${props => props.theme === 'light'
    ? 'rgba(255, 255, 255, 0.95)'
    : 'rgba(255, 255, 255, 0.05)'};
  border-radius: 15px;
  padding: 1.5rem;
  border: 1px solid ${props => props.theme === 'light'
    ? 'rgba(26, 35, 126, 0.2)'
    : 'rgba(255, 255, 255, 0.1)'};
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-5px);
  }

  h3 {
    color: ${props => props.theme === 'light' ? '#1a237e' : '#64ffda'};
    font-size: 1.3rem;
    margin-bottom: 1rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;

    svg {
      font-size: 1.2rem;
    }
  }

  ul {
    list-style: none;
    padding: 0;
    margin: 0;

    li {
      margin-bottom: 0.8rem;
      padding-left: 1.5rem;
      position: relative;
      color: rgba(255, 255, 255, 0.9);

      &::before {
        content: '•';
        position: absolute;
        left: 0;
        color: #64ffda;
      }

      &:last-child {
        margin-bottom: 0;
      }
    }
  }
`;

const WarningBox = styled.div`
  background: rgba(255, 87, 34, 0.1);
  border: 1px solid rgba(255, 87, 34, 0.3);
  border-radius: 10px;
  padding: 1.5rem;
  margin: 1.5rem 0;
  display: flex;
  align-items: flex-start;
  gap: 1rem;

  svg {
    color: #ff5722;
    font-size: 1.5rem;
    margin-top: 0.2rem;
  }

  div {
    flex: 1;

    h3 {
      color: #ff5722;
      margin-bottom: 0.5rem;
      font-size: 1.2rem;
    }

    p {
      margin: 0;
      color: rgba(255, 255, 255, 0.9);
    }
  }
`;

const Safety = ({ currentTheme }) => {
  return (
    <PageContainer>
      <SpaceBackground theme={currentTheme} />
      <Content>
        <Title>Правила безопасности</Title>

        <Section>
          <h2><FaShieldAlt /> Безопасное общение</h2>
          <p>
            Ваша безопасность - наш главный приоритет. Мы разработали эти правила,
            чтобы сделать ваше общение в Ruletka максимально комфортным и безопасным.
          </p>

          <SafetyTips>
            <TipCard>
              <h3><FaUserSecret /> Личная информация</h3>
              <ul>
                <li>Не делитесь личными данными</li>
                <li>Не указывайте адрес проживания</li>
                <li>Не сообщайте банковские реквизиты</li>
                <li>Не отправляйте документы</li>
              </ul>
            </TipCard>

            <TipCard>
              <h3><FaLock /> Безопасность аккаунта</h3>
              <ul>
                <li>Используйте надежный пароль</li>
                <li>Не передавайте доступ к аккаунту</li>
                <li>Регулярно меняйте пароль</li>
                <li>Включите двухфакторную аутентификацию</li>
              </ul>
            </TipCard>

            <TipCard>
              <h3><FaUserFriends /> Общение</h3>
              <ul>
                <li>Будьте вежливы с собеседниками</li>
                <li>Уважайте частную жизнь других</li>
                <li>Не поддавайтесь на провокации</li>
                <li>Сообщайте о нарушениях</li>
              </ul>
            </TipCard>
          </SafetyTips>

          <WarningBox>
            <FaExclamationTriangle />
            <div>
              <h3>Важное предупреждение</h3>
              <p>
                Никогда не переходите по подозрительным ссылкам и не скачивайте файлы
                от незнакомых пользователей. Это может быть опасно для вашего устройства
                и личных данных.
              </p>
            </div>
          </WarningBox>
        </Section>

        <Section>
          <h2><FaShieldAlt /> Модерация и поддержка</h2>
          <p>
            Наша команда модераторов работает круглосуточно, чтобы обеспечить
            безопасную среду общения. Мы быстро реагируем на жалобы и принимаем
            необходимые меры для защиты пользователей.
          </p>
          <p>
            Если вы столкнулись с неприемлемым поведением или нарушением правил,
            немедленно воспользуйтесь кнопкой "Пожаловаться" или обратитесь в
            службу поддержки.
          </p>
        </Section>

        <Section>
          <h2><FaShieldAlt /> Технические меры безопасности</h2>
          <p>
            Мы используем современные технологии для защиты ваших данных:
          </p>
          <ul>
            <li>Шифрование всех передаваемых данных</li>
            <li>Защита от DDoS-атак</li>
            <li>Регулярные проверки безопасности</li>
            <li>Мониторинг подозрительной активности</li>
          </ul>
        </Section>
      </Content>
    </PageContainer>
  );
};

export default Safety; 