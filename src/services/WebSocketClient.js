class WebSocketClient {
  constructor(url, options = {}) {
    // Convert http/https to ws/wss if needed
    this.url = url.replace('http://', 'ws://').replace('https://', 'wss://');
    if (!this.url.endsWith('/socket.io/?EIO=4&transport=websocket')) {
      this.url += '/socket.io/?EIO=4&transport=websocket';
    }
    
    this.options = options;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = options.maxReconnectAttempts || 5;
    this.reconnectInterval = options.reconnectInterval || 5000;
    this.handlers = {
      message: [],
      open: [],
      close: [],
      error: []
    };
    this.isIntentionalClose = false;
    this.pingInterval = null;
    this.connect();
  }

  connect() {
    try {
      console.log('Connecting to WebSocket:', this.url);
      this.ws = new WebSocket(this.url);
      
      this.ws.onmessage = (event) => this.handleMessage(event);
      this.ws.onopen = () => this.handleOpen();
      this.ws.onclose = (event) => this.handleClose(event);
      this.ws.onerror = (error) => this.handleError(error);
    } catch (error) {
      console.error('WebSocket connection error:', error);
      this.attemptReconnect();
    }
  }

  handleMessage(event) {
    try {
      const data = event.data;
      
      // Handle Socket.IO protocol messages
      if (typeof data === 'string') {
        // Socket.IO ping message
        if (data === '2') {
          this.ws.send('3'); // Respond with pong
          return;
        }
        
        // Socket.IO handshake
        if (data.startsWith('0')) {
          const config = JSON.parse(data.slice(1));
          this.setupHeartbeat(config);
          return;
        }
        
        // Regular message starting with '42' (Socket.IO message identifier)
        if (data.startsWith('42')) {
          try {
            const parsedData = JSON.parse(data.slice(2));
            this.handlers.message.forEach(handler => handler(JSON.stringify({
              type: parsedData[0],
              ...parsedData[1]
            })));
          } catch (e) {
            console.warn('Failed to parse message:', e);
          }
          return;
        }
      }
      
      // Pass through any other messages
      this.handlers.message.forEach(handler => handler(data));
    } catch (error) {
      console.error('Error handling message:', error);
    }
  }

  setupHeartbeat(config) {
    if (this.pingInterval) {
      clearInterval(this.pingInterval);
    }
    
    // Setup ping interval
    this.pingInterval = setInterval(() => {
      if (this.ws.readyState === WebSocket.OPEN) {
        this.ws.send('2');
      }
    }, config.pingInterval || 25000);
  }

  handleOpen() {
    console.log('WebSocket connected successfully');
    this.reconnectAttempts = 0;
    this.handlers.open.forEach(handler => handler());
  }

  handleClose(event) {
    console.log('WebSocket closed:', event.code, event.reason);
    if (this.pingInterval) {
      clearInterval(this.pingInterval);
      this.pingInterval = null;
    }
    
    this.handlers.close.forEach(handler => handler(event));
    
    if (!this.isIntentionalClose) {
      this.attemptReconnect();
    }
  }

  handleError(error) {
    console.error('WebSocket error:', error);
    this.handlers.error.forEach(handler => handler(error));
  }

  attemptReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`);
      setTimeout(() => this.connect(), this.reconnectInterval * Math.pow(2, this.reconnectAttempts - 1));
    } else {
      console.error('Max reconnection attempts reached');
      this.handlers.error.forEach(handler => 
        handler(new Error('Max reconnection attempts reached'))
      );
    }
  }

  on(event, handler) {
    if (this.handlers[event]) {
      this.handlers[event].push(handler);
    }
  }

  send(data) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      try {
        // Format message according to Socket.IO protocol
        const message = JSON.parse(data);
        const socketMessage = `42${JSON.stringify([message.type, message])}`;
        this.ws.send(socketMessage);
      } catch (error) {
        console.error('Error sending message:', error);
        this.handlers.error.forEach(handler => handler(error));
      }
    } else {
      console.warn('WebSocket is not connected, message not sent');
    }
  }

  close() {
    this.isIntentionalClose = true;
    if (this.pingInterval) {
      clearInterval(this.pingInterval);
      this.pingInterval = null;
    }
    if (this.ws) {
      this.ws.close();
    }
  }
}

export default WebSocketClient; 