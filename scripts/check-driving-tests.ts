import assert from 'node:assert/strict'
import bank from '../lib/driving-tests/data/cordoba-general.json'
import { drivingTests, getDrivingTest } from '../lib/driving-tests'
import {
  createAttempt,
  indexQuestions,
  loadProgress,
  parseProgress,
  saveProgress,
  scoreAttempt,
  simulationOptions,
  updateMistakes,
  type StoredProgress,
} from '../lib/driving-tests/quiz'

let seed = 42
const random = () => {
  seed = (seed * 1664525 + 1013904223) % 4294967296
  return seed / 4294967296
}

function check(name: string, run: () => void) {
  run()
  console.log(`✓ ${name}`)
}

const cordoba = getDrivingTest('guia-del-buen-conductor-cordoba')!
const { questions, categories } = cordoba.quiz
const byId = indexQuestions(questions)

check('el pool puntuable sale solo de preguntas habilitadas, sin revisión ni duplicados', () => {
  const expected = bank.questions.filter(
    q => q.enabled === true && q.status !== 'needs_review' && q.duplicate_of === null && q.correct_option_id !== null
  )
  assert.equal(questions.length, expected.length)
  assert.deepEqual(questions.map(q => q.id), expected.map(q => q.id))
  const excluded = bank.questions.filter(q => q.status === 'needs_review' || q.duplicate_of !== null)
  assert.ok(excluded.every(q => !byId[q.id]))
})

check('la respuesta correcta se conserva al mezclar las opciones', () => {
  for (let round = 0; round < 50; round++) {
    const attempt = createAttempt({ mode: 'simulation', label: 't', questions, sample: 40, shuffleOptions: true, random })
    attempt.questionIds.forEach(id => {
      attempt.answers[id] = byId[id].correctOptionId
    })
    const result = scoreAttempt(attempt, byId, categories)
    assert.equal(result.correct, 40)
    assert.equal(result.percentage, 100)
  }
})

check('el simulacro no repite preguntas', () => {
  const attempt = createAttempt({ mode: 'simulation', label: 't', questions, sample: 40, shuffleOptions: true, random })
  assert.equal(new Set(attempt.questionIds).size, 40)
})

check('las preguntas sin responder cuentan aparte y valen cero', () => {
  const attempt = createAttempt({ mode: 'simulation', label: 't', questions, sample: 10, random })
  const [first, second] = attempt.questionIds
  attempt.answers[first] = byId[first].correctOptionId
  attempt.answers[second] = byId[second].options.find(o => o.id !== byId[second].correctOptionId)!.id
  const result = scoreAttempt(attempt, byId, categories)
  assert.deepEqual([result.correct, result.incorrect, result.unanswered, result.percentage], [1, 1, 8, 10])
})

check('una muestra más grande que el pool usa solo las preguntas disponibles', () => {
  const velocidades = questions.filter(q => q.category === 'velocidades')
  const attempt = createAttempt({ mode: 'simulation', label: 't', questions: velocidades, sample: 40, random })
  assert.equal(attempt.questionIds.length, velocidades.length)
  assert.deepEqual(simulationOptions([10, 20, 40], 6), [6])
  assert.deepEqual(simulationOptions([10, 20, 40], 15), [10, 15])
})

check('los errores se agregan sin duplicar y salen al responder bien', () => {
  const attempt = createAttempt({ mode: 'study', label: 't', questions: questions.slice(0, 3) })
  const [a, b] = attempt.questionIds
  attempt.answers[a] = byId[a].correctOptionId
  const mistakes = updateMistakes([a, b], scoreAttempt(attempt, byId, categories))
  assert.deepEqual(mistakes.sort(), attempt.questionIds.slice(1).sort())
})

check('el progreso guardado se restaura y descarta IDs obsoletos', () => {
  const attempt = createAttempt({ mode: 'simulation', label: 't', questions, sample: 5, shuffleOptions: true, random })
  attempt.answers[attempt.questionIds[0]] = byId[attempt.questionIds[0]].options[0].id
  attempt.index = 3
  const stored: StoredProgress = {
    version: 1,
    mistakes: [questions[0].id, 'cordoba-general-071', 'no-existe', questions[0].id],
    attempt,
    lastResult: null,
  }
  const restored = parseProgress(JSON.stringify(stored), byId)
  assert.deepEqual(restored.mistakes, [questions[0].id])
  assert.deepEqual(restored.attempt, attempt)

  const obsolete = { ...stored, attempt: { ...attempt, questionIds: [...attempt.questionIds, 'cordoba-general-071'] } }
  assert.equal(parseProgress(JSON.stringify(obsolete), byId).attempt, null)

  const badOrder = { ...stored, attempt: { ...attempt, optionOrder: { ...attempt.optionOrder, [attempt.questionIds[0]]: ['z'] } } }
  assert.equal(parseProgress(JSON.stringify(badOrder), byId).attempt, null)
})

check('el almacenamiento corrupto o de otra versión empieza de cero', () => {
  assert.deepEqual(parseProgress('{no es json', byId).mistakes, [])
  assert.equal(parseProgress(JSON.stringify({ version: 2, mistakes: [questions[0].id] }), byId).mistakes.length, 0)
  assert.equal(parseProgress(null, byId).attempt, null)
})

check('si el navegador bloquea el almacenamiento el test sigue funcionando', () => {
  const blocked = {
    getItem: () => {
      throw new Error('SecurityError')
    },
    setItem: () => {
      throw new Error('QuotaExceededError')
    },
    removeItem: () => undefined,
  }
  ;(globalThis as unknown as { window: unknown }).window = { localStorage: blocked }
  assert.equal(loadProgress('k', byId).attempt, null)
  assert.equal(saveProgress('k', parseProgress(null, byId)), false)
})

check('todos los tests registrados tienen IDs y respuestas válidas', () => {
  for (const test of drivingTests) {
    for (const question of test.quiz.questions) {
      assert.ok(question.options.length >= 2 && question.options.length <= 4)
      assert.ok(question.options.some(o => o.id === question.correctOptionId))
    }
  }
})

console.log(`\nCórdoba: ${questions.length} preguntas puntuables, ${categories.length} temas, ${cordoba.quiz.studyBlocks.length} bloques.`)
