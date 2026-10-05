'use client'

import { GraduationCap } from 'lucide-react'
import { cn } from '@/lib/utils'
import { ThemeToggle } from './theme-toggle'

export type View = 'home' | 'practice'

const NAV: { id: View; label: string }[] = [
  { id: 'home', label: 'Home' },
  { id: 'practice', label: 'Practice' },
]

export function SiteHeader({ view, onNavigate }: { view: View; onNavigate: (view: View) => void }) {
  return (
    <header className="sticky top-0 z-30 border-b bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between gap-4 px-4">
        <button
          type="button"
          onClick={() => onNavigate('home')}
          className="flex items-center gap-2.5 rounded-lg text-left focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
        >
          <span className="flex size-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-violet-500 text-primary-foreground shadow-md shadow-primary/25">
            <GraduationCap className="size-5" aria-hidden />
          </span>
          <span className="flex flex-col leading-tight">
            <span className="font-semibold tracking-tight">VivaPrep AI</span>
            <span className="hidden text-xs text-muted-foreground sm:block">
              Prepare Smarter. Answer Confidently.
            </span>
          </span>
        </button>

        <div className="flex items-center gap-1">
          <nav aria-label="Main" className="flex items-center gap-1 rounded-full bg-muted p-1">
            {NAV.map((item) => (
              <button
                key={item.id}
                type="button"
                aria-current={view === item.id ? 'page' : undefined}
                onClick={() => onNavigate(item.id)}
                className={cn(
                  'rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none',
                  view === item.id
                    ? 'bg-card text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground',
                )}
              >
                {item.label}
              </button>
            ))}
          </nav>
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
