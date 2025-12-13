import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Filter,
  X,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Calendar,
  MapPin,
  Building,
  Lock,
  CreditCard,
  Loader2
} from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_URL;

function Convocatorias({ authState }) {
  const navigate = useNavigate();
  const [convocatorias, setConvocatorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedConvocatoria, setSelectedConvocatoria] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  const [filtros, setFiltros] = useState({
    estado: 'todas',
    tema: '',
    busqueda: ''
  });

  const [temasDisponibles, setTemasDisponibles] = useState([]);

  useEffect(() => {
    if (!authState.isAuthenticated) {
      navigate('/login');
    }
  }, [authState.isAuthenticated, navigate]);

  if (authState.isAuthenticated && !authState.tieneAccesoPremium) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-16 px-4 animate-fadeIn">
        <div className="max-w-3xl mx-auto">
          
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden transform transition-all duration-500 hover:shadow-3xl">
            
            <div className="bg-gradient-to-r from-[#0f3d28] to-[#1ea34a] text-white p-8 text-center">
              <div className="w-20 h-20 mx-auto mb-4 bg-white bg-opacity-20 rounded-full flex items-center justify-center animate-pulse">
                <Lock size={40} />
              </div>
              <h1 className="text-3xl font-extrabold mb-2">
                Acceso Premium Requerido
              </h1>
              <p className="text-gray-200">
                Esta sección está disponible solo para usuarios premium
              </p>
            </div>

            <div className="p-8">
              <div className="space-y-6">
                
                <div>
                  <h2 className="text-2xl font-bold text-[#0f3d28] mb-4">
                    ¿Qué incluye el acceso premium?
                  </h2>
                  
                  <ul className="space-y-3">
                    {[
                      "Acceso completo al directorio actualizado de convocatorias",
                      "Filtros avanzados por tema, país y estado",
                      "Información detallada de cada oportunidad",
                      "Actualizaciones constantes de nuevas convocatorias"
                    ].map((item, idx) => (
                      <li key={idx} className="flex items-start gap-3 group">
                        <div className="w-6 h-6 bg-[#1ea34a] bg-opacity-10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 transition-all duration-300 group-hover:bg-opacity-20 group-hover:scale-110">
                          <span className="text-[#1ea34a] text-sm">✓</span>
                        </div>
                        <span className="text-gray-700 transition-colors duration-300 group-hover:text-gray-900">
                          {item}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="border-t pt-6">
                  <div className="bg-gradient-to-br from-[#0f3d28] to-[#1ea34a] text-white p-6 rounded-xl shadow-lg transform transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-2xl font-bold">Plan Básico</h3>
                        <p className="text-gray-200 text-sm mt-1">Acceso completo al directorio</p>
                      </div>
                      <div className="text-right">
                        <div className="text-3xl font-bold">9 USD</div>
                        <div className="text-sm text-gray-200">por mes</div>
                      </div>
                    </div>
                    
                    <div className="bg-white bg-opacity-15 backdrop-blur-sm rounded-lg p-4 mb-4 transition-all duration-300 hover:bg-opacity-20">
                      <div className="flex items-center gap-2 mb-2">
                        <CreditCard size={20} />
                        <span className="font-semibold">Oferta de lanzamiento</span>
                      </div>
                      <div className="text-2xl font-bold">
                        2 USD / mes
                      </div>
                      <div className="text-sm text-gray-200">
                        Primeros meses (periodo de prueba)
                      </div>
                    </div>

                    <a
                      href="/contacto"
                      className="block w-full bg-white text-[#0f3d28] text-center py-3 rounded-lg font-bold hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 active:scale-95"
                    >
                      Contáctanos para suscribirte
                    </a>
                  </div>
                </div>

                <div className="text-center text-sm text-gray-500">
                  <p>
                    Para más información sobre nuestros planes, visita{' '}
                    <a href="/" className="text-[#1ea34a] hover:underline transition-all duration-300">
                      nuestra página principal
                    </a>
                  </p>
                </div>

              </div>
            </div>

          </div>

        </div>
      </div>
    );
  }

  useEffect(() => {
    if (authState.tieneAccesoPremium) {
      fetchConvocatorias();
    }
  }, [authState.tieneAccesoPremium]);

  useEffect(() => {
    if (convocatorias.length > 0) {
      const temasSet = new Set();
      convocatorias.forEach(conv => {
        conv.temas
          .split(',')
          .map(t => t.trim())
          .forEach(tema => {
            if (
              tema &&
              !tema.toLowerCase().includes('no encontrada') &&
              !tema.toLowerCase().includes('not found')
            ) {
              temasSet.add(tema);
            }
          });
      });
      setTemasDisponibles([...temasSet].sort());
    }
  }, [convocatorias]);

  useEffect(() => {
    // Controlar overflow del body y visibilidad del header
    if (selectedConvocatoria) {
      document.body.style.overflow = 'hidden';
      // Emitir evento para ocultar el header
      window.dispatchEvent(new CustomEvent('toggleHeader', { detail: { hidden: true } }));
    } else {
      document.body.style.overflow = 'auto';
      // Emitir evento para mostrar el header
      window.dispatchEvent(new CustomEvent('toggleHeader', { detail: { hidden: false } }));
    }
  }, [selectedConvocatoria]);

  const fetchConvocatorias = async () => {
    try {
      const token = localStorage.getItem('authToken');

      const response = await fetch(`${API_BASE_URL}/api/convocatorias`, {
        headers: { Authorization: token }
      });

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem('authToken');
          localStorage.removeItem('username');
          navigate('/login');
          return;
        }
        if (response.status === 403) {
          const data = await response.json();
          setError(data.mensaje || 'Acceso denegado');
          return;
        }
        throw new Error('Error al cargar las convocatorias');
      }

      const data = await response.json();
      setConvocatorias(data);
    } catch (err) {
      setError(err.message || 'Error inesperado');
    } finally {
      setLoading(false);
    }
  };

  const determinarEstado = (conv) => {
    const fechaCierre = conv.fecha_cierre;

    if (
      !fechaCierre ||
      fechaCierre.toLowerCase().includes('no encontrada') ||
      fechaCierre.toLowerCase().includes('not found')
    ) {
      return 'sin_informacion';
    }

    const fecha = new Date(fechaCierre);
    if (isNaN(fecha.getTime())) return 'sin_informacion';

    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    return fecha >= hoy ? 'activa' : 'vencida';
  };

  const convocatoriasFiltradas = convocatorias.filter(conv => {
    const estado = determinarEstado(conv);

    if (filtros.estado !== 'todas' && filtros.estado !== estado) return false;
    if (filtros.tema && !conv.temas.toLowerCase().includes(filtros.tema.toLowerCase())) return false;
    if (filtros.busqueda) {
      const texto = [
        conv.nombre_convocatoria,
        conv.entidad_proponente,
        conv.pais,
        conv.resumen,
        conv.temas
      ].join(' ').toLowerCase();
      if (!texto.includes(filtros.busqueda.toLowerCase())) return false;
    }
    return true;
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = convocatoriasFiltradas.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(convocatoriasFiltradas.length / itemsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const limpiarFiltros = () => {
    setFiltros({ estado: 'todas', tema: '', busqueda: '' });
    setCurrentPage(1);
  };

  const getEstadoBadge = (conv) => {
    const estado = determinarEstado(conv);

    const map = {
      activa: 'bg-green-100 text-green-800 border-green-200',
      vencida: 'bg-red-100 text-red-800 border-red-200',
      sin_informacion: 'bg-gray-100 text-gray-800 border-gray-200'
    };

    const label = {
      activa: 'Activa',
      vencida: 'Vencida',
      sin_informacion: 'Sin información'
    };

    return (
      <span className={`inline-flex items-center gap-1 ${map[estado]} text-xs font-semibold px-3 py-1 rounded-full border transition-all duration-300 hover:scale-105`}>
        <span className="w-2 h-2 rounded-full bg-current animate-pulse"></span>
        {label[estado]}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen">
        <Loader2 className="h-16 w-16 text-[#1ea34a] animate-spin" />
        <p className="mt-4 text-gray-600 font-medium">Cargando convocatorias...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="bg-red-50 border-2 border-red-200 text-red-700 px-6 py-4 rounded-xl">
          <p className="font-semibold">Error: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <section className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-10 px-4 animate-fadeIn">
      <div className="max-w-7xl mx-auto">

        <div className="text-center mb-8">
          <h2 className="text-4xl font-extrabold text-[#0f3d28] mb-3">
            Oportunidades de Financiación
          </h2>
          <p className="text-lg text-gray-600">
            {convocatoriasFiltradas.length} convocatorias disponibles
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-5 mb-6 transition-all duration-300 hover:shadow-xl">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-[#0f3d28] flex items-center gap-2">
              <Filter size={18} /> Filtros
            </h3>
            <button
              onClick={limpiarFiltros}
              className="text-sm text-[#1ea34a] hover:text-[#0f3d28] flex items-center gap-1 transition-all duration-300 hover:scale-105"
            >
              <X size={16} /> Limpiar
            </button>
          </div>

          <div className="grid md:grid-cols-3 gap-3">
            <select
              value={filtros.estado}
              onChange={e => {
                setFiltros({ ...filtros, estado: e.target.value });
                setCurrentPage(1);
              }}
              className="px-4 py-2.5 border-2 border-gray-200 rounded-lg transition-all duration-300 focus:border-[#1ea34a] focus:ring-2 focus:ring-[#1ea34a] focus:ring-opacity-20"
            >
              <option value="todas">Todas</option>
              <option value="activa">Activas</option>
              <option value="vencida">Vencidas</option>
              <option value="sin_informacion">Sin información</option>
            </select>

            <input
              placeholder="Buscar por tema..."
              value={filtros.tema}
              onChange={e => {
                setFiltros({ ...filtros, tema: e.target.value });
                setCurrentPage(1);
              }}
              className="px-4 py-2.5 border-2 border-gray-200 rounded-lg transition-all duration-300 focus:border-[#1ea34a] focus:ring-2 focus:ring-[#1ea34a] focus:ring-opacity-20"
            />

            <div className="relative">
              <Search className="absolute left-3 top-3 text-gray-400" size={18} />
              <input
                placeholder="Búsqueda general..."
                value={filtros.busqueda}
                onChange={e => {
                  setFiltros({ ...filtros, busqueda: e.target.value });
                  setCurrentPage(1);
                }}
                className="w-full pl-10 pr-4 py-2.5 border-2 border-gray-200 rounded-lg transition-all duration-300 focus:border-[#1ea34a] focus:ring-2 focus:ring-[#1ea34a] focus:ring-opacity-20"
              />
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
          {currentItems.map((conv, idx) => (
            <div 
              key={idx} 
              className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 animate-fadeInUp"
              style={{ animationDelay: `${idx * 0.05}s` }}
            >
              <div className="bg-gradient-to-r from-[#0f3d28] to-[#1ea34a] text-white p-4">
                <h3 className="font-bold mb-2 line-clamp-2 min-h-[3rem]">{conv.nombre_convocatoria}</h3>
                {getEstadoBadge(conv)}
              </div>
              <div className="p-4 space-y-2 text-sm">
                <p className="flex items-center gap-2 text-gray-700">
                  <Building size={14} className="text-[#1ea34a] flex-shrink-0" /> 
                  <span className="line-clamp-1">{conv.entidad_proponente}</span>
                </p>
                <p className="flex items-center gap-2 text-gray-700">
                  <MapPin size={14} className="text-[#1ea34a] flex-shrink-0" /> 
                  <span>{conv.pais}</span>
                </p>
                <p className="flex items-center gap-2 text-gray-700">
                  <Calendar size={14} className="text-[#1ea34a] flex-shrink-0" /> 
                  <span>{conv.fecha_cierre}</span>
                </p>
                <button
                  onClick={() => setSelectedConvocatoria(conv)}
                  className="w-full mt-3 bg-[#1ea34a] hover:bg-[#168f3a] text-white py-2 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 active:scale-95"
                >
                  Ver detalle
                </button>
              </div>
            </div>
          ))}
        </div>

        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-3 mt-8">
            <button 
              disabled={currentPage === 1} 
              onClick={() => handlePageChange(currentPage - 1)}
              className="p-2 rounded-lg bg-white shadow-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-all duration-300 hover:scale-110 active:scale-95"
            >
              <ChevronLeft size={20} />
            </button>
            
            <span className="px-4 py-2 bg-white rounded-lg shadow-md font-semibold">
              {currentPage} / {totalPages}
            </span>
            
            <button 
              disabled={currentPage === totalPages} 
              onClick={() => handlePageChange(currentPage + 1)}
              className="p-2 rounded-lg bg-white shadow-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-all duration-300 hover:scale-110 active:scale-95"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        )}

        {selectedConvocatoria && (
          <div
            className="fixed inset-0 bg-white/30 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fadeIn"
            onClick={() => setSelectedConvocatoria(null)}
          >
            <div
              className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-slideUp border-2 border-gray-200"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="sticky top-0 bg-gradient-to-r from-[#0f3d28] to-[#1ea34a] text-white p-6 rounded-t-2xl z-10 shadow-lg">
                <div className="flex justify-between items-start">
                  <div className="flex-1 pr-4">
                    <h3 className="text-3xl font-bold mb-2">
                      {selectedConvocatoria.nombre_convocatoria}
                    </h3>
                    {getEstadoBadge(selectedConvocatoria)}
                  </div>
                  <button
                    onClick={() => setSelectedConvocatoria(null)}
                    className="p-2 rounded-lg hover:bg-white hover:bg-opacity-20 transition-all"
                  >
                    <X size={26} />
                  </button>
                </div>
              </div>

              {/* Contenido */}
              <div className="p-8 space-y-6">

                {/* Bloque 1: Entidad / Monto */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-gray-50 rounded-lg p-4 border-l-4 border-[#1ea34a]">
                    <h4 className="text-sm font-bold text-[#0f3d28] uppercase mb-2 flex items-center gap-2">
                      <Building size={16} />
                      Entidad Proponente
                    </h4>
                    <p className="text-gray-700">
                      {selectedConvocatoria.entidad_proponente}
                    </p>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4 border-l-4 border-[#1ea34a]">
                    <h4 className="text-sm font-bold text-[#0f3d28] uppercase mb-2 flex items-center gap-2">
                      <CreditCard size={16} />
                      Monto
                    </h4>
                    <p className="text-gray-700">
                      {selectedConvocatoria.monto}
                    </p>
                  </div>
                </div>

                {/* Bloque 2: Fechas */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="text-xs font-bold text-[#0f3d28] uppercase mb-1">
                      Apertura
                    </h4>
                    <p className="text-gray-700">
                      {selectedConvocatoria.fecha_apertura}
                    </p>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="text-xs font-bold text-[#0f3d28] uppercase mb-1">
                      Cierre
                    </h4>
                    <p className="text-gray-700">
                      {selectedConvocatoria.fecha_cierre}
                    </p>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="text-xs font-bold text-[#0f3d28] uppercase mb-1">
                      Publicación
                    </h4>
                    <p className="text-gray-700">
                      {selectedConvocatoria.fecha_publicacion}
                    </p>
                  </div>
                </div>

                {/* Bloque 3: País */}
                <div className="bg-gray-50 rounded-lg p-4 border-l-4 border-[#1ea34a]">
                  <h4 className="text-sm font-bold text-[#0f3d28] uppercase mb-2 flex items-center gap-2">
                    <MapPin size={16} />
                    País
                  </h4>
                  <p className="text-gray-700">
                    {selectedConvocatoria.pais}
                  </p>
                </div>

                {/* Bloque 4: Temas */}
                <div>
                  <h4 className="text-lg font-bold text-[#0f3d28] mb-3">
                    Temas
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedConvocatoria.temas.split(',').map((tema, idx) => (
                      <span
                        key={idx}
                        className="bg-gradient-to-r from-[#1ea34a] to-[#0f3d28] text-white px-4 py-2 rounded-full text-sm font-medium"
                      >
                        {tema.trim()}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Bloque 5: Resumen */}
                <div className="bg-gradient-to-br from-gray-50 to-white rounded-lg p-6 border border-gray-200">
                  <h4 className="text-lg font-bold text-[#0f3d28] mb-3">
                    Resumen
                  </h4>
                  <p className="text-gray-700 leading-relaxed">
                    {selectedConvocatoria.resumen}
                  </p>
                </div>

                {/* Bloque 6: Enlaces */}
                <div>
                  <h4 className="text-lg font-bold text-[#0f3d28] mb-3">
                    Enlaces oficiales
                  </h4>
                  <div className="space-y-2">
                    {selectedConvocatoria.enlaces.split(',').map((l, i) => (
                      <a
                        key={i}
                        href={l.trim()}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-2 bg-gray-50 p-3 rounded-lg text-[#1ea34a] hover:text-[#0f3d28] hover:bg-gray-100 transition-all"
                      >
                        <ExternalLink size={16} />
                        <span className="break-all">{l.trim()}</span>
                      </a>
                    ))}
                  </div>
                </div>

              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(40px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }

        .animate-fadeInUp {
          animation: fadeInUp 0.6s ease-out forwards;
          opacity: 0;
        }

        .animate-slideUp {
          animation: slideUp 0.4s ease-out forwards;
        }

        .line-clamp-1 {
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </section>
  );
}

export default Convocatorias;