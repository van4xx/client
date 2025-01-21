import WebSocketClient from './WebSocketClient';
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
    this.onConnectionStatusCallback = null;
  }

  init(serverUrl = window.location.protocol === 'https:' ? 'https://ruletka.top' : 'http://localhost:5000') {
    console.log('Initializing WebRTC service with server:', serverUrl);
    
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }

    try {
      this.socket = new WebSocketClient(serverUrl, {
        maxReconnectAttempts: 10,
        reconnectInterval: 1000
      });

      this.socket.on('open', () => {
        console.log('Connected to signaling server');
        this.isSearching = false;
        if (this.onConnectionStatusCallback) {
          this.onConnectionStatusCallback('connected');
        }
        // Send initial connection message
        this.socket.send(JSON.stringify({
          type: 'connection',
          data: { clientType: 'web' }
        }));
      });

      this.socket.on('error', (error) => {
        console.error('WebSocket error:', error);
        if (this.onConnectionStatusCallback) {
          this.onConnectionStatusCallback('error', error);
        }
      });
      
      this.socket.on('close', (event) => {
        console.log('WebSocket closed:', event);
        this.isSearching = false;
        if (!this.intentionalClose) {
          this.destroyPeer();
        }
        if (this.onConnectionStatusCallback) {
          this.onConnectionStatusCallback('disconnected');
        }
      });

      this.socket.on('message', (data) => {
        try {
          const message = JSON.parse(data);
          switch (message.type) {
            case 'partner_found':
              console.log('Partner found, initiator:', message.initiator);
              this.initializePeer(message.initiator);
              break;
            case 'signal':
              console.log('Received signal');
              if (this.peer && !this.peer.destroyed) {
                this.peer.signal(message.signal);
              }
              break;
            case 'chat_message':
              if (this.onChatMessageCallback) {
                this.onChatMessageCallback(message.message);
              }
              break;
            case 'connection_closed':
              console.log('Connection closed by partner');
              this.handleConnectionClosed();
              break;
            case 'error':
              console.error('Server error:', message.error);
              break;
          }
        } catch (error) {
          console.error('Error processing message:', error);
        }
      });

    } catch (error) {
      console.error('Failed to initialize WebSocket:', error);
      if (this.onConnectionStatusCallback) {
        this.onConnectionStatusCallback('error', error);
      }
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
        reconnectTimer: 3000,
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
          this.socket.send(JSON.stringify({
            type: 'signal',
            signal: signal
          }));
        } else {
          console.warn('WebSocket not connected, cannot send signal');
        }
      });

      this.peer.on('connect', () => {
        console.log('Peer connection established');
        isConnected = true;
        this.isSearching = false;
        if (this.onSearchStatusCallback) {
          this.onSearchStatusCallback(false);
        }
        clearTimeout(connectionTimeout);
        clearTimeout(iceConnectionTimeout);
        startKeepalive();
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

      this.peer.on('error', err => {
        console.error('Peer error:', err);
        // Не разрываем соединение сразу при ошибке
        if (err.message === 'Connection failed.' && this.peer && !this.peer.destroyed) {
          try {
            console.log('Attempting to recover from connection failure...');
            // Пробуем перезапустить ICE
            if (this.peer._pc) {
              this.peer._pc.restartIce();
              
              // Даем время на восстановление
              setTimeout(() => {
                if (this.peer && !this.peer.destroyed && this.peer._pc) {
                  const state = this.peer._pc.connectionState;
                  if (state !== 'connected' && state !== 'completed') {
                    console.log('Could not recover connection, destroying peer');
                    this.destroyPeer();
                  }
                }
              }, 10000);
            }
          } catch (error) {
            console.error('Error during recovery attempt:', error);
            this.destroyPeer();
          }
        } else if (!isConnected) {
          this.destroyPeer();
        }
      });

      this.peer.on('iceStateChange', (iceConnectionState) => {
        console.log('ICE connection state:', iceConnectionState);
        
        if (iceConnectionState === 'checking') {
          clearTimeout(iceConnectionTimeout);
          iceConnectionTimeout = setTimeout(() => {
            if (!isConnected && this.peer && !this.peer.destroyed) {
              console.log('ICE connection timeout, attempting recovery...');
              try {
                if (this.peer._pc) {
                  this.peer._pc.restartIce();
                }
              } catch (error) {
                console.error('Error restarting ICE:', error);
              }
            }
          }, 60000);
        } else if (iceConnectionState === 'connected' || iceConnectionState === 'completed') {
          console.log('ICE connection established');
          isConnected = true;
          clearTimeout(iceConnectionTimeout);
          clearTimeout(connectionTimeout);
          startKeepalive();
        } else if (iceConnectionState === 'disconnected') {
          console.log('ICE connection disconnected, attempting recovery...');
          
          // Не останавливаем keepalive сразу
          let recoveryAttempts = 0;
          const maxRecoveryAttempts = 3;
          
          const attemptRecovery = () => {
            if (recoveryAttempts < maxRecoveryAttempts) {
              if (this.peer && !this.peer.destroyed && this.peer._pc) {
                try {
                  console.log(`Recovery attempt ${recoveryAttempts + 1}/${maxRecoveryAttempts}`);
                  this.peer._pc.restartIce();
                  recoveryAttempts++;
                  
                  // Проверяем результат через 5 секунд
                  setTimeout(() => {
                    if (this.peer && !this.peer.destroyed && this.peer._pc) {
                      const state = this.peer._pc.connectionState;
                      if (state !== 'connected' && state !== 'completed') {
                        attemptRecovery();
                      }
                    }
                  }, 5000);
                } catch (error) {
                  console.error('Error during recovery attempt:', error);
                }
              }
            } else {
              console.log('Max recovery attempts reached, destroying peer');
              this.destroyPeer();
            }
          };
          
          // Начинаем попытки восстановления
          attemptRecovery();
        } else if (iceConnectionState === 'failed') {
          console.log('ICE connection failed, attempting final recovery...');
          if (this.peer && !this.peer.destroyed && this.peer._pc) {
            try {
              this.peer._pc.restartIce();
              
              // Даем последний шанс на восстановление
              setTimeout(() => {
                if (this.peer && !this.peer.destroyed && this.peer._pc) {
                  const state = this.peer._pc.connectionState;
                  if (state !== 'connected' && state !== 'completed') {
                    this.destroyPeer();
                  }
                }
              }, 5000);
            } catch (error) {
              console.error('Error during final recovery attempt:', error);
              this.destroyPeer();
            }
          }
        }
      });

      // Обновляем механизм keepalive
      let keepaliveInterval;
      let connectionCheckInterval;
      let lastKeepaliveResponse = Date.now();
      
      const startKeepalive = () => {
        if (keepaliveInterval) clearInterval(keepaliveInterval);
        if (connectionCheckInterval) clearInterval(connectionCheckInterval);
        
        // Отправляем keepalive каждые 10 секунд
        keepaliveInterval = setInterval(() => {
          if (this.peer && !this.peer.destroyed) {
            try {
              this.peer.send(JSON.stringify({ 
                type: 'keepalive', 
                timestamp: Date.now(),
                data: 'ping'
              }));
            } catch (error) {
              console.warn('Keepalive error:', error);
            }
          }
        }, 10000);

        // Проверяем состояние соединения каждые 15 секунд
        connectionCheckInterval = setInterval(() => {
          if (this.peer && !this.peer.destroyed && this.peer._pc) {
            const state = this.peer._pc.connectionState;
            const now = Date.now();
            
            // Проверяем время последнего keepalive
            if (now - lastKeepaliveResponse > 40000) {
              console.warn('No keepalive response for 40 seconds');
              // Пробуем переподключиться
              try {
                this.peer._pc.restartIce();
              } catch (error) {
                console.error('Error restarting ICE during check:', error);
              }
            }
            
            if (state === 'connected' || state === 'completed') {
              console.log('Connection check: OK');
            } else {
              console.warn('Connection check: State is', state);
              try {
                this.peer._pc.restartIce();
              } catch (error) {
                console.error('Error restarting ICE during check:', error);
              }
            }
          }
        }, 15000);
      };

      // Обработка keepalive ответов
      this.peer.on('data', data => {
        if (!data) return;
        try {
          const message = typeof data === 'string' ? data : new TextDecoder().decode(data);
          const parsed = JSON.parse(message);
          
          if (parsed.type === 'keepalive') {
            lastKeepaliveResponse = Date.now();
            // Отправляем ответ на keepalive
            if (this.peer && !this.peer.destroyed) {
              this.peer.send(JSON.stringify({
                type: 'keepalive_response',
                timestamp: Date.now(),
                data: 'pong'
              }));
            }
          } else if (parsed.type === 'keepalive_response') {
            lastKeepaliveResponse = Date.now();
          } else if (this.onChatMessageCallback) {
            this.onChatMessageCallback(message);
          }
        } catch (error) {
          console.error('Error handling data:', error);
        }
      });

      this.peer.on('close', () => {
        console.log('Peer connection closed');
        if (keepaliveInterval) clearInterval(keepaliveInterval);
        if (connectionCheckInterval) clearInterval(connectionCheckInterval);
        this.handleConnectionClosed();
      });

      // Увеличиваем общий таймаут соединения
      connectionTimeout = setTimeout(() => {
        if (!isConnected) {
          console.log('Connection establishment timeout');
          this.destroyPeer();
        }
      }, 60000000); // 1000 минут

    } catch (error) {
      console.error('Error initializing peer:', error);
      this.destroyPeer();
    }
  }

  startSearch(mode = 'video') {
    console.log('Starting search in mode:', mode);
    this.currentMode = mode;
    this.intentionalClose = false;
    
    if (!this.socket) {
      console.warn('No socket connection, initializing...');
      this.init();
      return;
    }

    this.isSearching = true;
    if (this.onSearchStatusCallback) {
      this.onSearchStatusCallback(true);
    }

    try {
      this.socket.send(JSON.stringify({
        type: 'start_search',
        mode: mode,
        clientType: 'web'
      }));
    } catch (error) {
      console.error('Error starting search:', error);
      this.isSearching = false;
      if (this.onSearchStatusCallback) {
        this.onSearchStatusCallback(false);
      }
    }
  }

  stopSearch() {
    console.log('Stopping search');
    this.intentionalClose = true;
    this.isSearching = false;
    
    if (this.socket) {
      try {
        this.socket.send(JSON.stringify({
          type: 'stop_search'
        }));
      } catch (error) {
        console.error('Error stopping search:', error);
      }
    }

    if (this.onSearchStatusCallback) {
      this.onSearchStatusCallback(false);
    }
  }

  nextPartner(mode = 'video') {
    console.log('Finding next partner in mode:', mode);
    this.isSearching = true;
    if (this.onSearchStatusCallback) {
      this.onSearchStatusCallback(true);
    }
    this.socket.send(JSON.stringify({
      type: 'next',
      mode: mode
    }));
  }

  sendMessage(message) {
    console.log('Sending chat message:', message);
    this.socket.send(JSON.stringify({
      type: 'chat_message',
      message: message
    }));
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

    // Пересоздаем WebSocket соединение
    if (this.socket) {
      this.socket.close();
      this.init();
    }

    // Пытаемся переподключиться через 2 секунды
    setTimeout(() => {
      if (this.stream) {
        this.setStream(this.stream);
        if (this.currentMode) {
          this.startSearch(this.currentMode);
        }
      }
      this.isReconnecting = false;
    }, 2000);
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
        this.socket.send(JSON.stringify({
          type: 'stop_search'
        }));
        this.socket.close();
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

  onConnectionStatus(callback) {
    this.onConnectionStatusCallback = callback;
  }
}

export default new WebRTCService(); 