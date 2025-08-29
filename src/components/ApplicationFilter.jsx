import { useState, useRef, useEffect } from 'react';
import useApplications from '../hooks/useApplications';

const ApplicationFilter = ({ onApplicationChange, selectedApplication }) => {
  const [internalSelected, setInternalSelected] = useState(selectedApplication || null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  
  const { applications, loading, error } = useApplications();
  
  // Sync internal state with prop changes
  useEffect(() => {
    setInternalSelected(selectedApplication || null);
  }, [selectedApplication]);
  
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
    if (onApplicationChange) {
      onApplicationChange(value);
    }
  };
  
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <div className="data-range-filter">
      <div className="data-range-container">
        <div className="data-range-layout">
          <div className="data-range-label">App: </div>
          <div className="data-range-dropdown-container" ref={dropdownRef}>
            <button onClick={toggleDropdown} className="data-range-dropdown-button">
              {internalSelected || 'Select'}
            </button>
            {isDropdownOpen && (
              <div className="data-range-dropdown">
                {loading ? (
                  <div className="data-range-option">Loading...</div>
                ) : (
                  applications.map((app) => (
                    <div 
                      key={app} 
                      className={`data-range-option ${internalSelected === app ? 'selected' : ''}`}
                      onClick={() => handleChange(app)}
                    >
                      {app}
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicationFilter;