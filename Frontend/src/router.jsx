import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom'
import ScrollToTop from './componentes/ScrollToTop'

import Inicio from './componentes/Inicio'
import Contacto from './componentes/Contacto'
import Convocatorias from './componentes/Convocatorias'
import Login from './componentes/Login'
import Layout from './Layout/Layout'
import LayoutPublico from './Layout/LayoutPublico'
import PageTransition from './componentes/PageTransition'

export default function AppRouter({ authState, onLoginSuccess }) {
  return (
    <BrowserRouter>
      {/*  CONTROL GLOBAL DE SCROLL */}
      <ScrollToTop />

      <Routes>
        {/* Rutas públicas */}
        <Route element={<LayoutPublico isAuthenticated={authState.isAuthenticated} />}>
          <Route path="/" element={<Inicio />} />
          <Route path="/contacto" element={<Contacto />} />
          <Route
            path="/login"
            element={
              authState.isAuthenticated
                ? <Navigate to="/convocatorias" replace />
                : <Login onLoginSuccess={onLoginSuccess} />
            }
          />
        </Route>

        {/* Rutas protegidas */}
        <Route element={<Layout authState={authState} />}>
          <Route
            path="/convocatorias"
            element={
              <PageTransition>
                <Convocatorias authState={authState} />
              </PageTransition>
            }
          />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
