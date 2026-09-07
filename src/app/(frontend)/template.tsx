import type { ReactNode } from 'react'

export default function FrontendTemplate({ children }: { children: ReactNode }) {
  return <div className="motion-safe:animate-page-enter">{children}</div>
}
