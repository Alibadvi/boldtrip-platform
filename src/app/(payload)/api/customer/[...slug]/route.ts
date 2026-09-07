import config from '@payload-config'

import { handleCustomerRequest } from '@/modules/identity/infrastructure/payload/customer-api'

export const runtime = 'nodejs'

async function handler(request: Request, context: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await context.params
  return handleCustomerRequest(request, slug, config)
}

export { handler as GET, handler as POST, handler as PATCH, handler as DELETE, handler as OPTIONS }
