import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './styles/index.css'
import { ProveedorUsuario } from './context/ContextoUsuario.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ProveedorUsuario>
      <App />
    </ProveedorUsuario>
  </StrictMode>,
)
