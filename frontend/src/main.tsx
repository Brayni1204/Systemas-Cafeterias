// frontend/src/main.tsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import { AppRouter } from './router/AppRouter.tsx' // Importamos nuestro enrutador


ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AppRouter /> {/* Usamos AppRouter aquí */}
  </React.StrictMode>,
)