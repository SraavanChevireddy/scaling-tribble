import { useState, useRef, useEffect } from 'react';
import WaiverFilter from './WaiverFilter';
import ApplicationFilter from './ApplicationFilter';
import ExpirationFilter from './ExpirationFilter';

const FilterSection = ({ 
  onRangeChange, 
  onWaiverChange, 
  onApplicationChange, 
  onExpirationChange,
  onFilterApplied
}) => {
  const [selectedRange, setSelectedRange] = useState(null);
  const [isRangeDropdownOpen, setIsRangeDropdownOpen] = useState(false);
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);
  const [hasActiveFilters, setHasActiveFilters] = useState(false);
  
  // State for tracking filter values
  const [selectedWaiver, setSelectedWaiver] = useState(null);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [selectedExpiration, setSelectedExpiration] = useState(null);
  
  // State for applied filters (shown as chips)
  const [appliedFilters, setAppliedFilters] = useState([]);
  
  const rangeDropdownRef = useRef(null);
  const filterDropdownRef = useRef(null);
  
  const rangeOptions = [7, 30, 60, 90];
  
  // Handle clicks outside of the dropdowns
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (rangeDropdownRef.current && !rangeDropdownRef.current.contains(event.target)) {
        setIsRangeDropdownOpen(false);
      }
      if (filterDropdownRef.current && !filterDropdownRef.current.contains(event.target)) {
        setIsFilterDropdownOpen(false);
      }
    };

    if (isRangeDropdownOpen || isFilterDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isRangeDropdownOpen, isFilterDropdownOpen]);
  
  const handleRangeChange = (value) => {
    setSelectedRange(value);
    setIsRangeDropdownOpen(false);
    if (onRangeChange) {
      onRangeChange(value);
    }
    
    // Trigger dashboard animation when data range changes
    if (onFilterApplied) {
      onFilterApplied();
    }
  };
  
  const toggleRangeDropdown = () => {
    setIsRangeDropdownOpen(!isRangeDropdownOpen);
  };
  
  const toggleFilterDropdown = () => {
    setIsFilterDropdownOpen(!isFilterDropdownOpen);
  };

  // Handler functions for individual filters
  const handleWaiverChange = (value) => {
    setSelectedWaiver(value);
    if (onWaiverChange) {
      onWaiverChange(value);
    }
  };

  const handleApplicationChange = (value) => {
    setSelectedApplication(value);
    if (onApplicationChange) {
      onApplicationChange(value);
    }
  };

  const handleExpirationChange = (value) => {
    setSelectedExpiration(value);
    if (onExpirationChange) {
      onExpirationChange(value);
    }
  };

  const handleApplyFilters = () => {
    setIsFilterDropdownOpen(false);
    
    // Create applied filters array
    const newAppliedFilters = [];
    if (selectedWaiver) {
      newAppliedFilters.push({ type: 'waiver', value: selectedWaiver, label: `Waiver: ${selectedWaiver}` });
    }
    if (selectedApplication) {
      newAppliedFilters.push({ type: 'application', value: selectedApplication, label: `App: ${selectedApplication}` });
    }
    if (selectedExpiration) {
      // Get label for expiration from the options
      const expirationOptions = [
        { id: '7days', label: 'Expiring in 7 days' },
        { id: '30days', label: 'Expiring in 30 days' },
        { id: '90days', label: 'Expiring in 90 days' },
        { id: 'never', label: 'Never expires' }
      ];
      const option = expirationOptions.find(opt => opt.id === selectedExpiration);
      const label = option ? option.label : selectedExpiration;
      newAppliedFilters.push({ type: 'expiration', value: selectedExpiration, label: `Expiration: ${label}` });
    }
    
    setAppliedFilters(newAppliedFilters);
    const hasFilters = newAppliedFilters.length > 0;
    setHasActiveFilters(hasFilters);
    
    // Trigger dashboard animation
    if (onFilterApplied) {
      onFilterApplied();
    }
  };

  // Remove individual filter chip
  const removeFilter = (filterToRemove) => {
    const updatedFilters = appliedFilters.filter(filter => filter.type !== filterToRemove.type);
    setAppliedFilters(updatedFilters);
    
    // Clear the corresponding state
    if (filterToRemove.type === 'waiver') {
      setSelectedWaiver(null);
      if (onWaiverChange) onWaiverChange(null);
    } else if (filterToRemove.type === 'application') {
      setSelectedApplication(null);
      if (onApplicationChange) onApplicationChange(null);
    } else if (filterToRemove.type === 'expiration') {
      setSelectedExpiration(null);
      if (onExpirationChange) onExpirationChange(null);
    }
    
    // Update active state
    setHasActiveFilters(updatedFilters.length > 0);
    
    // Trigger dashboard animation when removing filter
    if (onFilterApplied) {
      onFilterApplied();
    }
  };

  // Update hasActiveFilters when applied filters change
  useEffect(() => {
    setHasActiveFilters(appliedFilters.length > 0);
  }, [appliedFilters]);

  return (
    <div className="filter-section">
      <div className="filters-main-wrapper">
        {/* Applied Filters Chips */}
        {appliedFilters.length > 0 && (
          <div className="applied-filters-chips">
            {appliedFilters.map((filter, index) => (
              <div key={`${filter.type}-${index}`} className="filter-chip">
                <span className="filter-chip-label">{filter.label}</span>
                <button 
                  className="filter-chip-remove"
                  onClick={() => removeFilter(filter)}
                  aria-label={`Remove ${filter.label} filter`}
                >
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path 
                      d="M9 3L3 9M3 3L9 9" 
                      stroke="currentColor" 
                      strokeWidth="1.5" 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Data Range Filter */}
        <div className="data-range-filter">
          <div className="data-range-container">
            <div className="data-range-layout">
              <div className="data-range-label">Data Range:</div>
              <div className="data-range-dropdown-container" ref={rangeDropdownRef}>
                <button onClick={toggleRangeDropdown} className="data-range-dropdown-button">
                  {selectedRange ? `${selectedRange} days` : 'Select'}
                </button>
                {isRangeDropdownOpen && (
                  <div className="data-range-dropdown">
                    {rangeOptions.map((option) => (
                      <div 
                        key={option} 
                        className={`data-range-option ${selectedRange === option ? 'selected' : ''}`}
                        onClick={() => handleRangeChange(option)}
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

        {/* Filter Icon */}
        <div className="filter-icon-container" ref={filterDropdownRef}>
          <button 
            onClick={toggleFilterDropdown} 
            className={`filter-icon-button ${hasActiveFilters ? 'active' : ''}`}
          >
            <svg 
              width="20" 
              height="20" 
              viewBox="0 0 24 24" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                d="M3 4.5H21V6H3V4.5Z" 
                fill={hasActiveFilters ? "#4F46E5" : "#6B7280"}
              />
              <path 
                d="M7 10.5H17V12H7V10.5Z" 
                fill={hasActiveFilters ? "#4F46E5" : "#6B7280"}
              />
              <path 
                d="M10 16.5H14V18H10V16.5Z" 
                fill={hasActiveFilters ? "#4F46E5" : "#6B7280"}
              />
            </svg>
          </button>
          
          {/* Filter Dropdown */}
          {isFilterDropdownOpen && (
            <div className="filter-dropdown">
              <div className="filter-dropdown-header">
                <h4>Additional Filters</h4>
              </div>
              <div className="filter-dropdown-content">
                <div className="filter-dropdown-item">
                  <WaiverFilter 
                    onWaiverChange={handleWaiverChange} 
                    selectedWaiver={selectedWaiver}
                  />
                </div>
                <div className="filter-dropdown-item">
                  <ApplicationFilter 
                    onApplicationChange={handleApplicationChange}
                    selectedApplication={selectedApplication}
                  />
                </div>
                <div className="filter-dropdown-item">
                  <ExpirationFilter 
                    onExpirationChange={handleExpirationChange}
                    selectedExpiration={selectedExpiration}
                  />
                </div>
              </div>
              <div className="filter-dropdown-footer">
                <button 
                  className="apply-filters-button"
                  onClick={handleApplyFilters}
                >
                  Apply
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FilterSection;