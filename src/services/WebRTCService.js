import io from 'socket.io-client';
import Peer from 'simple-peer/simplepeer.min.js';

// Polyfill for process and streams
if (typeof window !== 'undefined') {
  window.process = {
    env: { NODE_ENV: 'production' },
    nextTick: function(fn) { setTimeout(fn, 0); },
    version: '',
    versions: { node: '12.0.0' }
  };

  // Stream polyfill
  if (!window.stream) {
    window.stream = {};
  }
  window.stream.Readable = class {
    pipe() { return this; }
    on() { return this; }
    resume() { return this; }
    read() { return null; }
  };
}

class WebRTCService {
  constructor() {
    this.socket = null;
    this.peer = null;
    this.stream = null;
    this.onStreamCallback = null;
    this.onChatMessageCallback = null;
    this.onConnectionClosedCallback = null;
    this.onSearchStatusCallback = null;
    this.isSearching = false;
    this.isReconnecting = false;
    this.intentionalClose = false;
    this.currentMode = null;
  }

  init(serverUrl = window.location.protocol === 'https:' ? 'https://ruletka.top' : 'http://localhost:5000') {
    console.log('Initializing WebRTC service with server:', serverUrl);
    
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }

    const socketOptions = {
      transports: ['websocket'],
      path: '/socket.io/',
      secure: window.location.protocol === 'https:',
      rejectUnauthorized: false,
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      timeout: 20000,
      autoConnect: true,
      forceNew: true,
      closeOnBeforeunload: false,
      pingTimeout: 60000,
      pingInterval: 25000,
      upgrade: false
    };

    try {
      this.socket = io(serverUrl, socketOptions);

      this.socket.io.on("reconnect_attempt", (attempt) => {
        console.log('Reconnection attempt:', attempt);
      });

      this.socket.io.on("reconnect", (attempt) => {
        console.log('Reconnected after', attempt, 'attempts');
        if (this.isSearching) {
          this.startSearch(this.currentMode || 'video');
        }
      });

      this.socket.io.on("reconnect_error", (error) => {
        console.log('Reconnection error:', error);
      });

      this.socket.on('connect', () => {
        console.log('Connected to signaling server');
        this.isSearching = false;
      });

      this.socket.on('connect_error', (error) => {
        console.error('Connection error:', error);
      });
      
      this.socket.on('disconnect', (reason) => {
        console.log('Disconnected from server:', reason);
        this.isSearching = false;
        this.destroyPeer();
      });

      this.socket.on('partner_found', ({ initiator }) => {
        console.log('Partner found, initiator:', initiator);
        this.initializePeer(initiator);
      });

      this.socket.on('signal', ({ signal }) => {
        console.log('Received signal:', signal);
        if (this.peer && !this.peer.destroyed) {
          try {
            this.peer.signal(signal);
          } catch (error) {
            console.error('Error processing signal:', error);
          }
        }
      });

      this.socket.on('chat_message', ({ message }) => {
        console.log('Received chat message:', message);
        if (this.onChatMessageCallback) {
          this.onChatMessageCallback(message);
        }
      });

      this.socket.on('connection_closed', () => {
        console.log('Connection closed by partner');
        if (this.onConnectionClosedCallback) {
          this.onConnectionClosedCallback();
        }
      });

    } catch (error) {
      console.error('Failed to initialize socket:', error);
      return;
    }
  }

  async setStream(stream) {
    console.log('Setting local stream');
    
    try {
      // Проверяем доступность устройств
      const devices = await navigator.mediaDevices.enumerateDevices();
      const hasAudio = devices.some(device => device.kind === 'audioinput');
      const hasVideo = devices.some(device => device.kind === 'videoinput');
      
      console.log('Available devices:', {
        audio: hasAudio,
        video: hasVideo,
        devices: devices.map(d => ({ kind: d.kind, label: d.label }))
      });

      // Проверяем треки входящего стрима
      const audioTracks = stream.getAudioTracks();
      const videoTracks = stream.getVideoTracks();

      console.log('Input stream tracks:', {
        audio: audioTracks.map(t => ({
          enabled: t.enabled,
          muted: t.muted,
          readyState: t.readyState,
          settings: t.getSettings()
        })),
        video: videoTracks.map(t => ({
          enabled: t.enabled,
          muted: t.muted,
          readyState: t.readyState,
          settings: t.getSettings()
        }))
      });

      // Активируем треки
      audioTracks.forEach(track => {
        track.enabled = true;
        track.onended = () => console.log('Local audio track ended');
        track.onmute = () => console.log('Local audio track muted');
        track.onunmute = () => console.log('Local audio track unmuted');
      });

      videoTracks.forEach(track => {
        track.enabled = true;
        track.onended = () => console.log('Local video track ended');
        track.onmute = () => console.log('Local video track muted');
        track.onunmute = () => console.log('Local video track unmuted');
      });

      this.stream = stream;

      // Если peer уже существует, добавляем стрим
      if (this.peer) {
        try {
          // Удаляем старые треки
          const senders = this.peer._pc.getSenders();
          await Promise.all(senders.map(sender => this.peer._pc.removeTrack(sender)));
          
          // Добавляем новые треки
          stream.getTracks().forEach(track => {
            this.peer.addTrack(track, stream);
          });
        } catch (error) {
          console.error('Error updating stream in peer:', error);
        }
      }
    } catch (error) {
      console.error('Error setting stream:', error);
    }
  }

  initializePeer(initiator) {
    console.log('Initializing peer connection, initiator:', initiator);
    
    if (this.peer) {
      this.destroyPeer();
    }

    if (!this.stream) {
      console.warn('No local stream available');
      return;
    }

    try {
      const peerConfig = {
        initiator,
        trickle: true,
        streams: [this.stream],
        reconnectTimer: 1000,
        iceCompleteTimeout: 5000,
        config: {
          iceServers: [
            {
              urls: [
                'stun:ruletka.top:3478'
              ]
            },
            {
              urls: [
                'turn:ruletka.top:3478',
                'turn:ruletka.top:3478?transport=tcp'
              ],
              username: 'webrtc',
              credential: 'webrtc123'
            }
          ],
          iceTransportPolicy: 'all',
          bundlePolicy: 'max-bundle',
          rtcpMuxPolicy: 'require',
          sdpSemantics: 'unified-plan',
          enableDtlsSrtp: true,
          iceCandidatePoolSize: 10
        }
      };

      this.peer = new Peer(peerConfig);

      let iceConnectionTimeout;
      let isConnected = false;

      this.peer.on('signal', signal => {
        if (this.socket && this.socket.connected) {
          console.log('Sending signal:', signal);
          this.socket.emit('signal', { signal });
        }
      });

      this.peer.on('connect', () => {
        console.log('Peer connection established');
        isConnected = true;
        this.isSearching = false;
        if (this.onSearchStatusCallback) {
          this.onSearchStatusCallback(false);
        }
        clearTimeout(iceConnectionTimeout);
      });

      this.peer.on('error', err => {
        console.error('Peer error:', err);
        if (err.message === 'Connection failed.' && !isConnected) {
          console.log('Connection failed, trying to reconnect...');
          this.reconnectPeer();
        }
      });

      this.peer.on('iceStateChange', (iceConnectionState) => {
        console.log('ICE connection state:', iceConnectionState);
        
        if (iceConnectionState === 'checking') {
          clearTimeout(iceConnectionTimeout);
          iceConnectionTimeout = setTimeout(() => {
            if (!isConnected && this.peer && !this.peer.destroyed) {
              console.log('ICE connection timeout, reconnecting...');
              this.reconnectPeer();
            }
          }, 10000);
        } else if (iceConnectionState === 'connected' || iceConnectionState === 'completed') {
          console.log('ICE connection established');
          isConnected = true;
          clearTimeout(iceConnectionTimeout);
        } else if (iceConnectionState === 'disconnected') {
          console.log('ICE connection disconnected');
          if (isConnected) {
            // Даем шанс на автоматическое восстановление
            setTimeout(() => {
              if (this.peer && !this.peer.destroyed && this.peer._pc.iceConnectionState === 'disconnected') {
                console.log('Connection not restored, reconnecting...');
                this.reconnectPeer();
              }
            }, 5000);
          }
        } else if (iceConnectionState === 'failed') {
          console.log('ICE connection failed');
          this.reconnectPeer();
        }
      });

      this.peer.on('close', () => {
        console.log('Peer connection closed');
        this.handleConnectionClosed();
      });

    } catch (error) {
      console.error('Error initializing peer:', error);
      this.destroyPeer();
    }
  }

  startSearch(mode) {
    this.currentMode = mode;
    this.intentionalClose = false;
    if (this.isSearching) {
      console.log('Already searching, ignoring request');
      return;
    }
    
    if (!this.socket || !this.socket.connected) {
      console.log('Socket not connected, reconnecting...');
      this.init();
      this.socket.once('connect', () => {
        console.log('Socket reconnected, starting search');
        this.startSearch(mode);
      });
      return;
    }
    
    console.log('Starting search in mode:', mode);
    this.isSearching = true;
    if (this.onSearchStatusCallback) {
      this.onSearchStatusCallback(true);
    }
    this.socket.emit('start_search', { mode });
  }

  stopSearch() {
    this.intentionalClose = true;
    console.log('Stopping search');
    this.isSearching = false;
    if (this.onSearchStatusCallback) {
      this.onSearchStatusCallback(false);
    }
    this.socket.emit('stop_search');
    this.destroyPeer();
  }

  nextPartner(mode = 'video') {
    console.log('Finding next partner in mode:', mode);
    this.isSearching = true;
    if (this.onSearchStatusCallback) {
      this.onSearchStatusCallback(true);
    }
    this.socket.emit('next', { mode });
  }

  sendMessage(message) {
    console.log('Sending chat message:', message);
    this.socket.emit('chat_message', { message });
  }

  destroyPeer() {
    if (this.peer) {
      try {
        this.peer.removeAllListeners();
        this.peer.destroy();
      } catch (error) {
        console.error('Error destroying peer:', error);
      }
      this.peer = null;
    }
    this.isSearching = false;
  }

  onStream(callback) {
    this.onStreamCallback = callback;
  }

  onChatMessage(callback) {
    this.onChatMessageCallback = callback;
  }

  onConnectionClosed(callback) {
    this.onConnectionClosedCallback = callback;
    if (this.peer) {
      this.peer.on('close', () => {
        console.log('Peer connection closed');
        this.handleConnectionClosed();
      });

      this.peer.on('error', (err) => {
        console.error('Peer error:', err);
        if (err.message.includes('User-Initiated Abort')) {
          // Пытаемся переподключиться
          this.reconnectPeer();
        }
      });
    }
  }

  reconnectPeer() {
    if (this.isReconnecting) return;
    this.isReconnecting = true;

    console.log('Attempting to reconnect peer...');
    
    // Очищаем старое соединение
    if (this.peer) {
      this.peer.destroy();
      this.peer = null;
    }

    // Переподключаем Socket.IO если нужно
    if (!this.socket || !this.socket.connected) {
      this.init();
    }

    // Пытаемся переподключиться через короткий интервал
    setTimeout(() => {
      if (this.stream) {
        this.setStream(this.stream);
        if (this.currentMode) {
          this.startSearch(this.currentMode);
        }
      }
      this.isReconnecting = false;
    }, 1000);
  }

  handleConnectionClosed() {
    if (this.onConnectionClosedCallback) {
      this.onConnectionClosedCallback();
    }
    
    // Если соединение закрылось не по нашей инициативе, пытаемся переподключиться
    if (!this.intentionalClose) {
      this.reconnectPeer();
    }
  }

  onSearchStatus(callback) {
    this.onSearchStatusCallback = callback;
  }

  disconnect() {
    this.destroyPeer();
    if (this.socket) {
      try {
        this.socket.emit('stop_search');
        this.socket.disconnect();
      } catch (error) {
        console.error('Error disconnecting socket:', error);
      }
      this.socket = null;
    }
    this.isSearching = false;
    if (this.onSearchStatusCallback) {
      this.onSearchStatusCallback(false);
    }
  }
}

export default new WebRTCService(); 