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
