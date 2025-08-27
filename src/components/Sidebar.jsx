import { useState } from 'react'

const Sidebar = ({ sidebarCollapsed, setSidebarCollapsed, widgetActions }) => {
  const [searchTerm, setSearchTerm] = useState('')
  const { addNewRectangle, addNewChart, addNewFunnel, addNewMetric } = widgetActions

  const widgetOptions = [
    {
      id: 'basic',
      title: 'Basic Widget',
      subtitle: '1×1 Size',
      keywords: ['basic', 'widget', 'simple', '1x1'],
      action: addNewRectangle,
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2"/>
          <path d="M12 8v8M8 12h8" stroke="currentColor" strokeWidth="2"/>
        </svg>
      ),
      iconClass: ''
    },
    {
      id: 'metric',
      title: 'Metric Widget',
      subtitle: 'KPI Display',
      keywords: ['metric', 'kpi', 'display', 'number', 'analytics'],
      action: () => addNewMetric('1x1'),
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M3 12l2-2 4 4 6-6 6 2v6H3v-4z" fill="currentColor" opacity="0.2"/>
          <path d="M3 12l2-2 4 4 6-6 6 2" stroke="currentColor" strokeWidth="2" fill="none"/>
        </svg>
      ),
      iconClass: 'metric-icon'
    },
    {
      id: 'chart',
      title: 'Bar Chart',
      subtitle: '3×3 Size',
      keywords: ['chart', 'bar', 'graph', 'data', 'visualization', '3x3'],
      action: addNewChart,
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2"/>
          <rect x="7" y="13" width="2" height="5" fill="currentColor"/>
          <rect x="11" y="9" width="2" height="9" fill="currentColor"/>
          <rect x="15" y="6" width="2" height="12" fill="currentColor"/>
        </svg>
      ),
      iconClass: 'chart-icon'
    },
    {
      id: 'funnel',
      title: 'Expiring Waivers',
      subtitle: '2×2 Funnel',
      keywords: ['funnel', 'waiver', 'expiring', '2x2', 'flow', 'conversion'],
      action: addNewFunnel,
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M6 3h12l-2 4H8l-2-4zM8 7h8l-1.5 3H9.5L8 7zM9.5 10h5l-1 2h-3l-1-2zM10.5 12h3l-0.5 1h-2l-0.5-1z" fill="currentColor"/>
        </svg>
      ),
      iconClass: 'funnel-icon'
    }
  ]

  const filteredWidgets = widgetOptions.filter(widget =>
    widget.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    widget.subtitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
    widget.keywords.some(keyword => keyword.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  return (
    <div className={`sidebar ${sidebarCollapsed ? 'collapsed' : ''}`} onClick={sidebarCollapsed ? () => setSidebarCollapsed(false) : undefined}>
      <div className="sidebar-header">
        {!sidebarCollapsed && (
          <div className="sidebar-title-section">
            <h3 className="sidebar-title">Waiver Explorer</h3>
            <p className="sidebar-subtitle">Flexi Reports</p>
          </div>
        )}
        {sidebarCollapsed ? (
          <button className="sidebar-icon-button">
            ☰
          </button>
        ) : (
          <button 
            className="collapse-btn"
            onClick={() => setSidebarCollapsed(true)}
          >
            ←
          </button>
        )}
      </div>
      
      {!sidebarCollapsed && (
        <div className="sidebar-content">
          <div className="search-container">
            <input 
              type="text" 
              placeholder="Search widgets..." 
              className="search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="sidebar-section">
            <h4>Add Widget</h4>
            <div className="widget-cards-grid">
              {filteredWidgets.map(widget => (
                <div key={widget.id} className="widget-card" onClick={widget.action}>
                  <div className={`widget-card-icon ${widget.iconClass}`}>
                    {widget.icon}
                  </div>
                  <div className="widget-card-info">
                    <h5>{widget.title}</h5>
                    <span>{widget.subtitle}</span>
                  </div>
                </div>
              ))}
            </div>
            {filteredWidgets.length === 0 && searchTerm && (
              <div className="no-results">
                <p>No widgets found for "{searchTerm}"</p>
                <span>Try searching for: basic, metric, chart, funnel, or waiver</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default Sidebar