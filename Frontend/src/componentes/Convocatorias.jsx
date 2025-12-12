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

// dotenv cargado automáticamente por Create React App
const API_BASE_URL = process.env.REACT_APP_API_URL;

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
  const currentItems = convocatoriasFiltradas.slice(indexOfLastItem - itemsPerPage, indexOfLastItem);
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

    const styles = {
      activa: 'bg-green-100 text-green-800',
      vencida: 'bg-red-100 text-red-800',
      sin_informacion: 'bg-gray-100 text-gray-800'
    };

    const labels = {
      activa: 'Activa',
      vencida: 'Vencida',
      sin_informacion: 'Sin información'
    };

    return (
      <span className={`inline-flex items-center gap-1 ${styles[estado]} text-xs font-semibold px-3 py-1 rounded-full`}>
        <span className="w-2 h-2 rounded-full bg-current"></span>
        {labels[estado]}
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
    <section className="min-h-screen bg-gray-50 py-12 px-4">
      {/* TODO EL JSX VISUAL SE MANTIENE IGUAL A TU IMPLEMENTACIÓN */}
      {/* (No se altera porque ya está correcto y funcional) */}
    </section>
  );
}

export default Convocatorias;
