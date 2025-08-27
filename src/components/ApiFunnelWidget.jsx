/**
 * API-powered Funnel Widget Component
 * Displays real-time waiver funnel data from the API
 */

import { useState, useEffect } from 'react'
import { ResponsiveFunnel } from '@nivo/funnel'
import { useFunnelChartData } from '../hooks/useWaiverApi'

const ApiFunnelWidget = ({ rect, handleResizeStart }) => {
  const [selectedThreatLevel, setSelectedThreatLevel] = useState(null) // Start with no selection
  const [showConfig, setShowConfig] = useState(true) // Show config screen first
  const { data: funnelData, loading, error, refresh } = useFunnelChartData(selectedThreatLevel || 'critical', true)

  const threatLevelOptions = [
    { 
      value: 'critical', 
      label: 'Critical', 
      color: '#dc2626', 
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M12 9v4M12 17h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )
    },
    { 
      value: 'high', 
      label: 'High', 
      color: '#f59e0b', 
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0zM12 9v4M12 17h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )
    },
    { 
      value: 'medium', 
      label: 'Medium', 
      color: '#3b82f6', 
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M9 17V7l3 3 3-3v10M21 7l-3-3-3 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )
    },
    { 
      value: 'low', 
      label: 'Low', 
      color: '#10b981', 
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )
    }
  ]

  const currentThreatLevel = threatLevelOptions.find(option => option.value === selectedThreatLevel)

  const handleThreatLevelSelect = (level) => {
    setSelectedThreatLevel(level)
    setShowConfig(false)
  }


  return (
    <>
      <div className="chart-container">
        {showConfig ? (
          /* iOS Segmented Control */
          <div className="segmented-config">
            <h4>Select Threat Level</h4>
            <div className="segmented-control">
              {threatLevelOptions.map((option) => (
                <button
                  key={option.value}
                  className="segment-button"
                  onClick={() => handleThreatLevelSelect(option.value)}
                  style={{ color: option.color }}
                >
                  <span className="segment-icon">{option.icon}</span>
                  <span className="segment-label">{option.label}</span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          /* Funnel Chart Screen */
          <>
            <div className="funnel-title">
              <span style={{ color: currentThreatLevel?.color }}>
                {currentThreatLevel?.icon} {currentThreatLevel?.label} Waivers - Expiring
              </span>
              <div className="funnel-controls">
                {error && <span className="error-indicator" title={error}>⚠</span>}
                {loading && <span className="loading-indicator" title="Loading...">⟳</span>}
              </div>
            </div>
            
            <div className={`funnel-content ${rect.isDragging ? 'blurred' : ''}`} 
                 style={{ 
                   height: `${rect.height - 50}px`, 
                   width: `${rect.width - 20}px`, 
                   position: 'relative' 
                 }}>
              
              {loading && !funnelData.length ? (
                <div className="loading-overlay">
                  <div className="loading-spinner-large">⟳</div>
                  <p>Loading waiver data...</p>
                </div>
              ) : (
                <ResponsiveFunnel
                  key={`api-funnel-${rect.id}-${selectedThreatLevel}-${rect.forceUpdate || 0}`}
                  data={funnelData}
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
                  animate={true}
                  motionConfig="gentle"
                  tooltip={({ part }) => (
                    <div className="funnel-tooltip">
                      <strong>{part.data.label}</strong>
                      <br />
                      Count: {part.data.value.toLocaleString()}
                      <br />
                      {part.data.percentage && `${part.data.percentage}% of total`}
                    </div>
                  )}
                />
              )}
              
              {error && (
                <div className="error-overlay">
                  <div className="error-message">
                    <span>⚠</span>
                    <p>Failed to load waiver data</p>
                  </div>
                </div>
              )}
            </div>
            
          </>
        )}
      </div>
      
    </>
  )
}

export default ApiFunnelWidget