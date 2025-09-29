import React, { useState, useEffect } from 'react'
import apiClient from '../utils/apiClient'

const CacheStatus = () => {
  const [cacheStats, setCacheStats] = useState({ size: 0, keys: [] })
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const updateStats = () => {
      setCacheStats(apiClient.getCacheStats())
    }

    // Update stats every 5 seconds
    const interval = setInterval(updateStats, 5000)
    updateStats() // Initial update

    return () => clearInterval(interval)
  }, [])

  const clearCache = () => {
    apiClient.clearCache()
    setCacheStats({ size: 0, keys: [] })
  }

  if (!isVisible) {
    return (
      <button
        onClick={() => setIsVisible(true)}
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          background: 'rgba(102, 126, 234, 0.9)',
          color: 'white',
          border: 'none',
          borderRadius: '50%',
          width: '50px',
          height: '50px',
          cursor: 'pointer',
          fontSize: '20px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
          zIndex: 1000
        }}
        title="Cache Status"
      >
        📊
      </button>
    )
  }

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        background: 'rgba(255, 255, 255, 0.95)',
        border: '1px solid #ddd',
        borderRadius: '10px',
        padding: '15px',
        boxShadow: '0 8px 25px rgba(0,0,0,0.2)',
        zIndex: 1000,
        minWidth: '250px',
        backdropFilter: 'blur(10px)'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
        <h4 style={{ margin: 0, color: '#333' }}>Cache Status</h4>
        <button
          onClick={() => setIsVisible(false)}
          style={{
            background: 'none',
            border: 'none',
            fontSize: '18px',
            cursor: 'pointer',
            color: '#666'
          }}
        >
          ×
        </button>
      </div>
      
      <div style={{ marginBottom: '10px' }}>
        <div style={{ color: '#666', fontSize: '14px' }}>
          <strong>Cached Items:</strong> {cacheStats.size}
        </div>
        <div style={{ color: '#666', fontSize: '12px', marginTop: '5px' }}>
          {cacheStats.keys.length > 0 && (
            <div>
              <strong>Keys:</strong>
              <ul style={{ margin: '5px 0', paddingLeft: '15px' }}>
                {cacheStats.keys.slice(0, 3).map((key, index) => (
                  <li key={index} style={{ fontSize: '11px' }}>
                    {key.replace('api_', '').substring(0, 30)}...
                  </li>
                ))}
                {cacheStats.keys.length > 3 && (
                  <li style={{ fontSize: '11px', color: '#999' }}>
                    +{cacheStats.keys.length - 3} more...
                  </li>
                )}
              </ul>
            </div>
          )}
        </div>
      </div>
      
      <button
        onClick={clearCache}
        style={{
          background: 'linear-gradient(45deg, #ff6b6b, #ee5a24)',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          padding: '8px 12px',
          cursor: 'pointer',
          fontSize: '12px',
          width: '100%'
        }}
      >
        Clear Cache
      </button>
    </div>
  )
}

export default CacheStatus
