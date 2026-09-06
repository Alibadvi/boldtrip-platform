import type { Metadata } from 'next'

import {
  CustomerAuthForm,
  getSafeNextPath,
} from '@/modules/identity'
import { Card, Container } from '@/shared/ui'

type SignUpPageProps = {
  searchParams: Promise<{ next?: string }>
}

export const metadata: Metadata = {
  title: 'ایجاد حساب کاربری',
  description: 'ساخت حساب مشتری BoldTrip برای رزرو و پیگیری خدمات.',
}

export default async function SignUpPage({ searchParams }: SignUpPageProps) {
  const query = await searchParams
  const nextPath = getSafeNextPath(query.next, '/account')

  return (
    <section className="relative overflow-hidden bg-linear-to-b from-brand-50 to-canvas py-16 sm:py-24">
      <div className="pointer-events-none absolute -top-24 -right-24 size-80 rounded-full bg-brand-300/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -left-20 size-72 rounded-full bg-accent-300/25 blur-3xl" />

      <Container className="relative" size="narrow">
        <Card className="mx-auto max-w-lg border-brand-100 bg-white p-7 shadow-raised sm:p-10">
          <div className="mb-8 text-center">
            <span className="inline-flex rounded-full bg-brand-50 px-4 py-2 text-sm font-bold text-brand-700">
              عضویت در BoldTrip
            </span>
            <h1 className="mt-5 text-3xl font-black text-brand-950">ایجاد حساب کاربری</h1>
            <p className="mt-3 leading-8 text-ink-700">
              رزروها و درخواست‌های شما از طریق این حساب پیگیری خواهند شد.
            </p>
          </div>

          <CustomerAuthForm mode="sign-up" nextPath={nextPath} />
        </Card>
      </Container>
    </section>
  )
}
