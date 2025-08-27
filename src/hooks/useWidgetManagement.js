import { useState, useCallback, useRef } from 'react'
import { WIDGET_SIZES, GRID_SIZE, TITLE_AREA_HEIGHT, SAMPLE_CHART_DATA, SAMPLE_FUNNEL_DATA, SAMPLE_METRICS } from '../constants/widgetConstants'

export const useWidgetManagement = () => {
  const [rectangles, setRectangles] = useState([])
  const [dragState, setDragState] = useState({ id: null, offsetX: 0, offsetY: 0 })
  const [resizeState, setResizeState] = useState({ id: null, handle: null, startX: 0, startY: 0, startWidth: 0, startHeight: 0 })
  const canvasRef = useRef(null)

  const checkCollision = useCallback((rect1, rect2, padding = 0) => {
    // Add padding to create buffer zones between widgets
    const r1 = {
      x: rect1.x - padding,
      y: rect1.y - padding,
      width: rect1.width + padding * 2,
      height: rect1.height + padding * 2
    }
    const r2 = {
      x: rect2.x - padding,
      y: rect2.y - padding,
      width: rect2.width + padding * 2,
      height: rect2.height + padding * 2
    }
    
    // Robust AABB collision detection
    return !(r1.x >= r2.x + r2.width || 
             r1.x + r1.width <= r2.x || 
             r1.y >= r2.y + r2.height || 
             r1.y + r1.height <= r2.y)
  }, [])

  const getCanvasBounds = useCallback(() => {
    const canvasWidth = window.innerWidth
    
    // Calculate required height based on widgets
    const maxY = rectangles.reduce((max, rect) => {
      return Math.max(max, rect.y + rect.height + 50) // 50px padding at bottom
    }, window.innerHeight)
    
    return {
      width: canvasWidth,
      height: Math.max(window.innerHeight, maxY)
    }
  }, [rectangles])

  const findValidPosition = useCallback((movingRect, desiredX, desiredY, otherRects) => {
    const canvas = getCanvasBounds()
    const edgePadding = 10
    const widgetPadding = 12 // Increased for better spacing
    const minY = TITLE_AREA_HEIGHT + edgePadding
    
    // Constrain to canvas bounds first
    let x = Math.max(edgePadding, Math.min(desiredX, canvas.width - movingRect.width - edgePadding))
    let y = Math.max(minY, Math.min(desiredY, canvas.height - movingRect.height - edgePadding))
    
    // Multi-pass collision resolution (up to 10 attempts)
    for (let attempt = 0; attempt < 10; attempt++) {
      const testRect = { ...movingRect, x, y }
      let hasCollision = false
      let bestPosition = { x, y }
      let minDistance = Infinity
      
      // Check all other widgets for collisions
      for (const other of otherRects) {
        if (checkCollision(testRect, other, widgetPadding)) {
          hasCollision = true
          
          // Calculate all possible non-colliding positions around this widget
          const positions = [
            // Right side
            { x: other.x + other.width + widgetPadding, y },
            // Left side  
            { x: other.x - testRect.width - widgetPadding, y },
            // Bottom side
            { x, y: other.y + other.height + widgetPadding },
            // Top side
            { x, y: other.y - testRect.height - widgetPadding },
            // Diagonal positions for better coverage
            { x: other.x + other.width + widgetPadding, y: other.y },
            { x: other.x - testRect.width - widgetPadding, y: other.y },
            { x: other.x, y: other.y + other.height + widgetPadding },
            { x: other.x, y: other.y - testRect.height - widgetPadding }
          ]
          
          // Find the closest valid position
          for (const pos of positions) {
            // Check bounds
            if (pos.x < edgePadding || pos.x + testRect.width > canvas.width - edgePadding ||
                pos.y < minY || pos.y + testRect.height > canvas.height - edgePadding) {
              continue
            }
            
            // Calculate distance from desired position
            const distance = Math.sqrt(Math.pow(pos.x - desiredX, 2) + Math.pow(pos.y - desiredY, 2))
            
            if (distance < minDistance) {
              // Verify this position doesn't collide with other widgets
              const tempRect = { ...testRect, x: pos.x, y: pos.y }
              let wouldCollide = false
              
              for (const otherCheck of otherRects) {
                if (otherCheck.id !== other.id && checkCollision(tempRect, otherCheck, widgetPadding)) {
                  wouldCollide = true
                  break
                }
              }
              
              if (!wouldCollide) {
                minDistance = distance
                bestPosition = pos
              }
            }
          }
        }
      }
      
      if (!hasCollision) {
        // No collision, position is valid
        break
      }
      
      // Use the best position found and try again
      x = bestPosition.x
      y = bestPosition.y
      
      // If we couldn't find a better position, we might be stuck
      if (bestPosition.x === x && bestPosition.y === y && attempt > 0) {
        break
      }
    }
    
    // Final bounds check
    x = Math.max(edgePadding, Math.min(x, canvas.width - movingRect.width - edgePadding))
    y = Math.max(minY, Math.min(y, canvas.height - movingRect.height - edgePadding))
    
    return { x, y }
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

  const validateResizeOperation = useCallback((resizingRect, newWidth, newHeight, otherRects) => {
    const canvas = getCanvasBounds()
    const edgePadding = 10
    const widgetPadding = 12
    const minY = TITLE_AREA_HEIGHT + edgePadding
    
    // Check canvas bounds
    const maxWidth = canvas.width - resizingRect.x - edgePadding
    const maxHeight = canvas.height - resizingRect.y - edgePadding
    
    let validWidth = Math.min(newWidth, maxWidth)
    let validHeight = Math.min(newHeight, maxHeight)
    
    // Check for collisions with other widgets
    const testRect = { 
      ...resizingRect, 
      width: validWidth, 
      height: validHeight 
    }
    
    for (const other of otherRects) {
      if (checkCollision(testRect, other, widgetPadding)) {
        // Calculate maximum dimensions that don't collide
        if (other.x > resizingRect.x) {
          // Widget to the right - limit width
          validWidth = Math.min(validWidth, other.x - resizingRect.x - widgetPadding)
        }
        if (other.y > resizingRect.y) {
          // Widget below - limit height  
          validHeight = Math.min(validHeight, other.y - resizingRect.y - widgetPadding)
        }
      }
    }
    
    // Ensure minimum size
    validWidth = Math.max(GRID_SIZE, validWidth)
    validHeight = Math.max(GRID_SIZE, validHeight)
    
    return { width: validWidth, height: validHeight }
  }, [checkCollision, getCanvasBounds])

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
    const canvasWidth = window.innerWidth
    const padding = 10
    const widgetPadding = 10 // Padding between widgets
    const startY = TITLE_AREA_HEIGHT + padding // Start below title areas
    
    // Calculate grid dimensions (including padding between widgets)
    const gridCols = Math.floor((canvasWidth - padding * 2) / (GRID_SIZE + widgetPadding))
    const maxGridRows = 50
    
    // Create a grid occupancy map
    const occupiedSlots = new Set()
    
    // Mark occupied slots based on existing widgets
    existingRects.forEach(rect => {
      const startCol = Math.round((rect.x - padding) / (GRID_SIZE + widgetPadding))
      const startRow = Math.round((rect.y - startY) / (GRID_SIZE + widgetPadding))
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
            y: startY + row * (GRID_SIZE + widgetPadding)
          }
        }
      }
    }
    
    // Fallback to below title area if no space found
    return { x: padding, y: startY }
  }, [])

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
    
    // Force a re-render after a short delay to ensure proper sizing
    setTimeout(() => {
      setRectangles(prev => prev.map(r => 
        r.id === newId ? { ...r, isNew: false, forceUpdate: Date.now() } : r
      ))
    }, 100)
    
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
    }, 200)
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

  // API-powered widget creation functions
  const addNewApiMetric = useCallback((metricSize = '1x1', metricType = 'totalWaivers') => {
    const newId = Math.max(...rectangles.map(r => r.id), 0) + 1
    const size = WIDGET_SIZES[metricSize]
    const position = findNextGridPosition(size.cols, size.rows, rectangles)
    
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
      type: 'api-metric',
      metricType: metricType,
      isNew: true,
      isApiPowered: true
    }
    
    setRectangles(prev => [...prev, newMetric])
    
    setTimeout(() => {
      setRectangles(prev => prev.map(r => 
        r.id === newId ? { ...r, isNew: false } : r
      ))
    }, 500)
    
    setTimeout(() => {
      if (canvasRef.current) {
        const targetY = position.y - 100
        canvasRef.current.scrollTo({
          top: Math.max(0, targetY),
          behavior: 'smooth'
        })
      }
    }, 100)
  }, [rectangles, findNextGridPosition])

  const addNewApiChart = useCallback((timeRange = 'monthly') => {
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
      type: 'api-chart',
      timeRange: timeRange,
      isNew: true,
      isApiPowered: true
    }
    
    setRectangles(prev => [...prev, newChart])
    
    setTimeout(() => {
      setRectangles(prev => prev.map(r => 
        r.id === newId ? { ...r, isNew: false } : r
      ))
    }, 500)
    
    setTimeout(() => {
      if (canvasRef.current) {
        const targetY = position.y - 100
        canvasRef.current.scrollTo({
          top: Math.max(0, targetY),
          behavior: 'smooth'
        })
      }
    }, 100)
  }, [rectangles, findNextGridPosition])

  const addNewApiFunnel = useCallback(() => {
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
      type: 'api-funnel',
      isNew: true,
      isApiPowered: true
    }
    
    setRectangles(prev => [...prev, newFunnel])
    
    setTimeout(() => {
      setRectangles(prev => prev.map(r => 
        r.id === newId ? { ...r, isNew: false, forceUpdate: Date.now() } : r
      ))
    }, 100)
    
    setTimeout(() => {
      setRectangles(prev => prev.map(r => 
        r.id === newId ? { ...r, isNew: false } : r
      ))
    }, 500)
    
    setTimeout(() => {
      if (canvasRef.current) {
        const targetY = position.y - 100
        canvasRef.current.scrollTo({
          top: Math.max(0, targetY),
          behavior: 'smooth'
        })
      }
    }, 200)
  }, [rectangles, findNextGridPosition])

  return {
    rectangles,
    setRectangles,
    dragState,
    setDragState,
    resizeState,
    setResizeState,
    canvasRef,
    getCanvasBounds,
    findValidPosition,
    validateResizeOperation,
    getClosestSize,
    addNewRectangle,
    addNewChart,
    addNewFunnel,
    addNewMetric,
    // API-powered widget functions
    addNewApiMetric,
    addNewApiChart,
    addNewApiFunnel
  }
}