import React, { useState } from 'react';
import { 
  BsGenderFemale, 
  BsGenderMale, 
  BsGlobe, 
  BsSliders,
  BsXLg
} from 'react-icons/bs';
import './SearchFiltersModal.css';

function SearchFiltersModal({ onClose, onApply }) {
  const [filters, setFilters] = useState({
    gender: 'all',
    ageRange: [18, 50],
    location: 'all',
    language: 'all',
    withCamera: true,
    verified: false
  });

  const countries = {
    popular: [
      { code: 'all', name: 'Все страны' },
      { code: 'nearby', name: 'Поблизости' }
    ],
    cis: [
      { code: 'ru', name: 'Россия' },
      { code: 'by', name: 'Беларусь' },
      { code: 'kz', name: 'Казахстан' },
      { code: 'ua', name: 'Украина' },
      { code: 'uz', name: 'Узбекистан' },
      { code: 'kg', name: 'Киргизия' },
      { code: 'am', name: 'Армения' },
      { code: 'az', name: 'Азербайджан' },
      { code: 'md', name: 'Молдова' },
      { code: 'tj', name: 'Таджикистан' }
    ],
    europe: [
      { code: 'gb', name: 'Великобритания' },
      { code: 'de', name: 'Германия' },
      { code: 'fr', name: 'Франция' },
      { code: 'it', name: 'Италия' },
      { code: 'es', name: 'Испания' },
      { code: 'pl', name: 'Польша' },
      { code: 'ro', name: 'Румыния' },
      { code: 'nl', name: 'Нидерланды' },
      { code: 'hu', name: 'Венгрия' },
      { code: 'se', name: 'Швеция' }
    ],
    asia: [
      { code: 'cn', name: 'Китай' },
      { code: 'jp', name: 'Япония' },
      { code: 'kr', name: 'Южная Корея' },
      { code: 'in', name: 'Индия' },
      { code: 'id', name: 'Индонезия' },
      { code: 'th', name: 'Таиланд' },
      { code: 'vn', name: 'Вьетнам' },
      { code: 'my', name: 'Малайзия' },
      { code: 'ph', name: 'Филиппины' }
    ],
    americas: [
      { code: 'us', name: 'США' },
      { code: 'ca', name: 'Канада' },
      { code: 'br', name: 'Бразилия' },
      { code: 'mx', name: 'Мексика' },
      { code: 'ar', name: 'Аргентина' },
      { code: 'co', name: 'Колумбия' },
      { code: 'cl', name: 'Чили' }
    ]
  };

  const handleChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleApply = () => {
    onApply(filters);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal search-filters-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2><BsSliders /> Фильтры поиска</h2>
          <button className="close-button" onClick={onClose}>
            <BsXLg />
          </button>
        </div>

        <div className="filters-content">
          <div className="filter-group">
            <h3>Пол собеседника</h3>
            <div className="gender-buttons">
              <button
                className={`gender-button ${filters.gender === 'all' ? 'active' : ''}`}
                onClick={() => handleChange('gender', 'all')}
              >
                Все
              </button>
              <button
                className={`gender-button ${filters.gender === 'female' ? 'active' : ''}`}
                onClick={() => handleChange('gender', 'female')}
              >
                <BsGenderFemale /> Девушки
              </button>
              <button
                className={`gender-button ${filters.gender === 'male' ? 'active' : ''}`}
                onClick={() => handleChange('gender', 'male')}
              >
                <BsGenderMale /> Парни
              </button>
            </div>
          </div>

          <div className="filter-group">
            <h3>Возраст</h3>
            <div className="age-range">
              <input
                type="number"
                min="18"
                max="99"
                value={filters.ageRange[0]}
                onChange={e => handleChange('ageRange', [
                  parseInt(e.target.value),
                  filters.ageRange[1]
                ])}
              />
              <span>—</span>
              <input
                type="number"
                min="18"
                max="99"
                value={filters.ageRange[1]}
                onChange={e => handleChange('ageRange', [
                  filters.ageRange[0],
                  parseInt(e.target.value)
                ])}
              />
            </div>
          </div>

          <div className="filter-group">
            <h3>Местоположение</h3>
            <select
              value={filters.location}
              onChange={e => handleChange('location', e.target.value)}
              className="country-select"
            >
              <optgroup label="Популярные">
                {countries.popular.map(country => (
                  <option key={country.code} value={country.code}>
                    {country.name}
                  </option>
                ))}
              </optgroup>
              <optgroup label="СНГ">
                {countries.cis.map(country => (
                  <option key={country.code} value={country.code}>
                    {country.name}
                  </option>
                ))}
              </optgroup>
              <optgroup label="Европа">
                {countries.europe.map(country => (
                  <option key={country.code} value={country.code}>
                    {country.name}
                  </option>
                ))}
              </optgroup>
              <optgroup label="Азия">
                {countries.asia.map(country => (
                  <option key={country.code} value={country.code}>
                    {country.name}
                  </option>
                ))}
              </optgroup>
              <optgroup label="Америка">
                {countries.americas.map(country => (
                  <option key={country.code} value={country.code}>
                    {country.name}
                  </option>
                ))}
              </optgroup>
            </select>
          </div>

          <div className="filter-group">
            <h3>Язык общения</h3>
            <select
              value={filters.language}
              onChange={e => handleChange('language', e.target.value)}
            >
              <option value="all">Любой</option>
              <option value="ru">Русский</option>
              <option value="en">English</option>
              <option value="es">Español</option>
            </select>
          </div>

          <div className="filter-group">
            <h3>Дополнительно</h3>
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={filters.withCamera}
                onChange={e => handleChange('withCamera', e.target.checked)}
              />
              Только с камерой
            </label>
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={filters.verified}
                onChange={e => handleChange('verified', e.target.checked)}
              />
              Только проверенные
            </label>
          </div>
        </div>

        <div className="modal-footer">
          <button className="reset-button" onClick={() => setFilters({
            gender: 'all',
            ageRange: [18, 50],
            location: 'all',
            language: 'all',
            withCamera: true,
            verified: false
          })}>
            Сбросить
          </button>
          <button className="apply-button" onClick={handleApply}>
            Применить
          </button>
        </div>
      </div>
    </div>
  );
}

export default SearchFiltersModal; 