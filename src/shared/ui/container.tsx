import type { HTMLAttributes } from 'react'

import { cn } from '@/shared/lib/cn'

type ContainerProps = HTMLAttributes<HTMLDivElement> & {
  size?: 'wide' | 'reading' | 'narrow'
}

const sizes: Record<NonNullable<ContainerProps['size']>, string> = {
  wide: 'max-w-[75rem]',
  reading: 'max-w-[47.5rem]',
  narrow: 'max-w-[45rem]',
}

export function Container({ className, size = 'wide', ...props }: ContainerProps) {
  return (
    <div
      className={cn('mx-auto w-full px-4 sm:px-6 lg:px-8', sizes[size], className)}
      {...props}
    />
  )
}
