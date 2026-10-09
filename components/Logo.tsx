import { Car } from 'lucide-react'
import { cn } from '@/lib/utils'

interface LogoMarkProps {
  className?: string
}

export function LogoMark({ className }: LogoMarkProps) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        'inline-flex h-8 w-8 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-lg bg-signal shadow-sm',
        className
      )}
    >
      <Car className="h-[58%] w-[58%] text-navy" strokeWidth={2.25} />
    </span>
  )
}

interface LogoProps {
  tone?: 'light' | 'dark'
  className?: string
}

export default function Logo({ tone = 'light', className }: LogoProps) {
  return (
    <span className={cn('inline-flex items-center gap-2.5', className)}>
      <LogoMark />
      <span
        className={cn(
          'font-display text-lg sm:text-xl font-extrabold tracking-tight',
          tone === 'dark' ? 'text-white' : 'text-navy'
        )}
      >
        Autoescuelas<span className="font-semibold opacity-60">.ar</span>
      </span>
    </span>
  )
}
