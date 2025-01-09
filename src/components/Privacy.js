import React from 'react';
import styled from 'styled-components';
import SpaceBackground from './SpaceBackground';

const PrivacyContainer = styled.div`
  min-height: 100vh;
  position: relative;
  padding: 2rem;
`;

const Content = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  padding: 2rem;
  background: ${({ theme }) => 
    theme === 'day' 
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
  color: ${({ theme }) => 
    theme === 'day' ? '#1a237e' : '#fff'};
  text-shadow: ${({ theme }) =>
    theme === 'day'
      ? '2px 2px 4px rgba(0, 0, 0, 0.2)'
      : '2px 2px 4px rgba(0, 0, 0, 0.5)'};
`;

const Section = styled.section`
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: ${({ theme }) => 
    theme === 'day' 
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
  color: ${({ theme }) => 
    theme === 'day' ? '#1a237e' : '#fff'};
`;

const Text = styled.p`
  font-size: 1.1rem;
  line-height: 1.6;
  margin-bottom: 1rem;
  color: ${({ theme }) => 
    theme === 'day' ? '#1a237e' : 'rgba(255, 255, 255, 0.9)'};
`;

const List = styled.ul`
  margin: 1rem 0;
  padding-left: 2rem;
`;

const ListItem = styled.li`
  font-size: 1.1rem;
  line-height: 1.6;
  margin-bottom: 0.5rem;
  color: ${({ theme }) => 
    theme === 'day' ? '#1a237e' : 'rgba(255, 255, 255, 0.9)'};
`;

const Privacy = ({ currentTheme }) => {
  return (
    <PrivacyContainer>
      <SpaceBackground theme={currentTheme} />
      <Content theme={currentTheme}>
        <Title theme={currentTheme}>Политика конфиденциальности</Title>

        <Section theme={currentTheme}>
          <SectionTitle theme={currentTheme}>1. Введение</SectionTitle>
          <Text theme={currentTheme}>
            Мы серьезно относимся к защите ваших персональных данных. 
            Эта политика конфиденциальности описывает, как мы собираем, 
            используем и защищаем вашу информацию при использовании Ruletka.
          </Text>
        </Section>

        <Section theme={currentTheme}>
          <SectionTitle theme={currentTheme}>2. Собираемые данные</SectionTitle>
          <Text theme={currentTheme}>
            Мы собираем следующие типы информации:
          </Text>
          <List>
            <ListItem theme={currentTheme}>
              Техническая информация (IP-адрес, тип браузера, устройства)
            </ListItem>
            <ListItem theme={currentTheme}>
              Данные о использовании сервиса (время посещения, длительность сессий)
            </ListItem>
            <ListItem theme={currentTheme}>
              Предоставленная вами информация (настройки, предпочтения)
            </ListItem>
            <ListItem theme={currentTheme}>
              Данные геолокации (только с вашего разрешения)
            </ListItem>
          </List>
        </Section>

        <Section theme={currentTheme}>
          <SectionTitle theme={currentTheme}>3. Использование данных</SectionTitle>
          <Text theme={currentTheme}>
            Мы используем собранную информацию для:
          </Text>
          <List>
            <ListItem theme={currentTheme}>
              Обеспечения работы сервиса и его улучшения
            </ListItem>
            <ListItem theme={currentTheme}>
              Персонализации пользовательского опыта
            </ListItem>
            <ListItem theme={currentTheme}>
              Обеспечения безопасности пользователей
            </ListItem>
            <ListItem theme={currentTheme}>
              Анализа и улучшения качества сервиса
            </ListItem>
          </List>
        </Section>

        <Section theme={currentTheme}>
          <SectionTitle theme={currentTheme}>4. Защита данных</SectionTitle>
          <Text theme={currentTheme}>
            Мы применяем следующие меры для защиты ваших данных:
          </Text>
          <List>
            <ListItem theme={currentTheme}>
              Шифрование всех передаваемых данных
            </ListItem>
            <ListItem theme={currentTheme}>
              Регулярные проверки безопасности
            </ListItem>
            <ListItem theme={currentTheme}>
              Ограниченный доступ к персональным данным
            </ListItem>
            <ListItem theme={currentTheme}>
              Постоянный мониторинг систем безопасности
            </ListItem>
          </List>
        </Section>

        <Section theme={currentTheme}>
          <SectionTitle theme={currentTheme}>5. Хранение данных</SectionTitle>
          <Text theme={currentTheme}>
            Мы не храним историю чатов и видеозвонков. Вся коммуникация происходит 
            в режиме реального времени и не сохраняется на наших серверах.
          </Text>
          <Text theme={currentTheme}>
            Технические данные и настройки хранятся только в течение необходимого 
            для работы сервиса времени и регулярно очищаются.
          </Text>
        </Section>

        <Section theme={currentTheme}>
          <SectionTitle theme={currentTheme}>6. Ваши права</SectionTitle>
          <Text theme={currentTheme}>
            Вы имеете право:
          </Text>
          <List>
            <ListItem theme={currentTheme}>
              Получить доступ к своим данным
            </ListItem>
            <ListItem theme={currentTheme}>
              Исправить неточные данные
            </ListItem>
            <ListItem theme={currentTheme}>
              Удалить свои данные
            </ListItem>
            <ListItem theme={currentTheme}>
              Ограничить обработку данных
            </ListItem>
            <ListItem theme={currentTheme}>
              Получить копию своих данных
            </ListItem>
          </List>
        </Section>

        <Section theme={currentTheme}>
          <SectionTitle theme={currentTheme}>7. Файлы cookie</SectionTitle>
          <Text theme={currentTheme}>
            Мы используем файлы cookie для улучшения работы сервиса. 
            Вы можете отключить использование cookie в настройках браузера, 
            но это может повлиять на функциональность сервиса.
          </Text>
        </Section>

        <Section theme={currentTheme}>
          <SectionTitle theme={currentTheme}>8. Изменения политики</SectionTitle>
          <Text theme={currentTheme}>
            Мы можем обновлять эту политику конфиденциальности. 
            Все изменения будут опубликованы на этой странице, 
            а о существенных изменениях мы уведомим вас дополнительно.
          </Text>
        </Section>

        <Section theme={currentTheme}>
          <SectionTitle theme={currentTheme}>9. Контакты</SectionTitle>
          <Text theme={currentTheme}>
            Если у вас есть вопросы о нашей политике конфиденциальности, 
            пожалуйста, свяжитесь с нами через форму обратной связи.
          </Text>
        </Section>
      </Content>
    </PrivacyContainer>
  );
};

export default Privacy;
