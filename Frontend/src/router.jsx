import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom'
import Inicio from './componentes/Inicio'
import Contacto from './componentes/Contacto'
import Convocatorias from './componentes/Convocatorias'
import Login from './componentes/Login'
import Layout from './Layout/Layout'
import LayoutPublico from './Layout/LayoutPublico'

export default function AppRouter({ authState, onLoginSuccess }) {
  // Si el usuario está autenticado, usar Layout con header completo
  // Si no, usar LayoutPublico sin botón de logout
  
  return (
    <BrowserRouter>
      <Routes>
        {/* Rutas públicas - siempre accesibles */}
        <Route element={<LayoutPublico isAuthenticated={authState.isAuthenticated} />}>
          <Route path="/" element={<Inicio />} />
          <Route path="/contacto" element={<Contacto />} />
          <Route path="/login" element={
            authState.isAuthenticated ? 
            <Navigate to="/convocatorias" replace /> : 
            <Login onLoginSuccess={onLoginSuccess} />
          } />
        </Route>

        {/* Rutas protegidas - requieren autenticación */}
        <Route element={<Layout authState={authState} />}>
          <Route 
            path="/convocatorias" 
            element={<Convocatorias authState={authState} />} 
          />
        </Route>

        {/* Redirect de rutas no encontradas */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}