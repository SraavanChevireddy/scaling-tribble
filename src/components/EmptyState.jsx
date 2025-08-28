import React from 'react'

const EmptyState = ({ onOpenSidebar }) => {
  return (
    <div className="empty-state" onClick={onOpenSidebar}>
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
          Tap here to open the widget library and add your first widget
        </p>
        <div className="empty-state-hint">
          <span>Click to get started</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 18l6-6-6-6"/>
          </svg>
        </div>
      </div>
    </div>
  )
}

export default EmptyState