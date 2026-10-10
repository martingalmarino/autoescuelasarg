import { Suspense } from "react";
import Link from "next/link";
import { ArrowRight, BadgeCheck, BarChart3, Check, ClipboardList, Crown, MessageCircle, PhoneCall, Sparkles } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import ClaimForm from "@/components/claims/ClaimForm";
import JsonLd from "@/components/SEO/JsonLd";
import { SITE_URL, buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  titleVariants: ["Para autoescuelas: reclamá tu ficha y conseguí más alumnos", "Para autoescuelas: reclamá tu ficha"],
  description:
    "¿Tenés una autoescuela? Reclamá gratis tu ficha en Autoescuelas.ar para verificar tus datos, o pasate a Premium para destacarte y recibir más consultas.",
  path: "/para-autoescuelas",
});

const tiers = [
  {
    id: "reclamada",
    name: "Ficha reclamada",
    price: "Gratis",
    description: "Para que los datos de tu autoescuela sean correctos y confiables.",
    icon: BadgeCheck,
    highlighted: false,
    features: [
      "Insignia de autoescuela verificada",
      "Corrección de teléfono, dirección, horarios y descripción",
      "Te reenviamos las consultas que recibe tu ficha durante un tiempo limitado",
    ],
    cta: { label: "Reclamar mi ficha", href: "#reclamar" },
  },
  {
    id: "premium",
    name: "Premium",
    price: "Precio fundador para las primeras autoescuelas",
    description: "Para destacarte frente a la competencia y recibir más consultas.",
    icon: Crown,
    highlighted: true,
    features: [
      "Todo lo de la ficha reclamada",
      "Primera en el listado de tu ciudad y provincia, con insignia Destacada",
      "Prioridad en las autoescuelas recomendadas de otras fichas",
      "Botón de WhatsApp, llamada y cómo llegar",
      "Galería de fotos y video",
      "Promoción vigente y preguntas frecuentes propias",
      "Detalles de tu servicio: doble comando, retiro a domicilio y más",
      "Sin autoescuelas competidoras en tu ficha",
      "Enlace a tu sitio web que suma para tu posicionamiento en Google",
      "Reporte mensual de visitas, clics y consultas",
    ],
    cta: { label: "Quiero Premium", href: "?plan=premium#reclamar" },
  },
];

const steps = [
  { icon: ClipboardList, title: "Completá el formulario", text: "Contanos cuál es tu autoescuela y cómo contactarte." },
  { icon: PhoneCall, title: "Verificamos tus datos", text: "Te contactamos para confirmar que sos responsable de la autoescuela." },
  { icon: Sparkles, title: "Actualizamos tu ficha", text: "Corregimos los datos y, si elegís Premium, activamos los beneficios." },
];

const faqs = [
  {
    id: "costo",
    question: "¿Reclamar mi ficha tiene costo?",
    answer: "No. Reclamar y verificar la ficha de tu autoescuela es gratis.",
  },
  {
    id: "precio",
    question: "¿Cuánto cuesta Premium?",
    answer:
      "Estamos definiendo el precio. Las primeras autoescuelas que se sumen acceden a un precio fundador: dejanos tus datos y te lo contamos.",
  },
  {
    id: "verificacion",
    question: "¿Cómo verifican que soy responsable de la autoescuela?",
    answer:
      "Te contactamos al teléfono o email que nos dejes y, si hace falta, lo cruzamos con los datos públicos de la autoescuela.",
  },
  {
    id: "no-listada",
    question: "Mi autoescuela no aparece en el sitio, ¿puedo sumarla?",
    answer: "Sí. Completá el formulario con el nombre y la ciudad y la agregamos al directorio.",
  },
];

export default function ForSchoolsPage() {
  return (
    <div className="min-h-screen bg-background">
      <JsonLd
        type="BreadcrumbList"
        data={[
          { name: "Inicio", url: SITE_URL },
          { name: "Para autoescuelas", url: `${SITE_URL}/para-autoescuelas` },
        ]}
      />
      <JsonLd type="FAQPage" data={faqs} />

      <section className="page-hero py-12 sm:py-16">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-3xl mx-auto text-center">
            <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-signal">Para autoescuelas</p>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-4">
              Conseguí más alumnos con tu ficha en Autoescuelas.ar
            </h1>
            <p className="text-lg sm:text-xl text-white/85 mb-8">
              Quienes buscan dónde aprender a manejar encuentran acá las autoescuelas de su ciudad. Reclamá tu ficha
              gratis o destacate con Premium.
            </p>
            <div className="flex flex-col justify-center gap-3 sm:flex-row">
              <Button asChild variant="signal" size="lg" className="font-bold">
                <a href="#reclamar">Reclamar mi ficha gratis</a>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-white/30 bg-transparent text-white hover:bg-white/10 hover:text-white">
                <Link href="/para-autoescuelas/ejemplo-premium">Ver una ficha Premium de ejemplo</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section id="planes" className="scroll-mt-20 py-12 sm:py-16">
        <div className="container mx-auto px-4 sm:px-6">
          <h2 className="section-title text-2xl sm:text-3xl mb-8">Elegí cómo aparecer</h2>
          <div className="grid gap-6 lg:grid-cols-2">
            {tiers.map(tier => (
              <div
                key={tier.id}
                className={
                  tier.highlighted
                    ? "relative flex flex-col rounded-xl bg-navy p-6 text-white shadow-card-hover sm:p-8"
                    : "surface-card flex flex-col p-6 sm:p-8"
                }
              >
                {tier.highlighted && (
                  <span className="absolute -top-3 right-6 rounded-full bg-signal px-3 py-1 text-xs font-bold uppercase tracking-wide text-signal-foreground">
                    Más visibilidad
                  </span>
                )}
                <div className="mb-4 flex items-center gap-3">
                  <div
                    className={
                      tier.highlighted
                        ? "flex h-11 w-11 items-center justify-center rounded-lg bg-signal"
                        : "flex h-11 w-11 items-center justify-center rounded-lg bg-accent"
                    }
                  >
                    <tier.icon className={tier.highlighted ? "h-6 w-6 text-navy" : "h-6 w-6 text-primary"} />
                  </div>
                  <div>
                    <h3 className="font-display text-xl font-bold">{tier.name}</h3>
                    <p className={tier.highlighted ? "text-sm font-semibold text-signal" : "text-sm font-semibold text-primary"}>
                      {tier.price}
                    </p>
                  </div>
                </div>
                <p className={tier.highlighted ? "mb-5 text-white/80" : "mb-5 text-muted-foreground"}>{tier.description}</p>
                <ul className="mb-6 flex-1 space-y-2.5">
                  {tier.features.map(feature => (
                    <li key={feature} className="flex items-start gap-2 text-sm">
                      <Check className={tier.highlighted ? "mt-0.5 h-4 w-4 shrink-0 text-signal" : "mt-0.5 h-4 w-4 shrink-0 text-green-600"} />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                  <Button asChild variant={tier.highlighted ? "signal" : "default"} className="w-full font-bold sm:w-auto">
                    <a href={tier.cta.href}>{tier.cta.label}</a>
                  </Button>
                  {tier.highlighted && (
                    <Link
                      href="/para-autoescuelas/ejemplo-premium"
                      className="inline-flex items-center justify-center gap-1 text-sm font-semibold text-signal hover:underline"
                    >
                      Ver ficha de ejemplo
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16 bg-muted/50">
        <div className="container mx-auto px-4 sm:px-6">
          <h2 className="section-title text-2xl sm:text-3xl mb-8">Cómo funciona</h2>
          <ol className="grid gap-6 md:grid-cols-3">
            {steps.map((step, index) => (
              <li key={step.title} className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-signal">
                  <step.icon className="h-5 w-5 text-navy" />
                </div>
                <div>
                  <h3 className="font-bold text-foreground mb-1">
                    {index + 1}. {step.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">{step.text}</p>
                </div>
              </li>
            ))}
          </ol>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="flex items-start gap-3 rounded-xl border bg-card p-4 text-sm">
              <MessageCircle className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
              <p>Las consultas llegan de personas que ya están buscando autoescuela en tu zona.</p>
            </div>
            <div className="flex items-start gap-3 rounded-xl border bg-card p-4 text-sm">
              <BarChart3 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
              <p>Con Premium recibís cada mes cuántas personas vieron tu ficha y te contactaron.</p>
            </div>
          </div>
        </div>
      </section>

      <section id="reclamar" className="scroll-mt-20 py-12 sm:py-16">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="mx-auto max-w-3xl">
            <h2 className="section-title text-2xl sm:text-3xl mb-3">Reclamá tu ficha</h2>
            <p className="mb-8 text-muted-foreground">
              Completá tus datos y te contactamos. Si tu autoescuela todavía no está en el sitio, también la sumamos.
            </p>
            <div className="surface-card p-5 sm:p-8">
              <Suspense fallback={<div className="h-96" />}>
                <ClaimForm />
              </Suspense>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16 bg-muted/50">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="mx-auto max-w-3xl">
            <h2 className="section-title text-2xl sm:text-3xl mb-6">Preguntas frecuentes</h2>
            <Accordion type="single" collapsible className="surface-card px-5">
              {faqs.map(faq => (
                <AccordionItem key={faq.id} value={faq.id}>
                  <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">{faq.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>
    </div>
  );
}
