import React from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import ChatRoom from './components/ChatRoom';
import DatingRoom from './components/DatingRoom';
import ProConnect from './components/ProConnect';
import EduHub from './components/EduHub';
import GameConnect from './components/GameConnect';
import Profile from './components/Profile';
import './App.css';

function App() {
  const handleSiteTypeChange = (type) => {
    if (type === 'dating') {
      window.location.href = '/dating';
    } else if (type === 'chat') {
      window.location.href = '/';
    } else if (type === 'proconnect') {
      window.location.href = '/proconnect';
    } else if (type === 'eduhub') {
      window.location.href = '/eduhub';
    } else if (type === 'gameconnect') {
      window.location.href = '/gameconnect';
    }
  };

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<ChatRoom onSiteTypeChange={handleSiteTypeChange} />} />
          <Route path="/dating" element={<DatingRoom onSiteTypeChange={handleSiteTypeChange} />} />
          <Route path="/proconnect" element={<ProConnect onSiteTypeChange={handleSiteTypeChange} />} />
          <Route path="/eduhub" element={<EduHub onSiteTypeChange={handleSiteTypeChange} />} />
          <Route path="/gameconnect" element={<GameConnect onSiteTypeChange={handleSiteTypeChange} />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
