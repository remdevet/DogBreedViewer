import React, { useState, useEffect } from 'react'

const LoginForm = ({ onLogin, onCancel }) => {
  const [credentials, setCredentials] = useState({ username: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [rememberedUsers, setRememberedUsers] = useState([])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      // Check for demo credentials first
      if ((credentials.username === 'remember' && credentials.password === 'remember') ||
          (credentials.username === 'test' && credentials.password === 'test')) {
        // Mock user data for demo credentials
        const mockUserData = {
          id: credentials.username === 'remember' ? 1 : 2,
          username: credentials.username,
          email: `${credentials.username}@example.com`,
          firstName: credentials.username === 'remember' ? 'Remember' : 'Test',
          lastName: 'User',
          gender: 'other',
          image: 'https://via.placeholder.com/150',
          token: `mock_token_${credentials.username}_${Date.now()}`
        }
        
        // Store token and user data
        localStorage.setItem('authToken', mockUserData.token)
        localStorage.setItem('userData', JSON.stringify(mockUserData))
        saveUsername(credentials.username) // Save to remembered users
        onLogin(mockUserData)
        return
      }

      // Try real DummyJSON API for other credentials
      const response = await fetch('https://dummyjson.com/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: credentials.username,
          password: credentials.password,
        })
      })

      const data = await response.json()

      if (response.ok) {
        // Store token and user data
        localStorage.setItem('authToken', data.token)
        localStorage.setItem('userData', JSON.stringify(data))
        saveUsername(credentials.username) // Save to remembered users
        onLogin(data)
      } else {
        setError(data.message || 'Login failed')
      }
    } catch (err) {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value
    })
  }

  const handleCredentialClick = (username, password) => {
    setCredentials({ username, password })
  }

  // Load remembered users on component mount
  useEffect(() => {
    const savedUsers = localStorage.getItem('rememberedUsers')
    if (savedUsers) {
      try {
        setRememberedUsers(JSON.parse(savedUsers))
      } catch (error) {
        console.error('Error loading remembered users:', error)
      }
    }
  }, [])

  // Save username when login is successful
  const saveUsername = (username) => {
    const updatedUsers = [...rememberedUsers]
    if (!updatedUsers.includes(username)) {
      updatedUsers.unshift(username) // Add to beginning
      if (updatedUsers.length > 5) {
        updatedUsers.pop() // Keep only last 5
      }
      setRememberedUsers(updatedUsers)
      localStorage.setItem('rememberedUsers', JSON.stringify(updatedUsers))
    }
  }

  // Remove username from memory
  const removeUsername = (username, e) => {
    e.stopPropagation()
    const updatedUsers = rememberedUsers.filter(u => u !== username)
    setRememberedUsers(updatedUsers)
    localStorage.setItem('rememberedUsers', JSON.stringify(updatedUsers))
  }

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.8)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 2000
    }}>
      <div style={{
        background: 'white',
        padding: '2rem',
        borderRadius: '15px',
        boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
        width: '100%',
        maxWidth: '400px',
        margin: '1rem'
      }}>
        <h2 style={{ textAlign: 'center', marginBottom: '1.5rem', color: '#333' }}>
          Login to Dog Breed Viewer
        </h2>
        
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: '#333' }}>
              Username:
            </label>
            <input
              type="text"
              name="username"
              value={credentials.username}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '2px solid #e0e0e0',
                borderRadius: '8px',
                fontSize: '1rem',
                boxSizing: 'border-box'
              }}
              placeholder="Enter username"
            />
          </div>
          
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: '#333' }}>
              Password:
            </label>
            <input
              type="password"
              name="password"
              value={credentials.password}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '2px solid #e0e0e0',
                borderRadius: '8px',
                fontSize: '1rem',
                boxSizing: 'border-box'
              }}
              placeholder="Enter password"
            />
          </div>
          
          {error && (
            <div style={{
              color: '#e74c3c',
              background: '#fdf2f2',
              padding: '0.75rem',
              borderRadius: '8px',
              marginBottom: '1rem',
              fontSize: '0.9rem'
            }}>
              {error}
            </div>
          )}
          
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button
              type="submit"
              disabled={loading}
              style={{
                flex: 1,
                padding: '0.75rem',
                background: loading ? '#ccc' : 'linear-gradient(45deg, #667eea, #764ba2)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '1rem',
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s ease'
              }}
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
            
            <button
              type="button"
              onClick={onCancel}
              style={{
                padding: '0.75rem 1.5rem',
                background: '#f8f9fa',
                color: '#333',
                border: '2px solid #e0e0e0',
                borderRadius: '8px',
                fontSize: '1rem',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
            >
              Cancel
            </button>
          </div>
        </form>
        
        {/* Remembered Users */}
        {rememberedUsers.length > 0 && (
          <div style={{ marginTop: '1rem', fontSize: '0.8rem', color: '#666' }}>
            <p style={{ margin: '0 0 0.5rem 0', fontWeight: 'bold' }}>Recent Users:</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
              {rememberedUsers.map((username, index) => (
                <div
                  key={index}
                  onClick={() => setCredentials({ username, password: username })}
                  style={{
                    padding: '4px 8px',
                    background: credentials.username === username ? '#e3f2fd' : '#f5f5f5',
                    border: '1px solid #ddd',
                    borderRadius: '15px',
                    cursor: 'pointer',
                    fontSize: '0.7rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px'
                  }}
                >
                  <span>{username}</span>
                  <button
                    onClick={(e) => removeUsername(username, e)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#999',
                      cursor: 'pointer',
                      fontSize: '12px',
                      padding: '0',
                      marginLeft: '3px'
                    }}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div style={{ marginTop: '1rem', fontSize: '0.8rem', color: '#666', textAlign: 'center' }}>
          <p><strong>Demo credentials:</strong></p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '0.5rem' }}>
            <div
              onClick={() => handleCredentialClick('remember', 'remember')}
              style={{
                padding: '8px',
                border: '1px solid #e0e0e0',
                borderRadius: '5px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                background: credentials.username === 'remember' ? '#f0f8ff' : 'white'
              }}
              onMouseEnter={(e) => e.target.style.background = '#f8f9fa'}
              onMouseLeave={(e) => e.target.style.background = credentials.username === 'remember' ? '#f0f8ff' : 'white'}
            >
              <p style={{ margin: '2px 0', fontSize: '0.75rem' }}>
                <strong>remember</strong><br/>
                <span style={{ color: '#999' }}>remember</span>
              </p>
            </div>
            <div
              onClick={() => handleCredentialClick('test', 'test')}
              style={{
                padding: '8px',
                border: '1px solid #e0e0e0',
                borderRadius: '5px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                background: credentials.username === 'test' ? '#f0f8ff' : 'white'
              }}
              onMouseEnter={(e) => e.target.style.background = '#f8f9fa'}
              onMouseLeave={(e) => e.target.style.background = credentials.username === 'test' ? '#f0f8ff' : 'white'}
            >
              <p style={{ margin: '2px 0', fontSize: '0.75rem' }}>
                <strong>test</strong><br/>
                <span style={{ color: '#999' }}>test</span>
              </p>
            </div>
          </div>
          <p style={{ fontSize: '0.7rem', marginTop: '0.5rem', color: '#999' }}>
            Click on any credential to auto-fill
          </p>
        </div>
      </div>
    </div>
  )
}

export default LoginForm
