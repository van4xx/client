import React, { useState, useRef, useEffect } from 'react';
import './VoiceGreeting.css';
import { 
  BsMic, 
  BsStopFill, 
  BsPlayFill, 
  BsPauseFill,
  BsTrash,
  BsCheck2,
  BsX,
  BsSoundwave
} from 'react-icons/bs';
import ProfileFeatures from '../services/ProfileFeatures';

const VoiceGreeting = ({ onClose, currentGreeting }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioBlob, setAudioBlob] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [visualizerData, setVisualizerData] = useState([]);
  const [saved, setSaved] = useState(false);

  const mediaRecorder = useRef(null);
  const audioChunks = useRef([]);
  const audioElement = useRef(new Audio());
  const animationFrame = useRef(null);
  const audioContext = useRef(null);
  const analyser = useRef(null);
  const recordingInterval = useRef(null);

  useEffect(() => {
    if (currentGreeting) {
      setAudioBlob(currentGreeting);
    }
    return () => {
      stopRecording();
      stopPlayback();
    };
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder.current = new MediaRecorder(stream);
      audioChunks.current = [];

      mediaRecorder.current.ondataavailable = (event) => {
        audioChunks.current.push(event.data);
      };

      mediaRecorder.current.onstop = () => {
        const audioBlob = new Blob(audioChunks.current, { type: 'audio/wav' });
        setAudioBlob(audioBlob);
      };

      mediaRecorder.current.start();
      setIsRecording(true);
      setRecordingTime(0);
      
      recordingInterval.current = setInterval(() => {
        setRecordingTime(prev => {
          if (prev >= 30) { // Максимальная длительность 30 секунд
            stopRecording();
            return prev;
          }
          return prev + 1;
        });
      }, 1000);

      // Настройка визуализации
      audioContext.current = new (window.AudioContext || window.webkitAudioContext)();
      analyser.current = audioContext.current.createAnalyser();
      const source = audioContext.current.createMediaStreamSource(stream);
      source.connect(analyser.current);
      analyser.current.fftSize = 256;
      
      const updateVisualizer = () => {
        const dataArray = new Uint8Array(analyser.current.frequencyBinCount);
        analyser.current.getByteFrequencyData(dataArray);
        setVisualizerData(Array.from(dataArray));
        animationFrame.current = requestAnimationFrame(updateVisualizer);
      };
      
      updateVisualizer();
    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder.current && isRecording) {
      mediaRecorder.current.stop();
      mediaRecorder.current.stream.getTracks().forEach(track => track.stop());
      clearInterval(recordingInterval.current);
      cancelAnimationFrame(animationFrame.current);
      setIsRecording(false);
    }
  };

  const playGreeting = () => {
    if (audioBlob) {
      audioElement.current.src = URL.createObjectURL(audioBlob);
      audioElement.current.play();
      setIsPlaying(true);

      audioElement.current.onended = () => {
        setIsPlaying(false);
      };
    }
  };

  const stopPlayback = () => {
    audioElement.current.pause();
    audioElement.current.currentTime = 0;
    setIsPlaying(false);
  };

  const deleteGreeting = () => {
    setAudioBlob(null);
    setRecordingTime(0);
  };

  const saveGreeting = async () => {
    if (audioBlob) {
      const result = await ProfileFeatures.saveVoiceGreeting(1, audioBlob);
      if (result) {
        setSaved(true);
        setTimeout(() => {
          onClose();
        }, 2000);
      }
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="voice-greeting">
      <div className="greeting-header">
        <h2>Голосовое приветствие</h2>
        <button className="close-button" onClick={onClose}>
          <BsX />
        </button>
      </div>

      {!saved ? (
        <div className="greeting-content">
          <div className="recording-visualizer">
            {visualizerData.map((value, index) => (
              <div 
                key={index}
                className="visualizer-bar"
                style={{ height: `${value / 2}px` }}
              />
            ))}
          </div>

          <div className="recording-timer">
            {formatTime(recordingTime)}
          </div>

          <div className="recording-controls">
            {!audioBlob ? (
              <button 
                className={`record-button ${isRecording ? 'recording' : ''}`}
                onClick={isRecording ? stopRecording : startRecording}
              >
                {isRecording ? <BsStopFill /> : <BsMic />}
                {isRecording ? 'Остановить' : 'Записать'}
              </button>
            ) : (
              <div className="playback-controls">
                <button 
                  className="play-button"
                  onClick={isPlaying ? stopPlayback : playGreeting}
                >
                  {isPlaying ? <BsPauseFill /> : <BsPlayFill />}
                </button>
                <button 
                  className="delete-button"
                  onClick={deleteGreeting}
                >
                  <BsTrash />
                </button>
              </div>
            )}
          </div>

          {audioBlob && (
            <div className="greeting-actions">
              <button 
                className="save-button"
                onClick={saveGreeting}
              >
                <BsCheck2 /> Сохранить
              </button>
            </div>
          )}

          <div className="greeting-info">
            <BsSoundwave />
            <p>Запишите короткое приветствие для других пользователей (до 30 секунд)</p>
          </div>
        </div>
      ) : (
        <div className="success-message">
          <BsCheck2 className="success-icon" />
          <h3>Приветствие сохранено!</h3>
          <p>Теперь другие пользователи смогут его услышать</p>
        </div>
      )}
    </div>
  );
};

export default VoiceGreeting; 