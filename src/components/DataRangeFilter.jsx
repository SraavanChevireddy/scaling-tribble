import { useState, useRef, useEffect } from 'react';

const DataRangeFilter = ({ onRangeChange }) => {
  const [selectedRange, setSelectedRange] = useState(null); // Default to null so we can show 'Select'
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  
  const rangeOptions = [7, 30, 60, 90];
  
  // Handle clicks outside of the dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);
  
  const handleChange = (value) => {
    setSelectedRange(value);
    setIsDropdownOpen(false);
    if (onRangeChange) {
      onRangeChange(value);
    }
  };
  
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <div className="data-range-filter">
      <div className="data-range-container">
        <div className="data-range-layout">
          <div className="data-range-label">Data Range:</div>
          <div className="data-range-dropdown-container" ref={dropdownRef}>
            <button onClick={toggleDropdown} className="data-range-dropdown-button">
              {selectedRange ? `${selectedRange} days` : 'Select'}
            </button>
            {isDropdownOpen && (
              <div className="data-range-dropdown">
                {rangeOptions.map((option) => (
                  <div 
                    key={option} 
                    className={`data-range-option ${selectedRange === option ? 'selected' : ''}`}
                    onClick={() => handleChange(option)}
                  >
                    {option} days
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataRangeFilter;