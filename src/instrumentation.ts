import type { Instrumentation } from 'next'

// Never send headers, query strings, cookies, filenames or raw exception messages to logs.
export const onRequestError: Instrumentation.onRequestError = (_error, _request, context) => {
  console.error(JSON.stringify({ event: 'request_error', eventId: crypto.randomUUID(), timestamp: new Date().toISOString(), route: context.routePath, router: context.routerKind }))
}
