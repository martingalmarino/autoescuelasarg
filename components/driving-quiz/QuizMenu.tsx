"use client";

import { useState } from "react";
import { ArrowRight, BookOpen, ClipboardCheck, PlayCircle, RotateCcw, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { STUDY_BLOCK_SIZE, chunk, simulationOptions, type Attempt, type ResultSummary } from "@/lib/driving-tests/quiz";
import type { QuizData, TestQuestion } from "@/lib/driving-tests/types";
import { cn } from "@/lib/utils";

interface QuizMenuProps {
  quiz: QuizData;
  pending: Attempt | null;
  mistakesCount: number;
  lastResult: ResultSummary | null;
  storageAvailable: boolean;
  onResume: () => void;
  onDiscard: () => void;
  onStudy: (label: string, questions: TestQuestion[]) => void;
  onSimulation: (size: number) => void;
  onReview: () => void;
  onClear: () => void;
}

const chipClass =
  "inline-flex min-h-[44px] items-center justify-between gap-3 rounded-lg border border-border bg-card px-3 py-2 text-left text-sm font-medium text-foreground transition-colors hover:border-primary/50 hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2";

export default function QuizMenu({
  quiz,
  pending,
  mistakesCount,
  lastResult,
  storageAvailable,
  onResume,
  onDiscard,
  onStudy,
  onSimulation,
  onReview,
  onClear,
}: QuizMenuProps) {
  const sizes = simulationOptions(quiz.simulationSizes, quiz.questions.length);
  const [size, setSize] = useState(
    sizes.indexOf(Math.min(quiz.defaultSimulationSize, quiz.questions.length)) !== -1
      ? Math.min(quiz.defaultSimulationSize, quiz.questions.length)
      : sizes[sizes.length - 1]
  );
  const byId: Record<string, TestQuestion> = {};
  quiz.questions.forEach(question => {
    byId[question.id] = question;
  });
  const blocks =
    quiz.studyBlocks.length > 0
      ? quiz.studyBlocks.map(block => ({ id: block.id, name: block.name, questions: block.questionIds.map(id => byId[id]) }))
      : chunk(quiz.questions, STUDY_BLOCK_SIZE).map((questions, index) => ({
          id: `bloque-${index + 1}`,
          name: `Bloque ${index + 1}`,
          questions,
        }));
  const categoryParts: { id: string; name: string; questions: TestQuestion[] }[] = [];
  quiz.categories.forEach(category => {
    const parts = chunk(
      quiz.questions.filter(question => question.category === category.id),
      STUDY_BLOCK_SIZE
    );
    parts.forEach((questions, index) => {
      categoryParts.push({
        id: `${category.id}-${index}`,
        name: parts.length > 1 ? `${category.name} (parte ${index + 1})` : category.name,
        questions,
      });
    });
  });
  const largestRequested = Math.max(...quiz.simulationSizes);

  return (
    <div className="space-y-5">
      {pending && (
        <Card className="border-2 border-signal bg-signal/10 shadow-none">
          <CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
            <div>
              <p className="font-semibold text-foreground">Tenés un test sin terminar</p>
              <p className="text-sm text-muted-foreground">
                {pending.label} · pregunta {pending.index + 1} de {pending.questionIds.length}
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={onDiscard}>
                Descartar
              </Button>
              <Button onClick={onResume}>
                Continuar
                <ArrowRight className="ml-1.5 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="surface-card">
        <CardContent className="p-5 sm:p-6">
          <div className="flex items-start gap-3 mb-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-navy">
              <BookOpen className="h-5 w-5 text-signal" aria-hidden="true" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-foreground">Modo estudio</h2>
              <p className="text-sm text-muted-foreground">
                Bloques de hasta {STUDY_BLOCK_SIZE} preguntas. Confirmás cada respuesta y ves la corrección al instante.
              </p>
            </div>
          </div>
          <div className="grid gap-2 grid-cols-1 min-[400px]:grid-cols-2 sm:grid-cols-3">
            {blocks.map(block => (
              <button key={block.id} type="button" className={chipClass} onClick={() => onStudy(block.name, block.questions)}>
                <span>{block.name}</span>
                <span className="text-xs text-muted-foreground">{block.questions.length} preg.</span>
              </button>
            ))}
          </div>
          {categoryParts.length > 0 && (
            <>
              <h3 className="mt-5 mb-2 text-sm font-semibold text-foreground">O estudiá por tema</h3>
              <div className="grid gap-2 grid-cols-1 sm:grid-cols-2">
                {categoryParts.map(part => (
                  <button
                    key={part.id}
                    type="button"
                    className={chipClass}
                    onClick={() => onStudy(part.name, part.questions)}
                  >
                    <span>{part.name}</span>
                    <span className="text-xs text-muted-foreground">{part.questions.length} preg.</span>
                  </button>
                ))}
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <Card className="surface-card">
        <CardContent className="p-5 sm:p-6">
          <div className="flex items-start gap-3 mb-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-navy">
              <ClipboardCheck className="h-5 w-5 text-signal" aria-hidden="true" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-foreground">Simulacro</h2>
              <p className="text-sm text-muted-foreground">
                Preguntas al azar con las opciones mezcladas. Podés volver atrás y cambiar respuestas; la corrección
                aparece al entregar.
              </p>
            </div>
          </div>
          <fieldset>
            <legend className="mb-2 text-sm font-semibold text-foreground">Cantidad de preguntas</legend>
            <div className="flex flex-wrap gap-2">
              {sizes.map(option => (
                <label
                  key={option}
                  className={cn(
                    "inline-flex min-h-[44px] min-w-[64px] cursor-pointer items-center justify-center rounded-lg border-2 px-4 text-sm font-semibold transition-colors",
                    "has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ring has-[:focus-visible]:ring-offset-2",
                    size === option ? "border-primary bg-accent text-primary" : "border-border bg-card text-foreground hover:border-primary/50"
                  )}
                >
                  <input
                    type="radio"
                    name="cantidad-simulacro"
                    value={option}
                    checked={size === option}
                    onChange={() => setSize(option)}
                    className="sr-only"
                  />
                  {option}
                </label>
              ))}
            </div>
          </fieldset>
          {largestRequested > quiz.questions.length && (
            <p className="mt-2 text-xs text-muted-foreground">
              El banco tiene {quiz.questions.length} preguntas, así que el simulacro más largo usa todas.
            </p>
          )}
          <Button variant="signal" size="lg" className="mt-5 w-full sm:w-auto" onClick={() => onSimulation(size)}>
            <PlayCircle className="mr-2 h-4 w-4" />
            Empezar simulacro
          </Button>
        </CardContent>
      </Card>

      <Card className="surface-card">
        <CardContent className="p-5 sm:p-6">
          <div className="flex items-start gap-3 mb-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-navy">
              <RotateCcw className="h-5 w-5 text-signal" aria-hidden="true" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-foreground">Repasar errores</h2>
              <p className="text-sm text-muted-foreground">
                {mistakesCount > 0
                  ? `Tenés ${mistakesCount} ${mistakesCount === 1 ? "pregunta" : "preguntas"} para repasar entre las que fallaste o dejaste sin responder.`
                  : "Cuando falles o dejes preguntas sin responder, vas a poder repasarlas acá."}
              </p>
            </div>
          </div>
          <Button variant="outline" onClick={onReview} disabled={mistakesCount === 0}>
            Repasar mis errores
          </Button>
        </CardContent>
      </Card>

      <div className="flex flex-col gap-2 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <p>
          {!storageAvailable
            ? "Tu navegador no permite guardar el progreso: el test funciona igual, pero se pierde al cerrar la página."
            : lastResult
              ? `Último resultado: ${lastResult.label}, ${lastResult.correct} de ${lastResult.total} (${lastResult.percentage}%).`
              : "Tu progreso se guarda solo en este navegador."}
        </p>
        {storageAvailable && (pending || mistakesCount > 0 || lastResult) && (
          <Button variant="ghost" size="sm" onClick={onClear} className="self-start sm:self-auto">
            <Trash2 className="mr-1.5 h-4 w-4" />
            Borrar mi progreso
          </Button>
        )}
      </div>
    </div>
  );
}
