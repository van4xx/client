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
    this.isSearching = false;
  }

  init(serverUrl = window.location.protocol === 'https:' ? 'https://ruletka.top' : 'http://localhost:5000') {
    console.log('Initializing WebRTC service with server:', serverUrl);
    
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }

    const socketOptions = {
      transports: ['polling', 'websocket'],
      path: '/socket.io/',
      secure: window.location.protocol === 'https:',
      rejectUnauthorized: false,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      timeout: 20000,
      autoConnect: true,
      forceNew: true,
      closeOnBeforeunload: true
    };

    try {
      this.socket = io(serverUrl, socketOptions);
    } catch (error) {
      console.error('Failed to initialize socket:', error);
      return;
    }
    
    this.socket.on('connect', () => {
      console.log('Connected to signaling server');
      this.isSearching = false;
    });

    this.socket.on('connect_error', (error) => {
      console.error('Connection error:', error);
      console.error('Connection error details:', {
        url: serverUrl,
        transport: this.socket.io.opts.transports,
        error: error.message
      });
      
      if (this.socket.io.opts.transports[0] === 'websocket') {
        console.log('Switching to polling transport...');
        this.socket.io.opts.transports = ['polling'];
      }
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
          this.destroyPeer();
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
      this.destroyPeer();
    });

    window.addEventListener('beforeunload', () => {
      this.disconnect();
    });
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
        reconnectTimer: 3000,
        iceCompleteTimeout: 5000,
        streams: [this.stream],
        config: {
          iceServers: [
            { 
              urls: [
                'stun:stun.l.google.com:19302',
                'stun:stun1.l.google.com:19302',
                'stun:stun2.l.google.com:19302',
                'stun:stun3.l.google.com:19302',
                'stun:stun4.l.google.com:19302'
              ]
            },
            {
              urls: 'turn:numb.viagenie.ca',
              username: 'webrtc@live.com',
              credential: 'muazkh'
            }
          ],
          iceTransportPolicy: 'all',
          iceCandidatePoolSize: 10,
          bundlePolicy: 'max-bundle',
          rtcpMuxPolicy: 'require',
          sdpSemantics: 'unified-plan'
        }
      };

      this.peer = new Peer(peerConfig);

      // Connection state monitoring
      let iceConnectionTimeout;
      let iceGatheringTimeout;
      let connectionTimeout;

      this.peer.on('signal', signal => {
        if (this.socket && this.socket.connected) {
          console.log('Sending signal:', signal);
          this.socket.emit('signal', { signal });
        }
      });

      this.peer.on('connect', () => {
        console.log('Peer connection established');
        this.isSearching = false;
        clearTimeout(connectionTimeout);
      });

      this.peer.on('stream', stream => {
        console.log('Received remote stream:', stream);
        if (stream && stream.active && this.onStreamCallback) {
          this.onStreamCallback(stream);
        }
      });

      this.peer.on('track', (track, stream) => {
        console.log('Received track:', track, 'in stream:', stream);
      });

      this.peer.on('iceStateChange', (iceConnectionState) => {
        console.log('ICE connection state:', iceConnectionState);
        
        if (iceConnectionState === 'checking') {
          clearTimeout(iceConnectionTimeout);
          iceConnectionTimeout = setTimeout(() => {
            console.log('ICE connection timeout');
            this.destroyPeer();
          }, 10000);
        } else if (iceConnectionState === 'connected' || iceConnectionState === 'completed') {
          clearTimeout(iceConnectionTimeout);
        } else if (iceConnectionState === 'failed' || iceConnectionState === 'disconnected' || iceConnectionState === 'closed') {
          console.log('ICE connection failed/closed');
          this.destroyPeer();
        }
      });

      this.peer.on('data', data => {
        if (!data) return;
        try {
          const message = typeof data === 'string' ? data : new TextDecoder().decode(data);
          console.log('Received data:', message);
          if (this.onChatMessageCallback) {
            this.onChatMessageCallback(message);
          }
        } catch (error) {
          console.error('Error handling data:', error);
        }
      });

      this.peer.on('error', err => {
        console.error('Peer error:', err);
        this.destroyPeer();
      });

      this.peer.on('close', () => {
        console.log('Peer connection closed');
        clearTimeout(iceConnectionTimeout);
        clearTimeout(iceGatheringTimeout);
        clearTimeout(connectionTimeout);
        this.destroyPeer();
      });

      // Set connection establishment timeout
      connectionTimeout = setTimeout(() => {
        console.log('Connection establishment timeout');
        this.destroyPeer();
      }, 15000);

    } catch (error) {
      console.error('Error initializing peer:', error);
      this.destroyPeer();
    }
  }

  setStream(stream) {
    console.log('Setting local stream');
    this.stream = stream;
    if (this.peer && this.stream) {
      this.peer.addStream(stream);
    }
  }

  startSearch(mode = 'video') {
    if (this.isSearching) {
      console.log('Already searching, ignoring request');
      return;
    }
    
    console.log('Starting search in mode:', mode);
    this.isSearching = true;
    this.socket.emit('start_search', { mode });
  }

  stopSearch() {
    console.log('Stopping search');
    this.isSearching = false;
    this.socket.emit('stop_search');
    this.destroyPeer();
  }

  nextPartner(mode = 'video') {
    console.log('Finding next partner in mode:', mode);
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
  }
}

export default new WebRTCService(); 