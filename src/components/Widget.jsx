import BasicWidget from './BasicWidget'
import ChartWidget from './ChartWidget'
import FunnelWidget from './FunnelWidget'
import MetricWidget from './MetricWidget'
import ApiChartWidget from './ApiChartWidget'
import ApiFunnelWidget from './ApiFunnelWidget'
import ApiMetricWidget from './ApiMetricWidget'

const Widget = ({ rect, handleMouseDown, handleResizeStart }) => {
  const renderWidgetContent = () => {
    switch (rect.type) {
      case 'chart':
        return <ChartWidget rect={rect} />
      case 'api-chart':
        return <ApiChartWidget rect={rect} timeRange={rect.timeRange} />
      case 'funnel':
        return <FunnelWidget rect={rect} handleResizeStart={handleResizeStart} />
      case 'api-funnel':
        return <ApiFunnelWidget rect={rect} handleResizeStart={handleResizeStart} />
      case 'metric':
        return <MetricWidget rect={rect} handleResizeStart={handleResizeStart} />
      case 'api-metric':
        return <ApiMetricWidget rect={rect} handleResizeStart={handleResizeStart} metricType={rect.metricType} />
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