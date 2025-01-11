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
    if (this.initialized) return;

    try {
      await this.loadDevice();
      await this.createSendTransport();
      await this.createRecvTransport();
      this.initialized = true;
      return true;
    } catch (error) {
      console.error('Failed to initialize MediaSoup:', error);
      return false;
    }
  }

  async loadDevice() {
    const routerRtpCapabilities = await new Promise((resolve) => {
      this.socket.emit('getRouterRtpCapabilities', resolve);
    });

    this.device = new Device();
    await this.device.load({ routerRtpCapabilities });
  }

  async createSendTransport() {
    const { params } = await new Promise((resolve) => {
      this.socket.emit('createWebRtcTransport', { sender: true }, resolve);
    });

    this.producerTransport = this.device.createSendTransport(params);

    this.producerTransport.on('connect', async ({ dtlsParameters }, callback, errback) => {
      try {
        await new Promise((resolve, reject) => {
          this.socket.emit('connectWebRtcTransport', {
            dtlsParameters,
            sender: true
          }, (error) => {
            if (error) reject(error);
            else resolve();
          });
        });
        callback();
      } catch (error) {
        errback(error);
      }
    });

    this.producerTransport.on('produce', async ({ kind, rtpParameters }, callback, errback) => {
      try {
        const { id } = await new Promise((resolve) => {
          this.socket.emit('produce', { kind, rtpParameters }, resolve);
        });
        callback({ id });
      } catch (error) {
        errback(error);
      }
    });
  }

  async createRecvTransport() {
    const { params } = await new Promise((resolve) => {
      this.socket.emit('createWebRtcTransport', { sender: false }, resolve);
    });

    this.consumerTransport = this.device.createRecvTransport(params);

    this.consumerTransport.on('connect', async ({ dtlsParameters }, callback, errback) => {
      try {
        await new Promise((resolve, reject) => {
          this.socket.emit('connectWebRtcTransport', {
            dtlsParameters,
            sender: false
          }, (error) => {
            if (error) reject(error);
            else resolve();
          });
        });
        callback();
      } catch (error) {
        errback(error);
      }
    });
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
    const { rtpCapabilities } = this.device;
    const { id, kind, rtpParameters } = await new Promise((resolve) => {
      this.socket.emit('consume', { producerId, rtpCapabilities }, resolve);
    });

    const consumer = await this.consumerTransport.consume({
      id,
      producerId,
      kind,
      rtpParameters
    });

    this.consumers.set(consumer.id, consumer);
    await new Promise((resolve) => this.socket.emit('resume', consumer.id, resolve));
    
    return consumer;
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