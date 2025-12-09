import { ArrowRight, Target, TrendingUp, Clock, Globe, CheckCircle } from 'lucide-react';
import UsarHoy from "../assets/imagenes/Usar_hoy.png";
import Pago from "../assets/imagenes/Pago.png";

export default function Cómo_funciona() {
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
              Te ayuda a encontrar dinero para tus proyectos.
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-200 max-w-4xl mx-auto leading-relaxed">
            Hoy, puedes explorar un directorio con oportunidades de financiación disponibles en Latinoamérica y Estados Unidos.
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

      {/*Imagen debajo de las estadísticas */}
      <section className="py-12 flex justify-center px-4">
        <img
          src={UsarHoy}
          alt="Imagen ilustrativa GrantIA"
          className="w-full max-w-3xl rounded-2xl shadow-2xl transform hover:scale-105 transition-transform"
        />
      </section>

      {/* Imagen pago */}
      <section className="py-12 flex justify-center px-4">
        <img
        src={Pago}
        alt="Imagen ilustrativa Pago"
        className="w-full max-w-3xl rounded-2xl shadow-2xl transform hover:scale-105 transition-transform"
        />
      </section>
          <div className="flex justify-center gap-4 mt-10">
            <a
              href="https://dashboard.stripe.com/logins"
              className="inline-flex items-center gap-2 bg-[#1ea34a] hover:bg-[#168f3a] text-white px-8 py-4 rounded-lg font-bold text-lg transition-all transform hover:scale-105 shadow-lg"
            >
              Crear cuenta
              <ArrowRight size={20} />
            </a>
          </div>
    </div>
  );
}