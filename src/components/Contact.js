import React, { useState } from 'react';
import styled from 'styled-components';
import SpaceBackground from './SpaceBackground';
import { FaEnvelope, FaPhone, FaComments, FaExclamationCircle } from 'react-icons/fa';

const ContactContainer = styled.div`
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

const Text = styled.p`
  font-size: 1.1rem;
  line-height: 1.6;
  margin-bottom: 1rem;
  color: ${({ theme }) => 
    theme === 'day' ? '#1a237e' : 'rgba(255, 255, 255, 0.9)'};
`;

const ContactForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-size: 1.1rem;
  color: ${({ theme }) => 
    theme === 'day' ? '#1a237e' : '#fff'};
`;

const Input = styled.input`
  padding: 0.8rem;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => 
    theme === 'day' ? 'rgba(26, 35, 126, 0.2)' : 'rgba(255, 255, 255, 0.1)'};
  background: ${({ theme }) => 
    theme === 'day' ? '#fff' : 'rgba(0, 0, 0, 0.3)'};
  color: ${({ theme }) => 
    theme === 'day' ? '#1a237e' : '#fff'};
  font-size: 1rem;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => 
      theme === 'day' ? '#1a237e' : '#64ffda'};
    box-shadow: 0 0 0 2px ${({ theme }) => 
      theme === 'day' ? 'rgba(26, 35, 126, 0.2)' : 'rgba(100, 255, 218, 0.2)'};
  }
`;

const TextArea = styled.textarea`
  padding: 0.8rem;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => 
    theme === 'day' ? 'rgba(26, 35, 126, 0.2)' : 'rgba(255, 255, 255, 0.1)'};
  background: ${({ theme }) => 
    theme === 'day' ? '#fff' : 'rgba(0, 0, 0, 0.3)'};
  color: ${({ theme }) => 
    theme === 'day' ? '#1a237e' : '#fff'};
  font-size: 1rem;
  min-height: 150px;
  resize: vertical;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => 
      theme === 'day' ? '#1a237e' : '#64ffda'};
    box-shadow: 0 0 0 2px ${({ theme }) => 
      theme === 'day' ? 'rgba(26, 35, 126, 0.2)' : 'rgba(100, 255, 218, 0.2)'};
  }
`;

const Button = styled.button`
  padding: 1rem 2rem;
  border-radius: 8px;
  border: none;
  background: ${({ theme }) => 
    theme === 'day'
      ? 'linear-gradient(45deg, #1a237e, #0d47a1)'
      : 'linear-gradient(45deg, #64ffda, #00b0ff)'};
  color: #fff;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const ContactInfo = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-top: 2rem;
`;

const InfoCard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 1.5rem;
  background: ${({ theme }) => 
    theme === 'day'
      ? 'rgba(255, 255, 255, 0.9)'
      : 'rgba(0, 0, 0, 0.4)'};
  border-radius: 15px;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }

  svg {
    font-size: 2rem;
    margin-bottom: 1rem;
    color: ${({ theme }) => 
      theme === 'day' ? '#1a237e' : '#64ffda'};
  }
`;

const InfoTitle = styled.h3`
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
  color: ${({ theme }) => 
    theme === 'day' ? '#1a237e' : '#fff'};
`;

const InfoText = styled.p`
  color: ${({ theme }) => 
    theme === 'day' ? '#1a237e' : 'rgba(255, 255, 255, 0.9)'};
`;

const ErrorMessage = styled.div`
  color: #ff3d00;
  font-size: 0.9rem;
  margin-top: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  svg {
    font-size: 1rem;
  }
`;

const Contact = ({ currentTheme }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = 'Имя обязательно';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email обязателен';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Некорректный email';
    }
    if (!formData.subject.trim()) {
      newErrors.subject = 'Тема обязательна';
    }
    if (!formData.message.trim()) {
      newErrors.message = 'Сообщение обязательно';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    // Здесь будет логика отправки формы
    await new Promise(resolve => setTimeout(resolve, 1000)); // Имитация отправки
    setIsSubmitting(false);
    
    // Очистка формы после успешной отправки
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: ''
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Очищаем ошибку при вводе
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  return (
    <ContactContainer>
      <SpaceBackground theme={currentTheme} />
      <Content theme={currentTheme}>
        <Title theme={currentTheme}>Свяжитесь с нами</Title>

        <Section theme={currentTheme}>
          <Text theme={currentTheme}>
            У вас есть вопросы, предложения или нужна помощь? 
            Заполните форму ниже, и мы свяжемся с вами в ближайшее время.
          </Text>

          <ContactForm onSubmit={handleSubmit}>
            <FormGroup>
              <Label theme={currentTheme}>Имя</Label>
              <Input
                theme={currentTheme}
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Введите ваше имя"
              />
              {errors.name && (
                <ErrorMessage>
                  <FaExclamationCircle />
                  {errors.name}
                </ErrorMessage>
              )}
            </FormGroup>

            <FormGroup>
              <Label theme={currentTheme}>Email</Label>
              <Input
                theme={currentTheme}
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Введите ваш email"
              />
              {errors.email && (
                <ErrorMessage>
                  <FaExclamationCircle />
                  {errors.email}
                </ErrorMessage>
              )}
            </FormGroup>

            <FormGroup>
              <Label theme={currentTheme}>Тема</Label>
              <Input
                theme={currentTheme}
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder="Введите тему сообщения"
              />
              {errors.subject && (
                <ErrorMessage>
                  <FaExclamationCircle />
                  {errors.subject}
                </ErrorMessage>
              )}
            </FormGroup>

            <FormGroup>
              <Label theme={currentTheme}>Сообщение</Label>
              <TextArea
                theme={currentTheme}
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Введите ваше сообщение"
              />
              {errors.message && (
                <ErrorMessage>
                  <FaExclamationCircle />
                  {errors.message}
                </ErrorMessage>
              )}
            </FormGroup>

            <Button 
              theme={currentTheme}
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Отправка...' : 'Отправить'}
            </Button>
          </ContactForm>
        </Section>

        <ContactInfo>
          <InfoCard theme={currentTheme}>
            <FaEnvelope />
            <InfoTitle theme={currentTheme}>Email</InfoTitle>
            <InfoText theme={currentTheme}>support@ruletka.com</InfoText>
          </InfoCard>

          <InfoCard theme={currentTheme}>
            <FaPhone />
            <InfoTitle theme={currentTheme}>Телефон</InfoTitle>
            <InfoText theme={currentTheme}>+7 (999) 123-45-67</InfoText>
          </InfoCard>

          <InfoCard theme={currentTheme}>
            <FaComments />
            <InfoTitle theme={currentTheme}>Онлайн чат</InfoTitle>
            <InfoText theme={currentTheme}>24/7 поддержка</InfoText>
          </InfoCard>
        </ContactInfo>
      </Content>
    </ContactContainer>
  );
};

export default Contact;