class WebRTCService {
  constructor() {
    this.peerConnection = null;
    this.localStream = null;
    this.remoteStream = null;
    this.roomId = null;
    this.partnerId = null;
    this.userId = Math.random().toString(36).substr(2, 9);
    this.onRemoteStreamCallback = null;
    this.ws = null;
    this.wsConnected = false;
    this.isInitiator = false;
  }

  async initialize() {
    try {
      console.log('Initializing WebRTCService...');
      await this.initializeWebSocket();
      await this.initializeWebRTC();
      console.log('WebRTCService initialized successfully');
    } catch (error) {
      console.error('Error initializing WebRTC:', error);
      throw error;
    }
  }

  async initializeWebSocket() {
    return new Promise((resolve, reject) => {
      try {
        console.log('Connecting to WebSocket...');
        this.ws = new WebSocket('ws://localhost:5001');
        
        this.ws.onopen = () => {
          console.log('WebSocket connected successfully');
          this.wsConnected = true;
          
          setTimeout(() => {
            this.ws.send(JSON.stringify({
              type: 'register',
              userId: this.userId
            }));
            resolve();
          }, 100);
        };

        this.ws.onclose = () => {
          console.log('WebSocket connection closed');
          this.wsConnected = false;
        };

        this.ws.onmessage = async (event) => {
          try {
            const data = JSON.parse(event.data);
            console.log('WebSocket message received:', data);

            switch (data.type) {
              case 'registered':
                console.log('Registered with userId:', data.userId);
                break;

              case 'matched':
                console.log('Matched with partner:', data.partnerId);
                this.roomId = data.roomId;
                this.partnerId = data.partnerId;
                this.isInitiator = data.isInitiator;
                
                if (this.isInitiator) {
                  setTimeout(async () => {
                    await this.createAndSendOffer();
                  }, 100);
                }
                break;

              case 'offer':
                console.log('Received offer from:', data.from);
                await this.handleRemoteOffer(data.payload);
                break;

              case 'answer':
                console.log('Received answer from:', data.from);
                await this.handleRemoteAnswer(data.payload);
                break;

              case 'ice-candidate':
                console.log('Received ICE candidate from:', data.from);
                if (this.peerConnection && this.peerConnection.remoteDescription) {
                  await this.handleRemoteIceCandidate(data.payload);
                }
                break;

              case 'partner-left':
                console.log('Partner left the chat');
                this.handlePartnerLeft();
                break;

              case 'error':
                console.error('Server error:', data.error);
                break;
            }
          } catch (error) {
            console.error('Error processing message:', error);
          }
        };

        this.ws.onerror = (error) => {
          console.error('WebSocket error:', error);
          this.wsConnected = false;
          reject(error);
        };

        setTimeout(() => {
          if (!this.wsConnected) {
            reject(new Error('WebSocket connection timeout'));
          }
        }, 5000);
      } catch (error) {
        console.error('Error initializing WebSocket:', error);
        reject(error);
      }
    });
  }

  async initializeWebRTC() {
    console.log('Initializing WebRTC connection...');
    
    if (this.peerConnection) {
      this.peerConnection.close();
    }
    
    this.peerConnection = new RTCPeerConnection({
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' }
      ]
    });

    this.peerConnection.ontrack = (event) => {
      console.log('Received remote track:', event.track.kind);
      this.remoteStream = event.streams[0];
      if (this.onRemoteStreamCallback) {
        this.onRemoteStreamCallback(this.remoteStream);
      }
    };

    this.peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        console.log('Sending ICE candidate');
        this.sendSignal({
          type: 'ice-candidate',
          payload: event.candidate
        });
      }
    };

    this.peerConnection.oniceconnectionstatechange = () => {
      console.log('ICE connection state:', this.peerConnection.iceConnectionState);
      if (this.peerConnection.iceConnectionState === 'disconnected') {
        console.log('ICE connection disconnected');
        this.handlePartnerLeft();
      }
    };

    if (this.localStream) {
      this.localStream.getTracks().forEach(track => {
        this.peerConnection.addTrack(track, this.localStream);
      });
    }
  }

  async createLocalTracks() {
    try {
      console.log('Requesting media permissions...');
      this.localStream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true
      });

      if (this.peerConnection) {
        this.localStream.getTracks().forEach(track => {
          this.peerConnection.addTrack(track, this.localStream);
        });
      }

      return {
        localStream: this.localStream
      };
    } catch (error) {
      console.error('Error creating local tracks:', error);
      throw error;
    }
  }

  async searchPartner() {
    try {
      console.log('Searching for partner...');
      if (!this.wsConnected || this.ws.readyState !== WebSocket.OPEN) {
        console.error('WebSocket not connected, attempting to reconnect...');
        await this.initializeWebSocket();
      }

      this.ws.send(JSON.stringify({
        type: 'search',
        userId: this.userId
      }));

      return new Promise((resolve) => {
        const handleMessage = (event) => {
          const data = JSON.parse(event.data);
          console.log('Search response:', data);
          
          if (data.type === 'matched' || data.type === 'waiting') {
            this.ws.removeEventListener('message', handleMessage);
            resolve(data);
          }
        };

        this.ws.addEventListener('message', handleMessage);
      });
    } catch (error) {
      console.error('Error searching partner:', error);
      throw new Error('Ошибка подключения к серверу. Проверьте подключение к интернету.');
    }
  }

  async createAndSendOffer() {
    try {
      if (!this.peerConnection) {
        console.error('PeerConnection is null, reinitializing...');
        await this.initializeWebRTC();
      }

      console.log('Creating offer...');
      const offer = await this.peerConnection.createOffer({
        offerToReceiveAudio: true,
        offerToReceiveVideo: true
      });
      
      console.log('Setting local description...');
      await this.peerConnection.setLocalDescription(offer);
      
      console.log('Sending offer to partner');
      this.sendSignal({
        type: 'offer',
        payload: offer
      });
    } catch (error) {
      console.error('Error creating offer:', error);
      throw error;
    }
  }

  async handleRemoteOffer(offer) {
    try {
      if (!this.peerConnection) {
        console.error('PeerConnection is null, reinitializing...');
        await this.initializeWebRTC();
      }

      console.log('Setting remote description from offer...');
      await this.peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
      
      console.log('Creating answer...');
      const answer = await this.peerConnection.createAnswer();
      
      console.log('Setting local description...');
      await this.peerConnection.setLocalDescription(answer);
      
      console.log('Sending answer to partner');
      this.sendSignal({
        type: 'answer',
        payload: answer
      });
    } catch (error) {
      console.error('Error handling remote offer:', error);
    }
  }

  async handleRemoteAnswer(answer) {
    try {
      if (!this.peerConnection) {
        console.error('PeerConnection is null, cannot handle answer');
        return;
      }

      if (this.peerConnection.signalingState === 'stable') {
        console.log('Signaling state is already stable');
        return;
      }

      console.log('Setting remote description from answer...');
      await this.peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
    } catch (error) {
      console.error('Error handling remote answer:', error);
    }
  }

  async handleRemoteIceCandidate(candidate) {
    try {
      if (!this.peerConnection) {
        console.error('PeerConnection is null, cannot handle ICE candidate');
        return;
      }

      console.log('Adding remote ICE candidate...');
      await this.peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
    } catch (error) {
      console.error('Error handling remote ICE candidate:', error);
    }
  }

  handlePartnerLeft() {
    console.log('Handling partner left...');
    if (this.remoteStream) {
      this.remoteStream.getTracks().forEach(track => track.stop());
    }
    if (this.onRemoteStreamCallback) {
      this.onRemoteStreamCallback(null);
    }
  }

  sendSignal(signal) {
    if (this.wsConnected && this.ws.readyState === WebSocket.OPEN) {
      console.log('Sending signal:', signal.type);
      this.ws.send(JSON.stringify({
        ...signal,
        roomId: this.roomId,
        from: this.userId,
        to: this.partnerId
      }));
    } else {
      console.error('Cannot send signal: WebSocket not connected');
    }
  }

  setOnRemoteStream(callback) {
    this.onRemoteStreamCallback = callback;
  }

  async toggleAudio(enabled) {
    if (this.localStream) {
      this.localStream.getAudioTracks().forEach(track => {
        track.enabled = enabled;
      });
    }
  }

  async toggleVideo(enabled) {
    if (this.localStream) {
      this.localStream.getVideoTracks().forEach(track => {
        track.enabled = enabled;
      });
    }
  }

  async leaveRoom() {
    try {
      console.log('Leaving room...');
      if (this.wsConnected && this.ws.readyState === WebSocket.OPEN) {
        this.ws.send(JSON.stringify({ 
          type: 'leave',
          userId: this.userId,
          roomId: this.roomId
        }));
      }

      if (this.localStream) {
        this.localStream.getTracks().forEach(track => track.stop());
      }

      if (this.peerConnection) {
        this.peerConnection.close();
        this.peerConnection = null;
      }

      this.localStream = null;
      this.remoteStream = null;
      this.roomId = null;
      this.partnerId = null;
      this.isInitiator = false;
      
      console.log('Successfully left room');
    } catch (error) {
      console.error('Error leaving room:', error);
      throw error;
    }
  }
}

export default new WebRTCService(); 