import React, { useState } from 'react';
import styled from 'styled-components';
import SpaceBackground from './SpaceBackground';
import { FaExclamationTriangle, FaShieldAlt, FaExclamationCircle } from 'react-icons/fa';

const ReportContainer = styled.div`
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

const Text = styled.p`
  font-size: 1.1rem;
  line-height: 1.6;
  margin-bottom: 1rem;
  color: ${props => props.theme === 'day' ? '#1a237e' : 'rgba(255, 255, 255, 0.9)'};
`;

const ReportForm = styled.form`
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
  color: ${props => props.theme === 'day' ? '#1a237e' : '#fff'};
`;

const Input = styled.input`
  padding: 0.8rem;
  border-radius: 8px;
  border: 1px solid ${props => props.theme === 'day' 
    ? 'rgba(26, 35, 126, 0.2)' 
    : 'rgba(255, 255, 255, 0.1)'};
  background: ${props => props.theme === 'day' 
    ? '#fff' 
    : 'rgba(0, 0, 0, 0.3)'};
  color: ${props => props.theme === 'day' ? '#1a237e' : '#fff'};
  font-size: 1rem;

  &:focus {
    outline: none;
    border-color: ${props => props.theme === 'day' ? '#1a237e' : '#64ffda'};
    box-shadow: 0 0 0 2px ${props => props.theme === 'day' 
      ? 'rgba(26, 35, 126, 0.2)' 
      : 'rgba(100, 255, 218, 0.2)'};
  }
`;

const TextArea = styled.textarea`
  padding: 0.8rem;
  border-radius: 8px;
  border: 1px solid ${props => props.theme === 'day' 
    ? 'rgba(26, 35, 126, 0.2)' 
    : 'rgba(255, 255, 255, 0.1)'};
  background: ${props => props.theme === 'day' 
    ? '#fff' 
    : 'rgba(0, 0, 0, 0.3)'};
  color: ${props => props.theme === 'day' ? '#1a237e' : '#fff'};
  font-size: 1rem;
  min-height: 150px;
  resize: vertical;

  &:focus {
    outline: none;
    border-color: ${props => props.theme === 'day' ? '#1a237e' : '#64ffda'};
    box-shadow: 0 0 0 2px ${props => props.theme === 'day' 
      ? 'rgba(26, 35, 126, 0.2)' 
      : 'rgba(100, 255, 218, 0.2)'};
  }
`;

const Select = styled.select`
  padding: 0.8rem;
  border-radius: 8px;
  border: 1px solid ${props => props.theme === 'day' 
    ? 'rgba(26, 35, 126, 0.2)' 
    : 'rgba(255, 255, 255, 0.1)'};
  background: ${props => props.theme === 'day' 
    ? '#fff' 
    : 'rgba(0, 0, 0, 0.3)'};
  color: ${props => props.theme === 'day' ? '#1a237e' : '#fff'};
  font-size: 1rem;

  &:focus {
    outline: none;
    border-color: ${props => props.theme === 'day' ? '#1a237e' : '#64ffda'};
    box-shadow: 0 0 0 2px ${props => props.theme === 'day' 
      ? 'rgba(26, 35, 126, 0.2)' 
      : 'rgba(100, 255, 218, 0.2)'};
  }
`;

const Button = styled.button`
  padding: 1rem 2rem;
  border-radius: 8px;
  border: none;
  background: ${props => props.theme === 'day'
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

const Guidelines = styled.div`
  margin-top: 2rem;
  padding: 1.5rem;
  background: ${props => props.theme === 'day' 
    ? 'rgba(255, 255, 255, 0.95)' 
    : 'rgba(0, 0, 0, 0.4)'};
  border-radius: 15px;
  border-left: 4px solid ${props => props.theme === 'day' ? '#1a237e' : '#64ffda'};
`;

const GuidelineTitle = styled.h3`
  font-size: 1.2rem;
  margin-bottom: 1rem;
  color: ${props => props.theme === 'day' ? '#1a237e' : '#fff'};
  display: flex;
  align-items: center;
  gap: 0.5rem;

  svg {
    color: ${props => props.theme === 'day' ? '#1a237e' : '#64ffda'};
  }
`;

const Report = ({ currentTheme }) => {
  const [formData, setFormData] = useState({
    type: '',
    userId: '',
    description: '',
    evidence: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.type) {
      newErrors.type = 'Выберите тип нарушения';
    }
    if (!formData.userId.trim()) {
      newErrors.userId = 'Укажите ID пользователя';
    }
    if (!formData.description.trim()) {
      newErrors.description = 'Опишите нарушение';
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
      type: '',
      userId: '',
      description: '',
      evidence: ''
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
    <ReportContainer>
      <SpaceBackground theme={currentTheme} />
      <Content theme={currentTheme}>
        <Title theme={currentTheme}>Сообщить о нарушении</Title>

        <Section theme={currentTheme}>
          <Text theme={currentTheme}>
            Если вы столкнулись с нарушением правил сообщества или неприемлемым поведением, 
            пожалуйста, заполните форму ниже. Мы рассмотрим ваше обращение в кратчайшие сроки.
          </Text>

          <ReportForm onSubmit={handleSubmit}>
            <FormGroup>
              <Label theme={currentTheme}>Тип нарушения</Label>
              <Select
                theme={currentTheme}
                name="type"
                value={formData.type}
                onChange={handleChange}
              >
                <option value="">Выберите тип нарушения</option>
                <option value="harassment">Домогательство</option>
                <option value="hate_speech">Язык вражды</option>
                <option value="inappropriate">Неприемлемый контент</option>
                <option value="spam">Спам</option>
                <option value="other">Другое</option>
              </Select>
              {errors.type && (
                <ErrorMessage>
                  <FaExclamationCircle />
                  {errors.type}
                </ErrorMessage>
              )}
            </FormGroup>

            <FormGroup>
              <Label theme={currentTheme}>ID пользователя</Label>
              <Input
                theme={currentTheme}
                type="text"
                name="userId"
                value={formData.userId}
                onChange={handleChange}
                placeholder="Введите ID пользователя"
              />
              {errors.userId && (
                <ErrorMessage>
                  <FaExclamationCircle />
                  {errors.userId}
                </ErrorMessage>
              )}
            </FormGroup>

            <FormGroup>
              <Label theme={currentTheme}>Описание нарушения</Label>
              <TextArea
                theme={currentTheme}
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Подробно опишите ситуацию"
              />
              {errors.description && (
                <ErrorMessage>
                  <FaExclamationCircle />
                  {errors.description}
                </ErrorMessage>
              )}
            </FormGroup>

            <FormGroup>
              <Label theme={currentTheme}>Доказательства (опционально)</Label>
              <TextArea
                theme={currentTheme}
                name="evidence"
                value={formData.evidence}
                onChange={handleChange}
                placeholder="Укажите ссылки на скриншоты или другие доказательства"
              />
            </FormGroup>

            <Button 
              theme={currentTheme}
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Отправка...' : 'Отправить жалобу'}
            </Button>
          </ReportForm>
        </Section>

        <Guidelines theme={currentTheme}>
          <GuidelineTitle theme={currentTheme}>
            <FaShieldAlt />
            Рекомендации по подаче жалобы
          </GuidelineTitle>
          <Text theme={currentTheme}>
            1. Предоставьте точную информацию о нарушении
          </Text>
          <Text theme={currentTheme}>
            2. Укажите правильный ID пользователя
          </Text>
          <Text theme={currentTheme}>
            3. Опишите ситуацию максимально подробно
          </Text>
          <Text theme={currentTheme}>
            4. По возможности приложите доказательства
          </Text>
        </Guidelines>

        <Guidelines theme={currentTheme}>
          <GuidelineTitle theme={currentTheme}>
            <FaExclamationTriangle />
            Важно помнить
          </GuidelineTitle>
          <Text theme={currentTheme}>
            • Ложные жалобы могут привести к ограничению доступа к сервису
          </Text>
          <Text theme={currentTheme}>
            • Мы рассматриваем каждую жалобу индивидуально
          </Text>
          <Text theme={currentTheme}>
            • В серьезных случаях мы можем передать информацию правоохранительным органам
          </Text>
        </Guidelines>
      </Content>
    </ReportContainer>
  );
};

export default Report;