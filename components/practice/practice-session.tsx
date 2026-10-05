'use client'

import { ArrowRight, Flag, Send, X } from 'lucide-react'
import { type FormEvent, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'
import { Textarea } from '@/components/ui/textarea'
import { evaluateAnswer } from '@/lib/api'
import type { Evaluation, VivaQuestion } from '@/lib/types'
import { DifficultyBadge } from '../difficulty-badge'
import { AiLoader, DemoNotice, ErrorState } from '../status'
import { FeedbackCard } from './feedback-card'

export type PracticeAttempt = { question: VivaQuestion; answer: string; evaluation: Evaluation }

export function PracticeSession({
  subject,
  topic,
  questions,
  onComplete,
  onExit,
}: {
  subject: string
  topic: string
  questions: VivaQuestion[]
  onComplete: (attempts: PracticeAttempt[]) => void
  onExit: () => void
}) {
  const [index, setIndex] = useState(0)
  const [answer, setAnswer] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [status, setStatus] = useState<'answering' | 'evaluating' | 'failed' | 'reviewed'>('answering')
  const [attempts, setAttempts] = useState<PracticeAttempt[]>([])
  const [demo, setDemo] = useState(false)

  const current = questions[index]
  const isLast = index === questions.length - 1
  const evaluation = status === 'reviewed' ? attempts[index]?.evaluation : undefined
  const progress = ((index + (status === 'reviewed' ? 1 : 0)) / questions.length) * 100

  async function submit(e?: FormEvent) {
    e?.preventDefault()
    if (!answer.trim()) {
      setError('Please write your answer before submitting.')
      return
    }
    setError(null)
    setStatus('evaluating')
    try {
      const result = await evaluateAnswer({
        subject,
        topic,
        question: current.question,
        referenceAnswer: current.answer,
        studentAnswer: answer.trim(),
      })
      const { demo: isDemo, ...evaluationData } = result
      if (isDemo) setDemo(true)
      setAttempts((prev) => [...prev.slice(0, index), { question: current, answer: answer.trim(), evaluation: evaluationData }])
      setStatus('reviewed')
    } catch {
      setStatus('failed')
    }
  }

  function next() {
    if (isLast) {
      onComplete(attempts)
      return
    }
    setIndex((i) => i + 1)
    setAnswer('')
    setStatus('answering')
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between gap-3 text-sm">
          <span className="font-medium">
            Question {index + 1} of {questions.length}
          </span>
          <Button variant="ghost" size="sm" onClick={onExit}>
            <X aria-hidden />
            End Practice
          </Button>
        </div>
        <Progress value={progress} aria-label="Practice progress" />
      </div>

      <Card className="shadow-lg shadow-primary/5">
        <CardContent className="flex flex-col gap-5">
          <div className="flex items-start justify-between gap-3">
            <h2 className="text-lg font-semibold leading-relaxed text-pretty">{current.question}</h2>
            <DifficultyBadge difficulty={current.difficulty} />
          </div>

          <form onSubmit={submit} className="flex flex-col gap-2">
            <Label htmlFor="practice-answer">Your answer</Label>
            <Textarea
              id="practice-answer"
              rows={5}
              maxLength={3000}
              placeholder="Type your answer here..."
              value={answer}
              disabled={status !== 'answering'}
              aria-invalid={Boolean(error)}
              aria-describedby={error ? 'practice-answer-error' : undefined}
              onChange={(e) => {
                setAnswer(e.target.value)
                if (error) setError(null)
              }}
              onKeyDown={(e) => {
                if (e.key !== 'Enter' || !(e.metaKey || e.ctrlKey)) return
                if (e.nativeEvent.isComposing || e.keyCode === 229) return
                submit()
              }}
            />
            {error && (
              <p id="practice-answer-error" className="text-sm text-destructive">
                {error}
              </p>
            )}
            {status === 'answering' && (
              <Button type="submit" className="self-end">
                <Send aria-hidden />
                Submit Answer
              </Button>
            )}
          </form>

          {status === 'evaluating' && <AiLoader label="AI is evaluating your answer..." />}
          {status === 'failed' && <ErrorState onRetry={() => submit()} />}
          {evaluation && (
            <>
              <FeedbackCard evaluation={evaluation} />
              {demo && <DemoNotice />}
              <Button onClick={next} className="self-end">
                {isLast ? <Flag aria-hidden /> : <ArrowRight aria-hidden />}
                {isLast ? 'See Results' : 'Next Question'}
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
