export interface QuestionOption {
  id: string
  text: string
}

export interface LegalBasis {
  /** Artículo o inciso, tal como figura en el banco (por ejemplo "Art. 51, inciso a.1."). */
  reference: string
  source: TestSource
}

export interface TestQuestion {
  id: string
  question: string
  options: QuestionOption[]
  correctOptionId: string
  explanation: string | null
  category: string | null
  legal: LegalBasis | null
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
  /** Nombre del banco que se muestra durante el test. */
  bankName: string
  questions: TestQuestion[]
  categories: TestCategory[]
  studyBlocks: StudyBlock[]
  simulationSizes: number[]
  defaultSimulationSize: number
  /** Solo si existe un puntaje oficial verificado; si es null no se informa aprobado o desaprobado. */
  passingPercentage: number | null
  /** Porcentaje orientativo para los simulacros; se muestra como "Objetivo de práctica", nunca como aprobado. */
  practiceTarget: number | null
  /** Mezcla el orden de preguntas y opciones también en modo estudio y repaso. */
  shuffleStudy: boolean
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
  /** Fecha de revisión editorial (AAAA-MM-DD); no implica que el contenido siga vigente. */
  reviewedAt: string | null
  sources: TestSource[]
  quiz: QuizData
}
