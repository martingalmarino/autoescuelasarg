"use client"

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Crown, Info, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import SchoolPageClient, { type DemoAction } from '@/app/autoescuelas/[slug]/SchoolPageClient'
import { cn } from '@/lib/utils'
import type { DemoSchool } from '@/lib/premium-demo'
import type { SchoolSummary } from '@/lib/types'

type View = 'premium' | 'free'
type Notice = DemoAction | 'competitors'

const TRACKED_NOTE = 'Cada clic se cuenta en tu reporte mensual.'

const notices: Record<Notice, string> = {
  whatsapp: `Abre WhatsApp con un mensaje ya escrito para tu autoescuela. ${TRACKED_NOTE}`,
  phone: `Llama directo al teléfono de tu autoescuela. ${TRACKED_NOTE}`,
  email: `Abre un email dirigido a tu autoescuela. ${TRACKED_NOTE}`,
  website: `Lleva a tu sitio web, con un enlace que además suma para tu posicionamiento en Google. ${TRACKED_NOTE}`,
  directions: `Abre Google Maps con la ruta hasta tu autoescuela. ${TRACKED_NOTE}`,
  video: 'Reproduce el video de tu autoescuela (de YouTube) sin salir de la ficha.',
  competitors: 'En una ficha gratis, debajo de tu información aparecen otras autoescuelas de tu ciudad. Con Premium, no.',
}

interface PremiumDemoProps {
  school: DemoSchool
  competitors: SchoolSummary[]
  videoPoster: string
}

export default function PremiumDemo({ school, competitors, videoPoster }: PremiumDemoProps) {
  const [view, setView] = useState<View>('premium')
  const [notice, setNotice] = useState<Notice | null>(null)
  const premium = view === 'premium'

  useEffect(() => {
    if (!notice) return
    const timeout = setTimeout(() => setNotice(null), 7000)
    return () => clearTimeout(timeout)
  }, [notice])

  const shownSchool = premium
    ? school
    : { ...school, isPremium: false, isFeatured: false, isVerified: false, isClaimed: false }

  const interceptCompetitorLinks = (event: React.MouseEvent) => {
    const link = (event.target as HTMLElement).closest('a')
    if (link && /^\/autoescuelas\/demo-/.test(link.getAttribute('href') ?? '')) {
      event.preventDefault()
      setNotice('competitors')
    }
  }

  return (
    <div onClickCapture={interceptCompetitorLinks}>
      <div className="sticky top-14 z-40 border-b border-white/10 bg-navy text-white shadow-md sm:top-16">
        <div className="container mx-auto flex flex-col gap-2 px-4 py-2.5 sm:px-6 md:flex-row md:items-center md:justify-between">
          <p className="text-sm leading-snug">
            <span className="font-bold text-signal">Ficha de ejemplo.</span>{' '}
            {premium
              ? 'Autoescuela y datos ficticios: probá los botones para ver qué hace cada uno.'
              : 'Así se ve la misma autoescuela con una ficha gratis: sin WhatsApp, fotos ni video, y con competidoras al final.'}
          </p>
          <div className="flex shrink-0 items-center gap-2">
            <div className="inline-flex rounded-full bg-white/10 p-1" role="group" aria-label="Tipo de ficha">
              {(['premium', 'free'] as const).map(option => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setView(option)}
                  aria-pressed={view === option}
                  className={cn(
                    'rounded-full px-3 py-1 text-xs font-bold transition-colors sm:text-sm',
                    view === option ? 'bg-white text-navy' : 'text-white/80 hover:text-white'
                  )}
                >
                  {option === 'premium' ? 'Premium' : 'Gratis'}
                </button>
              ))}
            </div>
            <Button asChild variant="signal" size="sm" className="font-bold">
              <Link href="/para-autoescuelas?plan=premium#reclamar">
                <Crown className="mr-1.5 h-4 w-4" />
                Quiero Premium
              </Link>
            </Button>
          </div>
        </div>
      </div>

      <SchoolPageClient
        school={shownSchool}
        relatedSchools={competitors}
        demo={{ videoPoster, onAction: setNotice }}
      />

      {notice && (
        <div
          role="status"
          className="fixed inset-x-4 bottom-4 z-50 flex items-start gap-3 rounded-xl bg-navy p-4 text-sm text-white shadow-xl sm:left-auto sm:right-6 sm:max-w-sm"
        >
          <Info className="mt-0.5 h-5 w-5 shrink-0 text-signal" />
          <p>
            <span className="font-bold text-signal">En tu ficha: </span>
            {notices[notice]}
          </p>
          <button
            type="button"
            onClick={() => setNotice(null)}
            className="-m-1 rounded p-1 text-white/70 hover:text-white"
            aria-label="Cerrar"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  )
}
