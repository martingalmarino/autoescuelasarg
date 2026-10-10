import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, BookOpen, ClipboardCheck, ExternalLink, Info, RotateCcw } from "lucide-react";
import DrivingQuiz from "@/components/driving-quiz/DrivingQuiz";
import JsonLd from "@/components/SEO/JsonLd";
import { Card, CardContent } from "@/components/ui/card";
import { getAvailableTests, getDrivingTest, isTestAvailable } from "@/lib/driving-tests";
import { simulationOptions } from "@/lib/driving-tests/quiz";
import { SITE_URL, buildMetadata, notFoundMetadata } from "@/lib/seo";

export const dynamicParams = false;

export function generateStaticParams() {
  return getAvailableTests().map(test => ({ slug: test.slug }));
}

interface PageProps {
  params: { slug: string };
}

export function generateMetadata({ params }: PageProps) {
  const test = getDrivingTest(params.slug);
  if (!test || !isTestAvailable(test)) return notFoundMetadata;

  return buildMetadata({
    titleVariants: [test.metaTitle, test.title],
    description: test.description,
    path: `/test-de-conducir/${test.slug}`,
  });
}

function formatReviewDate(isoDate: string) {
  const [year, month, day] = isoDate.split("-");
  return `${day}/${month}/${year}`;
}

function listSizes(sizes: number[]) {
  return sizes.length > 1 ? `${sizes.slice(0, -1).join(", ")} o ${sizes[sizes.length - 1]}` : `${sizes[0]}`;
}

export default function DrivingTestPage({ params }: PageProps) {
  const test = getDrivingTest(params.slug);
  if (!test || !isTestAvailable(test)) notFound();

  const modes = [
    {
      icon: BookOpen,
      title: "Modo estudio",
      text: "Practicá por bloques o por tema. Confirmás cada respuesta y ves enseguida si acertaste y cuál es la correcta.",
    },
    {
      icon: ClipboardCheck,
      title: "Simulacro",
      text: `Elegí ${listSizes(simulationOptions(test.quiz.simulationSizes, test.quiz.questions.length))} preguntas al azar con las opciones mezcladas. Podés cambiar respuestas y la corrección llega al entregar.`,
    },
    {
      icon: RotateCcw,
      title: "Repaso de errores",
      text: "Las preguntas que fallaste o dejaste sin responder quedan guardadas en tu navegador para volver a practicarlas.",
    },
  ];

  const otherTests = getAvailableTests().filter(other => other.slug !== test.slug);

  return (
    <div className="min-h-screen bg-background">
      <JsonLd
        type="BreadcrumbList"
        data={[
          { name: "Inicio", url: SITE_URL },
          { name: "Test de conducir", url: `${SITE_URL}/test-de-conducir` },
          { name: test.title, url: `${SITE_URL}/test-de-conducir/${test.slug}` },
        ]}
      />

      <section className="page-hero py-10 sm:py-14">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-3xl mx-auto text-white">
            <Link
              href="/test-de-conducir"
              className="inline-flex items-center text-white/80 hover:text-white mb-3 sm:mb-4 transition-colors text-sm sm:text-base"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Todos los tests
            </Link>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold mb-3 leading-tight">{test.heading}</h1>
            <p className="text-base sm:text-lg text-white/85 mb-5">{test.description}</p>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 bg-signal text-signal-foreground font-semibold rounded-full text-sm">
                {test.quiz.questions.length} preguntas
              </span>
              {test.tags.map(tag => (
                <span key={tag} className="px-3 py-1 bg-white/10 text-white ring-1 ring-white/20 rounded-full text-sm">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-8 sm:py-12">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-3xl mx-auto space-y-8 sm:space-y-10">
            {test.notice && (
              <div className="flex items-start gap-3 rounded-lg border border-border bg-muted/50 p-4 text-sm text-muted-foreground">
                <Info className="h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
                <div className="space-y-1">
                  <p>
                    {test.notice}
                    {test.sources[0] && (
                      <>
                        {" "}
                        <a
                          href={test.sources[0].url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-medium text-primary underline-offset-4 hover:underline"
                        >
                          Ir a {test.sources[0].label}
                        </a>
                      </>
                    )}
                  </p>
                  {test.reviewedAt && (
                    <p className="font-medium text-foreground">Contenido revisado: {formatReviewDate(test.reviewedAt)}</p>
                  )}
                </div>
              </div>
            )}

            <DrivingQuiz testSlug={test.slug} quiz={test.quiz} />

            <section className="space-y-4">
              <h2 className="section-title text-2xl">Sobre este test</h2>
              {test.intro.map(paragraph => (
                <p key={paragraph} className="text-muted-foreground leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </section>

            <section>
              <h2 className="section-title text-2xl mb-6">Cómo practicar</h2>
              <div className="grid gap-5 sm:grid-cols-3">
                {modes.map(mode => (
                  <div key={mode.title}>
                    <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-signal">
                      <mode.icon className="h-5 w-5 text-navy" aria-hidden="true" />
                    </div>
                    <h3 className="font-bold text-foreground mb-1">{mode.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{mode.text}</p>
                  </div>
                ))}
              </div>
            </section>

            {test.sources.length > 0 && (
              <section>
                <h2 className="section-title text-2xl mb-5">Material oficial</h2>
                <ul className="space-y-2">
                  {test.sources.map(source => (
                    <li key={source.url}>
                      <a
                        href={source.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-start gap-2 text-primary underline-offset-4 hover:underline"
                      >
                        <ExternalLink className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                        {source.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            <Card className="page-hero bg-navy border-0">
              <CardContent className="relative p-6 sm:p-8">
                <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">¿Te preparás para sacar el registro?</h2>
                <p className="text-white/85 mb-5">
                  Encontrá una autoescuela cerca tuyo para practicar con un instructor antes del examen.
                </p>
                <Link
                  href="/autoescuelas"
                  className="inline-flex items-center rounded-lg bg-signal px-5 py-2.5 font-semibold text-signal-foreground shadow-sm hover:bg-signal/90 transition-colors"
                >
                  Buscar autoescuelas
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </CardContent>
            </Card>

            {otherTests.length > 0 && (
              <section>
                <h2 className="section-title text-2xl mb-6">Otros tests de conducir</h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  {otherTests.map(other => (
                    <Link key={other.slug} href={`/test-de-conducir/${other.slug}`} className="group">
                      <Card className="surface-card-hover h-full">
                        <CardContent className="flex items-center gap-3 p-4">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-navy group-hover:bg-primary transition-colors">
                            <ClipboardCheck className="h-5 w-5 text-signal" />
                          </div>
                          <span className="font-semibold text-foreground group-hover:text-primary transition-colors">
                            {other.title}
                          </span>
                          <ArrowRight className="ml-auto h-4 w-4 shrink-0 text-muted-foreground group-hover:text-primary transition-colors" />
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
