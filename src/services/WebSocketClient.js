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
      this.handlers.message.forEach(handler => handler(event.data));
    } catch (error) {
      console.error('Error handling message:', error);
    }
  }

  handleOpen() {
    console.log('WebSocket connected successfully');
    this.reconnectAttempts = 0;
    this.handlers.open.forEach(handler => handler());
  }

  handleClose(event) {
    console.log('WebSocket closed:', event.code, event.reason);
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
        this.ws.send(data);
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
    if (this.ws) {
      this.ws.close();
    }
  }
}

export default WebSocketClient; 