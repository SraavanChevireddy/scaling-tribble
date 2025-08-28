import { useEffect, useRef } from 'react';
import BasicWidget from './BasicWidget';
import ChartWidget from './ChartWidget';
import FunnelWidget from './FunnelWidget';
import MetricWidget from './MetricWidget';
import ApiChartWidget from './ApiChartWidget';
import ApiFunnelWidget from './ApiFunnelWidget';
import ApiMetricWidget from './ApiMetricWidget';
import ApiTrendsWidget from './ApiTrendsWidget';

const WidgetModal = ({ widget, onClose }) => {
  const modalRef = useRef(null);
  
  // Close on escape key
  useEffect(() => {
    const handleEscKey = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    
    window.addEventListener('keydown', handleEscKey);
    return () => {
      window.removeEventListener('keydown', handleEscKey);
    };
  }, [onClose]);
  
  // Close when clicking outside the modal content
  const handleBackdropClick = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      onClose();
    }
  };
  
  // Render the appropriate widget content
  const renderWidgetContent = () => {
    // Calculate scaled dimensions based on original widget size
    // Use a multiplier to scale up the widget proportionally
    const scaleFactor = 2.5;
    
    const expandedRect = {
      ...widget,
      width: widget.width * scaleFactor,
      height: widget.height * scaleFactor,
      expandedView: true
    };
    
    switch (widget.type) {
      case 'chart':
        return <ChartWidget rect={expandedRect} />;
      case 'api-chart':
        return <ApiChartWidget rect={expandedRect} timeRange={widget.timeRange} />;
      case 'funnel':
        return <FunnelWidget rect={expandedRect} handleResizeStart={null} />;
      case 'api-funnel':
        return <ApiFunnelWidget rect={expandedRect} handleResizeStart={null} />;
      case 'metric':
        return <MetricWidget rect={expandedRect} handleResizeStart={null} />;
      case 'api-metric':
        return <ApiMetricWidget rect={expandedRect} handleResizeStart={null} metricType={widget.metricType} />;
      case 'api-trends':
        return <ApiTrendsWidget rect={expandedRect} handleResizeStart={null} trendType={widget.trendType} />;
      default:
        return <BasicWidget rect={expandedRect} handleResizeStart={null} />;
    }
  };

  // Generate title based on widget type
  const getWidgetTitle = () => {
    switch (widget.type) {
      case 'chart':
        return 'Chart Widget';
      case 'api-chart':
        return 'Live Chart Widget';
      case 'funnel':
        return 'Funnel Widget';
      case 'api-funnel':
        return 'Live Funnel Widget';
      case 'metric':
        return widget.metricData?.name || 'Metric Widget';
      case 'api-metric':
        return 'Live Metric Widget';
      case 'api-trends':
        return 'Live Trends Widget';
      default:
        return `Widget (${widget.size})`;
    }
  };

  return (
    <div className="widget-modal-backdrop" onClick={handleBackdropClick}>
      <div className="widget-modal" ref={modalRef}>
        <div className="widget-modal-header">
          <h3 className="widget-modal-title">{getWidgetTitle()}</h3>
          <button className="widget-modal-close" onClick={onClose}>×</button>
        </div>
        <div 
          className={`widget-modal-content ${
            widget.type === 'funnel' || widget.type === 'api-funnel' ? 'modal-funnel' : ''
          } ${
            widget.type === 'chart' || widget.type === 'api-chart' ? 'modal-chart' : ''
          }`} 
          style={{ 
            width: widget.width * 2.5, 
            height: widget.height * 2.5,
            minHeight: (widget.type === 'funnel' || widget.type === 'api-funnel') ? 500 : 
                       (widget.type === 'chart' || widget.type === 'api-chart') ? 400 : 300
          }}
        >
          {renderWidgetContent()}
        </div>
      </div>
    </div>
  );
};

export default WidgetModal;
