import io from 'socket.io-client';
import Peer from 'simple-peer';

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

  init(serverUrl = process.env.REACT_APP_SERVER_URL || 'http://localhost:5000') {
    console.log('Initializing WebRTC service with server:', serverUrl);
    
    this.socket = io(serverUrl, {
      transports: ['websocket', 'polling'],
      reconnectionDelayMax: 10000,
      reconnectionAttempts: 10,
      path: '/socket.io',
      cors: {
        origin: "*",
        credentials: true
      },
      forceNew: true
    });
    
    this.socket.on('connect', () => {
      console.log('Connected to signaling server');
    });

    this.socket.on('connect_error', (error) => {
      console.error('Connection error:', error);
      console.error('Connection error details:', {
        url: serverUrl,
        transport: this.socket.io.opts.transports,
        error: error.message
      });
      
      // Попробуем переподключиться с другими параметрами
      if (this.socket.io.opts.transports.includes('websocket')) {
        console.log('Retrying with polling transport...');
        this.socket.io.opts.transports = ['polling'];
      }
    });
    
    this.socket.on('partner_found', ({ initiator }) => {
      console.log('Partner found, initiator:', initiator);
      this.initializePeer(initiator);
    });

    this.socket.on('signal', ({ signal }) => {
      console.log('Received signal:', signal);
      if (this.peer) {
        this.peer.signal(signal);
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
  }

  initializePeer(initiator) {
    console.log('Initializing peer connection, initiator:', initiator);
    
    if (this.peer) {
      console.log('Destroying existing peer connection');
      this.peer.destroy();
    }

    if (!this.stream) {
      console.warn('No local stream available');
      return;
    }

    this.peer = new Peer({
      initiator,
      stream: this.stream,
      trickle: false,
      config: {
        iceServers: [
          { urls: 'stun:stun.l.google.com:19302' },
          { urls: 'stun:global.stun.twilio.com:3478' },
          { urls: 'stun:stun1.l.google.com:19302' },
          { urls: 'stun:stun2.l.google.com:19302' },
          { urls: 'stun:stun3.l.google.com:19302' },
          { urls: 'stun:stun4.l.google.com:19302' }
        ]
      }
    });

    this.peer.on('signal', signal => {
      console.log('Generated signal:', signal);
      this.socket.emit('signal', { signal });
    });

    this.peer.on('stream', stream => {
      console.log('Received remote stream');
      if (this.onStreamCallback) {
        this.onStreamCallback(stream);
      }
    });

    this.peer.on('connect', () => {
      console.log('Peer connection established');
    });

    this.peer.on('error', err => {
      console.error('Peer error:', err);
      this.destroyPeer();
    });

    this.peer.on('close', () => {
      console.log('Peer connection closed');
      this.destroyPeer();
    });
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
      console.log('Destroying peer connection');
      this.peer.destroy();
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
    console.log('Disconnecting from service');
    if (this.socket) {
      this.socket.disconnect();
    }
    this.destroyPeer();
  }
}

export default new WebRTCService(); 