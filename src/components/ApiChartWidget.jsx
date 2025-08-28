/**
 * API-powered Chart Widget Component
 * Displays real-time chart data from the Waiver Explorer API
 */

import { ResponsiveBar } from '@nivo/bar'
import { useBarChartData } from '../hooks/useWaiverApi'
import { useState, useEffect } from 'react'

const ApiChartWidget = ({ rect, timeRange = 'monthly' }) => {
  const { data: chartData, loading, error, refresh } = useBarChartData(timeRange)
  const [showChart, setShowChart] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowChart(true)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="chart-container" style={{ 
      borderRadius: '12px',
      overflow: 'hidden'
    }}>
      {/* Only show info label when not in expanded view */}
      {!rect.expandedView && (
        <div className="widget-info chart-info">
          <span className="size-label">Live Chart</span>
          <div className="chart-controls">
            {error && <span className="error-indicator" title={error}>⚠</span>}
            {loading && <span className="loading-indicator" title="Loading...">⟳</span>}
          </div>
        </div>
      )}
      
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
          margin={{ top: 50, right: 60, bottom: 60, left: 80 }}
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
            tickPadding: 8,
            tickRotation: 0,
            legend: 'Period',
            legendPosition: 'middle',
            legendOffset: 40,
            format: value => value
          }}
          axisLeft={{
            tickSize: 5,
            tickPadding: 8,
            tickRotation: 0,
            legend: 'Waivers',
            legendPosition: 'middle',
            legendOffset: -60,
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
      
      {/* Data source indicator */}
      <div className="data-source-indicator">
        <span className={`connection-status ${error ? 'error' : 'connected'}`}>
          {error ? '⚠ Offline Data' : '🟢 Live Data'}
        </span>
        <span className="time-range-indicator">
          {timeRange.charAt(0).toUpperCase() + timeRange.slice(1)} View
        </span>
      </div>
    </div>
  )
}

export default ApiChartWidget