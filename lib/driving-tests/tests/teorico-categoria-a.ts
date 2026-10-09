import type { DrivingTest } from '../types'

const test: DrivingTest = {
  slug: 'teorico-categoria-a',
  title: 'Test teórico categoría A',
  heading: 'Test teórico categoría A',
  metaTitle: 'Test teórico categoría A online',
  description:
    'Simulacro online del examen teórico para la licencia categoría A (motos y ciclomotores). Practicá con preguntas de opción múltiple y repasá tus errores.',
  intro: [
    'La licencia de clase A habilita a conducir motos y ciclomotores. Para obtenerla tenés que aprobar un examen teórico sobre normas de tránsito, señales y conducción segura en dos ruedas.',
  ],
  tags: ['Motos', 'Examen teórico'],
  notice: null,
  sources: [],
  quiz: {
    storageKey: 'autoescuelas:teorico-categoria-a:v1',
    questions: [],
    categories: [],
    studyBlocks: [],
    simulationSizes: [10, 20, 40],
    defaultSimulationSize: 20,
    passingPercentage: null,
  },
}

export default test
