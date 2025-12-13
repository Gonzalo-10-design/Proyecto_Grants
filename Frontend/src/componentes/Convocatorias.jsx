import { useState, useEffect } from 'react';
import {
  Search,
  Filter,
  X,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Calendar,
  MapPin,
  DollarSign,
  Building
} from 'lucide-react';

// dotenv → cargado automáticamente por Vite
const API_BASE_URL = import.meta.env.VITE_API_URL;


function Convocatorias() {
  const [convocatorias, setConvocatorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedConvocatoria, setSelectedConvocatoria] = useState(null);

  // Paginación
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  // Filtros
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
          window.location.reload();
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

  // Paginación
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = convocatoriasFiltradas.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(convocatoriasFiltradas.length / itemsPerPage);

  const estadisticas = {
    activas: convocatorias.filter(c => determinarEstado(c) === 'activa').length,
    vencidas: convocatorias.filter(c => determinarEstado(c) === 'vencida').length,
    sin_informacion: convocatorias.filter(c => determinarEstado(c) === 'sin_informacion').length
  };

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
            <div className="bg-white rounded-xl max-w-3xl w-full p-6 overflow-y-auto">
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
                <a key={i} href={l} target="_blank" rel="noreferrer" className="text-[#1ea34a] block">
                  <ExternalLink size={14} className="inline mr-1" /> {l}
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
