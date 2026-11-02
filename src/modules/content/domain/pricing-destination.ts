import { getSafeNextPath } from '@/modules/identity/domain/customer'

// Unwrap older CMS links without losing the intended form or allowing an external redirect.
export function normalizeRequestDestination(value?: string | null): string | null {
  if (!value || getSafeNextPath(value, '') !== value || /[\u0000-\u0020]/.test(value)) return null
  let url = new URL(value, 'https://boldtrip.ir')
  for (let i = 0; i < 3 && ['/sign-up', '/sign-in'].includes(url.pathname); i++) {
    const next = url.searchParams.get('next')
    if (!next || getSafeNextPath(next, '') !== next) return null
    url = new URL(next, 'https://boldtrip.ir')
  }
  if (url.origin !== 'https://boldtrip.ir') return null
  if (url.pathname === '/assessment' || url.pathname === '/assessment/apply')
    return '/assessment/apply'
  if (url.pathname === '/consultation' || url.pathname === '/consultation/book')
    return `/consultation/book${url.search}`
  const service = url.pathname.match(/^\/services\/([a-z0-9]+(?:-[a-z0-9]+)*)(?:\/apply)?\/?$/)
  if (service && service[1] !== 'boldtrip-pricing')
    return `/services/${service[1]}/apply${url.search}`
  const embassy = url.pathname.match(
    /^\/embassy-appointments\/([a-z0-9]+(?:-[a-z0-9]+)*)(?:\/apply)?\/?$/,
  )
  if (embassy) return `/embassy-appointments/${embassy[1]}/apply${url.search}`
  return null
}
