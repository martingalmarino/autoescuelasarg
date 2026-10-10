import { ChevronDown, ExternalLink, Scale } from "lucide-react";
import type { LegalBasis } from "@/lib/driving-tests/types";

export default function LegalBasisDetails({ legal }: { legal: LegalBasis }) {
  return (
    <details className="group mt-3 rounded-md border border-border bg-card text-sm text-foreground">
      <summary className="flex min-h-[44px] cursor-pointer list-none items-center gap-2 px-3 py-2 font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 [&::-webkit-details-marker]:hidden">
        <Scale className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
        Fundamento normativo
        <ChevronDown className="ml-auto h-4 w-4 shrink-0 transition-transform group-open:rotate-180" aria-hidden="true" />
      </summary>
      <div className="border-t border-border px-3 py-2 space-y-1">
        <p>{legal.reference}</p>
        <a
          href={legal.source.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-start gap-1.5 font-medium text-primary underline-offset-4 hover:underline"
        >
          <ExternalLink className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          {legal.source.label}
        </a>
      </div>
    </details>
  );
}
