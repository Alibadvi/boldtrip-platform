import { getPayload, handleEndpoints, type SanitizedConfig } from 'payload'

import { customerSessionHeaders } from '../../application/customer-session'
import { isCustomerAuthUser } from '../../domain/customer'
import { customerCookieName } from '../../domain/session'

const collections = new Set([
  'customers',
  'service-requests',
  'customer-documents',
  'consultation-slots',
  'consultation-bookings',
  'payment-receipts',
])

const authOperations = new Set([
  'login', 'logout', 'me', 'refresh-token', 'forgot-password', 'reset-password',
])

export function isCustomerAuthRoute(slug: string[]): boolean {
  return slug[0] === 'customers' && authOperations.has(slug[1])
}

function errorResponse(message: string, status: number): Response {
  return Response.json({ errors: [{ message }] }, {
    status,
    headers: { 'Cache-Control': 'no-store' },
  })
}

function signedOut(secure: boolean): Response {
  return Response.json({ message: 'خروج از حساب انجام شد.' }, {
    headers: {
      'Cache-Control': 'no-store',
      'Set-Cookie': `${customerCookieName}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0${secure ? '; Secure' : ''}`,
    },
  })
}

export async function handleCustomerRequest(
  request: Request,
  slug: string[],
  configPromise: Promise<SanitizedConfig> | SanitizedConfig,
): Promise<Response> {
  if (!collections.has(slug[0])) {
    return errorResponse('مسیر پیدا نشد.', 404)
  }

  const config = await configPromise
  const isRead = ['GET', 'HEAD', 'OPTIONS'].includes(request.method)
  // Cookie-to-JWT forwarding requires an explicit CSRF check before mutations.
  if (!isRead) {
    const origin = request.headers.get('origin')
    const allowedOrigins = new Set([new URL(request.url).origin])
    if (config.serverURL) allowedOrigins.add(new URL(config.serverURL).origin)
    if (!origin || !allowedOrigins.has(origin)) {
      return errorResponse('مبدأ درخواست معتبر نیست.', 403)
    }
  }

  const headers = customerSessionHeaders(request.headers)
  const payload = await getPayload({ config })
  const { user } = await payload.auth({ headers })
  const isCustomer = isCustomerAuthUser(user)
  const isLogout = slug.join('/') === 'customers/logout' && request.method === 'POST'
  const isPublicAuth = slug[0] === 'customers' && (
    (request.method === 'POST' && (
      slug.length === 1 || ['login', 'forgot-password', 'reset-password'].includes(slug[1])
    )) || (isRead && slug[1] === 'me')
  )

  if (!isCustomer) {
    if (isLogout) return signedOut(process.env.NODE_ENV === 'production')
    if (!isPublicAuth) return errorResponse('برای ادامه وارد حساب مشتری شوید.', 401)
    headers.delete('authorization')
  }

  const response = await handleEndpoints({
    config,
    path: `${config.routes.api}/${slug.map(encodeURIComponent).join('/')}`,
    request: new Request(request, { headers }),
  })

  // Preserve Payload's session creation, expiry and invalidation; rename only its cookie.
  const responseHeaders = new Headers(response.headers)
  responseHeaders.delete('set-cookie')
  responseHeaders.set('Cache-Control', 'no-store')
  const payloadCookieName = `${config.cookiePrefix}-token`
  for (const cookie of response.headers.getSetCookie()) {
    if (cookie.startsWith(`${payloadCookieName}=`)) {
      responseHeaders.append('Set-Cookie', customerCookieName + cookie.slice(payloadCookieName.length))
    }
  }

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: responseHeaders,
  })
}
