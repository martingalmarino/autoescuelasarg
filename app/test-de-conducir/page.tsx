import Link from "next/link";
import { ArrowRight, BookOpen, ClipboardCheck, RotateCcw, Smartphone } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import JsonLd from "@/components/SEO/JsonLd";
import { drivingTests, getAvailableTests, isTestAvailable } from "@/lib/driving-tests";
import { SITE_URL, buildMetadata } from "@/lib/seo";

const hasAvailableTests = getAvailableTests().length > 0;

export const metadata = buildMetadata({
  titleVariants: ["Test de conducir online: simulacros del examen teórico", "Test de conducir online"],
  description:
    "Practicá gratis para el examen teórico de la licencia de conducir con tests online de opción múltiple, modo estudio, simulacros y repaso de errores.",
  path: "/test-de-conducir",
  noindex: !hasAvailableTests,
});

export default function DrivingTestsPage() {
  return (
    <div className="min-h-screen bg-background">
      <JsonLd
        type="BreadcrumbList"
        data={[
          { name: "Inicio", url: SITE_URL },
          { name: "Test de conducir", url: `${SITE_URL}/test-de-conducir` },
        ]}
      />

      <section className="page-hero py-12 sm:py-16">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-4">
              Test de conducir online
            </h1>
            <p className="text-lg sm:text-xl text-white/85">
              Practicá para el examen teórico de la licencia de conducir con preguntas de opción múltiple,
              simulacros y repaso de tus errores.
            </p>
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16">
        <div className="container mx-auto px-4 sm:px-6">
          <h2 className="section-title text-2xl sm:text-3xl mb-8">Elegí tu test</h2>
          <div className="grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {drivingTests.map(test => {
              const available = isTestAvailable(test);
              const content = (
                <Card className={available ? "surface-card-hover h-full" : "surface-card h-full"}>
                  <CardContent className="flex h-full flex-col p-5 sm:p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div
                        className={
                          available
                            ? "flex h-11 w-11 items-center justify-center rounded-lg bg-navy shadow-sm group-hover:bg-primary transition-colors"
                            : "flex h-11 w-11 items-center justify-center rounded-lg bg-muted"
                        }
                      >
                        <ClipboardCheck className={available ? "h-6 w-6 text-signal" : "h-6 w-6 text-muted-foreground"} />
                      </div>
                      {available ? (
                        <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                      ) : (
                        <Badge variant="secondary">Próximamente</Badge>
                      )}
                    </div>
                    <h3 className="font-bold text-lg sm:text-xl text-foreground group-hover:text-primary transition-colors mb-2">
                      {test.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4 flex-1">{test.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {test.tags.map(tag => (
                        <span key={tag} className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
                          {tag}
                        </span>
                      ))}
                      {available && (
                        <span className="rounded-full bg-accent px-2.5 py-0.5 text-xs font-medium text-primary">
                          {test.quiz.questions.length} preguntas
                        </span>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );

              return available ? (
                <Link key={test.slug} href={`/test-de-conducir/${test.slug}`} className="group">
                  {content}
                </Link>
              ) : (
                <div key={test.slug}>{content}</div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16 bg-muted/50">
        <div className="container mx-auto px-4 sm:px-6">
          <h2 className="section-title text-2xl sm:text-3xl mb-8">Cómo funcionan los tests</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: BookOpen, title: "Modo estudio", text: "Respondé por bloques o por tema y mirá la corrección de cada pregunta al instante." },
              { icon: ClipboardCheck, title: "Simulacro", text: "Preguntas al azar con las opciones mezcladas y la corrección al entregar." },
              { icon: RotateCcw, title: "Repaso de errores", text: "Volvé a practicar las preguntas que fallaste o dejaste sin responder." },
              { icon: Smartphone, title: "Gratis y sin registro", text: "Tu progreso se guarda en tu navegador, desde el celular o la compu." },
            ].map(item => (
              <div key={item.title} className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-signal">
                  <item.icon className="h-5 w-5 text-navy" />
                </div>
                <div>
                  <h3 className="font-bold text-foreground mb-1">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
