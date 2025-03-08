import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import './common/index.css'
import App from './common/App'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
)
