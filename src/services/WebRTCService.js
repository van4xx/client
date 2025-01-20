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
  }

  init(serverUrl = 'http://localhost:5000') {
    this.socket = io(serverUrl);
    
    this.socket.on('partner_found', ({ initiator }) => {
      console.log('Partner found, initiator:', initiator);
      this.initializePeer(initiator);
    });

    this.socket.on('signal', ({ signal }) => {
      if (this.peer) {
        this.peer.signal(signal);
      }
    });

    this.socket.on('chat_message', ({ message }) => {
      if (this.onChatMessageCallback) {
        this.onChatMessageCallback(message);
      }
    });

    this.socket.on('connection_closed', () => {
      if (this.onConnectionClosedCallback) {
        this.onConnectionClosedCallback();
      }
      this.destroyPeer();
    });
  }

  initializePeer(initiator) {
    if (this.peer) {
      this.peer.destroy();
    }

    this.peer = new Peer({
      initiator,
      stream: this.stream,
      trickle: false,
      config: {
        iceServers: [
          { urls: 'stun:stun.l.google.com:19302' },
          { urls: 'stun:global.stun.twilio.com:3478' }
        ]
      }
    });

    this.peer.on('signal', signal => {
      this.socket.emit('signal', { signal });
    });

    this.peer.on('stream', stream => {
      if (this.onStreamCallback) {
        this.onStreamCallback(stream);
      }
    });

    this.peer.on('error', err => {
      console.error('Peer error:', err);
      this.destroyPeer();
    });
  }

  setStream(stream) {
    this.stream = stream;
    if (this.peer) {
      this.peer.addStream(stream);
    }
  }

  startSearch(mode = 'video') {
    this.socket.emit('start_search', { mode });
  }

  stopSearch() {
    this.socket.emit('stop_search');
    this.destroyPeer();
  }

  nextPartner(mode = 'video') {
    this.socket.emit('next', { mode });
  }

  sendMessage(message) {
    this.socket.emit('chat_message', { message });
  }

  destroyPeer() {
    if (this.peer) {
      this.peer.destroy();
      this.peer = null;
    }
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
    if (this.socket) {
      this.socket.disconnect();
    }
    this.destroyPeer();
  }
}

export default new WebRTCService(); 