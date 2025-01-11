import { Device } from 'mediasoup-client';
import { io } from 'socket.io-client';

const SOCKET_URL = window.location.hostname === 'ruletka.top' 
  ? 'https://ruletka.top' 
  : 'http://localhost:5001';

class MediasoupService {
  constructor() {
    this.device = null;
    this.socket = io(SOCKET_URL, {
      transports: ['websocket'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      secure: true
    });

    this.producerTransport = null;
    this.consumerTransport = null;
    this.producers = new Map();
    this.consumers = new Map();
    this.initialized = false;
  }

  async init() {
    if (this.initialized) {
      return true;
    }

    try {
      const routerRtpCapabilities = await new Promise((resolve) => {
        this.socket.emit('getRouterRtpCapabilities', resolve);
      });

      this.device = new Device();
      await this.device.load({ routerRtpCapabilities });

      await this.createSendTransport();
      await this.createRecvTransport();

      this.initialized = true;
      return true;
    } catch (error) {
      console.error('Failed to initialize MediaSoup:', error);
      return false;
    }
  }

  async createSendTransport() {
    try {
      console.log('Creating send transport...');
      const response = await new Promise((resolve) => {
        this.socket.emit('createWebRtcTransport', { sender: true }, resolve);
      });

      console.log('Got transport response:', response);

      if (response.error) {
        throw new Error(response.error);
      }

      if (!response.params) {
        throw new Error('No transport parameters in response');
      }

      this.producerTransport = this.device.createSendTransport(response.params);
      console.log('Send transport created:', this.producerTransport.id);

      this.producerTransport.on('connect', async ({ dtlsParameters }, callback, errback) => {
        try {
          console.log('Connecting send transport...');
          const response = await new Promise((resolve) => {
            this.socket.emit('connectWebRtcTransport', {
              dtlsParameters,
              sender: true
            }, resolve);
          });

          if (response.error) {
            throw new Error(response.error);
          }

          console.log('Send transport connected');
          callback();
        } catch (error) {
          console.error('Failed to connect send transport:', error);
          errback(error);
        }
      });

      this.producerTransport.on('produce', async ({ kind, rtpParameters }, callback, errback) => {
        try {
          console.log('Producing track of kind:', kind);
          const response = await new Promise((resolve) => {
            this.socket.emit('produce', { kind, rtpParameters }, resolve);
          });

          if (response.error) {
            throw new Error(response.error);
          }

          console.log('Track produced with ID:', response.id);
          callback({ id: response.id });
        } catch (error) {
          console.error('Failed to produce:', error);
          errback(error);
        }
      });

      return this.producerTransport;
    } catch (error) {
      console.error('Failed to create send transport:', error);
      throw error;
    }
  }

  async createRecvTransport() {
    try {
      console.log('Creating receive transport...');
      const response = await new Promise((resolve) => {
        this.socket.emit('createWebRtcTransport', { sender: false }, resolve);
      });

      if (response.error) {
        throw new Error(response.error);
      }

      if (!response.params) {
        throw new Error('No transport parameters in response');
      }

      this.consumerTransport = this.device.createRecvTransport(response.params);
      console.log('Receive transport created:', this.consumerTransport.id);

      this.consumerTransport.on('connect', async ({ dtlsParameters }, callback, errback) => {
        try {
          console.log('Connecting receive transport...');
          const response = await new Promise((resolve) => {
            this.socket.emit('connectWebRtcTransport', {
              dtlsParameters,
              sender: false
            }, resolve);
          });

          if (response.error) {
            throw new Error(response.error);
          }

          console.log('Receive transport connected');
          callback();
        } catch (error) {
          console.error('Failed to connect receive transport:', error);
          errback(error);
        }
      });

      return this.consumerTransport;
    } catch (error) {
      console.error('Failed to create receive transport:', error);
      throw error;
    }
  }

  async publish(track) {
    if (!this.initialized) {
      await this.init();
    }

    try {
      console.log('Publishing track:', {
        kind: track.kind,
        enabled: track.enabled,
        muted: track.muted,
        readyState: track.readyState
      });

      const producer = await this.producerTransport.produce({
        track,
        encodings: track.kind === 'video' 
          ? [
              { maxBitrate: 100000 },
              { maxBitrate: 300000 },
              { maxBitrate: 900000 }
            ]
          : undefined,
        codecOptions: {
          videoGoogleStartBitrate: 1000
        }
      });

      console.log('Producer created:', producer.id);
      this.producers.set(producer.id, producer);

      producer.on('transportclose', () => {
        console.log('Producer transport closed:', producer.id);
        this.producers.delete(producer.id);
      });

      producer.on('trackended', () => {
        console.log('Producer track ended:', producer.id);
        this.producers.delete(producer.id);
      });

      return producer;
    } catch (error) {
      console.error('Failed to publish track:', error);
      throw error;
    }
  }

  async consume(producerId) {
    try {
      if (!this.device.loaded || !this.consumerTransport) {
        throw new Error('Device or transport not ready');
      }

      const { rtpCapabilities } = this.device;
      const response = await new Promise((resolve) => {
        this.socket.emit('consume', { producerId, rtpCapabilities }, resolve);
      });

      if (response.error) {
        throw new Error(response.error);
      }

      const consumer = await this.consumerTransport.consume({
        id: response.id,
        producerId: response.producerId,
        kind: response.kind,
        rtpParameters: response.rtpParameters
      });

      await new Promise((resolve) => {
        this.socket.emit('resume', consumer.id, resolve);
      });

      return consumer;
    } catch (error) {
      console.error('Failed to consume:', error);
      throw error;
    }
  }

  close() {
    this.producers.forEach(producer => producer.close());
    this.consumers.forEach(consumer => consumer.close());
    if (this.producerTransport) {
      this.producerTransport.close();
    }
    if (this.consumerTransport) {
      this.consumerTransport.close();
    }
    this.initialized = false;
    if (this.socket.connected) {
      this.socket.disconnect();
    }
  }
}

const mediasoupService = new MediasoupService();
export default mediasoupService; 