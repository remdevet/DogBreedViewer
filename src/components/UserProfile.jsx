import React from 'react'

const UserProfile = ({ user, onLogout }) => {
  const handleLogout = () => {
    localStorage.removeItem('authToken')
    localStorage.removeItem('userData')
    onLogout()
  }

  return (
    <div style={{
      position: 'fixed',
      top: '20px',
      right: '20px',
      background: 'rgba(255, 255, 255, 0.95)',
      border: '1px solid #ddd',
      borderRadius: '10px',
      padding: '15px',
      boxShadow: '0 8px 25px rgba(0,0,0,0.2)',
      zIndex: 1000,
      minWidth: '200px',
      backdropFilter: 'blur(10px)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
        <div style={{
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          background: 'linear-gradient(45deg, #667eea, #764ba2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontWeight: 'bold',
          marginRight: '10px'
        }}>
          {user.firstName?.charAt(0) || 'U'}
        </div>
        <div>
          <div style={{ fontWeight: 'bold', color: '#333' }}>
            {user.firstName} {user.lastName}
          </div>
          <div style={{ fontSize: '12px', color: '#666' }}>
            @{user.username}
          </div>
        </div>
      </div>
      
      <div style={{ fontSize: '12px', color: '#666', marginBottom: '10px' }}>
        <div><strong>Email:</strong> {user.email}</div>
      </div>
      
      <button
        onClick={handleLogout}
        style={{
          width: '100%',
          padding: '8px',
          background: 'linear-gradient(45deg, #ff6b6b, #ee5a24)',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          fontSize: '12px'
        }}
      >
        Logout
      </button>
    </div>
  )
}

export default UserProfile
