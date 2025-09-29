import React, { useState, useEffect } from 'react'
import DogBreedViewer from './components/DogBreedViewer'
import CacheStatus from './components/CacheStatus'
import LoginForm from './components/LoginForm'
import UserProfile from './components/UserProfile'

function App() {
  const [user, setUser] = useState(null)
  const [showLogin, setShowLogin] = useState(false)

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem('authToken')
    const userData = localStorage.getItem('userData')
    
    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData)
        setUser(parsedUser)
      } catch (error) {
        // Invalid user data, clear storage
        localStorage.removeItem('authToken')
        localStorage.removeItem('userData')
      }
    }
  }, [])

  const handleLogin = (userData) => {
    setUser(userData)
    setShowLogin(false)
  }

  const handleLogout = () => {
    setUser(null)
  }

  const handleShowLogin = () => {
    setShowLogin(true)
  }

  const handleCancelLogin = () => {
    setShowLogin(false)
  }

  return (
    <div className="app">
      <header className="header">
        <h1>🐕 Dog Breed Viewer</h1>
        <p>Browse dog breeds and discover beautiful images</p>
        {!user && (
          <button
            onClick={handleShowLogin}
            style={{
              marginTop: '1rem',
              padding: '0.5rem 1rem',
              background: 'linear-gradient(45deg, #667eea, #764ba2)',
              color: 'white',
              border: 'none',
              borderRadius: '25px',
              cursor: 'pointer',
              fontSize: '0.9rem'
            }}
          >
            Login
          </button>
        )}
      </header>
      
      <DogBreedViewer />
      <CacheStatus />
      
      {user && <UserProfile user={user} onLogout={handleLogout} />}
      {showLogin && <LoginForm onLogin={handleLogin} onCancel={handleCancelLogin} />}
    </div>
  )
}

export default App
