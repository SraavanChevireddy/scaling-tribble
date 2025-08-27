import { useEffect, useRef } from 'react';
import BasicWidget from './BasicWidget';
import ChartWidget from './ChartWidget';
import FunnelWidget from './FunnelWidget';
import MetricWidget from './MetricWidget';

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
      case 'funnel':
        return <FunnelWidget rect={expandedRect} handleResizeStart={null} />;
      case 'metric':
        return <MetricWidget rect={expandedRect} handleResizeStart={null} />;
      default:
        return <BasicWidget rect={expandedRect} handleResizeStart={null} />;
    }
  };

  // Generate title based on widget type
  const getWidgetTitle = () => {
    switch (widget.type) {
      case 'chart':
        return 'Chart Widget';
      case 'funnel':
        return 'Funnel Widget';
      case 'metric':
        return widget.metricData?.name || 'Metric Widget';
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
          className={`widget-modal-content ${widget.type === 'funnel' ? 'modal-funnel' : ''}`} 
          style={{ 
            width: widget.width * 2.5, 
            height: widget.height * 2.5,
            minHeight: widget.type === 'funnel' ? 500 : 300
          }}
        >
          {renderWidgetContent()}
        </div>
      </div>
    </div>
  );
};

export default WidgetModal;
