import React, { useState, useEffect, useRef } from 'react';
import './Stories.css';
import { 
  BsHeart, 
  BsHeartFill, 
  BsEmojiSmile, 
  BsChat, 
  BsX,
  BsChevronLeft,
  BsChevronRight,
  BsPauseFill,
  BsPlayFill
} from 'react-icons/bs';

const Stories = ({ stories, currentUser }) => {
  const [activeStory, setActiveStory] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const [reaction, setReaction] = useState(null);
  const progressTimer = useRef(null);
  const storyDuration = 5000; // 5 секунд на историю

  useEffect(() => {
    if (activeStory && !isPaused) {
      progressTimer.current = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            handleNextStory();
            return 0;
          }
          return prev + (100 / (storyDuration / 100));
        });
      }, 100);
    }

    return () => clearInterval(progressTimer.current);
  }, [activeStory, isPaused]);

  const handleStoryClick = (story) => {
    setActiveStory(story);
    setActiveIndex(0);
    setProgress(0);
  };

  const handleNextStory = () => {
    if (activeIndex < activeStory.items.length - 1) {
      setActiveIndex(prev => prev + 1);
      setProgress(0);
    } else {
      handleClose();
    }
  };

  const handlePrevStory = () => {
    if (activeIndex > 0) {
      setActiveIndex(prev => prev - 1);
      setProgress(0);
    }
  };

  const handleClose = () => {
    setActiveStory(null);
    setActiveIndex(0);
    setProgress(0);
    setIsPaused(false);
  };

  const handleReaction = (type) => {
    setReaction({ type, timestamp: Date.now() });
    setTimeout(() => setReaction(null), 1500);
  };

  const togglePause = () => {
    setIsPaused(!isPaused);
  };

  return (
    <div className="stories-container">
      <div className="stories-list">
        {/* Добавить историю */}
        <div className="story-avatar add-story" onClick={() => console.log('Add story')}>
          <div className="add-story-icon">+</div>
          <span>Добавить</span>
        </div>

        {/* Список историй */}
        {stories.map((story) => (
          <div 
            key={story.id} 
            className={`story-avatar ${story.viewed ? 'viewed' : ''}`}
            onClick={() => handleStoryClick(story)}
          >
            <img src={story.userAvatar} alt={story.userName} />
            <span>{story.userName}</span>
          </div>
        ))}
      </div>

      {/* Просмотр истории */}
      {activeStory && (
        <div className="story-view">
          <div className="story-header">
            <div className="progress-container">
              {activeStory.items.map((_, idx) => (
                <div 
                  key={idx} 
                  className={`progress-bar ${idx === activeIndex ? 'active' : ''} ${idx < activeIndex ? 'completed' : ''}`}
                >
                  <div 
                    className="progress" 
                    style={{ width: `${idx === activeIndex ? progress : idx < activeIndex ? '100' : '0'}%` }} 
                  />
                </div>
              ))}
            </div>

            <div className="story-info">
              <img src={activeStory.userAvatar} alt={activeStory.userName} />
              <span>{activeStory.userName}</span>
              <span className="story-time">{activeStory.items[activeIndex].time}</span>
            </div>

            <div className="story-controls">
              <button onClick={togglePause}>
                {isPaused ? <BsPlayFill /> : <BsPauseFill />}
              </button>
              <button onClick={handleClose}>
                <BsX />
              </button>
            </div>
          </div>

          <div className="story-content">
            <button className="nav-button prev" onClick={handlePrevStory}>
              <BsChevronLeft />
            </button>

            <div className="story-media">
              {activeStory.items[activeIndex].type === 'image' ? (
                <img src={activeStory.items[activeIndex].url} alt="" />
              ) : (
                <video 
                  src={activeStory.items[activeIndex].url} 
                  autoPlay 
                  muted={isPaused}
                />
              )}
            </div>

            <button className="nav-button next" onClick={handleNextStory}>
              <BsChevronRight />
            </button>
          </div>

          <div className="story-footer">
            <div className="story-input">
              <input type="text" placeholder="Ответить..." />
            </div>
            <div className="story-reactions">
              <button onClick={() => handleReaction('like')}>
                <BsHeart />
              </button>
              <button onClick={() => handleReaction('smile')}>
                <BsEmojiSmile />
              </button>
              <button onClick={() => handleReaction('message')}>
                <BsChat />
              </button>
            </div>
          </div>

          {reaction && (
            <div className="reaction-animation" key={reaction.timestamp}>
              {reaction.type === 'like' && <BsHeartFill />}
              {reaction.type === 'smile' && <BsEmojiSmile />}
              {reaction.type === 'message' && <BsChat />}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Stories; 