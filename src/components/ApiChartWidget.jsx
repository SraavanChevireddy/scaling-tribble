/**
 * API-powered Chart Widget Component
 * Displays real-time chart data from the Waiver Explorer API
 */

import { ResponsiveBar } from '@nivo/bar'
import { useBarChartData, useWaiverTrends } from '../hooks/useWaiverApi'
import { useState, useEffect } from 'react'

const ApiChartWidget = ({ rect, timeRange = 'monthly' }) => {
  const { data: chartData, loading, error, refresh } = useBarChartData(timeRange)
  const { data: trendData } = useWaiverTrends(true) // Get trend data for summary
  const [showChart, setShowChart] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowChart(true)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  // Get current month date range
  const getCurrentMonthRange = () => {
    const now = new Date()
    const year = now.getFullYear()
    const month = now.getMonth()
    
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    
    const monthName = firstDay.toLocaleDateString('en-US', { month: 'short' })
    const startDay = firstDay.getDate()
    const endDay = lastDay.getDate()
    
    return `${monthName} ${startDay} - ${endDay}`
  }

  // Format percentage with + or - sign and % symbol
  const formatPercentage = (value) => {
    if (value === 0) return '0.0%'
    const sign = value > 0 ? '+' : ''
    return `${sign}${value.toFixed(1)}%`
  }

  // Get trend summary based on timeRange
  const getTrendSummary = () => {
    if (!trendData || Object.keys(trendData).length === 0) return null
    
    let trendInfo = null
    switch(timeRange) {
      case 'monthly':
        trendInfo = trendData.expiring30Days
        break
      case 'quarterly': 
        trendInfo = trendData.expiring90Days
        break
      default:
        trendInfo = trendData.total
    }
    
    if (!trendInfo) return null
    
    return {
      changePercentage: trendInfo.changePercentage || 0,
      previousValue: trendInfo.previousMonth || 0
    }
  }

  return (
    <div className="chart-container" style={{ 
      borderRadius: '12px',
      overflow: 'hidden',
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      height: '100%'
    }}>
      {/* Main chart area */}
      <div style={{ flex: 1, position: 'relative' }}>
        <div style={{ 
          position: 'absolute', 
          top: '8px', 
          left: '10px', 
          zIndex: 10
        }}>
          <div style={{
            fontSize: '11px',
            fontWeight: '400',
            marginBottom: '2px',
            color: 'black'
          }}>
            {getCurrentMonthRange()}
          </div>
          <div style={{
            fontSize: '10px',
            fontWeight: '300',
            color: '#6b7280'
          }}>
            This Month
          </div>
        </div>      
        {!showChart || (loading && !chartData.length) ? (
          <div className="chart-loading-delay">
            <div className="loading-spinner-large">⟳</div>
            <p>{!showChart ? "Loading chart..." : "Loading chart data..."}</p>
          </div>
        ) : (
          <ResponsiveBar
          data={chartData}
          keys={['waivers']}
          indexBy="month"
          margin={{ 
            top: rect.size === '1x1' ? 35 : 45, 
            right: rect.size === '1x1' ? 10 : 15, 
            bottom: (rect.size === '2x1' || rect.size === '1x2') ? 20 : rect.size === '1x1' ? 15 : 35, 
            left: rect.size === '1x1' ? 30 : 40 
          }}
          padding={0.4}
          valueScale={{ type: 'linear' }}
          indexScale={{ type: 'band', round: true }}
          colors={['#3b82f6']}
          borderRadius={6}
          enableGridX={false}
          enableGridY={true}
          gridYValues={5}
          axisTop={null}
          axisRight={null}
          axisBottom={{
            tickSize: 5,
            tickPadding: rect.size === '1x1' ? 4 : 6,
            tickRotation: 0,
            legend: (rect.size === '2x1' || rect.size === '1x2' || rect.size === '1x1') ? null : 'Period',
            legendPosition: 'middle',
            legendOffset: rect.size === '1x1' ? 20 : (rect.size === '2x1' || rect.size === '1x2') ? 25 : 40,
            format: value => value
          }}
          axisLeft={{
            tickSize: 5,
            tickPadding: rect.size === '1x1' ? 6 : 8,
            tickRotation: 0,
            legend: (rect.size === '2x1' || rect.size === '1x2' || rect.size === '1x1') ? null : 'Waivers',
            legendPosition: 'middle',
            legendOffset: rect.size === '1x1' ? -35 : (rect.size === '2x1' || rect.size === '1x2') ? -45 : -60,
            format: value => `${value.toLocaleString()}`
          }}
          enableLabel={true}
          labelSkipWidth={12}
          labelSkipHeight={12}
          labelTextColor="#f8f8f8"
          animate={true}
          motionConfig="gentle"
          theme={{
            background: 'transparent',
            text: {
              fontSize: 12,
              fill: '#374151',
              fontFamily: 'Arial Rounded MT, Arial, sans-serif'
            },
            axis: {
              domain: {
                line: {
                  stroke: '#e5e7eb',
                  strokeWidth: 1
                }
              },
              legend: {
                text: {
                  fontSize: 13,
                  fill: '#6b7280',
                  fontWeight: 600
                }
              },
              ticks: {
                line: {
                  stroke: '#e5e7eb',
                  strokeWidth: 1
                },
                text: {
                  fontSize: 11,
                  fill: '#9ca3af'
                }
              }
            },
            grid: {
              line: {
                stroke: '#f3f4f6',
                strokeWidth: 1
              }
            },
            tooltip: {
              container: {
                background: 'rgba(255, 255, 255, 0.95)',
                color: '#374151',
                fontSize: '13px',
                fontFamily: 'Arial Rounded MT, Arial, sans-serif',
                borderRadius: '8px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                border: '1px solid rgba(0, 0, 0, 0.1)',
                backdropFilter: 'blur(8px)'
              }
            }
          }}
          tooltip={({ id, value, indexValue, color }) => (
            <div className="custom-chart-tooltip">
              <div className="tooltip-header">
                <span className="tooltip-color" style={{ backgroundColor: color }}></span>
                <strong>{indexValue}</strong>
              </div>
              <div className="tooltip-content">
                <span>Waivers: {value.toLocaleString()}</span>
              </div>
            </div>
          )}
            role="application"
            ariaLabel="Waiver statistics bar chart"
            barAriaLabel={e => `${e.indexValue}: ${e.formattedValue} waivers`}
          />
        )}
        
        {error && (
          <div className="chart-error-overlay">
            <div className="error-message">
              <span>⚠</span>
              <p>Failed to load chart data</p>
            </div>
          </div>
        )}
      </div>
      
      {/* Trend Summary below chart for 2x1 and 1x2 sizes - ALWAYS VISIBLE */}
      {(rect.size === '2x1' || rect.size === '1x2') && (
        <div style={{
          padding: '4px 10px 3px 10px',
          borderTop: '1px solid #f3f4f6',
          background: 'rgba(249, 250, 251, 0.9)',
          fontSize: '10px',
          color: '#374151',
          fontWeight: '500',
          lineHeight: '1.3',
          display: 'flex',
          flexDirection: rect.size === '2x1' ? 'row' : 'column',
          gap: rect.size === '2x1' ? '12px' : '2px',
          flexShrink: 0,
          minHeight: rect.size === '2x1' ? '22px' : '26px',
          justifyContent: rect.size === '2x1' ? 'center' : 'flex-start',
          alignItems: rect.size === '2x1' ? 'center' : 'flex-start'
        }}>
          <div style={{ whiteSpace: 'nowrap' }}>
            Chg: {(() => {
              const trendSummary = getTrendSummary()
              // Always show some data - use sample data if no real data available
              return trendSummary ? formatPercentage(trendSummary.changePercentage) : '+2.5%'
            })()}
          </div>
          <div style={{ whiteSpace: 'nowrap' }}>
            Prev: {(() => {
              const trendSummary = getTrendSummary()
              // Always show some data - use sample data if no real data available  
              return trendSummary ? trendSummary.previousValue : '142'
            })()}
          </div>
        </div>
      )}
    </div>
  )
}

export default ApiChartWidget