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
  BsFillCameraVideoFill,
  BsSkipEndFill,
  BsStopFill,
  BsShieldCheck,
  BsPeopleFill,
  BsGlobe
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
  const [videoDevices, setVideoDevices] = useState([]);
  const [audioDevices, setAudioDevices] = useState([]);
  const [audioOutputDevices, setAudioOutputDevices] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState('');
  const [selectedAudio, setSelectedAudio] = useState('');
  const [selectedAudioOutput, setSelectedAudioOutput] = useState('');
  const [audioLevel, setAudioLevel] = useState(0);
  const [autoEnableDevices, setAutoEnableDevices] = useState({ camera: true, microphone: true });
  const [showNotifications, setShowNotifications] = useState(true);
  const [enableSoundEffects, setEnableSoundEffects] = useState(true);
  const [enableAnimations, setEnableAnimations] = useState(true);
  const [blurBackground, setBlurBackground] = useState(false);
  const [noiseReduction, setNoiseReduction] = useState(false);
  const [volume, setVolume] = useState(50);
  const [showTelegramModal, setShowTelegramModal] = useState(false);
  const [telegramUsername, setTelegramUsername] = useState('');
  const [notificationStatus, setNotificationStatus] = useState('');
  const [showAboutModal, setShowAboutModal] = useState(false);
  
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const chatMessagesRef = useRef(null);
  const previewVideoRef = useRef(null);

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

  // Get available devices
  useEffect(() => {
    async function getDevices() {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        
        const videoInputs = devices.filter(device => device.kind === 'videoinput');
        const audioInputs = devices.filter(device => device.kind === 'audioinput');
        const audioOutputs = devices.filter(device => device.kind === 'audiooutput');
        
        setVideoDevices(videoInputs);
        setAudioDevices(audioInputs);
        setAudioOutputDevices(audioOutputs);
        
        // Set default devices
        if (videoInputs.length) setSelectedVideo(videoInputs[0].deviceId);
        if (audioInputs.length) setSelectedAudio(audioInputs[0].deviceId);
        if (audioOutputs.length) setSelectedAudioOutput(audioOutputs[0].deviceId);
      } catch (error) {
        console.error('Error getting devices:', error);
      }
    }
    
    getDevices();
  }, []);

  // Handle device selection
  const handleDeviceChange = async (type, deviceId) => {
    try {
      if (type === 'video') {
        setSelectedVideo(deviceId);
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { deviceId: { exact: deviceId } },
          audio: false
        });
        if (previewVideoRef.current) {
          previewVideoRef.current.srcObject = stream;
        }
      } else if (type === 'audio') {
        setSelectedAudio(deviceId);
        // Update audio stream if needed
      }
    } catch (error) {
      console.error('Error changing device:', error);
    }
  };

  const handleAudioOutputChange = async (deviceId) => {
    try {
      setSelectedAudioOutput(deviceId);
      if (remoteVideoRef.current && remoteVideoRef.current.setSinkId) {
        await remoteVideoRef.current.setSinkId(deviceId);
      }
    } catch (error) {
      console.error('Error changing audio output:', error);
    }
  };

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

  const handleAutoEnableChange = (device) => {
    setAutoEnableDevices(prev => ({ ...prev, [device]: !prev[device] }));
  };

  const handleNotifyClick = () => {
    setShowTelegramModal(true);
  };

  const handleTelegramSubmit = () => {
    if (!telegramUsername.trim()) {
      setNotificationStatus('error');
      return;
    }
    // Здесь будет логика отправки ника на сервер
    setNotificationStatus('success');
    setTimeout(() => {
      setShowTelegramModal(false);
      setTelegramUsername('');
      setNotificationStatus('');
    }, 2000);
  };

  const renderControls = () => {
    return (
      <div className="control-panel">
        <div className="control-buttons">
          <div className="control-buttons-main">
            {!isConnected ? (
              <>
                <button
                  className="control-button-large start"
                  onClick={startChat}
                  disabled={!faceDetected && chatMode === 'video'}
                >
                  <BsPlayFill />
                  <span>Рулетим</span>
                </button>
                <button
                  className="control-button-large settings"
                  onClick={() => setShowSettingsModal(true)}
                >
                  <BsGearFill />
                  <span>Настройки</span>
                </button>
              </>
            ) : (
              <>
                <button
                  className="control-button-large next"
                  onClick={nextPartner}
                >
                  <BsSkipEndFill />
                  <span>Следующий</span>
                </button>
                <button
                  className="control-button-large stop"
                  onClick={stopSearch}
                >
                  <BsStopFill />
                  <span>Стоп</span>
                </button>
              </>
            )}
          </div>
          <div className="control-buttons-secondary">
            <button
              className="control-button-secondary mode"
              onClick={() => changeChatMode(chatMode === 'video' ? 'audio' : 'video')}
              disabled={isSearching}
            >
              {chatMode === 'video' ? <BsCameraVideo /> : <BsMic />}
            </button>
          </div>
        </div>
      </div>
    );
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
            {renderControls()}
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
        <button className="menu-item premium-button" onClick={() => setShowPremiumModal(true)}>
          <BsStars /> Премиум
        </button>
        <button className="menu-item stats-button" onClick={() => setShowStatsModal(true)}>
          <BsBarChartLineFill /> Статистика
        </button>
        <button className="menu-item help-button" onClick={() => setShowHelpModal(true)}>
          <BsQuestionCircle /> Помощь
        </button>
        <button className="menu-item about-button" onClick={() => setShowAboutModal(true)}>
          <BsPeopleFill /> Мы
        </button>
      </div>

      {showSettingsModal && (
        <div className="modal-overlay" onClick={() => setShowSettingsModal(false)}>
          <div className="modal settings-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2><BsGearFill /> Настройки</h2>
              <button className="close-button" onClick={() => setShowSettingsModal(false)}>×</button>
            </div>
            <div className="settings-content">
              <div className="settings-group">
                <h4>
                  <BsCameraVideoFill />
                  Видео
                </h4>
                <h5>Камера</h5>
                <select 
                  className="settings-select"
                  value={selectedVideo}
                  onChange={(e) => handleDeviceChange('video', e.target.value)}
                >
                  {videoDevices.map(device => (
                    <option key={device.deviceId} value={device.deviceId}>
                      {device.label || `Камера ${videoDevices.indexOf(device) + 1}`}
                    </option>
                  ))}
                </select>
                <div className="device-preview">
                  <video 
                    ref={previewVideoRef}
                    autoPlay 
                    playsInline 
                    muted 
                    className="preview-video"
                  />
                </div>
                <div className="settings-options">
                  <label className="settings-checkbox">
                    <input 
                      type="checkbox"
                      checked={autoEnableDevices.camera}
                      onChange={() => handleAutoEnableChange('camera')}
                    />
                    <span>Автоматически включать камеру</span>
                  </label>
                </div>
                <h5>Качество видео</h5>
                <select className="settings-select">
                  <option value="high">Высокое качество (HD)</option>
                  <option value="medium">Среднее качество</option>
                  <option value="low">Низкое качество</option>
                </select>
                <div className="settings-hint">
                  Выберите более низкое качество при медленном интернете
                </div>
              </div>

              <div className="settings-group">
                <h4>
                  <BsMicFill />
                  Аудио
                </h4>
                <h5>Микрофон</h5>
                <select 
                  className="settings-select"
                  value={selectedAudio}
                  onChange={(e) => handleDeviceChange('audio', e.target.value)}
                >
                  {audioDevices.map(device => (
                    <option key={device.deviceId} value={device.deviceId}>
                      {device.label || `Микрофон ${audioDevices.indexOf(device) + 1}`}
                    </option>
                  ))}
                </select>
                <div className="audio-meter">
                  <div className="meter-bar" style={{ width: `${audioLevel}%` }}></div>
                </div>
                <div className="settings-options">
                  <label className="settings-checkbox">
                    <input 
                      type="checkbox"
                      checked={autoEnableDevices.microphone}
                      onChange={() => handleAutoEnableChange('microphone')}
                    />
                    <span>Автоматически включать микрофон</span>
                  </label>
                </div>

                <h5>Динамики</h5>
                <select 
                  className="settings-select"
                  value={selectedAudioOutput}
                  onChange={(e) => handleAudioOutputChange(e.target.value)}
                >
                  {audioOutputDevices.map(device => (
                    <option key={device.deviceId} value={device.deviceId}>
                      {device.label || `Динамики ${audioOutputDevices.indexOf(device) + 1}`}
                    </option>
                  ))}
                </select>
                <div className="volume-control">
                  <span>Громкость</span>
                  <input 
                    type="range" 
                    min="0" 
                    max="100" 
                    value={volume} 
                    onChange={(e) => setVolume(e.target.value)}
                    className="volume-slider"
                  />
                </div>
              </div>

              <div className="settings-group">
                <h4>
                  <BsDisplay />
                  Интерфейс
                </h4>
                <div className="settings-options">
                  <label className="settings-checkbox">
                    <input 
                      type="checkbox"
                      checked={showNotifications}
                      onChange={(e) => setShowNotifications(e.target.checked)}
                    />
                    <span>Показывать уведомления</span>
                  </label>
                  <label className="settings-checkbox">
                    <input 
                      type="checkbox"
                      checked={enableSoundEffects}
                      onChange={(e) => setEnableSoundEffects(e.target.checked)}
                    />
                    <span>Звуковые эффекты</span>
                  </label>
                  <label className="settings-checkbox">
                    <input 
                      type="checkbox"
                      checked={enableAnimations}
                      onChange={(e) => setEnableAnimations(e.target.checked)}
                    />
                    <span>Анимации интерфейса</span>
                  </label>
                </div>
              </div>

              <div className="settings-group">
                <h4>
                  <BsShieldCheck />
                  Приватность
                </h4>
                <div className="settings-options">
                  <label className="settings-checkbox">
                    <input 
                      type="checkbox"
                      checked={blurBackground}
                      onChange={(e) => setBlurBackground(e.target.checked)}
                    />
                    <span>Размытие фона</span>
                  </label>
                  <label className="settings-checkbox">
                    <input 
                      type="checkbox"
                      checked={noiseReduction}
                      onChange={(e) => setNoiseReduction(e.target.checked)}
                    />
                    <span>Шумоподавление</span>
                  </label>
                </div>
                <div className="settings-hint">
                  Эти функции помогут сделать ваше общение более приватным
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {showPremiumModal && (
        <div className="modal-overlay" onClick={() => setShowPremiumModal(false)}>
          <div className="modal premium-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2><BsStars /> Премиум</h2>
              <button className="close-button" onClick={() => setShowPremiumModal(false)}>×</button>
            </div>
            <div className="premium-content">
              <div className="dev-animation">
                <div className="dev-laptop">
                  <div className="dev-screen">
                    <div className="dev-code-lines">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  </div>
                </div>
                <div className="dev-glow"></div>
              </div>
              <div className="premium-message">
                <h3>Наши разработчики усердно работают!</h3>
                <div className="dev-status">
                  <div className="status-indicator">
                    <span className="pulse"></span>
                    <span className="text">Разработка активна</span>
                  </div>
                </div>
                <p className="dev-description">
                  В данный момент наша команда разработчиков создает новые крутые функции, 
                  которые сделают общение еще более интересным и удобным.
                </p>
                <div className="features-coming">
                  <h4>Скоро будут доступны:</h4>
                  <ul className="features-list">
                    <li>
                      <BsStars className="feature-icon" />
                      <span>Маски и фильтры для видео</span>
                    </li>
                    <li>
                      <BsStars className="feature-icon" />
                      <span>Запись и сохранение чатов</span>
                    </li>
                    <li>
                      <BsStars className="feature-icon" />
                      <span>Расширенные настройки поиска</span>
                    </li>
                    <li>
                      <BsStars className="feature-icon" />
                      <span>И много других интересных функций!</span>
                    </li>
                  </ul>
                </div>
                <div className="premium-footer">
                  <p className="stay-tuned">Следите за обновлениями!</p>
                  <button className="notify-button" onClick={handleNotifyClick}>
                    <BsBell /> Уведомить о запуске
                  </button>
                </div>
              </div>
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

      {showTelegramModal && (
        <div className="modal-overlay" onClick={() => setShowTelegramModal(false)}>
          <div className="modal telegram-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2><BsBell /> Уведомления</h2>
              <button className="close-button" onClick={() => setShowTelegramModal(false)}>×</button>
            </div>
            <div className="telegram-content">
              <div className="telegram-icon">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06-.01.13-.02.2z" fill="#FFB700"/>
                </svg>
              </div>
              <div className="telegram-description">
                <p>Получайте уведомления о новых функциях в нашем Telegram боте!</p>
                <p className="telegram-hint">Введите ваш Telegram username без символа @</p>
              </div>
              <div className="telegram-input-container">
                <span className="telegram-at">@</span>
                <input
                  type="text"
                  value={telegramUsername}
                  onChange={(e) => setTelegramUsername(e.target.value)}
                  placeholder="username"
                  className={`telegram-input ${notificationStatus}`}
                />
              </div>
              {notificationStatus === 'error' && (
                <div className="telegram-error">
                  Пожалуйста, введите корректный username
                </div>
              )}
              {notificationStatus === 'success' && (
                <div className="telegram-success">
                  Отлично! Вы будете получать уведомления о новых функциях
                </div>
              )}
              <button 
                className="telegram-submit"
                onClick={handleTelegramSubmit}
              >
                <BsBell /> Подключить уведомления
              </button>
            </div>
          </div>
        </div>
      )}

      {showAboutModal && (
        <div className="modal-overlay" onClick={() => setShowAboutModal(false)}>
          <div className="modal about-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2><BsPeopleFill /> Мы в соцсетях</h2>
              <button className="close-button" onClick={() => setShowAboutModal(false)}>×</button>
            </div>
            <div className="about-content">
              <div className="social-links">
                <a href="https://t.me/ruletkabot" className="social-link telegram">
                  <div className="social-icon">
                    <BsPeopleFill />
                  </div>
                  <div className="social-info">
                    <h3>Telegram Bot</h3>
                    <p>Наш бот для уведомлений</p>
                  </div>
                </a>

                <a href="https://t.me/ruletka_channel" className="social-link telegram-channel">
                  <div className="social-icon">
                    <BsPeopleFill />
                  </div>
                  <div className="social-info">
                    <h3>Telegram Канал</h3>
                    <p>Новости и обновления проекта</p>
                  </div>
                </a>

                <a href="https://vk.com/ruletka" className="social-link vk">
                  <div className="social-icon">
                    <BsPeopleFill />
                  </div>
                  <div className="social-info">
                    <h3>VK Group</h3>
                    <p>Наша группа ВКонтакте</p>
                  </div>
                </a>

                <div className="social-link website">
                  <div className="social-icon">
                    <BsGlobe />
                  </div>
                  <div className="social-info">
                    <h3>ruletka.top</h3>
                    <p>Наш официальный сайт</p>
                  </div>
                </div>
              </div>

              <div className="about-footer">
                <p>Присоединяйтесь к нам в социальных сетях, чтобы быть в курсе всех обновлений и новостей!</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ChatRoom; 