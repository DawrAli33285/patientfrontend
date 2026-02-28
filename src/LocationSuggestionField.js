import { useState, useEffect, useRef } from 'react';
import React from 'react';

const LocationSuggestionField = ({ value, onChange, name = "location", required = false }) => {
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);
  const wrapperRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchSuggestions = async () => {
      const inputValue = typeof value === 'string' ? value : value?.name || '';
      
      if (!inputValue || inputValue.length < 3) {
        setSuggestions([]);
        return;
      }

      setLoading(true);
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(inputValue)}&limit=5&addressdetails=1`,
          {
            headers: {
              'User-Agent': 'LocationSuggestionApp/1.0'
            }
          }
        );
        
        const data = await response.json();
        
        const formattedSuggestions = data.map(item => ({
          name: item.display_name,
          city: item.address?.city || item.address?.town || item.address?.village || '',
          state: item.address?.state || '',
          country: item.address?.country || '',
          latitude: parseFloat(item.lat),
          longitude: parseFloat(item.lon)
        }));
        
        setSuggestions(formattedSuggestions);
        setShowSuggestions(true);
      } catch (error) {
        console.error('Error fetching location suggestions:', error);
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    };

    const debounceTimer = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(debounceTimer);
  }, [value]);

  const handleInputChange = (e) => {
    onChange(e.target.value);
    setShowSuggestions(true);
  };

  const handleSelectSuggestion = (suggestion) => {
    onChange({
      name: suggestion.name,
      latitude: suggestion.latitude,
      longitude: suggestion.longitude
    });
    setShowSuggestions(false);
    setSuggestions([]);
  };

  const displayValue = typeof value === 'string' ? value : value?.name || '';

  return (
    <div ref={wrapperRef} style={styles.wrapper}>
      <input
        type="text"
        name={name}
        value={displayValue}
        onChange={handleInputChange}
        onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
        style={styles.input}
        placeholder="e.g., Starbucks, 123 Main St, New York, NY"
        required={required}
        autoComplete="off"
      />
      
      {loading && (
        <div style={styles.loadingIcon}>
          <svg style={styles.spinner} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle style={styles.spinnerCircle} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path style={styles.spinnerPath} fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
      )}

      {showSuggestions && suggestions.length > 0 && (
        <ul style={styles.suggestionsList}>
          {suggestions.map((suggestion, index) => (
            <li
              key={index}
              onClick={() => handleSelectSuggestion(suggestion)}
              style={styles.suggestionItem}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#4f46e5'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              <div style={styles.suggestionText}>{suggestion.name}</div>
            </li>
          ))}
        </ul>
      )}

      {showSuggestions && !loading && displayValue && displayValue.length >= 3 && suggestions.length === 0 && (
        <div style={styles.noResults}>
          No locations found
        </div>
      )}
    </div>
  );
};

const styles = {
  wrapper: {
    position: 'relative',
    width: '100%',
  },
  input: {
    width: '100%',
    padding: '0.75rem',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    fontSize: '1rem',
    outline: 'none',
    transition: 'border-color 0.2s',
    boxSizing: 'border-box',
  },
  loadingIcon: {
    position: 'absolute',
    right: '12px',
    top: '12px',
    color: '#9ca3af',
  },
  spinner: {
    width: '16px',
    height: '16px',
    animation: 'spin 1s linear infinite',
  },
  spinnerCircle: {
    opacity: 0.25,
  },
  spinnerPath: {
    opacity: 0.75,
  },
  suggestionsList: {
    position: 'absolute',
    zIndex: 10,
    width: '100%',
    backgroundColor: 'white',
    border: '1px solid #d1d5db',
    borderRadius: '0 0 6px 6px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    maxHeight: '240px',
    overflowY: 'auto',
    marginTop: '4px',
    listStyle: 'none',
    padding: 0,
    margin: 0,
  },
  suggestionItem: {
    padding: '0.75rem',
    cursor: 'pointer',
    borderBottom: '1px solid #f3f4f6',
    fontSize: '0.875rem',
    transition: 'all 0.2s',
    color: '#374151',
  },
  suggestionText: {
    color: 'inherit',
  },
  noResults: {
    position: 'absolute',
    zIndex: 10,
    width: '100%',
    backgroundColor: 'white',
    border: '1px solid #d1d5db',
    borderRadius: '0 0 6px 6px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    marginTop: '4px',
    padding: '0.75rem',
    fontSize: '0.875rem',
    color: '#6b7280',
  },
};

export default LocationSuggestionField;