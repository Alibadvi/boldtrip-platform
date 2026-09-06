import type { ReactNode } from 'react'

import { Card, Container } from '@/shared/ui'

export function ContentPage({
  children,
  description,
  eyebrow,
  title,
}: {
  children: ReactNode
  description: string
  eyebrow: string
  title: string
}) {
  return (
    <>
      <section className="border-b border-border bg-linear-to-b from-brand-50 to-canvas py-16 sm:py-24">
        <Container>
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-extrabold text-brand-700">
              {eyebrow}
            </p>
            <h1 className="mt-3 text-4xl font-black leading-tight text-brand-950 sm:text-5xl">
              {title}
            </h1>
            <p className="mt-5 text-base leading-9 text-ink-500 sm:text-lg">
              {description}
            </p>
          </div>
        </Container>
      </section>
      <section className="bg-canvas py-12 sm:py-16">
        <Container>
          <Card className="mx-auto max-w-4xl border-border bg-white p-7 shadow-card sm:p-10">
            <div className="space-y-9 leading-8 text-ink-500">
              {children}
            </div>
          </Card>
        </Container>
      </section>
    </>
  )
}

export function ContentSection({
  children,
  title,
}: {
  children: ReactNode
  title: string
}) {
  return (
    <section>
      <h2 className="text-xl font-black text-brand-950">
        {title}
      </h2>
      <div className="mt-3 space-y-3">{children}</div>
    </section>
  )
}
