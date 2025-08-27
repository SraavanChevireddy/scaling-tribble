/**
 * API-powered Metric Widget Component
 * Displays real-time metrics from the Waiver Explorer API
 */

import { useDashboardMetrics } from '../hooks/useWaiverApi'

const ApiMetricWidget = ({ rect, handleResizeStart, metricType = 'totalWaivers' }) => {
  const { data: metrics, loading, error, refresh } = useDashboardMetrics(true) // Auto-refresh enabled

  // Map metric types to display data
  const getMetricData = (type, data) => {
    const metricMap = {
      totalWaivers: {
        title: 'Total Waivers',
        subtitle: 'All waivers',
        value: data.totalWaivers || 0,
        color: '#3b82f6'
      },
      criticalWaivers: {
        title: 'Critical Risk',
        subtitle: 'Immediate attention',
        value: data.criticalWaivers || 0,
        color: '#ef4444'
      },
      highRiskWaivers: {
        title: 'High Risk',
        subtitle: 'High priority',
        value: data.highRiskWaivers || 0,
        color: '#f59e0b'
      },
      expiring7Days: {
        title: 'Expiring Soon',
        subtitle: 'Next 7 days',
        value: data.expiring7Days || 0,
        color: '#dc2626'
      },
      expiring30Days: {
        title: 'Expiring',
        subtitle: 'Next 30 days',
        value: data.expiring30Days || 0,
        color: '#f59e0b'
      }
    }
    return metricMap[type] || metricMap.totalWaivers
  }

  const metricData = getMetricData(metricType, metrics)

  // Show loading state
  if (loading && Object.keys(metrics).length === 0) {
    return (
      <div className={`metric-container ${rect.size === '1x1' ? 'metric-compact' : 'metric-expanded'}`}>
        <div className="widget-info metric-info">
          <span className="size-label">Metric</span>
        </div>
        <div className="metric-content loading-state">
          <div className="metric-header">
            <h3 className="metric-title">Loading...</h3>
            <p className="metric-subtitle">Fetching data</p>
          </div>
          <div className="metric-value" style={{ color: '#6b7280' }}>
            <div className="loading-spinner">⟳</div>
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

  return (
    <div className={`metric-container ${rect.size === '1x1' ? 'metric-compact' : 'metric-expanded'}`}>
      <div className="widget-info metric-info">
        <span className="size-label">Live Metric</span>
        {error && <span className="error-indicator" title={error}>⚠</span>}
        {loading && <span className="loading-indicator" title="Refreshing...">⟳</span>}
      </div>
      
      <div className={`metric-content ${rect.isResizing ? 'blurred' : ''}`}>
        <div className="metric-header">
          <h3 className="metric-title">{metricData.title}</h3>
          <p className="metric-subtitle">
            {error ? 'Connection Error' : metricData.subtitle}
          </p>
        </div>
        <div className="metric-value" style={{ color: metricData.color }}>
          {metricData.value}
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

export default ApiMetricWidget