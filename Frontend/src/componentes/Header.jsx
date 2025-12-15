import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { LogOut, User, Menu, X } from 'lucide-react';
import Grantia from '../assets/imagenes/Grantia_1.webp';

const API_BASE_URL = import.meta.env.VITE_API_URL;

function Header() {
  const [username, setUsername] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isHidden, setIsHidden] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  /* ======================
     EFECTOS
  ====================== */
  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      setUsername(storedUsername);
    }

    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    const handleHeaderVisibility = (event) => {
      setIsHidden(event.detail.hidden);
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('toggleHeader', handleHeaderVisibility);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('toggleHeader', handleHeaderVisibility);
    };
  }, []);

  /* ======================
     HOME ACTION (LOGO)
  ====================== */
  const handleHomeAction = () => {
    // Si no estamos en Inicio, navegar
    if (location.pathname !== '/') {
      navigate('/');
    }

    // Siempre volver arriba
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  /* ======================
     LOGOUT
  ====================== */
  const handleLogout = async () => {
    const token = localStorage.getItem('authToken');

    try {
      if (token) {
        await fetch(`${API_BASE_URL}/api/logout`, {
          method: 'POST',
          headers: { Authorization: token }
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
    <header
      className={`w-full sticky top-0 transition-all duration-300 z-40 ${
        isHidden ? '-translate-y-full opacity-0' : 'translate-y-0 opacity-100'
      } ${
        scrolled
          ? 'bg-gradient-to-r from-[#0a2f1f] via-[#0f3d28] to-[#1ea34a] shadow-2xl'
          : 'bg-gradient-to-r from-[#0a2f1f] via-[#0f3d28] to-[#1ea34a] shadow-lg'
      }`}
    >
      <div className="max-w-7xl mx-auto px-5 py-3">
        <div className="flex justify-between items-center">

          {/* LOGO + TEXTO → HOME ACTION */}
          <div
            onClick={handleHomeAction}
            role="button"
            aria-label="Ir a inicio"
            className="flex items-center gap-3 cursor-pointer group transition-transform duration-300 hover:scale-105"
          >
            <div className="relative">
              <img
                src={Grantia}
                alt="Grantia Logo"
                className="w-14 h-14 rounded-lg shadow-md border-2 border-white transition-all duration-300 group-hover:shadow-xl group-hover:border-[#1ea34a]"
              />
              <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 rounded-lg transition-opacity duration-300" />
            </div>

            <h1 className="text-white text-2xl font-extrabold tracking-tight transition-colors duration-300 group-hover:text-gray-100">
              GRANTIA
            </h1>
          </div>

          {/* DESKTOP NAV */}
          <div className="hidden md:flex items-center gap-6">
            <nav className="flex gap-5">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `text-white text-base font-semibold transition-all duration-300 hover:text-gray-200 relative py-2 group ${
                    isActive ? 'text-gray-100' : ''
                  }`
                }
              >
                Cómo funciona
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full" />
              </NavLink>

              <NavLink
                to="/convocatorias"
                className={({ isActive }) =>
                  `text-white text-base font-semibold transition-all duration-300 hover:text-gray-200 relative py-2 group ${
                    isActive ? 'text-gray-100' : ''
                  }`
                }
              >
                Grants
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full" />
              </NavLink>

              <NavLink
                to="/contacto"
                className={({ isActive }) =>
                  `text-white text-base font-semibold transition-all duration-300 hover:text-gray-200 relative py-2 group ${
                    isActive ? 'text-gray-100' : ''
                  }`
                }
              >
                Contáctenos
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full" />
              </NavLink>
            </nav>

            {/* USUARIO */}
            <div className="flex items-center gap-3 pl-5 border-l border-white border-opacity-30">
              <div className="flex items-center gap-2 bg-white bg-opacity-15 backdrop-blur-sm px-4 py-2 rounded-lg transition-all duration-300 hover:bg-opacity-20 hover:shadow-lg">
                <div className="w-8 h-8 bg-[#1ea34a] rounded-full flex items-center justify-center shadow-md transition-transform duration-300 hover:scale-110">
                  <User size={16} className="text-white" />
                </div>
                <span className="text-black font-medium text-sm">
                  {username}
                </span>
              </div>

              <button
                onClick={handleLogout}
                className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-300 shadow-md hover:shadow-lg hover:scale-105 active:scale-95"
              >
                <LogOut size={16} />
                <span className="hidden lg:inline">Salir</span>
              </button>
            </div>
          </div>

          {/* MOBILE BUTTON */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-white p-2 rounded-lg hover:bg-white hover:bg-opacity-10 transition-all duration-300"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* MOBILE MENU */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ${
            mobileMenuOpen ? 'max-h-96 mt-4' : 'max-h-0'
          }`}
        >
          <nav className="flex flex-col gap-3 pb-4">
            <NavLink
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="text-white font-semibold py-2 px-4 rounded-lg hover:bg-white hover:bg-opacity-10 transition-all duration-300"
            >
              Cómo funciona
            </NavLink>

            <NavLink
              to="/convocatorias"
              onClick={() => setMobileMenuOpen(false)}
              className="text-white font-semibold py-2 px-4 rounded-lg hover:bg-white hover:bg-opacity-10 transition-all duration-300"
            >
              Grants
            </NavLink>

            <NavLink
              to="/contacto"
              onClick={() => setMobileMenuOpen(false)}
              className="text-white font-semibold py-2 px-4 rounded-lg hover:bg-white hover:bg-opacity-10 transition-all duration-300"
            >
              Contáctenos
            </NavLink>

            <div className="flex items-center gap-2 px-4 py-2 bg-white bg-opacity-10 rounded-lg mt-2">
              <User size={16} className="text-white" />
              <span className="text-white text-sm">{username}</span>
            </div>

            <button
              onClick={handleLogout}
              className="flex items-center justify-center gap-2 bg-red-600 text-white py-2 rounded-lg font-semibold hover:bg-red-700 transition-all duration-300"
            >
              <LogOut size={16} />
              Cerrar Sesión
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
}

export default Header;
