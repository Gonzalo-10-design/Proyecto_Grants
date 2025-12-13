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
  CreditCard
} from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_URL;

function Convocatorias({ authState }) {
  const navigate = useNavigate();
  const [convocatorias, setConvocatorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedConvocatoria, setSelectedConvocatoria] = useState(null);

  // Estados de UI
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  const [filtros, setFiltros] = useState({
    estado: 'todas',
    tema: '',
    busqueda: ''
  });

  const [temasDisponibles, setTemasDisponibles] = useState([]);

  // Si no está autenticado, redirigir al login
  useEffect(() => {
    if (!authState.isAuthenticated) {
      navigate('/login');
    }
  }, [authState.isAuthenticated, navigate]);

  // Si está autenticado pero no tiene acceso premium, mostrar mensaje
  if (authState.isAuthenticated && !authState.tieneAccesoPremium) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-16 px-4">
        <div className="max-w-3xl mx-auto">
          
          {/* Card de acceso restringido */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            
            {/* Header */}
            <div className="bg-gradient-to-r from-[#0f3d28] to-[#1ea34a] text-white p-8 text-center">
              <div className="w-20 h-20 mx-auto mb-4 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <Lock size={40} />
              </div>
              <h1 className="text-3xl font-extrabold mb-2">
                Acceso Premium Requerido
              </h1>
              <p className="text-gray-200">
                Esta sección está disponible solo para usuarios premium
              </p>
            </div>

            {/* Contenido */}
            <div className="p-8">
              <div className="space-y-6">
                
                <div>
                  <h2 className="text-2xl font-bold text-[#0f3d28] mb-4">
                    ¿Qué incluye el acceso premium?
                  </h2>
                  
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-[#1ea34a] bg-opacity-10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-[#1ea34a] text-sm">✓</span>
                      </div>
                      <span className="text-gray-700">
                        Acceso completo al directorio actualizado de convocatorias
                      </span>
                    </li>
                    
                    <li className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-[#1ea34a] bg-opacity-10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-[#1ea34a] text-sm">✓</span>
                      </div>
                      <span className="text-gray-700">
                        Filtros avanzados por tema, país y estado
                      </span>
                    </li>
                    
                    <li className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-[#1ea34a] bg-opacity-10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-[#1ea34a] text-sm">✓</span>
                      </div>
                      <span className="text-gray-700">
                        Información detallada de cada oportunidad
                      </span>
                    </li>
                    
                    <li className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-[#1ea34a] bg-opacity-10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-[#1ea34a] text-sm">✓</span>
                      </div>
                      <span className="text-gray-700">
                        Actualizaciones constantes de nuevas convocatorias
                      </span>
                    </li>
                  </ul>
                </div>

                <div className="border-t pt-6">
                  <div className="bg-gradient-to-br from-[#0f3d28] to-[#1ea34a] text-white p-6 rounded-xl">
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
                    
                    <div className="bg-white bg-opacity-10 rounded-lg p-4 mb-4">
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
                      className="block w-full bg-white text-[#0f3d28] text-center py-3 rounded-lg font-bold hover:bg-gray-100 transition-colors"
                    >
                      Contáctanos para suscribirte
                    </a>
                  </div>
                </div>

                <div className="text-center text-sm text-gray-500">
                  <p>
                    Para más información sobre nuestros planes, visita{' '}
                    <a href="/" className="text-[#1ea34a] hover:underline">
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

  // Si tiene acceso premium, cargar convocatorias
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

  const fetchConvocatorias = async () => {
    try {
      const token = localStorage.getItem('authToken');

      const response = await fetch(`${API_BASE_URL}/api/convocatorias`, {
        headers: {
          Authorization: token
        }
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
      activa: 'bg-green-100 text-green-800',
      vencida: 'bg-red-100 text-red-800',
      sin_informacion: 'bg-gray-100 text-gray-800'
    };

    const label = {
      activa: 'Activa',
      vencida: 'Vencida',
      sin_informacion: 'Sin información'
    };

    return (
      <span className={`inline-flex items-center gap-1 ${map[estado]} text-xs font-semibold px-3 py-1 rounded-full`}>
        <span className="w-2 h-2 rounded-full bg-current"></span>
        {label[estado]}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-[#1ea34a]" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen text-red-600 font-semibold">
        Error: {error}
      </div>
    );
  }

  return (
    <section className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4">
      <div className="max-w-7xl mx-auto">

        {/* HEADER */}
        <div className="text-center mb-10">
          <h2 className="text-5xl font-extrabold text-[#0f3d28] mb-4">
            Oportunidades de Financiación
          </h2>
          <p className="text-xl text-gray-600">
            Convocatorias globales verificadas
          </p>
        </div>

        {/* FILTROS */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-[#0f3d28] flex items-center gap-2">
              <Filter size={20} /> Filtros
            </h3>
            <button
              onClick={limpiarFiltros}
              className="text-sm text-[#1ea34a] hover:text-[#0f3d28] flex items-center gap-1"
            >
              <X size={16} /> Limpiar
            </button>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <select
              value={filtros.estado}
              onChange={e => {
                setFiltros({ ...filtros, estado: e.target.value });
                setCurrentPage(1);
              }}
              className="px-4 py-3 border-2 rounded-lg"
            >
              <option value="todas">Todas</option>
              <option value="activa">Activas</option>
              <option value="vencida">Vencidas</option>
              <option value="sin_informacion">Sin información</option>
            </select>

            <input
              placeholder="Tema"
              value={filtros.tema}
              onChange={e => {
                setFiltros({ ...filtros, tema: e.target.value });
                setCurrentPage(1);
              }}
              className="px-4 py-3 border-2 rounded-lg"
            />

            <input
              placeholder="Búsqueda"
              value={filtros.busqueda}
              onChange={e => {
                setFiltros({ ...filtros, busqueda: e.target.value });
                setCurrentPage(1);
              }}
              className="px-4 py-3 border-2 rounded-lg"
            />
          </div>
        </div>

        {/* LISTA */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {currentItems.map((conv, idx) => (
            <div key={idx} className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="bg-gradient-to-r from-[#0f3d28] to-[#1ea34a] text-white p-4">
                <h3 className="font-bold mb-2">{conv.nombre_convocatoria}</h3>
                {getEstadoBadge(conv)}
              </div>
              <div className="p-4 space-y-2 text-sm">
                <p><Building size={14} className="inline mr-1" /> {conv.entidad_proponente}</p>
                <p><MapPin size={14} className="inline mr-1" /> {conv.pais}</p>
                <p><Calendar size={14} className="inline mr-1" /> {conv.fecha_cierre}</p>
                <button
                  onClick={() => setSelectedConvocatoria(conv)}
                  className="w-full mt-3 bg-[#1ea34a] text-white py-2 rounded-lg"
                >
                  Ver detalle
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* PAGINACIÓN */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-8">
            <button disabled={currentPage === 1} onClick={() => handlePageChange(currentPage - 1)}>
              <ChevronLeft />
            </button>
            <span>{currentPage} / {totalPages}</span>
            <button disabled={currentPage === totalPages} onClick={() => handlePageChange(currentPage + 1)}>
              <ChevronRight />
            </button>
          </div>
        )}

        {/* MODAL */}
        {selectedConvocatoria && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl max-w-3xl w-full p-6 overflow-y-auto max-h-[90vh]">
              <button
                onClick={() => setSelectedConvocatoria(null)}
                className="float-right"
              >
                <X />
              </button>
              <h3 className="text-2xl font-bold mb-4">
                {selectedConvocatoria.nombre_convocatoria}
              </h3>
              <p className="mb-4">{selectedConvocatoria.resumen}</p>
              {selectedConvocatoria.enlaces.split(',').map((l, i) => (
                <a key={i} href={l.trim()} target="_blank" rel="noreferrer" className="text-[#1ea34a] block">
                  <ExternalLink size={14} className="inline mr-1" /> {l.trim()}
                </a>
              ))}
            </div>
          </div>
        )}

      </div>
    </section>
  );
}

export default Convocatorias;