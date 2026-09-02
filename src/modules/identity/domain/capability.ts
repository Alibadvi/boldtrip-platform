export const capabilities = [
  'admin.access',
  'staff.manage',
  'content.manage',
  'scheduling.manage',
  'cases.manage',
  'payments.review',
] as const

export type Capability = (typeof capabilities)[number]
