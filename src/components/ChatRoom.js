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
  BsQuestionCircle
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
  
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);

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

  return (
    <div className="chat-room">
      <div className="video-grid">
        <div className="video-box remote-video">
          <div className="waiting-message">
            Ожидание собеседника...
          </div>
          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            className="video-element"
          />
        </div>
        <div className="video-box">
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
      </div>

      <div className="bottom-menus">
        <div className="menu-indicators">
          <div 
            className="menu-indicator"
            onMouseEnter={() => {
              setShowModeMenu(true);
              setShowSettingsMenu(false);
            }}
          />
          <div 
            className="menu-indicator"
            onMouseEnter={() => {
              setShowSettingsMenu(true);
              setShowModeMenu(false);
            }}
          />
        </div>

        <div 
          className={`slide-menu mode-menu ${showModeMenu ? 'show' : ''}`}
          onMouseLeave={() => setShowModeMenu(false)}
        >
          {!isConnected && !isSearching && (
            <button className="menu-item start-button" onClick={startChat}>
              Начать чат
            </button>
          )}
          {isSearching && (
            <button className="menu-item cancel-button" onClick={stopSearch}>
              Отменить поиск
            </button>
          )}
          {isConnected && (
            <button className="menu-item next-button" onClick={nextPartner}>
              <BsArrowRepeat /> Следующий
            </button>
          )}
          <div className="menu-divider" />
          <div 
            className="mode-toggle"
            data-mode={chatMode}
          >
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
          <div className="menu-divider" />
          <button className="menu-item" onClick={stopSearch}>
            Стоп
          </button>
        </div>

        <div 
          className={`slide-menu settings-menu ${showSettingsMenu ? 'show' : ''}`}
          onMouseLeave={() => setShowSettingsMenu(false)}
        >
          <button className="menu-item">
            <BsGearFill /> Настройки
          </button>
          <button className="menu-item">
            <BsStars /> Премиум
          </button>
          <button className="menu-item">
            <BsBarChartLineFill /> Статистика
          </button>
          <button className="menu-item">
            <BsQuestionCircle /> Помощь
          </button>
        </div>
      </div>
    </div>
  );
}

export default ChatRoom; 