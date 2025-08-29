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

  // Get layout class based on size
  const getLayoutClass = () => {
    if (rect.size === '1x1') return 'metric-compact'
    if (rect.size === '2x1') return 'metric-expanded'
    if (rect.size === '1x2') return 'metric-vertical'
    return 'metric-expanded'
  }

  return (
    <div className={`metric-container ${getLayoutClass()}`}>
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
          fontSize: rect.size === '1x1' ? '1.4em' : '1.0em', // Further reduced for larger widgets
          fontWeight: '700',
          lineHeight: '1.0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '2px', // Reduced gap
          flexWrap: 'wrap',
          flexDirection: 'column',
          height: '100%',
          overflow: 'visible',
          textAlign: 'center',
          padding: '2px' // Minimal padding
        }}>
          {error ? 'N/A' : (
            <>
              {/* Main trend percentage */}
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '4px', 
                textAlign: 'center',
                justifyContent: 'center',
                alignSelf: 'center',
                fontSize: '1em',
                fontWeight: '700',
                width: '100%',
                flexShrink: 0
              }}>
                <span style={{ fontSize: '0.9em' }}>{getTrendArrow()}</span>
                <span>{formatPercentage(trendData.calculatedTrend)}</span>
              </div>
              
              {/* Additional details for larger widgets - always below main percentage */}
              {(rect.size === '2x1' || rect.size === '1x2') && (
                <div style={{ 
                  fontSize: '0.7em', // Slightly larger for visibility
                  color: '#374151', // Darker color for better visibility
                  lineHeight: '1.2',
                  textAlign: rect.size === '1x2' ? 'left' : 'center',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1px',
                  alignSelf: rect.size === '1x2' ? 'flex-start' : 'center',
                  marginTop: '2px', // Reduced margin
                  width: '100%',
                  fontWeight: '600', // Bolder
                  paddingLeft: rect.size === '1x2' ? '8px' : '0',
                  flexShrink: 0,
                  maxWidth: '100%',
                  boxSizing: 'border-box',
                  padding: '2px 4px', // Added padding for better visibility
                  background: 'rgba(255, 255, 255, 0.7)', // Light background
                  borderRadius: '3px'
                }}>
                  <div style={{ width: '100%', whiteSpace: 'nowrap', overflow: 'visible' }}>
                    Chg: {formatPercentage(trendData.changePercentage)}
                  </div>
                  <div style={{ width: '100%', whiteSpace: 'nowrap', overflow: 'visible' }}>
                    Prev: {trendData.previousValue}
                  </div>
                </div>
              )}
              
              {/* 1x1 widgets show only the main percentage - no additional data */}
            </>
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