/**
 * Type definitions for Waiver Explorer API responses
 * These serve as documentation and validation schemas
 */

/**
 * Threat Level Expiration Structure (from API)
 */
export const ThreatLevelExpirationSchema = {
  expiring30Days: 'number',
  expiring7Days: 'number',
  expiring90Days: 'number',
  expiringLater: 'number',
  neverExpires: 'number'
}

/**
 * API Response structure for waiver-explorer
 */
export const WaiverExplorerResponseSchema = {
  byThreatLevel: {
    critical: 'ThreatLevelExpirationSchema',
    high: 'ThreatLevelExpirationSchema',
    medium: 'ThreatLevelExpirationSchema', 
    low: 'ThreatLevelExpirationSchema'
  }
}

/**
 * Processed waiver statistics for dashboard
 */
export const ProcessedWaiverStats = {
  totalWaivers: 'number',
  criticalWaivers: 'number',
  highRiskWaivers: 'number',
  mediumRiskWaivers: 'number',
  lowRiskWaivers: 'number',
  expiring7Days: 'number',
  expiring30Days: 'number',
  expiring90Days: 'number',
  expiringLater: 'number',
  neverExpires: 'number',
  threatLevelBreakdown: 'object'
}

/**
 * Chart data structure for waiver analytics
 */
export const WaiverChartDataSchema = {
  labels: 'array',
  datasets: 'array',
  chartType: 'string', // 'bar', 'line', 'pie', 'funnel'
  timeRange: 'string' // 'daily', 'weekly', 'monthly', 'yearly'
}

/**
 * Validation functions
 */
export const validateWaiverExplorerResponse = (response) => {
  if (typeof response !== 'object' || response === null) {
    throw new Error('Invalid API response: not an object')
  }
  
  if (!response.byThreatLevel) {
    throw new Error('Invalid API response: missing byThreatLevel field')
  }
  
  const requiredThreatLevels = ['critical', 'high', 'medium', 'low']
  const requiredExpirationFields = ['expiring30Days', 'expiring7Days', 'expiring90Days', 'expiringLater', 'neverExpires']
  
  for (const threatLevel of requiredThreatLevels) {
    if (!response.byThreatLevel[threatLevel]) {
      throw new Error(`Missing threat level: ${threatLevel}`)
    }
    
    for (const field of requiredExpirationFields) {
      if (typeof response.byThreatLevel[threatLevel][field] !== 'number') {
        throw new Error(`Invalid or missing field: ${threatLevel}.${field}`)
      }
    }
  }
  
  return true
}

/**
 * Data transformation utilities for the new API structure
 */
export const transformWaiverExplorerData = (apiResponse) => {
  validateWaiverExplorerResponse(apiResponse)
  
  const { byThreatLevel } = apiResponse
  
  // Calculate totals by threat level
  const criticalWaivers = Object.values(byThreatLevel.critical).reduce((sum, val) => sum + val, 0)
  const highRiskWaivers = Object.values(byThreatLevel.high).reduce((sum, val) => sum + val, 0)
  const mediumRiskWaivers = Object.values(byThreatLevel.medium).reduce((sum, val) => sum + val, 0)
  const lowRiskWaivers = Object.values(byThreatLevel.low).reduce((sum, val) => sum + val, 0)
  
  // Calculate totals by expiration period
  const expiring7Days = byThreatLevel.critical.expiring7Days + byThreatLevel.high.expiring7Days + 
                       byThreatLevel.medium.expiring7Days + byThreatLevel.low.expiring7Days
                       
  const expiring30Days = byThreatLevel.critical.expiring30Days + byThreatLevel.high.expiring30Days + 
                        byThreatLevel.medium.expiring30Days + byThreatLevel.low.expiring30Days
                        
  const expiring90Days = byThreatLevel.critical.expiring90Days + byThreatLevel.high.expiring90Days + 
                        byThreatLevel.medium.expiring90Days + byThreatLevel.low.expiring90Days
                        
  const expiringLater = byThreatLevel.critical.expiringLater + byThreatLevel.high.expiringLater + 
                       byThreatLevel.medium.expiringLater + byThreatLevel.low.expiringLater
                       
  const neverExpires = byThreatLevel.critical.neverExpires + byThreatLevel.high.neverExpires + 
                      byThreatLevel.medium.neverExpires + byThreatLevel.low.neverExpires
  
  const totalWaivers = criticalWaivers + highRiskWaivers + mediumRiskWaivers + lowRiskWaivers
  
  return {
    totalWaivers,
    criticalWaivers,
    highRiskWaivers,
    mediumRiskWaivers,
    lowRiskWaivers,
    expiring7Days,
    expiring30Days,
    expiring90Days,
    expiringLater,
    neverExpires,
    threatLevelBreakdown: byThreatLevel,
    // For backward compatibility
    activeWaivers: totalWaivers - neverExpires, // Assuming active means will expire
    expiringInDays: expiring30Days, // Most urgent expiring group
    approvalRate: criticalWaivers > 0 ? (criticalWaivers / totalWaivers) : 0 // Critical items need approval
  }
}

/**
 * Helper functions
 */
const isExpiringSoon = (expiryDate, daysThreshold = 30) => {
  if (!expiryDate) return false
  const expiry = new Date(expiryDate)
  const now = new Date()
  const diffTime = expiry - now
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return diffDays <= daysThreshold && diffDays > 0
}

const getStatusColor = (status) => {
  const statusColors = {
    active: '#10b981',
    expired: '#ef4444',
    pending: '#f59e0b',
    rejected: '#6b7280'
  }
  return statusColors[status] || '#6b7280'
}

const getRiskColor = (riskLevel) => {
  const riskColors = {
    high: '#ef4444',
    medium: '#f59e0b',
    low: '#10b981'
  }
  return riskColors[riskLevel] || '#6b7280'
}

const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  try {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  } catch (error) {
    return 'Invalid Date'
  }
}

const getDaysUntilExpiry = (expiryDate) => {
  if (!expiryDate) return null
  const expiry = new Date(expiryDate)
  const now = new Date()
  const diffTime = expiry - now
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return diffDays
}