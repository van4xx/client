import React, { useState, useEffect, useRef } from 'react';
import './StreamCreate.css';
import {
  BsCameraVideoFill,
  BsMicFill,
  BsGearFill,
  BsBoxArrowUp,
  BsXCircleFill,
  BsTagsFill,
  BsGrid,
  BsChatTextFill,
  BsEyeFill,
  BsHeartFill,
  BsCheckCircleFill
} from 'react-icons/bs';

function StreamCreate({ onClose }) {
  const [streamSettings, setStreamSettings] = useState({
    title: '',
    category: '',
    tags: [],
    description: ''
  });

  const [isLive, setIsLive] = useState(false);
  const [showChat, setShowChat] = useState(true);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [streamStats, setStreamStats] = useState({
    viewers: 0,
    likes: 0,
    duration: '00:00:00'
  });

  const videoRef = useRef(null);
  const mediaStreamRef = useRef(null);

  useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, []);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });
      mediaStreamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
    }
  };

  const stopCamera = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
    }
  };

  const handleStartStream = () => {
    if (!streamSettings.title || !streamSettings.category) {
      alert('Пожалуйста, заполните название и категорию трансляции');
      return;
    }
    setIsLive(true);
    // Здесь будет логика подключения к стриминговому серверу
  };

  const handleStopStream = () => {
    setIsLive(false);
    // Здесь будет логика отключения от стримингового сервера
  };

  const handleSettingsChange = (e) => {
    const { name, value } = e.target;
    setStreamSettings(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddTag = (e) => {
    if (e.key === 'Enter' && e.target.value.trim()) {
      setStreamSettings(prev => ({
        ...prev,
        tags: [...prev.tags, e.target.value.trim()]
      }));
      e.target.value = '';
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setStreamSettings(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim()) {
      setMessages(prev => [...prev, {
        id: Date.now(),
        user: 'Стример',
        text: newMessage,
        time: new Date().toLocaleTimeString()
      }]);
      setNewMessage('');
    }
  };

  return (
    <div className="stream-create">
      <div className="stream-preview">
        <video ref={videoRef} autoPlay muted className="preview-video" />
        <div className="preview-overlay">
          <div className="preview-header">
            <h2>{streamSettings.title || 'Новая трансляция'}</h2>
            <button className="close-button" onClick={onClose}>
              <BsXCircleFill />
            </button>
          </div>
          <div className="preview-controls">
            <div className="control-buttons">
              <button className="control-button">
                <BsCameraVideoFill />
              </button>
              <button className="control-button">
                <BsMicFill />
              </button>
              <button className="control-button">
                <BsGearFill />
              </button>
            </div>
            {!isLive ? (
              <button className="start-stream-button" onClick={handleStartStream}>
                <BsBoxArrowUp /> Начать трансляцию
              </button>
            ) : (
              <button className="stop-stream-button" onClick={handleStopStream}>
                <BsXCircleFill /> Остановить
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="stream-setup">
        <div className="setup-form">
          <div className="form-group">
            <label>Название трансляции</label>
            <input
              type="text"
              name="title"
              value={streamSettings.title}
              onChange={handleSettingsChange}
              placeholder="Введите название трансляции"
            />
          </div>

          <div className="form-group">
            <label>Категория</label>
            <select
              name="category"
              value={streamSettings.category}
              onChange={handleSettingsChange}
            >
              <option value="">Выберите категорию</option>
              <option value="education">Образование</option>
              <option value="gaming">Игры</option>
              <option value="professional">Профессии</option>
              <option value="entertainment">Развлечения</option>
              <option value="creative">Творчество</option>
            </select>
          </div>

          <div className="form-group">
            <label>Теги</label>
            <div className="tags-input">
              <input
                type="text"
                placeholder="Добавьте теги (Enter)"
                onKeyPress={handleAddTag}
              />
              <div className="tags-list">
                {streamSettings.tags.map(tag => (
                  <span key={tag} className="tag">
                    {tag}
                    <button onClick={() => handleRemoveTag(tag)}>×</button>
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="form-group">
            <label>Описание</label>
            <textarea
              name="description"
              value={streamSettings.description}
              onChange={handleSettingsChange}
              placeholder="Добавьте описание трансляции"
            />
          </div>
        </div>

        {isLive && (
          <div className="stream-stats">
            <div className="stat-item">
              <BsEyeFill /> {streamStats.viewers} зрителей
            </div>
            <div className="stat-item">
              <BsHeartFill /> {streamStats.likes} лайков
            </div>
            <div className="stat-item">
              <BsCheckCircleFill /> {streamStats.duration}
            </div>
          </div>
        )}
      </div>

      {isLive && showChat && (
        <div className="stream-chat">
          <div className="chat-header">
            <h3><BsChatTextFill /> Чат трансляции</h3>
            <button onClick={() => setShowChat(false)} className="close-chat">
              <BsXCircleFill />
            </button>
          </div>
          <div className="chat-messages">
            {messages.map(message => (
              <div key={message.id} className="chat-message">
                <span className="message-user">{message.user}</span>
                <span className="message-time">{message.time}</span>
                <div className="message-text">{message.text}</div>
              </div>
            ))}
          </div>
          <form className="chat-input" onSubmit={handleSendMessage}>
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Написать сообщение..."
            />
            <button type="submit" className="send-button">
              <BsBoxArrowUp />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export default StreamCreate; 