import React from 'react';
import styled, { keyframes, css } from 'styled-components';
import { FaSun, FaMoon } from 'react-icons/fa';

const rotate = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const glow = keyframes`
  0% { box-shadow: 0 0 10px rgba(255, 215, 0, 0.3); }
  50% { box-shadow: 0 0 20px rgba(255, 215, 0, 0.5), 0 0 30px rgba(255, 69, 0, 0.3); }
  100% { box-shadow: 0 0 10px rgba(255, 215, 0, 0.3); }
`;

const Container = styled.div`
  display: flex;
  gap: 15px;
  background: rgba(0, 0, 0, 0.4);
  padding: 8px 15px;
  border-radius: 30px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(5px);
  transition: all 0.3s ease;

  &:hover {
    background: rgba(0, 0, 0, 0.5);
    border-color: rgba(255, 255, 255, 0.3);
  }
`;

const ThemeButton = styled.button`
  background: ${props => props.active ? 'rgba(255, 255, 255, 0.1)' : 'transparent'};
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 20px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  transition: all 0.3s ease;
  
  ${props => props.active && css`
    animation: ${glow} 2s infinite;
  `}

  svg {
    color: ${props => props.active ? '#FFD700' : 'rgba(255, 255, 255, 0.6)'};
    font-size: 20px;
    transition: all 0.3s ease;
    ${props => props.active && css`
      animation: ${rotate} 10s linear infinite;
    `}
  }

  &:hover {
    background: rgba(255, 255, 255, 0.15);
    transform: translateY(-2px);

    svg {
      color: #FFD700;
      transform: scale(1.2);
    }
  }

  &::before {
    content: '';
    position: absolute;
    top: -2px;
    left: -2px;
    right: -2px;
    bottom: -2px;
    border-radius: 22px;
    background: linear-gradient(45deg, #FFD700, #FFA500);
    opacity: 0;
    transition: opacity 0.3s ease;
    z-index: -1;
  }

  ${props => props.active && css`
    &::before {
      opacity: 0.3;
    }
  `}
`;

const Tooltip = styled.div`
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 5px 10px;
  border-radius: 5px;
  font-size: 12px;
  white-space: nowrap;
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s ease;
  margin-bottom: 5px;

  &::after {
    content: '';
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    border-width: 5px;
    border-style: solid;
    border-color: rgba(0, 0, 0, 0.8) transparent transparent transparent;
  }
`;

const ButtonWrapper = styled.div`
  position: relative;

  &:hover ${Tooltip} {
    opacity: 1;
    visibility: visible;
    transform: translateX(-50%) translateY(-5px);
  }
`;

const ThemeSwitcher = ({ currentTheme, onThemeChange }) => {
  return (
    <Container>
      <ButtonWrapper>
        <ThemeButton
          onClick={() => onThemeChange('day')}
          active={currentTheme === 'day'}
        >
          <FaSun />
        </ThemeButton>
        <Tooltip>День</Tooltip>
      </ButtonWrapper>

      <ButtonWrapper>
        <ThemeButton
          onClick={() => onThemeChange('night')}
          active={currentTheme === 'night'}
        >
          <FaMoon />
        </ThemeButton>
        <Tooltip>Ночь</Tooltip>
      </ButtonWrapper>
    </Container>
  );
};

export default ThemeSwitcher; 