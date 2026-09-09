import { cva, type VariantProps } from 'class-variance-authority'
import { forwardRef, type ButtonHTMLAttributes } from 'react'

import { cn } from '@/shared/lib/cn'

export const buttonVariants = cva(
  [
    'inline-flex items-center justify-center gap-2 rounded-xl px-5 text-sm font-bold',
    'transition-[transform,background-color,border-color,color,box-shadow] duration-300',
    'focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-200',
    'disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-55',
    'motion-safe:hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]',
  ].join(' '),
  {
    variants: {
      variant: {
        primary:
          'bg-brand-600 text-white shadow-[0_10px_24px_rgb(91_52_196/20%)] hover:bg-brand-700 hover:shadow-[0_14px_30px_rgb(91_52_196/28%)]',
        secondary:
          'border border-brand-100 bg-white text-brand-800 shadow-[0_6px_18px_rgb(36_19_63/5%)] hover:border-brand-300 hover:bg-brand-50',
        quiet:
          'text-brand-700 shadow-none hover:bg-brand-50 hover:shadow-none',
        danger:
          'bg-danger text-white shadow-[0_10px_24px_rgb(180_35_24/15%)] hover:brightness-95',
      },
      size: {
        small: 'min-h-10 px-4 text-sm',
        medium: 'min-h-11 px-5 text-sm',
        large: 'min-h-13 rounded-2xl px-7 text-base',
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
      className={cn(
        buttonVariants({
          className,
          fullWidth,
          size,
          variant,
        }),
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <span
          aria-hidden="true"
          className="size-4 animate-spin rounded-full border-2 border-current border-l-transparent"
        />
      )}

      {loading ? 'در حال انجام…' : children}
    </button>
  ),
)

Button.displayName = 'Button'