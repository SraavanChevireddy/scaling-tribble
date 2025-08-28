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

  return (
    <div className="chart-container" style={{ 
      borderRadius: '12px',
      overflow: 'hidden'
    }}>
      {/* Only show info label when not in expanded view */}
      {!rect.expandedView && (
        <div className="widget-info chart-info">
          <span className="size-label">Bar Chart</span>
        </div>
      )}
      {!showChart ? (
        <div className="chart-loading-delay">
          <div className="loading-spinner-large">⟳</div>
          <p>Loading chart...</p>
        </div>
      ) : (
        <ResponsiveBar
        data={rect.chartData}
        keys={['sales', 'expenses']}
        indexBy="month"
        margin={{ top: 50, right: 60, bottom: 50, left: 60 }}
        padding={0.3}
        valueScale={{ type: 'linear' }}
        indexScale={{ type: 'band', round: true }}
        colors={['#3b82f6', '#f97316']}
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
          legend: 'Month',
          legendPosition: 'middle',
          legendOffset: 32
        }}
        axisLeft={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: 'Amount',
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
        role="application"
        ariaLabel="Bar chart"
        barAriaLabel={e => `${e.id}: ${e.formattedValue} in month: ${e.indexValue}`}
        />
      )}
    </div>
  )
}

export default ChartWidget