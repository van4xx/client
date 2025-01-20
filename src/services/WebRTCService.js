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

    // Проверяем состояние локального стрима перед инициализацией
    const audioTracks = this.stream.getAudioTracks();
    const videoTracks = this.stream.getVideoTracks();

    if (audioTracks.length === 0 && videoTracks.length === 0) {
      console.error('No audio or video tracks in local stream');
      return;
    }

    console.log('Local stream state before peer initialization:', {
      audio: audioTracks.map(t => ({
        enabled: t.enabled,
        muted: t.muted,
        readyState: t.readyState
      })),
      video: videoTracks.map(t => ({
        enabled: t.enabled,
        muted: t.muted,
        readyState: t.readyState
      }))
    });

    try {
      const peerConfig = {
        initiator,
        trickle: true,
        streams: [this.stream],
        config: {
          iceServers: [
            {
              urls: [
                'stun:stun.l.google.com:19302',
                'stun:stun1.l.google.com:19302',
                'stun:stun2.l.google.com:19302',
                'stun:stun3.l.google.com:19302',
                'stun:stun4.l.google.com:19302',
                'stun:stun.stunprotocol.org:3478'
              ]
            },
            {
              urls: [
                'turn:numb.viagenie.ca:3478',
                'turn:numb.viagenie.ca:3478?transport=tcp'
              ],
              username: 'webrtc@live.com',
              credential: 'muazkh'
            },
            {
              urls: [
                'turn:turn.anyfirewall.com:443?transport=tcp',
                'turn:turn.anyfirewall.com:443?transport=udp'
              ],
              credential: 'webrtc',
              username: 'webrtc'
            },
            {
              urls: 'turn:openrelay.metered.ca:443',
              username: 'openrelayproject',
              credential: 'openrelayproject'
            },
            {
              urls: [
                'turn:openrelay.metered.ca:443?transport=tcp',
                'turn:openrelay.metered.ca:443?transport=udp'
              ],
              username: 'openrelayproject',
              credential: 'openrelayproject'
            }
          ],
          iceTransportPolicy: 'all',
          bundlePolicy: 'max-bundle',
          rtcpMuxPolicy: 'require',
          sdpSemantics: 'unified-plan',
          enableDtlsSrtp: true,
          iceCandidatePoolSize: 1
        },
        offerOptions: {
          offerToReceiveAudio: true,
          offerToReceiveVideo: true,
          voiceActivityDetection: true,
          iceRestart: true
        },
        answerOptions: {
          offerToReceiveAudio: true,
          offerToReceiveVideo: true,
          voiceActivityDetection: true,
          iceRestart: true
        },
        sdpTransform: (sdp) => {
          let modifiedSdp = sdp;
          
          // Добавляем поддержку H264 и VP8
          if (!modifiedSdp.includes('H264') && !modifiedSdp.includes('VP8')) {
            modifiedSdp = modifiedSdp.replace(
              /(m=video.*\r\n)/g,
              '$1a=rtpmap:96 VP8/90000\r\na=rtcp-fb:96 nack\r\na=rtcp-fb:96 nack pli\r\na=rtcp-fb:96 ccm fir\r\na=rtpmap:97 H264/90000\r\na=rtcp-fb:97 nack\r\na=rtcp-fb:97 nack pli\r\na=rtcp-fb:97 ccm fir\r\n'
            );
          }
          
          // Устанавливаем максимальный битрейт для видео
          if (!modifiedSdp.includes('b=AS:')) {
            modifiedSdp = modifiedSdp.replace(
              /(m=video.*\r\n)/g,
              '$1b=AS:2000\r\n'
            );
          }
          
          // Добавляем параметры для улучшения связи через NAT
          if (!modifiedSdp.includes('a=ice-options:trickle')) {
            modifiedSdp = modifiedSdp.replace(
              /(v=0\r\n)/g,
              '$1a=ice-options:trickle\r\n'
            );
          }
          
          return modifiedSdp;
        }
      };

      this.peer = new Peer(peerConfig);

      let iceConnectionTimeout;
      let connectionTimeout;
      let candidatesReceived = 0;
      let isConnected = false;

      this.peer.on('signal', signal => {
        if (this.socket && this.socket.connected) {
          console.log('Sending signal:', signal);
          if (signal.type === 'candidate') {
            candidatesReceived++;
          }
          this.socket.emit('signal', { signal });
        } else {
          console.warn('Socket not connected, cannot send signal');
        }
      });

      this.peer.on('connect', () => {
        console.log('Peer connection established');
        isConnected = true;
        this.isSearching = false;
        clearTimeout(connectionTimeout);
        clearTimeout(iceConnectionTimeout);
      });

      this.peer.on('stream', stream => {
        console.log('Received remote stream:', stream);
        if (stream && stream.active) {
          const audioTracks = stream.getAudioTracks();
          const videoTracks = stream.getVideoTracks();
          
          console.log('Remote stream tracks:', {
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

          // Создаем новый MediaStream
          const newStream = new MediaStream();
          
          // Обработка аудио треков
          audioTracks.forEach(track => {
            const newTrack = track.clone();
            newTrack.enabled = true;
            
            // Периодически проверяем состояние трека
            const checkInterval = setInterval(() => {
              if (!newTrack.enabled || newTrack.muted) {
                console.log('Restoring audio track state');
                newTrack.enabled = true;
              }
            }, 1000);
            
            newTrack.onended = () => {
              console.log('Audio track ended, trying to restore');
              clearInterval(checkInterval);
              
              // Пытаемся восстановить трек
              const clonedTrack = track.clone();
              clonedTrack.enabled = true;
              newStream.removeTrack(newTrack);
              newStream.addTrack(clonedTrack);
              
              if (this.onStreamCallback) {
                this.onStreamCallback(newStream);
              }
            };
            
            newTrack.onmute = () => {
              console.log('Audio track muted, enabling');
              newTrack.enabled = true;
            };
            
            newTrack.onunmute = () => {
              console.log('Audio track unmuted');
              newTrack.enabled = true;
            };
            
            newStream.addTrack(newTrack);
          });
          
          // Обработка видео треков
          videoTracks.forEach(track => {
            const newTrack = track.clone();
            newTrack.enabled = true;
            
            // Периодически проверяем состояние трека
            const checkInterval = setInterval(() => {
              if (!newTrack.enabled || newTrack.muted) {
                console.log('Restoring video track state');
                newTrack.enabled = true;
              }
            }, 1000);
            
            newTrack.onended = () => {
              console.log('Video track ended, trying to restore');
              clearInterval(checkInterval);
              
              // Пытаемся восстановить трек
              const clonedTrack = track.clone();
              clonedTrack.enabled = true;
              newStream.removeTrack(newTrack);
              newStream.addTrack(clonedTrack);
              
              if (this.onStreamCallback) {
                this.onStreamCallback(newStream);
              }
            };
            
            newTrack.onmute = () => {
              console.log('Video track muted, enabling');
              newTrack.enabled = true;
            };
            
            newTrack.onunmute = () => {
              console.log('Video track unmuted');
              newTrack.enabled = true;
            };
            
            newStream.addTrack(newTrack);
          });

          if (this.onStreamCallback) {
            clearTimeout(connectionTimeout);
            this.onStreamCallback(newStream);
            
            // Мониторим состояние стрима
            const streamCheckInterval = setInterval(() => {
              if (!newStream.active || newStream.getTracks().length === 0) {
                console.log('Stream became inactive, trying to restore');
                clearInterval(streamCheckInterval);
                
                // Пытаемся пересоздать стрим
                const restoredStream = new MediaStream();
                newStream.getTracks().forEach(track => {
                  const clonedTrack = track.clone();
                  clonedTrack.enabled = true;
                  restoredStream.addTrack(clonedTrack);
                });
                
                if (restoredStream.getTracks().length > 0) {
                  this.onStreamCallback(restoredStream);
                } else {
                  console.log('Could not restore stream, reconnecting');
                  this.destroyPeer();
                }
              }
            }, 2000);
            
            // Очистка интервалов при удалении треков
            newStream.onremovetrack = () => {
              console.log('Track removed from stream');
              if (newStream.getTracks().length === 0) {
                clearInterval(streamCheckInterval);
                console.log('All tracks removed, reconnecting');
                this.destroyPeer();
              }
            };
          }
        }
      });

      this.peer.on('track', (track, stream) => {
        console.log('Received track:', track.kind, track.id, 'in stream:', stream.id);
        console.log('Track settings:', track.getSettings());
        console.log('Track constraints:', track.getConstraints());
        
        track.onunmute = () => {
          console.log('Track unmuted:', track.kind, 'enabled:', track.enabled, 'muted:', track.muted);
          track.enabled = true;
        };
        
        track.onmute = () => {
          console.log('Track muted:', track.kind);
        };
        
        track.onended = () => {
          console.log('Track ended:', track.kind);
        };
      });

      this.peer.on('iceStateChange', (iceConnectionState) => {
        console.log('ICE connection state:', iceConnectionState);
        
        if (iceConnectionState === 'checking') {
          clearTimeout(iceConnectionTimeout);
          iceConnectionTimeout = setTimeout(() => {
            if (!isConnected) {
              if (candidatesReceived === 0) {
                console.log('No ICE candidates received, trying TCP/TURN');
                try {
                  this.peer._pc.setConfiguration({
                    ...peerConfig.config,
                    iceTransportPolicy: 'relay'
                  });
                } catch (error) {
                  console.error('Error setting relay configuration:', error);
                  this.destroyPeer();
                }
              } else {
                console.log('ICE connection timeout');
                this.destroyPeer();
              }
            }
          }, 8000);
        } else if (iceConnectionState === 'connected' || iceConnectionState === 'completed') {
          console.log('ICE connection established');
          isConnected = true;
          clearTimeout(iceConnectionTimeout);
          clearTimeout(connectionTimeout);
        } else if (iceConnectionState === 'failed' || iceConnectionState === 'disconnected' || iceConnectionState === 'closed') {
          console.log('ICE connection failed/closed');
          if (!isConnected) {
            this.destroyPeer();
          }
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
        if (!isConnected) {
          this.destroyPeer();
        }
      });

      this.peer.on('close', () => {
        console.log('Peer connection closed');
        clearTimeout(iceConnectionTimeout);
        clearTimeout(connectionTimeout);
        this.destroyPeer();
      });

      connectionTimeout = setTimeout(() => {
        if (!isConnected) {
          console.log('Connection establishment timeout');
          this.destroyPeer();
        }
      }, 20000);

    } catch (error) {
      console.error('Error initializing peer:', error);
      this.destroyPeer();
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