import { Mail, MapPin, Linkedin, Twitter, Facebook, MessageCircle } from 'lucide-react';

export default function Contacto() {
  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-extrabold text-[#0f3d28] mb-4">
            ¿Tienes alguna pregunta?
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Estamos aquí para ayudarte a potenciar tu acceso a oportunidades de financiación
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          
          {/* Contact Info Card */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
            <h2 className="text-2xl font-bold text-[#0f3d28] mb-6">
              Información de Contacto
            </h2>
            
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-[#1ea34a] bg-opacity-10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Mail className="text-[#1ea34a]" size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-[#0f3d28] mb-1">Correo Electrónico</h3>
                  <a 
                    href="mailto:info@eskar.group" 
                    className="text-[#1ea34a] hover:text-[#0f3d28] transition-colors"
                  >
                    info@eskar.group
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-[#1ea34a] bg-opacity-10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <MapPin className="text-[#1ea34a]" size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-[#0f3d28] mb-1">Cel.</h3>
                  <p className="text-gray-700">
                    +14074878581<br />
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Why Contact Us Card */}
          <div className="bg-gradient-to-br from-[#0f3d28] to-[#1ea34a] rounded-2xl shadow-lg p-8 text-white">
            <h2 className="text-2xl font-bold mb-6">
              ¿Por qué contactarnos?
            </h2>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MessageCircle className="flex-shrink-0 mt-1" size={20} />
                <span>Consultas sobre convocatorias específicas</span>
              </li>
              <li className="flex items-start gap-3">
                <MessageCircle className="flex-shrink-0 mt-1" size={20} />
                <span>Asesoría en búsqueda de financiación</span>
              </li>
              <li className="flex items-start gap-3">
                <MessageCircle className="flex-shrink-0 mt-1" size={20} />
                <span>Soporte técnico de la plataforma</span>
              </li>
              <li className="flex items-start gap-3">
                <MessageCircle className="flex-shrink-0 mt-1" size={20} />
                <span>Sugerencias para mejorar el servicio</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Social Media Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
          <h2 className="text-2xl font-bold text-[#0f3d28] mb-6 text-center">
            Síguenos en Redes Sociales
          </h2>
          
          <div className="flex justify-center gap-6">
            <a 
              href="" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-2 p-6 rounded-xl bg-gray-50 hover:bg-[#1ea34a] hover:text-white transition-all duration-300 group min-w-[120px]"
            >
              <Linkedin size={32} className="text-[#1ea34a] group-hover:text-white transition-colors" />
              <span className="font-semibold text-sm">LinkedIn</span>
            </a>

            <a 
              href="" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-2 p-6 rounded-xl bg-gray-50 hover:bg-[#1ea34a] hover:text-white transition-all duration-300 group min-w-[120px]"
            >
              <Twitter size={32} className="text-[#1ea34a] group-hover:text-white transition-colors" />
              <span className="font-semibold text-sm">Twitter</span>
            </a>

            <a 
              href="" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-2 p-6 rounded-xl bg-gray-50 hover:bg-[#1ea34a] hover:text-white transition-all duration-300 group min-w-[120px]"
            >
              <Facebook size={32} className="text-[#1ea34a] group-hover:text-white transition-colors" />
              <span className="font-semibold text-sm">Facebook</span>
            </a>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-12 text-center bg-gradient-to-r from-[#0f3d28] to-[#1ea34a] rounded-2xl p-8 text-white shadow-lg">
          <h3 className="text-2xl font-bold mb-3">
            ¿Listo para Impulsar tu Proyecto?
          </h3>
          <p className="text-lg text-gray-200 mb-6">
            Explora las oportunidades de financiación que tenemos para ti
          </p>
          <a 
            href="/convocatorias"
            className="inline-block bg-white text-[#0f3d28] px-8 py-3 rounded-lg font-bold hover:bg-gray-100 transition-colors"
          >
            Ver Convocatorias
          </a>
        </div>

      </div>
    </div>
  );
}