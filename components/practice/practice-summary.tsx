import { BookOpen, RotateCcw, Trophy } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import type { PracticeAttempt } from './practice-session'

export function PracticeSummary({
  attempts,
  onRestart,
  onNewTopic,
}: {
  attempts: PracticeAttempt[]
  onRestart: () => void
  onNewTopic: () => void
}) {
  const total = attempts.reduce((sum, a) => sum + a.evaluation.score, 0)
  const average = attempts.length ? Math.round((total / attempts.length) * 10) / 10 : 0
  const correct = attempts.filter((a) => a.evaluation.result === 'Correct').length
  const partial = attempts.filter((a) => a.evaluation.result === 'Partially Correct').length
  const toRevise = attempts.filter((a) => a.evaluation.result !== 'Correct')

  const stats = [
    { label: 'Correct', value: correct, className: 'text-success' },
    { label: 'Partially Correct', value: partial, className: 'text-warning' },
    { label: 'Incorrect', value: attempts.length - correct - partial, className: 'text-destructive' },
  ]

  return (
    <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-2">
      <Card className="overflow-hidden shadow-lg shadow-primary/5">
        <CardContent className="flex flex-col items-center gap-4 text-center">
          <span className="flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-violet-500 text-primary-foreground">
            <Trophy className="size-7" aria-hidden />
          </span>
          <div>
            <p className="text-sm text-muted-foreground">Practice complete</p>
            <h2 className="text-3xl font-semibold tracking-tight">
              Your Score: <span className="text-primary">{average}</span>
              <span className="text-muted-foreground">/10</span>
            </h2>
          </div>
          <dl className="grid w-full grid-cols-3 gap-2">
            {stats.map((s) => (
              <div key={s.label} className="rounded-xl bg-muted px-2 py-3">
                <dt className="text-xs text-muted-foreground">{s.label}</dt>
                <dd className={`text-xl font-semibold ${s.className}`}>{s.value}</dd>
              </div>
            ))}
          </dl>
          <div className="flex flex-wrap justify-center gap-2">
            <Button onClick={onRestart}>
              <RotateCcw aria-hidden />
              Practice Again
            </Button>
            <Button variant="outline" onClick={onNewTopic}>
              Choose New Topic
            </Button>
          </div>
        </CardContent>
      </Card>

      {toRevise.length > 0 && (
        <section aria-labelledby="revise-title" className="flex flex-col gap-3">
          <h3 id="revise-title" className="flex items-center gap-2 font-semibold">
            <BookOpen className="size-4 text-primary" aria-hidden />
            Questions to Revise
          </h3>
          <ul className="flex flex-col gap-3">
            {toRevise.map((a) => (
              <li key={a.question.question} className="rounded-2xl border bg-card p-4">
                <p className="font-medium">{a.question.question}</p>
                <p className="mt-2 text-sm text-muted-foreground">
                  <span className="font-medium text-foreground">Model answer: </span>
                  {a.question.answer}
                </p>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  )
}
