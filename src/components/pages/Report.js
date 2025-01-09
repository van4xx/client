import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import SpaceBackground from '../SpaceBackground';
import { FaExclamationTriangle, FaFlag, FaCheck, FaUserShield } from 'react-icons/fa';

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
  color: ${props => props.theme === 'light' ? '#1a237e' : '#64ffda'};
`;

const Input = styled.input`
  padding: 1rem;
  border-radius: 10px;
  background: ${props => props.theme === 'light'
    ? 'rgba(255, 255, 255, 0.9)'
    : 'rgba(255, 255, 255, 0.1)'};
  border: 1px solid ${props => props.theme === 'light'
    ? 'rgba(26, 35, 126, 0.2)'
    : 'rgba(255, 255, 255, 0.2)'};
  color: ${props => props.theme === 'light' ? '#1a237e' : 'white'};
  font-size: 1rem;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: ${props => props.theme === 'light' ? '#1a237e' : '#64ffda'};
    box-shadow: 0 0 10px ${props => props.theme === 'light'
      ? 'rgba(26, 35, 126, 0.3)'
      : 'rgba(100, 255, 218, 0.3)'};
  }

  &::placeholder {
    color: ${props => props.theme === 'light'
      ? 'rgba(26, 35, 126, 0.5)'
      : 'rgba(255, 255, 255, 0.5)'};
  }
`;

const Select = styled.select`
  padding: 1rem;
  border-radius: 10px;
  background: ${props => props.theme === 'light'
    ? 'rgba(255, 255, 255, 0.9)'
    : 'rgba(255, 255, 255, 0.1)'};
  border: 1px solid ${props => props.theme === 'light'
    ? 'rgba(26, 35, 126, 0.2)'
    : 'rgba(255, 255, 255, 0.2)'};
  color: ${props => props.theme === 'light' ? '#1a237e' : 'white'};
  font-size: 1rem;
  transition: all 0.3s ease;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: ${props => props.theme === 'light' ? '#1a237e' : '#64ffda'};
    box-shadow: 0 0 10px ${props => props.theme === 'light'
      ? 'rgba(26, 35, 126, 0.3)'
      : 'rgba(100, 255, 218, 0.3)'};
  }

  option {
    background: #1a1a1a;
    color: white;
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

const InfoBox = styled.div`
  background: rgba(100, 255, 218, 0.1);
  border: 1px solid rgba(100, 255, 218, 0.3);
  border-radius: 10px;
  padding: 1rem;
  margin: 1rem 0;
  display: flex;
  align-items: flex-start;
  gap: 1rem;

  svg {
    color: #64ffda;
    font-size: 1.5rem;
    margin-top: 0.2rem;
  }

  p {
    margin: 0;
    font-size: 1rem;
  }
`;

const Report = ({ currentTheme }) => {
  const [formData, setFormData] = useState({
    reportType: '',
    userId: '',
    date: '',
    description: '',
    evidence: ''
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
      setStatus({ type: 'success', message: 'Жалоба успешно отправлена! Мы рассмотрим её в ближайшее время.' });
      setFormData({ reportType: '', userId: '', date: '', description: '', evidence: '' });
    } catch (error) {
      setStatus({ type: 'error', message: 'Произошла ошибка при отправке жалобы. Пожалуйста, попробуйте позже.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PageContainer theme={currentTheme}>
      <SpaceBackground theme={currentTheme} />
      <Content>
        <Title theme={currentTheme}>Сообщить о проблеме</Title>

        <Section theme={currentTheme}>
          <h2><FaFlag /> Форма жалобы</h2>
          <p>
            Если вы столкнулись с нарушением правил сервиса или неприемлемым поведением,
            пожалуйста, заполните форму ниже. Мы рассмотрим вашу жалобу в кратчайшие сроки.
          </p>

          <InfoBox>
            <FaUserShield />
            <p>
              Вся предоставленная информация конфиденциальна и будет использована только
              для расследования инцидента.
            </p>
          </InfoBox>

          <Form onSubmit={handleSubmit}>
            <FormGroup>
              <Label htmlFor="reportType" theme={currentTheme}>Тип нарушения</Label>
              <Select
                id="reportType"
                name="reportType"
                value={formData.reportType}
                onChange={handleChange}
                required
                theme={currentTheme}
              >
                <option value="">Выберите тип нарушения</option>
                <option value="harassment">Оскорбления и домогательства</option>
                <option value="inappropriate">Неприемлемый контент</option>
                <option value="spam">Спам и реклама</option>
                <option value="technical">Технические проблемы</option>
                <option value="other">Другое</option>
              </Select>
            </FormGroup>

            <FormGroup>
              <Label htmlFor="userId" theme={currentTheme}>ID пользователя (если известно)</Label>
              <Input
                type="text"
                id="userId"
                name="userId"
                value={formData.userId}
                onChange={handleChange}
                placeholder="Введите ID пользователя"
                theme={currentTheme}
              />
            </FormGroup>

            <FormGroup>
              <Label htmlFor="date" theme={currentTheme}>Дата инцидента</Label>
              <Input
                type="date"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
                theme={currentTheme}
              />
            </FormGroup>

            <FormGroup>
              <Label htmlFor="description" theme={currentTheme}>Описание проблемы</Label>
              <TextArea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Подробно опишите ситуацию"
                required
                theme={currentTheme}
              />
            </FormGroup>

            <FormGroup>
              <Label htmlFor="evidence" theme={currentTheme}>Доказательства (ссылки на скриншоты)</Label>
              <TextArea
                id="evidence"
                name="evidence"
                value={formData.evidence}
                onChange={handleChange}
                placeholder="Укажите ссылки на скриншоты или другие доказательства"
                theme={currentTheme}
              />
            </FormGroup>

            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>Отправка...</>
              ) : (
                <>
                  <FaFlag />
                  Отправить жалобу
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

export default Report; 