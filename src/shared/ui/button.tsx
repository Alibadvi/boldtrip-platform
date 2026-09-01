import { cva, type VariantProps } from 'class-variance-authority'
import { forwardRef, type ButtonHTMLAttributes } from 'react'

import { cn } from '@/shared/lib/cn'

export const buttonVariants = cva(
  'inline-flex min-h-11 items-center justify-center gap-2 rounded-control px-5 text-sm font-semibold transition-colors duration-200 disabled:pointer-events-none disabled:opacity-55',
  {
    variants: {
      variant: {
        primary: 'bg-brand-600 text-white hover:bg-brand-700 active:bg-brand-800',
        secondary:
          'border border-border bg-surface text-brand-800 hover:border-brand-100 hover:bg-brand-50',
        quiet: 'text-brand-700 hover:bg-brand-50',
        danger: 'bg-danger text-white hover:brightness-90',
      },
      size: {
        small: 'min-h-10 px-4 text-sm',
        medium: 'min-h-11 px-5 text-sm',
        large: 'min-h-12 px-6 text-base',
      },
      fullWidth: {
        true: 'w-full',
        false: '',
      },
    },
    defaultVariants: {
      fullWidth: false,
      size: 'medium',
      variant: 'primary',
    },
  },
)

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants> & {
    loading?: boolean
  }

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      className,
      disabled,
      fullWidth,
      loading = false,
      size,
      type = 'button',
      variant,
      ...props
    },
    ref,
  ) => (
    <button
      ref={ref}
      type={type}
      aria-busy={loading || undefined}
      className={cn(buttonVariants({ className, fullWidth, size, variant }))}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? 'در حال انجام…' : children}
    </button>
  ),
)

Button.displayName = 'Button'
