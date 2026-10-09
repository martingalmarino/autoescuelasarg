import PremiumDemo from "@/components/school-premium/PremiumDemo";
import { DEMO_COMPETITORS, getDemoSchool } from "@/lib/premium-demo";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  titleVariants: ["Ejemplo de ficha Premium para autoescuelas"],
  description:
    "Mirá cómo se ve una ficha Premium en Autoescuelas.ar: WhatsApp, fotos, video, promociones y preguntas frecuentes, comparada con una ficha gratis.",
  path: "/para-autoescuelas/ejemplo-premium",
  noindex: true,
});

export default function PremiumExamplePage() {
  return (
    <PremiumDemo
      school={getDemoSchool()}
      competitors={DEMO_COMPETITORS}
      videoPoster="https://images.unsplash.com/photo-1485463611174-f302f6a5c1c9?auto=format&fit=crop&w=1200&q=80"
    />
  );
}
