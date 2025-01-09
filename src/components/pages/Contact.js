import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import SpaceBackground from '../SpaceBackground';
import { FaEnvelope, FaComment, FaCheck, FaExclamationTriangle } from 'react-icons/fa';

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
  max-width: 800px;
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

const Form = styled.form`
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
  color: #64ffda;
`;

const Input = styled.input`
  padding: 1rem;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  font-size: 1rem;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: #64ffda;
    box-shadow: 0 0 10px rgba(100, 255, 218, 0.3);
  }

  &::placeholder {
    color: rgba(255, 255, 255, 0.5);
  }
`;

const TextArea = styled.textarea`
  padding: 1rem;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  font-size: 1rem;
  min-height: 150px;
  resize: vertical;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: #64ffda;
    box-shadow: 0 0 10px rgba(100, 255, 218, 0.3);
  }

  &::placeholder {
    color: rgba(255, 255, 255, 0.5);
  }
`;

const Button = styled.button`
  padding: 1rem 2rem;
  border-radius: 10px;
  background: linear-gradient(45deg, #64ffda, #00b0ff);
  border: none;
  color: white;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(100, 255, 218, 0.4);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: none;
  }

  svg {
    font-size: 1.2rem;
  }
`;

const Message = styled.div`
  padding: 1rem;
  border-radius: 10px;
  margin-top: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  animation: fadeIn 0.3s ease;

  ${props => props.type === 'success' ? `
    background: rgba(100, 255, 218, 0.1);
    border: 1px solid rgba(100, 255, 218, 0.3);
    color: #64ffda;
  ` : `
    background: rgba(255, 87, 34, 0.1);
    border: 1px solid rgba(255, 87, 34, 0.3);
    color: #ff5722;
  `}

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(-10px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;

const Contact = () => {
  const [theme, setTheme] = useState('dark');

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    setTheme(savedTheme);
  }, []);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [status, setStatus] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Здесь будет логика отправки формы на сервер
      await new Promise(resolve => setTimeout(resolve, 1500)); // Имитация запроса
      setStatus({ type: 'success', message: 'Сообщение успешно отправлено! Мы свяжемся с вами в ближайшее время.' });
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      setStatus({ type: 'error', message: 'Произошла ошибка при отправке сообщения. Пожалуйста, попробуйте позже.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PageContainer theme={theme}>
      <SpaceBackground theme={theme} />
      <Content>
        <Title theme={theme}>Связаться с нами</Title>

        <Section theme={theme}>
          <h2><FaEnvelope /> Напишите нам</h2>
          <p>
            У вас есть вопросы, предложения или вы хотите сообщить о проблеме?
            Заполните форму ниже, и мы свяжемся с вами в ближайшее время.
          </p>

          <Form onSubmit={handleSubmit}>
            <FormGroup>
              <Label htmlFor="name">Ваше имя</Label>
              <Input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Введите ваше имя"
                required
              />
            </FormGroup>

            <FormGroup>
              <Label htmlFor="email">Email</Label>
              <Input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Введите ваш email"
                required
              />
            </FormGroup>

            <FormGroup>
              <Label htmlFor="subject">Тема</Label>
              <Input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder="Укажите тему сообщения"
                required
              />
            </FormGroup>

            <FormGroup>
              <Label htmlFor="message">Сообщение</Label>
              <TextArea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Введите ваше сообщение"
                required
              />
            </FormGroup>

            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>Отправка...</>
              ) : (
                <>
                  <FaComment />
                  Отправить сообщение
                </>
              )}
            </Button>

            {status && (
              <Message type={status.type}>
                {status.type === 'success' ? <FaCheck /> : <FaExclamationTriangle />}
                {status.message}
              </Message>
            )}
          </Form>
        </Section>
      </Content>
    </PageContainer>
  );
};

export default Contact; 