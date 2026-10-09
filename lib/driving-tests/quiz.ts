import type { TestCategory, TestQuestion } from './types'

export type QuizMode = 'study' | 'simulation' | 'review'

export interface Attempt {
  mode: QuizMode
  label: string
  questionIds: string[]
  /** Orden en que se muestran las opciones de cada pregunta, por ID de opción. */
  optionOrder: Record<string, string[]>
  /** En simulacro es la selección actual; en estudio y repaso, la respuesta ya confirmada. */
  answers: Record<string, string>
  index: number
}

export type QuestionStatus = 'correct' | 'incorrect' | 'unanswered'

export interface QuestionResult {
  question: TestQuestion
  selectedOptionId: string | null
  status: QuestionStatus
}

export interface CategoryResult {
  id: string
  name: string
  correct: number
  total: number
}

export interface AttemptResult {
  mode: QuizMode
  label: string
  total: number
  correct: number
  incorrect: number
  unanswered: number
  percentage: number
  items: QuestionResult[]
  categories: CategoryResult[]
}

export interface ResultSummary {
  mode: QuizMode
  label: string
  correct: number
  total: number
  percentage: number
  finishedAt: number
}

export interface StoredProgress {
  version: 1
  mistakes: string[]
  attempt: Attempt | null
  lastResult: ResultSummary | null
}

export const STUDY_BLOCK_SIZE = 20

const MODES: QuizMode[] = ['study', 'simulation', 'review']
const MIN_CATEGORY_SIZE_FOR_BREAKDOWN = 3

export const emptyProgress = (): StoredProgress => ({ version: 1, mistakes: [], attempt: null, lastResult: null })

export function shuffle<T>(items: T[], random: () => number = Math.random): T[] {
  const copy = items.slice()
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1))
    const tmp = copy[i]
    copy[i] = copy[j]
    copy[j] = tmp
  }
  return copy
}

/** Divide en partes de hasta `max` elementos, lo más parejas posible (21 con máximo 20 da 11 y 10). */
export function chunk<T>(items: T[], max: number): T[][] {
  if (items.length === 0) return []
  const size = Math.ceil(items.length / Math.ceil(items.length / max))
  const parts: T[][] = []
  for (let i = 0; i < items.length; i += size) parts.push(items.slice(i, i + size))
  return parts
}

/** Tamaños de simulacro posibles con el banco disponible, sin repetir ni superar la cantidad de preguntas. */
export function simulationOptions(sizes: number[], available: number): number[] {
  return sizes
    .map(size => Math.min(size, available))
    .filter((size, index, list) => size > 0 && list.indexOf(size) === index)
}

export function uniqueIds(ids: string[]): string[] {
  const seen: Record<string, true> = {}
  return ids.filter(id => (seen[id] ? false : (seen[id] = true)))
}

export function indexQuestions(questions: TestQuestion[]): Record<string, TestQuestion> {
  const byId: Record<string, TestQuestion> = {}
  questions.forEach(question => {
    byId[question.id] = question
  })
  return byId
}

interface CreateAttemptOptions {
  mode: QuizMode
  label: string
  questions: TestQuestion[]
  /** Si se indica, toma esa cantidad al azar sin repetir; nunca más que las disponibles. */
  sample?: number
  shuffleOptions?: boolean
  random?: () => number
}

export function createAttempt({
  mode,
  label,
  questions,
  sample,
  shuffleOptions = false,
  random = Math.random,
}: CreateAttemptOptions): Attempt {
  const unique = uniqueIds(questions.map(question => question.id))
  const byId = indexQuestions(questions)
  const selected = sample === undefined ? unique : shuffle(unique, random).slice(0, Math.min(sample, unique.length))
  const optionOrder: Record<string, string[]> = {}
  selected.forEach(id => {
    const ids = byId[id].options.map(option => option.id)
    optionOrder[id] = shuffleOptions ? shuffle(ids, random) : ids
  })
  return { mode, label, questionIds: selected, optionOrder, answers: {}, index: 0 }
}

export function scoreAttempt(
  attempt: Attempt,
  byId: Record<string, TestQuestion>,
  categories: TestCategory[]
): AttemptResult {
  const items: QuestionResult[] = attempt.questionIds.map(id => {
    const question = byId[id]
    const selectedOptionId = attempt.answers[id] ?? null
    const status: QuestionStatus =
      selectedOptionId === null ? 'unanswered' : selectedOptionId === question.correctOptionId ? 'correct' : 'incorrect'
    return { question, selectedOptionId, status }
  })

  const count = (status: QuestionStatus) => items.filter(item => item.status === status).length
  const total = items.length
  const correct = count('correct')

  const categoryResults = categories
    .map(category => {
      const inCategory = items.filter(item => item.question.category === category.id)
      return {
        id: category.id,
        name: category.name,
        total: inCategory.length,
        correct: inCategory.filter(item => item.status === 'correct').length,
      }
    })
    .filter(category => category.total >= MIN_CATEGORY_SIZE_FOR_BREAKDOWN)

  return {
    mode: attempt.mode,
    label: attempt.label,
    total,
    correct,
    incorrect: count('incorrect'),
    unanswered: count('unanswered'),
    percentage: total > 0 ? Math.round((correct / total) * 100) : 0,
    items,
    categories: categoryResults.length >= 2 ? categoryResults : [],
  }
}

/** Las correctas salen de la lista de errores; las incorrectas y sin responder entran. */
export function updateMistakes(mistakes: string[], result: AttemptResult): string[] {
  const solved: Record<string, true> = {}
  const failed: string[] = []
  result.items.forEach(item => {
    if (item.status === 'correct') solved[item.question.id] = true
    else failed.push(item.question.id)
  })
  return uniqueIds(mistakes.filter(id => !solved[id]).concat(failed))
}

export function summarize(result: AttemptResult, finishedAt = Date.now()): ResultSummary {
  return {
    mode: result.mode,
    label: result.label,
    correct: result.correct,
    total: result.total,
    percentage: result.percentage,
    finishedAt,
  }
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value)

function sameMembers(a: string[], b: string[]) {
  return a.length === b.length && a.every(id => b.indexOf(id) !== -1)
}

function parseAttempt(value: unknown, byId: Record<string, TestQuestion>): Attempt | null {
  if (!isRecord(value)) return null
  const { mode, label, questionIds, optionOrder, answers, index } = value
  if (typeof mode !== 'string' || MODES.indexOf(mode as QuizMode) === -1) return null
  if (typeof label !== 'string' || !Array.isArray(questionIds) || questionIds.length === 0) return null
  if (!isRecord(optionOrder) || !isRecord(answers)) return null

  const ids = questionIds.filter((id): id is string => typeof id === 'string' && Boolean(byId[id]))
  if (ids.length !== questionIds.length || uniqueIds(ids).length !== ids.length) return null

  const order: Record<string, string[]> = {}
  const restoredAnswers: Record<string, string> = {}
  for (const id of ids) {
    const optionIds = byId[id].options.map(option => option.id)
    const saved = optionOrder[id]
    if (!Array.isArray(saved) || !sameMembers(saved as string[], optionIds)) return null
    order[id] = saved as string[]
    const answer = answers[id]
    if (typeof answer === 'string' && optionIds.indexOf(answer) !== -1) restoredAnswers[id] = answer
  }

  const position = typeof index === 'number' && Number.isInteger(index) ? index : 0
  return {
    mode: mode as QuizMode,
    label,
    questionIds: ids,
    optionOrder: order,
    answers: restoredAnswers,
    index: Math.min(Math.max(position, 0), ids.length - 1),
  }
}

function parseSummary(value: unknown): ResultSummary | null {
  if (!isRecord(value)) return null
  const { mode, label, correct, total, percentage, finishedAt } = value
  if (typeof mode !== 'string' || MODES.indexOf(mode as QuizMode) === -1 || typeof label !== 'string') return null
  if ([correct, total, percentage, finishedAt].some(n => typeof n !== 'number')) return null
  return value as unknown as ResultSummary
}

/** Descarta lo que no se pueda leer y los IDs que ya no están en el banco habilitado. */
export function parseProgress(raw: string | null, byId: Record<string, TestQuestion>): StoredProgress {
  if (!raw) return emptyProgress()
  let data: unknown
  try {
    data = JSON.parse(raw)
  } catch {
    return emptyProgress()
  }
  if (!isRecord(data) || data.version !== 1) return emptyProgress()

  const mistakes = Array.isArray(data.mistakes)
    ? uniqueIds(data.mistakes.filter((id): id is string => typeof id === 'string' && Boolean(byId[id])))
    : []
  return {
    version: 1,
    mistakes,
    attempt: parseAttempt(data.attempt, byId),
    lastResult: parseSummary(data.lastResult),
  }
}

export function loadProgress(key: string, byId: Record<string, TestQuestion>): StoredProgress {
  try {
    return parseProgress(window.localStorage.getItem(key), byId)
  } catch {
    return emptyProgress()
  }
}

export function saveProgress(key: string, progress: StoredProgress): boolean {
  try {
    window.localStorage.setItem(key, JSON.stringify(progress))
    return true
  } catch {
    return false
  }
}

export function clearProgress(key: string) {
  try {
    window.localStorage.removeItem(key)
  } catch {
    // Sin acceso al almacenamiento no hay nada que borrar.
  }
}
