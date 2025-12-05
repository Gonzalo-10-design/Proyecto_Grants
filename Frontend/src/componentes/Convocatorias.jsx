import { useState, useEffect } from 'react';

function Convocatorias() {
  const [convocatorias, setConvocatorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedConvocatoria, setSelectedConvocatoria] = useState(null);
  
  // Estados para filtros
  const [filtros, setFiltros] = useState({
    estado: 'todas', // 'todas', 'activas', 'vencidas', 'sin_informacion'
    tema: '',
    busqueda: ''
  });
  
  const [temasDisponibles, setTemasDisponibles] = useState([]);

  useEffect(() => {
    fetchConvocatorias();
  }, []);

  useEffect(() => {
    // Extraer temas únicos de las convocatorias
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
    
    // Verificar si es "Sin información"
    if (!fechaCierre || 
        fechaCierre === 'Información no encontrada / Information not found' ||
        fechaCierre.toLowerCase().includes('no encontrada')) {
      return 'sin_informacion';
    }

    // Intentar parsear la fecha
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
    
    // Filtro por estado
    if (filtros.estado !== 'todas' && estado !== filtros.estado) {
      return false;
    }

    // Filtro por tema
    if (filtros.tema) {
      const temasFiltro = filtros.tema.toLowerCase();
      const temasConv = conv.temas.toLowerCase();
      if (!temasConv.includes(temasFiltro)) {
        return false;
      }
    }

    // Filtro por búsqueda general
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
  };

  const getEstadoBadge = (conv) => {
    const estado = determinarEstado(conv);
    
    const badges = {
      activa: <span className="bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-0.5 rounded">
        🟢 Activa
      </span>,
      vencida: <span className="bg-red-100 text-red-800 text-xs font-semibold px-2.5 py-0.5 rounded">
        🔴 Vencida
      </span>,
      sin_informacion: <span className="bg-gray-100 text-gray-800 text-xs font-semibold px-2.5 py-0.5 rounded">
        ⚪ Sin información
      </span>
    };
    
    return badges[estado];
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-2xl text-[#0f3d28]">Cargando convocatorias...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-2xl text-red-600">Error: {error}</div>
      </div>
    );
  }

  return (
    <section className="container mx-auto px-4 py-8">
      <h2 className="text-4xl font-bold text-[#0f3d28] mb-8 text-center">
        Convocatorias Disponibles
      </h2>

      {/* Panel de Filtros */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-[#0f3d28]">🔍 Filtros de Búsqueda</h3>
          <button
            onClick={limpiarFiltros}
            className="text-sm text-[#1ea34a] hover:underline"
          >
            Limpiar filtros
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Filtro por Estado */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Estado de la convocatoria
            </label>
            <select
              value={filtros.estado}
              onChange={(e) => setFiltros({...filtros, estado: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1ea34a]"
            >
              <option value="todas">Todas</option>
              <option value="activas">🟢 Activas</option>
              <option value="vencidas">🔴 Vencidas</option>
              <option value="sin_informacion">⚪ Sin información</option>
            </select>
          </div>

          {/* Filtro por Tema */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tema específico
            </label>
            <input
              type="text"
              list="temas-list"
              value={filtros.tema}
              onChange={(e) => setFiltros({...filtros, tema: e.target.value})}
              placeholder="Ej: tecnología, educación..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1ea34a]"
            />
            <datalist id="temas-list">
              {temasDisponibles.map((tema, idx) => (
                <option key={idx} value={tema} />
              ))}
            </datalist>
          </div>

          {/* Búsqueda general */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Búsqueda general
            </label>
            <input
              type="text"
              value={filtros.busqueda}
              onChange={(e) => setFiltros({...filtros, busqueda: e.target.value})}
              placeholder="Buscar en todos los campos..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1ea34a]"
            />
          </div>
        </div>

        {/* Contador de resultados */}
        <div className="mt-4 text-sm text-gray-600">
          Mostrando {convocatoriasFiltradas.length} de {convocatorias.length} convocatorias
        </div>
      </div>

      {/* Lista de Convocatorias */}
      {convocatoriasFiltradas.length === 0 ? (
        <div className="text-center text-xl text-gray-600 py-12">
          {convocatorias.length === 0 
            ? "No hay convocatorias disponibles en este momento."
            : "No se encontraron convocatorias con los filtros aplicados."
          }
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {convocatoriasFiltradas.map((conv, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden border-2 border-[#1ea34a]"
            >
              <div className="bg-[#0f3d28] text-white p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-bold line-clamp-2 flex-1">
                    {conv.nombre_convocatoria}
                  </h3>
                </div>
                {getEstadoBadge(conv)}
              </div>
              
              <div className="p-4 space-y-3">
                <div>
                  <span className="font-semibold text-[#0f3d28]">Entidad:</span>
                  <p className="text-gray-700">{conv.entidad_proponente}</p>
                </div>

                <div>
                  <span className="font-semibold text-[#0f3d28]">País:</span>
                  <p className="text-gray-700">{conv.pais}</p>
                </div>

                <div>
                  <span className="font-semibold text-[#0f3d28]">Monto:</span>
                  <p className="text-gray-700">{conv.monto}</p>
                </div>

                <div>
                  <span className="font-semibold text-[#0f3d28]">Fecha de cierre:</span>
                  <p className="text-gray-700">{conv.fecha_cierre}</p>
                </div>

                <div>
                  <span className="font-semibold text-[#0f3d28]">Resumen:</span>
                  <p className="text-gray-700 text-sm line-clamp-3">{conv.resumen}</p>
                </div>

                <button
                  onClick={() => handleVerDetalle(conv)}
                  className="w-full bg-[#1ea34a] text-white py-2 rounded-md hover:bg-[#0f3d28] transition-colors duration-300 font-semibold"
                >
                  Ver Detalle
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal de detalle */}
      {selectedConvocatoria && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="bg-[#0f3d28] text-white p-6 sticky top-0">
              <div className="flex justify-between items-start">
                <div className="flex-1 pr-4">
                  <h3 className="text-2xl font-bold mb-2">
                    {selectedConvocatoria.nombre_convocatoria}
                  </h3>
                  {getEstadoBadge(selectedConvocatoria)}
                </div>
                <button
                  onClick={handleCerrarDetalle}
                  className="text-white hover:text-[#1ea34a] text-3xl font-bold"
                >
                  ×
                </button>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <h4 className="font-bold text-[#0f3d28] text-lg">Entidad Proponente</h4>
                <p className="text-gray-700">{selectedConvocatoria.entidad_proponente}</p>
              </div>

              <div>
                <h4 className="font-bold text-[#0f3d28] text-lg">Monto</h4>
                <p className="text-gray-700">{selectedConvocatoria.monto}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <h4 className="font-bold text-[#0f3d28]">Fecha Apertura</h4>
                  <p className="text-gray-700">{selectedConvocatoria.fecha_apertura}</p>
                </div>
                <div>
                  <h4 className="font-bold text-[#0f3d28]">Fecha Cierre</h4>
                  <p className="text-gray-700">{selectedConvocatoria.fecha_cierre}</p>
                </div>
                <div>
                  <h4 className="font-bold text-[#0f3d28]">Fecha Publicación</h4>
                  <p className="text-gray-700">{selectedConvocatoria.fecha_publicacion}</p>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-[#0f3d28] text-lg">País</h4>
                <p className="text-gray-700">{selectedConvocatoria.pais}</p>
              </div>

              <div>
                <h4 className="font-bold text-[#0f3d28] text-lg">Temas</h4>
                <div className="flex flex-wrap gap-2 mt-2">
                  {selectedConvocatoria.temas.split(',').map((tema, idx) => (
                    <span key={idx} className="bg-[#1ea34a] text-white px-3 py-1 rounded-full text-sm">
                      {tema.trim()}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-bold text-[#0f3d28] text-lg">Resumen</h4>
                <p className="text-gray-700">{selectedConvocatoria.resumen}</p>
              </div>

              <div>
                <h4 className="font-bold text-[#0f3d28] text-lg">Enlaces</h4>
                <div className="space-y-2">
                  {selectedConvocatoria.enlaces.split(', ').map((enlace, idx) => (
                    <a
                      key={idx}
                      href={enlace}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-[#1ea34a] hover:underline break-all"
                    >
                      {enlace}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default Convocatorias;