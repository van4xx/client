import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './components/Home';
import ChatRoom from './components/ChatRoom';

function App() {
  const [currentTheme, setCurrentTheme] = useState('night');
  const [onlineUsers, setOnlineUsers] = useState(0);

  useEffect(() => {
    const mockOnlineCount = () => {
      setOnlineUsers(Math.floor(Math.random() * 1000) + 500);
    };
    mockOnlineCount();
    const interval = setInterval(mockOnlineCount, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleThemeChange = (theme) => {
    setCurrentTheme(theme);
  };

  return (
    <Router>
      <Header 
        currentTheme={currentTheme} 
        onThemeChange={handleThemeChange}
        onlineUsers={onlineUsers}
      />
      <Routes>
        <Route path="/" element={
          <Home 
            currentTheme={currentTheme}
            onlineUsers={onlineUsers}
          />
        } />
        <Route path="/chat" element={
          <ChatRoom 
            currentTheme={currentTheme}
          />
        } />
      </Routes>
    </Router>
  );
}

export default App;
