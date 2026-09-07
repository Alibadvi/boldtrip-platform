import config from '@payload-config'
import {
  REST_DELETE,
  REST_GET,
  REST_OPTIONS,
  REST_PATCH,
  REST_POST,
  REST_PUT,
} from '@payloadcms/next/routes'

import {
  handleCustomerRequest,
  isCustomerAuthRoute,
} from '@/modules/identity/infrastructure/payload/customer-api'

function withCustomerSession(handler: ReturnType<typeof REST_GET>) {
  return async (request: Request, context: { params: Promise<{ slug: string[] }> }) => {
    const { slug } = await context.params
    // Old tabs may still call /api/customers/login; those calls must not overwrite admin auth.
    if (isCustomerAuthRoute(slug)) return handleCustomerRequest(request, slug, config)
    return handler(request, context)
  }
}

export const GET = withCustomerSession(REST_GET(config))
export const POST = withCustomerSession(REST_POST(config))
export const DELETE = REST_DELETE(config)
export const PATCH = REST_PATCH(config)
export const PUT = REST_PUT(config)
export const OPTIONS = REST_OPTIONS(config)
