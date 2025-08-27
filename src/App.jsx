import { useState } from 'react'
import { useWidgetManagement } from './hooks/useWidgetManagement'
import { useMouseInteractions } from './hooks/useMouseInteractions'
import Sidebar from './components/Sidebar'
import Widget from './components/Widget'
import DataRangeFilter from './components/DataRangeFilter'
import WaiverFilter from './components/WaiverFilter'
import ExpirationFilter from './components/ExpirationFilter'
import './App.css'

function App() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [selectedDataRange, setSelectedDataRange] = useState(null)
  const [selectedWaiver, setSelectedWaiver] = useState(null)
  const [selectedExpiration, setSelectedExpiration] = useState(null)
  
  // Use custom hooks for widget management and interactions
  const widgetManagement = useWidgetManagement()
  const mouseInteractions = useMouseInteractions(widgetManagement)
  
  const { rectangles, setRectangles, canvasRef, getCanvasBounds, addNewRectangle, addNewChart, addNewFunnel, addNewMetric } = widgetManagement
  const { handleMouseDown, handleResizeStart, handleMouseMove, handleMouseUp } = mouseInteractions

  // Delete widget handler
  const handleDeleteWidget = (id) => {
    setRectangles(prev => prev.filter(rect => rect.id !== id));
  };

  // Widget actions for sidebar
  const widgetActions = {
    addNewRectangle,
    addNewChart,
    addNewFunnel,
    addNewMetric
  }

  return (
    <div className={`app-container ${sidebarCollapsed ? 'sidebar-collapsed' : 'sidebar-expanded'}`}>
      <Sidebar 
        sidebarCollapsed={sidebarCollapsed}
        setSidebarCollapsed={setSidebarCollapsed}
        widgetActions={widgetActions}
      />
      
      <div className="right-title-area">
        <div className="right-title-section">
          <h3 className="right-title">Waiver Explorer</h3>
        </div>
      </div>
      
      <div className="filter-container">
        <div className="filters-wrapper">
          <DataRangeFilter onRangeChange={setSelectedDataRange} />
          <WaiverFilter onWaiverChange={setSelectedWaiver} />
          <ExpirationFilter onExpirationChange={setSelectedExpiration} />
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
        </div>
      </div>
      
      <div className="hackathon-credit">
        Built with ❤️ for Hackathon by SonaType India
      </div>
    </div>
  )
}

export default App