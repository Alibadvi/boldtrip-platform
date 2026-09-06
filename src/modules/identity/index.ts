export { can } from './application/can'
export {
  getCurrentCustomer,
  requireCurrentCustomer,
} from './application/get-current-customer'

export type { Capability } from './domain/capability'

export {
  getSafeNextPath,
  isCustomerAuthUser,
  isValidPhoneNumber,
  normalizePhoneNumber,
} from './domain/customer'

export type {
  CurrentCustomer,
  CustomerAuthUser,
  CustomerId,
} from './domain/customer'

export {
  getStaffRoles,
  isStaffRole,
  staffRoleLabels,
  staffRoles,
} from './domain/staff-role'

export type { StaffRole } from './domain/staff-role'

export { Customers } from './infrastructure/payload/customers.collection'
export { Staff } from './infrastructure/payload/staff.collection'
export { CustomerAuthForm } from './presentation/customer-auth-form'
export { CustomerProfileForm } from './presentation/customer-profile-form'
export {
  ForgotPasswordForm,
  ResetPasswordForm,
} from './presentation/password-recovery-form'
