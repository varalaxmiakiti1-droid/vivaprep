'use client'

import { ListChecks, Play } from 'lucide-react'
import { type FormEvent, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { generateQuestions } from '@/lib/api'
import type { VivaQuestion } from '@/lib/types'
import type { GeneratedSet } from '../generate-section'
import { AiLoader, ErrorState } from '../status'
import { DifficultySelect, TopicFields, type TopicValues } from '../topic-fields'
import { type PracticeAttempt, PracticeSession } from './practice-session'
import { PracticeSummary } from './practice-summary'

export type PracticeDeck = { subject: string; topic: string; questions: VivaQuestion[] }

const PRACTICE_COUNT = 5

export function PracticeSection({
  form,
  onFormChange,
  generated,
  deck,
  onDeckChange,
}: {
  form: TopicValues
  onFormChange: (values: TopicValues) => void
  generated: GeneratedSet | null
  deck: PracticeDeck | null
  onDeckChange: (deck: PracticeDeck | null) => void
}) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle')
  const [attempts, setAttempts] = useState<PracticeAttempt[] | null>(null)
  const [round, setRound] = useState(0)

  async function start(e?: FormEvent) {
    e?.preventDefault()
    const subject = form.subject.trim()
    const topic = form.topic.trim()
    if (!subject || !topic) return
    setStatus('loading')
    try {
      const data = await generateQuestions({ subject, topic, difficulty: form.difficulty, count: PRACTICE_COUNT })
      setAttempts(null)
      onDeckChange({ subject, topic, questions: data.questions })
      setStatus('idle')
    } catch {
      setStatus('error')
    }
  }

  function startGeneratedPractice() {
    if (!generated) return
    setAttempts(null)
    onDeckChange({
      subject: generated.request.subject,
      topic: generated.request.topic,
      questions: generated.questions,
    })
  }

  function restart() {
    setAttempts(null)
    setRound((r) => r + 1)
  }

  if (deck && attempts) {
    return (
      <PracticeSummary
        attempts={attempts}
        onRestart={restart}
        onNewTopic={() => {
          setAttempts(null)
          onDeckChange(null)
        }}
      />
    )
  }

  if (deck) {
    return (
      <PracticeSession
        key={`${deck.topic}-${round}-${deck.questions[0]?.question}`}
        subject={deck.subject}
        topic={deck.topic}
        questions={deck.questions}
        onComplete={setAttempts}
        onExit={() => onDeckChange(null)}
      />
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <Card className="shadow-lg shadow-primary/5">
        <CardHeader>
          <CardTitle className="text-xl">Practice Mode</CardTitle>
          <CardDescription>
            Answer viva questions one by one and get instant AI feedback and a score.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-5">
          <form onSubmit={start} className="flex flex-col gap-5">
            <TopicFields idPrefix="practice" values={form} onChange={onFormChange} />
            <div className="sm:w-1/2">
              <DifficultySelect
                id="practice-difficulty"
                value={form.difficulty}
                onChange={(difficulty) => onFormChange({ ...form, difficulty })}
              />
            </div>
            <Button
              type="submit"
              size="lg"
              disabled={status === 'loading' || !form.subject.trim() || !form.topic.trim()}
              className="w-full bg-gradient-to-r from-primary to-violet-500 text-primary-foreground hover:opacity-90"
            >
              <Play aria-hidden />
              Start Practice
            </Button>
          </form>

          {generated && status !== 'loading' && (
            <div className="flex flex-col gap-3 rounded-xl border border-dashed p-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-muted-foreground">
                Or practice your {generated.questions.length} generated questions on{' '}
                <span className="font-medium text-foreground">{generated.request.topic}</span>.
              </p>
              <Button variant="outline" size="sm" onClick={startGeneratedPractice}>
                <ListChecks aria-hidden />
                Use Generated
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {status === 'loading' && <AiLoader label="AI is preparing your practice questions..." />}
      {status === 'error' && <ErrorState onRetry={() => start()} />}
    </div>
  )
}
