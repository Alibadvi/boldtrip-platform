export type CustomerId = number | string

export type CustomerAuthUser = {
  collection: 'customers'
  id: CustomerId
}

export function isCustomerAuthUser(user: unknown): user is CustomerAuthUser {
  if (!user || typeof user !== 'object') {
    return false
  }

  const candidate = user as {
    collection?: unknown
    id?: unknown
  }

  return (
    candidate.collection === 'customers' &&
    (typeof candidate.id === 'string' || typeof candidate.id === 'number')
  )
}

export function normalizePhoneNumber(value: string): string {
  const persianDigits = '۰۱۲۳۴۵۶۷۸۹'
  const arabicDigits = '٠١٢٣٤٥٦٧٨٩'

  return value
    .trim()
    .replace(/[۰-۹]/g, (digit) => String(persianDigits.indexOf(digit)))
    .replace(/[٠-٩]/g, (digit) => String(arabicDigits.indexOf(digit)))
    .replace(/[\s()-]/g, '')
}

export function isValidPhoneNumber(value: string): boolean {
  return /^\+?[0-9]{10,15}$/.test(normalizePhoneNumber(value))
}

export function getSafeNextPath(
  value: string | undefined,
  fallback = '/',
): string {
  if (
    !value ||
    !value.startsWith('/') ||
    value.startsWith('//') ||
    value.includes('\\') ||
    value.includes('\r') ||
    value.includes('\n')
  ) {
    return fallback
  }

  return value
}
