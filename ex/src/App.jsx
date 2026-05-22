// src/App.jsx
// Root component - render page chính
// Nếu sau này có routing: thêm react-router-dom vào đây

import UserPage from './pages/UserPage'

function App() {
  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
      <UserPage />
    </div>
  )
}

export default App
