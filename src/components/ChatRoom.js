import React, { useState, useRef, useEffect } from 'react';
import { 
  BsMicFill, 
  BsMicMuteFill, 
  BsCameraVideoFill, 
  BsCameraVideoOffFill,
  BsArrowRepeat,
  BsGearFill,
  BsBarChartLineFill,
  BsCameraVideo,
  BsMic,
  BsStars,
  BsQuestionCircle,
  BsChevronDown,
  BsMouseFill,
  BsPlayFill,
  BsSend
} from 'react-icons/bs';
import './ChatRoom.css';

function ChatRoom() {
  const [isConnected, setIsConnected] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [localStream, setLocalStream] = useState(null);
  const [chatMode, setChatMode] = useState('video');
  const [showModeMenu, setShowModeMenu] = useState(false);
  const [showSettingsMenu, setShowSettingsMenu] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [showStatsModal, setShowStatsModal] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState('');
  
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const chatMessagesRef = useRef(null);

  useEffect(() => {
    const initializeMedia = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: chatMode === 'video', 
          audio: true 
        });
        setLocalStream(stream);
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error('Ошибка доступа к камере или микрофону:', error);
      }
    };

    initializeMedia();

    return () => {
      if (localStream) {
        localStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [chatMode]);

  useEffect(() => {
    if (chatMessagesRef.current) {
      chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight;
    }
  }, [messages]);

  const startChat = () => {
    setIsSearching(true);
    setIsConnected(true);
  };

  const stopSearch = () => {
    setIsSearching(false);
    setIsConnected(false);
  };

  const nextPartner = () => {
    setIsConnected(false);
    startChat();
  };

  const toggleMic = () => {
    if (localStream) {
      const audioTrack = localStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsMuted(!audioTrack.enabled);
      }
    }
  };

  const toggleVideo = () => {
    if (localStream) {
      const videoTrack = localStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoOff(!videoTrack.enabled);
      }
    }
  };

  const changeChatMode = (mode) => {
    setChatMode(mode);
  };

  const sendMessage = () => {
    if (messageInput.trim()) {
      setMessages([...messages, { text: messageInput, type: 'sent' }]);
      setMessageInput('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="chat-room">
      <div className="video-grid">
        <div className="remote-container">
          <div className="remote-video">
            {!isSearching && !isConnected && (
              <div className="start-screen">
                <div className="bouncing-logo" data-text="RULETKA.TOP">
                  <span>RULETKA</span><span>.</span><span>TOP</span>
                </div>
              </div>
            )}
            {isSearching && (
              <div className="waiting-message">
                Ожидание собеседника...
              </div>
            )}
            <video
              ref={remoteVideoRef}
              autoPlay
              playsInline
              className="video-element"
            />
          </div>
          <div className="remote-controls">
            <div className="mode-toggle-panel">
              <div className="mode-toggle" data-mode={chatMode}>
                <button 
                  className={chatMode === 'video' ? 'active' : ''}
                  onClick={() => changeChatMode('video')}
                >
                  <BsCameraVideo /> Видео
                </button>
                <button 
                  className={chatMode === 'audio' ? 'active' : ''}
                  onClick={() => changeChatMode('audio')}
                >
                  <BsMic /> Аудио
                </button>
              </div>
            </div>
            <div className="control-buttons">
              {!isConnected && !isSearching ? (
                <button className="control-button-large start" onClick={startChat}>
                  <BsPlayFill /> Рулетим
                </button>
              ) : (
                <>
                  <button className="control-button-large next" onClick={nextPartner}>
                    <BsArrowRepeat /> Следующий
                  </button>
                  <button className="control-button-large stop" onClick={stopSearch}>
                    Стоп
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
        <div className="local-container">
          <div className="local-video">
            <video
              ref={localVideoRef}
              autoPlay
              muted
              playsInline
              className="video-element"
            />
            <div className="local-controls">
              <button 
                className={`control-button ${isMuted ? 'danger active' : ''}`}
                onClick={toggleMic}
                data-tooltip={isMuted ? 'Включить микрофон' : 'Выключить микрофон'}
              >
                {isMuted ? <BsMicMuteFill /> : <BsMicFill />}
              </button>
              {chatMode === 'video' && (
                <button 
                  className={`control-button ${isVideoOff ? 'danger active' : ''}`}
                  onClick={toggleVideo}
                  data-tooltip={isVideoOff ? 'Включить камеру' : 'Выключить камеру'}
                >
                  {isVideoOff ? <BsCameraVideoOffFill /> : <BsCameraVideoFill />}
                </button>
              )}
            </div>
          </div>
          <div className="chat-container">
            <div className="chat-messages" ref={chatMessagesRef}>
              {messages.map((message, index) => (
                <div key={index} className={`message ${message.type}`}>
                  {message.text}
                </div>
              ))}
            </div>
            <div className="chat-input-container">
              <input
                type="text"
                className="chat-input"
                placeholder="Написать сообщение..."
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                onKeyPress={handleKeyPress}
              />
              <button className="send-button" onClick={sendMessage}>
                <BsSend />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="bottom-menus">
        <button className="menu-item settings-button" onClick={() => setShowSettingsModal(true)}>
          <BsGearFill /> Настройки
        </button>
        <button className="menu-item premium-button" onClick={() => setShowPremiumModal(true)}>
          <BsStars /> Премиум
        </button>
        <button className="menu-item stats-button" onClick={() => setShowStatsModal(true)}>
          <BsBarChartLineFill /> Статистика
        </button>
        <button className="menu-item help-button" onClick={() => setShowHelpModal(true)}>
          <BsQuestionCircle /> Помощь
        </button>
      </div>

      {showSettingsModal && (
        <div className="modal-overlay" onClick={() => setShowSettingsModal(false)}>
          <div className="modal settings-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2><BsGearFill /> Настройки</h2>
              <button className="close-button" onClick={() => setShowSettingsModal(false)}>×</button>
            </div>
            <div className="modal-content">
              <div className="settings-section">
                <h3>Видео</h3>
                <div className="setting-item">
                  <label>Камера</label>
                  <select>
                    <option>Веб-камера по умолчанию</option>
                  </select>
                </div>
                <div className="setting-item">
                  <label>Качество</label>
                  <select>
                    <option>Высокое (HD)</option>
                    <option>Среднее</option>
                    <option>Низкое</option>
                  </select>
                </div>
              </div>
              <div className="settings-section">
                <h3>Аудио</h3>
                <div className="setting-item">
                  <label>Микрофон</label>
                  <select>
                    <option>Микрофон по умолчанию</option>
                  </select>
                </div>
                <div className="setting-item">
                  <label>Динамики</label>
                  <select>
                    <option>Динамики по умолчанию</option>
                  </select>
                </div>
              </div>
              <div className="settings-section">
                <h3>Интерфейс</h3>
                <div className="setting-item">
                  <label>Тема</label>
                  <select>
                    <option>Тёмная</option>
                    <option>Светлая</option>
                  </select>
                </div>
                <div className="setting-item">
                  <label>Анимации</label>
                  <div className="toggle-switch">
                    <input type="checkbox" id="animations" defaultChecked />
                    <label htmlFor="animations"></label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {showPremiumModal && (
        <div className="modal-overlay" onClick={() => setShowPremiumModal(false)}>
          <div className="modal premium-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header premium">
              <h2><BsStars /> Премиум</h2>
              <button className="close-button" onClick={() => setShowPremiumModal(false)}>×</button>
            </div>
            <div className="modal-content">
              <div className="premium-features">
                <div className="premium-feature">
                  <BsStars className="feature-icon" />
                  <h3>Без рекламы</h3>
                  <p>Общайтесь без перерывов на рекламу</p>
                </div>
                <div className="premium-feature">
                  <BsStars className="feature-icon" />
                  <h3>HD качество</h3>
                  <p>Видео в высоком качестве</p>
                </div>
                <div className="premium-feature">
                  <BsStars className="feature-icon" />
                  <h3>Фильтры поиска</h3>
                  <p>Выбирайте собеседников по интересам</p>
                </div>
              </div>
              <button className="modal-premium-button">Получить премиум</button>
            </div>
          </div>
        </div>
      )}

      {showStatsModal && (
        <div className="modal-overlay" onClick={() => setShowStatsModal(false)}>
          <div className="modal stats-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header stats">
              <h2><BsBarChartLineFill /> Статистика</h2>
              <button className="close-button" onClick={() => setShowStatsModal(false)}>×</button>
            </div>
            <div className="modal-content">
              <div className="stats-grid">
                <div className="stat-item">
                  <h3>Общее время</h3>
                  <div className="stat-value">2ч 30м</div>
                </div>
                <div className="stat-item">
                  <h3>Чатов</h3>
                  <div className="stat-value">42</div>
                </div>
                <div className="stat-item">
                  <h3>Среднее время</h3>
                  <div className="stat-value">3.5м</div>
                </div>
                <div className="stat-item">
                  <h3>Рейтинг</h3>
                  <div className="stat-value">4.8</div>
                </div>
              </div>
              <div className="stats-chart">
                {/* Здесь можно добавить график активности */}
              </div>
            </div>
          </div>
        </div>
      )}

      {showHelpModal && (
        <div className="modal-overlay" onClick={() => setShowHelpModal(false)}>
          <div className="modal help-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header help">
              <h2><BsQuestionCircle /> Помощь</h2>
              <button className="close-button" onClick={() => setShowHelpModal(false)}>×</button>
            </div>
            <div className="modal-content">
              <div className="help-sections">
                <div className="help-section">
                  <h3>Начало работы</h3>
                  <ul>
                    <li>Разрешите доступ к камере и микрофону</li>
                    <li>Нажмите "Рулетим" для поиска собеседника</li>
                    <li>Используйте "Следующий" для смены собеседника</li>
                  </ul>
                </div>
                <div className="help-section">
                  <h3>Управление</h3>
                  <ul>
                    <li>Включение/выключение камеры</li>
                    <li>Включение/выключение микрофона</li>
                    <li>Переключение режимов видео/аудио</li>
                  </ul>
                </div>
                <div className="help-section">
                  <h3>Правила</h3>
                  <ul>
                    <li>Будьте вежливы с собеседниками</li>
                    <li>Не используйте нецензурную лексику</li>
                    <li>Не нарушайте законы и правила сервиса</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ChatRoom; 