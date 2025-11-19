import { useState, useEffect } from 'react';

function Convocatorias() {
  const [convocatorias, setConvocatorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedConvocatoria, setSelectedConvocatoria] = useState(null);

  useEffect(() => {
    // Función para obtener las convocatorias del backend
    const fetchConvocatorias = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/convocatorias');
        if (!response.ok) {
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

    fetchConvocatorias();
  }, []);

  const handleVerDetalle = (conv) => {
    setSelectedConvocatoria(conv);
  };

  const handleCerrarDetalle = () => {
    setSelectedConvocatoria(null);
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

      {convocatorias.length === 0 ? (
        <div className="text-center text-xl text-gray-600">
          No hay convocatorias disponibles en este momento.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {convocatorias.map((conv, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden border-2 border-[#1ea34a]"
            >
              <div className="bg-[#0f3d28] text-white p-4">
                <h3 className="text-xl font-bold line-clamp-2">
                  {conv.nombre_convocatoria}
                </h3>
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
                <h3 className="text-2xl font-bold pr-4">
                  {selectedConvocatoria.nombre_convocatoria}
                </h3>
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
                <p className="text-gray-700">{selectedConvocatoria.temas}</p>
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