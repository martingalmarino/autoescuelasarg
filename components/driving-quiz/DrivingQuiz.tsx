"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { trackEvent } from "@/lib/analytics";
import {
  clearProgress,
  createAttempt,
  emptyProgress,
  indexQuestions,
  loadProgress,
  saveProgress,
  scoreAttempt,
  summarize,
  updateMistakes,
  type Attempt,
  type AttemptResult,
  type StoredProgress,
} from "@/lib/driving-tests/quiz";
import type { QuizData, TestQuestion } from "@/lib/driving-tests/types";
import QuestionView from "./QuestionView";
import QuizMenu from "./QuizMenu";
import QuizResult from "./QuizResult";

interface DrivingQuizProps {
  testSlug: string;
  quiz: QuizData;
}

type View = "menu" | "attempt" | "result";

const HEADER_OFFSET = 72;

export default function DrivingQuiz({ testSlug, quiz }: DrivingQuizProps) {
  const byId = useMemo(() => indexQuestions(quiz.questions), [quiz.questions]);
  const [progress, setProgress] = useState<StoredProgress>(emptyProgress);
  const [loaded, setLoaded] = useState(false);
  const [storageAvailable, setStorageAvailable] = useState(true);
  const [view, setView] = useState<View>("menu");
  const [result, setResult] = useState<AttemptResult | null>(null);
  const [draft, setDraft] = useState<string | null>(null);
  const [submitNotice, setSubmitNotice] = useState(false);
  const topRef = useRef<HTMLDivElement>(null);

  const attempt = progress.attempt;
  const question = attempt ? byId[attempt.questionIds[attempt.index]] : null;

  useEffect(() => {
    setProgress(loadProgress(quiz.storageKey, byId));
    setLoaded(true);
  }, [quiz.storageKey, byId]);

  useEffect(() => {
    if (loaded && !saveProgress(quiz.storageKey, progress)) setStorageAvailable(false);
  }, [loaded, progress, quiz.storageKey]);

  useEffect(() => {
    const top = topRef.current?.getBoundingClientRect().top;
    if (top !== undefined && (top < HEADER_OFFSET || top > window.innerHeight * 0.6)) {
      topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [view, attempt?.index]);

  const updateAttempt = (update: (current: Attempt) => Attempt) =>
    setProgress(previous => (previous.attempt ? { ...previous, attempt: update(previous.attempt) } : previous));

  const start = (next: Attempt) => {
    const unfinished = progress.attempt && Object.keys(progress.attempt.answers).length > 0;
    if (unfinished && !window.confirm("Tenés un test sin terminar. Si empezás otro, se descartan esas respuestas. ¿Querés seguir?")) {
      return;
    }
    setProgress(previous => ({ ...previous, attempt: next }));
    setDraft(null);
    setSubmitNotice(false);
    setResult(null);
    setView("attempt");
    trackEvent({ event: "driving_test_start", properties: { test: testSlug, mode: next.mode } });
  };

  const startStudy = (label: string, questions: TestQuestion[]) =>
    start(createAttempt({ mode: "study", label: `Estudio · ${label}`, questions }));

  const startSimulation = (size: number) =>
    start(
      createAttempt({
        mode: "simulation",
        label: `Simulacro de ${Math.min(size, quiz.questions.length)} preguntas`,
        questions: quiz.questions,
        sample: size,
        shuffleOptions: true,
      })
    );

  const startReview = (ids: string[]) =>
    start(
      createAttempt({
        mode: "review",
        label: "Repaso de errores",
        questions: ids.filter(id => byId[id]).map(id => byId[id]),
      })
    );

  const select = (optionId: string) => {
    if (!attempt || !question) return;
    if (attempt.mode === "simulation") {
      updateAttempt(current => ({ ...current, answers: { ...current.answers, [question.id]: optionId } }));
    } else if (attempt.answers[question.id] === undefined) {
      setDraft(optionId);
    }
  };

  const confirm = () => {
    if (!question || draft === null) return;
    updateAttempt(current =>
      current.answers[question.id] !== undefined
        ? current
        : { ...current, answers: { ...current.answers, [question.id]: draft } }
    );
    setDraft(null);
  };

  const goTo = (index: number) => {
    if (!attempt || index < 0 || index >= attempt.questionIds.length) return;
    updateAttempt(current => ({ ...current, index }));
    setDraft(null);
    setSubmitNotice(false);
  };

  const submit = () => {
    if (!attempt) return;
    const scored = scoreAttempt(attempt, byId, quiz.categories);
    setProgress(previous => ({
      ...previous,
      attempt: null,
      mistakes: updateMistakes(previous.mistakes, scored),
      lastResult: summarize(scored),
    }));
    setResult(scored);
    setSubmitNotice(false);
    setDraft(null);
    setView("result");
    trackEvent({ event: "driving_test_complete", properties: { test: testSlug, mode: scored.mode, questions: scored.total } });
  };

  const finish = () => {
    if (!attempt) return;
    const unanswered = attempt.questionIds.filter(id => attempt.answers[id] === undefined).length;
    if (unanswered > 0) setSubmitNotice(true);
    else submit();
  };

  const exit = () => {
    if (attempt && Object.keys(attempt.answers).length === 0) {
      setProgress(previous => ({ ...previous, attempt: null }));
    }
    setDraft(null);
    setSubmitNotice(false);
    setView("menu");
  };

  const discard = () => {
    if (!window.confirm("¿Descartar el test sin terminar? Vas a perder las respuestas de ese intento.")) return;
    setProgress(previous => ({ ...previous, attempt: null }));
  };

  const clear = () => {
    if (!window.confirm("¿Borrar todo tu progreso en este navegador? Incluye el test sin terminar, tus errores y el último resultado.")) {
      return;
    }
    clearProgress(quiz.storageKey);
    setProgress(emptyProgress());
  };

  return (
    <div ref={topRef} className="scroll-mt-20">
      {view === "attempt" && attempt && question ? (
        <QuestionView
          attempt={attempt}
          question={question}
          draft={draft}
          showSubmitNotice={submitNotice}
          onSelect={select}
          onConfirm={confirm}
          onGoTo={goTo}
          onFinish={finish}
          onCancelSubmit={() => setSubmitNotice(false)}
          onSubmit={submit}
          onExit={exit}
        />
      ) : view === "result" && result ? (
        <QuizResult
          result={result}
          passingPercentage={quiz.passingPercentage}
          onRetryMistakes={() =>
            startReview(result.items.filter(item => item.status !== "correct").map(item => item.question.id))
          }
          onNewTest={() => setView("menu")}
        />
      ) : (
        <QuizMenu
          quiz={quiz}
          pending={attempt}
          mistakesCount={progress.mistakes.length}
          lastResult={progress.lastResult}
          storageAvailable={storageAvailable}
          onResume={() => setView("attempt")}
          onDiscard={discard}
          onStudy={startStudy}
          onSimulation={startSimulation}
          onReview={() => startReview(progress.mistakes)}
          onClear={clear}
        />
      )}
    </div>
  );
}
