import React from 'react';
import styled from 'styled-components';
import SpaceBackground from './SpaceBackground';

const TermsContainer = styled.div`
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
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: ${props => props.theme === 'day' ? '#1a237e' : '#fff'};
`;

const Text = styled.p`
  font-size: 1.1rem;
  line-height: 1.6;
  margin-bottom: 1rem;
  color: ${props => props.theme === 'day' ? '#1a237e' : 'rgba(255, 255, 255, 0.9)'};
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

const Terms = ({ currentTheme }) => {
  return (
    <TermsContainer>
      <SpaceBackground theme={currentTheme} />
      <Content theme={currentTheme}>
        <Title theme={currentTheme}>Условия использования</Title>

        <Section theme={currentTheme}>
          <SectionTitle theme={currentTheme}>1. Общие положения</SectionTitle>
          <Text theme={currentTheme}>
            Используя Ruletka, вы соглашаетесь с настоящими условиями использования. 
            Пожалуйста, внимательно прочитайте их перед использованием сервиса.
          </Text>
          <Text theme={currentTheme}>
            Мы оставляем за собой право изменять эти условия в любое время. 
            Продолжая использовать сервис после внесения изменений, вы принимаете обновленные условия.
          </Text>
        </Section>

        <Section theme={currentTheme}>
          <SectionTitle theme={currentTheme}>2. Правила использования</SectionTitle>
          <Text theme={currentTheme}>
            При использовании Ruletka вы обязуетесь соблюдать следующие правила:
          </Text>
          <List>
            <ListItem theme={currentTheme}>
              Не использовать сервис для распространения незаконного контента
            </ListItem>
            <ListItem theme={currentTheme}>
              Не нарушать права других пользователей
            </ListItem>
            <ListItem theme={currentTheme}>
              Не использовать оскорбительные выражения и не проявлять агрессию
            </ListItem>
            <ListItem theme={currentTheme}>
              Не распространять спам и рекламные материалы
            </ListItem>
            <ListItem theme={currentTheme}>
              Не выдавать себя за других лиц
            </ListItem>
          </List>
        </Section>

        <Section theme={currentTheme}>
          <SectionTitle theme={currentTheme}>3. Конфиденциальность</SectionTitle>
          <Text theme={currentTheme}>
            Мы уважаем вашу приватность и защищаем ваши персональные данные. 
            Подробную информацию о том, как мы обрабатываем данные, можно найти в нашей Политике конфиденциальности.
          </Text>
          <Text theme={currentTheme}>
            Мы не храним историю чатов и не записываем видеозвонки. 
            Вся коммуникация происходит в режиме реального времени.
          </Text>
        </Section>

        <Section theme={currentTheme}>
          <SectionTitle theme={currentTheme}>4. Ответственность</SectionTitle>
          <Text theme={currentTheme}>
            Ruletka не несет ответственности за:
          </Text>
          <List>
            <ListItem theme={currentTheme}>
              Действия пользователей во время использования сервиса
            </ListItem>
            <ListItem theme={currentTheme}>
              Контент, создаваемый пользователями
            </ListItem>
            <ListItem theme={currentTheme}>
              Технические сбои, не зависящие от нас
            </ListItem>
            <ListItem theme={currentTheme}>
              Потерю данных или другой ущерб, связанный с использованием сервиса
            </ListItem>
          </List>
        </Section>

        <Section theme={currentTheme}>
          <SectionTitle theme={currentTheme}>5. Премиум-функции</SectionTitle>
          <Text theme={currentTheme}>
            Некоторые функции Ruletka доступны только при наличии премиум-подписки. 
            Оплата производится через безопасные платежные системы.
          </Text>
          <Text theme={currentTheme}>
            Мы оставляем за собой право изменять стоимость и состав премиум-функций, 
            предварительно уведомив пользователей.
          </Text>
        </Section>

        <Section theme={currentTheme}>
          <SectionTitle theme={currentTheme}>6. Прекращение доступа</SectionTitle>
          <Text theme={currentTheme}>
            Мы оставляем за собой право ограничить или прекратить доступ к сервису любому пользователю, 
            нарушающему настоящие условия использования.
          </Text>
          <Text theme={currentTheme}>
            В случае серьезных нарушений блокировка может быть постоянной, 
            без возможности восстановления доступа.
          </Text>
        </Section>

        <Section theme={currentTheme}>
          <SectionTitle theme={currentTheme}>7. Контакты</SectionTitle>
          <Text theme={currentTheme}>
            Если у вас возникли вопросы относительно условий использования, 
            пожалуйста, свяжитесь с нами через форму обратной связи или по указанным контактам.
          </Text>
          <Text theme={currentTheme}>
            Мы всегда готовы помочь и ответить на ваши вопросы.
          </Text>
        </Section>
      </Content>
    </TermsContainer>
  );
};

export default Terms;
