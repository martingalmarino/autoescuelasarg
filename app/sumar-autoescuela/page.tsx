import { Metadata } from 'next'
import SchoolRegistrationForm from './SchoolRegistrationForm'

export const metadata: Metadata = {
  title: 'Suma tu Autoescuela - Autoescuelas.ar',
  description: 'Registra tu autoescuela en el directorio más completo de escuelas de manejo en Argentina.',
  keywords: 'registrar autoescuela, escuela de manejo, directorio autoescuelas',
}

export default function AddSchoolPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Suma tu Autoescuela
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Únete al directorio más completo de escuelas de manejo en Argentina. 
            Registra tu autoescuela y llega a más estudiantes.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <SchoolRegistrationForm />
        </div>

        <div className="mt-8 bg-blue-50 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-blue-900 mb-3">
            ¿Por qué registrarse?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-blue-800">
            <div>
              <h3 className="font-medium mb-1">📈 Más visibilidad</h3>
              <p>Aparece en búsquedas de estudiantes en tu zona</p>
            </div>
            <div>
              <h3 className="font-medium mb-1">⭐ Reseñas verificadas</h3>
              <p>Recibe reseñas de estudiantes reales</p>
            </div>
            <div>
              <h3 className="font-medium mb-1">🎯 Gratis para siempre</h3>
              <p>Registro y listado completamente gratuito</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
