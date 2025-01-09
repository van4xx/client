import React from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const Panel = styled.div`
  position: fixed;
  bottom: 30px;
  right: 30px;
  background: rgba(0, 0, 0, 0.7);
  padding: 20px;
  border-radius: 15px;
  color: white;
  max-width: 300px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  animation: ${fadeIn} 0.5s ease-out;
  z-index: 1000;
  font-family: 'Arial', sans-serif;
`;

const Title = styled.h3`
  margin: 0 0 15px 0;
  font-size: 18px;
  color: ${props => props.theme === 'day' ? '#ffd700' : '#7c4dff'};
  text-shadow: 0 0 10px ${props => props.theme === 'day' ? 'rgba(255, 215, 0, 0.5)' : 'rgba(124, 77, 255, 0.5)'};
`;

const Description = styled.p`
  margin: 0 0 10px 0;
  font-size: 14px;
  line-height: 1.4;
  color: rgba(255, 255, 255, 0.9);
`;

const Stat = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 5px 0;
  font-size: 13px;
  color: rgba(255, 255, 255, 0.8);
`;

const StatLabel = styled.span`
  color: ${props => props.theme === 'day' ? '#40c4ff' : '#18ffff'};
`;

const StatValue = styled.span`
  color: ${props => props.theme === 'day' ? '#ffd740' : '#b388ff'};
`;

const InfoPanel = ({ theme }) => {
  const themeInfo = {
    day: {
      title: "Солнечная система",
      description: "Яркий день в космосе, где золотое солнце освещает окружающие планеты и астероиды. Наблюдайте за НЛО и кометами в лазурном небе.",
      stats: {
        "Звезды": "300",
        "Планеты": "3",
        "Кометы": "6",
        "НЛО": "4",
        "Туманности": "3"
      }
    },
    night: {
      title: "Глубокий космос",
      description: "Таинственная ночь во вселенной, наполненная мерцающими звездами, яркими туманностями и загадочным северным сиянием.",
      stats: {
        "Звезды": "1000",
        "Планеты": "3",
        "Кометы": "12",
        "НЛО": "6",
        "Туманности": "4"
      }
    }
  };

  const currentTheme = themeInfo[theme];

  return (
    <Panel>
      <Title theme={theme}>{currentTheme.title}</Title>
      <Description>{currentTheme.description}</Description>
      {Object.entries(currentTheme.stats).map(([label, value]) => (
        <Stat key={label}>
          <StatLabel theme={theme}>{label}:</StatLabel>
          <StatValue theme={theme}>{value}</StatValue>
        </Stat>
      ))}
    </Panel>
  );
};

export default InfoPanel; 