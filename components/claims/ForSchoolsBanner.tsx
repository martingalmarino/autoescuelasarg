import Link from "next/link";
import { ArrowRight, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ForSchoolsBannerProps {
  /** Ciudad o provincia del listado donde se muestra. */
  place?: string;
  className?: string;
}

export default function ForSchoolsBanner({ place, className }: ForSchoolsBannerProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-xl bg-navy p-5 text-white shadow-card sm:p-6",
        "flex flex-col gap-4 md:flex-row md:items-center md:justify-between",
        className
      )}
    >
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-signal">
          <Crown className="h-5 w-5 text-navy" />
        </div>
        <div>
          <p className="font-display text-lg font-bold leading-snug">
            {place ? `¿Tenés una autoescuela en ${place}?` : "¿Tenés una autoescuela?"}
          </p>
          <p className="mt-1 text-sm text-white/80">
            {place
              ? "Aparecé primera en esta lista con WhatsApp, fotos y promociones, y recibí más consultas."
              : "Reclamá tu ficha gratis o destacate con Premium para recibir más consultas de alumnos."}
          </p>
        </div>
      </div>
      <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
        <Button asChild variant="signal" className="font-bold">
          <Link href="/para-autoescuelas">
            Sumar mi autoescuela
            <ArrowRight className="ml-1.5 h-4 w-4" />
          </Link>
        </Button>
        <Button
          asChild
          variant="outline"
          className="border-white/30 bg-transparent text-white hover:bg-white/10 hover:text-white"
        >
          <Link href="/para-autoescuelas/ejemplo-premium">Ver ficha de ejemplo</Link>
        </Button>
      </div>
    </div>
  );
}
