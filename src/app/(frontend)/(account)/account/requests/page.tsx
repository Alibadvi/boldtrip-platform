import type { Metadata } from 'next'

import { EmptyAccountState } from '../_components/empty-account-state'

export const metadata: Metadata = {
  title: 'درخواست‌های من',
}

export default function AccountRequestsPage() {
  return (
    <EmptyAccountState
      actionHref="/services"
      actionLabel="مشاهده خدمات"
      description="پس از ثبت اولین درخواست ویزا یا وقت سفارت، وضعیت آن در این قسمت نمایش داده می‌شود."
      title="هنوز درخواستی ثبت نکرده‌اید"
    />
  )
}