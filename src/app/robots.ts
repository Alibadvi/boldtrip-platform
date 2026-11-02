import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const origin = process.env.NEXT_PUBLIC_SITE_URL || 'https://boldtrip.ir'
  // Login pages remain crawlable so crawlers can discover their noindex directives.
  return {
    rules: { userAgent: '*', allow: '/', disallow: ['/api/'] },
    sitemap: `${origin}/sitemap.xml`,
  }
}
