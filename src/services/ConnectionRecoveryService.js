class ConnectionRecoveryService {
  constructor() {
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectDelay = 1000;
  }

  async attemptReconnect(mediasoupService) {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      throw new Error('Max reconnection attempts reached');
    }

    try {
      this.reconnectAttempts++;
      await mediasoupService.init();
      this.reconnectAttempts = 0;
      return true;
    } catch (error) {
      console.error('Reconnection attempt failed:', error);
      await new Promise(resolve => setTimeout(resolve, this.reconnectDelay));
      this.reconnectDelay *= 2; // Exponential backoff
      return this.attemptReconnect(mediasoupService);
    }
  }

  async handleDisconnect(mediasoupService, onReconnected, onFailed) {
    try {
      const reconnected = await this.attemptReconnect(mediasoupService);
      if (reconnected) {
        onReconnected();
      }
    } catch (error) {
      onFailed(error);
    }
  }
}

const connectionRecoveryService = new ConnectionRecoveryService();
export default connectionRecoveryService; 