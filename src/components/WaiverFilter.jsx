import { useState, useRef, useEffect } from 'react';

const WaiverFilter = ({ onWaiverChange, selectedWaiver }) => {
  const [internalSelected, setInternalSelected] = useState(selectedWaiver || null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  
  const waiverOptions = ['Root', 'Organisational', 'Manual', 'Auto'];
  
  // Sync internal state with prop changes
  useEffect(() => {
    setInternalSelected(selectedWaiver || null);
  }, [selectedWaiver]);

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
    setInternalSelected(value);
    setIsDropdownOpen(false);
    if (onWaiverChange) {
      onWaiverChange(value);
    }
  };
  
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <div className="data-range-filter">
      <div className="data-range-container">
        <div className="data-range-layout">
          <div className="data-range-label">Waiver: </div>
          <div className="data-range-dropdown-container" ref={dropdownRef}>
            <button onClick={toggleDropdown} className="data-range-dropdown-button">
              {internalSelected || 'Select'}
            </button>
            {isDropdownOpen && (
              <div className="data-range-dropdown">
                {waiverOptions.map((option) => (
                  <div 
                    key={option} 
                    className={`data-range-option ${internalSelected === option ? 'selected' : ''}`}
                    onClick={() => handleChange(option)}
                  >
                    {option}
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

export default WaiverFilter;
