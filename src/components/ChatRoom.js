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
  BsSend,
  BsDisplay,
  BsEmojiSmile,
  BsBell,
  BsFillCameraVideoFill
} from 'react-icons/bs';
import './ChatRoom.css';
import FaceDetectionService from '../services/FaceDetectionService';
import WebRTCService from '../services/WebRTCService';

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
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [showMasksMenu, setShowMasksMenu] = useState(false);
  const [activeMask, setActiveMask] = useState(null);
  const [screenStream, setScreenStream] = useState(null);
  const [showFaceCheckModal, setShowFaceCheckModal] = useState(true);
  const [faceDetected, setFaceDetected] = useState(false);
  
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
        // Initialize WebRTC with the stream
        const serverUrl = window.location.protocol === 'https:' ? 'https://ruletka.top' : 'http://localhost:5000';
        WebRTCService.init(serverUrl);
        WebRTCService.setStream(stream);
        
        // Set up WebRTC callbacks
        WebRTCService.onStream((remoteStream) => {
          if (remoteVideoRef.current) {
            remoteVideoRef.current.srcObject = remoteStream;
            setIsSearching(false);
          }
        });

        WebRTCService.onChatMessage((message) => {
          setMessages(prev => [...prev, { text: message, type: 'received' }]);
        });

        WebRTCService.onConnectionClosed(() => {
          setIsConnected(false);
          setIsSearching(false);
          if (remoteVideoRef.current) {
            remoteVideoRef.current.srcObject = null;
          }
        });

      } catch (error) {
        console.error('Ошибка доступа к камере или микрофону:', error);
      }
    };

    initializeMedia();

    return () => {
      WebRTCService.disconnect();
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

  useEffect(() => {
    const loadFaceModels = async () => {
      await FaceDetectionService.loadModels();
    };
    loadFaceModels();

    return () => {
      FaceDetectionService.destroy();
    };
  }, []);

  useEffect(() => {
    if (!localVideoRef.current || chatMode !== 'video') return;

    const initialCheck = async () => {
      const hasFace = await FaceDetectionService.detectFace(localVideoRef.current);
      if (hasFace) {
        setFaceDetected(true);
        setShowFaceCheckModal(false);
      } else {
        setFaceDetected(false);
        setShowFaceCheckModal(true);
      }
    };

    // Первая проверка при загрузке
    initialCheck();

    // Проверяем каждые 2 секунды
    const checkInterval = setInterval(async () => {
      const hasFace = await FaceDetectionService.detectFace(localVideoRef.current);
      if (hasFace) {
        setFaceDetected(true);
        setShowFaceCheckModal(false);
        clearInterval(checkInterval); // Останавливаем проверку после успешного обнаружения
      }
    }, 2000);

    return () => clearInterval(checkInterval);
  }, [localVideoRef, chatMode]);

  const startChat = () => {
    setIsSearching(true);
    setIsConnected(true);
    WebRTCService.startSearch(chatMode);
  };

  const stopSearch = () => {
    setIsSearching(false);
    setIsConnected(false);
    WebRTCService.stopSearch();
  };

  const nextPartner = () => {
    setIsConnected(false);
    WebRTCService.nextPartner(chatMode);
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
    if (mode === 'audio') {
      setShowFaceCheckModal(false); // Скрываем модальное окно в аудио режиме
    }
  };

  const sendMessage = () => {
    if (messageInput.trim()) {
      setMessages([...messages, { text: messageInput, type: 'sent' }]);
      WebRTCService.sendMessage(messageInput);
      setMessageInput('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const toggleScreenShare = async () => {
    try {
      if (!isScreenSharing) {
        const stream = await navigator.mediaDevices.getDisplayMedia({
          video: true,
          audio: true
        });
        setScreenStream(stream);
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
        setIsScreenSharing(true);

        stream.getVideoTracks()[0].onended = () => {
          stopScreenSharing();
        };
      } else {
        stopScreenSharing();
      }
    } catch (error) {
      console.error('Ошибка при демонстрации экрана:', error);
    }
  };

  const stopScreenSharing = () => {
    if (screenStream) {
      screenStream.getTracks().forEach(track => track.stop());
    }
    if (localVideoRef.current && localStream) {
      localVideoRef.current.srcObject = localStream;
    }
    setScreenStream(null);
    setIsScreenSharing(false);
  };

  const getAttention = () => {
    console.log('Привлечение внимания');
  };

  const handleMaskClick = async (maskId) => {
    if (activeMask === maskId) {
      FaceDetectionService.removeMask();
      setActiveMask(null);
    } else {
      await FaceDetectionService.applyMask(localVideoRef.current, maskId);
      setActiveMask(maskId);
    }
    setShowMasksMenu(false);
  };

  return (
    <div className="chat-room">
      <div className="video-grid">
        <div className="remote-container">
          <div className="remote-video" data-mode={chatMode}>
            {!isSearching && !isConnected && (
              <div className="start-screen">
                <div className="bouncing-logo" data-text="RULETKA.TOP">
                  <span>RULETKA</span><span>.</span><span>TOP</span>
                </div>
              </div>
            )}
            {isSearching && chatMode === 'video' && (
              <div className="waiting-message">
                <div className="radar-animation">
                  <div className="radar-circle"></div>
                  <div className="radar-circle"></div>
                  <div className="radar-circle"></div>
                  <div className="radar-sweep"></div>
                  <div className="detection-point" style={{top: '30%', left: '70%'}}></div>
                  <div className="detection-point" style={{top: '60%', left: '40%'}}></div>
                  <div className="detection-point" style={{top: '20%', left: '20%'}}></div>
                </div>
                <div className="search-text">
                  <span className="connecting-text">Ищем нового</span>
                  <div className="wave-text">
                    <span>с</span>
                    <span>о</span>
                    <span>б</span>
                    <span>е</span>
                    <span>с</span>
                    <span>е</span>
                    <span>д</span>
                    <span>н</span>
                    <span>и</span>
                    <span>к</span>
                    <span>а</span>
                  </div>
                </div>
              </div>
            )}
            {(chatMode === 'audio' && (isSearching || isConnected)) && (
              <div className="audio-visualization">
                <div className="audio-wave-container">
                  <div className="audio-circle"></div>
                  <div className="audio-bars">
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
                <div className="audio-status">
                  {isSearching ? (
                    <span className="status-text">Ищем интересного собеседника</span>
                  ) : isMuted ? (
                    <span className="status-text warning">Включите микрофон для общения</span>
                  ) : (
                    <span className="status-text success">Идет разговор</span>
                  )}
                </div>
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
                  disabled={isSearching}
                  title={isSearching ? "Нельзя менять режим во время поиска" : ""}
                >
                  <BsCameraVideo /> Видео
                </button>
                <button 
                  className={chatMode === 'audio' ? 'active' : ''}
                  onClick={() => changeChatMode('audio')}
                  disabled={isSearching}
                  title={isSearching ? "Нельзя менять режим во время поиска" : ""}
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
          <div className="local-video" data-mode={chatMode}>
            <video
              ref={localVideoRef}
              autoPlay
              muted
              playsInline
              className="video-element"
            />
            {chatMode === 'audio' && (
              <div className="audio-visualization local">
                <div className="audio-wave-container">
                  <div className="audio-circle"></div>
                  <div className="audio-bars">
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
                <div className="audio-status">
                  {isMuted ? (
                    <span className="status-text warning">🎤 Микрофон отключен</span>
                  ) : (
                    <span className="status-text success">🎵 Ваш голос передается</span>
                  )}
                </div>
              </div>
            )}
            <div className="local-controls">
              <button 
                className={`control-button ${isMuted ? 'danger active' : ''}`}
                onClick={toggleMic}
                data-tooltip={isMuted ? 'Включить микрофон' : 'Выключить микрофон'}
              >
                {isMuted ? <BsMicMuteFill /> : <BsMicFill />}
              </button>
              {chatMode === 'video' && (
                <>
                  <button 
                    className={`control-button ${isVideoOff ? 'danger active' : ''}`}
                    onClick={toggleVideo}
                    data-tooltip={isVideoOff ? 'Включить камеру' : 'Выключить камеру'}
                  >
                    {isVideoOff ? <BsCameraVideoOffFill /> : <BsCameraVideoFill />}
                  </button>
                  <button 
                    className={`control-button ${isScreenSharing ? 'active' : ''}`}
                    onClick={toggleScreenShare}
                    data-tooltip={isScreenSharing ? 'Остановить демонстрацию' : 'Демонстрация экрана'}
                  >
                    <BsDisplay />
                  </button>
                  <button 
                    className={`control-button ${showMasksMenu ? 'active' : ''}`}
                    onClick={() => setShowMasksMenu(!showMasksMenu)}
                    data-tooltip="Маски"
                  >
                    <BsEmojiSmile />
                  </button>
                  <button 
                    className="control-button attention-button"
                    onClick={getAttention}
                    data-tooltip="Привлечь внимание"
                  >
                    <BsBell />
                  </button>
                </>
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

      {showMasksMenu && (
        <div className="masks-menu">
          <div className="mask-item" onClick={() => handleMaskClick('mask1')}>
            Маска 1
          </div>
          <div className="mask-item" onClick={() => handleMaskClick('mask2')}>
            Маска 2
          </div>
          <div className="mask-item" onClick={() => handleMaskClick('mask3')}>
            Маска 3
          </div>
        </div>
      )}

      {showFaceCheckModal && (
        <div className="modal-overlay">
          <div className="modal face-check-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2><BsFillCameraVideoFill /> Проверка камеры</h2>
            </div>
            <div className="face-check-content">
              <div className="face-check-icon">
                <BsFillCameraVideoFill />
              </div>
              <div className="face-check-message">
                Для использования видеочата необходимо показать ваше лицо в камеру
              </div>
              <div className="face-check-hint">
                Убедитесь, что ваше лицо хорошо освещено и находится в кадре
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ChatRoom; 