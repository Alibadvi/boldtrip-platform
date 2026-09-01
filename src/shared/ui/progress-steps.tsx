import { cn } from '@/shared/lib/cn'

type ProgressStep = {
  id: string
  label: string
  status: 'complete' | 'current' | 'upcoming'
}

type ProgressStepsProps = {
  label: string
  steps: readonly ProgressStep[]
}

export function ProgressSteps({ label, steps }: ProgressStepsProps) {
  return (
    <nav aria-label={label}>
      <ol className="grid gap-3 sm:grid-cols-3">
        {steps.map((step, index) => {
          const isComplete = step.status === 'complete'
          const isCurrent = step.status === 'current'

          return (
            <li
              key={step.id}
              aria-current={isCurrent ? 'step' : undefined}
              className={cn(
                'flex items-center gap-3 rounded-control border px-4 py-3 text-sm font-semibold',
                isComplete && 'border-success/25 bg-success-soft text-success',
                isCurrent && 'border-brand-600 bg-brand-50 text-brand-800',
                step.status === 'upcoming' && 'border-border bg-surface text-ink-500',
              )}
            >
              <span
                aria-hidden="true"
                className="flex size-7 shrink-0 items-center justify-center rounded-full border border-current"
              >
                {isComplete ? '✓' : index + 1}
              </span>
              {step.label}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
