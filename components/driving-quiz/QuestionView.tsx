"use client";

import { useEffect, useRef } from "react";
import { AlertTriangle, ArrowLeft, ArrowRight, CheckCircle2, LogOut, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { Attempt } from "@/lib/driving-tests/quiz";
import type { TestQuestion } from "@/lib/driving-tests/types";
import { cn } from "@/lib/utils";
import LegalBasisDetails from "./LegalBasisDetails";

interface QuestionViewProps {
  bankName: string;
  attempt: Attempt;
  question: TestQuestion;
  draft: string | null;
  showSubmitNotice: boolean;
  onSelect: (optionId: string) => void;
  onConfirm: () => void;
  onGoTo: (index: number) => void;
  onFinish: () => void;
  onCancelSubmit: () => void;
  onSubmit: () => void;
  onExit: () => void;
}

export default function QuestionView({
  bankName,
  attempt,
  question,
  draft,
  showSubmitNotice,
  onSelect,
  onConfirm,
  onGoTo,
  onFinish,
  onCancelSubmit,
  onSubmit,
  onExit,
}: QuestionViewProps) {
  const isSimulation = attempt.mode === "simulation";
  const total = attempt.questionIds.length;
  const isLast = attempt.index === total - 1;
  const saved = attempt.answers[question.id] ?? null;
  const confirmed = !isSimulation && saved !== null;
  const selected = isSimulation || confirmed ? saved : draft;
  const answeredCount = attempt.questionIds.filter(id => attempt.answers[id] !== undefined).length;
  const unanswered = total - answeredCount;
  const isCorrect = confirmed && saved === question.correctOptionId;
  const statusRef = useRef<HTMLParagraphElement>(null);
  const advanceRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    statusRef.current?.focus({ preventScroll: true });
  }, [question.id]);

  const confirmAndFocus = () => {
    onConfirm();
    requestAnimationFrame(() => advanceRef.current?.focus({ preventScroll: true }));
  };
  const optionText = (id: string) => question.options.find(option => option.id === id)?.text ?? "";
  const orderedOptions = attempt.optionOrder[question.id].map(id => ({ id, text: optionText(id) }));
  const correctText = optionText(question.correctOptionId);

  return (
    <Card className="surface-card">
      <CardContent className="p-4 sm:p-8">
        <div className="flex items-center justify-between gap-3 mb-4">
          <div className="min-w-0">
            <p className="text-xs font-medium text-muted-foreground">{bankName}</p>
            <p className="text-sm font-semibold text-primary">{attempt.label}</p>
          </div>
          <Button variant="ghost" size="sm" onClick={onExit} className="shrink-0 text-muted-foreground">
            <LogOut className="mr-1.5 h-4 w-4" />
            Salir
          </Button>
        </div>

        <div className="mb-6">
          <div className="flex items-center justify-between text-sm mb-2">
            <p ref={statusRef} tabIndex={-1} className="font-semibold text-foreground outline-none">
              Pregunta {attempt.index + 1} de {total}
            </p>
            <span className="text-right text-muted-foreground">
              {answeredCount} {answeredCount === 1 ? "respondida" : "respondidas"}
              {isSimulation && ` · ${unanswered} sin responder`}
            </span>
          </div>
          <div
            className="h-2 rounded-full bg-muted overflow-hidden"
            role="progressbar"
            aria-label="Preguntas respondidas"
            aria-valuemin={0}
            aria-valuemax={total}
            aria-valuenow={answeredCount}
          >
            <div
              className="h-full rounded-full bg-signal transition-[width] duration-300"
              style={{ width: `${(answeredCount / total) * 100}%` }}
            />
          </div>
        </div>

        <fieldset key={question.id}>
          <legend className="font-display text-lg sm:text-xl font-bold leading-snug text-foreground mb-5">
            {question.question}
          </legend>
          <div className="grid gap-3">
            {orderedOptions.map((option, position) => {
              const isAnswer = option.id === question.correctOptionId;
              const isChosen = option.id === selected;
              const showCorrect = confirmed && isAnswer;
              const showWrong = confirmed && isChosen && !isAnswer;
              return (
                <label
                  key={option.id}
                  className={cn(
                    "flex min-h-[44px] w-full items-start gap-3 rounded-lg border-2 px-3 sm:px-4 py-3 text-base transition-colors",
                    "has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ring has-[:focus-visible]:ring-offset-2",
                    !confirmed && "cursor-pointer hover:border-primary/50 hover:bg-accent",
                    !confirmed && isChosen ? "border-primary bg-accent" : "border-border bg-card",
                    showCorrect && "border-emerald-600 bg-emerald-50",
                    showWrong && "border-destructive bg-destructive/10",
                    confirmed && !isAnswer && !isChosen && "text-muted-foreground"
                  )}
                >
                  <input
                    type="radio"
                    name={`respuesta-${question.id}`}
                    value={option.id}
                    checked={isChosen}
                    disabled={confirmed}
                    onChange={() => onSelect(option.id)}
                    className="sr-only"
                  />
                  <span
                    aria-hidden="true"
                    className={cn(
                      "mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-xs font-bold",
                      showCorrect
                        ? "border-emerald-600 bg-emerald-600 text-white"
                        : showWrong
                          ? "border-destructive bg-destructive text-white"
                          : isChosen
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-border text-muted-foreground"
                    )}
                  >
                    {String.fromCharCode(65 + position)}
                  </span>
                  <span className="flex-1">
                    {option.text}
                    {showCorrect && (
                      <span className="mt-1 flex items-center gap-1 text-sm font-semibold text-emerald-700">
                        <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                        Respuesta correcta
                      </span>
                    )}
                    {showWrong && (
                      <span className="mt-1 flex items-center gap-1 text-sm font-semibold text-destructive">
                        <XCircle className="h-4 w-4" aria-hidden="true" />
                        Tu respuesta
                      </span>
                    )}
                  </span>
                </label>
              );
            })}
          </div>
        </fieldset>

        <div aria-live="polite">
          {confirmed && (
            <div
              className={cn(
                "mt-5 rounded-lg p-4 text-sm sm:text-base",
                isCorrect ? "bg-emerald-50 text-emerald-950" : "bg-destructive/10 text-foreground"
              )}
            >
              <p className={cn("flex items-center gap-2 font-semibold", isCorrect ? "text-emerald-700" : "text-destructive")}>
                {isCorrect ? <CheckCircle2 className="h-4 w-4" aria-hidden="true" /> : <XCircle className="h-4 w-4" aria-hidden="true" />}
                {isCorrect ? "¡Correcto!" : "Incorrecto"}
              </p>
              {!isCorrect && (
                <p className="mt-1">
                  La respuesta correcta es: <strong>{correctText}</strong>
                </p>
              )}
              {question.explanation && <p className="mt-1">{question.explanation}</p>}
              {question.legal && <LegalBasisDetails legal={question.legal} />}
            </div>
          )}
        </div>

        {showSubmitNotice ? (
          <div role="alertdialog" aria-labelledby="aviso-entrega" className="mt-6 rounded-lg border-2 border-signal bg-signal/10 p-4">
            <p id="aviso-entrega" className="flex items-start gap-2 font-semibold text-foreground">
              <AlertTriangle className="h-5 w-5 shrink-0 text-signal-foreground" aria-hidden="true" />
              {unanswered === 1 ? "Te queda 1 pregunta sin responder." : `Te quedan ${unanswered} preguntas sin responder.`}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">Las preguntas sin responder no suman puntos y cuentan como no acertadas.</p>
            <div className="mt-4 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <Button variant="outline" onClick={onCancelSubmit}>
                Volver a responder
              </Button>
              <Button onClick={onSubmit}>{isSimulation ? "Entregar igual" : "Terminar igual"}</Button>
            </div>
          </div>
        ) : (
          <div className="mt-6 flex flex-wrap items-center gap-2">
            <Button variant="outline" onClick={() => onGoTo(attempt.index - 1)} disabled={attempt.index === 0}>
              <ArrowLeft className="mr-1.5 h-4 w-4" />
              Anterior
            </Button>
            <div className="ml-auto flex flex-wrap justify-end gap-2">
              {!isSimulation && !confirmed && (
                <>
                  {!isLast && (
                    <Button variant="ghost" onClick={() => onGoTo(attempt.index + 1)}>
                      Saltear
                    </Button>
                  )}
                  <Button onClick={confirmAndFocus} disabled={draft === null}>
                    Confirmar respuesta
                  </Button>
                </>
              )}
              {(isSimulation || confirmed) && !isLast && (
                <Button ref={advanceRef} onClick={() => onGoTo(attempt.index + 1)}>
                  Siguiente
                  <ArrowRight className="ml-1.5 h-4 w-4" />
                </Button>
              )}
              {isLast && (isSimulation || confirmed) && (
                <Button ref={advanceRef} variant="signal" onClick={onFinish}>
                  {isSimulation ? "Entregar test" : "Ver resultados"}
                </Button>
              )}
              {isLast && !isSimulation && !confirmed && (
                <Button variant="outline" onClick={onFinish}>
                  Terminar
                </Button>
              )}
            </div>
          </div>
        )}

        {isSimulation && !showSubmitNotice && (
          <nav aria-label="Ir a una pregunta" className="mt-6 border-t border-border pt-5">
            <ol className="flex flex-wrap gap-1.5">
              {attempt.questionIds.map((id, index) => {
                const answered = attempt.answers[id] !== undefined;
                const current = index === attempt.index;
                return (
                  <li key={id}>
                    <button
                      type="button"
                      onClick={() => onGoTo(index)}
                      aria-current={current ? "step" : undefined}
                      aria-label={`Pregunta ${index + 1}${answered ? ", respondida" : ", sin responder"}`}
                      className={cn(
                        "h-9 w-9 rounded-md border text-sm font-semibold transition-colors",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                        current
                          ? "border-navy bg-navy text-white"
                          : answered
                            ? "border-primary/30 bg-accent text-primary"
                            : "border-border bg-card text-muted-foreground hover:border-primary/50"
                      )}
                    >
                      {index + 1}
                    </button>
                  </li>
                );
              })}
            </ol>
            <div className="mt-4 flex justify-end">
              {!isLast && (
                <Button variant="outline" size="sm" onClick={onFinish}>
                  Entregar test
                </Button>
              )}
            </div>
          </nav>
        )}
      </CardContent>
    </Card>
  );
}
