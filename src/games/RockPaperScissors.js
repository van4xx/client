import React, { useState, useEffect } from 'react';
import { BsHandIndexThumb, BsHandThumbsUp, BsHandThumbsDown } from 'react-icons/bs';
import './Games.css';

const RockPaperScissors = ({ onGameEnd, opponent }) => {
  const [playerChoice, setPlayerChoice] = useState(null);
  const [opponentChoice, setOpponentChoice] = useState(null);
  const [result, setResult] = useState(null);
  const [score, setScore] = useState({ player: 0, opponent: 0 });
  const [countdown, setCountdown] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);

  const choices = [
    { name: 'rock', icon: <BsHandThumbsUp />, beats: 'scissors' },
    { name: 'paper', icon: <BsHandIndexThumb />, beats: 'rock' },
    { name: 'scissors', icon: <BsHandThumbsDown />, beats: 'paper' }
  ];

  const determineWinner = (player, opponent) => {
    if (player === opponent) return 'draw';
    const playerChoice = choices.find(c => c.name === player);
    return playerChoice.beats === opponent ? 'win' : 'lose';
  };

  const handleChoice = (choice) => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    setPlayerChoice(choice);
    setCountdown(3);
    
    // Имитация выбора соперника
    setTimeout(() => {
      const randomChoice = choices[Math.floor(Math.random() * choices.length)].name;
      setOpponentChoice(randomChoice);
      
      const gameResult = determineWinner(choice, randomChoice);
      setResult(gameResult);
      
      if (gameResult === 'win') {
        setScore(prev => ({ ...prev, player: prev.player + 1 }));
      } else if (gameResult === 'lose') {
        setScore(prev => ({ ...prev, opponent: prev.opponent + 1 }));
      }
      
      setIsAnimating(false);
    }, 3000);
  };

  useEffect(() => {
    if (countdown === null) return;
    
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const getResultMessage = () => {
    if (!result) return '';
    if (result === 'draw') return 'Ничья!';
    if (result === 'win') return 'Вы победили!';
    return `${opponent || 'Соперник'} победил!`;
  };

  const renderChoice = (choice, isPlayer = true) => {
    const choiceObj = choices.find(c => c.name === choice);
    if (!choiceObj) return null;
    
    return (
      <div className={`choice-display ${isPlayer ? 'player' : 'opponent'}`}>
        <div className="choice-icon">
          {choiceObj.icon}
        </div>
        <div className="choice-name">
          {choice === 'rock' && 'Камень'}
          {choice === 'paper' && 'Бумага'}
          {choice === 'scissors' && 'Ножницы'}
        </div>
      </div>
    );
  };

  return (
    <div className="rps-game">
      <div className="game-info">
        <div className="score-board">
          <div className="score-item">
            <span className="player-name">Вы</span>
            <span className="score">{score.player}</span>
          </div>
          <div className="score-divider">:</div>
          <div className="score-item">
            <span className="score">{score.opponent}</span>
            <span className="player-name">{opponent || 'Соперник'}</span>
          </div>
        </div>
      </div>

      <div className="game-area">
        <div className="choices-display">
          {playerChoice && renderChoice(playerChoice)}
          {countdown !== null && (
            <div className="countdown">
              {countdown > 0 ? countdown : ''}
            </div>
          )}
          {opponentChoice && renderChoice(opponentChoice, false)}
        </div>

        {result && (
          <div className={`result-message ${result}`}>
            {getResultMessage()}
          </div>
        )}

        <div className="choices-container">
          {choices.map(choice => (
            <button
              key={choice.name}
              className={`choice-button ${playerChoice === choice.name ? 'selected' : ''}`}
              onClick={() => handleChoice(choice.name)}
              disabled={isAnimating}
            >
              <div className="choice-icon">{choice.icon}</div>
              <span className="choice-label">
                {choice.name === 'rock' && 'Камень'}
                {choice.name === 'paper' && 'Бумага'}
                {choice.name === 'scissors' && 'Ножницы'}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RockPaperScissors; 