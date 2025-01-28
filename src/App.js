import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ChatRoom from './components/ChatRoom';
import DatingRoom from './components/DatingRoom';
import Profile from './components/Profile';
import './App.css';

function App() {
  const handleSiteTypeChange = (type) => {
    if (type === 'dating') {
      window.location.href = '/dating';
    }
  };

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<ChatRoom onSiteTypeChange={handleSiteTypeChange} />} />
          <Route path="/dating" element={<DatingRoom />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
