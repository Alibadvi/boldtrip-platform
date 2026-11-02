import { parseCookies } from 'payload/shared'

import { customerCookieName } from '../domain/session'

export function customerSessionHeaders(input: Headers): Headers {
  const token = parseCookies(input).get(customerCookieName)
  const headers = new Headers(input)

  // A customer request must never inherit the admin session from the browser.
  headers.delete('cookie')
  headers.delete('authorization')
  headers.set('DisableAutologin', 'true')

  if (token) {
    headers.set('authorization', `JWT ${token}`)
  }

  return headers
}

export function customerApiRequest(request: Request, headers: Headers): Request {
  // NextRequest and Node's Request can come from different implementations/realms.
  // Constructing from the Request instance can access incompatible private fields.
  const init: RequestInit & { duplex?: 'half' } = { method: request.method, headers }
  if (request.method !== 'GET' && request.method !== 'HEAD' && request.body) {
    init.body = request.body
    init.duplex = 'half'
  }
  return new Request(request.url, init)
}
