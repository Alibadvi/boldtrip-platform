import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { Button } from '@/shared/ui'

describe('Button', () => {
  it('exposes its loading state and prevents repeated submission', () => {
    render(<Button loading>ثبت درخواست</Button>)

    const button = screen.getByRole('button', { name: 'در حال انجام…' })

    expect(button).toBeDisabled()
    expect(button).toHaveAttribute('aria-busy', 'true')
  })
})
