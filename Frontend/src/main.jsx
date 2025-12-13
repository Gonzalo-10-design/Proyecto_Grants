import { StrictMode, useState, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import AppRouter from './router'
import Login from './componentes/Login'

const API_BASE_URL = import.meta.env.VITE_API_URL;

function App() {
  const [authState, setAuthState] = useState({
    isAuthenticated: false,
    username: null,
    estadoAcceso: null,
    tieneAccesoPremium: false
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    verifySession();
  }, []);

  const verifySession = async () => {
    const token = localStorage.getItem('authToken');

    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/verify-session`,
        {
          headers: {
            Authorization: token
          }
        }
      );

      if (response.ok) {
        const data = await response.json();
        setAuthState({
          isAuthenticated: true,
          username: data.username,
          estadoAcceso: data.estado_acceso,
          tieneAccesoPremium: data.tiene_acceso_premium
        });
      } else {
        localStorage.removeItem('authToken');
        localStorage.removeItem('username');
      }
    } catch (error) {
      console.error('Error verificando sesión:', error);
      localStorage.removeItem('authToken');
      localStorage.removeItem('username');
    } finally {
      setLoading(false);
    }
  };

  const handleLoginSuccess = () => {
    verifySession(); // Recargar estado después del login
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-2xl text-[#0f3d28]">Cargando...</div>
      </div>
    );
  }

  // IMPORTANTE: Ahora SIEMPRE mostramos el AppRouter
  // El control de acceso se hace en el componente Convocatorias
  return (
    <AppRouter 
      authState={authState}
      onLoginSuccess={handleLoginSuccess}
    />
  );
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);