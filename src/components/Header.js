import React from 'react';
import { Link } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import ThemeSwitcher from './ThemeSwitcher';
import { FaUsers, FaRocket, FaStar } from 'react-icons/fa';

const pulseGlow = keyframes`
  0% { box-shadow: 0 0 20px rgba(255, 255, 255, 0.1); }
  50% { box-shadow: 0 0 30px rgba(255, 255, 255, 0.2); }
  100% { box-shadow: 0 0 20px rgba(255, 255, 255, 0.1); }
`;

const starFloat = keyframes`
  0% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-5px) rotate(180deg); }
  100% { transform: translateY(0) rotate(360deg); }
`;

const glowText = keyframes`
  0% { text-shadow: 0 0 10px rgba(255, 215, 0, 0.5); }
  50% { text-shadow: 0 0 20px rgba(255, 215, 0, 0.8), 0 0 30px rgba(255, 69, 0, 0.4); }
  100% { text-shadow: 0 0 10px rgba(255, 215, 0, 0.5); }
`;

const logoSpin = keyframes`
  0% { transform: rotate(0deg) scale(1); }
  25% { transform: rotate(90deg) scale(1.2); }
  50% { transform: rotate(180deg) scale(1); }
  75% { transform: rotate(270deg) scale(1.2); }
  100% { transform: rotate(360deg) scale(1); }
`;

const logoGlow = keyframes`
  0% { text-shadow: 0 0 10px rgba(46, 213, 115, 0.5); }
  50% { text-shadow: 0 0 20px rgba(46, 213, 115, 0.8), 0 0 30px rgba(0, 184, 148, 0.4); }
  100% { text-shadow: 0 0 10px rgba(46, 213, 115, 0.5); }
`;

const HeaderContainer = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 70px;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(15px);
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 30px;
  z-index: 1000;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  animation: ${pulseGlow} 4s ease-in-out infinite;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(90deg, 
      rgba(255, 255, 255, 0) 0%,
      rgba(255, 255, 255, 0.05) 50%,
      rgba(255, 255, 255, 0) 100%);
    animation: shimmer 3s infinite linear;
    pointer-events: none;
  }

  @keyframes shimmer {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(100%); }
  }
`;

const Logo = styled(Link)`
  font-size: 28px;
  font-weight: bold;
  color: #fff;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 12px;
  position: relative;
  padding: 5px 15px;
  border-radius: 20px;
  transition: all 0.3s ease;

  span {
    background: linear-gradient(to right, #2ecc71, #1abc9c, #16a085);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    animation: ${logoGlow} 3s ease-in-out infinite;
    position: relative;
    
    &::after {
      content: attr(data-text);
      position: absolute;
      left: 0;
      top: 0;
      z-index: -1;
      filter: blur(8px);
      opacity: 0.7;
      background: inherit;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border-radius: 20px;
    background: linear-gradient(45deg, 
      rgba(46, 213, 115, 0.1),
      rgba(0, 184, 148, 0.1));
    opacity: 0;
    transition: all 0.3s ease;
  }

  &:hover {
    transform: scale(1.05);
    
    &::before {
      opacity: 1;
    }

    svg {
      animation: ${logoSpin} 1.5s ease-in-out;
      color: #2ecc71;
    }

    span {
      animation: ${logoGlow} 1s ease-in-out infinite;
    }
  }

  svg {
    font-size: 24px;
    color: #2ecc71;
    filter: drop-shadow(0 0 8px rgba(46, 213, 115, 0.5));
    transition: all 0.3s ease;
    
    &:hover {
      transform: rotate(180deg) scale(1.2);
    }
  }
`;

const Navigation = styled.nav`
  display: flex;
  align-items: center;
  gap: 25px;
`;

const NavLink = styled(Link)`
  color: #fff;
  text-decoration: none;
  padding: 8px 20px;
  border-radius: 20px;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 8px;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(45deg,
      rgba(255, 255, 255, 0.1),
      rgba(255, 255, 255, 0.05));
    transform: translateY(100%);
    transition: transform 0.3s ease;
  }

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(45deg,
      rgba(255, 69, 0, 0.2),
      rgba(255, 215, 0, 0.2));
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  svg {
    font-size: 18px;
    color: #FFD700;
    transition: all 0.3s ease;
  }

  &:hover {
    color: #FFD700;
    transform: translateY(-2px);

    &::before {
      transform: translateY(0);
    }

    &::after {
      opacity: 1;
    }

    svg {
      transform: scale(1.2) rotate(15deg);
      color: #FFA500;
    }
  }
`;

const OnlineCount = styled.div`
  background: rgba(0, 0, 0, 0.3);
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 14px;
  color: #fff;
  display: flex;
  align-items: center;
  gap: 8px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    border-color: rgba(255, 215, 0, 0.3);
    box-shadow: 0 0 20px rgba(255, 215, 0, 0.2);
  }

  svg {
    color: #32CD32;
    animation: pulse 2s ease-in-out infinite;
  }

  @keyframes pulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.2); }
    100% { transform: scale(1); }
  }
`;

const ThemeSwitcherWrapper = styled.div`
  margin-left: 15px;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: -15px;
    width: 1px;
    height: 20px;
    background: rgba(255, 255, 255, 0.1);
    transform: translateY(-50%);
  }
`;

const Header = ({ currentTheme, onThemeChange, onlineUsers }) => {
  return (
    <HeaderContainer>
      <Logo to="/">
        <FaStar />
        <span data-text="Ruletka">Ruletka</span>
      </Logo>

      <Navigation>
        <NavLink to="/chat">
          <FaRocket />
          Начать чат
        </NavLink>
        <ThemeSwitcherWrapper>
          <ThemeSwitcher currentTheme={currentTheme} onThemeChange={onThemeChange} />
        </ThemeSwitcherWrapper>
      </Navigation>
    </HeaderContainer>
  );
};

export default Header; 