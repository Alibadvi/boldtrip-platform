import configPromise from '@payload-config'
import { getPayload } from 'payload'

import {
  defaultHomepageContent,
  type HomepageContent,
} from '../domain/homepage-content'

type StoredHomepage = Partial<HomepageContent>

function useStoredItems<T>(stored: T[] | undefined, fallback: T[]): T[] {
  return stored?.length ? stored : fallback
}

function mergeWithDefaults(stored: StoredHomepage): HomepageContent {
  return {
    hero: {
      ...defaultHomepageContent.hero,
      ...stored.hero,
      highlights: useStoredItems(
        stored.hero?.highlights,
        defaultHomepageContent.hero.highlights,
      ),
    },
    destinationIntro: {
      ...defaultHomepageContent.destinationIntro,
      ...stored.destinationIntro,
    },
    destinations: useStoredItems(
      stored.destinations,
      defaultHomepageContent.destinations,
    ),
    serviceIntro: {
      ...defaultHomepageContent.serviceIntro,
      ...stored.serviceIntro,
    },
    services: useStoredItems(stored.services, defaultHomepageContent.services),
    process: {
      ...defaultHomepageContent.process,
      ...stored.process,
      steps: useStoredItems(
        stored.process?.steps,
        defaultHomepageContent.process.steps,
      ),
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
    faqs: useStoredItems(stored.faqs, defaultHomepageContent.faqs),
  }
}

export async function getHomepageContent(): Promise<HomepageContent> {
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
