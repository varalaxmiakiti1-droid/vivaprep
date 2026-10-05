import { Badge } from '@/components/ui/badge'
import type { Difficulty } from '@/lib/types'
import { cn } from '@/lib/utils'

const STYLES: Record<Difficulty, string> = {
  Easy: 'bg-success/15 text-success',
  Medium: 'bg-warning/15 text-warning',
  Hard: 'bg-destructive/15 text-destructive',
}

export function DifficultyBadge({ difficulty }: { difficulty: Difficulty }) {
  return (
    <Badge variant="secondary" className={cn('border-0', STYLES[difficulty])}>
      {difficulty}
    </Badge>
  )
}
