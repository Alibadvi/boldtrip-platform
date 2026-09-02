import type { Capability } from '../domain/capability'
import type { StaffRole } from '../domain/staff-role'

const roleCapabilities: Record<StaffRole, readonly Capability[]> = {
  admin: [
    'admin.access',
    'staff.manage',
    'content.manage',
    'scheduling.manage',
    'cases.manage',
    'payments.review',
  ],
  consultant: ['admin.access', 'scheduling.manage'],
  caseOperator: ['admin.access', 'cases.manage'],
  financeOperator: ['admin.access', 'payments.review'],
  contentEditor: ['admin.access', 'content.manage'],
}

export function can(roles: readonly StaffRole[], capability: Capability): boolean {
  return roles.some((role) => roleCapabilities[role].includes(capability))
}
