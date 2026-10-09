import type { DrivingTest, StudyBlock, TestCategory, TestQuestion } from '../types'
import bank from '../data/cordoba-general.json'

interface RawOption {
  id: string
  text: string
}

interface RawQuestion {
  id: string
  number: number
  source_number: number
  category: string | null
  question: string
  options: RawOption[]
  correct_option_id: string | null
  explanation: string | null
  has_image: boolean
  enabled: boolean
  status: string
  duplicate_of: string | null
  source: { pdf_page: number | null }
}

const rawQuestions = bank.questions as RawQuestion[]

function fail(message: string): never {
  throw new Error(`Banco de Córdoba: ${message}`)
}

function isScored(question: RawQuestion) {
  return (
    question.enabled === true &&
    question.status !== 'needs_review' &&
    question.duplicate_of === null &&
    question.correct_option_id !== null
  )
}

const ids = new Set<string>()
rawQuestions.forEach((question, index) => {
  if (ids.has(question.id)) fail(`el ID ${question.id} está repetido`)
  ids.add(question.id)
  if (question.number !== index + 1) fail(`la numeración editorial se corta en ${question.id}`)
  if (!question.source?.pdf_page) fail(`${question.id} no tiene página de origen`)
})

const pool: TestQuestion[] = rawQuestions.filter(isScored).map(question => {
  const optionIds = question.options.map(option => option.id)
  if (question.has_image) fail(`${question.id} depende de una imagen`)
  if (question.options.length < 2 || question.options.length > 4) fail(`${question.id} debe tener entre 2 y 4 opciones`)
  if (new Set(optionIds).size !== optionIds.length) fail(`${question.id} tiene opciones con el mismo ID`)
  if (!optionIds.includes(question.correct_option_id as string)) fail(`la respuesta de ${question.id} no es una opción válida`)

  return {
    id: question.id,
    question: question.question,
    options: question.options.map(option => ({ id: option.id, text: option.text })),
    correctOptionId: question.correct_option_id as string,
    explanation: question.explanation || null,
    category: question.category,
  }
})

const poolIds = new Set(pool.map(question => question.id))

const categories: TestCategory[] = bank.categories
  .filter(category => pool.some(question => question.category === category.id))
  .map(category => ({ id: category.id, name: category.name }))

const studyBlocks: StudyBlock[] = bank.study_blocks.map(block => {
  const missing = block.question_ids.find(id => !poolIds.has(id))
  if (missing) fail(`el ${block.name} incluye ${missing}, que no está habilitada`)
  return { id: block.id, name: block.name, questionIds: block.question_ids }
})

const test: DrivingTest = {
  slug: 'guia-del-buen-conductor-cordoba',
  title: 'Test Guía del Buen Conductor – Córdoba',
  heading: 'Test teórico de conducir en Córdoba Capital',
  metaTitle: 'Test teórico de conducir en Córdoba',
  description:
    'Practicá para el examen teórico de conducir en Córdoba Capital. Preguntas de opción múltiple, bloques de estudio y repaso de errores.',
  intro: [
    `Este test reúne ${pool.length} preguntas de opción múltiple sobre normativa general de tránsito, basadas en la Guía del Buen Conductor, el material de estudio para el examen teórico de la licencia de conducir en la Ciudad de Córdoba.`,
    'Incluye las preguntas de normativa general que no dependen de imágenes. No incluye las preguntas con señales ilustradas ni la sección específica de motos, transporte profesional, taxis y remises.',
    'Las reglas corresponden a la Ciudad de Córdoba (Córdoba Capital). En otras localidades de la provincia o del país pueden ser distintas.',
  ],
  tags: ['Córdoba Capital', 'Examen teórico'],
  notice: bank.quiz_config.non_official_notice,
  sources: [
    { label: 'Mi Licencia — Municipalidad de Córdoba', url: bank.quiz_config.official_source_url },
    {
      label: 'Guía de estudio — Normativa general (Municipalidad de Córdoba)',
      url: 'https://cordoba.gob.ar/wp-content/uploads/2025/11/Guia-de-estudio-Normativa-general-1.pdf',
    },
    {
      label: 'Preguntero para conductores (Municipalidad de Córdoba)',
      url: 'https://cordoba.gob.ar/wp-content/uploads/2025/11/Preguntero-para-Conductores.pdf',
    },
  ],
  quiz: {
    storageKey: 'autoescuelas:cordoba-general:v1',
    questions: pool,
    categories,
    studyBlocks,
    simulationSizes: bank.quiz_config.simulation_question_counts,
    defaultSimulationSize: bank.quiz_config.default_simulation_count,
    passingPercentage: null,
  },
}

export default test
