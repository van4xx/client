import React from 'react';
import styled from 'styled-components';
import SpaceBackground from './SpaceBackground';
import { FaUsers, FaGlobe, FaHeart, FaRocket, FaUserAstronaut, FaShieldAlt } from 'react-icons/fa';

const AboutContainer = styled.div`
  min-height: 100vh;
  position: relative;
  padding: 2rem;
`;

const Content = styled.div`
  max-width: 1200px;
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

const Title = styled.h1`
  font-size: 3rem;
  text-align: center;
  margin-bottom: 2rem;
  color: ${({ theme }) => 
    theme === 'day' ? '#000' : '#fff'};
  text-shadow: ${({ theme }) =>
    theme === 'day'
      ? '2px 2px 4px rgba(0, 0, 0, 0.1)'
      : '2px 2px 4px rgba(0, 0, 0, 0.5)'};
`;

const Section = styled.section`
  margin-bottom: 3rem;
  padding: 2rem;
  background: ${({ theme }) => 
    theme === 'day' 
      ? 'rgba(255, 255, 255, 0.98)' 
      : 'rgba(0, 0, 0, 0.6)'};
  border-radius: 15px;
  transition: all 0.3s ease;
  border: 1px solid ${({ theme }) => 
    theme === 'day' ? 'rgba(0, 0, 0, 0.1)' : 'rgba(255, 255, 255, 0.1)'};

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
`;

const SectionTitle = styled.h2`
  font-size: 2rem;
  margin-bottom: 1.5rem;
  color: ${({ theme }) => 
    theme === 'day' ? '#000' : '#fff'};
  font-weight: 600;
`;

const Text = styled.p`
  font-size: 1.1rem;
  line-height: 1.6;
  margin-bottom: 1rem;
  color: ${({ theme }) => 
    theme === 'day' ? '#333' : 'rgba(255, 255, 255, 0.9)'};
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 2rem;
  margin: 2rem 0;
`;

const StatBox = styled.div`
  padding: 1.5rem;
  text-align: center;
  background: ${({ theme }) => 
    theme === 'day'
      ? 'rgba(255, 255, 255, 0.98)'
      : 'rgba(0, 0, 0, 0.4)'};
  border-radius: 15px;
  transition: all 0.3s ease;
  border: 1px solid ${({ theme }) => 
    theme === 'day' ? 'rgba(0, 0, 0, 0.1)' : 'rgba(255, 255, 255, 0.1)'};

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }

  svg {
    font-size: 2.5rem;
    margin-bottom: 1rem;
    color: ${({ theme }) => 
      theme === 'day' ? '#000' : props => props.iconColor || '#FFD700'};
  }
`;

const StatNumber = styled.div`
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
  background: ${({ theme }) => 
    theme === 'day'
      ? 'linear-gradient(to right, #000, #333)'
      : 'linear-gradient(to right, #FFD700, #FFA500)'};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const StatLabel = styled.div`
  font-size: 1.1rem;
  color: ${({ theme }) => 
    theme === 'day' ? '#333' : 'rgba(255, 255, 255, 0.9)'};
`;

const TeamGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin: 2rem 0;
`;

const TeamMember = styled.div`
  padding: 1.5rem;
  text-align: center;
  background: ${({ theme }) => 
    theme === 'day'
      ? 'rgba(255, 255, 255, 0.98)'
      : 'rgba(0, 0, 0, 0.4)'};
  border-radius: 15px;
  transition: all 0.3s ease;
  border: 1px solid ${({ theme }) => 
    theme === 'day' ? 'rgba(0, 0, 0, 0.1)' : 'rgba(255, 255, 255, 0.1)'};

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
`;

const MemberImage = styled.div`
  width: 120px;
  height: 120px;
  margin: 0 auto 1rem;
  border-radius: 50%;
  background: ${({ theme }) => 
    theme === 'day'
      ? 'linear-gradient(45deg, #000, #333)'
      : 'linear-gradient(45deg, #FFD700, #FFA500)'};
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    font-size: 3rem;
    color: ${({ theme }) => 
      theme === 'day' ? '#fff' : '#000'};
  }
`;

const MemberName = styled.h3`
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
  color: ${({ theme }) => 
    theme === 'day' ? '#000' : '#fff'};
  font-weight: 600;
`;

const MemberRole = styled.div`
  font-size: 1.1rem;
  color: ${({ theme }) => 
    theme === 'day' ? '#333' : 'rgba(255, 255, 255, 0.9)'};
  margin-bottom: 1rem;
`;

const About = ({ currentTheme }) => {
  const stats = [
    { icon: FaUsers, number: "10M+", label: "Пользователей", color: "#FF6B6B" },
    { icon: FaGlobe, number: "150+", label: "Стран", color: "#4ECDC4" },
    { icon: FaHeart, number: "500K+", label: "Знакомств", color: "#FFD93D" },
    { icon: FaRocket, number: "1M+", label: "Чатов в день", color: "#FF9A8B" }
  ];

  const team = [
    {
      name: "Александр Космонавтов",
      role: "Основатель и CEO",
      icon: FaUserAstronaut
    },
    {
      name: "Елена Звёздная",
      role: "Руководитель разработки",
      icon: FaRocket
    },
    {
      name: "Михаил Защитник",
      role: "Глава безопасности",
      icon: FaShieldAlt
    }
  ];

  return (
    <AboutContainer>
      <SpaceBackground theme={currentTheme} />
      <Content theme={currentTheme}>
        <Title theme={currentTheme}>О нас</Title>

        <Section theme={currentTheme}>
          <SectionTitle theme={currentTheme}>Наша миссия</SectionTitle>
          <Text theme={currentTheme}>
            Ruletka создана с целью объединить людей со всего мира через уникальный опыт общения в космическом пространстве. 
            Мы верим, что каждая встреча может изменить жизнь, и стремимся сделать эти встречи незабываемыми.
          </Text>
          <Text theme={currentTheme}>
            Наша платформа предоставляет безопасное и увлекательное пространство для знакомств, 
            где каждый может найти друзей, единомышленников или даже свою вторую половинку.
          </Text>
        </Section>

        <Section theme={currentTheme}>
          <SectionTitle theme={currentTheme}>Наши достижения</SectionTitle>
          <StatsGrid>
            {stats.map((stat, index) => (
              <StatBox key={index} theme={currentTheme}>
                <stat.icon />
                <StatNumber theme={currentTheme}>{stat.number}</StatNumber>
                <StatLabel theme={currentTheme}>{stat.label}</StatLabel>
              </StatBox>
            ))}
          </StatsGrid>
        </Section>

        <Section theme={currentTheme}>
          <SectionTitle theme={currentTheme}>Наша команда</SectionTitle>
          <Text theme={currentTheme}>
            За Ruletka стоит команда увлеченных профессионалов, объединенных общей целью - 
            создать лучшую платформу для онлайн-общения в мире.
          </Text>
          <TeamGrid>
            {team.map((member, index) => (
              <TeamMember key={index} theme={currentTheme}>
                <MemberImage theme={currentTheme}>
                  <member.icon />
                </MemberImage>
                <MemberName theme={currentTheme}>{member.name}</MemberName>
                <MemberRole theme={currentTheme}>{member.role}</MemberRole>
              </TeamMember>
            ))}
          </TeamGrid>
        </Section>

        <Section theme={currentTheme}>
          <SectionTitle theme={currentTheme}>Наше видение</SectionTitle>
          <Text theme={currentTheme}>
            Мы стремимся создать глобальное сообщество, где каждый может найти понимание, 
            поддержку и новые возможности для общения. Наша цель - сделать онлайн-общение 
            максимально комфортным, безопасным и увлекательным.
          </Text>
          <Text theme={currentTheme}>
            Мы постоянно развиваемся, внедряя новые технологии и прислушиваясь к пожеланиям 
            наших пользователей, чтобы сделать Ruletka еще лучше.
          </Text>
        </Section>
      </Content>
    </AboutContainer>
  );
};

export default About; 