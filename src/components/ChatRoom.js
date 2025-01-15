import React, { useState, useRef, useEffect } from 'react';
import { IoMdSend, IoMdClose } from 'react-icons/io';
import { IoIosChatbubbles } from 'react-icons/io';
import { 
  BsMicFill, 
  BsMicMuteFill, 
  BsCameraVideoFill, 
  BsCameraVideoOffFill,
  BsEmojiSmile,
  BsImage
} from 'react-icons/bs';
import { FaMoon, FaSun } from 'react-icons/fa';
import { useTheme } from '../context/ThemeContext';
import EmojiPicker from 'emoji-picker-react';
import './ChatRoom.css';
import webRTCService from '../services/WebRTCService';

function ChatRoom() {
  const [isConnected, setIsConnected] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [unreadMessages, setUnreadMessages] = useState(0);
  const [hasPermissions, setHasPermissions] = useState(false);

  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const fileInputRef = useRef(null);
  const { theme, toggleTheme } = useTheme();

  // Инициализация WebRTC и запрос разрешений
  useEffect(() => {
    const init = async () => {
      try {
        await webRTCService.initialize();
        const { localStream } = await webRTCService.createLocalTracks();
        
        if (localVideoRef.current && localStream) {
          localVideoRef.current.srcObject = localStream;
          setHasPermissions(true);
        }

        webRTCService.setOnRemoteStream((stream) => {
          if (remoteVideoRef.current) {
            remoteVideoRef.current.srcObject = stream;
            if (stream) {
              setIsConnected(true);
              setIsSearching(false);
            } else {
              setIsConnected(false);
              setIsSearching(false);
            }
          }
        });
      } catch (error) {
        console.error('Failed to initialize:', error);
        alert('Для работы приложения необходим доступ к камере и микрофону');
      }
    };

    init();

    return () => {
      if (isConnected) {
        webRTCService.leaveRoom();
      }
    };
  }, []);

  // Поиск собеседника
  const startChat = async () => {
    if (!hasPermissions) {
      alert('Необходимо разрешить доступ к камере и микрофону');
      return;
    }

    try {
      setIsSearching(true);
      const result = await webRTCService.searchPartner();
      console.log('Search result:', result);

      if (result.type === 'matched') {
        console.log('Matched, waiting for connection...');
      } else if (result.type === 'waiting') {
        console.log('Waiting for partner...');
      } else {
        setIsSearching(false);
        alert('Неизвестный ответ от сервера');
      }
    } catch (error) {
      console.error('Failed to start chat:', error);
      setIsSearching(false);
      alert('Ошибка подключения к серверу. Пожалуйста, проверьте интернет-соединение');
    }
  };

  // Отключение от чата
  const disconnectChat = async () => {
    try {
      await webRTCService.leaveRoom();
      setIsConnected(false);
      setIsSearching(false);
      setMessages([]);
      
      // Очищаем видео
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = null;
      }
    } catch (error) {
      console.error('Failed to disconnect:', error);
    }
  };

  // Переключение микрофона
  const toggleMic = () => {
    webRTCService.toggleAudio(!isMuted);
    setIsMuted(!isMuted);
  };

  // Переключение камеры
  const toggleVideo = () => {
    webRTCService.toggleVideo(!isVideoOff);
    setIsVideoOff(!isVideoOff);
  };

  // Отправка сообщения
  const sendMessage = (e) => {
    e.preventDefault();
    if (inputMessage.trim() && isConnected) {
      setMessages(prev => [...prev, { text: inputMessage, sender: 'me' }]);
      setInputMessage('');
    }
  };

  // Обработчик эмодзи
  const onEmojiClick = (emojiData) => {
    setInputMessage(prev => prev + emojiData.emoji);
    setShowEmojiPicker(false);
  };

  // Обработчик загрузки изображений
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      // Здесь можно добавить логику загрузки изображений
      console.log('Image upload functionality to be implemented');
    }
  };

  return (
    <div className={`chat-room ${theme}`}>
      <div className="video-grid">
        <div className="video-box">
          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            className="video-element"
          />
          {!isConnected && (
            <div className="search-overlay">
              <div className="ufo-container">
                <div className="ufo">
                  <div className="alien"></div>
                </div>
              </div>
              <div className="search-message">
                <h3>{isSearching ? 'Поиск собеседника...' : 'Готовы к общению?'}</h3>
                <p>{isSearching ? 'Инопланетяне ищут вам собеседника' : 'Нажмите "Рулетим" чтобы начать'}</p>
              </div>
            </div>
          )}
        </div>
        <div className="video-box">
          <video 
            ref={localVideoRef}
            autoPlay
            playsInline
            muted
            className="video-element"
          />
        </div>
      </div>

      <div className="controls-section">
        <div className="controls-buttons">
          {!isConnected ? (
            <button 
              className="start-chat"
              onClick={startChat}
              disabled={isSearching}
            >
              {isSearching ? 'Поиск собеседника...' : 'Рулетим'}
            </button>
          ) : (
            <button 
              className="cancel-search"
              onClick={disconnectChat}
            >
              Отключиться
            </button>
          )}
        </div>

        <div className="controls-menu">
          <button className="menu-button" onClick={toggleMic}>
            {isMuted ? <BsMicMuteFill size={20} /> : <BsMicFill size={20} />}
          </button>
          <button className="menu-button" onClick={toggleVideo}>
            {isVideoOff ? <BsCameraVideoOffFill size={20} /> : <BsCameraVideoFill size={20} />}
          </button>
          <button className="menu-button" onClick={toggleTheme}>
            {theme === 'dark' ? <FaSun size={20} /> : <FaMoon size={20} />}
          </button>
        </div>
      </div>

      <button className="chat-toggle" onClick={() => {
        setIsChatOpen(!isChatOpen);
        if (!isChatOpen) setUnreadMessages(0);
      }}>
        {unreadMessages > 0 && (
          <div className="unread-badge">{unreadMessages}</div>
        )}
        {isChatOpen ? <IoMdClose size={24} /> : <IoIosChatbubbles size={24} />}
      </button>

      <div className={`chat-section ${isChatOpen ? 'open' : ''}`}>
        <div className="chat-messages">
          {messages.map((msg, index) => (
            <div key={index} className={`message ${msg.sender}`}>
              <div className="message-content">{msg.text}</div>
            </div>
          ))}
        </div>

        <form onSubmit={sendMessage} className="chat-input">
          <div className="chat-input-buttons">
            <button 
              type="button" 
              className="input-button"
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            >
              <BsEmojiSmile size={20} />
            </button>
            <button 
              type="button" 
              className="input-button"
              onClick={() => fileInputRef.current.click()}
            >
              <BsImage size={20} />
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageUpload}
              accept="image/*"
              style={{ display: 'none' }}
            />
          </div>

          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Введите сообщение..."
            disabled={!isConnected}
          />
          <button type="submit" disabled={!isConnected}>
            <IoMdSend size={20} />
          </button>

          {showEmojiPicker && (
            <div className="emoji-picker-container">
              <EmojiPicker
                onEmojiClick={onEmojiClick}
                width={300}
                height={400}
                theme={theme}
                searchPlaceHolder="Поиск эмодзи..."
                previewConfig={{
                  showPreview: false
                }}
              />
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

export default ChatRoom; 