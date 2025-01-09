import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { FaTelegram, FaHeart } from 'react-icons/fa';
import { SlSocialVkontakte } from 'react-icons/sl';

const FooterContainer = styled.footer`
  width: 100%;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(10px);
  color: white;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
`;

const FooterContent = styled.div`
  width: min(1200px, 100%);
  margin: 0 auto;
  padding: 48px 24px;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  column-gap: 64px;
  row-gap: 48px;

  @media (max-width: 968px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    padding: 32px 24px;
  }
`;

const FooterSection = styled.div`
  h3 {
    font-size: 18px;
    font-weight: 600;
    color: #64ffda;
    margin-bottom: 24px;
    padding-bottom: 8px;
    border-bottom: 2px solid rgba(100, 255, 218, 0.3);
    margin-left: 24px;
  }
`;

const FooterLink = styled(Link)`
  display: block;
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  font-size: 15px;
  line-height: 1.6;
  margin-bottom: 12px;
  margin-left: 48px;
  transition: color 0.2s ease, transform 0.2s ease;
  
  &:hover {
    color: #64ffda;
    transform: translateX(8px);
  }
`;

const ExternalLink = styled.a`
  display: block;
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  font-size: 15px;
  line-height: 1.6;
  margin-bottom: 12px;
  margin-left: 48px;
  transition: color 0.2s ease, transform 0.2s ease;
  
  &:hover {
    color: #64ffda;
    transform: translateX(8px);
  }
`;

const SocialLinks = styled.div`
  display: flex;
  gap: 16px;
  margin-top: 24px;
  margin-left: 48px;

  a {
    color: rgba(255, 255, 255, 0.8);
    font-size: 24px;
    transition: all 0.2s ease;
    padding: 8px;
    margin: -8px;
    line-height: 1;
    
    &:hover {
      color: #64ffda;
      transform: translateY(-4px);
    }
  }
`;

const Copyright = styled.div`
  width: 100%;
  text-align: center;
  padding: 24px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(0, 0, 0, 0.3);
  font-size: 14px;
  color: rgba(255, 255, 255, 0.6);

  span {
    display: block;
    margin-top: 8px;
    color: #64ffda;
  }

  svg {
    vertical-align: middle;
    margin: 0 4px;
    color: #ff6b6b;
  }
`;

const FooterStats = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 24px;
  color: rgba(255, 255, 255, 0.8);
  font-size: 14px;

  svg {
    color: #64ffda;
    font-size: 16px;
  }
`;

const Footer = () => {
  return (
    <FooterContainer>
      <FooterContent>
        <FooterSection>
          <h3>О проекте</h3>
          <FooterLink to="/about">О нас</FooterLink>
          <FooterLink to="/faq">FAQ</FooterLink>
          <FooterLink to="/terms">Условия использования</FooterLink>
          <FooterLink to="/privacy">Политика конфиденциальности</FooterLink>
        </FooterSection>
        <FooterSection>
          <h3>Поддержка</h3>
          <FooterLink to="/contact">Связаться с нами</FooterLink>
          <FooterLink to="/report">Сообщить о проблеме</FooterLink>
          <FooterLink to="/safety">Правила безопасности</FooterLink>
        </FooterSection>
        <FooterSection>
          <h3>Сообщество</h3>
          <SocialLinks>
            <ExternalLink href="https://vk.com/ruletka" title="ВКонтакте">
              <SlSocialVkontakte />
            </ExternalLink>
            <ExternalLink href="https://t.me/ruletka" title="Telegram">
              <FaTelegram />
            </ExternalLink>
          </SocialLinks>
        </FooterSection>
      </FooterContent>
      <Copyright>
        © 2024-2025 Ruletka. Создано с <FaHeart /> к Космосу.
      </Copyright>
    </FooterContainer>
  );
};

export default Footer; 