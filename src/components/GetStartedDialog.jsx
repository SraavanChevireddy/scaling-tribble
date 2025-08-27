import { useEffect } from 'react'

const GetStartedDialog = ({ isOpen, onClose }) => {
  // Handle escape key
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div className="get-started-backdrop" onClick={onClose}>
      <div className="get-started-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="get-started-header">
          <div className="get-started-icon">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
              <path d="M3 3h18v18H3V3z" fill="none" stroke="currentColor" strokeWidth="2"/>
              <path d="M9 9h6v6H9V9z" fill="currentColor" opacity="0.2"/>
              <path d="M7 7h2v2H7V7z" fill="currentColor"/>
              <path d="M15 7h2v2h-2V7z" fill="currentColor"/>
              <path d="M7 15h2v2H7v-2z" fill="currentColor"/>
              <path d="M15 15h2v2h-2v-2z" fill="currentColor"/>
            </svg>
          </div>
          <h2 className="get-started-title">Welcome to FlexiReport</h2>
          <p className="get-started-subtitle">Your Ultimate Dashboard Builder</p>
        </div>

        <div className="get-started-content">
          <div className="get-started-description">
            <p>
              <strong>Build customisable, drag-and-drop reports</strong> with full flexibility in layout, size, and duration. 
              Create professional dashboards that adapt to your needs.
            </p>
          </div>

          <div className="get-started-features">
            <div className="feature-item">
              <div className="feature-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div className="feature-text">
                <h4>Drag & Drop Interface</h4>
                <p>Intuitive widget placement with collision detection</p>
              </div>
            </div>

            <div className="feature-item">
              <div className="feature-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" stroke="currentColor" strokeWidth="2"/>
                  <polyline points="7.5,4.21 12,6.81 16.5,4.21" stroke="currentColor" strokeWidth="2"/>
                  <polyline points="7.5,19.79 7.5,14.6 3,12" stroke="currentColor" strokeWidth="2"/>
                  <polyline points="21,12 16.5,14.6 16.5,19.79" stroke="currentColor" strokeWidth="2"/>
                </svg>
              </div>
              <div className="feature-text">
                <h4>Flexible Layouts</h4>
                <p>Resize widgets to any size that fits your data</p>
              </div>
            </div>

            <div className="feature-item">
              <div className="feature-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/>
                  <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1 1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" stroke="currentColor" strokeWidth="2"/>
                </svg>
              </div>
              <div className="feature-text">
                <h4>Real-time Data</h4>
                <p>Connect to live APIs for dynamic reporting</p>
              </div>
            </div>
          </div>

          <div className="get-started-actions">
            <button className="get-started-btn" onClick={onClose}>
              <span>Get Started</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <p className="get-started-tip">
              💡 <strong>Tip:</strong> Start by creating your first widget from the sidebar
            </p>
          </div>
        </div>

        <button className="get-started-close" onClick={onClose} aria-label="Close dialog">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </button>
      </div>
    </div>
  )
}

export default GetStartedDialog