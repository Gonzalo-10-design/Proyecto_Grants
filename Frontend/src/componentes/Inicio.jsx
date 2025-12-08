import React from 'react';
import { ArrowRight, Target, TrendingUp, Clock, Globe, CheckCircle } from 'lucide-react';

export default function Inicio() {
  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#0a2f1f] via-[#0f3d28] to-[#1ea34a] text-white py-20 px-4">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-[#1ea34a] rounded-full filter blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#0f3d28] rounded-full filter blur-3xl"></div>
        </div>
        
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-8">
            <h1 className="text-5xl md:text-6xl font-extrabold mb-6 leading-tight">
              Inteligencia Estratégica para el
              <span className="block text-[#1ea34a] mt-2">Acceso a Financiación Global</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-200 max-w-4xl mx-auto leading-relaxed">
              I+D Eskar centraliza, sistematiza y pone a disposición las oportunidades de capital más relevantes del ecosistema. Conectamos proyectos de alto impacto con convocatorias, subvenciones y fondos de inversión de entidades líderes como el BID, NSF, Minciencias y fundaciones internacionales.
            </p>
          </div>
          
          <div className="flex justify-center gap-4 mt-10">
            <a href="/convocatorias" className="inline-flex items-center gap-2 bg-[#1ea34a] hover:bg-[#168f3a] text-white px-8 py-4 rounded-lg font-bold text-lg transition-all transform hover:scale-105 shadow-lg">
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

      {/* Context Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-block bg-[#1ea34a] bg-opacity-10 text-[#0f3d28] px-4 py-2 rounded-full font-semibold mb-4">
                Contexto y Solución
              </div>
              <h2 className="text-4xl font-bold text-[#0f3d28] mb-6">
                Optimización en la Búsqueda de Recursos
              </h2>
              <p className="text-lg text-gray-700 mb-4 leading-relaxed">
                En el panorama actual, la información sobre financiación se encuentra fragmentada y dispersa, convirtiendo la búsqueda de capital en un proceso ineficiente que consume recursos valiosos.
              </p>
              <p className="text-lg text-gray-700 mb-4 leading-relaxed">
                <strong className="text-[#0f3d28]">I+D Eskar surge como la respuesta tecnológica a este desafío.</strong>
              </p>
              <p className="text-lg text-gray-700 leading-relaxed">
                La plataforma actúa como un sistema de inteligencia de negocios que monitorea y filtra en tiempo real las fuentes de financiación más prestigiosas. Su función es transformar el ruido digital en datos estructurados, permitiendo que empresas, investigadores y organizaciones accedan a información veraz y oportuna para su crecimiento.
              </p>
            </div>
            
            <div className="relative">
              <div className="bg-gradient-to-br from-[#0f3d28] to-[#1ea34a] rounded-2xl p-8 shadow-2xl transform hover:scale-105 transition-transform">
                <Target className="text-white mb-4" size={48} />
                <h3 className="text-2xl font-bold text-white mb-4">
                  Sistema de Inteligencia de Negocios
                </h3>
                <p className="text-gray-200 leading-relaxed">
                  Transformamos datos dispersos en oportunidades concretas. Nuestra tecnología opera continuamente para mantener tu pipeline de financiación siempre actualizado.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Value Proposition Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-block bg-[#1ea34a] bg-opacity-10 text-[#0f3d28] px-4 py-2 rounded-full font-semibold mb-4">
              Propuesta de Valor
            </div>
            <h2 className="text-4xl font-bold text-[#0f3d28] mb-4">
              Una Ventaja Competitiva Basada en Datos
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              El valor de I+D Eskar reside en su capacidad para simplificar la complejidad del entorno de financiación
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mt-12">
            <div className="bg-gradient-to-br from-gray-50 to-white border-2 border-gray-200 rounded-xl p-8 hover:shadow-xl transition-shadow">
              <div className="w-14 h-14 bg-[#1ea34a] bg-opacity-10 rounded-lg flex items-center justify-center mb-6">
                <Clock className="text-[#1ea34a]" size={28} />
              </div>
              <h3 className="text-2xl font-bold text-[#0f3d28] mb-4">
                Monitorización Continua
              </h3>
              <p className="text-gray-700 leading-relaxed">
                La tecnología de rastreo opera 24/7 sobre fuentes globales, asegurando que ninguna oportunidad crítica pase desapercibida.
              </p>
            </div>

            <div className="bg-gradient-to-br from-gray-50 to-white border-2 border-gray-200 rounded-xl p-8 hover:shadow-xl transition-shadow">
              <div className="w-14 h-14 bg-[#1ea34a] bg-opacity-10 rounded-lg flex items-center justify-center mb-6">
                <CheckCircle className="text-[#1ea34a]" size={28} />
              </div>
              <h3 className="text-2xl font-bold text-[#0f3d28] mb-4">
                Curaduría Especializada
              </h3>
              <p className="text-gray-700 leading-relaxed">
                El sistema prioriza la calidad sobre la cantidad, entregando opciones de alto valor estratégico para el desarrollo de I+D+i.
              </p>
            </div>

            <div className="bg-gradient-to-br from-gray-50 to-white border-2 border-gray-200 rounded-xl p-8 hover:shadow-xl transition-shadow">
              <div className="w-14 h-14 bg-[#1ea34a] bg-opacity-10 rounded-lg flex items-center justify-center mb-6">
                <TrendingUp className="text-[#1ea34a]" size={28} />
              </div>
              <h3 className="text-2xl font-bold text-[#0f3d28] mb-4">
                Eficiencia Operativa
              </h3>
              <p className="text-gray-700 leading-relaxed">
                Permite a los usuarios redirigir el tiempo de búsqueda hacia lo fundamental: la estructuración de propuestas ganadoras y el desarrollo de sus proyectos.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-[#0f3d28] to-[#1ea34a] text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">
            ¿Listo para Potenciar tu Proyecto?
          </h2>
          <p className="text-xl text-gray-200 mb-8">
            Únete a las organizaciones que ya están optimizando su acceso a financiación con I+D Eskar
          </p>
          <a href="/convocatorias" className="inline-flex items-center gap-2 bg-white text-[#0f3d28] hover:bg-gray-100 px-8 py-4 rounded-lg font-bold text-lg transition-all transform hover:scale-105 shadow-lg">
            Comenzar Ahora
            <ArrowRight size={20} />
          </a>
        </div>
      </section>
    </div>
  );
}