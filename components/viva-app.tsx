'use client'

import { Activity, useState } from 'react'
import type { GenerateRequest } from '@/lib/types'
import { type GeneratedSet, GenerateSection } from './generate-section'
import { type PracticeDeck, PracticeSection } from './practice/practice-section'
import { SiteHeader, type View } from './site-header'
import type { TopicValues } from './topic-fields'

export function VivaApp() {
  const [view, setView] = useState<View>('home')
  const [genForm, setGenForm] = useState<GenerateRequest>({
    subject: '',
    topic: '',
    difficulty: 'Medium',
    count: 5,
  })
  const [generated, setGenerated] = useState<GeneratedSet | null>(null)
  const [practiceForm, setPracticeForm] = useState<TopicValues>({
    subject: '',
    topic: '',
    difficulty: 'Medium',
  })
  const [deck, setDeck] = useState<PracticeDeck | null>(null)

  function navigate(next: View) {
    setView(next)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function practiceGenerated() {
    if (!generated) return
    setDeck({
      subject: generated.request.subject,
      topic: generated.request.topic,
      questions: generated.questions,
    })
    navigate('practice')
  }

  return (
    <div className="flex min-h-svh flex-col bg-[radial-gradient(ellipse_at_top,var(--color-accent),transparent_60%)]">
      <SiteHeader view={view} onNavigate={navigate} />
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8 sm:py-12">
        <Activity mode={view === 'home' ? 'visible' : 'hidden'}>
          <GenerateSection
            form={genForm}
            onFormChange={setGenForm}
            result={generated}
            onResult={setGenerated}
            onPractice={practiceGenerated}
          />
        </Activity>
        <Activity mode={view === 'practice' ? 'visible' : 'hidden'}>
          <div className="mx-auto w-full max-w-2xl">
            <PracticeSection
              form={practiceForm}
              onFormChange={setPracticeForm}
              generated={generated}
              deck={deck}
              onDeckChange={setDeck}
            />
          </div>
        </Activity>
      </main>
      <footer className="border-t py-6 text-center text-xs text-muted-foreground">
        VivaPrep AI · Prepare Smarter. Answer Confidently.
      </footer>
    </div>
  )
}
