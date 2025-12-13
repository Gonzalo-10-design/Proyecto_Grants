import { ArrowRight, Target, TrendingUp, Clock, Globe, CheckCircle, Search, RefreshCw, Folder, Lightbulb, Brain, FileText, Bell, ClipboardCheck, Workflow } from 'lucide-react';
import { useEffect, useRef } from 'react';
import UsarHoy from '../assets/imagenes/Usar_hoy.webp';

export default function Inicio() {
  const imageRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-fadeInUp');
          }
        });
      },
      { threshold: 0.1 }
    );

    if (imageRef.current) {
      observer.observe(imageRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">

      {/* Hero Section*/}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#0a2f1f] via-[#0f3d28] to-[#1ea34a] text-white pt-16 pb-24 px-4">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-[#1ea34a] rounded-full filter blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#0f3d28] rounded-full filter blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>

        <div className="max-w-6xl mx-auto relative z-10 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-5 leading-tight animate-fadeInDown">
            GRANTIA
            <span className="block text-[#1ea34a] mt-2">
              Búsqueda de recursos para tus proyectos
            </span>
          </h1>

          <div className="space-y-4 mb-8 animate-fadeIn" style={{ animationDelay: '0.2s' }}>
            <p className="text-lg md:text-xl text-gray-200 max-w-4xl mx-auto leading-relaxed">
              Hoy, puedes explorar un directorio con oportunidades de financiación disponibles en Latinoamérica, Europa y Estados Unidos.
            </p>

            <p className="text-lg md:text-xl text-gray-200 max-w-4xl mx-auto leading-relaxed">
              En el futuro, GRANTIA conectará lo que quieres lograr con las convocatorias correctas, para que tus ideas se conviertan en proyectos reales.
            </p>
          </div>

          <div className="flex justify-center gap-4 animate-fadeInUp" style={{ animationDelay: '0.4s' }}>
            <a
              href="/convocatorias"
              className="group inline-flex items-center gap-2 bg-[#1ea34a] hover:bg-[#168f3a] text-white px-8 py-3 rounded-lg font-bold text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-2xl active:scale-95"
            >
              Explorar Oportunidades
              <ArrowRight size={20} className="transition-transform duration-300 group-hover:translate-x-1" />
            </a>
          </div>
        </div>
      </section>

      {/* Stats Section - Más compacto y con animaciones */}
      <section className="py-10 bg-[#e6f4ec] shadow-inner">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            <div className="text-center transform transition-all duration-300 hover:scale-105 hover:-translate-y-1">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#1ea34a] to-[#0f3d28] rounded-full mb-3 shadow-lg transition-shadow duration-300 hover:shadow-xl">
                <Globe className="text-white" size={28} />
              </div>
              <h3 className="text-3xl font-bold text-[#0f3d28] mb-1">30+</h3>
              <p className="text-gray-600 text-sm font-medium">Fuentes Globales</p>
            </div>

            <div className="text-center transform transition-all duration-300 hover:scale-105 hover:-translate-y-1">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#1ea34a] to-[#0f3d28] rounded-full mb-3 shadow-lg transition-shadow duration-300 hover:shadow-xl">
                <Clock className="text-white" size={28} />
              </div>
              <h3 className="text-3xl font-bold text-[#0f3d28] mb-1">24/7</h3>
              <p className="text-gray-600 text-sm font-medium">Monitorización Continua</p>
            </div>

            <div className="text-center transform transition-all duration-300 hover:scale-105 hover:-translate-y-1">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#1ea34a] to-[#0f3d28] rounded-full mb-3 shadow-lg transition-shadow duration-300 hover:shadow-xl">
                <TrendingUp className="text-white" size={28} />
              </div>
              <h3 className="text-3xl font-bold text-[#0f3d28] mb-1">100%</h3>
              <p className="text-gray-600 text-sm font-medium">Datos Verificados</p>
            </div>

          </div>
        </div>
      </section>

      {/* Imagen destacada - Con animación de entrada */}
      <section ref={imageRef} className="py-12 px-4 bg-[#e6f4ec]">
        <div className="max-w-6xl mx-auto flex justify-center opacity-90">
          <img
            src={UsarHoy}
            alt="Usar Grantia Hoy"
            className="max-w-full md:max-w-4xl rounded-2xl shadow-2xl
                      transition-transform duration-500 hover:scale-[1.02]"
          />
        </div>
      </section>

      {/* Pricing Cards Section - Más compacto */}
      <section className="py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            
            {/* Plan Básico */}
            <div className="bg-white rounded-2xl shadow-xl p-6 border-2 border-gray-200 hover:shadow-2xl hover:border-[#1ea34a] transition-all duration-300 transform hover:-translate-y-1">
              <div className="text-center mb-6">
                <h2 className="text-3xl font-bold text-[#0f3d28] mb-2">Plan Básico</h2>
                <p className="text-gray-600">Disponible ahora</p>
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex items-start gap-3 group">
                  <div className="flex-shrink-0 mt-1 transition-transform duration-300 group-hover:scale-110">
                    <Search className="text-[#1ea34a]" size={24} />
                  </div>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    Consulta de grants actuales para tu organización
                  </p>
                </div>

                <div className="flex items-start gap-3 group">
                  <div className="flex-shrink-0 mt-1 transition-transform duration-300 group-hover:scale-110">
                    <RefreshCw className="text-[#1ea34a]" size={24} />
                  </div>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    Actualización constante del directorio
                  </p>
                </div>

                <div className="flex items-start gap-3 group">
                  <div className="flex-shrink-0 mt-1 transition-transform duration-300 group-hover:scale-110">
                    <Folder className="text-[#1ea34a]" size={24} />
                  </div>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    Acceso total al directorio de oportunidades
                  </p>
                </div>
              </div>

              <div className="text-center mb-6">
                <div className="text-4xl font-bold text-[#0f3d28] mb-2">
                  9 USD <span className="text-xl font-semibold">/ mes</span>
                </div>
                <div className="inline-block bg-[#1ea34a] bg-opacity-10 px-3 py-1 rounded-full">
                  <p className="text-sm text-[#0f3d28] font-semibold">
                    Oferta: <span className="text-black">2 USD/mes</span>
                  </p>
                </div>
              </div>

              <a
                href="/Convocatorias"
                className="block w-full bg-gradient-to-r from-[#0a2f1f] via-[#0f3d28] to-[#1ea34a] hover:from-[#0f3d28] hover:to-[#168f3a] text-white text-center py-3 rounded-xl font-bold transition-all duration-300 transform hover:scale-105 hover:shadow-lg active:scale-95"
              >
                Crear cuenta
              </a>
            </div>

            {/* Plan Avanzado */}
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl shadow-xl p-6 border-2 border-gray-300 relative transition-all duration-300 hover:shadow-2xl">
              <div className="absolute top-3 right-3 bg-gray-600 text-white text-xs px-3 py-1 rounded-full font-semibold">
                Próximamente
              </div>

              <div className="text-center mb-6">
                <h2 className="text-3xl font-bold text-gray-700 mb-2">Plan Avanzado</h2>
                <p className="text-gray-500">En construcción</p>
              </div>

              <div className="space-y-3 mb-6">
                {[
                  { icon: Lightbulb, text: "Creación estructurada de proyectos" },
                  { icon: Brain, text: "Matching inteligente con IA" },
                  { icon: FileText, text: "Recomendaciones personalizadas" },
                  { icon: Bell, text: "Alertas avanzadas" },
                  { icon: ClipboardCheck, text: "Evaluación de elegibilidad" },
                  { icon: Workflow, text: "Flujo guiado de solicitudes" }
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3 opacity-60">
                    <div className="flex-shrink-0 mt-1">
                      <item.icon className="text-gray-400" size={20} />
                    </div>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {item.text}
                    </p>
                  </div>
                ))}
              </div>

              <button
                disabled
                className="block w-full bg-gray-400 text-white text-center py-3 rounded-xl font-bold cursor-not-allowed"
              >
                No disponible aún
              </button>
            </div>

          </div>
        </div>
      </section>

      <style>{`
        @keyframes fadeInDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

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

        .animate-fadeInDown {
          animation: fadeInDown 0.8s ease-out forwards;
        }

        .animate-fadeIn {
          animation: fadeIn 0.8s ease-out forwards;
        }

        .animate-fadeInUp {
          animation: fadeInUp 0.8s ease-out forwards;
        }
      `}</style>

    </div>
  );
}