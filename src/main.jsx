import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css'
import './index.css'
import { DadosProvider } from './context/DadosContext.jsx'
import { SessaoProvider } from './context/SessaoContext.jsx'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HashRouter>
      <DadosProvider>
        <SessaoProvider>
          <App />
        </SessaoProvider>
      </DadosProvider>
    </HashRouter>
  </StrictMode>,
)
