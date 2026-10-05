'use client'

import { Check, Copy, Eye, EyeOff } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import type { VivaQuestion } from '@/lib/types'
import { cn } from '@/lib/utils'
import { DifficultyBadge } from './difficulty-badge'

export function QuestionCard({ item, index }: { item: VivaQuestion; index: number }) {
  const [open, setOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const answerId = `answer-${index}`

  async function copy() {
    try {
      await navigator.clipboard.writeText(item.answer)
      setCopied(true)
      toast.success('Answer copied to clipboard')
      setTimeout(() => setCopied(false), 1500)
    } catch {
      toast.error('Could not copy. Please copy manually.')
    }
  }

  return (
    <li
      className="rounded-2xl border bg-card p-5 shadow-sm transition-shadow hover:shadow-md animate-in fade-in slide-in-from-bottom-2 fill-mode-both"
      style={{ animationDelay: `${Math.min(index, 10) * 40}ms` }}
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-medium leading-relaxed text-pretty">
          <span className="mr-1.5 font-semibold text-primary">Q{index + 1}.</span>
          {item.question}
        </h3>
        <DifficultyBadge difficulty={item.difficulty} />
      </div>

      <div
        id={answerId}
        className={cn(
          'grid transition-all duration-300 ease-out',
          open ? 'mt-4 grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0',
        )}
      >
        <div className="overflow-hidden" inert={!open}>
          <div className="rounded-xl bg-accent/60 p-4">
            <p className="mb-1 text-xs font-semibold tracking-wide text-accent-foreground uppercase">
              Answer
            </p>
            <p className="text-sm leading-relaxed">{item.answer}</p>
          </div>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {open ? (
          <>
            <Button size="sm" variant="outline" onClick={copy}>
              {copied ? <Check aria-hidden /> : <Copy aria-hidden />}
              {copied ? 'Copied' : 'Copy Answer'}
            </Button>
            <Button size="sm" variant="ghost" onClick={() => setOpen(false)} aria-controls={answerId} aria-expanded>
              <EyeOff aria-hidden />
              Hide Answer
            </Button>
          </>
        ) : (
          <Button size="sm" variant="secondary" onClick={() => setOpen(true)} aria-controls={answerId} aria-expanded={false}>
            <Eye aria-hidden />
            Show Answer
          </Button>
        )}
      </div>
    </li>
  )
}
