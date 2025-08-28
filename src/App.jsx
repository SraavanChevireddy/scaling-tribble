import { useState, useEffect } from 'react'
import { useWidgetManagement } from './hooks/useWidgetManagement'
import { useMouseInteractions } from './hooks/useMouseInteractions'
import { WIDGET_SIZES, SAMPLE_CHART_DATA, SAMPLE_FUNNEL_DATA } from './constants/widgetConstants'
import Sidebar from './components/Sidebar'
import Widget from './components/Widget'
import DataRangeFilter from './components/DataRangeFilter'
import WaiverFilter from './components/WaiverFilter'
import ApplicationFilter from './components/ApplicationFilter'
import ExpirationFilter from './components/ExpirationFilter'
import GetStartedDialog from './components/GetStartedDialog'
import EmptyState from './components/EmptyState'
import EditableDashboardName from './components/EditableDashboardName'
import './App.css'
import './styles/api-widgets.css'

function App() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true)
  const [showGetStarted, setShowGetStarted] = useState(false)
  const [selectedDataRange, setSelectedDataRange] = useState(null)
  const [selectedWaiver, setSelectedWaiver] = useState(null)
  const [selectedApplication, setSelectedApplication] = useState(null)
  const [selectedExpiration, setSelectedExpiration] = useState(null)
  
  // Check if Get Started dialog should be shown
  useEffect(() => {
    const hasSeenGetStarted = sessionStorage.getItem('flexiReport_hasSeenGetStarted')
    if (!hasSeenGetStarted) {
      setShowGetStarted(true)
    }
  }, [])

  // Handle Get Started dialog close
  const handleGetStartedClose = () => {
    setShowGetStarted(false)
    sessionStorage.setItem('flexiReport_hasSeenGetStarted', 'true')
  }

  // Use custom hooks for widget management and interactions
  const widgetManagement = useWidgetManagement()
  const mouseInteractions = useMouseInteractions(widgetManagement)
  
  const { 
    rectangles, 
    setRectangles,
    canvasRef, 
    getCanvasBounds, 
    addNewRectangle, 
    addNewChart, 
    addNewFunnel, 
    addNewMetric,
    addNewApiMetric,
    addNewApiChart,
    addNewApiFunnel,
    addNewApiTrends
  } = widgetManagement
  const { handleMouseDown, handleResizeStart, handleMouseMove, handleMouseUp } = mouseInteractions

  // Delete widget handler
  const handleDeleteWidget = (id) => {
    setRectangles(prev => prev.filter(rect => rect.id !== id));
  };

  // Handle opening sidebar from empty state
  const handleOpenSidebar = () => {
    setSidebarCollapsed(false);
  };

  // Handle starting from template - adds 7 days trend widget
  const handleStartFromTemplate = () => {
    const size = WIDGET_SIZES['1x1']
    
    const widget = {
      id: 1,
      x: 50,
      y: 120, // Start below the title area
      width: size.width,
      height: size.height,
      gridCols: size.cols,
      gridRows: size.rows,
      color: '#ffffff',
      isDragging: false,
      isResizing: false,
      size: '1x1',
      type: 'api-trends',
      trendType: 'expiring7Days',
      isApiPowered: true,
      isNew: true
    }

    // Add the widget
    setRectangles([widget])

    // Remove the "new" flag after animation completes
    setTimeout(() => {
      setRectangles(prev => prev.map(w => ({ ...w, isNew: false })))
    }, 500)
  };

  // Widget actions for sidebar
  const widgetActions = {
    addNewRectangle,
    addNewChart,
    addNewFunnel,
    addNewMetric,
    addNewApiMetric,
    addNewApiChart,
    addNewApiFunnel,
    addNewApiTrends
  }

  return (
    <div className={`app-container ${sidebarCollapsed ? 'sidebar-collapsed' : 'sidebar-expanded'}`}>
      <Sidebar 
        sidebarCollapsed={sidebarCollapsed}
        setSidebarCollapsed={setSidebarCollapsed}
        widgetActions={widgetActions}
      />
      
      <div className="right-title-area">
        <div className="dashboard-name-section">
          <EditableDashboardName />
        </div>
        <div className="right-title-section">
          <h3 className="right-title">Waiver Explorer</h3>
        </div>
        <div className="filter-container">
          <div className="filters-wrapper">
            <DataRangeFilter onRangeChange={setSelectedDataRange} />
            <WaiverFilter onWaiverChange={setSelectedWaiver} />
            <ApplicationFilter onApplicationChange={setSelectedApplication} />
            <ExpirationFilter onExpirationChange={setSelectedExpiration} />
          </div>
        </div>
      </div>
      
      <div 
        ref={canvasRef}
        className="canvas"
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <div 
          className="canvas-content"
          style={{
            minHeight: `${getCanvasBounds().height}px`,
            position: 'relative'
          }}
        >
          {rectangles.map(rect => (
            <Widget
              key={rect.id}
              rect={rect}
              handleMouseDown={handleMouseDown}
              handleResizeStart={handleResizeStart}
              onDeleteWidget={handleDeleteWidget}
            />
          ))}
          
          {rectangles.length === 0 && (
            <EmptyState onOpenSidebar={handleOpenSidebar} onStartFromTemplate={handleStartFromTemplate} />
          )}
        </div>
      </div>
      
      <div className="hackathon-credit">
        Built with ❤️ for Hackathon by SonaType India
      </div>

      <GetStartedDialog 
        isOpen={showGetStarted} 
        onClose={handleGetStartedClose} 
      />
    </div>
  )
}

export default App