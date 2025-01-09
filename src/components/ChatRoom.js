import React, { useState, useRef, useEffect, useCallback } from 'react';
import { io } from 'socket.io-client';
import Peer from 'simple-peer';
import EmojiPicker from 'emoji-picker-react';
import './ChatRoom.css';
import { IoMdSend, IoMdImage } from 'react-icons/io';
import { BsMicFill, BsMicMuteFill, BsCameraVideoFill, BsCameraVideoOffFill, BsFilterCircle } from 'react-icons/bs';
import { MdScreenShare, MdStopScreenShare, MdTranslate } from 'react-icons/md';
import { FaSmile, FaDrawPolygon, FaHandPaper } from 'react-icons/fa';
import { BiError } from 'react-icons/bi';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import FaceFilters from './FaceFilters';
import Face3DMasks from './Face3DMasks';
import Mask3DPicker from './Mask3DPicker';
import Footer from './Footer';
import SpaceBackground from './SpaceBackground';
import styled from 'styled-components';

// Socket configuration
const SOCKET_URL = process.env.NODE_ENV === 'production' 
  ? 'wss://ruletka.top' 
  : 'http://localhost:5001';

const socket = io(SOCKET_URL, {
  path: '/socket.io',
  transports: ['websocket'],
  reconnection: true,
  reconnectionAttempts: 10,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  timeout: 20000,
  withCredentials: true,
  autoConnect: true,
  forceNew: true,
  secure: true
});

// Улучшенная обработка состояния соединения
socket.on('connect', () => {
  console.log('Connected to server:', SOCKET_URL);
  console.log('Socket ID:', socket.id);
});

socket.on('connect_error', (error) => {
  console.error('Connection error:', error);
  // Пробуем переподключиться с небольшой задержкой
  setTimeout(() => {
    socket.connect();
  }, 1000);
});

socket.on('disconnect', () => {
  console.log('Disconnected from server');
  // Пробуем переподключиться
  setTimeout(() => {
    socket.connect();
  }, 1000);
});

const ChatContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

const ChatContent = styled.div`
  flex: 1;
  padding: 20px;
`;

const ChatRoom = ({ currentTheme }) => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [showEmoji, setShowEmoji] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [chatMode, setChatMode] = useState('video');
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const messagesEndRef = useRef(null);
  const [localStream, setLocalStream] = useState(null);
  const [filter, setFilter] = useState('none');
  const [isDrawing, setIsDrawing] = useState(false);
  const [handRaised, setHandRaised] = useState(false);
  const [autoTranslate, setAutoTranslate] = useState(false);
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);
  const [isSearchingAnimation, setIsSearchingAnimation] = useState(false);
  const [isNextTransition, setIsNextTransition] = useState(false);
  const [peer, setPeer] = useState(null);
  const [roomId, setRoomId] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState('idle');
  const [connectionError, setConnectionError] = useState(null);
  const [onlineCount, setOnlineCount] = useState(0);
  const [mediaPermission, setMediaPermission] = useState(false);
  const [showPermissionDialog, setShowPermissionDialog] = useState(true);
  const [activeFilter, setActiveFilter] = useState('none');
  const [showFilters, setShowFilters] = useState(false);
  const [currentFilter, setCurrentFilter] = useState({ filter: '', maskUrl: null });
  const [activeMask, setActiveMask] = useState('none');
  const [showMaskPicker, setShowMaskPicker] = useState(false);
  const [targetLanguage, setTargetLanguage] = useState('en');
  const [chatDuration, setChatDuration] = useState(0);
  const [chatTimerInterval, setChatTimerInterval] = useState(null);
  const [partnerJoined, setPartnerJoined] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const videoFilters = {
    none: '',
    grayscale: 'grayscale(100%)',
    sepia: 'sepia(100%)',
    blur: 'blur(3px)',
    brightness: 'brightness(150%)',
    contrast: 'contrast(200%)',
    hueRotate: 'hue-rotate(90deg)',
  };

  const toggleFilter = () => {
    const filters = Object.keys(videoFilters);
    const currentIndex = filters.indexOf(filter);
    const nextIndex = (currentIndex + 1) % filters.length;
    setFilter(filters[nextIndex]);
  };

  const toggleDrawing = () => {
    setIsDrawing(!isDrawing);
    if (!isDrawing && canvasRef.current) {
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      let isDrawing = false;
      let lastX = 0;
      let lastY = 0;

      canvas.addEventListener('mousedown', (e) => {
        isDrawing = true;
        [lastX, lastY] = [e.offsetX, e.offsetY];
      });

      canvas.addEventListener('mousemove', (e) => {
        if (!isDrawing) return;
        context.beginPath();
        context.moveTo(lastX, lastY);
        context.lineTo(e.offsetX, e.offsetY);
        context.strokeStyle = '#00ff00';
        context.lineWidth = 2;
        context.stroke();
        [lastX, lastY] = [e.offsetX, e.offsetY];
      });

      canvas.addEventListener('mouseup', () => isDrawing = false);
    }
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const messageData = {
          type: 'image',
          content: e.target.result
        };

        const newMessage = {
          id: Date.now(),
          ...messageData,
          sender: 'you',
        };

        setMessages(prevMessages => [...prevMessages, newMessage]);
        
        // Отправляем изображение на сервер
        socket.emit('message', {
          roomId,
          message: messageData
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleHandRaise = () => {
    setHandRaised(!handRaised);
  };

  const translateText = async (text, targetLang) => {
    try {
      const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`;
      
      const response = await fetch(url);
      const data = await response.json();
      
      const translatedText = data[0].map(item => item[0]).join('');
      return translatedText;
    } catch (error) {
      console.error('Translation error:', error);
      return text;
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (inputMessage.trim() && isConnected) {
      let translatedText = null;
      
      if (autoTranslate) {
        const isRussian = /[а-яА-Я]/.test(inputMessage);
        translatedText = await translateText(
          inputMessage,
          isRussian ? 'en' : 'ru'
        );
      }

      const messageData = {
        type: 'text',
        text: inputMessage,
        translated: translatedText
      };

      const newMessage = {
        id: Date.now(),
        ...messageData,
        sender: 'you',
      };
      
      setMessages(prevMessages => [...prevMessages, newMessage]);
      
      // Отправляем сообщение на сервер
      socket.emit('message', {
        roomId,
        message: messageData
      });
      
      setInputMessage('');
    }
  };

  const requestMediaPermission = async () => {
    try {
      const constraints = chatMode === 'video' 
        ? { video: { width: { ideal: 1280 }, height: { ideal: 720 } }, audio: true }
        : { video: false, audio: true };

      // Сначала проверяем доступность устройств
      const devices = await navigator.mediaDevices.enumerateDevices();
      const hasAudio = devices.some(device => device.kind === 'audioinput');
      const hasVideo = devices.some(device => device.kind === 'videoinput');

      if (chatMode === 'video' && !hasVideo) {
        throw new Error('Камера не найдена');
      }
      if (!hasAudio) {
        throw new Error('Микрофон не найден');
      }

      const stream = await navigator.mediaDevices.getUserMedia(constraints);

      if (stream) {
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
        setLocalStream(stream);
        setMediaPermission(true);
        setShowPermissionDialog(false);
        setConnectionError(null);
        console.log('Media permissions granted');
      } else {
        throw new Error('Не удалось получить медиа поток');
      }
    } catch (err) {
      console.error("Ошибка доступа к медиа:", err);
      
      let errorMessage = '';
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        errorMessage = `Доступ к ${chatMode === 'video' ? 'камере и микрофону' : 'микрофону'} запрещен. Пожалуйста, разрешите доступ в настройках браузера.`;
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        errorMessage = chatMode === 'video' 
          ? "Камера или микрофон не найдены. Пожалуйста, подключите устройства."
          : "Микрофон не найден. Пожалуйста, подключите микрофон.";
      } else if (err.name === 'NotReadableError' || err.name === 'TrackStartError') {
        errorMessage = `${chatMode === 'video' ? 'Камера или микрофон' : 'Микрофон'} уже используется другим приложением.`;
      } else {
        errorMessage = err.message || "Произошла ошибка при доступе к медиа устройствам";
      }
      
      setConnectionError(errorMessage);
      setMediaPermission(false);
      setLocalStream(null);
    }
  };

  useEffect(() => {
    if (!localStream) {
      requestMediaPermission();
    }

    return () => {
      if (localStream) {
        localStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [localStream]);

  const toggleMic = () => {
    if (localStream) {
      const audioTrack = localStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsMuted(!isMuted);
      }
    }
  };

  const toggleVideo = () => {
    if (localStream) {
      const videoTrack = localStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoOff(!isVideoOff);
      }
    }
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

  const onEmojiClick = (emojiData, event) => {
    setInputMessage(prevInput => prevInput + emojiData.emoji);
    setShowEmoji(false);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    console.log('Current states:', {
      isConnected,
      isSearching,
      connectionStatus,
      localStream: !!localStream,
      peer: !!peer
    });
  }, [isConnected, isSearching, connectionStatus, localStream, peer]);

  useEffect(() => {
    socket.on('connect', () => {
      console.log('Socket connected:', socket.id);
      setConnectionError(null);
    });

    socket.on('disconnect', () => {
      console.log('Socket disconnected');
      setIsConnected(false);
      setConnectionStatus('idle');
      if (peer) {
        peer.destroy();
        setPeer(null);
      }
      setConnectionError('Соединение с сервером потеряно. Переподключение...');
    });

    socket.on('connect_error', (error) => {
      console.error('Connection error:', error);
      setConnectionError('Ошибка подключения к серверу. Пробуем переподключиться...');
    });

    socket.on('waiting', () => {
      console.log('Waiting for partner');
      setConnectionStatus('searching');
      setIsSearching(true);
    });

    socket.on('searchTimeout', () => {
      console.log('Search timeout');
      setConnectionStatus('idle');
      setIsSearching(false);
      setConnectionError('Поиск собеседника занял слишком много времени. Попробуйте еще раз.');
    });

    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('connect_error');
      socket.off('waiting');
      socket.off('searchTimeout');
    };
  }, [peer]);

  const startSearch = useCallback(() => {
    if (!localStream) {
      setConnectionError('Нет доступа к камере');
      return;
    }

    if (!socket.connected) {
      console.log('Socket not connected, attempting to connect...');
      socket.connect();
    }

    setConnectionStatus('searching');
    setConnectionError(null);
    setIsSearchingAnimation(true);
    setMessages([]);
    setPartnerJoined(false);
    setChatDuration(0);

    if (peer) {
      peer.destroy();
      setPeer(null);
    }

    if (remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = null;
    }

    setTimeout(() => {
      console.log('Emitting startSearch with mode:', chatMode);
      socket.emit('startSearch', { chatMode });
      setIsSearching(true);
      setIsSearchingAnimation(false);
    }, 1000);
  }, [localStream, peer, socket, chatMode]);

  const handleConnectionError = useCallback(() => {
    if (peer) {
      peer.destroy();
      setPeer(null);
    }
    setConnectionStatus('failed');
    setTimeout(() => {
      if (connectionStatus === 'failed') {
        startSearch();
      }
    }, 3000);
  }, [peer, startSearch]);

  const handlePeerDisconnect = useCallback(() => {
    if (remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = null;
    }
    setConnectionStatus('idle');
    setIsConnected(false);
  }, []);

  const handleIceDisconnect = useCallback(() => {
    console.log('ICE connection failed/disconnected');
    if (peer && peer._pc) {
      try {
        peer._pc.restartIce();
        console.log('ICE restart initiated');
      } catch (err) {
        console.error('ICE restart failed:', err);
        handleConnectionError();
      }
    }
  }, [peer, handleConnectionError]);

  const createPeerConnection = useCallback((initiator, stream) => {
    try {
      const newPeer = new Peer({
        initiator,
        trickle: true,
        stream,
        config: {
          iceServers: [
            { urls: 'stun:stun.l.google.com:19302' },
            { urls: 'stun:stun1.l.google.com:19302' },
            { urls: 'stun:stun2.l.google.com:19302' },
            { urls: 'stun:stun3.l.google.com:19302' },
            { urls: 'stun:stun4.l.google.com:19302' },
            {
              urls: 'turn:turn.ruletka.top:3478',
              username: 'ruletka',
              credential: 'ruletka123'
            }
          ],
          iceTransportPolicy: 'all',
          iceCandidatePoolSize: 10,
          bundlePolicy: 'max-bundle',
          rtcpMuxPolicy: 'require'
        }
      });

      newPeer.on('connect', () => {
        console.log('Peer connection established');
        setConnectionStatus('connected');
      });

      newPeer.on('error', (err) => {
        console.error('Peer connection error:', err);
        setConnectionError('Ошибка подключения к собеседнику');
        handleConnectionError();
      });

      newPeer.on('close', () => {
        console.log('Peer connection closed');
        handlePeerDisconnect();
      });

      newPeer.on('iceStateChange', (state) => {
        console.log('ICE state:', state);
        if (state === 'disconnected' || state === 'failed') {
          handleIceDisconnect();
        }
      });

      newPeer.on('stream', stream => {
        console.log('Received remote stream');
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = stream;
          setConnectionStatus('connected');
        }
      });

      return newPeer;
    } catch (err) {
      console.error('Error creating peer:', err);
      setConnectionError('Ошибка создания соединения');
      return null;
    }
  }, [handleConnectionError, handlePeerDisconnect, handleIceDisconnect]);

  useEffect(() => {
    socket.on('message', (data) => {
      console.log('Received message:', data);
      if (!data || !data.message) return;

      const receivedMessage = {
        id: Date.now(),
        type: data.message.type || 'text',
        text: data.message.text || '',
        content: data.message.content || '',
        sender: 'partner',
        translated: data.message.translated || null
      };
      
      if (receivedMessage.type === 'text' && !receivedMessage.text) return;
      if (receivedMessage.type === 'image' && !receivedMessage.content) return;
      
      setMessages(prevMessages => [...prevMessages, receivedMessage]);
    });

    socket.on('signal', async (data) => {
      console.log('Received signal from partner:', data);
      try {
        if (peer && data.signal) {
          await peer.signal(data.signal);
        }
      } catch (err) {
        console.error('Error processing signal:', err);
      }
    });

    socket.on('partnerLeft', () => {
      console.log('Partner left');
      setIsConnected(false);
      setConnectionStatus('idle');
      setPartnerJoined(false);
      if (peer) {
        peer.destroy();
        setPeer(null);
      }
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = null;
      }
    });

    return () => {
      socket.off('message');
      socket.off('signal');
      socket.off('partnerLeft');
    };
  }, [peer]);

  useEffect(() => {
    socket.on('connect', () => {
      console.log('Socket connected:', socket.id);
      setConnectionError(null);
    });

    socket.on('disconnect', () => {
      console.log('Socket disconnected');
      setIsConnected(false);
      setConnectionStatus('idle');
      if (peer) {
        peer.destroy();
        setPeer(null);
      }
      setConnectionError('Соединение с сервером потеряно');
    });

    socket.on('waiting', () => {
      console.log('Waiting for partner');
      setConnectionStatus('searching');
    });

    socket.on('chatStarted', async ({ roomId: newRoomId }) => {
      console.log('Chat started in room:', newRoomId);
      setRoomId(newRoomId);
      setIsConnected(true);
      setIsSearching(false);
      setConnectionStatus('connecting');
      setConnectionError(null);
      
      if (localStream) {
        try {
          console.log('Creating peer connection as initiator');
          const newPeer = createPeerConnection(true, localStream);
          if (newPeer) {
            setPeer(newPeer);
            
            newPeer.on('signal', signal => {
              console.log('Sending initial signal to partner');
              socket.emit('signal', { signal, roomId: newRoomId });
            });
            
            // Устанавливаем таймер для проверки успешности соединения
            const connectionTimeout = setTimeout(() => {
              if (connectionStatus !== 'connected') {
                console.log('Connection timeout');
                handleConnectionError();
              }
            }, 15000);

            // Очищаем таймер при успешном соединении
            newPeer.on('connect', () => {
              console.log('Peer connection established successfully');
              clearTimeout(connectionTimeout);
            });
          }
        } catch (err) {
          console.error('Error in chat start:', err);
          handleConnectionError();
        }
      } else {
        console.error('No local stream available');
        setConnectionError('Нет доступа к медиа устройствам');
      }
    });

    socket.on('signal', async (data) => {
      console.log('Received signal:', data);
      try {
        if (peer && data.signal) {
          console.log('Applying received signal to peer');
          await peer.signal(data.signal);
        } else {
          console.log('No peer available for signal or signal is empty');
        }
      } catch (err) {
        console.error('Error processing signal:', err);
        handleConnectionError();
      }
    });

    socket.on('partnerJoined', async (data) => {
      console.log('Partner joined with signal:', data);
      setConnectionStatus('connecting');
      setPartnerJoined(true);
      setChatDuration(0);
      
      if (localStream && data.signal) {
        try {
          const newPeer = new Peer({
            initiator: false,
            trickle: false,
            stream: localStream,
            config: {
              iceServers: [
                { urls: 'stun:stun.l.google.com:19302' },
                { urls: 'stun:stun1.l.google.com:19302' }
              ]
            }
          });

          newPeer.on('signal', signal => {
            console.log('Sending signal back to partner');
            socket.emit('signal', { signal, roomId });
          });

          newPeer.on('stream', stream => {
            console.log('Received remote stream');
            if (remoteVideoRef.current) {
              remoteVideoRef.current.srcObject = stream;
              setConnectionStatus('connected');
              const interval = setInterval(() => {
                setChatDuration(prev => prev + 1);
              }, 1000);
              setChatTimerInterval(interval);
            }
          });

          newPeer.on('error', err => {
            console.error('Peer connection error:', err);
            setConnectionError('Ошибка подключения к собеседнику');
          });

          newPeer.on('close', () => {
            console.log('Peer connection closed');
            if (remoteVideoRef.current) {
              remoteVideoRef.current.srcObject = null;
            }
          });

          setPeer(newPeer);
          await newPeer.signal(data.signal);
        } catch (err) {
          console.error('Error creating peer:', err);
          setConnectionError('Ошибка создания соединения');
        }
      }
    });

    socket.on('partnerLeft', () => {
      console.log('Partner left');
      setIsConnected(false);
      setConnectionStatus('idle');
      setPartnerJoined(false);
      if (chatTimerInterval) {
        clearInterval(chatTimerInterval);
      }
      setChatDuration(0);
      if (peer) {
        peer.destroy();
        setPeer(null);
      }
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = null;
      }
    });

    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('waiting');
      socket.off('chatStarted');
      socket.off('partnerJoined');
      socket.off('partnerLeft');
      if (chatTimerInterval) {
        clearInterval(chatTimerInterval);
      }
    };
  }, [localStream, connectionStatus, createPeerConnection, handleConnectionError]);

  const nextPartner = () => {
    setIsNextTransition(true);
    setMessages([]);
    setPartnerJoined(false);
    setChatDuration(0);
    
    if (peer) {
      peer.destroy();
      setPeer(null);
    }

    if (remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = null;
    }

    setTimeout(() => {
      setIsNextTransition(false);
      if (roomId) {
        socket.emit('nextPartner', { roomId });
      }
    }, 1000);
  };

  const endChat = () => {
    if (peer) {
      peer.destroy();
      setPeer(null);
    }

    if (remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = null;
    }

    if (roomId) {
      socket.emit('leaveRoom', { roomId });
    }

    setIsConnected(false);
    setIsSearching(false);
    setMessages([]);
    setConnectionStatus('idle');
    setPartnerJoined(false);
    setChatDuration(0);
    setRoomId(null);
  };

  const toggleChatMode = () => {
    const newMode = chatMode === 'video' ? 'audio' : 'video';
    setChatMode(newMode);
    
    // Если уже есть активное соединение, завершаем его
    if (isConnected || isSearching) {
      endChat();
    }
    
    // Останавливаем текущий стрим
    if (localStream) {
      localStream.getTracks().forEach(track => track.stop());
      setLocalStream(null);
    }
    
    // Запрашиваем новые разрешения
    requestMediaPermission();
  };

  const renderLocalVideo = () => {
    return (
      <div 
        className="video-box"
        onMouseDown={handleResizeStart}
      >
        <div className="video-wrapper">
          {chatMode === 'video' ? (
            <video
              ref={localVideoRef}
              className="video-stream"
              autoPlay
              muted
              playsInline
              style={{ filter: videoFilters[filter] }}
            />
          ) : (
            <div className="audio-only-placeholder">
              <div className="audio-wave-animation"></div>
              <span>Только аудио</span>
            </div>
          )}
          {chatMode === 'video' && currentFilter.maskUrl && (
            <img src={currentFilter.maskUrl} alt="mask" className="video-mask" />
          )}
          <div className="user-label">Вы</div>
          {chatMode === 'video' && (
            <>
              <Face3DMasks
                videoRef={localVideoRef}
                activeFilter={activeMask}
              />
              {isDrawing && (
                <canvas
                  ref={canvasRef}
                  className="drawing-canvas"
                  width="640"
                  height="480"
                />
              )}
            </>
          )}
        </div>
        <div className="video-controls">
          <button onClick={toggleMic} className="control-btn">
            {isMuted ? <BsMicMuteFill size={20} /> : <BsMicFill size={20} />}
          </button>
          {chatMode === 'video' && (
            <>
              <button onClick={toggleVideo} className="control-btn">
                {isVideoOff ? <BsCameraVideoOffFill size={20} /> : <BsCameraVideoFill size={20} />}
              </button>
              <button onClick={toggleScreenShare} className="control-btn">
                {isScreenSharing ? <MdStopScreenShare size={20} /> : <MdScreenShare size={20} />}
              </button>
              <button 
                onClick={() => setShowMaskPicker(!showMaskPicker)} 
                className={`control-btn ${showMaskPicker ? 'active' : ''}`}
              >
                <BsFilterCircle size={20} />
              </button>
              <button onClick={toggleDrawing} className="control-btn">
                <FaDrawPolygon size={20} />
              </button>
            </>
          )}
          <button onClick={toggleHandRaise} className={`control-btn ${handRaised ? 'active' : ''}`}>
            <FaHandPaper size={20} />
          </button>
        </div>
      </div>
    );
  };

  const renderPartnerVideo = () => {
    return (
      <div 
        className="video-box"
        onMouseDown={handleResizeStart}
      >
        <span className="user-label">Собеседник</span>
        <span className="chat-online-count">
          {connectionStatus === 'connected' ? formatTime(chatDuration) : ''}
        </span>
        {connectionStatus === 'idle' ? (
          <div className="video-placeholder">
            <span>Нажмите "Рулетим" чтобы начать</span>
          </div>
        ) : connectionStatus === 'connecting' ? (
          <div className="video-placeholder connecting">
            <AiOutlineLoading3Quarters className="loading-icon" />
            <span>Подключение к собеседнику...</span>
          </div>
        ) : connectionStatus === 'failed' ? (
          <div className="video-placeholder error">
            <BiError className="error-icon" />
            <span>{connectionError || 'Ошибка подключения'}</span>
            <button onClick={nextPartner} className="retry-button">
              Следующий собеседник
            </button>
          </div>
        ) : (
          chatMode === 'video' ? (
            <video
              ref={remoteVideoRef}
              autoPlay
              playsInline
              className="video-stream"
            />
          ) : (
            <div className="audio-only-placeholder">
              <div className="audio-wave-animation"></div>
              <span>Только аудио</span>
            </div>
          )
        )}
      </div>
    );
  };

  useEffect(() => {
    socket.on('updateOnlineCount', (count) => {
      setOnlineCount(count);
    });

    return () => {
      socket.off('updateOnlineCount');
    };
  }, []);

  const handleFilterChange = (filter) => {
    setActiveFilter(filter.id);
    setCurrentFilter(filter);
  };

  const handleMaskChange = (maskId) => {
    console.log('Changing mask to:', maskId);
    setActiveMask(maskId);
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleResizeStart = (e) => {
    const videoBox = e.target.closest('.video-box');
    if (!videoBox) return;

    const startY = e.clientY;
    const startHeight = videoBox.offsetHeight;

    const handleMouseMove = (e) => {
      const deltaY = e.clientY - startY;
      const newHeight = startHeight + deltaY;
      
      const minHeight = 400;
      const maxHeight = window.innerHeight * 0.9;
      
      const finalHeight = Math.min(Math.max(newHeight, minHeight), maxHeight);
      videoBox.style.height = finalHeight + 'px';

      const viewportHeight = window.innerHeight;
      const heightPercentage = (finalHeight / viewportHeight) * 100;
      
      setIsExpanded(heightPercentage >= 80);
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const cancelSearch = () => {
    setIsSearching(false);
    setIsSearchingAnimation(false);
    setConnectionStatus('idle');
    if (roomId) {
      socket.emit('leaveRoom', { roomId });
    }
  };

  return (
    <ChatContainer>
      <SpaceBackground theme={currentTheme} />
      <ChatContent>
        <div className={`chat-container ${isConnected || isSearching ? 'chat-active' : ''} ${isExpanded ? 'expanded' : ''}`}>
          {showPermissionDialog && (
            <div className="permission-message">
              <h3>Разрешите доступ к камере и микрофону</h3>
              <p>
                Для использования видеочата необходим доступ к вашей камере и микрофону.
                Пожалуйста, нажмите "Разрешить" в диалоговом окне браузера.
              </p>
              <div className="permission-buttons">
                <button 
                  className="permission-button"
                  onClick={requestMediaPermission}
                >
                  Разрешить доступ
                </button>
                <button 
                  className="permission-button secondary"
                  onClick={() => window.location.reload()}
                >
                  Перезагрузить страницу
                </button>
              </div>
              {connectionError && (
                <div className="permission-error">
                  <p className="permission-denied">{connectionError}</p>
                  <p className="permission-help">
                    Чтобы разрешить доступ:
                    <br />
                    1. Нажмите на значок 🔒 слева от адресной строки
                    <br />
                    2. Найдите настройки камеры и микрофона
                    <br />
                    3. Выберите "Разрешить"
                  </p>
                </div>
              )}
            </div>
          )}
          
          {isSearchingAnimation && (
            <div className="searching-animation">
              <div className="connecting-lines">
                <div className="connecting-line"></div>
                <div className="connecting-line"></div>
                <div className="connecting-line"></div>
              </div>
              <div className="roulette-wheel"></div>
              <div className="searching-text">Ищем собеседника...</div>
              <div className="searching-subtext">
                {chatMode === 'video' ? 
                  'Подбираем вам случайного собеседника для видеочата' : 
                  'Подбираем вам случайного собеседника для аудиочата'}
              </div>
              <div className="searching-stats">
                Сейчас онлайн: <span className="online-count-badge">{onlineCount}</span>
              </div>
              <button onClick={cancelSearch} className="cancel-search-btn">
                Отменить поиск
              </button>
            </div>
          )}
          
          {isNextTransition && (
            <div className="next-transition">
              <div className="searching-text">Переключаем...</div>
            </div>
          )}
          
          <div className="video-grid">
            {renderLocalVideo()}
            {renderPartnerVideo()}
          </div>

          {showMaskPicker && (
            <Mask3DPicker
              activeMask={activeMask}
              onMaskChange={handleMaskChange}
            />
          )}

          <div className="control-buttons">
            {!isConnected && !isSearching && (
              <>
                <div className="chat-mode-toggle">
                  <button
                    onClick={toggleChatMode}
                    className={`mode-btn ${chatMode}`}
                  >
                    {chatMode === 'video' ? 'Видео чат' : 'Аудио чат'}
                  </button>
                </div>
                {!mediaPermission ? (
                  <button 
                    onClick={requestMediaPermission} 
                    className="btn-start"
                  >
                    Разрешить доступ к {chatMode === 'video' ? 'камере' : 'микрофону'}
                  </button>
                ) : (
                  <button 
                    onClick={startSearch} 
                    className="btn-start"
                    disabled={!localStream || isSearching || isConnected}
                  >
                    {!localStream ? `Ожидание ${chatMode === 'video' ? 'камеры' : 'микрофона'}...` : 'Рулетим'}
                  </button>
                )}
              </>
            )}
            {isConnected && (
              <>
                <button onClick={nextPartner} className="btn-next">
                  Следующий
                </button>
                <button onClick={endChat} className="btn-end">
                  Завершить
                </button>
              </>
            )}
          </div>

          <form onSubmit={sendMessage} className="message-form">
            <div className="messages-container">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`message ${message.sender === 'you' ? 'message-sent' : 'message-received'}`}
                >
                  {message.type === 'text' ? (
                    <>
                      {message.text}
                      {message.translated && (
                        <div className="message-translation">{message.translated}</div>
                      )}
                    </>
                  ) : message.type === 'image' ? (
                    <img src={message.content} alt="shared" className="shared-image" />
                  ) : null}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            <div className="input-wrapper">
              <button 
                type="button" 
                className="emoji-button"
                onClick={() => setShowEmoji(!showEmoji)}
              >
                <FaSmile size={24} />
              </button>
              <button
                type="button"
                className="image-upload-button"
                onClick={() => fileInputRef.current.click()}
              >
                <IoMdImage size={24} />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                style={{ display: 'none' }}
              />
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Написать сообщение..."
                disabled={!isConnected}
                className="message-input"
              />
              <button
                type="button"
                className={`translate-button ${autoTranslate ? 'active' : ''}`}
                onClick={() => {
                  setAutoTranslate(!autoTranslate);
                  setTargetLanguage(targetLanguage === 'en' ? 'ru' : 'en');
                }}
              >
                <MdTranslate size={24} />
                <span className="translate-lang">{targetLanguage.toUpperCase()}</span>
              </button>
              <button type="submit" disabled={!isConnected} className="btn-send">
                <IoMdSend size={24} />
              </button>
            </div>
            
            {showEmoji && (
              <div className="emoji-picker-container">
                <EmojiPicker onEmojiClick={onEmojiClick} />
              </div>
            )}
          </form>

          {partnerJoined && (
            <div className="chat-timer">
              {formatTime(chatDuration)}
            </div>
          )}
        </div>
        
        {!isConnected && !isSearching && (
          <Footer />
        )}
      </ChatContent>
    </ChatContainer>
  );
};

export default ChatRoom; 