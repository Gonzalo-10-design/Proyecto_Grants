import { NavLink, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

function Header() {
  const navigate = useNavigate();
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
      await fetch('http://localhost:5000/api/logout', {
        method: 'POST',
        headers: {
          'Authorization': token
        }
      });
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
    
    localStorage.removeItem('authToken');
    localStorage.removeItem('username');
    window.location.reload();
  };

  return (
    <header className="w-full bg-[#0f3d28] p-3 md:p-5 flex justify-center items-center border-b-4 border-[#1ea34a]">
      <div className="w-full max-w-7xl flex justify-between items-center">
        
        {/* Logo */}
        <div className="flex items-start gap-3">
          <img src={"src/assets/imagenes/Logo_isateck.jpeg"} alt="Isateck Logo" className="w-[100px] h-auto" />
          <h1 className="text-white text-4xl font-extrabold tracking-wide">ISATECK</h1>
        </div>

        {/* Enlaces de navegación y usuario */}
        <div className="flex items-center gap-5">
          <nav className="flex gap-5">
            <NavLink 
              to="/" 
              className={({ isActive }) => 
                `text-white text-xl font-medium transition duration-300 hover:text-[#1ea34a] ${isActive ? 'text-[#1ea34a]' : ''}`
              }
            >
              Inicio
            </NavLink>
            <NavLink 
              to="/convocatorias" 
              className={({ isActive }) => 
                `text-white text-xl font-medium transition duration-300 hover:text-[#1ea34a] ${isActive ? 'text-[#1ea34a]' : ''}`
              }
            >
              Convocatorias
            </NavLink>
            <NavLink 
              to="/contacto" 
              className={({ isActive }) => 
                `text-white text-xl font-medium transition duration-300 hover:text-[#1ea34a] ${isActive ? 'text-[#1ea34a]' : ''}`
              }
            >
              Contacto
            </NavLink>
          </nav>

          {/* Información del usuario */}
          <div className="flex items-center gap-3 border-l border-white pl-5">
            <span className="text-white text-sm">
              👤 {username}
            </span>
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium transition duration-300"
            >
              Cerrar Sesión
            </button>
          </div>
        </div>
        
      </div>
    </header>
  );
}

export default Header;