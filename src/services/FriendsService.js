class FriendsService {
    constructor() {
        this.friends = this.loadFriends();
    }

    loadFriends() {
        const savedFriends = localStorage.getItem('userFriends');
        return savedFriends ? JSON.parse(savedFriends) : [];
    }

    saveFriends() {
        localStorage.setItem('userFriends', JSON.stringify(this.friends));
    }

    addFriend(user) {
        if (!this.isFriend(user.id)) {
            const friend = {
                id: user.id,
                nickname: user.nickname,
                avatar: user.avatar,
                status: 'offline',
                lastSeen: new Date().toISOString(),
                addedAt: new Date().toISOString()
            };
            this.friends.push(friend);
            this.saveFriends();
            return friend;
        }
        return null;
    }

    removeFriend(userId) {
        this.friends = this.friends.filter(friend => friend.id !== userId);
        this.saveFriends();
    }

    getFriends() {
        return this.friends;
    }

    getFriend(userId) {
        return this.friends.find(friend => friend.id === userId);
    }

    isFriend(userId) {
        return this.friends.some(friend => friend.id === userId);
    }

    updateFriendStatus(userId, status) {
        const friend = this.friends.find(friend => friend.id === userId);
        if (friend) {
            friend.status = status;
            friend.lastSeen = new Date().toISOString();
            this.saveFriends();
        }
    }

    getOnlineFriends() {
        return this.friends.filter(friend => friend.status === 'online');
    }

    getOfflineFriends() {
        return this.friends.filter(friend => friend.status === 'offline');
    }
}

export default new FriendsService(); 