'use client'

import { Mic, RefreshCw, Sparkles, Trash2 } from 'lucide-react'
import { type FormEvent, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { generateQuestions } from '@/lib/api'
import { QUESTION_COUNTS, type GenerateRequest, type GenerateResponse } from '@/lib/types'
import { QuestionCard } from './question-card'
import { AiLoader, DemoNotice, ErrorState } from './status'
import { DifficultySelect, TopicFields } from './topic-fields'

export type GeneratedSet = GenerateResponse & { request: GenerateRequest }

export function GenerateSection({
  form,
  onFormChange,
  result,
  onResult,
  onPractice,
}: {
  form: GenerateRequest
  onFormChange: (form: GenerateRequest) => void
  result: GeneratedSet | null
  onResult: (result: GeneratedSet | null) => void
  onPractice: () => void
}) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle')

  async function run(request: GenerateRequest) {
    setStatus('loading')
    try {
      const data = await generateQuestions(request)
      onResult({ ...data, request })
      setStatus('idle')
    } catch {
      setStatus('error')
    }
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!form.subject.trim() || !form.topic.trim()) return
    run({ ...form, subject: form.subject.trim(), topic: form.topic.trim() })
  }

  return (
    <div className="flex flex-col gap-10">
      <section className="flex flex-col items-center gap-3 pt-4 text-center">
        <span className="inline-flex items-center gap-1.5 rounded-full border bg-card px-3 py-1 text-xs font-medium text-muted-foreground shadow-sm">
          <Sparkles className="size-3.5 text-primary" aria-hidden />
          AI-powered viva preparation
        </span>
        <h1 className="max-w-2xl text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
          Prepare smarter.{' '}
          <span className="bg-gradient-to-r from-primary to-violet-500 bg-clip-text text-transparent">
            Answer confidently.
          </span>
        </h1>
      </section>

      <Card className="mx-auto w-full max-w-2xl shadow-lg shadow-primary/5">
        <CardHeader>
          <CardTitle className="text-xl">Generate Viva Questions</CardTitle>
          <CardDescription>
            Enter your subject and topic to generate AI-powered viva questions.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <TopicFields
              idPrefix="gen"
              values={form}
              onChange={(v) => onFormChange({ ...form, ...v })}
            />
            <div className="grid gap-4 sm:grid-cols-2">
              <DifficultySelect
                id="gen-difficulty"
                value={form.difficulty}
                onChange={(difficulty) => onFormChange({ ...form, difficulty })}
              />
              <div className="flex flex-col gap-2">
                <Label htmlFor="gen-count">Number of Questions</Label>
                <Select
                  value={String(form.count)}
                  onValueChange={(v) => v && onFormChange({ ...form, count: Number(v) as GenerateRequest['count'] })}
                >
                  <SelectTrigger id="gen-count" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {QUESTION_COUNTS.map((n) => (
                      <SelectItem key={n} value={String(n)}>
                        {n}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button
              type="submit"
              size="lg"
              disabled={status === 'loading' || !form.subject.trim() || !form.topic.trim()}
              className="w-full bg-gradient-to-r from-primary to-violet-500 text-primary-foreground hover:opacity-90"
            >
              <Sparkles aria-hidden />
              Generate Questions
            </Button>
          </form>
        </CardContent>
      </Card>

      <section aria-labelledby="results-title" className="mx-auto w-full max-w-3xl" aria-busy={status === 'loading'}>
        {status === 'loading' && <AiLoader label="AI is preparing your viva questions..." />}
        {status === 'error' && <ErrorState onRetry={() => run(result?.request ?? form)} />}
        {status === 'idle' && result && (
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 id="results-title" className="text-xl font-semibold tracking-tight">
                  Your Viva Questions
                </h2>
                <p className="text-sm text-muted-foreground">
                  {result.request.subject} · {result.request.topic}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" size="sm" onClick={() => run(result.request)}>
                  <RefreshCw aria-hidden />
                  Regenerate Questions
                </Button>
                <Button variant="ghost" size="sm" onClick={() => onResult(null)}>
                  <Trash2 aria-hidden />
                  Clear Results
                </Button>
              </div>
            </div>
            {result.demo && <DemoNotice />}
            <ol className="flex flex-col gap-3">
              {result.questions.map((q, i) => (
                <QuestionCard key={`${q.question}-${i}`} item={q} index={i} />
              ))}
            </ol>
            <div className="mt-2 flex flex-col items-center gap-3 rounded-2xl border bg-gradient-to-br from-primary/10 to-violet-500/10 p-6 text-center">
              <p className="font-medium">Ready to test yourself?</p>
              <Button onClick={onPractice}>
                <Mic aria-hidden />
                Practice These Questions
              </Button>
            </div>
          </div>
        )}
      </section>
    </div>
  )
}
