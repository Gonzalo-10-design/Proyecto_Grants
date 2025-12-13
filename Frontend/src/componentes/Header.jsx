import { NavLink } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { LogOut, User } from 'lucide-react';
import Grantia from '../assets/imagenes/Grantia_1.webp';

// dotenv → cargado automáticamente por Vite
const API_BASE_URL = import.meta.env.VITE_API_URL;


function Header() {
  const [username, setUsername] = useState('');

  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  const handleLogout = async () => {
    const token = localStorage.getItem('authToken');

    try {
      if (token) {
        await fetch(`${API_BASE_URL}/api/logout`, {
          method: 'POST',
          headers: {
            Authorization: token
          }
        });
      }
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    } finally {
      localStorage.removeItem('authToken');
      localStorage.removeItem('username');
      window.location.reload();
    }
  };

  return (
    <header className="w-full bg-gradient-to-r from-[#0a2f1f] via-[#0f3d28] to-[#1ea34a] shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-5 py-4">
        <div className="flex justify-between items-center">

          {/* Logo y Título */}
          <div className="flex items-center gap-4">
            <img
              src={Grantia}
              alt="Grantia Logo"
              className="w-16 h-16 rounded-lg shadow-md border-2 border-white"
            />
            <h1 className="text-white text-3xl font-extrabold tracking-tight">
              GRANTIA
            </h1>
          </div>

          {/* Navegación y Usuario */}
          <div className="flex items-center gap-8">
            <nav className="flex gap-6">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `text-white text-lg font-semibold transition-all duration-300 hover:text-gray-200 relative pb-2 ${
                    isActive
                      ? 'after:absolute after:bottom-0 after:left-0 after:w-full after:h-1 after:bg-white after:rounded-full'
                      : ''
                  }`
                }
              >
                Cómo funciona
              </NavLink>

              <NavLink
                to="/convocatorias"
                className={({ isActive }) =>
                  `text-white text-lg font-semibold transition-all duration-300 hover:text-gray-200 relative pb-2 ${
                    isActive
                      ? 'after:absolute after:bottom-0 after:left-0 after:w-full after:h-1 after:bg-white after:rounded-full'
                      : ''
                  }`
                }
              >
                Grants
              </NavLink>

              <NavLink
                to="/contacto"
                className={({ isActive }) =>
                  `text-white text-lg font-semibold transition-all duration-300 hover:text-gray-200 relative pb-2 ${
                    isActive
                      ? 'after:absolute after:bottom-0 after:left-0 after:w-full after:h-1 after:bg-white after:rounded-full'
                      : ''
                  }`
                }
              >
                Contáctenos
              </NavLink>
            </nav>

            {/* Usuario */}
            <div className="flex items-center gap-4 pl-6 border-l-2 border-white border-opacity-30">
              <div className="flex items-center gap-2 bg-black bg-opacity-10 px-4 py-2 rounded-lg backdrop-blur-sm">
                <User size={18} className="text-white" />
                <span className="text-white font-medium text-sm">
                  {username}
                </span>
              </div>

              <button
                onClick={handleLogout}
                className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-300 shadow-md hover:shadow-lg"
              >
                <LogOut size={16} />
                Cerrar Sesión
              </button>
            </div>

          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
