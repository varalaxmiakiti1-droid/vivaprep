import { AlertTriangle, RotateCcw, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function AiLoader({ label }: { label: string }) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-dashed bg-card/50 px-6 py-12 text-center animate-in fade-in"
    >
      <div className="relative flex size-14 items-center justify-center">
        <span className="absolute inset-0 animate-ping rounded-full bg-primary/20" />
        <span className="relative flex size-12 items-center justify-center rounded-full bg-gradient-to-br from-primary to-violet-500 text-primary-foreground">
          <Sparkles className="size-5 animate-pulse" aria-hidden />
        </span>
      </div>
      <p className="text-sm font-medium">{label}</p>
      <div className="flex gap-1.5" aria-hidden>
        {[0, 150, 300].map((delay) => (
          <span
            key={delay}
            className="size-1.5 animate-bounce rounded-full bg-primary"
            style={{ animationDelay: `${delay}ms` }}
          />
        ))}
      </div>
    </div>
  )
}

export function ErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <div
      role="alert"
      className="flex flex-col items-center gap-4 rounded-2xl border border-destructive/30 bg-destructive/5 px-6 py-10 text-center animate-in fade-in"
    >
      <AlertTriangle className="size-8 text-destructive" aria-hidden />
      <p className="font-medium">Something went wrong. Please try again.</p>
      <Button variant="outline" onClick={onRetry}>
        <RotateCcw aria-hidden />
        Try Again
      </Button>
    </div>
  )
}

export function DemoNotice() {
  return (
    <p className="rounded-lg bg-warning/10 px-3 py-2 text-xs text-foreground/80">
      Demo mode: the AI service is unavailable for this account, so sample responses are shown.
    </p>
  )
}
