import config from '@payload-config'
import { getPayload } from 'payload'
import { unstable_cache } from 'next/cache'

export const getContactSettings = unstable_cache(
  async () => {
    const payload = await getPayload({ config })
    return payload.findGlobal({ slug: 'contact-settings', depth: 0, overrideAccess: false })
  },
  ['contact-settings'],
  { revalidate: 60 },
)
