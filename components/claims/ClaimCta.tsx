import Link from "next/link";
import { ArrowRight, BadgeCheck, Crown } from "lucide-react";

interface ClaimCtaProps {
  slug: string;
  isClaimed: boolean;
  isPremium: boolean;
}

export default function ClaimCta({ slug, isClaimed, isPremium }: ClaimCtaProps) {
  if (isPremium) return null;

  const content = isClaimed
    ? {
        icon: Crown,
        title: "¿Sos responsable de esta autoescuela?",
        text: "Destacala con Premium: primera en tu ciudad, WhatsApp, fotos y reporte de consultas.",
        link: `/para-autoescuelas?escuela=${slug}&plan=premium#reclamar`,
        label: "Conocer Premium",
      }
    : {
        icon: BadgeCheck,
        title: "¿Es tu autoescuela?",
        text: "Reclamá esta ficha gratis para verificar y corregir sus datos.",
        link: `/para-autoescuelas?escuela=${slug}#reclamar`,
        label: "Reclamar ficha",
      };

  return (
    <div className="rounded-xl border border-dashed border-primary/40 bg-accent/40 p-4">
      <div className="flex items-start gap-3">
        <content.icon className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
        <div>
          <p className="font-semibold text-foreground">{content.title}</p>
          <p className="mt-1 text-sm text-muted-foreground">{content.text}</p>
          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1">
            <Link
              href={content.link}
              rel="nofollow"
              className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
            >
              {content.label}
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
            <Link href="/para-autoescuelas/ejemplo-premium" className="text-sm text-muted-foreground hover:text-primary hover:underline">
              Ver ficha Premium de ejemplo
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
