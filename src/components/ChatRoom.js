import 'webrtc-adapter';
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { io } from 'socket.io-client';
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
import EmojiPicker from 'emoji-picker-react';
import './ChatRoom.css';
import { Device } from 'mediasoup-client';
import mediasoupService from '../services/MediasoupService';
import connectionStatsService from '../services/ConnectionStatsService';
import connectionRecoveryService from '../services/ConnectionRecoveryService';
import videoQualityService from '../services/VideoQualityService';
import connectionMonitorService from '../services/ConnectionMonitorService';

const SOCKET_URL = window.location.hostname === 'ruletka.top' 
  ? 'https://ruletka.top' 
  : 'http://localhost:5001';

const socket = io(SOCKET_URL, {
  transports: ['websocket'],
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
  secure: true
});

function ChatRoom() {
  const [isConnected, setIsConnected] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [peerConnection, setPeerConnection] = useState(null);
  
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

  const [chatMode, setChatMode] = useState('video');

  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [messages, setMessages] = useState([]);

  const [device, setDevice] = useState(null);
  const [producerTransport, setProducerTransport] = useState(null);
  const [consumerTransport, setConsumerTransport] = useState(null);
  const [producers, setProducers] = useState(new Map());
  const [consumers, setConsumers] = useState(new Map());

  const [isInitialized, setIsInitialized] = useState(false);

  const [connectionQuality, setConnectionQuality] = useState('good');
  const [connectionStats, setConnectionStats] = useState(null);
  const [isReconnecting, setIsReconnecting] = useState(false);
  const statsIntervalRef = useRef(null);

  const Modal = ({ title, onClose, children }) => (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{title}</h3>
          <button className="modal-close" onClick={onClose} aria-label="Закрыть"></button>
        </div>
        {children}
      </div>
    </div>
  );

  const initializeDevice = async (routerRtpCapabilities) => {
    try {
      const newDevice = new Device();
      await newDevice.load({ routerRtpCapabilities });
      setDevice(newDevice);
      return newDevice;
    } catch (error) {
      console.error('Failed to initialize device:', error);
      return null;
    }
  };

  const createSendTransport = async (transportOptions) => {
    if (!device) return null;

    try {
      const transport = device.createSendTransport(transportOptions);

      transport.on('connect', async ({ dtlsParameters }, callback, errback) => {
        try {
          await socket.emit('connectProducerTransport', { dtlsParameters });
          callback();
        } catch (error) {
          errback(error);
        }
      });

      transport.on('produce', async ({ kind, rtpParameters }, callback, errback) => {
        try {
          socket.emit('produce', { kind, rtpParameters });
          socket.once('produced', ({ id }) => callback({ id }));
        } catch (error) {
          errback(error);
        }
      });

      setProducerTransport(transport);
      return transport;
    } catch (error) {
      console.error('Failed to create send transport:', error);
      return null;
    }
  };

  const createRecvTransport = async (transportOptions) => {
    if (!device) return null;

    try {
      const transport = device.createRecvTransport(transportOptions);

      transport.on('connect', async ({ dtlsParameters }, callback, errback) => {
        try {
          await socket.emit('connectConsumerTransport', { dtlsParameters });
          callback();
        } catch (error) {
          errback(error);
        }
      });

      setConsumerTransport(transport);
      return transport;
    } catch (error) {
      console.error('Failed to create receive transport:', error);
      return null;
    }
  };

  const publishTracks = async (stream) => {
    if (!producerTransport) return;

    try {
      for (const track of stream.getTracks()) {
        const producer = await producerTransport.produce({ track });
        producers.set(producer.id, producer);
        setProducers(new Map(producers));
      }
    } catch (error) {
      console.error('Failed to publish tracks:', error);
    }
  };

  const consumeTrack = async (producerId) => {
    if (!consumerTransport) return;

    try {
      const { rtpCapabilities } = device;
      const { id, kind, rtpParameters } = await new Promise((resolve) => {
        socket.emit('consume', { producerId, rtpCapabilities });
        socket.once('consuming', resolve);
      });

      const consumer = await consumerTransport.consume({
        id,
        producerId,
        kind,
        rtpParameters
      });

      consumers.set(consumer.id, consumer);
      setConsumers(new Map(consumers));

      return consumer;
    } catch (error) {
      console.error('Failed to consume track:', error);
      return null;
    }
  };

  const initializeMedia = async () => {
    try {
      console.log('Initializing media streams...');
      const stream = await navigator.mediaDevices.getUserMedia({
        video: chatMode === 'video',
        audio: true
      });

      console.log('Got media stream:', stream.getTracks().map(t => t.kind));
      setLocalStream(stream);
      
      if (localVideoRef.current) {
        console.log('Setting local video stream');
        localVideoRef.current.srcObject = stream;
        await localVideoRef.current.play().catch(console.error);
      }

      if (producerTransport) {
        console.log('Publishing tracks to producer transport');
        for (const track of stream.getTracks()) {
          console.log('Publishing track:', track.kind);
          const producer = await mediasoupService.publish(track);
          console.log('Track published with producer ID:', producer.id);
        }
      }
    } catch (error) {
      console.error('Failed to initialize media:', error);
    }
  };

  useEffect(() => {
    socket.on('rtpCapabilities', async (routerRtpCapabilities) => {
      const newDevice = await initializeDevice(routerRtpCapabilities);
      if (newDevice) {
        console.log('Device initialized');
      }
    });

    socket.on('transportCreated', async ({ producerTransportOptions, consumerTransportOptions }) => {
      await createSendTransport(producerTransportOptions);
      await createRecvTransport(consumerTransportOptions);
      await initializeMedia();
    });

    socket.on('partnerFound', async ({ partnerId, roomId }) => {
      console.log('Partner found:', partnerId, 'in room:', roomId);
      setIsConnected(true);
      setIsSearching(false);
    });

    socket.on('partnerLeft', () => {
      setIsConnected(false);
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = null;
      }
      consumers.forEach(consumer => consumer.close());
      setConsumers(new Map());
    });

    return () => {
      socket.off('rtpCapabilities');
      socket.off('transportCreated');
      socket.off('partnerFound');
      socket.off('partnerLeft');
    };
  }, [device, producerTransport, consumerTransport]);

  const startChat = async () => {
    try {
      setIsSearching(true);
      
      // Инициализируем MediaSoup если еще не инициализирован
      if (!isInitialized) {
        await mediasoupService.init();
        setIsInitialized(true);
      }

      // Получаем медиапотоки
      const stream = await navigator.mediaDevices.getUserMedia({
        video: chatMode === 'video',
        audio: true
      });

      setLocalStream(stream);
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
        await localVideoRef.current.play().catch(console.error);
      }

      // Публикуем треки
      for (const track of stream.getTracks()) {
        await mediasoupService.publish(track);
      }

      console.log('Sending ready signal with mode:', chatMode);
      // Отправляем сигнал готовности с указанием режима
      mediasoupService.socket.emit('ready', chatMode);
    } catch (error) {
      console.error('Failed to start chat:', error);
      setIsSearching(false);
    }
  };

  const createPeerConnection = useCallback(() => {
    try {
      console.log('Creating peer connection');
      const pc = new RTCPeerConnection({
        iceServers: [
          { urls: 'stun:stun.l.google.com:19302' },
          { urls: 'stun:stun1.l.google.com:19302' }
        ]
      });

      if (localStream) {
        localStream.getTracks().forEach(track => {
          console.log('Adding track to peer connection:', track.kind);
          pc.addTrack(track, localStream);
        });
      }

      pc.onicecandidate = ({ candidate }) => {
        if (candidate && pc.remoteDescription) {
          console.log('Sending ICE candidate');
          socket.emit('ice-candidate', {
            to: pc.partnerId,
            candidate
          });
        }
      };

      pc.oniceconnectionstatechange = () => {
        console.log('ICE Connection State:', pc.iceConnectionState);
      };

      pc.ontrack = (event) => {
        console.log('Received remote track:', event.track.kind);
        setRemoteStream(event.streams[0]);
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = event.streams[0];
          remoteVideoRef.current.play().catch(console.error);
        }
      };

      return pc;
    } catch (err) {
      console.error('Error creating peer connection:', err);
      return null;
    }
  }, [localStream]);

  const startCall = async (partnerId, isInitiator) => {
    try {
      console.log('Starting call with partner:', partnerId, 'isInitiator:', isInitiator);
      const pc = createPeerConnection();
      if (!pc) return;

      pc.partnerId = partnerId;
      setPeerConnection(pc);

      if (isInitiator) {
        const offer = await pc.createOffer({
          offerToReceiveAudio: true,
          offerToReceiveVideo: chatMode === 'video'
        });
        
        console.log('Created offer:', offer.type);
        await pc.setLocalDescription(offer);
        socket.emit('offer', { to: partnerId, offer });
      }
    } catch (err) {
      console.error('Error starting call:', err);
    }
  };

  useEffect(() => {
    socket.on('connect', () => {
      console.log('Connected to server with ID:', socket.id);
    });

    socket.on('connect_error', (error) => {
      console.error('Connection error:', error);
    });

    socket.on('disconnect', (reason) => {
      console.log('Disconnected:', reason);
      setIsConnected(false);
      if (peerConnection) {
        peerConnection.close();
        setPeerConnection(null);
      }
    });

    return () => {
      socket.off('connect');
      socket.off('connect_error');
      socket.off('disconnect');
    };
  }, [peerConnection]);

  useEffect(() => {
    socket.on('partner-found', async ({ partnerId }) => {
      console.log('Partner found:', partnerId);
      setIsConnected(true);
      setIsSearching(false);
      await startCall(partnerId, true);
    });

    socket.on('offer', async ({ from, offer }) => {
      console.log('Received offer from:', from);
      try {
        const pc = createPeerConnection();
        if (!pc) return;

        pc.partnerId = from;
        setPeerConnection(pc);

        await pc.setRemoteDescription(new RTCSessionDescription(offer));
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);
        
        console.log('Sending answer');
        socket.emit('answer', { to: from, answer });
      } catch (err) {
        console.error('Error handling offer:', err);
      }
    });

    socket.on('answer', async ({ from, answer }) => {
      try {
        if (peerConnection && peerConnection.signalingState === 'have-local-offer') {
          await peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
        } else {
          console.warn('Received answer in wrong state:', peerConnection?.signalingState);
        }
      } catch (err) {
        console.error('Error setting remote description:', err);
      }
    });

    socket.on('ice-candidate', async ({ from, candidate }) => {
      try {
        if (peerConnection && peerConnection.remoteDescription) {
          await peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
        } else {
          console.warn('Received ICE candidate before remote description');
        }
      } catch (err) {
        console.error('Error adding ICE candidate:', err);
      }
    });

    socket.on('partner-left', () => {
      if (peerConnection) {
        peerConnection.close();
      }
      setPeerConnection(null);
      setRemoteStream(null);
      setIsConnected(false);
    });

    return () => {
      socket.off('partner-found');
      socket.off('offer');
      socket.off('answer');
      socket.off('ice-candidate');
      socket.off('partner-left');
    };
  }, [peerConnection, createPeerConnection, chatMode]);

  const toggleMic = () => {
    if (localStream) {
      const audioTrack = localStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsMuted(!audioTrack.enabled);
        
        const audioProducer = Array.from(producers.values())
          .find(p => p.track.kind === 'audio');
        if (audioProducer) {
          audioProducer.pause();
        }
      }
    }
  };

  const toggleVideo = () => {
    if (localStream && chatMode === 'video') {
      const videoTrack = localStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoOff(!videoTrack.enabled);
        
        const videoProducer = Array.from(producers.values())
          .find(p => p.track.kind === 'video');
        if (videoProducer) {
          videoProducer.pause();
        }
      }
    }
  };

  const sendMessage = (e) => {
    e.preventDefault();
    if (inputMessage.trim() && isConnected && peerConnection) {
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
    if (peerConnection && isConnected) {
      socket.emit('handRaised', { raised: !handRaised });
    }
  };

  const sendNotification = () => {
    setNotificationSent(true);
    if (peerConnection && isConnected) {
      socket.emit('notification');
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

  const switchMode = async (mode) => {
    if (!isSearching) {
      setChatMode(mode);
      
      producers.forEach(producer => producer.close());
      setProducers(new Map());

      if (localStream) {
        localStream.getTracks().forEach(track => track.stop());
      }

      try {
        const newStream = await navigator.mediaDevices.getUserMedia({
          video: mode === 'video',
          audio: true
        });

        setLocalStream(newStream);
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = newStream;
          await localVideoRef.current.play().catch(console.error);
        }

        const tracks = newStream.getTracks();
        for (const track of tracks) {
          const producer = await mediasoupService.publish(track);
          producers.set(producer.id, producer);
        }
        setProducers(new Map(producers));

      } catch (error) {
        console.error('Failed to switch mode:', error);
      }
    }
  };

  useEffect(() => {
    if (localVideoRef.current) {
      localVideoRef.current.onerror = (err) => {
        console.error('Local video error:', err);
      };
    }
    if (remoteVideoRef.current) {
      remoteVideoRef.current.onerror = (err) => {
        console.error('Remote video error:', err);
      };
    }
  }, []);

  useEffect(() => {
    // Проверяем доступность устройств при загрузке
    async function checkDevices() {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const hasAudio = devices.some(device => device.kind === 'audioinput');
        const hasVideo = devices.some(device => device.kind === 'videoinput');
        
        console.log('Available devices:', {
          audio: hasAudio,
          video: hasVideo
        });
      } catch (err) {
        console.error('Error checking devices:', err);
      }
    }
    
    checkDevices();
  }, []);

  // Инициализация MediaSoup и медиапотоков
  useEffect(() => {
    const initializeMediaSoup = async () => {
      try {
        await mediasoupService.init();
        setIsInitialized(true);
        console.log('MediaSoup initialized');

        // Подписываемся на события сокета
        mediasoupService.socket.on('connect', () => {
          console.log('Connected to MediaSoup server');
        });

        mediasoupService.socket.on('partnerFound', async ({ partnerId, roomId }) => {
          console.log('Partner found:', partnerId, 'in room:', roomId);
          setIsConnected(true);
          setIsSearching(false);
        });

        mediasoupService.socket.on('partnerLeft', () => {
          setIsConnected(false);
          if (remoteVideoRef.current) {
            remoteVideoRef.current.srcObject = null;
          }
          consumers.forEach(consumer => consumer.close());
          setConsumers(new Map());
        });

      } catch (error) {
        console.error('Failed to initialize MediaSoup:', error);
      }
    };

    initializeMediaSoup();

    return () => {
      mediasoupService.close();
    };
  }, []);

  // Инициализация медиа при изменении режима
  useEffect(() => {
    const initializeMedia = async () => {
      if (!isInitialized) return;

      try {
        // Получаем медиапотоки
        const stream = await navigator.mediaDevices.getUserMedia({
          video: chatMode === 'video',
          audio: true
        });

        setLocalStream(stream);
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
          await localVideoRef.current.play().catch(console.error);
        }

        // Публикуем треки
        const tracks = stream.getTracks();
        for (const track of tracks) {
          const producer = await mediasoupService.publish(track);
          producers.set(producer.id, producer);
        }
        setProducers(new Map(producers));

      } catch (error) {
        console.error('Failed to initialize media:', error);
      }
    };

    initializeMedia();

    return () => {
      if (localStream) {
        localStream.getTracks().forEach(track => track.stop());
      }
      producers.forEach(producer => producer.close());
    };
  }, [chatMode, isInitialized]);

  useEffect(() => {
    if (isConnected) {
      connectionMonitorService.startMonitoring(mediasoupService.socket, handleConnectionTimeout);
      startStatsMonitoring();
    } else {
      connectionMonitorService.stopMonitoring();
      stopStatsMonitoring();
    }

    return () => {
      connectionMonitorService.stopMonitoring();
      stopStatsMonitoring();
    };
  }, [isConnected]);

  const startStatsMonitoring = () => {
    statsIntervalRef.current = setInterval(async () => {
      if (producerTransport) {
        const stats = await connectionStatsService.getStats(producerTransport);
        setConnectionStats(stats);
        setConnectionQuality(connectionStatsService.getConnectionQuality());
        
        // Адаптивное качество видео
        const videoProducer = Array.from(producers.values())
          .find(p => p.track.kind === 'video');
        if (videoProducer) {
          await videoQualityService.adjustQuality(videoProducer, connectionStatsService);
        }
      }
    }, 1000);
  };

  const stopStatsMonitoring = () => {
    if (statsIntervalRef.current) {
      clearInterval(statsIntervalRef.current);
      statsIntervalRef.current = null;
    }
  };

  const handleConnectionTimeout = async () => {
    setIsReconnecting(true);
    
    const hasNetwork = await connectionMonitorService.checkNetworkQuality();
    if (!hasNetwork) {
      setIsConnected(false);
      return;
    }

    try {
      await connectionRecoveryService.handleDisconnect(
        mediasoupService,
        async () => {
          setIsReconnecting(false);
          await initializeMedia();
          setIsConnected(true);
        },
        (error) => {
          console.error('Failed to reconnect:', error);
          setIsConnected(false);
          setIsReconnecting(false);
        }
      );
    } catch (error) {
      console.error('Connection recovery failed:', error);
      setIsConnected(false);
      setIsReconnecting(false);
    }
  };

  const StatsModal = () => (
    <Modal title="Статистика соединения" onClose={() => setActiveModal(null)}>
      <div className="stats-container">
        <div className="stats-item">
          <span>Качество соединения:</span>
          <span className={`quality-indicator ${connectionQuality}`}>
            {connectionQuality.toUpperCase()}
          </span>
        </div>
        {connectionStats && (
          <>
            <div className="stats-item">
              <span>Скорость передачи:</span>
              <span>{Math.round(connectionStats.bitrate / 1000)} Кбит/с</span>
            </div>
            <div className="stats-item">
              <span>Потеряно пакетов:</span>
              <span>{connectionStats.packetsLost}</span>
            </div>
            <div className="stats-item">
              <span>Задержка:</span>
              <span>{Math.round(connectionStats.roundTripTime * 1000)} мс</span>
            </div>
            <div className="stats-item">
              <span>Джиттер:</span>
              <span>{Math.round(connectionStats.jitter * 1000)} мс</span>
            </div>
            <div className="stats-item">
              <span>Разрешение:</span>
              <span>{connectionStats.resolution.width}x{connectionStats.resolution.height}</span>
            </div>
          </>
        )}
      </div>
    </Modal>
  );

  const nextPartner = () => {
    if (isConnected) {
      // Закрываем текущие соединения
      producers.forEach(producer => producer.close());
      consumers.forEach(consumer => consumer.close());
      setProducers(new Map());
      setConsumers(new Map());
      
      // Очищаем видео
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = null;
      }
      
      setIsConnected(false);
      setIsSearching(true);
      
      // Запускаем поиск нового партнера
      mediasoupService.socket.emit('findPartner');
    }
  };

  useEffect(() => {
    mediasoupService.socket.on('newProducer', async ({ producerId, kind }) => {
      console.log('New producer available:', producerId, 'kind:', kind);
      try {
        const consumer = await mediasoupService.consume(producerId);
        console.log('Created consumer:', consumer.id, 'for producer:', producerId);
        
        if (consumer && consumer.track) {
          console.log('Got remote track:', consumer.track.kind);
          const stream = remoteStream || new MediaStream();
          stream.addTrack(consumer.track);
          setRemoteStream(stream);
          
          if (remoteVideoRef.current) {
            console.log('Setting remote video stream');
            remoteVideoRef.current.srcObject = stream;
            await remoteVideoRef.current.play().catch(console.error);
          }
        }
      } catch (error) {
        console.error('Error consuming producer:', error);
      }
    });
  }, [remoteStream]);

  useEffect(() => {
    if (peerConnection) {
      peerConnection.onconnectionstatechange = () => {
        console.log('Connection state:', peerConnection.connectionState);
      };
      
      peerConnection.oniceconnectionstatechange = () => {
        console.log('ICE connection state:', peerConnection.iceConnectionState);
      };
      
      peerConnection.onicegatheringstatechange = () => {
        console.log('ICE gathering state:', peerConnection.iceGatheringState);
      };
      
      peerConnection.onsignalingstatechange = () => {
        console.log('Signaling state:', peerConnection.signalingState);
      };
    }
  }, [peerConnection]);

  return (
    <div className={`chat-room ${theme}`}>
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

      <div className="video-grid">
        <div 
          className="video-box"
          style={{ height: `${leftVideoHeight}px` }}
        >
          <video ref={remoteVideoRef} autoPlay playsInline />
          <div className="video-label">Собеседник</div>
          {chatMode === 'audio' && !isSearching && (
            <div className="audio-mode-overlay">
              <div className="audio-mode-content">
                <BsMicFill size={50} />
                <span>Аудио чат</span>
              </div>
            </div>
          )}
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
          <video 
            ref={localVideoRef} 
            autoPlay 
            muted 
            playsInline 
            style={{ 
              transform: 'scaleX(-1)',
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              display: chatMode === 'audio' ? 'none' : 'block'
            }}
          />
          {chatMode === 'audio' && (
            <div className="audio-mode-overlay">
              <div className="audio-mode-content">
                <BsMicFill size={50} />
                <span>Аудио чат</span>
              </div>
            </div>
          )}
          <div className="video-label">Вы</div>
          <div className="video-controls">
            <button 
              onClick={toggleMic} 
              className={isMuted ? 'active' : ''} 
              data-tooltip={isMuted ? 'Включить микрофон' : 'Выключить микрофон'}
            >
              {isMuted ? <BsMicMuteFill size={24} /> : <BsMicFill size={24} />}
            </button>
            {chatMode === 'video' && (
              <>
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
              </>
            )}
            <button 
              onClick={sendNotification} 
              className={notificationSent ? 'active' : ''} 
              data-tooltip="Привлечь внимание"
            >
              <MdNotifications size={24} />
            </button>
            {chatMode === 'video' && (
              <button 
                onClick={toggleHand} 
                className={handRaised ? 'active' : ''} 
                data-tooltip={handRaised ? 'Опустить руку' : 'Поднять руку'}
              >
                <MdPanTool size={24} />
              </button>
            )}
          </div>
          <div className="resize-handle" onMouseDown={(e) => handleResize('right', e)} />
        </div>
      </div>

      <div className="controls-section">
        <div className="controls-buttons">
          <div className="chat-controls">
            {!isConnected && !isSearching && (
              <button onClick={startChat} className="start-chat">
                Рулетим
              </button>
            )}
            {isSearching && (
              <button onClick={() => {
                setIsSearching(false);
                socket.emit('cancelSearch');
              }} className="cancel-search">
                Отменить поиск
              </button>
            )}
            <div className="mode-switcher">
              <button 
                className={`mode-btn ${chatMode === 'audio' ? 'active' : ''}`}
                onClick={() => switchMode('audio')}
                disabled={isSearching}
              >
                <BsMicFill size={20} />
                <span>Аудио</span>
              </button>
              <button 
                className={`mode-btn ${chatMode === 'video' ? 'active' : ''}`}
                onClick={() => switchMode('video')}
                disabled={isSearching}
              >
                <BsCameraVideoFill size={20} />
                <span>Видео</span>
              </button>
            </div>
          </div>
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

      {isReconnecting && (
        <div className="reconnecting-overlay">
          <div className="reconnecting-message">
            <h3>Переподключение...</h3>
            <div className="reconnecting-spinner"></div>
            <p>Пытаемся восстановить соединение</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default ChatRoom; 