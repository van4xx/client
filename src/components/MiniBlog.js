import React, { useState } from 'react';
import './MiniBlog.css';
import { 
  BsX, 
  BsImage, 
  BsEmojiSmile,
  BsHeart,
  BsHeartFill,
  BsChat,
  BsThreeDots,
  BsTrash,
  BsPencil,
  BsCheck2
} from 'react-icons/bs';
import ProfileFeatures from '../services/ProfileFeatures';

const MiniBlog = ({ user, onClose }) => {
  const [posts, setPosts] = useState([
    {
      id: 1,
      content: 'Прекрасный день для новых знакомств! ☀️',
      media: 'https://source.unsplash.com/random/800x600?nature',
      timestamp: new Date(),
      likes: 12,
      comments: [
        { id: 1, user: 'Анна', text: 'Полностью согласна! 😊', timestamp: new Date() }
      ]
    }
  ]);
  const [newPost, setNewPost] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [editingPost, setEditingPost] = useState(null);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePostSubmit = () => {
    if (newPost.trim() || selectedImage) {
      const post = {
        id: Date.now(),
        content: newPost,
        media: selectedImage,
        timestamp: new Date(),
        likes: 0,
        comments: []
      };

      setPosts(prev => [post, ...prev]);
      setNewPost('');
      setSelectedImage(null);
      setShowEmojiPicker(false);
    }
  };

  const handleLike = (postId) => {
    setPosts(prev => prev.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          likes: post.likes + 1
        };
      }
      return post;
    }));
  };

  const handleEdit = (post) => {
    setEditingPost(post);
    setNewPost(post.content);
    setSelectedImage(post.media);
  };

  const handleDelete = (postId) => {
    setPosts(prev => prev.filter(post => post.id !== postId));
  };

  const handleUpdate = () => {
    setPosts(prev => prev.map(post => {
      if (post.id === editingPost.id) {
        return {
          ...post,
          content: newPost,
          media: selectedImage
        };
      }
      return post;
    }));
    setEditingPost(null);
    setNewPost('');
    setSelectedImage(null);
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString('ru-RU', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="mini-blog">
      <div className="blog-header">
        <h2>Мини-блог</h2>
        <button className="close-button" onClick={onClose}>
          <BsX />
        </button>
      </div>

      <div className="blog-content">
        <div className="create-post">
          <div className="post-input-container">
            <textarea
              placeholder="Что нового?"
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
            />
            {selectedImage && (
              <div className="selected-image">
                <img src={selectedImage} alt="Preview" />
                <button 
                  className="remove-image"
                  onClick={() => setSelectedImage(null)}
                >
                  <BsX />
                </button>
              </div>
            )}
          </div>

          <div className="post-actions">
            <div className="post-tools">
              <label className="upload-image">
                <BsImage />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  style={{ display: 'none' }}
                />
              </label>
              <button 
                className="emoji-button"
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              >
                <BsEmojiSmile />
              </button>
            </div>
            <button 
              className="post-button"
              onClick={editingPost ? handleUpdate : handlePostSubmit}
              disabled={!newPost.trim() && !selectedImage}
            >
              {editingPost ? 'Обновить' : 'Опубликовать'}
            </button>
          </div>
        </div>

        <div className="posts-list">
          {posts.map(post => (
            <div key={post.id} className="post-card">
              <div className="post-header">
                <div className="post-author">
                  <img src={user.photo} alt={user.name} />
                  <div className="author-info">
                    <h3>{user.name}</h3>
                    <span className="post-time">{formatTime(post.timestamp)}</span>
                  </div>
                </div>
                <div className="post-menu">
                  <button 
                    className="menu-button"
                    onClick={() => setEditingPost(post.id === editingPost?.id ? null : post)}
                  >
                    <BsThreeDots />
                  </button>
                  {editingPost?.id === post.id && (
                    <div className="menu-dropdown">
                      <button onClick={() => handleEdit(post)}>
                        <BsPencil /> Редактировать
                      </button>
                      <button onClick={() => handleDelete(post.id)}>
                        <BsTrash /> Удалить
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="post-content">
                <p>{post.content}</p>
                {post.media && (
                  <div className="post-media">
                    <img src={post.media} alt="" />
                  </div>
                )}
              </div>

              <div className="post-footer">
                <button 
                  className={`like-button ${post.liked ? 'liked' : ''}`}
                  onClick={() => handleLike(post.id)}
                >
                  {post.liked ? <BsHeartFill /> : <BsHeart />}
                  <span>{post.likes}</span>
                </button>
                <button className="comment-button">
                  <BsChat />
                  <span>{post.comments.length}</span>
                </button>
              </div>

              {post.comments.length > 0 && (
                <div className="comments-section">
                  {post.comments.map(comment => (
                    <div key={comment.id} className="comment">
                      <strong>{comment.user}</strong>
                      <p>{comment.text}</p>
                      <span className="comment-time">{formatTime(comment.timestamp)}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MiniBlog; 