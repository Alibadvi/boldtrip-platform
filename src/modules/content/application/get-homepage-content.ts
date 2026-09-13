import configPromise from '@payload-config'
import { unstable_cache } from 'next/cache'
import { getPayload } from 'payload'

import { defaultHomepageContent, type HomepageContent } from '../domain/homepage-content'

type StoredHomepage = Partial<HomepageContent>

function storedItemsOr<T>(stored: T[] | undefined, fallback: T[]): T[] {
  return stored?.length ? stored : fallback
}

function mergeWithDefaults(stored: StoredHomepage): HomepageContent {
  return {
    hero: {
      ...defaultHomepageContent.hero,
      ...stored.hero,
      highlights: storedItemsOr(stored.hero?.highlights, defaultHomepageContent.hero.highlights),
    },
    destinationIntro: {
      ...defaultHomepageContent.destinationIntro,
      ...stored.destinationIntro,
    },
    serviceIntro: {
      ...defaultHomepageContent.serviceIntro,
      ...stored.serviceIntro,
    },
    services: storedItemsOr(stored.services, defaultHomepageContent.services),
    process: {
      ...defaultHomepageContent.process,
      ...stored.process,
      steps: storedItemsOr(stored.process?.steps, defaultHomepageContent.process.steps),
    },
    trust: {
      ...defaultHomepageContent.trust,
      ...stored.trust,
    },
    consultation: {
      ...defaultHomepageContent.consultation,
      ...stored.consultation,
    },
    faqIntro: {
      ...defaultHomepageContent.faqIntro,
      ...stored.faqIntro,
    },
    faqs: storedItemsOr(stored.faqs, defaultHomepageContent.faqs),
  }
}

async function readHomepageContent(): Promise<HomepageContent> {
  try {
    const payload = await getPayload({ config: configPromise })
    const stored = await payload.findGlobal({
      slug: 'homepage',
      depth: 0,
    })

    return mergeWithDefaults(stored as unknown as StoredHomepage)
  } catch {
    return defaultHomepageContent
  }
}

export const getHomepageContent = unstable_cache(
  readHomepageContent,
  ['homepage-content'],
  {
    revalidate: 60,
    tags: ['homepage-content'],
  },
)
