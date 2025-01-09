import React from 'react';
import './Mask3DPicker.css';

const Mask3DPicker = ({ activeMask, onMaskChange }) => {
  const masks = [
    { id: 'none', name: 'Без маски', preview: '/previews/none.jpg' },
    { id: 'fox', name: 'Лиса', preview: '/previews/fox.jpg' },
    { id: 'cat', name: 'Кот', preview: '/previews/cat.jpg' },
    { id: 'dog', name: 'Пёс', preview: '/previews/dog.jpg' },
    { id: 'robot', name: 'Робот', preview: '/previews/robot.jpg' },
    { id: 'alien', name: 'Пришелец', preview: '/previews/alien.jpg' },
    { id: 'dragon', name: 'Дракон', preview: '/previews/dragon.jpg' },
    { id: 'demon', name: 'Демон', preview: '/previews/demon.jpg' },
    { id: 'cyborg', name: 'Киборг', preview: '/previews/cyborg.jpg' },
    { id: 'samurai', name: 'Самурай', preview: '/previews/samurai.jpg' },
    { id: 'clown', name: 'Клоун', preview: '/previews/clown.jpg' }
  ];

  return (
    <div className="mask-3d-picker">
      <div className="mask-3d-grid">
        {masks.map((mask) => (
          <button
            key={mask.id}
            className={`mask-3d-button ${activeMask === mask.id ? 'active' : ''}`}
            onClick={() => onMaskChange(mask.id)}
          >
            <div className="mask-3d-preview">
              <img src={mask.preview} alt={mask.name} />
            </div>
            <span className="mask-3d-name">{mask.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default Mask3DPicker; 