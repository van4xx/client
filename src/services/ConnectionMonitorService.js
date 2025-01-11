class ConnectionMonitorService {
  constructor() {
    this.checkInterval = 1000;
    this.timeoutThreshold = 5000;
    this.lastPongTime = Date.now();
    this.isMonitoring = false;
  }

  startMonitoring(socket, onTimeout) {
    if (this.isMonitoring) return;
    
    this.isMonitoring = true;
    this.lastPongTime = Date.now();

    socket.on('pong', () => {
      this.lastPongTime = Date.now();
    });

    this.intervalId = setInterval(() => {
      socket.emit('ping');
      
      if (Date.now() - this.lastPongTime > this.timeoutThreshold) {
        this.stopMonitoring();
        onTimeout();
      }
    }, this.checkInterval);
  }

  stopMonitoring() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.isMonitoring = false;
    }
  }

  async checkNetworkQuality() {
    try {
      const response = await fetch('https://www.google.com/generate_204');
      return response.status === 204;
    } catch {
      return false;
    }
  }
}

const connectionMonitorService = new ConnectionMonitorService();
export default connectionMonitorService; 