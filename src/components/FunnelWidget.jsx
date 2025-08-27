import { ResponsiveFunnel } from '@nivo/funnel'

const FunnelWidget = ({ rect, handleResizeStart }) => {
  return (
    <>
      <div className="chart-container">
        <div className="funnel-title">
          <span>Expiring Waivers</span>
        </div>
        <div className={`funnel-content ${rect.isDragging ? 'blurred' : ''}`} style={{ height: `${rect.height - 50}px`, width: `${rect.width - 20}px`, position: 'relative' }}>
          <ResponsiveFunnel
            key={`funnel-${rect.id}-${rect.forceUpdate || 0}`}
            data={rect.funnelData}
            margin={{ top: 30, right: 15, bottom: 10, left: 15 }}
            valueFormat=">-.4s"
            colors={{ scheme: 'spectral' }}
            borderWidth={4}
            labelColor={{ from: 'color', modifiers: [['darker', 3]] }}
            enableAfterSeparators={false}
            enableBeforeSeparators={false}
            beforeSeparatorLength={80}
            beforeSeparatorOffset={1}
            afterSeparatorLength={80}
            afterSeparatorOffset={1}
            currentPartSizeExtension={0}
            currentBorderWidth={6}
            shapeBlending={0.66}
            fillOpacity={0.85}
          />
        </div>
      </div>
      <div className="resize-handles">
        <div 
          className="resize-handle resize-handle-se"
          onMouseDown={(e) => handleResizeStart(e, rect.id)}
        />
      </div>
    </>
  )
}

export default FunnelWidget