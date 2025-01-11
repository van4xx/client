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
      console.log('MediaSoup already initialized');
      return true;
    }

    try {
      console.log('Initializing MediaSoup...');
      await this.loadDevice();
      await this.createSendTransport();
      await this.createRecvTransport();
      this.initialized = true;
      console.log('MediaSoup initialization completed');
      return true;
    } catch (error) {
      console.error('Failed to initialize MediaSoup:', error);
      return false;
    }
  }

  async loadDevice() {
    try {
      console.log('Requesting router capabilities...');
      const response = await new Promise((resolve) => {
        this.socket.emit('getRouterRtpCapabilities', resolve);
      });

      console.log('Got router capabilities response:', response);

      if (response.error) {
        throw new Error(response.error);
      }

      if (!response.rtpCapabilities) {
        throw new Error('No RTP capabilities in response');
      }

      console.log('Loading device with capabilities:', response.rtpCapabilities);
      this.device = new Device();
      await this.device.load({ routerRtpCapabilities: response.rtpCapabilities });
      console.log('Device loaded successfully');
    } catch (error) {
      console.error('Failed to load device:', error);
      throw error;
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

    if (!this.producerTransport) {
      throw new Error('Producer transport not initialized');
    }

    const producer = await this.producerTransport.produce({ track });
    this.producers.set(producer.id, producer);
    return producer;
  }

  async consume(producerId) {
    try {
      console.log('Consuming producer:', producerId);
      
      if (!this.device.loaded) {
        throw new Error('Device not loaded');
      }

      if (!this.consumerTransport) {
        throw new Error('Consumer transport not initialized');
      }

      const { rtpCapabilities } = this.device;
      console.log('Requesting consume with capabilities:', rtpCapabilities);

      const response = await new Promise((resolve) => {
        this.socket.emit('consume', { producerId, rtpCapabilities }, resolve);
      });

      if (response.error) {
        throw new Error(response.error);
      }

      console.log('Got consume response:', response);

      const {
        id,
        kind,
        rtpParameters,
        producerId: remoteProducerId,
        type
      } = response;

      const consumer = await this.consumerTransport.consume({
        id,
        producerId: remoteProducerId,
        kind,
        rtpParameters
      });

      console.log('Consumer created:', consumer.id, 'kind:', kind);
      this.consumers.set(consumer.id, consumer);

      // Возобновляем получение медиапотока
      await new Promise((resolve) => {
        this.socket.emit('resume', consumer.id, resolve);
      });
      console.log('Consumer resumed');

      return consumer;
    } catch (error) {
      console.error('Error in consume:', error);
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