"use client";

import { CheckCircle2, CircleDashed, ListChecks, RotateCcw, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { AttemptResult, QuestionStatus } from "@/lib/driving-tests/quiz";
import { cn } from "@/lib/utils";

interface QuizResultProps {
  result: AttemptResult;
  passingPercentage: number | null;
  onRetryMistakes: () => void;
  onNewTest: () => void;
}

const STATUS: Record<QuestionStatus, { label: string; plural: string; icon: typeof CheckCircle2; className: string }> = {
  correct: { label: "Correcta", plural: "Correctas", icon: CheckCircle2, className: "text-emerald-700" },
  incorrect: { label: "Incorrecta", plural: "Incorrectas", icon: XCircle, className: "text-destructive" },
  unanswered: { label: "Sin responder", plural: "Sin responder", icon: CircleDashed, className: "text-muted-foreground" },
};

export default function QuizResult({ result, passingPercentage, onRetryMistakes, onNewTest }: QuizResultProps) {
  const mistakes = result.incorrect + result.unanswered;
  const passed = passingPercentage !== null && result.percentage >= passingPercentage;

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
              Es un puntaje de práctica: no hay un puntaje oficial de aprobación publicado para comparar.
            </p>
          )}

          <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center">
            {mistakes > 0 && (
              <Button variant="signal" size="lg" onClick={onRetryMistakes}>
                <RotateCcw className="mr-2 h-4 w-4" />
                Repasar {mistakes === 1 ? "el error" : `los ${mistakes} errores`}
              </Button>
            )}
            <Button variant={mistakes > 0 ? "outline" : "signal"} size="lg" onClick={onNewTest}>
              Hacer otro test
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
        <ol className="space-y-3">
          {result.items.map((item, index) => {
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
                      {index + 1}. {item.question.question}
                    </p>
                    <div className="space-y-1 text-sm">
                      {item.status === "incorrect" && (
                        <p className="text-muted-foreground">
                          Tu respuesta: <span className="text-destructive font-medium">{selectedText}</span>
                        </p>
                      )}
                      <p className="text-muted-foreground">
                        Respuesta correcta: <span className="font-medium text-emerald-700">{correctText}</span>
                      </p>
                      {item.question.explanation && <p className="text-muted-foreground">{item.question.explanation}</p>}
                    </div>
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
