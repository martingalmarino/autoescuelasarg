"use client";

import { useState } from "react";
import { CheckCircle2, CircleDashed, ListChecks, RotateCcw, Target, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { practiceTargetCount, type AttemptResult, type QuestionStatus } from "@/lib/driving-tests/quiz";
import { cn } from "@/lib/utils";
import LegalBasisDetails from "./LegalBasisDetails";

interface QuizResultProps {
  result: AttemptResult;
  passingPercentage: number | null;
  practiceTarget: number | null;
  onRetryMistakes: () => void;
  onNewAttempt: (() => void) | null;
  onMenu: () => void;
}

type ReviewFilter = "all" | "incorrect" | "unanswered";

const STATUS: Record<QuestionStatus, { label: string; plural: string; icon: typeof CheckCircle2; className: string }> = {
  correct: { label: "Correcta", plural: "Correctas", icon: CheckCircle2, className: "text-emerald-700" },
  incorrect: { label: "Incorrecta", plural: "Incorrectas", icon: XCircle, className: "text-destructive" },
  unanswered: { label: "Sin responder", plural: "Sin responder", icon: CircleDashed, className: "text-muted-foreground" },
};

export default function QuizResult({
  result,
  passingPercentage,
  practiceTarget,
  onRetryMistakes,
  onNewAttempt,
  onMenu,
}: QuizResultProps) {
  const [filter, setFilter] = useState<ReviewFilter>("all");
  const mistakes = result.incorrect + result.unanswered;
  const passed = passingPercentage !== null && result.percentage >= passingPercentage;
  const target =
    practiceTarget !== null && result.mode === "simulation" && result.total > 0
      ? practiceTargetCount(practiceTarget, result.total)
      : null;
  const reachedTarget = target !== null && result.correct >= target;
  const filters: { id: ReviewFilter; label: string; count: number }[] = [
    { id: "all", label: "Todas", count: result.total },
    { id: "incorrect", label: "Incorrectas", count: result.incorrect },
    { id: "unanswered", label: "Sin responder", count: result.unanswered },
  ];
  const reviewItems = result.items
    .map((item, index) => ({ item, number: index + 1 }))
    .filter(({ item }) => filter === "all" || item.status === filter);

  return (
    <div className="space-y-6">
      <Card className="surface-card overflow-hidden">
        <CardContent className="p-5 sm:p-8 text-center">
          <p className="text-sm font-semibold text-primary mb-3">{result.label}</p>
          {passingPercentage !== null && (
            <p
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-semibold mb-3",
                passed ? "bg-emerald-50 text-emerald-700" : "bg-destructive/10 text-destructive"
              )}
            >
              {passed ? <CheckCircle2 className="h-4 w-4" aria-hidden="true" /> : <XCircle className="h-4 w-4" aria-hidden="true" />}
              {passed ? "Aprobado" : "No aprobado"}
            </p>
          )}
          <p className="font-display text-5xl sm:text-6xl font-extrabold text-foreground">
            {result.correct}
            <span className="text-2xl sm:text-3xl text-muted-foreground font-bold">/{result.total}</span>
          </p>
          <p className="mt-1 text-lg font-semibold text-foreground">{result.percentage}% de respuestas correctas</p>

          {target !== null && (
            <p
              className={cn(
                "mt-3 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-semibold",
                reachedTarget ? "bg-emerald-50 text-emerald-700" : "bg-muted text-foreground"
              )}
            >
              <Target className="h-4 w-4 shrink-0" aria-hidden="true" />
              Objetivo de práctica: {practiceTarget}% ({target} de {result.total}) ·{" "}
              {reachedTarget ? "alcanzado" : "todavía no alcanzado"}
            </p>
          )}

          <dl className="mt-6 grid grid-cols-3 gap-2 sm:gap-4 max-w-md mx-auto">
            {(["correct", "incorrect", "unanswered"] as const).map(status => {
              const { plural, icon: Icon, className } = STATUS[status];
              const value = result[status];
              return (
                <div key={status} className="rounded-lg bg-muted/60 px-2 py-3">
                  <dt
                    className={cn(
                      "flex flex-col items-center gap-0.5 text-xs font-medium sm:flex-row sm:justify-center sm:gap-1 sm:text-sm",
                      className
                    )}
                  >
                    <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                    {plural}
                  </dt>
                  <dd className="mt-1 text-2xl font-bold text-foreground">{value}</dd>
                </div>
              );
            })}
          </dl>

          {passingPercentage === null && (
            <p className="mt-5 text-sm text-muted-foreground max-w-md mx-auto">
              {target !== null
                ? "El objetivo de práctica es una referencia para entrenar, no el puntaje oficial de aprobación de ninguna jurisdicción."
                : "Es un puntaje de práctica: no hay un puntaje oficial de aprobación publicado para comparar."}
            </p>
          )}

          <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:justify-center">
            {mistakes > 0 && (
              <Button variant="signal" size="lg" onClick={onRetryMistakes}>
                <RotateCcw className="mr-2 h-4 w-4" />
                {result.unanswered > 0 ? `Repetir incorrectas y sin responder (${mistakes})` : `Repetir incorrectas (${mistakes})`}
              </Button>
            )}
            {onNewAttempt && (
              <Button variant={mistakes > 0 ? "outline" : "signal"} size="lg" onClick={onNewAttempt}>
                Nuevo intento
              </Button>
            )}
            <Button variant="outline" size="lg" onClick={onMenu}>
              Volver al menú
            </Button>
          </div>
        </CardContent>
      </Card>

      {result.categories.length > 0 && (
        <Card className="surface-card">
          <CardContent className="p-5 sm:p-6">
            <h2 className="text-lg font-bold text-foreground mb-4">Resultado por tema</h2>
            <ul className="space-y-3">
              {result.categories.map(category => (
                <li key={category.id}>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="font-medium text-foreground">{category.name}</span>
                    <span className="text-muted-foreground">
                      {category.correct} de {category.total}
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-muted overflow-hidden" aria-hidden="true">
                    <div className="h-full rounded-full bg-primary" style={{ width: `${(category.correct / category.total) * 100}%` }} />
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      <section aria-labelledby="repaso-respuestas">
        <h2 id="repaso-respuestas" className="flex items-center gap-2 text-xl font-bold text-foreground mb-4">
          <ListChecks className="h-5 w-5 text-primary" aria-hidden="true" />
          Repaso de tus respuestas
        </h2>
        {mistakes > 0 && (
          <div role="group" aria-label="Filtrar el repaso" className="mb-4 flex flex-wrap gap-2">
            {filters
              .filter(option => option.id === "all" || option.count > 0)
              .map(option => (
                <button
                  key={option.id}
                  type="button"
                  aria-pressed={filter === option.id}
                  onClick={() => setFilter(option.id)}
                  className={cn(
                    "min-h-[44px] rounded-full border-2 px-4 text-sm font-semibold transition-colors",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                    filter === option.id
                      ? "border-primary bg-accent text-primary"
                      : "border-border bg-card text-foreground hover:border-primary/50"
                  )}
                >
                  {option.label} ({option.count})
                </button>
              ))}
          </div>
        )}
        <ol className="space-y-3">
          {reviewItems.map(({ item, number }) => {
            const { label, icon: Icon, className } = STATUS[item.status];
            const selectedText = item.question.options.find(option => option.id === item.selectedOptionId)?.text;
            const correctText = item.question.options.find(option => option.id === item.question.correctOptionId)?.text;
            return (
              <li key={item.question.id}>
                <Card className="surface-card">
                  <CardContent className="p-4 sm:p-5">
                    <p className={cn("flex items-center gap-1.5 text-sm font-semibold mb-2", className)}>
                      <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                      {label}
                    </p>
                    <p className="font-semibold text-foreground mb-2">
                      {number}. {item.question.question}
                    </p>
                    <div className="space-y-1 text-sm">
                      {item.status === "incorrect" && (
                        <p className="text-muted-foreground">
                          Tu respuesta: <span className="text-destructive font-medium">{selectedText}</span>
                        </p>
                      )}
                      {item.status === "unanswered" && <p className="text-muted-foreground">No respondiste esta pregunta.</p>}
                      <p className="text-muted-foreground">
                        Respuesta correcta: <span className="font-medium text-emerald-700">{correctText}</span>
                      </p>
                      {item.question.explanation && <p className="text-muted-foreground">{item.question.explanation}</p>}
                    </div>
                    {item.question.legal && <LegalBasisDetails legal={item.question.legal} />}
                  </CardContent>
                </Card>
              </li>
            );
          })}
        </ol>
      </section>
    </div>
  );
}
