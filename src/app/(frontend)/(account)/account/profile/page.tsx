import type { Metadata } from 'next'
import Link from 'next/link'

import {
  CustomerProfileForm,
  requireCurrentCustomer,
} from '@/modules/identity'
import { buttonVariants, Card } from '@/shared/ui'

export const metadata: Metadata = {
  title: 'اطلاعات حساب',
}

export default async function AccountProfilePage() {
  const customer = await requireCurrentCustomer(
    '/account/profile',
  )

  return (
    <Card className="border-border bg-white p-7 shadow-card sm:p-9">
      <div className="border-b border-border pb-6">
        <h1 className="text-2xl font-black text-ink">
          اطلاعات حساب
        </h1>
        <p className="mt-2 leading-8 text-muted">
          نام و شماره موبایل خود را برای استفاده در
          درخواست‌ها و رزروها به‌روز نگه دارید.
        </p>
      </div>

      <CustomerProfileForm customer={customer} />

      <div className="mt-8 border-t border-border pt-6">
        <h2 className="font-black text-ink">
          امنیت حساب
        </h2>
        <p className="mt-2 text-sm leading-7 text-muted">
          برای انتخاب رمز جدید، لینک بازیابی را به
          ایمیل حساب ارسال کنید.
        </p>
        <Link
          className={buttonVariants({
            className: 'mt-4',
            variant: 'secondary',
          })}
          href="/forgot-password"
        >
          تغییر رمز عبور
        </Link>
      </div>
    </Card>
  )
}
