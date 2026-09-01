import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { ProgressSteps } from '@/shared/ui'

describe('ProgressSteps', () => {
  it('announces the current step', () => {
    render(
      <ProgressSteps
        label="فرایند ثبت درخواست"
        steps={[
          { id: 'details', label: 'اطلاعات', status: 'complete' },
          { id: 'documents', label: 'مدارک', status: 'current' },
          { id: 'review', label: 'بازبینی', status: 'upcoming' },
        ]}
      />,
    )

    expect(screen.getByText('مدارک').closest('li')).toHaveAttribute('aria-current', 'step')
  })
})
