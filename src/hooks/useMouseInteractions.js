import { useCallback } from 'react'
import { WIDGET_SIZES, GRID_SIZE } from '../constants/widgetConstants'

export const useMouseInteractions = (widgetManagement) => {
  const {
    rectangles,
    setRectangles,
    dragState,
    setDragState,
    resizeState,
    setResizeState,
    findValidPosition,
    validateResizeOperation,
    getCanvasBounds,
    getClosestSize
  } = widgetManagement

  const handleResizeStart = useCallback((e, rectId) => {
    e.preventDefault()
    e.stopPropagation()
    
    const rect = rectangles.find(r => r.id === rectId)
    if (!rect || rect.type === 'chart' || rect.type === 'funnel' || 
        rect.type === 'api-chart' || rect.type === 'api-funnel') return

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
  }, [rectangles, setRectangles, setResizeState])

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
  }, [rectangles, setDragState, setRectangles])

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
      if (!resizingRect || resizingRect.type === 'chart' || resizingRect.type === 'funnel' || 
          resizingRect.type === 'api-chart' || resizingRect.type === 'api-funnel') return

      const deltaX = e.clientX - resizeState.startX
      const deltaY = e.clientY - resizeState.startY
      
      const desiredWidth = Math.max(GRID_SIZE, resizeState.startWidth + deltaX)
      const desiredHeight = Math.max(GRID_SIZE, resizeState.startHeight + deltaY)
      
      const otherRects = rectangles.filter(r => r.id !== resizeState.id)
      const validDimensions = validateResizeOperation(resizingRect, desiredWidth, desiredHeight, otherRects)

      setRectangles(prev => prev.map(r => 
        r.id === resizeState.id ? { 
          ...r, 
          width: validDimensions.width,
          height: validDimensions.height
        } : r
      ))
    }
  }, [dragState, resizeState, rectangles, findValidPosition, validateResizeOperation, setRectangles])

  const handleMouseUp = useCallback(() => {
    if (resizeState.id) {
      const rect = rectangles.find(r => r.id === resizeState.id)
      if (rect && rect.type !== 'chart' && rect.type !== 'funnel' && 
          rect.type !== 'api-chart' && rect.type !== 'api-funnel') {
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
  }, [resizeState, rectangles, getClosestSize, setDragState, setResizeState, setRectangles])

  return {
    handleResizeStart,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp
  }
}