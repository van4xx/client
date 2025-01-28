import React, { useState, useEffect, useRef } from 'react';
import './MessagesPage.css';
import { 
  BsArrowLeft,
  BsThreeDotsVertical,
  BsSend,
  BsEmojiSmile,
  BsPaperclip,
  BsImageFill,
  BsSearch,
  BsCheckAll,
  BsCheck
} from 'react-icons/bs';

function MessagesPage({ onBack }) {
  const [conversations, setConversations] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [message, setMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // Загрузка списка диалогов
    setConversations([
      {
        id: 1,
        user: {
          id: 'user2',
          name: 'Анна',
          photo: 'https://placekitten.com/100/100',
          isOnline: true
        },
        lastMessage: {
          text: 'Привет! Как дела?',
          timestamp: new Date(),
          isRead: false
        },
        messages: [
          {
            id: 1,
            senderId: 'user2',
            text: 'Привет! Как дела?',
            timestamp: new Date(),
            isRead: false
          }
        ]
      },
      // Добавьте больше диалогов
    ]);
  }, []);

  useEffect(() => {
    // Прокрутка к последнему сообщению
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [selectedChat]);

  const handleSendMessage = () => {
    if (!message.trim() || !selectedChat) return;

    const newMessage = {
      id: Date.now(),
      senderId: 'user1', // текущий пользователь
      text: message,
      timestamp: new Date(),
      isRead: false
    };

    setConversations(prev => prev.map(conv => {
      if (conv.id === selectedChat.id) {
        return {
          ...conv,
          messages: [...conv.messages, newMessage],
          lastMessage: {
            text: message,
            timestamp: new Date(),
            isRead: false
          }
        };
      }
      return conv;
    }));

    setMessage('');
  };

  const filteredConversations = conversations.filter(conv =>
    conv.user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="messages-page">
      <div className="messages-header">
        <button className="back-button" onClick={onBack}>
          <BsArrowLeft /> Назад
        </button>
        <h1>Сообщения</h1>
        <div className="search-messages">
          <BsSearch />
          <input
            type="text"
            placeholder="Поиск диалогов"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="messages-container">
        <div className="conversations-list">
          {filteredConversations.map(conv => (
            <div
              key={conv.id}
              className={`conversation-item ${selectedChat?.id === conv.id ? 'active' : ''}`}
              onClick={() => setSelectedChat(conv)}
            >
              <div className="conversation-photo">
                <img src={conv.user.photo} alt={conv.user.name} />
                {conv.user.isOnline && <div className="online-status" />}
              </div>
              <div className="conversation-info">
                <div className="conversation-header">
                  <h3>{conv.user.name}</h3>
                  <span className="last-message-time">
                    {new Date(conv.lastMessage.timestamp).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
                <div className="conversation-preview">
                  <p>{conv.lastMessage.text}</p>
                  {!conv.lastMessage.isRead && <div className="unread-badge" />}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="chat-area">
          {selectedChat ? (
            <>
              <div className="chat-header">
                <div className="chat-user-info">
                  <img src={selectedChat.user.photo} alt={selectedChat.user.name} />
                  <div>
                    <h3>{selectedChat.user.name}</h3>
                    <span className={`user-status ${selectedChat.user.isOnline ? 'online' : ''}`}>
                      {selectedChat.user.isOnline ? 'онлайн' : 'был(а) недавно'}
                    </span>
                  </div>
                </div>
                <button className="more-options">
                  <BsThreeDotsVertical />
                </button>
              </div>

              <div className="messages-list">
                {selectedChat.messages.map(msg => (
                  <div
                    key={msg.id}
                    className={`message ${msg.senderId === 'user1' ? 'sent' : 'received'}`}
                  >
                    <div className="message-content">
                      <p>{msg.text}</p>
                      <div className="message-info">
                        <span className="message-time">
                          {new Date(msg.timestamp).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                        {msg.senderId === 'user1' && (
                          <span className="message-status">
                            {msg.isRead ? <BsCheckAll /> : <BsCheck />}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              <div className="message-input">
                <button className="emoji-button">
                  <BsEmojiSmile />
                </button>
                <button className="attach-button">
                  <BsPaperclip />
                </button>
                <input
                  type="text"
                  placeholder="Введите сообщение..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleSendMessage();
                    }
                  }}
                />
                <button 
                  className="send-button"
                  onClick={handleSendMessage}
                  disabled={!message.trim()}
                >
                  <BsSend />
                </button>
              </div>
            </>
          ) : (
            <div className="no-chat-selected">
              <BsImageFill />
              <p>Выберите диалог для начала общения</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MessagesPage; 