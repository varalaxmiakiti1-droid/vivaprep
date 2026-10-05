'use client'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { DIFFICULTIES, type Difficulty } from '@/lib/types'

export type TopicValues = { subject: string; topic: string; difficulty: Difficulty }

const QUICK_TOPICS: { label: string; subject: string; topic: string }[] = [
  { label: 'Java', subject: 'Java Programming', topic: 'OOP Concepts' },
  { label: 'DBMS', subject: 'DBMS', topic: 'Normalization' },
  { label: 'Data Structures', subject: 'Data Structures', topic: 'Binary Search Tree' },
  { label: 'Operating Systems', subject: 'Operating Systems', topic: 'Process Scheduling' },
  { label: 'Computer Networks', subject: 'Computer Networks', topic: 'OSI Model' },
  { label: 'AI & ML', subject: 'Artificial Intelligence & Machine Learning', topic: 'Supervised Learning' },
  { label: 'Computer Organization', subject: 'Computer Organization', topic: 'Pipelining' },
]

export function TopicFields({
  idPrefix,
  values,
  onChange,
}: {
  idPrefix: string
  values: TopicValues
  onChange: (values: TopicValues) => void
}) {
  return (
    <div className="flex flex-col gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <Label htmlFor={`${idPrefix}-subject`}>Subject Name</Label>
          <Input
            id={`${idPrefix}-subject`}
            required
            maxLength={100}
            placeholder="e.g. Data Structures"
            value={values.subject}
            onChange={(e) => onChange({ ...values, subject: e.target.value })}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor={`${idPrefix}-topic`}>Topic / Experiment</Label>
          <Input
            id={`${idPrefix}-topic`}
            required
            maxLength={150}
            placeholder="e.g. Binary Search Tree"
            value={values.topic}
            onChange={(e) => onChange({ ...values, topic: e.target.value })}
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-xs font-medium text-muted-foreground">Quick topics</span>
        <div className="flex flex-wrap gap-2">
          {QUICK_TOPICS.map((chip) => {
            const active = values.subject === chip.subject && values.topic === chip.topic
            return (
              <button
                key={chip.label}
                type="button"
                aria-pressed={active}
                onClick={() => onChange({ ...values, subject: chip.subject, topic: chip.topic })}
                className="rounded-full border bg-background px-3 py-1 text-xs font-medium text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none aria-pressed:border-primary aria-pressed:bg-primary/10 aria-pressed:text-primary"
              >
                {chip.label}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export function DifficultySelect({
  id,
  value,
  onChange,
}: {
  id: string
  value: Difficulty
  onChange: (value: Difficulty) => void
}) {
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={id}>Difficulty</Label>
      <Select value={value} onValueChange={(v) => v && onChange(v as Difficulty)}>
        <SelectTrigger id={id} className="w-full">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {DIFFICULTIES.map((d) => (
            <SelectItem key={d} value={d}>
              {d}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
