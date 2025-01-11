import io from 'socket.io-client';

class MatchmakingService {
  constructor() {
    this.socket = io(process.env.REACT_APP_SERVER_URL || 'http://localhost:5001');
    this.currentChannel = null;
  }

  startSearch(mode) {
    return new Promise((resolve) => {
      this.socket.emit('findPartner', { mode });
      this.socket.once('matchFound', ({ channelName }) => {
        this.currentChannel = channelName;
        resolve(channelName);
      });
    });
  }

  cancelSearch() {
    this.socket.emit('cancelSearch');
  }

  leaveCurrentMatch() {
    if (this.currentChannel) {
      this.socket.emit('leaveChannel', { channelName: this.currentChannel });
      this.currentChannel = null;
    }
  }

  onMatchFound(callback) {
    this.socket.on('matchFound', callback);
  }

  onPartnerLeft(callback) {
    this.socket.on('partnerLeft', callback);
  }
}

const matchmakingService = new MatchmakingService();
export default matchmakingService; 