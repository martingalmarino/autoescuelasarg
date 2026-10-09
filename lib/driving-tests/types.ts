export interface QuestionOption {
  id: string
  text: string
}

export interface TestQuestion {
  id: string
  question: string
  options: QuestionOption[]
  correctOptionId: string
  explanation: string | null
  category: string | null
}

export interface TestCategory {
  id: string
  name: string
}

export interface StudyBlock {
  id: string
  name: string
  questionIds: string[]
}

export interface TestSource {
  label: string
  url: string
}

/** Lo que necesita el componente interactivo; se serializa del servidor al cliente. */
export interface QuizData {
  /** Clave para el progreso guardado en el navegador; cambiar la versión descarta el progreso anterior. */
  storageKey: string
  questions: TestQuestion[]
  categories: TestCategory[]
  studyBlocks: StudyBlock[]
  simulationSizes: number[]
  defaultSimulationSize: number
  /** Solo si existe un puntaje oficial verificado; si es null no se informa aprobado o desaprobado. */
  passingPercentage: number | null
}

export interface DrivingTest {
  slug: string
  /** Nombre del test en el índice, breadcrumbs y enlaces. */
  title: string
  heading: string
  metaTitle: string
  /** Se usa como meta description y en la tarjeta del índice. */
  description: string
  /** Párrafos que se muestran debajo del test. */
  intro: string[]
  tags: string[]
  notice: string | null
  sources: TestSource[]
  quiz: QuizData
}
