import { useState, useCallback, useRef } from 'react'
import { WIDGET_SIZES, GRID_SIZE, TITLE_AREA_HEIGHT, SAMPLE_CHART_DATA, SAMPLE_FUNNEL_DATA, SAMPLE_METRICS } from '../constants/widgetConstants'

export const useWidgetManagement = () => {
  const [rectangles, setRectangles] = useState([])
  const [dragState, setDragState] = useState({ id: null, offsetX: 0, offsetY: 0 })
  const [resizeState, setResizeState] = useState({ id: null, handle: null, startX: 0, startY: 0, startWidth: 0, startHeight: 0 })
  const canvasRef = useRef(null)


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
    const padding = 50
    const startY = TITLE_AREA_HEIGHT + padding
    
    // Simple positioning - just place widgets sequentially with some spacing
    const widgetCount = existingRects.length
    const row = Math.floor(widgetCount / 4) // 4 widgets per row
    const col = widgetCount % 4
    
    return {
      x: padding + col * 200, // 200px spacing between widgets
      y: startY + row * 200   // 200px spacing between rows
    }
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
    const size = WIDGET_SIZES['2x2']
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
      size: '2x2',
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
    const size = WIDGET_SIZES['2x2']
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
      size: '2x2',
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

  const addNewApiTrends = useCallback((trendSize = '1x1', trendType = 'expiring7Days') => {
    const newId = Math.max(...rectangles.map(r => r.id), 0) + 1
    const size = WIDGET_SIZES[trendSize]
    const position = findNextGridPosition(size.cols, size.rows, rectangles)
    
    const newTrends = {
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
      size: trendSize,
      type: 'api-trends',
      trendType: trendType,
      isNew: true,
      isApiPowered: true
    }
    
    setRectangles(prev => [...prev, newTrends])
    
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

  return {
    rectangles,
    setRectangles,
    dragState,
    setDragState,
    resizeState,
    setResizeState,
    canvasRef,
    getCanvasBounds,
    getClosestSize,
    addNewRectangle,
    addNewChart,
    addNewFunnel,
    addNewMetric,
    // API-powered widget functions
    addNewApiMetric,
    addNewApiChart,
    addNewApiFunnel,
    addNewApiTrends
  }
}