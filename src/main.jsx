import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// import { HashRouter } from 'react-router-dom'; // Note 1

import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
