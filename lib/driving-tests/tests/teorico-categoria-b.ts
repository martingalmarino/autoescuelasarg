import type { DrivingTest, TestCategory, TestQuestion, TestSource } from '../types'
import bank from '../data/nacional-b.json'

interface RawQuestion {
  id: string
  category: string
  topic: string
  question: string
  options: { id: string; text: string }[]
  correctOptionId: string
  explanation: string
  sourceId: string
  legalReference: string
  jurisdiction: string
  reviewedAt: string
  requiresImage: boolean
}

export const NATIONAL_B_QUESTION_COUNT = 80

const rawQuestions = bank.questions as RawQuestion[]

function fail(message: string): never {
  throw new Error(`Banco nacional categoría B: ${message}`)
}

const filled = (value: unknown): value is string => typeof value === 'string' && value.trim().length > 0

export function topicId(topic: string) {
  return topic
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

const sources: Record<string, TestSource> = {}
bank.sources.forEach(source => {
  sources[source.id] = { label: source.title, url: source.url }
})

if (rawQuestions.length !== NATIONAL_B_QUESTION_COUNT || bank.questionCount !== NATIONAL_B_QUESTION_COUNT) {
  fail(`se esperaban ${NATIONAL_B_QUESTION_COUNT} preguntas y hay ${rawQuestions.length}`)
}

const ids: Record<string, true> = {}
const questions: TestQuestion[] = rawQuestions.map(question => {
  if (ids[question.id]) fail(`el ID ${question.id} está repetido`)
  ids[question.id] = true
  if (question.requiresImage !== false) fail(`${question.id} depende de una imagen`)
  if (!filled(question.question) || !filled(question.topic)) fail(`${question.id} no tiene enunciado o tema`)
  if (!filled(question.explanation)) fail(`${question.id} no tiene explicación`)
  if (!filled(question.legalReference)) fail(`${question.id} no tiene referencia normativa`)
  if (!filled(question.reviewedAt)) fail(`${question.id} no tiene fecha de revisión`)
  const source = sources[question.sourceId]
  if (!source) fail(`la fuente "${question.sourceId}" de ${question.id} no existe`)

  const optionIds = question.options.map(option => option.id)
  const optionTexts = question.options.map(option => option.text.trim().toLowerCase())
  if (question.options.length !== 3) fail(`${question.id} debe tener 3 opciones`)
  if (question.options.some(option => !filled(option.id) || !filled(option.text))) fail(`${question.id} tiene una opción vacía`)
  if (optionIds.some((id, index) => optionIds.indexOf(id) !== index)) fail(`${question.id} repite un ID de opción`)
  if (optionTexts.some((text, index) => optionTexts.indexOf(text) !== index)) fail(`${question.id} repite el texto de una opción`)
  if (optionIds.indexOf(question.correctOptionId) === -1) fail(`la respuesta de ${question.id} no es una opción válida`)

  return {
    id: question.id,
    question: question.question,
    options: question.options.map(option => ({ id: option.id, text: option.text })),
    correctOptionId: question.correctOptionId,
    explanation: question.explanation,
    category: topicId(question.topic),
    legal: { reference: question.legalReference, source },
  }
})

const categories: TestCategory[] = []
rawQuestions.forEach(question => {
  const id = topicId(question.topic)
  if (!categories.some(category => category.id === id)) categories.push({ id, name: question.topic })
})

const test: DrivingTest = {
  slug: 'teorico-categoria-b',
  title: 'Test teórico categoría B',
  heading: 'Test teórico categoría B: normativa nacional',
  metaTitle: 'Test de conducir categoría B | Normativa nacional',
  description: `Practicá con ${questions.length} preguntas de categoría B sobre normativa nacional argentina. Respuestas explicadas, fuentes oficiales y simulacros de 40 preguntas.`,
  intro: [
    'La licencia de clase B habilita a conducir autos y camionetas. Para obtenerla tenés que aprobar un examen teórico sobre normas de tránsito, señales y conducción segura.',
    `Este banco reúne ${questions.length} preguntas originales de práctica redactadas a partir de la Ley Nacional de Tránsito 24.449 y su reglamentación (Decreto 779/1995). Cada respuesta incluye una explicación y el artículo en el que se basa, con el enlace al texto oficial.`,
    'No es un banco oficial ni reúne todas las preguntas posibles del examen, y practicar con él no garantiza aprobarlo. Tampoco incluye un módulo de reconocimiento de señales viales.',
    'Las provincias y los municipios aplican la ley nacional con sus propias restricciones y trámites de licencia, así que algunas reglas pueden variar donde rendís. Si rendís en la Ciudad de Córdoba, practicá también con el test de la Guía del Buen Conductor.',
  ],
  tags: ['Normativa nacional', 'Autos y camionetas'],
  notice: bank.publicNotice,
  reviewedAt: bank.reviewedAt,
  sources: bank.sources.map(source => sources[source.id]),
  quiz: {
    storageKey: `autoescuelas:${bank.bankId}:${bank.schemaVersion}`,
    bankName: 'Categoría B · Normativa nacional',
    questions,
    categories,
    studyBlocks: [],
    simulationSizes: [10, 20, 40],
    defaultSimulationSize: 40,
    passingPercentage: null,
    practiceTarget: 80,
    shuffleStudy: true,
  },
}

export default test
