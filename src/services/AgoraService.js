import AgoraRTC from 'agora-rtc-sdk-ng';
import AgoraRTM from 'agora-rtm-sdk';

class AgoraService {
  constructor() {
    this.appId = 'e4a58a3cbca542c6aec4af4e6de1513c';
    this.client = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' });
    this.rtmClient = AgoraRTM.createInstance(this.appId);
    this.localAudioTrack = null;
    this.localVideoTrack = null;
    this.rtmChannel = null;
    this.uid = String(Math.floor(Math.random() * 10000));
  }

  async login() {
    try {
      await this.rtmClient.login({ uid: this.uid });
      console.log('RTM Login success');
    } catch (error) {
      console.error('RTM Login error:', error);
    }
  }

  async joinChannel(channelName, token = null) {
    try {
      // Присоединяемся к RTM каналу для чата
      this.rtmChannel = this.rtmClient.createChannel(channelName);
      await this.rtmChannel.join();

      // Присоединяемся к RTC каналу для аудио/видео
      await this.client.join(this.appId, channelName, token, this.uid);
      console.log('Join channel success');
      return true;
    } catch (error) {
      console.error('Join channel error:', error);
      return false;
    }
  }

  async startLocalTracks(audioOnly = false) {
    try {
      this.localAudioTrack = await AgoraRTC.createMicrophoneAudioTrack();
      if (!audioOnly) {
        this.localVideoTrack = await AgoraRTC.createCameraVideoTrack();
      }

      if (this.localAudioTrack) {
        await this.client.publish(this.localAudioTrack);
      }
      if (this.localVideoTrack) {
        await this.client.publish(this.localVideoTrack);
      }

      return true;
    } catch (error) {
      console.error('Start local tracks error:', error);
      return false;
    }
  }

  async leaveChannel() {
    this.localAudioTrack?.close();
    this.localVideoTrack?.close();
    await this.client.leave();
    if (this.rtmChannel) {
      await this.rtmChannel.leave();
    }
  }

  async sendMessage(text) {
    if (this.rtmChannel) {
      try {
        await this.rtmChannel.sendMessage({ text });
        return true;
      } catch (error) {
        console.error('Send message error:', error);
        return false;
      }
    }
    return false;
  }

  onUserJoined(callback) {
    this.client.on('user-joined', callback);
  }

  onUserLeft(callback) {
    this.client.on('user-left', callback);
  }

  onMessageReceived(callback) {
    if (this.rtmChannel) {
      this.rtmChannel.on('ChannelMessage', callback);
    }
  }

  async toggleAudio(enabled) {
    if (this.localAudioTrack) {
      this.localAudioTrack.setEnabled(enabled);
    }
  }

  async toggleVideo(enabled) {
    if (this.localVideoTrack) {
      this.localVideoTrack.setEnabled(enabled);
    }
  }
}

const agoraService = new AgoraService();
export default agoraService; 