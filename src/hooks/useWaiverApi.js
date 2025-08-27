/**
 * Simple hooks for Waiver API data
 * Just fetches data from the API and provides it to widgets
 */

import { useState, useEffect, useCallback } from 'react'
import WaiverApiService from '../services/WaiverApiService.js'

/**
 * Hook for fetching dashboard metrics
 */
export const useDashboardMetrics = (autoRefresh = false) => {
  const [data, setData] = useState({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchMetrics = useCallback(async () => {
    setLoading(true)
    setError(null)
    
    try {
      const metrics = await WaiverApiService.fetchWaiverData()
      setData(metrics)
    } catch (error) {
      console.error('Failed to fetch dashboard metrics:', error)
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }, [])

  // Initial fetch
  useEffect(() => {
    fetchMetrics()
  }, [fetchMetrics])

  // Auto refresh every 5 minutes if enabled
  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(fetchMetrics, 300000)
      return () => clearInterval(interval)
    }
  }, [autoRefresh, fetchMetrics])

  return {
    data,
    loading,
    error,
    refresh: fetchMetrics
  }
}

/**
 * Hook for fetching funnel chart data with threat level selection
 */
export const useFunnelChartData = (threatLevel = 'critical', autoRefresh = false) => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchFunnelData = useCallback(async () => {
    setLoading(true)
    setError(null)
    
    try {
      const waiverData = await WaiverApiService.fetchWaiverData()
      
      // Use selected threat level data for funnel
      const threatLevelData = waiverData.threatLevelBreakdown?.[threatLevel] || {}
      
      // Calculate total waivers for selected threat level
      const totalWaivers = (threatLevelData.expiring7Days || 0) + 
                          (threatLevelData.expiring30Days || 0) + 
                          (threatLevelData.expiring90Days || 0) + 
                          (threatLevelData.expiringLater || 0) + 
                          (threatLevelData.neverExpires || 0)
      
      // Transform to funnel format showing waiver progression for selected threat level
      const funnelData = [
        { 
          id: 'total', 
          value: totalWaivers, 
          label: `Total ${threatLevel.charAt(0).toUpperCase() + threatLevel.slice(1)} Waivers` 
        },
        { 
          id: 'expiring_90', 
          value: (threatLevelData.expiring90Days || 0) + (threatLevelData.expiring30Days || 0) + (threatLevelData.expiring7Days || 0), 
          label: 'Expiring in 90 Days' 
        },
        { 
          id: 'expiring_30', 
          value: (threatLevelData.expiring30Days || 0) + (threatLevelData.expiring7Days || 0), 
          label: 'Expiring in 30 Days' 
        },
        { 
          id: 'expiring_7', 
          value: threatLevelData.expiring7Days || 0, 
          label: 'Expiring in 7 Days' 
        }
      ]
      
      setData(funnelData)
    } catch (error) {
      console.error('Failed to fetch funnel data:', error)
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }, [threatLevel])

  // Initial fetch
  useEffect(() => {
    fetchFunnelData()
  }, [fetchFunnelData])

  // Auto refresh if enabled
  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(fetchFunnelData, 300000)
      return () => clearInterval(interval)
    }
  }, [autoRefresh, fetchFunnelData])

  return {
    data,
    loading,
    error,
    refresh: fetchFunnelData
  }
}

/**
 * Hook for fetching bar chart data
 */
export const useBarChartData = (timeRange = 'monthly') => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchChartData = useCallback(async () => {
    setLoading(true)
    setError(null)
    
    try {
      const waiverData = await WaiverApiService.fetchWaiverData()
      
      // Transform to bar chart format
      const chartData = [
        { 
          month: 'Critical', 
          waivers: waiverData.criticalWaivers || 0,
          expired: Math.floor((waiverData.criticalWaivers || 0) * 0.1) // Simulate expired data
        },
        { 
          month: 'High', 
          waivers: waiverData.highRiskWaivers || 0,
          expired: Math.floor((waiverData.highRiskWaivers || 0) * 0.05)
        },
        { 
          month: 'Medium', 
          waivers: waiverData.mediumRiskWaivers || 0,
          expired: Math.floor((waiverData.mediumRiskWaivers || 0) * 0.02)
        },
        { 
          month: 'Low', 
          waivers: waiverData.lowRiskWaivers || 0,
          expired: Math.floor((waiverData.lowRiskWaivers || 0) * 0.01)
        }
      ]
      
      setData(chartData)
    } catch (error) {
      console.error('Failed to fetch chart data:', error)
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }, [timeRange])

  // Initial fetch
  useEffect(() => {
    fetchChartData()
  }, [fetchChartData])

  return {
    data,
    loading,
    error,
    refresh: fetchChartData
  }
}