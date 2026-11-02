import config from '@payload-config'
import { generatePageMetadata, RootPage } from '@payloadcms/next/views'
import type { Metadata } from 'next'
import { privateRobots } from '@/shared/config/indexing'

import { importMap } from '../importMap'

type Args = {
  params: Promise<{ segments: string[] }>
  searchParams: Promise<Record<string, string | string[]>>
}

export const generateMetadata = async ({ params, searchParams }: Args): Promise<Metadata> => ({
  ...await generatePageMetadata({ config, params, searchParams }), robots: privateRobots,
})

export default function Page({ params, searchParams }: Args) {
  return RootPage({ config, params, searchParams, importMap })
}
