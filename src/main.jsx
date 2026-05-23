import React from 'react'
import ReactDOM from 'react-dom/client'
import SharpCard from './SharpCard'

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .catch(err => console.error('SW registration failed:', err))
  })
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <SharpCard />
  </React.StrictMode>
)
