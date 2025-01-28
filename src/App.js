import React, { useState } from 'react';
import './App.css';
import ChatRoom from './components/ChatRoom';
import DatingRoom from './components/DatingRoom';

function App() {
  const [siteType, setSiteType] = useState('chat'); // 'chat' or 'dating'

  return (
    <div className="app">
      {siteType === 'chat' ? 
        <ChatRoom onSiteTypeChange={setSiteType} /> : 
        <DatingRoom onSiteTypeChange={setSiteType} />
      }
    </div>
  );
}

export default App;
