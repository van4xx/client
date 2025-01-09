import React from 'react';
import styled from 'styled-components';
import SpaceBackground from './SpaceBackground';
import { FaShieldAlt, FaUserShield, FaLock, FaExclamationTriangle, FaHandPaper, FaVideo, FaUserSecret, FaBan } from 'react-icons/fa';

const SafetyContainer = styled.div`
  min-height: 100vh;
  position: relative;
  padding: 2rem;
`;

const Content = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  padding: 2rem;
  background: ${props => props.theme === 'day' 
    ? 'rgba(255, 255, 255, 0.9)' 
    : 'rgba(0, 0, 0, 0.8)'};
  border-radius: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  position: relative;
  z-index: 1;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  text-align: center;
  margin-bottom: 2rem;
  color: ${props => props.theme === 'day' ? '#1a237e' : '#fff'};
  text-shadow: ${props => props.theme === 'day' 
    ? '2px 2px 4px rgba(0, 0, 0, 0.2)' 
    : '2px 2px 4px rgba(0, 0, 0, 0.5)'};
`;

const Section = styled.section`
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: ${props => props.theme === 'day' 
    ? 'rgba(255, 255, 255, 0.95)' 
    : 'rgba(0, 0, 0, 0.6)'};
  border-radius: 15px;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }
`;

const SectionTitle = styled.h2`
  font-size: 1.8rem;
  margin-bottom: 1.5rem;
  color: ${props => props.theme === 'day' ? '#1a237e' : '#fff'};
  display: flex;
  align-items: center;
  gap: 1rem;

  svg {
    color: ${props => props.theme === 'day' ? '#1a237e' : '#64ffda'};
  }
`;

const Text = styled.p`
  font-size: 1.1rem;
  line-height: 1.6;
  margin-bottom: 1rem;
  color: ${props => props.theme === 'day' ? '#1a237e' : 'rgba(255, 255, 255, 0.9)'};
`;

const GuidelineGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  margin: 2rem 0;
`;

const GuidelineCard = styled.div`
  padding: 1.5rem;
  background: ${props => props.theme === 'day'
    ? 'rgba(255, 255, 255, 0.9)'
    : 'rgba(0, 0, 0, 0.4)'};
  border-radius: 15px;
  border-left: 4px solid ${props => props.theme === 'day' ? '#1a237e' : '#64ffda'};
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }
`;

const GuidelineTitle = styled.h3`
  font-size: 1.2rem;
  margin-bottom: 1rem;
  color: ${props => props.theme === 'day' ? '#1a237e' : '#fff'};
  display: flex;
  align-items: center;
  gap: 0.5rem;

  svg {
    color: ${props => props.theme === 'day' ? '#1a237e' : '#64ffda'};
  }
`;

const List = styled.ul`
  margin: 1rem 0;
  padding-left: 2rem;
`;

const ListItem = styled.li`
  font-size: 1.1rem;
  line-height: 1.6;
  margin-bottom: 0.5rem;
  color: ${props => props.theme === 'day' ? '#1a237e' : 'rgba(255, 255, 255, 0.9)'};
`;

const WarningBox = styled.div`
  margin: 2rem 0;
  padding: 1.5rem;
  background: ${props => props.theme === 'day'
    ? 'rgba(255, 193, 7, 0.1)'
    : 'rgba(255, 193, 7, 0.05)'};
  border-radius: 15px;
  border-left: 4px solid #ffc107;

  h3 {
    color: #ffc107;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 1rem;
  }
`;

const Safety = ({ currentTheme }) => {
  return (
    <SafetyContainer>
      <SpaceBackground theme={currentTheme} />
      <Content theme={currentTheme}>
        <Title theme={currentTheme}>
          <FaShieldAlt style={{ marginRight: '1rem' }} />
          Безопасность
        </Title>

        <Section theme={currentTheme}>
          <SectionTitle theme={currentTheme}>
            <FaUserShield />
            Основные правила безопасности
          </SectionTitle>
          <Text theme={currentTheme}>
            Ваша безопасность - наш главный приоритет. Следуйте этим правилам для комфортного 
            и безопасного общения на Ruletka.
          </Text>
          <GuidelineGrid>
            <GuidelineCard theme={currentTheme}>
              <GuidelineTitle theme={currentTheme}>
                <FaLock />
                Личные данные
              </GuidelineTitle>
              <Text theme={currentTheme}>
                Не делитесь личной информацией с незнакомцами:
              </Text>
              <List>
                <ListItem theme={currentTheme}>Полное имя</ListItem>
                <ListItem theme={currentTheme}>Адрес</ListItem>
                <ListItem theme={currentTheme}>Номер телефона</ListItem>
                <ListItem theme={currentTheme}>Банковские данные</ListItem>
              </List>
            </GuidelineCard>

            <GuidelineCard theme={currentTheme}>
              <GuidelineTitle theme={currentTheme}>
                <FaHandPaper />
                Уважение границ
              </GuidelineTitle>
              <Text theme={currentTheme}>
                Уважайте личные границы собеседников:
              </Text>
              <List>
                <ListItem theme={currentTheme}>Не настаивайте на продолжении общения</ListItem>
                <ListItem theme={currentTheme}>Не требуйте личных фото</ListItem>
                <ListItem theme={currentTheme}>Прекращайте разговор по первой просьбе</ListItem>
              </List>
            </GuidelineCard>

            <GuidelineCard theme={currentTheme}>
              <GuidelineTitle theme={currentTheme}>
                <FaVideo />
                Видеочат
              </GuidelineTitle>
              <Text theme={currentTheme}>
                Правила безопасного видеообщения:
              </Text>
              <List>
                <ListItem theme={currentTheme}>Следите за фоном позади вас</ListItem>
                <ListItem theme={currentTheme}>Не показывайте документы</ListItem>
                <ListItem theme={currentTheme}>Одевайтесь appropriate</ListItem>
              </List>
            </GuidelineCard>
          </GuidelineGrid>
        </Section>

        <Section theme={currentTheme}>
          <SectionTitle theme={currentTheme}>
            <FaUserSecret />
            Конфиденциальность
          </SectionTitle>
          <Text theme={currentTheme}>
            Мы используем современные технологии для защиты ваших данных:
          </Text>
          <List>
            <ListItem theme={currentTheme}>
              Шифрование всех видеозвонков
            </ListItem>
            <ListItem theme={currentTheme}>
              Отсутствие записи и хранения чатов
            </ListItem>
            <ListItem theme={currentTheme}>
              Анонимность всех пользователей
            </ListItem>
            <ListItem theme={currentTheme}>
              Защита от утечек данных
            </ListItem>
          </List>
        </Section>

        <Section theme={currentTheme}>
          <SectionTitle theme={currentTheme}>
            <FaBan />
            Запрещенные действия
          </SectionTitle>
          <Text theme={currentTheme}>
            Следующие действия строго запрещены и ведут к блокировке аккаунта:
          </Text>
          <List>
            <ListItem theme={currentTheme}>
              Демонстрация неприемлемого контента
            </ListItem>
            <ListItem theme={currentTheme}>
              Оскорбления и агрессивное поведение
            </ListItem>
            <ListItem theme={currentTheme}>
              Спам и реклама
            </ListItem>
            <ListItem theme={currentTheme}>
              Мошенничество и обман
            </ListItem>
            <ListItem theme={currentTheme}>
              Нарушение законодательства
            </ListItem>
          </List>
        </Section>

        <WarningBox theme={currentTheme}>
          <h3>
            <FaExclamationTriangle />
            Важное предупреждение
          </h3>
          <Text theme={currentTheme}>
            Если вы столкнулись с неприемлемым поведением или подозрительной активностью, 
            немедленно прекратите общение и сообщите о нарушении через форму жалобы. 
            В случае противоправных действий обратитесь в правоохранительные органы.
          </Text>
        </WarningBox>

        <Section theme={currentTheme}>
          <SectionTitle theme={currentTheme}>
            <FaShieldAlt />
            Модерация и поддержка
          </SectionTitle>
          <Text theme={currentTheme}>
            Наша команда модераторов работает круглосуточно, обеспечивая безопасность всех пользователей:
          </Text>
          <List>
            <ListItem theme={currentTheme}>
              Быстрая реакция на жалобы
            </ListItem>
            <ListItem theme={currentTheme}>
              Проверка подозрительной активности
            </ListItem>
            <ListItem theme={currentTheme}>
              Блокировка нарушителей
            </ListItem>
            <ListItem theme={currentTheme}>
              Техническая поддержка 24/7
            </ListItem>
          </List>
        </Section>
      </Content>
    </SafetyContainer>
  );
};

export default Safety;
