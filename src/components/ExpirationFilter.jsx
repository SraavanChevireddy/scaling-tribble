import { useState, useRef, useEffect } from 'react';

const ExpirationFilter = ({ onExpirationChange }) => {
  const [selectedExpiration, setSelectedExpiration] = useState(null); // Default to null to show 'Select'
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState('left');
  const dropdownRef = useRef(null);
  
  // Longer option labels need proper dropdown width
  const expirationOptions = [
    { id: '7days', label: 'Expiring in 7 days' },
    { id: '30days', label: 'Expiring in 30 days' },
    { id: '90days', label: 'Expiring in 90 days' },
    { id: 'never', label: 'Never expires' }
  ];
  
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
    setSelectedExpiration(value);
    setIsDropdownOpen(false);
    if (onExpirationChange) {
      onExpirationChange(value);
    }
  };
  
  const toggleDropdown = () => {
    if (!isDropdownOpen) {
      // Calculate position before opening dropdown
      if (dropdownRef.current) {
        const rect = dropdownRef.current.getBoundingClientRect();
        const dropdownWidth = 200; // Approximate dropdown width
        const screenWidth = window.innerWidth;
        const spaceOnRight = screenWidth - rect.right;
        
        // If there's not enough space on the right, position from the right edge
        if (spaceOnRight < dropdownWidth) {
          setDropdownPosition('right');
        } else {
          setDropdownPosition('left');
        }
      }
    }
    setIsDropdownOpen(!isDropdownOpen);
  };

  const getSelectedLabel = () => {
    if (!selectedExpiration) return 'Select';
    const option = expirationOptions.find(opt => opt.id === selectedExpiration);
    return option ? option.label : 'Select';
  };

  return (
    <div className="data-range-filter">
      <div className="data-range-container">
        <div className="data-range-layout">
          <div className="data-range-label">Expiration: </div>
          <div className="data-range-dropdown-container" ref={dropdownRef}>
            <button onClick={toggleDropdown} className="data-range-dropdown-button">
              {getSelectedLabel()}
            </button>
            {isDropdownOpen && (
              <div 
                className="data-range-dropdown"
                style={{
                  left: dropdownPosition === 'left' ? '0' : 'auto',
                  right: dropdownPosition === 'right' ? '0' : 'auto',
                  minWidth: '200px'
                }}
              >
                {expirationOptions.map((option) => (
                  <div 
                    key={option.id} 
                    className={`data-range-option ${selectedExpiration === option.id ? 'selected' : ''}`}
                    onClick={() => handleChange(option.id)}
                  >
                    {option.label}
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

export default ExpirationFilter;
