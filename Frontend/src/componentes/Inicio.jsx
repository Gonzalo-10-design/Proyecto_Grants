import React from 'react'

export default function Inicio() {
  return (
    <div className="w-full min-h-screen bg-gray-100 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto text-center">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0f3d28] mb-8">
          ¿Qué estamos construyendo?
        </h1>
        <p className="text-lg sm:text-xl text-gray-700 mb-6">
          En ISATECK estamos desarrollando una plataforma inteligente que centraliza, organiza y pone al alcance de cada usuario las mejores oportunidades de <strong>convocatorias, subvenciones y fuentes de financiamiento</strong> disponibles a nivel nacional e internacional.
        </p>
        <p className="text-lg sm:text-xl text-gray-700 mb-8">
          Nuestro objetivo es simplificar un proceso que, para la mayoría de emprendedores, empresas y organizaciones, suele ser complejo, disperso y altamente demandante en tiempo.
        </p>

        <h2 className="text-2xl sm:text-3xl font-semibold text-[#0f3d28] mb-6">
          ¿Por qué lo hacemos?
        </h2>
        <p className="text-lg sm:text-xl text-gray-700 mb-6">
          Porque entendemos el enorme desafío que enfrentan los emprendedores, investigadores, instituciones y organizaciones al buscar financiación, apoyo técnico o programas de fortalecimiento. En ISATECK llevamos años acompañando proyectos tecnológicos y empresariales en Latinoamérica, y hemos visto de primera mano cómo el acceso a la información adecuada puede transformar ideas en realidades.
        </p>
        <p className="text-lg sm:text-xl text-gray-700 mb-8">
          Queremos que más personas tengan la posibilidad de acelerar sus iniciativas, encontrar aliados estratégicos y potenciar su impacto sin perder tiempo en búsquedas interminables.
        </p>

        <h2 className="text-2xl sm:text-3xl font-semibold text-[#0f3d28] mb-6">
          ¿Qué ofrecemos al usuario?
        </h2>
        <ul className="list-inside list-disc text-lg sm:text-xl text-gray-700 mb-6">
          <li><strong>Un acceso ágil, centralizado y confiable</strong> a oportunidades reales de crecimiento.</li>
          <li><strong>Una herramienta que facilita la toma de decisiones.</strong></li>
          <li><strong>Un aliado tecnológico</strong> que trabaja para que tú te enfoques en lo más importante: <strong>hacer crecer tu proyecto</strong>.</li>
        </ul>

        <p className="text-lg sm:text-xl text-gray-700">
          En ISATECK creemos en el poder de la innovación aplicada y en la tecnología que simplifica vidas. Esta plataforma es un paso más hacia ese compromiso.
        </p>
      </div>
    </div>
  )
}
