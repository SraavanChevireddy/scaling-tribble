import BasicWidget from './BasicWidget'
import ChartWidget from './ChartWidget'
import FunnelWidget from './FunnelWidget'
import MetricWidget from './MetricWidget'

const Widget = ({ rect, handleMouseDown, handleResizeStart }) => {
  const renderWidgetContent = () => {
    switch (rect.type) {
      case 'chart':
        return <ChartWidget rect={rect} />
      case 'funnel':
        return <FunnelWidget rect={rect} handleResizeStart={handleResizeStart} />
      case 'metric':
        return <MetricWidget rect={rect} handleResizeStart={handleResizeStart} />
      default:
        return <BasicWidget rect={rect} handleResizeStart={handleResizeStart} />
    }
  }

  return (
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
      {renderWidgetContent()}
    </div>
  )
}

export default Widget