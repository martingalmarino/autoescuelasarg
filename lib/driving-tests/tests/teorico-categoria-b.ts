import type { DrivingTest } from '../types'

const test: DrivingTest = {
  slug: 'teorico-categoria-b',
  title: 'Test teórico categoría B',
  heading: 'Test teórico categoría B',
  metaTitle: 'Test teórico categoría B online',
  description:
    'Simulacro online del examen teórico para la licencia categoría B (autos y camionetas). Practicá con preguntas de opción múltiple y repasá tus errores.',
  intro: [
    'La licencia de clase B habilita a conducir autos y camionetas. Para obtenerla tenés que aprobar un examen teórico sobre normas de tránsito, señales y conducción segura.',
  ],
  tags: ['Autos y camionetas', 'Examen teórico'],
  notice: null,
  sources: [],
  quiz: {
    storageKey: 'autoescuelas:teorico-categoria-b:v1',
    questions: [],
    categories: [],
    studyBlocks: [],
    simulationSizes: [10, 20, 40],
    defaultSimulationSize: 20,
    passingPercentage: null,
  },
}

export default test
