import { ArrowRight, Target, TrendingUp, Clock, Globe, CheckCircle, Search, RefreshCw, Folder, Lightbulb, Brain, FileText, Bell, ClipboardCheck, Workflow } from 'lucide-react';

export default function Inicio() {
  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#0a2f1f] via-[#0f3d28] to-[#1ea34a] text-white py-20 px-4">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-[#1ea34a] rounded-full filter blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#0f3d28] rounded-full filter blur-3xl"></div>
        </div>

        <div className="max-w-6xl mx-auto relative z-10 text-center">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-6 leading-tight">
            GRANTIA
            <span className="block text-[#1ea34a] mt-2">
              Búsqueda de recursos para tus proyectos
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-200 max-w-4xl mx-auto leading-relaxed">
            Hoy, puedes explorar un directorio con oportunidades de financiación disponibles en Latinoamérica, Europa y Estados Unidos.
          </p>

          <p className="text-xl md:text-2xl text-gray-200 max-w-4xl mx-auto leading-relaxed mt-4">
            En el futuro, GRANTIA conectará lo que quieres lograr con las convocatorias correctas, para que tus ideas se conviertan en proyectos reales: sociales, ambientales, científicos o tecnológicos.
          </p>

          <div className="flex justify-center gap-4 mt-10">
            <a
              href="/convocatorias"
              className="inline-flex items-center gap-2 bg-[#1ea34a] hover:bg-[#168f3a] text-white px-8 py-4 rounded-lg font-bold text-lg transition-all transform hover:scale-105 shadow-lg"
            >
              Explorar Oportunidades
              <ArrowRight size={20} />
            </a>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-[#1ea34a] bg-opacity-10 rounded-full mb-4">
                <Globe className="text-[#1ea34a]" size={32} />
              </div>
              <h3 className="text-4xl font-bold text-[#0f3d28] mb-2">30+</h3>
              <p className="text-gray-600">Fuentes Globales</p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-[#1ea34a] bg-opacity-10 rounded-full mb-4">
                <Clock className="text-[#1ea34a]" size={32} />
              </div>
              <h3 className="text-4xl font-bold text-[#0f3d28] mb-2">24/7</h3>
              <p className="text-gray-600">Monitorización Continua</p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-[#1ea34a] bg-opacity-10 rounded-full mb-4">
                <TrendingUp className="text-[#1ea34a]" size={32} />
              </div>
              <h3 className="text-4xl font-bold text-[#0f3d28] mb-2">100%</h3>
              <p className="text-gray-600">Datos Verificados</p>
            </div>

          </div>
        </div>
      </section>

      {/* Pricing Cards Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            
            {/* Plan Básico */}
            <div className="bg-white rounded-3xl shadow-xl p-8 border-2 border-gray-200 hover:shadow-2xl transition-shadow">
              <div className="text-center mb-8">
                <h2 className="text-4xl font-bold text-[#0f3d28] mb-3">Plan Básico</h2>
                <p className="text-gray-600 text-lg">Disponible ahora</p>
              </div>

              <div className="space-y-5 mb-8">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 mt-1">
                    <Search className="text-[#1ea34a]" size={28} />
                  </div>
                  <p className="text-gray-700 text-base leading-relaxed">
                    Consulta de grants actuales para tu organización
                  </p>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 mt-1">
                    <RefreshCw className="text-[#1ea34a]" size={28} />
                  </div>
                  <p className="text-gray-700 text-base leading-relaxed">
                    Actualización constante del directorio
                  </p>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 mt-1">
                    <Folder className="text-[#1ea34a]" size={28} />
                  </div>
                  <p className="text-gray-700 text-base leading-relaxed">
                    Acceso total al directorio de oportunidades
                  </p>
                </div>
              </div>

              <div className="text-center mb-8">
                <div className="text-5xl font-bold text-[#0f3d28] mb-2">
                  9 USD <span className="text-2xl font-semibold">/ mes</span>
                </div>
                <p className="text-gray-600 mt-3">
                  Oferta de lanzamiento: <span className="font-semibold text-[#1ea34a]">2 USD</span>
                </p>
                <p className="text-gray-600">primeros meses (prueba)</p>
              </div>

              <a
                href=""
                className="block w-full bg-gradient-to-r from-[#0a2f1f] via-[#0f3d28] to-[#1ea34a] hover:from-[#0f3d28] hover:to-[#168f3a] text-white text-center py-4 rounded-xl font-bold text-lg transition-all transform hover:scale-105 shadow-lg"
              >
                Crear cuenta
              </a>
            </div>

            {/* Plan Avanzado */}
            <div className="bg-white rounded-3xl shadow-xl p-8 border-2 border-gray-300 relative opacity-95">
              <div className="text-center mb-8">
                <h2 className="text-4xl font-bold text-[#0f3d28] mb-3">Plan Avanzado</h2>
                <p className="text-gray-500 text-lg">En construcción — próximamente</p>
              </div>

              <div className="space-y-5 mb-8">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 mt-1">
                    <Lightbulb className="text-gray-400" size={28} />
                  </div>
                  <p className="text-gray-600 text-base leading-relaxed">
                    Creación estructurada de proyectos
                  </p>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 mt-1">
                    <Brain className="text-gray-400" size={28} />
                  </div>
                  <p className="text-gray-600 text-base leading-relaxed">
                    Matching inteligente entre tus objetivos y grants
                  </p>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 mt-1">
                    <FileText className="text-gray-400" size={28} />
                  </div>
                  <p className="text-gray-600 text-base leading-relaxed">
                    Recomendaciones personalizadas (IA)
                  </p>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 mt-1">
                    <Bell className="text-gray-400" size={28} />
                  </div>
                  <p className="text-gray-600 text-base leading-relaxed">
                    Alertas avanzadas
                  </p>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 mt-1">
                    <ClipboardCheck className="text-gray-400" size={28} />
                  </div>
                  <p className="text-gray-600 text-base leading-relaxed">
                    Evaluación preliminar de elegibilidad
                  </p>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 mt-1">
                    <Workflow className="text-gray-400" size={28} />
                  </div>
                  <p className="text-gray-600 text-base leading-relaxed">
                    Flujo guiado para preparar solicitudes
                  </p>
                </div>
              </div>

              <div className="text-center mb-8">
                <div className="text-4xl font-semibold text-gray-400">
                  Próximamente
                </div>
              </div>

              <button
                disabled
                className="block w-full bg-gray-400 text-white text-center py-4 rounded-xl font-bold text-lg cursor-not-allowed"
              >
                No disponible aún
              </button>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
}