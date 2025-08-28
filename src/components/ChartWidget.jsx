import { ResponsiveBar } from '@nivo/bar'
import { useState, useEffect } from 'react'

const ChartWidget = ({ rect }) => {
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

  return (
    <div className="chart-container" style={{ 
      borderRadius: '12px',
      overflow: 'hidden'
    }}>
      <div style={{ 
        position: 'absolute', 
        top: '8px', 
        left: '10px', 
        zIndex: 10
      }}>
        <div style={{
          fontSize: '12px',
          fontWeight: '300',
          color: '#5f5d5dff'
        }}>
          This Month
        </div>
        <div style={{
          fontSize: '18px',
          fontWeight: '300',
          color: '#000000ff'
        }}>
          Leads
        </div>
      </div>   
          
        <div/>
      {!showChart ? (
        <div className="chart-loading-delay">
          <div className="loading-spinner-large">⟳</div>
          <p>Loading chart...</p>
        </div>
      ) : (
        <ResponsiveBar
        data={rect.chartData}
        keys={['sales']}
        indexBy="month"
        margin={{ top: 45, right: 15, bottom: 35, left: 40 }}
        padding={0.4}
        valueScale={{ type: 'linear' }}
        indexScale={{ type: 'band', round: true }}
        colors={['#3b82f6', '#ebeb25ff', '#1d4ed8']}
        borderRadius={6}
        enableGridX={false}
        enableGridY={false}
        gridYValues={5}
        axisTop={null}
        axisRight={null}
        axisBottom={{
          tickSize: 5,
          tickPadding: 8,
          tickRotation: 0,
          legend: 'Month',
          legendPosition: 'middle',
          legendOffset: 40,
          format: value => value
        }}
        axisLeft={{
          tickSize: 5,
          tickPadding: 8,
          tickRotation: 0,
          legend: 'Leads',
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
                strokeWidth: 0.1
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
                strokeWidth: 0
              },
              text: {
                fontSize: 0,
                fill: '#e31e00ff'
              }
            }
          },
          grid: {
            line: {
              stroke: '#f3f4f6',
              strokeWidth: 0
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
              <span>Sales: {value.toLocaleString()}</span>
            </div>
          </div>
        )}
        role="application"
        ariaLabel="Sales bar chart"
        barAriaLabel={e => `${e.indexValue}: ${e.formattedValue} sales`}
        />
      )}
    </div>
  )
}

export default ChartWidget