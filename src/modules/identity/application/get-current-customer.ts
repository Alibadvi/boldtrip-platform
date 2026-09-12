import configPromise from '@payload-config'
import { headers as getHeaders } from 'next/headers'
import { redirect } from 'next/navigation'
import { cache } from 'react'
import { getPayload } from 'payload'

import type { CurrentCustomer } from '../domain/customer'
import { isCustomerAuthUser } from '../domain/customer'
import { customerSessionHeaders } from './customer-session'

export const getCurrentCustomer = cache(
  async (): Promise<CurrentCustomer | null> => {
    // Read request-bound data first so Next.js marks authenticated pages as
    // dynamic before Payload initializes a database connection during builds.
    const requestHeaders = new Headers(await getHeaders())
    const payload = await getPayload({
      config: configPromise,
    })

    const headers = customerSessionHeaders(requestHeaders)
    const { user } = await payload.auth({ headers })

    if (!isCustomerAuthUser(user)) {
      return null
    }

    return {
      email: typeof user.email === 'string' ? user.email : '',
      id: user.id,
      mobile: typeof user.mobile === 'string' ? user.mobile : '',
      name: typeof user.name === 'string' ? user.name : 'کاربر BoldTrip',
    }
  },
)

export async function requireCurrentCustomer(
  nextPath = '/account',
): Promise<CurrentCustomer> {
  const customer = await getCurrentCustomer()

  if (!customer) {
    redirect(`/sign-in?next=${encodeURIComponent(nextPath)}`)
  }

  return customer
}
