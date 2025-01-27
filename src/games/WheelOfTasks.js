import React, { useState, useEffect, useRef } from 'react';
import './Games.css';

const WheelOfTasks = ({ onGameEnd, opponent }) => {
  const canvasRef = useRef(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [currentTask, setCurrentTask] = useState(null);
  const [completedTasks, setCompletedTasks] = useState([]);
  const [spinDuration, setSpinDuration] = useState(0);
  const [rotation, setRotation] = useState(0);

  const tasks = [
    { text: "Спой песню", color: "#FF6B6B" },
    { text: "Расскажи анекдот", color: "#4ECDC4" },
    { text: "Покажи фокус", color: "#45B7D1" },
    { text: "Изобрази животное", color: "#96CEB4" },
    { text: "Станцуй", color: "#FFD93D" },
    { text: "Расскажи историю", color: "#6C5B7B" },
    { text: "Изобрази эмоцию", color: "#F7A072" },
    { text: "Сделай комплимент", color: "#99B898" }
  ];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = 400;
    canvas.height = 400;
    drawWheel();
  }, []);

  useEffect(() => {
    if (isSpinning) {
      const spinAnimation = requestAnimationFrame(updateSpin);
      return () => cancelAnimationFrame(spinAnimation);
    }
  }, [isSpinning, rotation]);

  const drawWheel = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) - 10;

    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(rotation);

    // Рисуем сегменты
    const segmentAngle = (2 * Math.PI) / tasks.length;
    tasks.forEach((task, index) => {
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, radius, index * segmentAngle, (index + 1) * segmentAngle);
      ctx.lineTo(0, 0);
      ctx.fillStyle = task.color;
      ctx.fill();
      ctx.stroke();

      // Добавляем текст
      ctx.save();
      ctx.rotate(index * segmentAngle + segmentAngle / 2);
      ctx.textAlign = 'right';
      ctx.fillStyle = '#fff';
      ctx.font = '14px Arial';
      ctx.fillText(task.text, radius - 20, 5);
      ctx.restore();
    });

    // Рисуем центр колеса
    ctx.beginPath();
    ctx.arc(0, 0, 15, 0, 2 * Math.PI);
    ctx.fillStyle = '#fff';
    ctx.fill();
    ctx.stroke();

    ctx.restore();

    // Рисуем указатель
    ctx.beginPath();
    ctx.moveTo(centerX + radius, centerY);
    ctx.lineTo(centerX + radius + 20, centerY - 10);
    ctx.lineTo(centerX + radius + 20, centerY + 10);
    ctx.closePath();
    ctx.fillStyle = '#FF4136';
    ctx.fill();
  };

  const updateSpin = () => {
    if (spinDuration > 0) {
      const newRotation = rotation + (spinDuration / 100);
      setRotation(newRotation);
      setSpinDuration(prev => prev - 1);
      drawWheel();
      requestAnimationFrame(updateSpin);
    } else {
      setIsSpinning(false);
      const selectedSegment = Math.floor(((rotation % (2 * Math.PI)) / (2 * Math.PI)) * tasks.length);
      const task = tasks[selectedSegment];
      setCurrentTask(task);
      setCompletedTasks(prev => [...prev, task]);
    }
  };

  const spinWheel = () => {
    if (isSpinning) return;
    setIsSpinning(true);
    setCurrentTask(null);
    setSpinDuration(100 + Math.random() * 100);
  };

  const completeTask = () => {
    setCurrentTask(null);
  };

  const skipTask = () => {
    setCurrentTask(null);
  };

  return (
    <div className="wheel-game">
      <div className="game-info">
        <div className="score-board">
          <div className="score-item">
            <span className="player-name">Выполнено заданий</span>
            <span className="score">{completedTasks.length}</span>
          </div>
        </div>
      </div>

      <div className="game-area">
        <div className="wheel-container">
          <canvas
            ref={canvasRef}
            className="wheel-canvas"
            onClick={spinWheel}
          />
          <button 
            className="game-button spin-button"
            onClick={spinWheel}
            disabled={isSpinning}
          >
            {isSpinning ? 'Крутится...' : 'Крутить колесо'}
          </button>
        </div>

        {currentTask && (
          <div className="task-overlay">
            <div className="task-card">
              <h3>Ваше задание:</h3>
              <p>{currentTask.text}</p>
              <div className="task-buttons">
                <button className="game-button success" onClick={completeTask}>
                  Выполнено
                </button>
                <button className="game-button danger" onClick={skipTask}>
                  Пропустить
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="completed-tasks">
        <h4>Выполненные задания:</h4>
        <div className="tasks-list">
          {completedTasks.map((task, index) => (
            <div key={index} className="completed-task" style={{ backgroundColor: task.color }}>
              {task.text}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WheelOfTasks; 