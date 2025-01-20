import io from 'socket.io-client';
import Peer from 'simple-peer';

// Polyfill for process
if (typeof window !== 'undefined') {
  window.process = {
    env: {},
    nextTick: function(fn) { setTimeout(fn, 0); }
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
    
    this.socket = io(serverUrl, {
      transports: ['websocket', 'polling'],
      path: '/socket.io/',
      secure: true,
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      timeout: 20000,
      autoConnect: true,
      withCredentials: true,
      forceNew: true,
      closeOnBeforeunload: true
    });
    
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
      
      if (this.socket.io.opts.transports.includes('websocket')) {
        console.log('Retrying with polling transport...');
        this.socket.io.opts.transports = ['polling'];
      }
    });
    
    this.socket.on('disconnect', (reason) => {
      console.log('Disconnected from server:', reason);
      this.isSearching = false;
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

    const peerConfig = {
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
      },
      sdpTransform: (sdp) => {
        const lines = sdp.split('\r\n');
        const filtered = lines.filter(line => !line.includes('tcp'));
        return filtered.join('\r\n');
      }
    };

    try {
      this.peer = new Peer(peerConfig);

      this.peer.on('signal', signal => {
        try {
          console.log('Generated signal:', signal);
          this.socket.emit('signal', { signal });
        } catch (error) {
          console.error('Error sending signal:', error);
          this.destroyPeer();
        }
      });

      this.peer.on('stream', stream => {
        try {
          console.log('Received remote stream');
          if (this.onStreamCallback) {
            this.onStreamCallback(stream);
          }
        } catch (error) {
          console.error('Error handling remote stream:', error);
        }
      });

      this.peer.on('data', data => {
        try {
          if (data instanceof Uint8Array) {
            const message = new TextDecoder().decode(data);
            console.log('Received data:', message);
            if (this.onChatMessageCallback) {
              this.onChatMessageCallback(message);
            }
          }
        } catch (error) {
          console.error('Error handling data:', error);
        }
      });

      this.peer.on('connect', () => {
        console.log('Peer connection established');
        this.isSearching = false;
      });

      this.peer.on('error', err => {
        console.error('Peer error:', err);
        this.destroyPeer();
      });

      this.peer.on('close', () => {
        console.log('Peer connection closed');
        this.destroyPeer();
      });
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
      console.log('Destroying peer connection');
      try {
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
    console.log('Disconnecting from service');
    this.destroyPeer();
    if (this.socket) {
      this.socket.emit('stop_search');
      this.socket.disconnect();
      this.socket = null;
    }
  }
}

export default new WebRTCService(); 