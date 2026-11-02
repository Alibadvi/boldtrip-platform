export const privatePagePaths = [
  '/sign-in',
  '/sign-up',
  '/forgot-password',
  '/reset-password',
  '/account/:path*',
  '/admin/:path*',
  '/assessment/apply',
  '/consultation/book',
  '/services/:service/apply',
  '/embassy-appointments/:country/apply',
]

export const privateRobots = { index: false, follow: false } as const
