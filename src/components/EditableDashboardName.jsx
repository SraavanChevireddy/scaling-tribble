import { useState, useEffect, useRef } from 'react'

const DASHBOARD_NAME_KEY = 'dashboard-name'

const EditableDashboardName = () => {
  const [dashboardName, setDashboardName] = useState('Untitled')
  const [isEditing, setIsEditing] = useState(false)
  const [tempName, setTempName] = useState('')
  const inputRef = useRef(null)

  // Load dashboard name from localStorage
  useEffect(() => {
    const savedName = localStorage.getItem(DASHBOARD_NAME_KEY)
    if (savedName) {
      setDashboardName(savedName)
    }
  }, [])

  // Save dashboard name to localStorage
  const saveName = (name) => {
    const finalName = name.trim() || 'Untitled'
    setDashboardName(finalName)
    localStorage.setItem(DASHBOARD_NAME_KEY, finalName)
  }

  // Start editing
  const handleStartEdit = () => {
    setTempName(dashboardName)
    setIsEditing(true)
  }

  // Handle input change
  const handleInputChange = (e) => {
    setTempName(e.target.value)
  }

  // Save changes
  const handleSave = () => {
    saveName(tempName)
    setIsEditing(false)
  }

  // Cancel editing
  const handleCancel = () => {
    setTempName('')
    setIsEditing(false)
  }

  // Handle key presses
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSave()
    } else if (e.key === 'Escape') {
      handleCancel()
    }
  }

  // Focus input when editing starts
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus()
      inputRef.current.select()
    }
  }, [isEditing])

  const isEmpty = dashboardName === 'Untitled'

  if (isEditing) {
    return (
      <div className="dashboard-name-container editing">
        <input
          ref={inputRef}
          type="text"
          value={tempName}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onBlur={handleSave}
          className="dashboard-name-input"
          maxLength={50}
          placeholder="Dashboard name"
        />
      </div>
    )
  }

  if (isEmpty) {
    return (
      <div className="dashboard-name-container empty" onClick={handleStartEdit}>
        <svg 
          className="edit-icon-empty" 
          width="18" 
          height="18" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2"
        >
          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
        </svg>
      </div>
    )
  }

  return (
    <div className="dashboard-name-container filled" onClick={handleStartEdit}>
      <span className="dashboard-name-text">{dashboardName}</span>
      <svg 
        className="edit-icon" 
        width="14" 
        height="14" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2"
      >
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
      </svg>
    </div>
  )
}

export default EditableDashboardName