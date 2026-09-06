import type { Metadata } from 'next'

import { EmptyAccountState } from '../_components/empty-account-state'

export const metadata: Metadata = {
  title: 'رزروهای مشاوره',
}

export default function AccountBookingsPage() {
  return (
    <EmptyAccountState
      actionHref="/consultation"
      actionLabel="رزرو مشاوره"
      description="زمان مشاوره، وضعیت پرداخت و تأیید نهایی رزروهای شما در این قسمت نمایش داده می‌شود."
      title="هنوز رزروی ندارید"
    />
  )
}