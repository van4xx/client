import React, { useState, useRef, useEffect } from 'react';
import { IoMdSend, IoMdClose } from 'react-icons/io';
import { IoIosChatbubbles } from 'react-icons/io';
import { 
  BsMicFill, 
  BsMicMuteFill, 
  BsCameraVideoFill, 
  BsCameraVideoOffFill,
  BsEmojiSmile,
  BsImage,
  BsDisplay,
  BsDisplayFill,
  BsMask,
  BsHandIndex,
  BsGearFill,
  BsQuestionCircleFill,
  BsBarChartLineFill,
  BsGiftFill,
  BsVolumeUpFill
} from 'react-icons/bs';
import { FaMoon, FaSun } from 'react-icons/fa';
import { useTheme } from '../context/ThemeContext';
import EmojiPicker from 'emoji-picker-react';
import './ChatRoom.css';
import webRTCService from '../services/WebRTCService';

function SpaceScene() {
  const [stars, setStars] = useState([]);
  const [shootingStars, setShootingStars] = useState([]);

  useEffect(() => {
    // Создаем звезды
    const newStars = Array.from({ length: 100 }, () => ({
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      animationDelay: `${Math.random() * 2}s`
    }));
    setStars(newStars);

    // Создаем падающие звезды
    const createShootingStar = () => ({
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      transform: `rotate(${45 + Math.random() * 45}deg)`
    });

    // Анимация падающих звезд
    const shootingStarInterval = setInterval(() => {
      setShootingStars([createShootingStar()]);
      setTimeout(() => setShootingStars([]), 3000);
    }, 8000);

    return () => clearInterval(shootingStarInterval);
  }, []);

  return (
    <div className="space-scene">
      {stars.map((star, index) => (
        <div
          key={index}
          className="star"
          style={{
            left: star.left,
            top: star.top,
            animationDelay: star.animationDelay
          }}
        />
      ))}
      {shootingStars.map((star, index) => (
        <div
          key={index}
          className="shooting-star"
          style={{
            left: star.left,
            top: star.top,
            transform: star.transform
          }}
        />
      ))}
      <div 
        className="planet"
        style={{
          left: '70%',
          top: '30%',
          transform: 'scale(0.6)'
        }}
      />
    </div>
  );
}

function AudioWave({ isActive }) {
  return (
    <div className="audio-wave">
      {Array.from({ length: 5 }).map((_, index) => (
        <div
          key={index}
          className={`wave-bar ${isActive ? 'active' : ''}`}
        />
      ))}
    </div>
  );
}

function ChatRoom() {
  const [isConnected, setIsConnected] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isMaskEnabled, setIsMaskEnabled] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [unreadMessages, setUnreadMessages] = useState(0);
  const [hasPermissions, setHasPermissions] = useState(false);
  const [chatMode, setChatMode] = useState('video');
  const [showSettings, setShowSettings] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [showPremium, setShowPremium] = useState(false);
  const [videoDevices, setVideoDevices] = useState([]);
  const [audioDevices, setAudioDevices] = useState([]);
  const [audioOutputDevices, setAudioOutputDevices] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState('');
  const [selectedAudio, setSelectedAudio] = useState('');
  const [selectedAudioOutput, setSelectedAudioOutput] = useState('');
  const [autoEnableDevices, setAutoEnableDevices] = useState({
    camera: true,
    microphone: true
  });
  const [previewStream, setPreviewStream] = useState(null);
  const [audioLevel, setAudioLevel] = useState(0);
  const previewVideoRef = useRef(null);
  const audioContext = useRef(null);
  const audioAnalyser = useRef(null);
  const animationFrame = useRef(null);

  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const fileInputRef = useRef(null);
  const { theme, toggleTheme } = useTheme();

  // Инициализация WebRTC и запрос разрешений
  useEffect(() => {
    const init = async () => {
      try {
        await webRTCService.initialize();
        const { localStream } = await webRTCService.createLocalTracks(chatMode);
        
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
        alert('Для работы приложения необходим доступ к микрофону' + (chatMode === 'video' ? ' и камере' : ''));
      }
    };

    init();

    return () => {
      if (isConnected) {
        webRTCService.leaveRoom();
      }
    };
  }, [chatMode]);

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

  // Переключение демонстрации экрана
  const toggleScreenShare = async () => {
    try {
      if (!isScreenSharing) {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({ 
          video: true,
          audio: true 
        });
        webRTCService.replaceVideoTrack(screenStream.getVideoTracks()[0]);
        setIsScreenSharing(true);
      } else {
        const videoStream = await navigator.mediaDevices.getUserMedia({ video: true });
        webRTCService.replaceVideoTrack(videoStream.getVideoTracks()[0]);
        setIsScreenSharing(false);
      }
    } catch (error) {
      console.error('Failed to toggle screen share:', error);
    }
  };

  // Переключение маски
  const toggleMask = () => {
    setIsMaskEnabled(!isMaskEnabled);
    // TODO: Добавить логику применения маски/фильтров
  };

  // Привлечение внимания собеседника
  const getAttention = () => {
    if (isConnected) {
      webRTCService.sendMessage({
        type: 'attention',
        payload: { timestamp: Date.now() }
      });
    }
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

  // Обработчик настроек
  const handleSettings = () => {
    setShowSettings(true);
  };

  // Обработчик статистики
  const handleStats = () => {
    setShowStats(true);
  };

  // Обработчик помощи
  const handleHelp = () => {
    setShowHelp(true);
  };

  // Обработчик премиум функций
  const handlePremium = () => {
    setShowPremium(true);
  };

  // Получение списка устройств
  useEffect(() => {
    const getDevices = async () => {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        
        const videoInputs = devices.filter(device => device.kind === 'videoinput');
        const audioInputs = devices.filter(device => device.kind === 'audioinput');
        const audioOutputs = devices.filter(device => device.kind === 'audiooutput');
        
        setVideoDevices(videoInputs);
        setAudioDevices(audioInputs);
        setAudioOutputDevices(audioOutputs);
        
        // Установка устройств по умолчанию
        if (videoInputs.length) {
          setSelectedVideo(videoInputs[0].deviceId);
        }
        if (audioInputs.length) {
          setSelectedAudio(audioInputs[0].deviceId);
        }
        if (audioOutputs.length) {
          setSelectedAudioOutput(audioOutputs[0].deviceId);
        }
      } catch (error) {
        console.error('Failed to get devices:', error);
      }
    };

    getDevices();
  }, []);

  // Функция для анализа уровня звука
  const analyzeAudio = () => {
    if (audioAnalyser.current) {
      const dataArray = new Uint8Array(audioAnalyser.current.frequencyBinCount);
      audioAnalyser.current.getByteFrequencyData(dataArray);
      
      // Вычисляем средний уровень звука
      const average = dataArray.reduce((acc, val) => acc + val, 0) / dataArray.length;
      const normalizedLevel = Math.min(100, (average / 128) * 100);
      
      setAudioLevel(normalizedLevel);
      animationFrame.current = requestAnimationFrame(analyzeAudio);
    }
  };

  // Обработчик изменения устройств с предпросмотром
  const handleDeviceChange = async (type, deviceId) => {
    try {
      if (type === 'video') {
        setSelectedVideo(deviceId);
        
        // Останавливаем предыдущий стрим
        if (previewStream) {
          previewStream.getTracks().forEach(track => track.stop());
        }
        
        // Получаем новый стрим для предпросмотра
        const newStream = await navigator.mediaDevices.getUserMedia({
          video: { deviceId: { exact: deviceId } }
        });
        
        setPreviewStream(newStream);
        if (previewVideoRef.current) {
          previewVideoRef.current.srcObject = newStream;
        }
        
        // Обновляем стрим в WebRTC если подключены
        if (webRTCService && isConnected) {
          await webRTCService.switchVideoDevice(deviceId);
        }
      } else if (type === 'audio') {
        setSelectedAudio(deviceId);
        
        // Останавливаем предыдущий анализ звука
        if (animationFrame.current) {
          cancelAnimationFrame(animationFrame.current);
        }
        if (audioContext.current) {
          audioContext.current.close();
        }
        
        // Получаем новый аудио стрим
        const newStream = await navigator.mediaDevices.getUserMedia({
          audio: { deviceId: { exact: deviceId } }
        });
        
        // Настраиваем анализатор звука
        audioContext.current = new (window.AudioContext || window.webkitAudioContext)();
        const source = audioContext.current.createMediaStreamSource(newStream);
        audioAnalyser.current = audioContext.current.createAnalyser();
        audioAnalyser.current.fftSize = 256;
        source.connect(audioAnalyser.current);
        
        // Запускаем анализ звука
        analyzeAudio();
        
        // Обновляем стрим в WebRTC если подключены
        if (webRTCService && isConnected) {
          await webRTCService.switchAudioDevice(deviceId);
        }
      }
    } catch (error) {
      console.error(`Failed to switch ${type} device:`, error);
    }
  };

  // Очистка при закрытии настроек
  useEffect(() => {
    if (!showSettings) {
      // Останавливаем предпросмотр видео
      if (previewStream) {
        previewStream.getTracks().forEach(track => track.stop());
        setPreviewStream(null);
      }
      
      // Останавливаем анализ звука
      if (animationFrame.current) {
        cancelAnimationFrame(animationFrame.current);
      }
      if (audioContext.current) {
        audioContext.current.close();
        audioContext.current = null;
      }
      audioAnalyser.current = null;
      setAudioLevel(0);
    }
  }, [showSettings]);

  // Обработчик изменения автоматических настроек
  const handleAutoEnableChange = (device) => {
    setAutoEnableDevices(prev => ({
      ...prev,
      [device]: !prev[device]
    }));
  };

  // Добавляем обработчик изменения динамиков
  const handleAudioOutputChange = async (deviceId) => {
    try {
      setSelectedAudioOutput(deviceId);
      
      // Проверяем поддержку setSinkId
      if (typeof remoteVideoRef.current?.setSinkId === 'function') {
        await remoteVideoRef.current.setSinkId(deviceId);
        console.log('Audio output device set successfully');
      } else {
        console.warn('setSinkId is not supported in this browser');
      }
    } catch (error) {
      console.error('Failed to set audio output device:', error);
    }
  };

  return (
    <div className={`chat-room ${theme}`}>
      <div className="video-grid">
        <div className={`video-box ${chatMode === 'audio' ? 'audio-only' : ''}`}>
          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            className={chatMode === 'audio' ? 'hidden' : 'video-element'}
          />
          {chatMode === 'audio' && isConnected && (
            <div className="audio-indicator">
              <div className="audio-bar"></div>
              <div className="audio-bar"></div>
              <div className="audio-bar"></div>
              <div className="audio-bar"></div>
              <div className="audio-bar"></div>
            </div>
          )}
          {!isConnected && (
            <div className="search-overlay">
              <div className="search-message">
                <h3>{isSearching ? 'Ищем пару...' : 'Чат Рулетка'}</h3>
                <p>{isSearching ? 'Подключаемся к случайному собеседнику' : 'Начни общение прямо сейчас'}</p>
              </div>
            </div>
          )}
        </div>
        <div className={`video-box ${chatMode === 'audio' ? 'audio-only' : ''}`}>
          <video 
            ref={localVideoRef}
            autoPlay
            playsInline
            muted
            className={chatMode === 'audio' ? 'hidden' : 'video-element'}
          />
          {chatMode === 'audio' && (
            <div className="audio-indicator">
              <div className="audio-bar"></div>
              <div className="audio-bar"></div>
              <div className="audio-bar"></div>
              <div className="audio-bar"></div>
              <div className="audio-bar"></div>
            </div>
          )}
          <div className="local-controls">
            <button 
              className={`control-button ${isMuted ? 'danger active' : ''}`}
              onClick={toggleMic}
              data-tooltip="Микрофон"
            >
              {isMuted ? <BsMicMuteFill size={20} /> : <BsMicFill size={20} />}
            </button>
            {chatMode === 'video' && (
              <>
                <button 
                  className={`control-button ${isVideoOff ? 'danger active' : ''}`}
                  onClick={toggleVideo}
                  data-tooltip="Камера"
                >
                  {isVideoOff ? <BsCameraVideoOffFill size={20} /> : <BsCameraVideoFill size={20} />}
                </button>
                <button 
                  className={`control-button ${isScreenSharing ? 'active' : ''}`}
                  onClick={toggleScreenShare}
                  data-tooltip="Демонстрация экрана"
                >
                  {isScreenSharing ? <BsDisplayFill size={20} /> : <BsDisplay size={20} />}
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="controls-trigger" />
      <div className="controls-indicator" />
      <div className="controls-section">
        <div className="controls-buttons">
          <div className="mode-switcher">

          <div className="main-controls">
            {!isConnected && !isSearching && (
              <button 
                className="start-chat"
                onClick={startChat}
              >
                Рулетим
              </button>
            )}
            {isSearching && (
              <button 
                className="stop-search"
                onClick={disconnectChat}
              >
                Стоп
              </button>
            )}
            {isConnected && (
              <>
                <button 
                  className="next-partner"
                  onClick={startChat}
                >
                  Следующий
                </button>
                <button 
                  className="stop-search"
                  onClick={disconnectChat}
                >
                  Стоп
                </button>
              </>
            )}
          </div>

            <button 
              className={`mode-btn ${chatMode === 'video' ? 'active' : ''}`}
              onClick={() => setChatMode('video')}
              disabled={isConnected}
            >
              <BsCameraVideoFill size={20} />
              <span>Видео чат</span>
            </button>
            <button 
              className={`mode-btn ${chatMode === 'audio' ? 'active' : ''}`}
              onClick={() => setChatMode('audio')}
              disabled={isConnected}
            >
              <BsMicFill size={20} />
              <span>Аудио чат</span>
            </button>
          </div>

          

          <div className="controls-menu">
            <button 
              className="menu-button" 
              onClick={handleSettings}
              data-tooltip="Настройки"
            >
              <BsGearFill size={20} />
            </button>
            <button 
              className="menu-button" 
              onClick={handleStats}
              data-tooltip="Статистика"
            >
              <BsBarChartLineFill size={20} />
            </button>
            <button 
              className="menu-button" 
              onClick={handleHelp}
              data-tooltip="Помощь"
            >
              <BsQuestionCircleFill size={20} />
            </button>
            <button 
              className="menu-button premium" 
              onClick={handlePremium}
              data-tooltip="Premium функции"
            >
              <BsGiftFill size={20} />
            </button>
            <button 
              className="menu-button" 
              onClick={toggleTheme}
              data-tooltip={theme === 'dark' ? 'Светлая тема' : 'Темная тема'}
            >
              {theme === 'dark' ? <FaSun size={20} /> : <FaMoon size={20} />}
            </button>
          </div>
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

      {/* Модальное окно настроек */}
      {showSettings && (
        <div className="modal-overlay" onClick={() => setShowSettings(false)}>
          <div className="modal-content settings-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Настройки</h3>
              <button className="modal-close" onClick={() => setShowSettings(false)} />
            </div>
            
            <div className="settings-content">
              <div className="settings-group">
                <h4>
                  <BsCameraVideoFill />
                  Видео
                </h4>
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
                <p className="settings-hint">
                  Выберите устройства для записи и воспроизведения звука
                </p>
              </div>

              <div className="settings-group">
                <h4>
                  <BsGearFill />
                  Автоматические настройки
                </h4>
                <label className="settings-checkbox">
                  <input 
                    type="checkbox"
                    checked={autoEnableDevices.camera}
                    onChange={() => handleAutoEnableChange('camera')}
                  />
                  <span>Автоматически включать камеру при подключении</span>
                </label>
                <label className="settings-checkbox">
                  <input 
                    type="checkbox"
                    checked={autoEnableDevices.microphone}
                    onChange={() => handleAutoEnableChange('microphone')}
                  />
                  <span>Автоматически включать микрофон при подключении</span>
                </label>
              </div>

              <div className="settings-group">
                <h4>
                  <BsDisplayFill />
                  Качество видео
                </h4>
                <select className="settings-select">
                  <option value="high">Высокое качество (HD)</option>
                  <option value="medium">Среднее качество</option>
                  <option value="low">Низкое качество</option>
                </select>
                <p className="settings-hint">
                  Выберите более низкое качество при медленном интернете
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Модальное окно статистики */}
      {showStats && (
        <div className="modal-overlay" onClick={() => setShowStats(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Статистика</h3>
              <button className="modal-close" onClick={() => setShowStats(false)} />
            </div>
            <div className="stats-content">
              <div className="stats-section">
                <h4>Общая статистика</h4>
                <div className="stats-grid">
                  <div className="stat-card">
                    <div className="stat-value">0</div>
                    <div className="stat-label">Всего чатов</div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-value">0 мин</div>
                    <div className="stat-label">Общее время</div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-value">0</div>
                    <div className="stat-label">Друзей</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Модальное окно помощи */}
      {showHelp && (
        <div className="modal-overlay" onClick={() => setShowHelp(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Помощь</h3>
              <button className="modal-close" onClick={() => setShowHelp(false)} />
            </div>
            <div className="help-content">
              <div className="help-section">
                <h4>Горячие клавиши</h4>
                <div className="shortcut-list">
                  <div className="shortcut-item">
                    <span className="key">M</span>
                    <span>Выключить/включить микрофон</span>
                  </div>
                  <div className="shortcut-item">
                    <span className="key">V</span>
                    <span>Выключить/включить видео</span>
                  </div>
                  <div className="shortcut-item">
                    <span className="key">S</span>
                    <span>Начать/остановить демонстрацию экрана</span>
                  </div>
                  <div className="shortcut-item">
                    <span className="key">Esc</span>
                    <span>Отключиться от чата</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Модальное окно премиум */}
      {showPremium && (
        <div className="modal-overlay" onClick={() => setShowPremium(false)}>
          <div className="modal premium-modal" onClick={e => e.stopPropagation()}>
            <div className="premium-content">
              <div className="astronaut">
                <div className="astronaut-stars">
                  <div className="star"></div>
                  <div className="star"></div>
                  <div className="star"></div>
                </div>
                <div className="astronaut-helmet"></div>
                <div className="astronaut-body"></div>
                <div className="astronaut-backpack"></div>
              </div>
              <div className="premium-message">
                <h2>Premium функции</h2>
                <p>Мы работаем над новыми крутыми функциями!</p>
                <p>Скоро здесь появятся:</p>
                <p>• Маски и фильтры для видео</p>
                <p>• Запись и сохранение чатов</p>
                <p>• Расширенные настройки поиска</p>
                <p>• И многое другое!</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ChatRoom; 