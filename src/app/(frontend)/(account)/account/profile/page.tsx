import type { Metadata } from 'next'

import { requireCurrentCustomer } from '@/modules/identity'
import { Card } from '@/shared/ui'

export const metadata: Metadata = {
  title: 'اطلاعات حساب',
}

type ProfileItemProps = {
  direction?: 'ltr' | 'rtl'
  label: string
  value: string
}

function ProfileItem({
  direction = 'rtl',
  label,
  value,
}: ProfileItemProps) {
  return (
    <div>
      <dt className="text-sm font-bold text-ink-500">{label}</dt>
      <dd
        className="mt-2 rounded-xl border border-border bg-canvas px-4 py-3 font-bold text-ink-950"
        dir={direction}
      >
        {value || 'ثبت نشده'}
      </dd>
    </div>
  )
}

export default async function AccountProfilePage() {
  const customer = await requireCurrentCustomer('/account/profile')

  return (
    <Card className="border-border bg-white p-7 shadow-card sm:p-9">
      <div className="border-b border-border pb-6">
        <h1 className="text-2xl font-black text-brand-950">
          اطلاعات حساب
        </h1>

        <p className="mt-2 leading-8 text-ink-700">
          این اطلاعات هنگام ثبت درخواست و رزرو استفاده می‌شوند.
        </p>
      </div>

      <dl className="mt-7 grid gap-6 sm:grid-cols-2">
        <ProfileItem
          label="نام و نام خانوادگی"
          value={customer.name}
        />

        <ProfileItem
          direction="ltr"
          label="شماره موبایل"
          value={customer.mobile}
        />

        <div className="sm:col-span-2">
          <ProfileItem
            direction="ltr"
            label="ایمیل"
            value={customer.email}
          />
        </div>
      </dl>

      <p className="mt-7 rounded-xl bg-brand-50 px-4 py-3 text-sm leading-7 text-brand-800">
        ویرایش اطلاعات و تغییر رمز عبور در مرحله بعد اضافه می‌شود.
      </p>
    </Card>
  )
}