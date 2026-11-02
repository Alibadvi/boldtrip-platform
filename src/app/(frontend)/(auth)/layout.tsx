import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { privateRobots } from '@/shared/config/indexing'

export const metadata: Metadata = { robots: privateRobots }
export default function AuthLayout({ children }: { children: ReactNode }) {
  return children
}
