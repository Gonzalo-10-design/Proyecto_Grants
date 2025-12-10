import { StrictMode, useState, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import AppRouter from './router'
import Login from './componentes/Login'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
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
      const response = await fetch('http://206.189.112.83:5002/api/verify-session', {
        headers: {
          'Authorization': token
        }
      });

      if (response.ok) {
        setIsAuthenticated(true);
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
    setIsAuthenticated(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-2xl text-[#0f3d28]">Cargando...</div>
      </div>
    );
  }

  return (
    <>
      {isAuthenticated ? (
        <AppRouter />
      ) : (
        <Login onLoginSuccess={handleLoginSuccess} />
      )}
    </>
  );
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)