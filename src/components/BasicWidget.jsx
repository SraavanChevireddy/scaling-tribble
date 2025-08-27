const BasicWidget = ({ rect, handleResizeStart }) => {
  return (
    <>
      <div className="widget-info">
        <span className="size-label">{rect.size}</span>
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

export default BasicWidget