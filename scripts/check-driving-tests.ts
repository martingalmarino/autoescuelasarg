import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import bank from '../lib/driving-tests/data/cordoba-general.json'
import nationalBank from '../lib/driving-tests/data/nacional-b.json'
import { drivingTests, getDrivingTest } from '../lib/driving-tests'
import { topicId } from '../lib/driving-tests/tests/teorico-categoria-b'
import {
  answerQuestion,
  createAttempt,
  indexQuestions,
  loadProgress,
  parseProgress,
  practiceTargetCount,
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

// --- Banco nacional categoría B ---

const national = getDrivingTest('teorico-categoria-b')!
const nationalQuestions = national.quiz.questions
const nationalById = indexQuestions(nationalQuestions)
const nationalCategories = national.quiz.categories
const rawNational = nationalBank.questions
const sourceIds = nationalBank.sources.map(source => source.id)

check('banco nacional: 80 registros válidos, con fuente, explicación y sin imágenes', () => {
  assert.equal(rawNational.length, 80)
  assert.equal(new Set(rawNational.map(q => q.id)).size, 80)
  for (const q of rawNational) {
    assert.equal(q.options.length, 3, q.id)
    assert.ok(q.options.every(o => o.id.trim() && o.text.trim()), q.id)
    assert.equal(new Set(q.options.map(o => o.id)).size, 3, q.id)
    assert.equal(new Set(q.options.map(o => o.text.trim().toLowerCase())).size, 3, q.id)
    assert.equal(q.options.filter(o => o.id === q.correctOptionId).length, 1, q.id)
    assert.ok(sourceIds.indexOf(q.sourceId) !== -1, q.id)
    assert.ok(q.explanation.trim() && q.legalReference.trim() && q.reviewedAt === '2026-10-10', q.id)
    assert.equal(q.requiresImage, false, q.id)
  }
})

check('banco nacional: el archivo es UTF-8 válido y conserva los acentos', () => {
  const text = readFileSync(join(__dirname, '../lib/driving-tests/data/nacional-b.json'), 'utf8')
  assert.ok(!/\uFFFD|Ã[¡-¿]/.test(text), 'hay caracteres mal codificados')
  assert.ok(text.indexOf('¿Qué peso total máximo') !== -1)
  assert.doesNotThrow(() => JSON.parse(text))
})

check('banco nacional: el adaptador conserva IDs, opciones, respuestas y fundamentos', () => {
  assert.equal(nationalQuestions.length, rawNational.length)
  rawNational.forEach((raw, index) => {
    const adapted = nationalQuestions[index]
    const source = nationalBank.sources.find(s => s.id === raw.sourceId)!
    assert.equal(adapted.id, raw.id)
    assert.equal(adapted.question, raw.question)
    assert.deepEqual(adapted.options, raw.options)
    assert.equal(adapted.correctOptionId, raw.correctOptionId)
    assert.equal(adapted.explanation, raw.explanation)
    assert.equal(adapted.category, topicId(raw.topic))
    assert.deepEqual(adapted.legal, { reference: raw.legalReference, source: { label: source.title, url: source.url } })
  })
  assert.equal(national.reviewedAt, '2026-10-10')
  assert.equal(national.notice, nationalBank.publicNotice)
})

check('banco nacional: se corrige por ID de opción, no por la posición mezclada', () => {
  const snapshot = JSON.stringify(nationalQuestions)
  let positionalMisses = 0
  for (let round = 0; round < 50; round++) {
    const attempt = createAttempt({ mode: 'simulation', label: 't', questions: nationalQuestions, sample: 40, shuffleOptions: true, random })
    const byPosition = { ...attempt, answers: {} as Record<string, string> }
    attempt.questionIds.forEach(id => {
      attempt.answers[id] = nationalById[id].correctOptionId
      const originalIndex = nationalById[id].options.findIndex(o => o.id === nationalById[id].correctOptionId)
      byPosition.answers[id] = attempt.optionOrder[id][originalIndex]
    })
    assert.equal(scoreAttempt(attempt, nationalById, nationalCategories).correct, 40)
    positionalMisses += 40 - scoreAttempt(byPosition, nationalById, nationalCategories).correct
  }
  assert.ok(positionalMisses > 0, 'las opciones deberían mezclarse')
  assert.equal(JSON.stringify(nationalQuestions), snapshot, 'la mezcla no debe modificar el banco')
})

check('banco nacional: el simulacro toma 40 preguntas distintas del banco', () => {
  for (let round = 0; round < 50; round++) {
    const attempt = createAttempt({ mode: 'simulation', label: 't', questions: nationalQuestions, sample: 40, shuffleOptions: true, random })
    assert.equal(attempt.questionIds.length, 40)
    assert.equal(new Set(attempt.questionIds).size, 40)
    assert.ok(attempt.questionIds.every(id => nationalById[id]))
  }
})

check('banco nacional: en estudio la respuesta confirmada queda fija; en simulacro se puede cambiar', () => {
  const study = createAttempt({ mode: 'study', label: 't', questions: nationalQuestions, shuffleQuestions: true, shuffleOptions: true, random })
  const id = study.questionIds[0]
  const wrong = nationalById[id].options.find(o => o.id !== nationalById[id].correctOptionId)!.id
  const locked = answerQuestion(study, id, wrong)
  const retried = answerQuestion(locked, id, nationalById[id].correctOptionId)
  assert.equal(retried.answers[id], wrong)
  assert.equal(scoreAttempt(retried, nationalById, nationalCategories).correct, 0)
  assert.equal(answerQuestion(study, 'no-existe', 'a'), study)

  const simulation = createAttempt({ mode: 'simulation', label: 't', questions: nationalQuestions, sample: 40, random })
  const simId = simulation.questionIds[0]
  const changed = answerQuestion(answerQuestion(simulation, simId, wrong), simId, nationalById[simId].correctOptionId)
  assert.equal(changed.answers[simId], nationalById[simId].correctOptionId)
})

check('banco nacional: sin responder cuenta aparte, vale cero y el porcentaje usa el largo real', () => {
  const attempt = createAttempt({ mode: 'simulation', label: 't', questions: nationalQuestions, sample: 40, random })
  attempt.questionIds.slice(0, 30).forEach(id => {
    attempt.answers[id] = nationalById[id].correctOptionId
  })
  const result = scoreAttempt(attempt, nationalById, nationalCategories)
  assert.deepEqual([result.correct, result.incorrect, result.unanswered, result.total, result.percentage], [30, 0, 10, 40, 75])
  assert.equal(result.items.filter(item => item.status === 'unanswered').length, 10)
})

check('banco nacional: un tema con menos de 40 preguntas usa solo las disponibles', () => {
  const speeds = nationalQuestions.filter(q => q.category === topicId('Velocidades'))
  assert.equal(speeds.length, 13)
  const attempt = createAttempt({ mode: 'simulation', label: 't', questions: speeds, sample: 40, random })
  assert.equal(attempt.questionIds.length, 13)
  assert.equal(new Set(attempt.questionIds).size, 13)
  assert.deepEqual(simulationOptions(national.quiz.simulationSizes, speeds.length), [10, 13])
  assert.equal(nationalCategories.length, 13)
  assert.equal(
    nationalCategories.reduce((sum, c) => sum + nationalQuestions.filter(q => q.category === c.id).length, 0),
    80
  )
})

check('banco nacional: objetivo de práctica del 80% sobre el largo real de la sesión', () => {
  assert.equal(national.quiz.practiceTarget, 80)
  assert.equal(national.quiz.passingPercentage, null)
  assert.equal(practiceTargetCount(80, 40), 32)
  assert.equal(practiceTargetCount(80, 15), 12)
  assert.equal(practiceTargetCount(80, 13), 11)
})

check('banco nacional: el orden mezclado se restaura igual desde el navegador', () => {
  const attempt = createAttempt({ mode: 'study', label: 't', questions: nationalQuestions, shuffleQuestions: true, shuffleOptions: true, random })
  attempt.index = 7
  const stored: StoredProgress = { version: 1, mistakes: [], attempt, lastResult: null }
  const restored = parseProgress(JSON.stringify(stored), nationalById)
  assert.deepEqual(restored.attempt, attempt)
  assert.equal(parseProgress(JSON.stringify(stored), byId).attempt, null, 'otro banco no puede restaurarlo')
})

check('banco nacional: está aislado del banco de Córdoba', () => {
  const cordobaIds = new Set(questions.map(q => q.id))
  assert.ok(nationalQuestions.every(q => !cordobaIds.has(q.id)))
  assert.ok(questions.every(q => q.legal === null))
  assert.notEqual(national.quiz.storageKey, cordoba.quiz.storageKey)
  assert.equal(national.quiz.storageKey, `autoescuelas:${nationalBank.bankId}:${nationalBank.schemaVersion}`)
  assert.equal(cordoba.quiz.questions.length, 106)
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
console.log(`Nacional B: ${nationalQuestions.length} preguntas, ${nationalCategories.length} temas.`)
