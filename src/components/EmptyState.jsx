import React from 'react'

const EmptyState = ({ onOpenSidebar, onStartFromTemplate }) => {
  const handleGetStartedClick = (e) => {
    e.stopPropagation()
    onOpenSidebar()
  }

  const handleTemplateClick = (e) => {
    e.stopPropagation()
    onStartFromTemplate()
  }

  return (
    <div className="empty-state">
      <div className="empty-state-content">
        <div className="empty-state-icon">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
            <path d="M9 9h6v6H9z"/>
            <path d="M9 3v6M15 3v6M21 9H15M21 15H15M3 9h6M3 15h6M9 21v-6M15 21v-6"/>
          </svg>
        </div>
        <h3 className="empty-state-title">Start Building Your Dashboard</h3>
        <p className="empty-state-description">
          Choose how you'd like to begin creating your dashboard
        </p>
        <div className="empty-state-actions">
          <button className="empty-state-btn primary" onClick={handleGetStartedClick}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 5v14M5 12h14"/>
            </svg>
            Get Started
          </button>
          <button className="empty-state-btn secondary" onClick={handleTemplateClick}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
              <path d="M9 9h6v6H9z"/>
              <path d="M9 3v6M15 3v6M21 9H15M21 15H15M3 9h6M3 15h6M9 21v-6M15 21v-6"/>
            </svg>
            Start from Template
          </button>
        </div>
      </div>
    </div>
  )
}

export default EmptyState