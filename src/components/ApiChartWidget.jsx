/**
 * API-powered Chart Widget Component
 * Displays real-time chart data from the Waiver Explorer API
 */

import { ResponsiveBar } from '@nivo/bar'
import { useBarChartData } from '../hooks/useWaiverApi'

const ApiChartWidget = ({ rect, timeRange = 'monthly' }) => {
  const { data: chartData, loading, error, refresh } = useBarChartData(timeRange)

  return (
    <div className="chart-container">
      <div className="widget-info chart-info">
        <span className="size-label">Live Chart</span>
        <div className="chart-controls">
          {error && <span className="error-indicator" title={error}>⚠</span>}
          {loading && <span className="loading-indicator" title="Loading...">⟳</span>}
        </div>
      </div>
      
      {loading && !chartData.length ? (
        <div className="chart-loading">
          <div className="loading-spinner-large">⟳</div>
          <p>Loading chart data...</p>
        </div>
      ) : (
        <ResponsiveBar
          data={chartData}
          keys={['waivers', 'expired']}
          indexBy="month"
          margin={{ top: 50, right: 60, bottom: 50, left: 60 }}
          padding={0.3}
          valueScale={{ type: 'linear' }}
          indexScale={{ type: 'band', round: true }}
          colors={['#3b82f6', '#ef4444']}
          borderColor={{
            from: 'color',
            modifiers: [['darker', 1.6]]
          }}
          axisTop={null}
          axisRight={null}
          axisBottom={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: 'Period',
            legendPosition: 'middle',
            legendOffset: 32
          }}
          axisLeft={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: 'Waiver Count',
            legendPosition: 'middle',
            legendOffset: -40
          }}
          labelSkipWidth={12}
          labelSkipHeight={12}
          labelTextColor={{
            from: 'color',
            modifiers: [['darker', 1.6]]
          }}
          legends={[
            {
              dataFrom: 'keys',
              anchor: 'bottom-right',
              direction: 'column',
              justify: false,
              translateX: 120,
              translateY: 0,
              itemsSpacing: 2,
              itemWidth: 100,
              itemHeight: 20,
              itemDirection: 'left-to-right',
              itemOpacity: 0.85,
              symbolSize: 20,
              effects: [
                {
                  on: 'hover',
                  style: {
                    itemOpacity: 1
                  }
                }
              ]
            }
          ]}
          animate={true}
          motionConfig="gentle"
          tooltip={({ id, value, indexValue, color }) => (
            <div className="chart-tooltip">
              <div className="tooltip-header">
                <span className="tooltip-color" style={{ backgroundColor: color }}></span>
                <strong>{id}</strong>
              </div>
              <div className="tooltip-content">
                <span>{indexValue}: {value.toLocaleString()}</span>
              </div>
            </div>
          )}
          role="application"
          ariaLabel="Waiver statistics bar chart"
          barAriaLabel={e => `${e.id}: ${e.formattedValue} waivers in ${e.indexValue}`}
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