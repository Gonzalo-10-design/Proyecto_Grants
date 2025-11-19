import { NavLink } from 'react-router-dom'; // Asegúrate de importar NavLink

function Header() {
  return (
    <header className="w-full bg-[#0f3d28] p-3 md:p-5 flex justify-center items-center border-b-4 border-[#1ea34a]">
      <div className="w-full max-w-7xl flex justify-between items-center">
        
        {/* Logo */}
        <div className="flex items-start gap-3">
          <img src={"src\\assets\\imagenes\\Logo_isateck.jpeg"} alt="Isateck Logo" className="w-[100px] h-auto" />
          <h1 className="text-white text-4xl font-extrabold tracking-wide">ISATECK</h1>
        </div>

        {/* Enlaces de navegación */}
        <nav className="flex gap-5">
          <NavLink 
            to="/" 
            className="text-white text-xl font-medium transition duration-300 hover:text-[#1ea34a]" 
            activeClassName="text-[#1ea34a]" // Estilo cuando el enlace está activo
          >
            Inicio
          </NavLink>
          <NavLink 
            to="/convocatorias" 
            className="text-white text-xl font-medium transition duration-300 hover:text-[#1ea34a]" 
            activeClassName="text-[#1ea34a]"
          >
            Convocatorias
          </NavLink>
          <NavLink 
            to="/contacto" 
            className="text-white text-xl font-medium transition duration-300 hover:text-[#1ea34a]" 
            activeClassName="text-[#1ea34a]"
          >
            Contacto
          </NavLink>
        </nav>
        
      </div>
    </header>
  );
}

export default Header;

