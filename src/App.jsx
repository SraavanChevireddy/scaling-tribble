import { useState, useRef, useCallback } from 'react'
import { ResponsiveBar } from '@nivo/bar'
import { ResponsiveFunnel } from '@nivo/funnel'
import './App.css'

const GRID_SIZE = 150
const WIDGET_SIZES = {
  '1x1': { cols: 1, rows: 1, width: GRID_SIZE, height: GRID_SIZE },
  '2x1': { cols: 2, rows: 1, width: GRID_SIZE * 2, height: GRID_SIZE },
  '2x2': { cols: 2, rows: 2, width: GRID_SIZE * 2, height: GRID_SIZE * 2 },
  '3x1': { cols: 3, rows: 1, width: GRID_SIZE * 3, height: GRID_SIZE },
  '1x2': { cols: 1, rows: 2, width: GRID_SIZE, height: GRID_SIZE * 2 },
  '3x3': { cols: 3, rows: 3, width: GRID_SIZE * 3, height: GRID_SIZE * 3 }
}

const SAMPLE_CHART_DATA = [
  { month: 'Jan', sales: 120, expenses: 80 },
  { month: 'Feb', sales: 190, expenses: 130 },
  { month: 'Mar', sales: 300, expenses: 200 },
  { month: 'Apr', sales: 280, expenses: 180 },
  { month: 'May', sales: 420, expenses: 280 },
  { month: 'Jun', sales: 380, expenses: 220 }
]

const SAMPLE_FUNNEL_DATA = [
  { id: 'step_1', value: 1000, label: 'Website Visitors' },
  { id: 'step_2', value: 800, label: 'Product Views' },
  { id: 'step_3', value: 600, label: 'Add to Cart' },
  { id: 'step_4', value: 400, label: 'Checkout' },
  { id: 'step_5', value: 200, label: 'Purchase' }
]

const SAMPLE_METRICS = [
  { title: 'This Month', subtitle: '1 Jul - 30 Jul', value: '99', color: '#ef4444' },
  { title: 'Total Users', subtitle: 'Active this week', value: '1.2K', color: '#3b82f6' },
  { title: 'Revenue', subtitle: 'Current month', value: '$45K', color: '#10b981' },
  { title: 'Conversion', subtitle: 'Last 30 days', value: '3.2%', color: '#f59e0b' },
  { title: 'Sessions', subtitle: 'Today', value: '847', color: '#8b5cf6' }
]

function App() {
  const [rectangles, setRectangles] = useState([])
  const [dragState, setDragState] = useState({ id: null, offsetX: 0, offsetY: 0 })
  const [resizeState, setResizeState] = useState({ id: null, handle: null, startX: 0, startY: 0, startWidth: 0, startHeight: 0 })
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const canvasRef = useRef(null)

  const checkCollision = useCallback((rect1, rect2) => {
    return !(rect1.x + rect1.width <= rect2.x || 
             rect2.x + rect2.width <= rect1.x || 
             rect1.y + rect1.height <= rect2.y || 
             rect2.y + rect2.height <= rect1.y)
  }, [])

  const getCanvasBounds = useCallback(() => {
    const sidebarWidth = sidebarCollapsed ? 80 : 290
    const canvasWidth = window.innerWidth - sidebarWidth
    
    // Calculate required height based on widgets
    const maxY = rectangles.reduce((max, rect) => {
      return Math.max(max, rect.y + rect.height + 50) // 50px padding at bottom
    }, window.innerHeight)
    
    return {
      width: canvasWidth,
      height: Math.max(window.innerHeight - 20, maxY)
    }
  }, [sidebarCollapsed, rectangles])

  const findValidPosition = useCallback((movingRect, newX, newY, otherRects) => {
    const canvas = getCanvasBounds()
    const padding = 10
    const widgetPadding = 10
    
    let validX = Math.max(padding, Math.min(newX, canvas.width - movingRect.width - padding))
    let validY = Math.max(padding, Math.min(newY, canvas.height - movingRect.height - padding))
    
    const testRect = { ...movingRect, x: validX, y: validY }

    for (const other of otherRects) {
      // Create expanded collision boxes that include widget padding
      const expandedOther = {
        x: other.x - widgetPadding,
        y: other.y - widgetPadding,
        width: other.width + widgetPadding * 2,
        height: other.height + widgetPadding * 2
      }
      
      if (checkCollision(testRect, expandedOther)) {
        const overlapX = Math.min(testRect.x + testRect.width - expandedOther.x, expandedOther.x + expandedOther.width - testRect.x)
        const overlapY = Math.min(testRect.y + testRect.height - expandedOther.y, expandedOther.y + expandedOther.height - testRect.y)
        
        if (overlapX < overlapY) {
          const moveLeft = testRect.x > other.x
          validX = moveLeft ? 
            other.x + other.width + widgetPadding : 
            other.x - testRect.width - widgetPadding
          validX = Math.max(padding, Math.min(validX, canvas.width - testRect.width - padding))
        } else {
          const moveUp = testRect.y > other.y
          validY = moveUp ? 
            other.y + other.height + widgetPadding : 
            other.y - testRect.height - widgetPadding
          validY = Math.max(padding, Math.min(validY, canvas.height - testRect.height - padding))
        }
        
        testRect.x = validX
        testRect.y = validY
      }
    }

    return { x: validX, y: validY }
  }, [checkCollision, getCanvasBounds])

  const getClosestSize = useCallback((width, height) => {
    const sizeKeys = Object.keys(WIDGET_SIZES)
    let closestSize = '1x1'
    let minDistance = Infinity

    sizeKeys.forEach(sizeKey => {
      const size = WIDGET_SIZES[sizeKey]
      const distance = Math.abs(width - size.width) + Math.abs(height - size.height)
      if (distance < minDistance) {
        minDistance = distance
        closestSize = sizeKey
      }
    })

    return closestSize
  }, [])

  const generateRandomColor = useCallback(() => {
    const colors = [
      '#3b82f6', // blue
      '#f97316', // orange  
      '#ef4444', // red
      '#10b981', // green
      '#8b5cf6', // purple
      '#f59e0b', // amber
      '#06b6d4', // cyan
      '#ec4899', // pink
      '#84cc16', // lime
      '#6366f1', // indigo
    ]
    return colors[Math.floor(Math.random() * colors.length)]
  }, [])

  const findNextGridPosition = useCallback((widgetCols, widgetRows, existingRects) => {
    const sidebarWidth = sidebarCollapsed ? 80 : 290
    const canvasWidth = window.innerWidth - sidebarWidth
    const padding = 10
    const widgetPadding = 10 // Padding between widgets
    
    // Calculate grid dimensions (including padding between widgets)
    const gridCols = Math.floor((canvasWidth - padding * 2) / (GRID_SIZE + widgetPadding))
    const maxGridRows = 50
    
    // Create a grid occupancy map
    const occupiedSlots = new Set()
    
    // Mark occupied slots based on existing widgets
    existingRects.forEach(rect => {
      const startCol = Math.round((rect.x - padding) / (GRID_SIZE + widgetPadding))
      const startRow = Math.round((rect.y - padding) / (GRID_SIZE + widgetPadding))
      const rectCols = rect.gridCols || 1
      const rectRows = rect.gridRows || 1
      
      for (let row = startRow; row < startRow + rectRows; row++) {
        for (let col = startCol; col < startCol + rectCols; col++) {
          if (row >= 0 && col >= 0) {
            occupiedSlots.add(`${row}-${col}`)
          }
        }
      }
    })
    
    // Find the next available position (fill horizontally first)
    for (let row = 0; row < maxGridRows; row++) {
      for (let col = 0; col <= gridCols - widgetCols; col++) {
        let canFit = true
        
        // Check if this position can fit the widget
        for (let checkRow = row; checkRow < row + widgetRows && canFit; checkRow++) {
          for (let checkCol = col; checkCol < col + widgetCols && canFit; checkCol++) {
            if (occupiedSlots.has(`${checkRow}-${checkCol}`)) {
              canFit = false
            }
          }
        }
        
        if (canFit) {
          return {
            x: padding + col * (GRID_SIZE + widgetPadding),
            y: padding + row * (GRID_SIZE + widgetPadding)
          }
        }
      }
    }
    
    // Fallback to top-left if no space found
    return { x: padding, y: padding }
  }, [sidebarCollapsed])

  const addNewRectangle = useCallback(() => {
    const newId = Math.max(...rectangles.map(r => r.id), 0) + 1
    const color = generateRandomColor()
    const size = WIDGET_SIZES['1x1']
    const position = findNextGridPosition(size.cols, size.rows, rectangles)
    
    const newRect = {
      id: newId,
      x: position.x,
      y: position.y,
      width: size.width,
      height: size.height,
      gridCols: size.cols,
      gridRows: size.rows,
      color: color,
      isDragging: false,
      isResizing: false,
      size: '1x1',
      type: 'widget',
      isNew: true
    }
    
    setRectangles(prev => [...prev, newRect])
    
    // Remove the "new" flag after animation completes
    setTimeout(() => {
      setRectangles(prev => prev.map(r => 
        r.id === newId ? { ...r, isNew: false } : r
      ))
    }, 500)
    
    // Smooth scroll to new widget after a brief delay
    setTimeout(() => {
      if (canvasRef.current) {
        const targetY = position.y - 100 // 100px above the widget
        canvasRef.current.scrollTo({
          top: Math.max(0, targetY),
          behavior: 'smooth'
        })
      }
    }, 100)
  }, [rectangles, generateRandomColor, findNextGridPosition])

  const addNewChart = useCallback(() => {
    const newId = Math.max(...rectangles.map(r => r.id), 0) + 1
    const size = WIDGET_SIZES['3x3']
    const position = findNextGridPosition(size.cols, size.rows, rectangles)
    
    const newChart = {
      id: newId,
      x: position.x,
      y: position.y,
      width: size.width,
      height: size.height,
      gridCols: size.cols,
      gridRows: size.rows,
      color: '#ffffff',
      isDragging: false,
      isResizing: false,
      size: '3x3',
      type: 'chart',
      chartData: SAMPLE_CHART_DATA,
      isNew: true
    }
    
    setRectangles(prev => [...prev, newChart])
    
    // Remove the "new" flag after animation completes
    setTimeout(() => {
      setRectangles(prev => prev.map(r => 
        r.id === newId ? { ...r, isNew: false } : r
      ))
    }, 500)
    
    // Smooth scroll to new chart after a brief delay
    setTimeout(() => {
      if (canvasRef.current) {
        const targetY = position.y - 100 // 100px above the chart
        canvasRef.current.scrollTo({
          top: Math.max(0, targetY),
          behavior: 'smooth'
        })
      }
    }, 100)
  }, [rectangles, findNextGridPosition])

  const addNewFunnel = useCallback(() => {
    const newId = Math.max(...rectangles.map(r => r.id), 0) + 1
    const size = WIDGET_SIZES['2x2']
    const position = findNextGridPosition(size.cols, size.rows, rectangles)
    
    const newFunnel = {
      id: newId,
      x: position.x,
      y: position.y,
      width: size.width,
      height: size.height,
      gridCols: size.cols,
      gridRows: size.rows,
      color: '#ffffff',
      isDragging: false,
      isResizing: false,
      size: '2x2',
      type: 'funnel',
      funnelData: SAMPLE_FUNNEL_DATA,
      isNew: true
    }
    
    setRectangles(prev => [...prev, newFunnel])
    
    // Remove the "new" flag after animation completes
    setTimeout(() => {
      setRectangles(prev => prev.map(r => 
        r.id === newId ? { ...r, isNew: false } : r
      ))
    }, 500)
    
    // Smooth scroll to new funnel after a brief delay
    setTimeout(() => {
      if (canvasRef.current) {
        const targetY = position.y - 100 // 100px above the funnel
        canvasRef.current.scrollTo({
          top: Math.max(0, targetY),
          behavior: 'smooth'
        })
      }
    }, 100)
  }, [rectangles, findNextGridPosition])

  const addNewMetric = useCallback((metricSize = '1x1') => {
    const newId = Math.max(...rectangles.map(r => r.id), 0) + 1
    const size = WIDGET_SIZES[metricSize]
    const position = findNextGridPosition(size.cols, size.rows, rectangles)
    const randomMetric = SAMPLE_METRICS[Math.floor(Math.random() * SAMPLE_METRICS.length)]
    
    const newMetric = {
      id: newId,
      x: position.x,
      y: position.y,
      width: size.width,
      height: size.height,
      gridCols: size.cols,
      gridRows: size.rows,
      color: '#ffffff',
      isDragging: false,
      isResizing: false,
      size: metricSize,
      type: 'metric',
      metricData: randomMetric,
      isNew: true
    }
    
    setRectangles(prev => [...prev, newMetric])
    
    // Remove the "new" flag after animation completes
    setTimeout(() => {
      setRectangles(prev => prev.map(r => 
        r.id === newId ? { ...r, isNew: false } : r
      ))
    }, 500)
    
    // Smooth scroll to new metric after a brief delay
    setTimeout(() => {
      if (canvasRef.current) {
        const targetY = position.y - 100 // 100px above the metric
        canvasRef.current.scrollTo({
          top: Math.max(0, targetY),
          behavior: 'smooth'
        })
      }
    }, 100)
  }, [rectangles, findNextGridPosition])

  const handleResizeStart = useCallback((e, rectId) => {
    e.preventDefault()
    e.stopPropagation()
    
    const rect = rectangles.find(r => r.id === rectId)
    if (!rect || rect.type === 'chart' || rect.type === 'funnel') return

    setResizeState({
      id: rectId,
      startX: e.clientX,
      startY: e.clientY,
      startWidth: rect.width,
      startHeight: rect.height
    })

    setRectangles(prev => prev.map(r => 
      r.id === rectId ? { ...r, isResizing: true } : r
    ))
  }, [rectangles])

  const handleMouseDown = useCallback((e, rectId) => {
    e.preventDefault()
    const rect = rectangles.find(r => r.id === rectId)
    if (!rect) return

    setDragState({
      id: rectId,
      offsetX: e.clientX - rect.x,
      offsetY: e.clientY - rect.y
    })

    setRectangles(prev => prev.map(r => 
      r.id === rectId ? { ...r, isDragging: true } : r
    ))
  }, [rectangles])

  const handleMouseMove = useCallback((e) => {
    if (dragState.id && !resizeState.id) {
      const movingRect = rectangles.find(r => r.id === dragState.id)
      if (!movingRect) return

      const newX = e.clientX - dragState.offsetX
      const newY = e.clientY - dragState.offsetY
      const otherRects = rectangles.filter(r => r.id !== dragState.id)
      
      const validPosition = findValidPosition(movingRect, newX, newY, otherRects)

      setRectangles(prev => prev.map(r => 
        r.id === dragState.id ? { ...r, x: validPosition.x, y: validPosition.y } : r
      ))
    }

    if (resizeState.id) {
      const resizingRect = rectangles.find(r => r.id === resizeState.id)
      if (!resizingRect || resizingRect.type === 'chart' || resizingRect.type === 'funnel') return

      const deltaX = e.clientX - resizeState.startX
      const deltaY = e.clientY - resizeState.startY
      
      let newWidth = Math.max(GRID_SIZE, resizeState.startWidth + deltaX)
      let newHeight = Math.max(GRID_SIZE, resizeState.startHeight + deltaY)

      // Calculate maximum safe dimensions
      const canvas = getCanvasBounds()
      const padding = 10
      let maxSafeWidth = canvas.width - resizingRect.x - padding
      let maxSafeHeight = canvas.height - resizingRect.y - padding

      // Find blocking obstacles in each direction
      const otherRects = rectangles.filter(r => r.id !== resizeState.id)
      
      for (const other of otherRects) {
        // Check if this widget blocks rightward expansion
        if (other.x > resizingRect.x) {
          // Check for vertical overlap with the current widget
          const currentBottom = resizingRect.y + resizingRect.height
          const currentTop = resizingRect.y
          const otherBottom = other.y + other.height
          const otherTop = other.y
          
          const verticalOverlap = !(currentBottom <= otherTop || currentTop >= otherBottom)
          
          if (verticalOverlap) {
            maxSafeWidth = Math.min(maxSafeWidth, other.x - resizingRect.x)
          }
        }
        
        // Check if this widget blocks downward expansion
        if (other.y > resizingRect.y) {
          // Check for horizontal overlap with the current widget
          const currentRight = resizingRect.x + resizingRect.width
          const currentLeft = resizingRect.x
          const otherRight = other.x + other.width
          const otherLeft = other.x
          
          const horizontalOverlap = !(currentRight <= otherLeft || currentLeft >= otherRight)
          
          if (horizontalOverlap) {
            maxSafeHeight = Math.min(maxSafeHeight, other.y - resizingRect.y)
          }
        }
      }

      // Apply constraints
      newWidth = Math.min(newWidth, maxSafeWidth)
      newHeight = Math.min(newHeight, maxSafeHeight)
      
      // Ensure minimum size
      newWidth = Math.max(GRID_SIZE, newWidth)
      newHeight = Math.max(GRID_SIZE, newHeight)

      setRectangles(prev => prev.map(r => 
        r.id === resizeState.id ? { 
          ...r, 
          width: newWidth,
          height: newHeight
        } : r
      ))
    }
  }, [dragState, resizeState, rectangles, findValidPosition, getCanvasBounds])

  const handleMouseUp = useCallback(() => {
    if (resizeState.id) {
      const rect = rectangles.find(r => r.id === resizeState.id)
      if (rect && rect.type !== 'chart' && rect.type !== 'funnel') {
        // Find the best fitting grid size for current dimensions
        let closestSize = getClosestSize(rect.width, rect.height)
        
        // For metric widgets, restrict to only 1x1 and 2x1
        if (rect.type === 'metric') {
          const validMetricSizes = ['1x1', '2x1']
          const currentSize = closestSize
          if (!validMetricSizes.includes(currentSize)) {
            // If current size is not valid for metrics, pick the closest valid one
            const distance1x1 = Math.abs(rect.width - WIDGET_SIZES['1x1'].width) + Math.abs(rect.height - WIDGET_SIZES['1x1'].height)
            const distance2x1 = Math.abs(rect.width - WIDGET_SIZES['2x1'].width) + Math.abs(rect.height - WIDGET_SIZES['2x1'].height)
            closestSize = distance1x1 < distance2x1 ? '1x1' : '2x1'
          }
        }
        
        const finalDimensions = WIDGET_SIZES[closestSize]
        
        // Since drag logic prevents collisions, just snap to closest size
        setRectangles(prev => prev.map(r => 
          r.id === resizeState.id ? { 
            ...r, 
            width: finalDimensions.width,
            height: finalDimensions.height,
            size: closestSize,
            gridCols: finalDimensions.cols,
            gridRows: finalDimensions.rows,
            isResizing: false
          } : r
        ))
      }
    }

    setDragState({ id: null, offsetX: 0, offsetY: 0 })
    setResizeState({ id: null, startX: 0, startY: 0, startWidth: 0, startHeight: 0 })
    setRectangles(prev => prev.map(r => ({ ...r, isDragging: false, isResizing: false })))
  }, [resizeState, rectangles, getClosestSize])

  return (
    <div className="app-container">
      <div className={`sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
        <div className="sidebar-header">
          {!sidebarCollapsed && <h3 className="sidebar-title">Customize</h3>}
          <button 
            className="collapse-btn"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          >
            {sidebarCollapsed ? '☰' : '←'}
          </button>
        </div>
        
        {!sidebarCollapsed && (
          <div className="sidebar-content">
            <div className="search-container">
              <input 
                type="text" 
                placeholder="Search" 
                className="search-input"
              />
            </div>
            
            <div className="sidebar-section">
              <h4>Widget Tools</h4>
              <div className="tool-item">
                <strong>Drag:</strong> Move widgets around
              </div>
              <div className="tool-item">
                <strong>Resize:</strong> Drag bottom-right corner
              </div>
              <div className="tool-item">
                <strong>Hover:</strong> Show resize handle
              </div>
            </div>
            
            <div className="sidebar-section">
              <h4>Add Widget</h4>
              <button 
                className="add-widget-btn"
                onClick={addNewRectangle}
              >
                + Add 1×1 Widget
              </button>
              <button 
                className="add-chart-btn"
                onClick={addNewChart}
              >
                📊 Add Chart
              </button>
              <button 
                className="add-metric-btn"
                onClick={() => addNewMetric('1x1')}
              >
                📈 Add Metric Widget
              </button>
              <button 
                className="add-funnel-btn"
                onClick={addNewFunnel}
              >
                🔻 Add Funnel Chart
              </button>
            </div>
            
            <div className="sidebar-section">
              <h4>Available Sizes</h4>
              <div className="size-options">
                <div className="size-option">1×1 • 150×150px</div>
                <div className="size-option">2×1 • 300×150px</div>
                <div className="size-option">1×2 • 150×300px</div>
                <div className="size-option">2×2 • 300×300px</div>
                <div className="size-option">3×1 • 450×150px</div>
                <div className="size-option chart-size">3×3 • 450×450px (Charts)</div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <div 
        ref={canvasRef}
        className={`canvas ${sidebarCollapsed ? 'sidebar-collapsed' : 'sidebar-expanded'}`}
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
            <div
              key={rect.id}
              className={`draggable-rectangle ${rect.isDragging ? 'dragging' : ''} ${rect.isResizing ? 'resizing' : ''} ${rect.isNew ? 'new-widget' : ''} ${rect.type === 'chart' || rect.type === 'funnel' ? 'chart-widget' : ''}`}
              style={{
                left: `${rect.x}px`,
                top: `${rect.y}px`,
                width: `${rect.width}px`,
                height: `${rect.height}px`,
                backgroundColor: rect.color,
                cursor: rect.isDragging ? 'grabbing' : 'grab',
                zIndex: rect.isDragging || rect.isResizing ? 10 : 1
              }}
              onMouseDown={(e) => handleMouseDown(e, rect.id)}
            >
              {rect.type === 'chart' ? (
                <div className="chart-container">
                  <div className="widget-info chart-info">
                    <span className="size-label">Bar Chart</span>
                  </div>
                  <ResponsiveBar
                    data={rect.chartData}
                    keys={['sales', 'expenses']}
                    indexBy="month"
                    margin={{ top: 50, right: 60, bottom: 50, left: 60 }}
                    padding={0.3}
                    valueScale={{ type: 'linear' }}
                    indexScale={{ type: 'band', round: true }}
                    colors={['#3b82f6', '#f97316']}
                    borderColor={{
                      from: 'color',
                      modifiers: [['darker', 1.6]]
                    }}
                    axisTop={null}
                    axisRight={null}
                    axisBottom={{
                      tickSize: 5,
                      tickPadding: 5,
                      tickRotation: 0,
                      legend: 'Month',
                      legendPosition: 'middle',
                      legendOffset: 32
                    }}
                    axisLeft={{
                      tickSize: 5,
                      tickPadding: 5,
                      tickRotation: 0,
                      legend: 'Amount',
                      legendPosition: 'middle',
                      legendOffset: -40
                    }}
                    labelSkipWidth={12}
                    labelSkipHeight={12}
                    labelTextColor={{
                      from: 'color',
                      modifiers: [['darker', 1.6]]
                    }}
                    legends={[
                      {
                        dataFrom: 'keys',
                        anchor: 'bottom-right',
                        direction: 'column',
                        justify: false,
                        translateX: 120,
                        translateY: 0,
                        itemsSpacing: 2,
                        itemWidth: 100,
                        itemHeight: 20,
                        itemDirection: 'left-to-right',
                        itemOpacity: 0.85,
                        symbolSize: 20,
                        effects: [
                          {
                            on: 'hover',
                            style: {
                              itemOpacity: 1
                            }
                          }
                        ]
                      }
                    ]}
                    role="application"
                    ariaLabel="Bar chart"
                    barAriaLabel={e => `${e.id}: ${e.formattedValue} in month: ${e.indexValue}`}
                  />
                </div>
              ) : rect.type === 'funnel' ? (
                <>
                  <div className="chart-container">
                    <div className="widget-info chart-info">
                      <span className="size-label">Funnel Chart</span>
                    </div>
                    <div className={`funnel-content ${rect.isDragging ? 'blurred' : ''}`} style={{ height: `${rect.height - 40}px`, width: '100%' }}>
                      <ResponsiveFunnel
                        data={rect.funnelData}
                        margin={{ top: 10, right: 10, bottom: 10, left: 10 }}
                        valueFormat=">-.4s"
                        colors={{ scheme: 'spectral' }}
                        borderWidth={10}
                        labelColor={{ from: 'color', modifiers: [['darker', 3]] }}
                        enableAfterSeparators={false}
                        enableBeforeSeparators={false}
                        beforeSeparatorLength={250}
                        beforeSeparatorOffset={5}
                        afterSeparatorLength={250}
                        afterSeparatorOffset={5}
                        currentPartSizeExtension={3}
                        currentBorderWidth={15}
                      />
                    </div>
                  </div>
                  <div className="resize-handles">
                    <div 
                      className="resize-handle resize-handle-se"
                      onMouseDown={(e) => handleResizeStart(e, rect.id)}
                    />
                  </div>
                </>
              ) : rect.type === 'metric' ? (
                <div className={`metric-container ${rect.size === '1x1' ? 'metric-compact' : 'metric-expanded'}`}>
                  <div className="widget-info metric-info">
                    <span className="size-label">Metric</span>
                  </div>
                  <div className={`metric-content ${rect.isResizing ? 'blurred' : ''}`}>
                    <div className="metric-header">
                      <h3 className="metric-title">{rect.metricData.title}</h3>
                      <p className="metric-subtitle">{rect.metricData.subtitle}</p>
                    </div>
                    <div className="metric-value" style={{ color: rect.metricData.color }}>
                      {rect.metricData.value}
                    </div>
                  </div>
                  <div className="resize-handles">
                    <div 
                      className="resize-handle resize-handle-se"
                      onMouseDown={(e) => handleResizeStart(e, rect.id)}
                    />
                  </div>
                </div>
              ) : (
                <>
                  <div className="widget-info">
                    <span className="size-label">{rect.size}</span>
                  </div>
                  
                  {rect.type !== 'chart' && rect.type !== 'funnel' && (
                    <div className="resize-handles">
                      <div 
                        className="resize-handle resize-handle-se"
                        onMouseDown={(e) => handleResizeStart(e, rect.id)}
                      />
                    </div>
                  )}
                </>
              )}
            </div>
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
