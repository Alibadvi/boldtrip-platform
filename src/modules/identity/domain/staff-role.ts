export const staffRoles = [
  'admin',
  'consultant',
  'caseOperator',
  'financeOperator',
  'contentEditor',
] as const

export type StaffRole = (typeof staffRoles)[number]

export const staffRoleLabels: Record<StaffRole, string> = {
  admin: 'مدیر سیستم',
  consultant: 'مشاور',
  caseOperator: 'کارشناس پرونده',
  financeOperator: 'کارشناس مالی',
  contentEditor: 'ویرایشگر محتوا',
}

export function isStaffRole(value: unknown): value is StaffRole {
  return typeof value === 'string' && staffRoles.includes(value as StaffRole)
}

export function getStaffRoles(user: unknown): StaffRole[] {
  const mfaRequired = process.env.STAFF_MFA_REQUIRED === 'true'

  if (
    !user ||
    typeof user !== 'object' ||
    !('collection' in user) ||
    user.collection !== 'staff' ||
    !('accountStatus' in user) ||
    user.accountStatus !== 'active' ||
    (mfaRequired && (!('mfaEnabled' in user) || user.mfaEnabled !== true)) ||
    !('roles' in user)
  ) {
    return []
  }

  const roles = (user as { roles?: unknown }).roles

  return Array.isArray(roles) ? roles.filter(isStaffRole) : []
}
