import type { Metadata } from 'next'

import { EmptyAccountState } from '../_components/empty-account-state'

export const metadata: Metadata = {
  title: 'مدارک من',
}

export default function AccountDocumentsPage() {
  return (
    <EmptyAccountState
      actionHref="/services"
      actionLabel="انتخاب خدمت"
      description="مدارک باید برای یک درخواست مشخص بارگذاری شوند. ابتدا خدمت موردنظر را انتخاب و درخواست خود را ثبت کنید."
      title="مدرکی بارگذاری نشده است"
    />
  )
}