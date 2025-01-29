import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    BsPeople, 
    BsCircleFill, 
    BsTrash, 
    BsChat, 
    BsPersonCircle,
    BsClock,
    BsSearch
} from 'react-icons/bs';
import FriendsService from '../services/FriendsService';
import './FriendsModal.css';

function FriendsModal({ onClose, onStartChat }) {
    const navigate = useNavigate();
    const [friends, setFriends] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeTab, setActiveTab] = useState('all'); // all, online, offline
    const [selectedFriend, setSelectedFriend] = useState(null);

    useEffect(() => {
        loadFriends();
        // Обновляем список друзей каждые 30 секунд
        const interval = setInterval(loadFriends, 30000);
        return () => clearInterval(interval);
    }, []);

    const loadFriends = () => {
        const allFriends = FriendsService.getFriends() || [];
        setFriends(Array.isArray(allFriends) ? allFriends : []);
    };

    const handleRemoveFriend = (friendId, e) => {
        e.stopPropagation();
        if (window.confirm('Вы уверены, что хотите удалить этого друга?')) {
            FriendsService.removeFriend(friendId);
            loadFriends();
        }
    };

    const handleStartChat = (friend, e) => {
        e.stopPropagation();
        onStartChat(friend);
        onClose();
    };

    const handleFriendClick = (friend) => {
        setSelectedFriend(friend);
    };

    const handleViewProfile = (friendId) => {
        navigate(`/profile/${friendId}`);
        onClose();
    };

    const filteredFriends = Array.isArray(friends) ? friends
        .filter(friend => {
            const matchesSearch = friend.nickname.toLowerCase().includes(searchQuery.toLowerCase());
            if (activeTab === 'online') return matchesSearch && friend.status === 'online';
            if (activeTab === 'offline') return matchesSearch && friend.status === 'offline';
            return matchesSearch;
        })
        .sort((a, b) => {
            // Сортируем сначала онлайн, потом по времени последнего визита
            if (a.status === 'online' && b.status !== 'online') return -1;
            if (a.status !== 'online' && b.status === 'online') return 1;
            return new Date(b.lastSeen) - new Date(a.lastSeen);
        }) : [];

    const formatLastSeen = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diff = now - date;
        
        if (diff < 60000) return 'только что';
        if (diff < 3600000) return `${Math.floor(diff / 60000)} мин. назад`;
        if (diff < 86400000) return `${Math.floor(diff / 3600000)} ч. назад`;
        return date.toLocaleDateString();
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal friends-modal" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h2><BsPeople /> Друзья</h2>
                    <div className="friends-count">
                        {filteredFriends.length} друзей
                    </div>
                    <button className="close-button" onClick={onClose}>×</button>
                </div>

                <div className="friends-content">
                    <div className="friends-search">
                        <div className="search-input">
                            <BsSearch />
                            <input
                                type="text"
                                placeholder="Поиск друзей..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="friends-tabs">
                        <button 
                            className={`tab-button ${activeTab === 'all' ? 'active' : ''}`}
                            onClick={() => setActiveTab('all')}
                        >
                            Все
                        </button>
                        <button 
                            className={`tab-button ${activeTab === 'online' ? 'active' : ''}`}
                            onClick={() => setActiveTab('online')}
                        >
                            Онлайн
                        </button>
                        <button 
                            className={`tab-button ${activeTab === 'offline' ? 'active' : ''}`}
                            onClick={() => setActiveTab('offline')}
                        >
                            Оффлайн
                        </button>
                    </div>

                    <div className="friends-list">
                        {filteredFriends.map(friend => (
                            <div 
                                key={friend.id} 
                                className={`friend-item ${selectedFriend?.id === friend.id ? 'selected' : ''}`}
                                onClick={() => handleFriendClick(friend)}
                            >
                                <div className="friend-avatar">
                                    {friend.avatar ? (
                                        <img src={friend.avatar} alt={friend.nickname} />
                                    ) : (
                                        <BsPersonCircle />
                                    )}
                                    <div className={`status-indicator ${friend.status}`}>
                                        <BsCircleFill />
                                    </div>
                                </div>
                                <div className="friend-info">
                                    <div className="friend-name">{friend.nickname}</div>
                                    <div className="friend-status">
                                        {friend.status === 'online' ? (
                                            'онлайн'
                                        ) : (
                                            <div className="last-seen">
                                                <BsClock />
                                                {formatLastSeen(friend.lastSeen)}
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="friend-actions">
                                    <button 
                                        className="action-button chat"
                                        onClick={(e) => handleStartChat(friend, e)}
                                        title="Начать чат"
                                    >
                                        <BsChat />
                                    </button>
                                    <button 
                                        className="action-button remove"
                                        onClick={(e) => handleRemoveFriend(friend.id, e)}
                                        title="Удалить из друзей"
                                    >
                                        <BsTrash />
                                    </button>
                                </div>
                            </div>
                        ))}
                        {filteredFriends.length === 0 && (
                            <div className="no-friends">
                                {searchQuery ? (
                                    'Друзья не найдены'
                                ) : (
                                    'У вас пока нет друзей'
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default FriendsModal; 