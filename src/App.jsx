import { useState } from 'react'
import { useWidgetManagement } from './hooks/useWidgetManagement'
import { useMouseInteractions } from './hooks/useMouseInteractions'
import Sidebar from './components/Sidebar'
import Widget from './components/Widget'
import './App.css'
import './styles/api-widgets.css'

function App() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  
  // Use custom hooks for widget management and interactions
  const widgetManagement = useWidgetManagement()
  const mouseInteractions = useMouseInteractions(widgetManagement)
  
  const { 
    rectangles, 
    canvasRef, 
    getCanvasBounds, 
    addNewRectangle, 
    addNewChart, 
    addNewFunnel, 
    addNewMetric,
    addNewApiMetric,
    addNewApiChart,
    addNewApiFunnel
  } = widgetManagement
  const { handleMouseDown, handleResizeStart, handleMouseMove, handleMouseUp } = mouseInteractions

  // Widget actions for sidebar
  const widgetActions = {
    addNewRectangle,
    addNewChart,
    addNewFunnel,
    addNewMetric,
    addNewApiMetric,
    addNewApiChart,
    addNewApiFunnel
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