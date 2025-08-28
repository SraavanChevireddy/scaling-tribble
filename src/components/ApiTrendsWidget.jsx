/**
 * API-powered Trends Widget Component
 * Displays waiver trends with percentage changes from the Trends API
 */

import { useWaiverTrends } from '../hooks/useWaiverApi'

const ApiTrendsWidget = ({ rect, handleResizeStart, trendType = 'expiring7Days' }) => {
  const { data: trends, loading, error, refresh } = useWaiverTrends(true) // Auto-refresh enabled

  // Map trend types to display data
  const getTrendData = (type, data) => {
    const calculateTrend = (changePercentage, previousMonth) => {
      // Logic: changePercentage - previousMonth
      // Negative = good trend (green), Positive = bad trend (red)
      return (changePercentage || 0) - (previousMonth || 0)
    }

    const trendMap = {
      expiring7Days: {
        title: 'Expiring Soon',
        subtitle: '7-day trend',
        changePercentage: data.expiring7Days?.changePercentage || 0,
        previousValue: data.expiring7Days?.previousMonth || 0,
        calculatedTrend: calculateTrend(data.expiring7Days?.changePercentage, data.expiring7Days?.previousMonth),
        baseColor: '#dc2626'
      },
      expiring30Days: {
        title: 'Monthly Trend',
        subtitle: '30-day trend',
        changePercentage: data.expiring30Days?.changePercentage || 0,
        previousValue: data.expiring30Days?.previousMonth || 0,
        calculatedTrend: calculateTrend(data.expiring30Days?.changePercentage, data.expiring30Days?.previousMonth),
        baseColor: '#f59e0b'
      },
      expiring90Days: {
        title: 'Quarterly Trend',
        subtitle: '90-day trend',
        changePercentage: data.expiring90Days?.changePercentage || 0,
        previousValue: data.expiring90Days?.previousMonth || 0,
        calculatedTrend: calculateTrend(data.expiring90Days?.changePercentage, data.expiring90Days?.previousMonth),
        baseColor: '#10b981'
      },
      expiringLater: {
        title: 'Future Trend',
        subtitle: 'Later expiring',
        changePercentage: data.expiringLater?.changePercentage || 0,
        previousValue: data.expiringLater?.previousMonth || 0,
        calculatedTrend: calculateTrend(data.expiringLater?.changePercentage, data.expiringLater?.previousMonth),
        baseColor: '#6366f1'
      },
      neverExpires: {
        title: 'Permanent',
        subtitle: 'Never expires',
        changePercentage: data.neverExpires?.changePercentage || 0,
        previousValue: data.neverExpires?.previousMonth || 0,
        calculatedTrend: calculateTrend(data.neverExpires?.changePercentage, data.neverExpires?.previousMonth),
        baseColor: '#8b5cf6'
      }
    }
    return trendMap[type] || trendMap.expiring7Days
  }

  const trendData = getTrendData(trendType, trends)
  
  // Format percentage with + or - sign and % symbol
  const formatPercentage = (value) => {
    if (value === 0) return '0.0%'
    const sign = value > 0 ? '+' : ''
    return `${sign}${value.toFixed(1)}%`
  }

  // Determine color based on calculated trend (positive = good/green, negative = bad/red)
  const getTrendColor = () => {
    const calculatedTrend = trendData.calculatedTrend
    if (calculatedTrend > 0) {
      return '#10b981' // Green - good trend (positive change)
    } else if (calculatedTrend < 0) {
      return '#dc2626' // Red - bad trend (negative change)  
    } else {
      return '#6b7280' // Gray - no change
    }
  }

  // Get trend arrow based on direction
  const getTrendArrow = () => {
    const calculatedTrend = trendData.calculatedTrend
    if (calculatedTrend > 0) return '↑' // Up arrow for positive trend
    if (calculatedTrend < 0) return '↓' // Down arrow for negative trend
    return '→' // Horizontal arrow for no change
  }

  // Show loading state
  if (loading && Object.keys(trends).length === 0) {
    return (
      <div className={`metric-container ${rect.size === '1x1' ? 'metric-compact' : 'metric-expanded'}`}>
        <div className="widget-info metric-info">
          <span className="size-label">Trends</span>
        </div>
        <div className="metric-content loading-state">
          <div className="metric-header">
            <h3 className="metric-title">Loading...</h3>
            <p className="metric-subtitle">Fetching trends</p>
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
        <span className="size-label">Live Trends</span>
        {error && <span className="error-indicator" title={error}>⚠</span>}
        {loading && <span className="loading-indicator" title="Refreshing...">⟳</span>}
      </div>
      
      <div className={`metric-content ${rect.isResizing ? 'blurred' : ''}`}>
        <div className="metric-header">
          <h3 className="metric-title">{trendData.title}</h3>
          <p className="metric-subtitle">
            {error ? 'Connection Error' : trendData.subtitle}
          </p>
        </div>
        <div className="metric-value trends-value" style={{ 
          color: getTrendColor(),
          fontSize: rect.size === '1x1' ? '1.8em' : '1.6em',
          fontWeight: '700',
          lineHeight: '1',
          display: 'flex',
          alignItems: rect.size === '1x1' ? 'center' : 'flex-start',
          justifyContent: rect.size === '1x1' ? 'center' : 'flex-start',
          gap: '4px',
          flexWrap: 'wrap',
          flexDirection: rect.size === '1x1' ? 'row' : 'column',
          height: '100%',
          overflow: 'hidden'
        }}>
          {error ? 'N/A' : (
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '3px', 
              textAlign: rect.size === '1x1' ? 'center' : 'left',
              justifyContent: rect.size === '1x1' ? 'center' : 'flex-start'
            }}>
              <span style={{ fontSize: '0.8em' }}>{getTrendArrow()}</span>
              <span>{formatPercentage(trendData.calculatedTrend)}</span>
            </div>
          )}
          {!error && rect.size === '2x1' && (
            <div className="trend-details" style={{ 
              fontSize: '0.6em', 
              color: '#6b7280', 
              marginTop: '4px', 
              lineHeight: '1.1',
              textAlign: 'left',
              width: 'calc(100% - 8px)',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              gap: '2px',
              paddingRight: '4px',
              boxSizing: 'border-box'
            }}>
              <div style={{ 
                overflow: 'hidden', 
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                maxWidth: '100%'
              }}>
                Chg: {formatPercentage(trendData.changePercentage)}
              </div>
              <div style={{ 
                overflow: 'hidden', 
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                maxWidth: '100%'
              }}>
                Prev: {trendData.previousValue}
              </div>
            </div>
          )}
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

export default ApiTrendsWidget