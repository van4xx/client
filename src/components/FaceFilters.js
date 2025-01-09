import React from 'react';
import './FaceFilters.css';

const FaceFilters = ({ activeFilter, onFilterChange }) => {
  const filters = [
    {
      id: 'none',
      name: 'Без маски',
      filter: '',
      maskUrl: null
    },
    {
      id: 'neon',
      name: 'Неоновый',
      filter: 'brightness(1.2) contrast(1.2) saturate(1.5) hue-rotate(45deg)',
      maskUrl: null
    },
    {
      id: 'vintage',
      name: 'Винтаж',
      filter: 'sepia(0.8) contrast(1.1) brightness(0.9)',
      maskUrl: null
    },
    {
      id: 'cyberpunk',
      name: 'Киберпанк',
      filter: 'brightness(1.3) contrast(1.3) saturate(1.8) hue-rotate(180deg)',
      maskUrl: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9ImN5YmVyIiB4MT0iMCUiIHkxPSIwJSIgeDI9IjEwMCUiIHkyPSIxMDAlIj48c3RvcCBvZmZzZXQ9IjAlIiBzdHlsZT0ic3RvcC1jb2xvcjojZmYwMGZmO3N0b3Atb3BhY2l0eTowLjUiLz48c3RvcCBvZmZzZXQ9IjEwMCUiIHN0eWxlPSJzdG9wLWNvbG9yOiMwMGZmZmY7c3RvcC1vcGFjaXR5OjAuNSIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSJ1cmwoI2N5YmVyKSIvPjwvc3ZnPg=='
    },
    {
      id: 'dog',
      name: 'Собака',
      filter: 'brightness(1.1)',
      maskUrl: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48ZyBmaWxsPSJyZ2JhKDE2NSwgNDIsIDQyLCAwLjcpIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIxNSIvPjxjaXJjbGUgY3g9IjcwIiBjeT0iMzAiIHI9IjE1Ii8+PGNpcmNsZSBjeD0iNTAiIGN5PSI2MCIgcj0iMjAiLz48cGF0aCBkPSJNMjAgMjBMODAgMjBDODAgMjAgODUgNDAgNTAgNDBDMTUgNDAgMjAgMjAgMjAgMjBaIi8+PC9nPjwvc3ZnPg=='
    },
    {
      id: 'cat',
      name: 'Кошка',
      filter: 'brightness(1.1)',
      maskUrl: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48ZyBmaWxsPSJyZ2JhKDAsIDAsIDAsIDAuNykiPjxwYXRoIGQ9Ik0yMCAzMEw0MCA1MEw2MCA1MEw4MCAzMEw3MCA2MEw1MCA3MEwzMCA2MEwyMCAzMFoiLz48Y2lyY2xlIGN4PSI0MCIgY3k9IjQwIiByPSI1Ii8+PGNpcmNsZSBjeD0iNjAiIGN5PSI0MCIgcj0iNSIvPjxwYXRoIGQ9Ik00NSA1NUw1NSA1NUw1MCA2MEw0NSA1NVoiLz48L2c+PC9zdmc+'
    },
    {
      id: 'crown',
      name: 'Корона',
      filter: 'brightness(1.2)',
      maskUrl: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48cGF0aCBkPSJNMjAgNDBMNDAgMjBMNTAgMzBMNjAgMjBMODAgNDBMNjAgNTBMNDAgNTBMMjAgNDBaIiBmaWxsPSJyZ2JhKDI1NSwgMjE1LCAwLCAwLjcpIi8+PC9zdmc+'
    },
    {
      id: 'alien',
      name: 'Пришелец',
      filter: 'hue-rotate(120deg) saturate(1.5) brightness(1.2)',
      maskUrl: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48ZyBmaWxsPSJyZ2JhKDAsIDI1NSwgMCwgMC41KSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMTUiLz48Y2lyY2xlIGN4PSI3MCIgY3k9IjMwIiByPSIxNSIvPjxwYXRoIGQ9Ik0yMCA2MEw4MCA2MEw1MCA5MEwyMCA2MFoiLz48L2c+PC9zdmc+'
    },
    {
      id: 'pirate',
      name: 'Пират',
      filter: 'contrast(1.2)',
      maskUrl: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48ZyBmaWxsPSJyZ2JhKDAsIDAsIDAsIDAuNykiPjxwYXRoIGQ9Ik0yMCAyMEw4MCAyMEw3MCA0MEwzMCA0MEwyMCAyMFoiLz48cmVjdCB4PSI0MCIgeT0iMzAiIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIvPjwvZz48L3N2Zz4='
    },
    {
      id: 'robot',
      name: 'Робот',
      filter: 'brightness(1.2) contrast(1.3)',
      maskUrl: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48ZyBmaWxsPSJyZ2JhKDE5MiwgMTkyLCAxOTIsIDAuNykiPjxyZWN0IHg9IjIwIiB5PSIyMCIgd2lkdGg9IjYwIiBoZWlnaHQ9IjYwIiByeD0iMTAiLz48Y2lyY2xlIGN4PSI0MCIgY3k9IjQwIiByPSI4IiBmaWxsPSJyZ2JhKDAsIDI1NSwgMjU1LCAwLjgpIi8+PGNpcmNsZSBjeD0iNjAiIGN5PSI0MCIgcj0iOCIgZmlsbD0icmdiYSgwLCAyNTUsIDI1NSwgMC44KSIvPjxyZWN0IHg9IjM1IiB5PSI2MCIgd2lkdGg9IjMwIiBoZWlnaHQ9IjUiLz48L2c+PC9zdmc+'
    },
    {
      id: 'superhero',
      name: 'Супергерой',
      filter: 'brightness(1.2) contrast(1.2)',
      maskUrl: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48ZyBmaWxsPSJyZ2JhKDAsIDAsIDAsIDAuNykiPjxwYXRoIGQ9Ik0yMCAyMEw4MCAyMEw3MCA0MEwzMCA0MEwyMCAyMFoiLz48cmVjdCB4PSIzNSIgeT0iMjUiIHdpZHRoPSIzMCIgaGVpZ2h0PSIxMCIvPjwvZz48L3N2Zz4='
    },
    {
      id: 'clown',
      name: 'Клоун',
      filter: 'brightness(1.3) saturate(1.5)',
      maskUrl: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48ZyBmaWxsPSJyZ2JhKDI1NSwgMCwgMCwgMC41KSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMTUiLz48Y2lyY2xlIGN4PSI3MCIgY3k9IjMwIiByPSIxNSIvPjxjaXJjbGUgY3g9IjUwIiBjeT0iNjAiIHI9IjIwIiBmaWxsPSJyZ2JhKDI1NSwgMjU1LCAyNTUsIDAuNykiLz48L2c+PC9zdmc+'
    },
    {
      id: 'unicorn',
      name: 'Единорог',
      filter: 'brightness(1.2) saturate(1.4)',
      maskUrl: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9InJhaW5ib3ciIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPjxzdG9wIG9mZnNldD0iMCUiIHN0eWxlPSJzdG9wLWNvbG9yOiNmZjAwZmY7c3RvcC1vcGFjaXR5OjAuNSIvPjxzdG9wIG9mZnNldD0iNTAlIiBzdHlsZT0ic3RvcC1jb2xvcjojZmZmZjAwO3N0b3Atb3BhY2l0eTowLjUiLz48c3RvcCBvZmZzZXQ9IjEwMCUiIHN0eWxlPSJzdG9wLWNvbG9yOiMwMGZmZmY7c3RvcC1vcGFjaXR5OjAuNSIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPjxwYXRoIGQ9Ik01MCAyMEw3MCA0MEw1MCA2MEwzMCA0MEw1MCAyMFoiIGZpbGw9InVybCgjcmFpbmJvdykiLz48L3N2Zz4='
    }
  ];

  return (
    <div className="face-filters">
      <div className="filters-grid">
        {filters.map((filter) => (
          <button
            key={filter.id}
            className={`filter-button ${activeFilter === filter.id ? 'active' : ''}`}
            onClick={() => onFilterChange(filter)}
          >
            <div className="filter-preview" style={{ filter: filter.filter }}>
              {filter.maskUrl && (
                <img
                  src={filter.maskUrl}
                  alt={filter.name}
                  className="filter-mask"
                />
              )}
            </div>
            <span className="filter-name">{filter.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default FaceFilters; 