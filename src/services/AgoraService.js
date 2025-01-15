import AgoraRTC from 'agora-rtc-sdk-ng';
import AgoraRTM from 'agora-rtm-sdk';

class AgoraService {
  constructor() {
    this.appId = 'e4a58a3cbca542c6aec4af4e6de1513c';
    this.client = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' });
    this.rtmClient = null;
    this.channel = null;
    this.localAudioTrack = null;
    this.localVideoTrack = null;
    this.remoteUsers = new Map();
    this.isInitialized = false;
    this.uid = Math.floor(Math.random() * 1000000);
  }

  async initialize() {
    if (this.isInitialized) return;

    try {
      // Инициализация RTM клиента для чата
      this.rtmClient = AgoraRTM.createInstance(this.appId);
      await this.rtmClient.login({ uid: String(this.uid) });

      // Настраиваем обработчики событий для RTC
      this.client.on('user-published', this.handleUserPublished.bind(this));
      this.client.on('user-unpublished', this.handleUserUnpublished.bind(this));
      this.client.on('user-left', this.handleUserLeft.bind(this));

      this.isInitialized = true;
    } catch (error) {
      console.error('Failed to initialize Agora:', error);
      throw error;
    }
  }

  async createLocalTracks(videoConfig = {}, audioConfig = {}) {
    try {
      // Сначала проверяем доступность устройств
      await AgoraRTC.checkAudioAndVideoAvailable();

      const defaultVideoConfig = {
        encoderConfig: {
          width: 1920,
          height: 1080,
          frameRate: 30,
          bitrateMin: 600,
          bitrateMax: 2000
        },
        optimizationMode: 'detail',
        facingMode: 'user',
      };

      const defaultAudioConfig = {
        AEC: true,
        AGC: true,
        ANS: true,
        encoderConfig: {
          sampleRate: 48000,
          stereo: true,
          bitrate: 128
        }
      };

      // Создаем треки с улучшенными настройками
      const [audioTrack, videoTrack] = await AgoraRTC.createMicrophoneAndCameraTracks(
        { ...defaultAudioConfig, ...audioConfig },
        { ...defaultVideoConfig, ...videoConfig }
      );

      // Сохраняем треки
      this.localAudioTrack = audioTrack;
      this.localVideoTrack = videoTrack;

      return { audioTrack, videoTrack };
    } catch (error) {
      console.error('Failed to create local tracks:', error);
      throw error;
    }
  }

  async joinChannel(channelName, token = null) {
    try {
      // Присоединяемся к RTC каналу
      await this.client.join(this.appId, channelName, token, this.uid);
      
      // Создаем локальные треки, если их еще нет
      if (!this.localAudioTrack || !this.localVideoTrack) {
        const { audioTrack, videoTrack } = await this.createLocalTracks();
        this.localAudioTrack = audioTrack;
        this.localVideoTrack = videoTrack;
      }
      
      // Публикуем треки
      await this.client.publish([this.localAudioTrack, this.localVideoTrack]);

      // Присоединяемся к RTM каналу для чата
      this.channel = this.rtmClient.createChannel(channelName);
      await this.channel.join();

      return {
        localAudioTrack: this.localAudioTrack,
        localVideoTrack: this.localVideoTrack
      };
    } catch (error) {
      console.error('Failed to join channel:', error);
      throw error;
    }
  }

  async handleUserPublished(user, mediaType) {
    try {
      await this.client.subscribe(user, mediaType);
      
      if (mediaType === 'video') {
        const remoteVideoTrack = user.videoTrack;
        if (remoteVideoTrack) {
          const playerContainer = document.getElementById('remote-video');
          if (playerContainer) {
            playerContainer.innerHTML = '';
            remoteVideoTrack.play(playerContainer);
          }
        }
      }
      
      if (mediaType === 'audio') {
        const remoteAudioTrack = user.audioTrack;
        if (remoteAudioTrack) {
          remoteAudioTrack.play();
        }
      }

      this.remoteUsers.set(user.uid, user);
    } catch (error) {
      console.error('Failed to handle user published:', error);
    }
  }

  handleUserUnpublished(user) {
    this.remoteUsers.delete(user.uid);
  }

  handleUserLeft(user) {
    this.remoteUsers.delete(user.uid);
  }

  async leaveChannel() {
    try {
      // Останавливаем и закрываем локальные треки
      this.localAudioTrack?.close();
      this.localVideoTrack?.close();
      
      // Покидаем RTC канал
      await this.client.leave();
      
      // Покидаем RTM канал
      if (this.channel) {
        await this.channel.leave();
      }
      
      this.remoteUsers.clear();
    } catch (error) {
      console.error('Failed to leave channel:', error);
    }
  }

  async searchPartner() {
    try {
      const response = await fetch('http://localhost:5001/api/search-partner', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          userId: this.uid,
          hasVideo: true,
          hasAudio: true
        })
      });
      
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      console.log('Server response:', data);
      
      return data;
    } catch (error) {
      console.error('Failed to search partner:', error);
      throw error;
    }
  }

  toggleAudio(enabled) {
    if (this.localAudioTrack) {
      this.localAudioTrack.setEnabled(enabled);
    }
  }

  toggleVideo(enabled) {
    if (this.localVideoTrack) {
      this.localVideoTrack.setEnabled(enabled);
    }
  }

  async sendMessage(message) {
    if (!this.channel) return;
    try {
      await this.channel.sendMessage({ text: message });
      return true;
    } catch (error) {
      console.error('Failed to send message:', error);
      return false;
    }
  }
}

const agoraService = new AgoraService();
export default agoraService; 