class WebSocketClient {
  constructor(url, options = {}) {
    this.url = url;
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
    this.connect();
  }

  connect() {
    try {
      this.ws = new WebSocket(this.url);
      this.ws.onmessage = (event) => this.handleMessage(event);
      this.ws.onopen = () => this.handleOpen();
      this.ws.onclose = () => this.handleClose();
      this.ws.onerror = (error) => this.handleError(error);
    } catch (error) {
      console.error('WebSocket connection error:', error);
      this.attemptReconnect();
    }
  }

  handleMessage(event) {
    this.handlers.message.forEach(handler => handler(event.data));
  }

  handleOpen() {
    console.log('WebSocket connected');
    this.reconnectAttempts = 0;
    this.handlers.open.forEach(handler => handler());
  }

  handleClose() {
    console.log('WebSocket closed');
    this.handlers.close.forEach(handler => handler());
    this.attemptReconnect();
  }

  handleError(error) {
    console.error('WebSocket error:', error);
    this.handlers.error.forEach(handler => handler(error));
  }

  attemptReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`);
      setTimeout(() => this.connect(), this.reconnectInterval);
    } else {
      console.error('Max reconnection attempts reached');
    }
  }

  on(event, handler) {
    if (this.handlers[event]) {
      this.handlers[event].push(handler);
    }
  }

  send(data) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(data);
    } else {
      console.warn('WebSocket is not connected, message not sent');
    }
  }

  close() {
    if (this.ws) {
      this.ws.close();
    }
  }
}

export default WebSocketClient; 