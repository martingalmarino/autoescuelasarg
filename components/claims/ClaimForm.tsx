"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { AlertCircle, CheckCircle, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

const ROLES = ["Dueño/a", "Socio/a", "Encargado/a", "Instructor/a", "Otro"];

type Interest = "claim" | "premium";

const interestOptions: { id: Interest; title: string; text: string }[] = [
  { id: "claim", title: "Reclamar mi ficha", text: "Gratis: verificamos tus datos y marcamos la ficha como verificada." },
  { id: "premium", title: "Me interesa Premium", text: "Te contamos los beneficios y el precio fundador." },
];

export default function ClaimForm() {
  const searchParams = useSearchParams();
  const schoolSlug = searchParams.get("escuela") ?? "";
  const [schoolLabel, setSchoolLabel] = useState<string | null>(null);
  const [useSlug, setUseSlug] = useState(Boolean(schoolSlug));
  const [interest, setInterest] = useState<Interest>(searchParams.get("plan") === "premium" ? "premium" : "claim");
  const [startedAt] = useState(() => Date.now());
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!schoolSlug) return;
    let cancelled = false;
    fetch(`/api/autoescuelas/${encodeURIComponent(schoolSlug)}`)
      .then(response => (response.ok ? response.json() : null))
      .then(data => {
        if (cancelled) return;
        const school = data?.school;
        if (school?.name) {
          const showCity = school.city && school.name.indexOf(school.city) === -1;
          setSchoolLabel(showCity ? `${school.name} (${school.city})` : school.name);
        }
        else setUseSlug(false);
      })
      .catch(() => !cancelled && setUseSlug(false));
    return () => {
      cancelled = true;
    };
  }, [schoolSlug]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setStatus("sending");
    setError(null);

    try {
      const response = await fetch("/api/claims", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          schoolSlug: useSlug ? schoolSlug : "",
          schoolName: form.get("schoolName"),
          city: form.get("city"),
          name: form.get("name"),
          role: form.get("role"),
          email: form.get("email"),
          phone: form.get("phone"),
          message: form.get("message"),
          company: form.get("company"),
          interest,
          startedAt,
        }),
      });
      const result = await response.json();
      if (result.success) {
        setStatus("success");
      } else {
        setStatus("error");
        setError(result.error || "No pudimos enviar la solicitud.");
      }
    } catch {
      setStatus("error");
      setError("No pudimos enviar la solicitud. Revisá tu conexión e intentá de nuevo.");
    }
  };

  if (status === "success") {
    return (
      <div className="flex items-start gap-3 rounded-xl border border-green-200 bg-green-50 p-5" role="status">
        <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-green-600" />
        <div>
          <p className="font-semibold text-green-800">¡Gracias! Recibimos tu solicitud.</p>
          <p className="mt-1 text-sm text-green-700">
            Te vamos a contactar por teléfono o email para verificar que sos responsable de la autoescuela.
          </p>
        </div>
      </div>
    );
  }

  const sending = status === "sending";

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <fieldset className="space-y-2">
        <legend className="mb-2 text-sm font-medium">¿Qué te interesa?</legend>
        <div className="grid gap-3 sm:grid-cols-2">
          {interestOptions.map(option => (
            <label
              key={option.id}
              className={cn(
                "flex cursor-pointer items-start gap-3 rounded-lg border p-3 transition-colors",
                interest === option.id ? "border-primary bg-accent" : "border-border hover:border-primary/40"
              )}
            >
              <input
                type="radio"
                name="interest"
                value={option.id}
                checked={interest === option.id}
                onChange={() => setInterest(option.id)}
                className="mt-1 accent-[hsl(var(--primary))]"
              />
              <span>
                <span className="block text-sm font-semibold">{option.title}</span>
                <span className="block text-xs text-muted-foreground">{option.text}</span>
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      {useSlug ? (
        <div className="rounded-lg border bg-muted/40 p-3 text-sm">
          <span className="text-muted-foreground">Autoescuela: </span>
          <span className="font-semibold">{schoolLabel ?? "Cargando…"}</span>
          <button
            type="button"
            onClick={() => setUseSlug(false)}
            className="ml-2 text-primary underline-offset-2 hover:underline"
          >
            Cambiar
          </button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="claim-school">Nombre de la autoescuela *</Label>
            <Input id="claim-school" name="schoolName" required maxLength={200} disabled={sending} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="claim-city">Ciudad</Label>
            <Input id="claim-city" name="city" maxLength={120} disabled={sending} />
          </div>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="claim-name">Nombre y apellido *</Label>
          <Input id="claim-name" name="name" required maxLength={120} autoComplete="name" disabled={sending} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="claim-role">Tu rol *</Label>
          <select
            id="claim-role"
            name="role"
            required
            defaultValue=""
            disabled={sending}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <option value="" disabled>
              Elegí una opción
            </option>
            {ROLES.map(role => (
              <option key={role} value={role}>
                {role}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="claim-email">Email *</Label>
          <Input id="claim-email" name="email" type="email" required maxLength={160} autoComplete="email" disabled={sending} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="claim-phone">Teléfono o WhatsApp *</Label>
          <Input
            id="claim-phone"
            name="phone"
            type="tel"
            required
            maxLength={30}
            placeholder="+54 9 351 123-4567"
            autoComplete="tel"
            disabled={sending}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="claim-message">Comentarios</Label>
        <Textarea
          id="claim-message"
          name="message"
          rows={3}
          maxLength={2000}
          placeholder="Por ejemplo, qué datos de tu ficha hay que corregir."
          disabled={sending}
        />
      </div>

      <div className="absolute -left-[9999px] h-px w-px overflow-hidden" aria-hidden="true">
        <label htmlFor="claim-company">Empresa</label>
        <input id="claim-company" name="company" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      {status === "error" && error && (
        <div className="flex items-center gap-2 rounded-md border border-red-200 bg-red-50 p-3" role="alert">
          <AlertCircle className="h-4 w-4 shrink-0 text-red-600" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      <Button type="submit" variant="signal" className="w-full font-bold sm:w-auto" disabled={sending}>
        <Send className="mr-2 h-4 w-4" />
        {sending ? "Enviando…" : "Enviar solicitud"}
      </Button>
      <p className="text-xs text-muted-foreground">
        Usamos estos datos solo para verificar la autoescuela y contactarte. No se publican en el sitio.
      </p>
    </form>
  );
}
