import type { DrivingTest } from './types'
import guiaDelBuenConductorCordoba from './tests/guia-del-buen-conductor-cordoba'
import teoricoCategoriaB from './tests/teorico-categoria-b'
import teoricoCategoriaA from './tests/teorico-categoria-a'

export type { DrivingTest, QuizData, TestQuestion } from './types'

// El orden de esta lista es el orden en que se muestran los tests en el índice.
export const drivingTests: DrivingTest[] = [
  guiaDelBuenConductorCordoba,
  teoricoCategoriaB,
  teoricoCategoriaA,
]

function validate(test: DrivingTest) {
  const fail = (message: string): never => {
    throw new Error(`Test "${test.slug}": ${message}`)
  }
  const ids = new Set<string>()
  for (const question of test.quiz.questions) {
    if (ids.has(question.id)) fail(`la pregunta "${question.id}" está repetida`)
    ids.add(question.id)
    const optionIds = question.options.map(option => option.id)
    if (optionIds.length < 2 || optionIds.length > 4) fail(`"${question.id}" debe tener entre 2 y 4 opciones`)
    if (new Set(optionIds).size !== optionIds.length) fail(`"${question.id}" tiene opciones con el mismo ID`)
    if (!optionIds.includes(question.correctOptionId)) fail(`la respuesta de "${question.id}" no es una opción válida`)
  }
  for (const block of test.quiz.studyBlocks) {
    const unknown = block.questionIds.find(id => !ids.has(id))
    if (unknown) fail(`el bloque "${block.id}" usa la pregunta inexistente "${unknown}"`)
  }
}

const slugs = new Set<string>()
const storageKeys = new Set<string>()
for (const test of drivingTests) {
  if (slugs.has(test.slug)) throw new Error(`Hay dos tests con el slug "${test.slug}"`)
  if (storageKeys.has(test.quiz.storageKey)) throw new Error(`Hay dos tests con la clave "${test.quiz.storageKey}"`)
  slugs.add(test.slug)
  storageKeys.add(test.quiz.storageKey)
  validate(test)
}

export function isTestAvailable(test: DrivingTest) {
  return test.quiz.questions.length > 0
}

export function getAvailableTests() {
  return drivingTests.filter(isTestAvailable)
}

export function getDrivingTest(slug: string) {
  return drivingTests.find(test => test.slug === slug)
}
