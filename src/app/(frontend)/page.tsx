import Link from 'next/link'

import {
  buttonVariants,
  Card,
  Container,
  ProgressSteps,
  StatusBadge,
  TextField,
} from '@/shared/ui'

const setupSteps = [
  { id: 'foundation', label: 'پایه فنی', status: 'complete' },
  { id: 'shell', label: 'هدر و فوتر', status: 'current' },
  { id: 'homepage', label: 'صفحه اصلی', status: 'upcoming' },
] as const

export default function FoundationPage() {
  return (
    <Container size="narrow" className="py-16 sm:py-24">
      <div className="space-y-8">
        <StatusBadge tone="success">Foundation ready</StatusBadge>

        <div className="space-y-4">
          <h1 className="text-4xl leading-tight font-bold text-brand-950 sm:text-5xl">
            پایه پروژه BoldTrip آماده است
          </h1>
          <p className="max-w-2xl text-base text-ink-700 sm:text-lg">
            این صفحه موقت است و فقط سلامت Design System و مسیر RTL را نشان می‌دهد. صفحه اصلی
            واقعی در مرحله بعد طراحی می‌شود.
          </p>
        </div>

        <ProgressSteps label="مراحل پیاده‌سازی" steps={setupSteps} />

        <Card className="space-y-5">
          <div>
            <h2 className="text-xl font-semibold text-brand-950">نمونه کنترل‌های پایه</h2>
            <p className="mt-1 text-sm text-ink-700">
              رنگ، فاصله، Focus و وضعیت خطا از Tokenهای مشترک استفاده می‌کنند.
            </p>
          </div>

          <TextField
            id="foundation-email"
            label="ایمیل نمونه"
            type="email"
            placeholder="name@example.com"
            description="این فرم اطلاعاتی ذخیره نمی‌کند."
          />

          <div className="flex flex-wrap gap-3">
            <Link href="/admin" className={buttonVariants()}>
              ورود به مدیریت
            </Link>
            <button type="button" className={buttonVariants({ variant: 'secondary' })}>
              دکمه ثانویه
            </button>
          </div>
        </Card>
      </div>
    </Container>
  )
}
