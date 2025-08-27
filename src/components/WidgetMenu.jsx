import { useState, useRef, useEffect } from 'react';

const WidgetMenu = ({ rect, onDelete, onExpand }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);
  
  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);

  const toggleMenu = (e) => {
    e.stopPropagation(); // Prevent widget drag when clicking menu
    setIsMenuOpen(!isMenuOpen);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    setIsMenuOpen(false);
    onDelete(rect.id);
  };

  const handleExpand = (e) => {
    e.stopPropagation();
    setIsMenuOpen(false);
    onExpand(rect);
  };

  return (
    <div className={`widget-menu ${isMenuOpen ? 'menu-active' : ''}`} ref={menuRef}>
      <button className="widget-menu-button" onClick={toggleMenu} title="Widget options">
        <div className="three-dots">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </button>
      
      {isMenuOpen && (
        <div className="widget-menu-dropdown">
          <div className="widget-menu-item" onClick={handleExpand}>
            <svg className="menu-icon expand-icon" viewBox="0 0 24 24" width="16" height="16">
              <path fill="currentColor" d="M21 11V3h-8v2h4.586L11 11.586 12.414 13 19 6.414V11h2zm-6 10H3V9h2v10h10v2z" />
            </svg>
            <span>Expand</span>
          </div>
          <div className="widget-menu-item delete" onClick={handleDelete}>
            <svg className="menu-icon delete-icon" viewBox="0 0 24 24" width="16" height="16">
              <path fill="currentColor" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            <span>Delete</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default WidgetMenu;
