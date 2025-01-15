import React from 'react';
import ChatRoom from './components/ChatRoom';
import { ThemeProvider } from './context/ThemeContext';
import './App.css';

function App() {
  return (
    <ThemeProvider>
      <div className="App">
        <ChatRoom />
      </div>
    </ThemeProvider>
  );
}

export default App;
