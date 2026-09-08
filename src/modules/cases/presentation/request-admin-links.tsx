'use client'

import Link from 'next/link'
import { useAuth, useDocumentInfo } from '@payloadcms/ui'
import { can } from '@/modules/identity/application/can'
import { getStaffRoles } from '@/modules/identity/domain/staff-role'

export function RequestAdminLinks() {
  const { id } = useDocumentInfo()
  const { user } = useAuth()
  if (!id) return <p>درخواست را ذخیره کنید تا مدارک و رسیدهای مرتبط در دسترس باشند.</p>
  const roles = getStaffRoles(user)
  const filter = new URLSearchParams({ 'where[serviceRequest][equals]': String(id) })
  const className =
    'bt:inline-flex bt:items-center bt:rounded-xl bt:border bt:border-violet-200 bt:bg-white bt:px-4 bt:py-3 bt:font-bold bt:text-violet-900 bt:no-underline bt:hover:bg-violet-50 bt:focus-visible:outline-2'
  return (
    <aside
      className="bt:mb-6 bt:rounded-2xl bt:border bt:border-violet-100 bt:bg-violet-50/50 bt:p-5"
      aria-label="دسترسی سریع پرونده"
    >
      <p className="bt:m-0 bt:font-bold">اقدام بعدی کارشناس</p>
      <p className="bt:my-3 bt:text-sm bt:leading-7">
        مدارک را بررسی کنید؛ سپس مبلغ و وضعیت «در انتظار پرداخت» را ثبت کنید. تأیید و رد پرداخت از
        داخل رسید انجام می‌شود. برای بستن پرونده، وضعیت را تغییر دهید؛ سابقه حذف نمی‌شود.
      </p>
      <div className="bt:flex bt:flex-wrap bt:gap-3">
        {can(roles, 'cases.manage') ? (
          <Link className={className} href={`/admin/collections/customer-documents?${filter}`}>
            مدارک همین درخواست
          </Link>
        ) : null}
        {can(roles, 'payments.review') ? (
          <Link className={className} href={`/admin/collections/payment-receipts?${filter}`}>
            رسیدهای همین درخواست
          </Link>
        ) : null}
      </div>
      <p className="bt:mb-0 bt:mt-3 bt:text-sm bt:text-slate-600">
        یادداشت داخلی برای مشتری نمایش داده نمی‌شود. دلیل رد هر مدرک یا رسید را در توضیح همان مورد
        بنویسید.
      </p>
    </aside>
  )
}
