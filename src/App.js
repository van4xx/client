import React from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import ChatRoom from './components/ChatRoom';
import DatingRoom from './components/DatingRoom';
import ProConnect from './components/ProConnect';
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
    }
  };

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<ChatRoom onSiteTypeChange={handleSiteTypeChange} />} />
          <Route path="/dating" element={<DatingRoom onSiteTypeChange={handleSiteTypeChange} />} />
          <Route path="/proconnect" element={<ProConnect onSiteTypeChange={handleSiteTypeChange} />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
