import { describe, expect, it } from 'vitest'

import { can } from '@/modules/identity'

describe('staff capabilities', () => {
  it('gives administrators every operational capability', () => {
    expect(can(['admin'], 'payments.review')).toBe(true)
    expect(can(['admin'], 'staff.manage')).toBe(true)
  })

  it('keeps finance access limited to payment review and admin access', () => {
    expect(can(['financeOperator'], 'payments.review')).toBe(true)
    expect(can(['financeOperator'], 'admin.access')).toBe(true)
    expect(can(['financeOperator'], 'cases.manage')).toBe(false)
    expect(can(['financeOperator'], 'staff.manage')).toBe(false)
  })

  it('combines capabilities when a staff member has multiple roles', () => {
    expect(can(['consultant', 'contentEditor'], 'scheduling.manage')).toBe(true)
    expect(can(['consultant', 'contentEditor'], 'content.manage')).toBe(true)
  })
})
