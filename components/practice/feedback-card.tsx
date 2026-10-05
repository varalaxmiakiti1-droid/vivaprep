import { CheckCircle2, CircleAlert, Lightbulb, ThumbsUp, XCircle } from 'lucide-react'
import type { Evaluation, EvaluationResult } from '@/lib/types'
import { cn } from '@/lib/utils'

const RESULT_STYLES: Record<EvaluationResult, { icon: typeof CheckCircle2; className: string }> = {
  Correct: { icon: CheckCircle2, className: 'text-success bg-success/10 border-success/30' },
  'Partially Correct': { icon: CircleAlert, className: 'text-warning bg-warning/10 border-warning/30' },
  Incorrect: { icon: XCircle, className: 'text-destructive bg-destructive/10 border-destructive/30' },
}

export function FeedbackCard({ evaluation }: { evaluation: Evaluation }) {
  const { icon: Icon, className } = RESULT_STYLES[evaluation.result]

  return (
    <div className="flex flex-col gap-3 animate-in fade-in slide-in-from-bottom-2" aria-live="polite">
      <div className={cn('flex items-center justify-between gap-3 rounded-xl border px-4 py-3', className)}>
        <span className="flex items-center gap-2 font-semibold">
          <Icon className="size-5" aria-hidden />
          {evaluation.result}
        </span>
        <span className="font-mono text-lg font-semibold">
          {evaluation.score}
          <span className="text-sm opacity-70">/10</span>
        </span>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl bg-muted p-4">
          <p className="mb-1 flex items-center gap-1.5 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
            <ThumbsUp className="size-3.5" aria-hidden />
            Feedback
          </p>
          <p className="text-sm leading-relaxed">{evaluation.feedback}</p>
        </div>
        <div className="rounded-xl bg-accent/60 p-4">
          <p className="mb-1 flex items-center gap-1.5 text-xs font-semibold tracking-wide text-accent-foreground uppercase">
            <Lightbulb className="size-3.5" aria-hidden />
            Improvement
          </p>
          <p className="text-sm leading-relaxed">{evaluation.improvement}</p>
        </div>
      </div>
    </div>
  )
}
