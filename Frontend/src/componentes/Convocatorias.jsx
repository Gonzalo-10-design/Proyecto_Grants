import { useState, useEffect } from 'react';
import { Search, Filter, X, ChevronLeft, ChevronRight, ExternalLink, Calendar, MapPin, DollarSign, Building } from 'lucide-react';

function Convocatorias() {
  const [convocatorias, setConvocatorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedConvocatoria, setSelectedConvocatoria] = useState(null);
  
  // Paginación
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;
  
  // Estados para filtros
  const [filtros, setFiltros] = useState({
    estado: 'todas',
    tema: '',
    busqueda: ''
  });
  
  const [temasDisponibles, setTemasDisponibles] = useState([]);

  useEffect(() => {
    fetchConvocatorias();
  }, []);

  useEffect(() => {
    if (convocatorias.length > 0) {
      const temasSet = new Set();
      convocatorias.forEach(conv => {
        const temas = conv.temas.split(',').map(t => t.trim());
        temas.forEach(tema => {
          if (tema && tema !== 'Información no encontrada / Information not found') {
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
      
      const response = await fetch('http://localhost:5000/api/convocatorias', {
        headers: {
          'Authorization': token
        }
      });

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem('authToken');
          localStorage.removeItem('username');
          window.location.reload();
          return;
        }
        throw new Error('Error al cargar las convocatorias');
      }

      const data = await response.json();
      setConvocatorias(data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const determinarEstado = (convocatoria) => {
    const fechaCierre = convocatoria.fecha_cierre;
    
    if (!fechaCierre || 
        fechaCierre === 'Información no encontrada / Information not found' ||
        fechaCierre.toLowerCase().includes('no encontrada') ||
        fechaCierre.toLowerCase().includes('not found')) {
      return 'sin_informacion';
    }

    try {
      const fecha = new Date(fechaCierre);
      const hoy = new Date();
      hoy.setHours(0, 0, 0, 0);
      
      if (isNaN(fecha.getTime())) {
        return 'sin_informacion';
      }
      
      return fecha >= hoy ? 'activa' : 'vencida';
    } catch {
      return 'sin_informacion';
    }
  };

  const convocatoriasFiltradas = convocatorias.filter(conv => {
    const estado = determinarEstado(conv);
    
    // FILTRO DE ESTADO CORREGIDO
    if (filtros.estado !== 'todas') {
      if (filtros.estado !== estado) {
        return false;
      }
    }

    if (filtros.tema) {
      const temasFiltro = filtros.tema.toLowerCase();
      const temasConv = conv.temas.toLowerCase();
      if (!temasConv.includes(temasFiltro)) {
        return false;
      }
    }

    if (filtros.busqueda) {
      const busqueda = filtros.busqueda.toLowerCase();
      const campos = [
        conv.nombre_convocatoria,
        conv.entidad_proponente,
        conv.pais,
        conv.resumen,
        conv.temas
      ].join(' ').toLowerCase();
      
      if (!campos.includes(busqueda)) {
        return false;
      }
    }

    return true;
  });

  // Calcular paginación
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = convocatoriasFiltradas.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(convocatoriasFiltradas.length / itemsPerPage);

  // Calcular estadísticas de estados para mostrar al usuario
  const estadisticas = {
    activas: convocatorias.filter(c => determinarEstado(c) === 'activa').length,
    vencidas: convocatorias.filter(c => determinarEstado(c) === 'vencida').length,
    sin_informacion: convocatorias.filter(c => determinarEstado(c) === 'sin_informacion').length
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleVerDetalle = (conv) => {
    setSelectedConvocatoria(conv);
  };

  const handleCerrarDetalle = () => {
    setSelectedConvocatoria(null);
  };

  const limpiarFiltros = () => {
    setFiltros({
      estado: 'todas',
      tema: '',
      busqueda: ''
    });
    setCurrentPage(1);
  };

  const getEstadoBadge = (conv) => {
    const estado = determinarEstado(conv);
    
    const badges = {
      activa: <span className="inline-flex items-center gap-1 bg-green-100 text-green-800 text-xs font-semibold px-3 py-1 rounded-full">
        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
        Activa
      </span>,
      vencida: <span className="inline-flex items-center gap-1 bg-red-100 text-red-800 text-xs font-semibold px-3 py-1 rounded-full">
        <span className="w-2 h-2 bg-red-500 rounded-full"></span>
        Vencida
      </span>,
      sin_informacion: <span className="inline-flex items-center gap-1 bg-gray-100 text-gray-800 text-xs font-semibold px-3 py-1 rounded-full">
        <span className="w-2 h-2 bg-gray-500 rounded-full"></span>
        Sin información
      </span>
    };
    
    return badges[estado];
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-[#1ea34a] mx-auto mb-4"></div>
          <div className="text-2xl text-[#0f3d28] font-semibold">Cargando convocatorias...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="bg-red-50 border-2 border-red-200 rounded-lg p-8 text-center">
          <div className="text-2xl text-red-600 font-semibold">Error: {error}</div>
        </div>
      </div>
    );
  }

  return (
    <section className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="text-center mb-10">
          <h2 className="text-5xl font-extrabold text-[#0f3d28] mb-4">
            Oportunidades de Financiación
          </h2>
          <p className="text-xl text-gray-600">
            Explora convocatorias actualizadas de fuentes globales verificadas
          </p>
        </div>

        {/* Estadísticas de Estados */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow-md p-4 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600 uppercase">Convocatorias Activas</p>
                <p className="text-3xl font-bold text-green-600">{estadisticas.activas}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <span className="w-6 h-6 bg-green-500 rounded-full"></span>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2"> Aún puedes aplicar</p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-4 border-l-4 border-red-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600 uppercase">Convocatorias Vencidas</p>
                <p className="text-3xl font-bold text-red-600">{estadisticas.vencidas}</p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <span className="w-6 h-6 bg-red-500 rounded-full"></span>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2"> Fecha límite superada</p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-4 border-l-4 border-gray-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600 uppercase">Sin Información</p>
                <p className="text-3xl font-bold text-gray-600">{estadisticas.sin_informacion}</p>
              </div>
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                <span className="w-6 h-6 bg-gray-500 rounded-full"></span>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2"> Verificar en la fuente</p>
          </div>
        </div>

        {/* Panel de Filtros */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Filter className="text-[#1ea34a]" size={24} />
              <h3 className="text-xl font-bold text-[#0f3d28]">Filtros de Búsqueda</h3>
            </div>
            <button
              onClick={limpiarFiltros}
              className="text-sm text-[#1ea34a] hover:text-[#0f3d28] font-medium transition-colors flex items-center gap-1"
            >
              <X size={16} />
              Limpiar filtros
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Estado de la convocatoria
              </label>
              <select
                value={filtros.estado}
                onChange={(e) => {
                  setFiltros({...filtros, estado: e.target.value});
                  setCurrentPage(1);
                }}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1ea34a] focus:border-transparent transition-all"
              >
                <option value="todas">📋 Todas ({convocatorias.length})</option>
                <option value="activa">🟢 Activas ({estadisticas.activas})</option>
                <option value="vencida">🔴 Vencidas ({estadisticas.vencidas})</option>
                <option value="sin_informacion">⚪ Sin información ({estadisticas.sin_informacion})</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Tema específico
              </label>
              <input
                type="text"
                list="temas-list"
                value={filtros.tema}
                onChange={(e) => {
                  setFiltros({...filtros, tema: e.target.value});
                  setCurrentPage(1);
                }}
                placeholder="Ej: tecnología, educación..."
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1ea34a] focus:border-transparent transition-all"
              />
              <datalist id="temas-list">
                {temasDisponibles.map((tema, idx) => (
                  <option key={idx} value={tema} />
                ))}
              </datalist>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <Search className="inline mr-1" size={16} />
                Búsqueda general
              </label>
              <input
                type="text"
                value={filtros.busqueda}
                onChange={(e) => {
                  setFiltros({...filtros, busqueda: e.target.value});
                  setCurrentPage(1);
                }}
                placeholder="Buscar en todos los campos..."
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1ea34a] focus:border-transparent transition-all"
              />
            </div>
          </div>

          <div className="mt-4 text-sm font-medium text-gray-600 bg-gray-50 px-4 py-2 rounded-lg inline-block">
            Mostrando {currentItems.length} de {convocatoriasFiltradas.length} convocatorias
            {filtros.estado !== 'todas' && (
              <span className="ml-2 text-[#1ea34a]">
                • Filtrado por: {
                  filtros.estado === 'activa' ? 'Activas' :
                  filtros.estado === 'vencida' ? 'Vencidas' : 
                  'Sin información'
                }
              </span>
            )}
          </div>
        </div>

        {/* Lista de Convocatorias */}
        {convocatoriasFiltradas.length === 0 ? (
          <div className="text-center bg-white rounded-2xl shadow-lg p-12 border border-gray-200">
            <div className="text-6xl mb-4">🔍</div>
            <div className="text-2xl text-gray-600 font-semibold">
              {convocatorias.length === 0 
                ? "No hay convocatorias disponibles en este momento."
                : "No se encontraron convocatorias con los filtros aplicados."
              }
            </div>
            {filtros.estado !== 'todas' && (
              <button
                onClick={limpiarFiltros}
                className="mt-4 text-[#1ea34a] hover:text-[#0f3d28] font-medium underline"
              >
                Limpiar filtros y ver todas las convocatorias
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {currentItems.map((conv, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-200 transform hover:-translate-y-1"
                >
                  <div className="bg-gradient-to-r from-[#0f3d28] to-[#1ea34a] text-white p-4">
                    <h3 className="text-lg font-bold line-clamp-2 mb-2 min-h-[3.5rem]">
                      {conv.nombre_convocatoria}
                    </h3>
                    {getEstadoBadge(conv)}
                  </div>
                  
                  <div className="p-4 space-y-3">
                    <div className="flex items-start gap-2">
                      <Building className="text-[#1ea34a] flex-shrink-0 mt-1" size={16} />
                      <div className="min-h-[2.5rem]">
                        <span className="text-xs font-semibold text-gray-500 uppercase">Entidad</span>
                        <p className="text-sm text-gray-700 line-clamp-2">{conv.entidad_proponente}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-2">
                      <MapPin className="text-[#1ea34a] flex-shrink-0 mt-1" size={16} />
                      <div>
                        <span className="text-xs font-semibold text-gray-500 uppercase">País</span>
                        <p className="text-sm text-gray-700">{conv.pais}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-2">
                      <DollarSign className="text-[#1ea34a] flex-shrink-0 mt-1" size={16} />
                      <div className="min-h-[2.5rem]">
                        <span className="text-xs font-semibold text-gray-500 uppercase">Monto</span>
                        <p className="text-sm text-gray-700 line-clamp-2">{conv.monto}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-2">
                      <Calendar className="text-[#1ea34a] flex-shrink-0 mt-1" size={16} />
                      <div>
                        <span className="text-xs font-semibold text-gray-500 uppercase">Cierre</span>
                        <p className="text-sm text-gray-700">{conv.fecha_cierre}</p>
                      </div>
                    </div>

                    <button
                      onClick={() => handleVerDetalle(conv)}
                      className="w-full bg-[#1ea34a] text-white py-2.5 rounded-lg hover:bg-[#0f3d28] transition-colors duration-300 font-semibold text-sm flex items-center justify-center gap-2 mt-4"
                    >
                      Ver Detalle
                      <ExternalLink size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Paginación */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-8">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-4 py-2 bg-white border-2 border-gray-200 rounded-lg text-[#0f3d28] font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors flex items-center gap-2"
                >
                  <ChevronLeft size={20} />
                  Anterior
                </button>

                <div className="flex gap-2">
                  {[...Array(totalPages)].map((_, index) => {
                    const pageNumber = index + 1;
                    if (
                      pageNumber === 1 ||
                      pageNumber === totalPages ||
                      (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
                    ) {
                      return (
                        <button
                          key={pageNumber}
                          onClick={() => handlePageChange(pageNumber)}
                          className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                            currentPage === pageNumber
                              ? 'bg-[#1ea34a] text-white'
                              : 'bg-white border-2 border-gray-200 text-[#0f3d28] hover:bg-gray-50'
                          }`}
                        >
                          {pageNumber}
                        </button>
                      );
                    } else if (
                      pageNumber === currentPage - 2 ||
                      pageNumber === currentPage + 2
                    ) {
                      return <span key={pageNumber} className="px-2 py-2">...</span>;
                    }
                    return null;
                  })}
                </div>

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 bg-white border-2 border-gray-200 rounded-lg text-[#0f3d28] font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors flex items-center gap-2"
                >
                  Siguiente
                  <ChevronRight size={20} />
                </button>
              </div>
            )}
          </>
        )}

        {/* Modal de detalle */}
        {selectedConvocatoria && (
          <div className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
            <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-slideUp">
              <div className="sticky top-0 bg-gradient-to-r from-[#0f3d28] to-[#1ea34a] text-white p-6 z-10 rounded-t-2xl">
                <div className="flex justify-between items-start">
                  <div className="flex-1 pr-4">
                    <h3 className="text-3xl font-bold mb-3">
                      {selectedConvocatoria.nombre_convocatoria}
                    </h3>
                    {getEstadoBadge(selectedConvocatoria)}
                  </div>
                  <button
                    onClick={handleCerrarDetalle}
                    className="text-white hover:bg-white hover:bg-opacity-20 p-2 rounded-lg transition-colors"
                  >
                    <X size={28} />
                  </button>
                </div>
              </div>

              <div className="p-8 space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-gray-50 rounded-lg p-4 border-l-4 border-[#1ea34a]">
                    <h4 className="font-bold text-[#0f3d28] text-sm uppercase mb-2 flex items-center gap-2">
                      <Building size={16} />
                      Entidad Proponente
                    </h4>
                    <p className="text-gray-700">{selectedConvocatoria.entidad_proponente}</p>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4 border-l-4 border-[#1ea34a]">
                    <h4 className="font-bold text-[#0f3d28] text-sm uppercase mb-2 flex items-center gap-2">
                      <DollarSign size={16} />
                      Monto
                    </h4>
                    <p className="text-gray-700">{selectedConvocatoria.monto}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-bold text-[#0f3d28] text-xs uppercase mb-2">Apertura</h4>
                    <p className="text-gray-700">{selectedConvocatoria.fecha_apertura}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-bold text-[#0f3d28] text-xs uppercase mb-2">Cierre</h4>
                    <p className="text-gray-700">{selectedConvocatoria.fecha_cierre}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-bold text-[#0f3d28] text-xs uppercase mb-2">Publicación</h4>
                    <p className="text-gray-700">{selectedConvocatoria.fecha_publicacion}</p>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4 border-l-4 border-[#1ea34a]">
                  <h4 className="font-bold text-[#0f3d28] text-sm uppercase mb-2 flex items-center gap-2">
                    <MapPin size={16} />
                    País
                  </h4>
                  <p className="text-gray-700">{selectedConvocatoria.pais}</p>
                </div>

                <div>
                  <h4 className="font-bold text-[#0f3d28] text-lg mb-3">Temas</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedConvocatoria.temas.split(',').map((tema, idx) => (
                      <span key={idx} className="bg-gradient-to-r from-[#1ea34a] to-[#0f3d28] text-white px-4 py-2 rounded-full text-sm font-medium">
                        {tema.trim()}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="bg-gradient-to-br from-gray-50 to-white rounded-lg p-6 border border-gray-200">
                  <h4 className="font-bold text-[#0f3d28] text-lg mb-3">Resumen</h4>
                  <p className="text-gray-700 leading-relaxed">{selectedConvocatoria.resumen}</p>
                </div>

                <div>
                  <h4 className="font-bold text-[#0f3d28] text-lg mb-3">Enlaces</h4>
                  <div className="space-y-2">
                    {selectedConvocatoria.enlaces.split(', ').map((enlace, idx) => (
                      <a
                        key={idx}
                        href={enlace}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-[#1ea34a] hover:text-[#0f3d28] hover:underline break-all bg-gray-50 p-3 rounded-lg transition-colors"
                      >
                        <ExternalLink size={16} className="flex-shrink-0" />
                        {enlace}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
      `}</style>
    </section>
  );
}

export default Convocatorias;