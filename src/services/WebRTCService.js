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
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      timeout: 20000,
      autoConnect: true,
      forceNew: true,
      closeOnBeforeunload: true,
      // Добавляем новые параметры для улучшения стабильности
      pingTimeout: 60000,
      pingInterval: 25000,
      upgrade: true,
      rememberUpgrade: true,
      transports: ['websocket', 'polling']
    };

    try {
      this.socket = io(serverUrl, socketOptions);

      // Добавляем обработку переподключения
      this.socket.io.on("reconnect_attempt", (attempt) => {
        console.log('Reconnection attempt:', attempt);
        if (attempt > 2) {
          this.socket.io.opts.transports = ['polling', 'websocket'];
        }
      });

      this.socket.io.on("reconnect", (attempt) => {
        console.log('Reconnected after', attempt, 'attempts');
        // Восстанавливаем поиск если он был активен
        if (this.isSearching) {
          this.startSearch('video');
        }
      });

      this.socket.io.on("reconnect_error", (error) => {
        console.log('Reconnection error:', error);
      });

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
        reconnectTimer: 10000,
        iceCompleteTimeout: 15000,
        config: {
          iceServers: [
            {
              urls: [
                'stun:ruletka.top:3478',
                'stun:stun.l.google.com:19302',
                'stun:stun1.l.google.com:19302',
                'stun:stun2.l.google.com:19302'
              ]
            },
            {
              urls: [
                'turn:ruletka.top:3478',
                'turn:ruletka.top:3478?transport=tcp'
              ],
              username: 'webrtc',
              credential: 'webrtc123'
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
              urls: [
                'turn:openrelay.metered.ca:443',
                'turn:openrelay.metered.ca:443?transport=tcp',
                'turn:openrelay.metered.ca:443?transport=udp',
                'turn:openrelay.metered.ca:80',
                'turn:openrelay.metered.ca:80?transport=tcp',
                'turn:openrelay.metered.ca:80?transport=udp'
              ],
              username: 'openrelayproject',
              credential: 'openrelayproject'
            },
            {
              urls: [
                'turn:relay.webwormhole.io:3478',
                'turn:relay.webwormhole.io:3478?transport=udp',
                'turn:relay.webwormhole.io:3478?transport=tcp',
                'turn:relay.webwormhole.io:80',
                'turn:relay.webwormhole.io:80?transport=udp',
                'turn:relay.webwormhole.io:80?transport=tcp',
                'turn:relay.webwormhole.io:443',
                'turn:relay.webwormhole.io:443?transport=udp',
                'turn:relay.webwormhole.io:443?transport=tcp'
              ],
              username: 'webwormhole',
              credential: 'webwormhole'
            }
          ],
          iceTransportPolicy: 'all',
          bundlePolicy: 'max-bundle',
          rtcpMuxPolicy: 'require',
          sdpSemantics: 'unified-plan',
          enableDtlsSrtp: true,
          iceCandidatePoolSize: 2,
          iceServersTimeout: 10000,
          // Увеличиваем таймауты для длительных соединений
          iceConnectionTimeout: 60000,
          iceTrickleTimeout: 60000
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
        
        if (err.message === 'Connection failed.' && this.peer && !this.peer.destroyed) {
          try {
            console.log('Attempting to recover from connection failure...');
            
            // Не уничтожаем peer сразу, даем шанс на восстановление
            if (this.peer._pc) {
              const currentState = this.peer._pc.connectionState;
              console.log('Current connection state:', currentState);
              
              if (currentState !== 'connected' && currentState !== 'completed') {
                // Пробуем сначала мягкое восстановление
                this.peer._pc.restartIce();
                
                // Ждем результата восстановления
                setTimeout(() => {
                  if (this.peer && !this.peer.destroyed && this.peer._pc) {
                    const newState = this.peer._pc.connectionState;
                    console.log('Connection state after recovery attempt:', newState);
                    
                    if (newState !== 'connected' && newState !== 'completed') {
                      // Если не удалось восстановить, пробуем более агрессивное восстановление
                      try {
                        // Обновляем конфигурацию ICE
                        const newConfig = {
                          ...this.peer._pc.getConfiguration(),
                          iceTransportPolicy: 'all',
                          iceCandidatePoolSize: 5,
                          bundlePolicy: 'max-bundle'
                        };
                        this.peer._pc.setConfiguration(newConfig);
                        this.peer._pc.restartIce();
                        
                        // Даем еще время на восстановление
                        setTimeout(() => {
                          if (this.peer && !this.peer.destroyed && this.peer._pc) {
                            const finalState = this.peer._pc.connectionState;
                            if (finalState !== 'connected' && finalState !== 'completed') {
                              console.log('Recovery failed, recreating peer connection');
                              // Только теперь уничтожаем peer и создаем новый
                              this.destroyPeer();
                              this.socket.emit('reconnect_request');
                            }
                          }
                        }, 5000);
                      } catch (error) {
                        console.error('Error during aggressive recovery:', error);
                      }
                    }
                  }
                }, 5000);
              }
            }
          } catch (error) {
            console.error('Error during connection recovery:', error);
          }
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
          
          let recoveryAttempts = 0;
          const maxRecoveryAttempts = 3;
          let recoveryTimer = null;
          
          const attemptRecovery = () => {
            if (recoveryAttempts < maxRecoveryAttempts) {
              if (this.peer && !this.peer.destroyed && this.peer._pc) {
                try {
                  console.log(`Recovery attempt ${recoveryAttempts + 1}/${maxRecoveryAttempts}`);
                  
                  // Проверяем текущее состояние
                  const currentState = this.peer._pc.connectionState;
                  if (currentState === 'connected' || currentState === 'completed') {
                    console.log('Connection already recovered');
                    return;
                  }
                  
                  // Пробуем восстановить соединение
                  this.peer._pc.restartIce();
                  recoveryAttempts++;
                  
                  // Ждем результата
                  recoveryTimer = setTimeout(() => {
                    if (this.peer && !this.peer.destroyed && this.peer._pc) {
                      const newState = this.peer._pc.connectionState;
                      if (newState !== 'connected' && newState !== 'completed') {
                        attemptRecovery();
                      }
                    }
                  }, 7000); // Увеличиваем интервал между попытками
                } catch (error) {
                  console.error('Error during recovery attempt:', error);
                  clearTimeout(recoveryTimer);
                }
              }
            } else {
              console.log('Max recovery attempts reached');
              clearTimeout(recoveryTimer);
              // Не уничтожаем peer сразу, даем шанс автоматическому восстановлению
              setTimeout(() => {
                if (this.peer && !this.peer.destroyed && this.peer._pc) {
                  const finalState = this.peer._pc.connectionState;
                  if (finalState !== 'connected' && finalState !== 'completed') {
                    console.log('Recovery failed, requesting new connection');
                    this.destroyPeer();
                    this.socket.emit('reconnect_request');
                  }
                }
              }, 10000);
            }
          };
          
          // Начинаем восстановление с небольшой задержкой
          setTimeout(attemptRecovery, 2000);
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
        this.destroyPeer();
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
    if (this.isSearching) {
      console.log('Already searching, ignoring request');
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