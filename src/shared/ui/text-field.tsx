import { forwardRef, type InputHTMLAttributes } from 'react'

import { cn } from '@/shared/lib/cn'

type TextFieldProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'id'> & {
  id: string
  label: string
  description?: string
  error?: string
}

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
  ({ className, description, error, id, label, required, ...props }, ref) => {
    const descriptionId = description ? id + '-description' : undefined
    const errorId = error ? id + '-error' : undefined
    const describedBy = [descriptionId, errorId].filter(Boolean).join(' ') || undefined

    return (
      <div className="space-y-2">
        <label htmlFor={id} className="block text-sm font-semibold text-ink-950">
          {label}
          {required ? <span className="ms-1 text-danger">*</span> : null}
        </label>

        {description ? (
          <p id={descriptionId} className="text-sm text-ink-700">
            {description}
          </p>
        ) : null}

        <input
          ref={ref}
          id={id}
          required={required}
          aria-describedby={describedBy}
          aria-invalid={Boolean(error) || undefined}
          className={cn(
            'min-h-12 w-full rounded-control border border-border bg-surface px-4 text-base text-ink-950 placeholder:text-ink-500',
            'transition-colors hover:border-brand-100 focus:border-brand-600 focus:outline-none',
            'disabled:cursor-not-allowed disabled:bg-brand-50 disabled:opacity-70',
            error && 'border-danger focus:border-danger',
            className,
          )}
          {...props}
        />

        {error ? (
          <p id={errorId} role="alert" className="text-sm font-medium text-danger">
            {error}
          </p>
        ) : null}
      </div>
    )
  },
)

TextField.displayName = 'TextField'
