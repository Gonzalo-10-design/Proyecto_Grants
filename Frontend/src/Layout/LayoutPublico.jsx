import { Outlet, NavLink } from 'react-router-dom'
import Grantia from '../assets/imagenes/Grantia_1.webp'

export default function LayoutPublico({ isAuthenticated }) {
  return (
    <>
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

            {/* Navegación */}
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

              {/* Botón de Login/Registro si no está autenticado */}
              {!isAuthenticated && (
                <NavLink
                  to="/login"
                  className="bg-white text-[#0f3d28] px-6 py-2 rounded-lg font-bold text-sm transition-all duration-300 hover:bg-gray-100 shadow-md"
                >
                  Iniciar Sesión
                </NavLink>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto py-16">
        <Outlet />
      </main>
    </>
  )
}