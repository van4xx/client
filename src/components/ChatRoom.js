import React, { useState, useRef, useEffect } from 'react';
import { io } from 'socket.io-client';
import Peer from 'simple-peer';
import { IoMdSend } from 'react-icons/io';
import { 
  BsMicFill, 
  BsMicMuteFill, 
  BsCameraVideoFill, 
  BsCameraVideoOffFill,
  BsEmojiSunglasses,
  BsEmojiSmile,
  BsImage
} from 'react-icons/bs';
import { 
  MdScreenShare, 
  MdStopScreenShare, 
  MdNotifications,
  MdPanTool
} from 'react-icons/md';
import { FaMoon, FaSun, FaUser, FaCog, FaChartBar, FaQuestionCircle } from 'react-icons/fa';
import { useTheme } from '../context/ThemeContext';
import './ChatRoom.css';
import EmojiPicker from 'emoji-picker-react';

const SOCKET_URL = process.env.NODE_ENV === 'production' 
  ? 'https://your-production-url.com' 
  : 'http://localhost:5001';

const socket = io(SOCKET_URL);

function ChatRoom() {
  const [isConnected, setIsConnected] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [localStream, setLocalStream] = useState(null);
  const [peer, setPeer] = useState(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [videoHeight, setVideoHeight] = useState(null);
  const videoContainerRef = useRef(null);
  const resizeRef = useRef(null);
  const [roomId, setRoomId] = useState(null);

  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);

  const { theme, toggleTheme } = useTheme();

  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isMaskOn, setIsMaskOn] = useState(false);
  const [handRaised, setHandRaised] = useState(false);
  const [notificationSent, setNotificationSent] = useState(false);

  const [leftVideoHeight, setLeftVideoHeight] = useState(745);
  const [rightVideoHeight, setRightVideoHeight] = useState(745);

  const [showSettings, setShowSettings] = useState(false);

  const [activeModal, setActiveModal] = useState(null);

  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const fileInputRef = useRef(null);

  const Modal = ({ title, onClose, children }) => (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{title}</h3>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        {children}
      </div>
    </div>
  );

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then(stream => {
        setLocalStream(stream);
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
      })
      .catch(err => console.error('Error accessing media devices:', err));

    return () => {
      if (localStream) {
        localStream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const startChat = () => {
    setIsSearching(true);
    socket.emit('startSearch');
  };

  const nextPartner = () => {
    if (peer) {
      peer.destroy();
      setPeer(null);
    }
    setMessages([]);
    socket.emit('nextPartner');
  };

  const toggleMic = () => {
    if (localStream) {
      const audioTrack = localStream.getAudioTracks()[0];
      audioTrack.enabled = !audioTrack.enabled;
      setIsMuted(!isMuted);
    }
  };

  const toggleVideo = () => {
    if (localStream) {
      const videoTrack = localStream.getVideoTracks()[0];
      videoTrack.enabled = !videoTrack.enabled;
      setIsVideoOff(!isVideoOff);
    }
  };

  const sendMessage = (e) => {
    e.preventDefault();
    if (inputMessage.trim() && isConnected) {
      socket.emit('message', { text: inputMessage });
      setMessages(prev => [...prev, { text: inputMessage, sender: 'me' }]);
      setInputMessage('');
    }
  };

  const handleResize = (side, e) => {
    e.preventDefault();
    const startY = e.clientY;
    const startHeight = leftVideoHeight;

    function onMouseMove(e) {
      const currentY = e.clientY;
      const diff = currentY - startY;
      
      const maxHeight = window.innerHeight - 100;
      const minHeight = 400;
      const newHeight = Math.min(maxHeight, Math.max(minHeight, startHeight + diff));

      setLeftVideoHeight(newHeight);
      setRightVideoHeight(newHeight);
    }

    function onMouseUp() {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    }

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  };

  const toggleScreenShare = async () => {
    try {
      if (!isScreenSharing) {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({
          video: true
        });
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = screenStream;
        }
        setIsScreenSharing(true);
      } else {
        if (localStream && localVideoRef.current) {
          localVideoRef.current.srcObject = localStream;
        }
        setIsScreenSharing(false);
      }
    } catch (err) {
      console.error("Ошибка при демонстрации экрана:", err);
    }
  };

  const toggleMask = () => {
    setIsMaskOn(!isMaskOn);
    // Здесь будет логика применения маски
  };

  const toggleHand = () => {
    setHandRaised(!handRaised);
    if (peer && roomId) {
      socket.emit('handRaised', { roomId, raised: !handRaised });
    }
  };

  const sendNotification = () => {
    setNotificationSent(true);
    if (peer && roomId) {
      socket.emit('notification', { roomId });
    }
    setTimeout(() => setNotificationSent(false), 3000);
  };

  const onEmojiClick = (emojiObject) => {
    setInputMessage(prev => prev + emojiObject.emoji);
    setShowEmojiPicker(false);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const imageData = event.target.result;
        // Отправляем изображение в чат
        if (isConnected) {
          socket.emit('message', { 
            type: 'image', 
            data: imageData 
          });
          setMessages(prev => [...prev, { 
            type: 'image', 
            data: imageData, 
            sender: 'me' 
          }]);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const MessageContent = ({ message }) => {
    if (message.type === 'image') {
      return (
        <div className="message-image-container">
          <img src={message.data} alt="Отправленное изображение" />
        </div>
      );
    }
    return message.text;
  };

  return (
    <div className={`chat-room ${theme}`}>
      <div className="video-grid">
        <div 
          className="video-box"
          style={{ height: `${leftVideoHeight}px` }}
        >
          <video ref={remoteVideoRef} autoPlay playsInline />
          <div className="video-label">Собеседник</div>
          {isSearching && (
            <div className="video-searching-overlay">
              <div className="searching-content">
                <div className="searching-text">Ищем собеседника...</div>
                <div className="online-counter">
                  <div className="pulse-dot"></div>
                  Онлайн: 1,234
                </div>
                <div className="searching-spinner">
                  <div className="ufo">
                    <div className="ufo-lights">
                      <div className="ufo-light"></div>
                      <div className="ufo-light"></div>
                      <div className="ufo-light"></div>
                      <div className="ufo-light"></div>
                    </div>
                  </div>
                </div>
                <button 
                  className="cancel-search-btn"
                  onClick={() => {
                    setIsSearching(false);
                    socket.emit('cancelSearch');
                  }}
                >
                  Отменить поиск
                </button>
              </div>
            </div>
          )}
          <div className="resize-handle" onMouseDown={(e) => handleResize('left', e)} />
        </div>
        <div 
          className="video-box"
          style={{ height: `${rightVideoHeight}px` }}
        >
          <video ref={localVideoRef} autoPlay muted playsInline />
          <div className="video-label">Вы</div>
          <div className="video-controls">
            <button 
              onClick={toggleMic} 
              className={isMuted ? 'active' : ''} 
              data-tooltip={isMuted ? 'Включить микрофон' : 'Выключить микрофон'}
            >
              {isMuted ? <BsMicMuteFill size={24} /> : <BsMicFill size={24} />}
            </button>
            <button 
              onClick={toggleVideo} 
              className={isVideoOff ? 'active' : ''} 
              data-tooltip={isVideoOff ? 'Включить камеру' : 'Выключить камеру'}
            >
              {isVideoOff ? <BsCameraVideoOffFill size={24} /> : <BsCameraVideoFill size={24} />}
            </button>
            <button 
              onClick={toggleScreenShare} 
              className={isScreenSharing ? 'active' : ''} 
              data-tooltip={isScreenSharing ? 'Остановить демонстрацию' : 'Демонстрация экрана'}
            >
              {isScreenSharing ? <MdStopScreenShare size={24} /> : <MdScreenShare size={24} />}
            </button>
            <button 
              onClick={toggleMask} 
              className={isMaskOn ? 'active' : ''} 
              data-tooltip={isMaskOn ? 'Убрать маску' : 'Надеть маску'}
            >
              <BsEmojiSunglasses size={24} />
            </button>
            <button 
              onClick={sendNotification} 
              className={notificationSent ? 'active' : ''} 
              data-tooltip="Привлечь внимание"
            >
              <MdNotifications size={24} />
            </button>
            <button 
              onClick={toggleHand} 
              className={handRaised ? 'active' : ''} 
              data-tooltip={handRaised ? 'Опустить руку' : 'Поднять руку'}
            >
              <MdPanTool size={24} />
            </button>
          </div>
          <div className="resize-handle" onMouseDown={(e) => handleResize('right', e)} />
        </div>
      </div>

      <div className="controls-section">
        <div className="controls-buttons">
          {!isConnected && !isSearching && (
            <button onClick={startChat} className="start-chat">
              Рулетим
            </button>
          )}
          {isConnected && (
            <button onClick={nextPartner} className="next-partner">
              Следующий собеседник
            </button>
          )}
        </div>

        <div className="controls-menu">
          <button 
            className="menu-button"
            onClick={() => setActiveModal('settings')}
          >
            <div className="button-content">
              <FaCog className="button-icon" />
              <span>Настройки</span>
            </div>
          </button>

          <button 
            className="menu-button"
            onClick={() => setActiveModal('stats')}
          >
            <div className="button-content">
              <FaChartBar className="button-icon" />
              <span>Статистика</span>
            </div>
          </button>

          <button 
            className="menu-button"
            onClick={() => setActiveModal('help')}
          >
            <div className="button-content">
              <FaQuestionCircle className="button-icon" />
              <span>Помощь</span>
            </div>
          </button>
        </div>

        {activeModal === 'settings' && (
          <Modal title="Настройки" onClose={() => setActiveModal(null)}>
            <div className="settings-content">
              <div className="settings-group">
                <h4>Устройства</h4>
                <select className="settings-select">
                  <option>Выберите камеру</option>
                </select>
                <select className="settings-select">
                  <option>Выберите микрофон</option>
                </select>
                <select className="settings-select">
                  <option>Выберите динамики</option>
                </select>
              </div>

              <div className="settings-group">
                <h4>Качество видео</h4>
                <select className="settings-select">
                  <option value="720">HD (720p)</option>
                  <option value="1080">Full HD (1080p)</option>
                  <option value="480">SD (480p)</option>
                </select>
              </div>

              <div className="settings-group">
                <h4>Внешний вид</h4>
                <label className="theme-switch">
                  <input 
                    type="checkbox" 
                    checked={theme === 'dark'}
                    onChange={toggleTheme}
                  />
                  <span className="switch-slider"></span>
                  <span className="switch-label">Темная тема</span>
                </label>
                <label className="settings-checkbox">
                  <input type="checkbox" />
                  <span>Компактный вид</span>
                </label>
                <label className="settings-checkbox">
                  <input type="checkbox" />
                  <span>Показывать время в чате</span>
                </label>
              </div>

              <div className="settings-group">
                <h4>Приватность</h4>
                <label className="settings-checkbox">
                  <input type="checkbox" />
                  <span>Размытый фон</span>
                </label>
                <label className="settings-checkbox">
                  <input type="checkbox" />
                  <span>Шумоподавление</span>
                </label>
              </div>
            </div>
          </Modal>
        )}

        {activeModal === 'stats' && (
          <Modal title="Статистика" onClose={() => setActiveModal(null)}>
            <div className="stats-content">
              <div className="stats-section">
                <h4>Общая статистика</h4>
                <div className="stats-grid">
                  <div className="stat-card">
                    <div className="stat-value">127</div>
                    <div className="stat-label">Всего чатов</div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-value">45ч</div>
                    <div className="stat-label">Общее время</div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-value">4.8</div>
                    <div className="stat-label">Рейтинг</div>
                  </div>
                </div>
              </div>

              <div className="stats-section">
                <h4>За последние 7 дней</h4>
                <div className="stats-chart">
                  <div className="chart-bar" style={{height: '60%'}}>
                    <div className="chart-tooltip">
                      <div className="tooltip-value">12 чатов</div>
                      <div className="tooltip-stats">
                        <div>Общее время: 2ч 15м</div>
                        <div>Средняя длина: 11м</div>
                      </div>
                    </div>
                    <span>Пн</span>
                  </div>
                  <div className="chart-bar" style={{height: '80%'}}>
                    <div className="chart-tooltip">
                      <div className="tooltip-value">18 чатов</div>
                      <div className="tooltip-stats">
                        <div>Общее время: 3ч 40м</div>
                        <div>Средняя длина: 12м</div>
                      </div>
                    </div>
                    <span>Вт</span>
                  </div>
                  <div className="chart-bar" style={{height: '40%'}}><span>Ср</span></div>
                  <div className="chart-bar" style={{height: '90%'}}><span>Чт</span></div>
                  <div className="chart-bar" style={{height: '70%'}}><span>Пт</span></div>
                  <div className="chart-bar" style={{height: '30%'}}><span>Сб</span></div>
                  <div className="chart-bar" style={{height: '50%'}}><span>Вс</span></div>
                </div>
              </div>
            </div>
          </Modal>
        )}

        {activeModal === 'help' && (
          <Modal title="Помощь" onClose={() => setActiveModal(null)}>
            <div className="help-content">
              <div className="help-section">
                <h4>Горячие клавиши</h4>
                <div className="shortcut-list">
                  <div className="shortcut-item">
                    <span className="key">M</span>
                    <span>Выключить микрофон</span>
                  </div>
                  <div className="shortcut-item">
                    <span className="key">V</span>
                    <span>Выключить видео</span>
                  </div>
                  <div className="shortcut-item">
                    <span className="key">Esc</span>
                    <span>Следующий собеседник</span>
                  </div>
                </div>
              </div>
            </div>
          </Modal>
        )}
      </div>

      <div className="chat-section">
        <div className="chat-messages">
          {messages.map((msg, index) => (
            <div key={index} className={`message ${msg.sender}`}>
              <MessageContent message={msg} />
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
                theme="dark"
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