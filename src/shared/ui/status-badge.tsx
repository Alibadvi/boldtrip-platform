import { cva, type VariantProps } from 'class-variance-authority'
import type { HTMLAttributes } from 'react'

import { cn } from '@/shared/lib/cn'

const statusBadgeVariants = cva(
  'inline-flex min-h-7 items-center rounded-full px-3 text-xs font-semibold',
  {
    variants: {
      tone: {
        neutral: 'bg-brand-50 text-brand-800',
        success: 'bg-success-soft text-success',
        warning: 'bg-warning-soft text-warning',
        danger: 'bg-danger-soft text-danger',
        info: 'bg-info-soft text-info',
      },
    },
    defaultVariants: {
      tone: 'neutral',
    },
  },
)

type StatusBadgeProps = HTMLAttributes<HTMLSpanElement> &
  VariantProps<typeof statusBadgeVariants>

export function StatusBadge({ className, tone, ...props }: StatusBadgeProps) {
  return <span className={cn(statusBadgeVariants({ tone }), className)} {...props} />
}
