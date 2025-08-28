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
        margin={{ top: 40, right: 40, bottom: 40, left: 40 }}
        padding={0.2}
        valueScale={{ type: 'linear' }}
        indexScale={{ type: 'band', round: true }}
        colors={['#3b82f6', '#f97316']}
        borderColor={{
          from: 'color',
          modifiers: [['darker', 1.6]]
        }}
        fit={true}
        axisTop={null}
        axisRight={null}
        axisBottom={{
          tickSize: 3,
          tickPadding: 3,
          tickRotation: 0,
          legend: 'Month',
          legendPosition: 'middle',
                      legendOffset: 30
        }}
        axisLeft={{
          tickSize: 3,
          tickPadding: 3,
          tickRotation: 0,
          legend: 'Amount',
          legendPosition: 'middle',
          legendOffset: -25
        }}
        enableLabel={false}
        legends={[
          {
            dataFrom: 'keys',
            anchor: 'top',
            direction: 'row',
            justify: false,
            translateX: 0,
            translateY: -15,
            itemsSpacing: 2,
            itemWidth: 60,
            itemHeight: 15,
            itemDirection: 'left-to-right',
            itemOpacity: 0.85,
            symbolSize: 10,
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