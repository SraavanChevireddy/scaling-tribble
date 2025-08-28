/**
 * Simple API service for waiver data
 * Just fetches and transforms data for widgets
 */

import { transformWaiverExplorerData } from '../types/WaiverTypes.js'

class WaiverApiService {
  constructor() {
    this.baseUrl = '/api'  // Use Vite proxy instead of direct URL
    this.cache = new Map()
    this.cacheTimeout = 5 * 60 * 1000 // 5 minutes
  }

  /**
   * Fetch waiver trends data from API
   */
  async fetchWaiverTrends() {
    try {
      const cacheKey = 'waiver_trends'
      const cached = this.getFromCache(cacheKey)
      if (cached) {
        console.log('Using cached trends data:', cached)
        return cached
      }

      console.log('Fetching trends from API:', 'http://localhost:5001/waiver-trends')
      const response = await fetch('http://localhost:5001/waiver-trends')
      
      if (!response.ok) {
        throw new Error(`Trends API Error: ${response.status}`)
      }

      const apiData = await response.json()
      console.log('Raw trends API response:', apiData)
      
      // Transform the trends data for widget consumption
      const transformedTrends = {
        expiring7Days: {
          changePercentage: apiData.trends?.changePercentage?.expiring7Days || 0,
          previousMonth: apiData.trends?.previousMonth?.expiring7Days || 0
        },
        expiring30Days: {
          changePercentage: apiData.trends?.changePercentage?.expiring30Days || 0,
          previousMonth: apiData.trends?.previousMonth?.expiring30Days || 0
        },
        expiring90Days: {
          changePercentage: apiData.trends?.changePercentage?.expiring90Days || 0,
          previousMonth: apiData.trends?.previousMonth?.expiring90Days || 0
        },
        expiringLater: {
          changePercentage: apiData.trends?.changePercentage?.expiringLater || 0,
          previousMonth: apiData.trends?.previousMonth?.expiringLater || 0
        },
        neverExpires: {
          changePercentage: apiData.trends?.changePercentage?.neverExpires || 0,
          previousMonth: apiData.trends?.previousMonth?.neverExpires || 0
        }
      }
      
      console.log('Transformed trends data:', transformedTrends)
      
      // Cache the result
      this.setCache(cacheKey, transformedTrends)
      
      return transformedTrends

    } catch (error) {
      console.error('Failed to fetch waiver trends:', error)
      console.log('Using fallback trends data')
      // Return fallback data
      return this.getFallbackTrendsData()
    }
  }

  /**
   * Fetch waiver data from API
   */
  async fetchWaiverData() {
    try {
      const cacheKey = 'waiver_data'
      const cached = this.getFromCache(cacheKey)
      if (cached) {
        console.log('Using cached data:', cached)
        return cached
      }

      console.log('Fetching from API:', `${this.baseUrl}/waiver-explorer`)
      const response = await fetch(`${this.baseUrl}/waiver-explorer`)
      
      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`)
      }

      const apiData = await response.json()
      console.log('Raw API response:', apiData)
      
      // Transform the API data using our type definitions
      const transformedData = transformWaiverExplorerData(apiData)
      console.log('Transformed data:', transformedData)
      
      // Cache the result
      this.setCache(cacheKey, transformedData)
      
      return transformedData

    } catch (error) {
      console.error('Failed to fetch waiver data:', error)
      console.log('Using fallback data')
      // Return fallback data
      return this.getFallbackData()
    }
  }

  /**
   * Get fallback data when API is unavailable
   */
  getFallbackData() {
    return {
      totalWaivers: 0,
      criticalWaivers: 0,
      highRiskWaivers: 0,
      mediumRiskWaivers: 0,
      lowRiskWaivers: 0,
      expiring7Days: 0,
      expiring30Days: 0,
      expiring90Days: 0,
      expiringLater: 0,
      neverExpires: 0,
      threatLevelBreakdown: {
        critical: { expiring7Days: 0, expiring30Days: 0, expiring90Days: 0, expiringLater: 0, neverExpires: 0 },
        high: { expiring7Days: 0, expiring30Days: 0, expiring90Days: 0, expiringLater: 0, neverExpires: 0 },
        medium: { expiring7Days: 0, expiring30Days: 0, expiring90Days: 0, expiringLater: 0, neverExpires: 0 },
        low: { expiring7Days: 0, expiring30Days: 0, expiring90Days: 0, expiringLater: 0, neverExpires: 0 }
      }
    }
  }

  /**
   * Get fallback trends data when API is unavailable
   */
  getFallbackTrendsData() {
    return {
      expiring7Days: { changePercentage: 22.7, previousMonth: 22 },
      expiring30Days: { changePercentage: 10.4, previousMonth: 48 },
      expiring90Days: { changePercentage: 8.5, previousMonth: 82 },
      expiringLater: { changePercentage: 6.3, previousMonth: 95 },
      neverExpires: { changePercentage: 10.5, previousMonth: 38 }
    }
  }

  /**
   * Simple cache methods
   */
  getFromCache(key) {
    const cached = this.cache.get(key)
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.data
    }
    this.cache.delete(key)
    return null
  }

  setCache(key, data) {
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    })
  }

  clearCache() {
    this.cache.clear()
  }
}

// Export singleton instance
export default new WaiverApiService()