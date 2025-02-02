import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ChatRoom from './components/ChatRoom';
import DatingRoom from './components/DatingRoom';
import ProConnect from './components/ProConnect';
import EduHub from './components/EduHub';
import GameConnect from './components/GameConnect';
import StreamHub from './components/StreamHub';
import EventHub from './components/EventHub';
import SkillShare from './components/SkillShare';
import CreativeHub from './components/CreativeHub';
import JobHub from './components/JobHub';
import './App.css';

function App() {
  const [siteType, setSiteType] = useState('chat');

  const handleSiteTypeChange = (type) => {
    setSiteType(type);
  };

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Navigate to="/chat" />} />
          <Route path="/chat" element={<ChatRoom onSiteTypeChange={handleSiteTypeChange} />} />
          <Route path="/dating" element={<DatingRoom onSiteTypeChange={handleSiteTypeChange} />} />
          <Route path="/proconnect" element={<ProConnect onSiteTypeChange={handleSiteTypeChange} />} />
          <Route path="/eduhub" element={<EduHub onSiteTypeChange={handleSiteTypeChange} />} />
          <Route path="/gameconnect" element={<GameConnect onSiteTypeChange={handleSiteTypeChange} />} />
          <Route path="/streamhub" element={<StreamHub onSiteTypeChange={handleSiteTypeChange} />} />
          <Route path="/eventhub" element={<EventHub onSiteTypeChange={handleSiteTypeChange} />} />
          <Route path="/skillshare" element={<SkillShare onSiteTypeChange={handleSiteTypeChange} />} />
          <Route path="/creativehub" element={<CreativeHub onSiteTypeChange={handleSiteTypeChange} />} />
          <Route path="/jobhub" element={<JobHub onSiteTypeChange={handleSiteTypeChange} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
