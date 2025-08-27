const MetricWidget = ({ rect, handleResizeStart }) => {
  return (
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
  )
}

export default MetricWidget