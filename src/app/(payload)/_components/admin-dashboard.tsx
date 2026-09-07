import { Gutter } from '@payloadcms/ui'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import type { AdminViewServerProps } from 'payload'

import { getDashboardQueues, type DashboardQueue } from '@/shared/admin/get-dashboard-queues'

const tones = {
  amber: 'bt:bg-amber-50 bt:text-amber-800 bt:ring-amber-200',
  violet: 'bt:bg-violet-50 bt:text-violet-800 bt:ring-violet-200',
  blue: 'bt:bg-blue-50 bt:text-blue-800 bt:ring-blue-200',
  green: 'bt:bg-emerald-50 bt:text-emerald-800 bt:ring-emerald-200',
}

const shortcuts = [
  { title: 'محتوای وب‌سایت', description: 'آنچه مشتری در سایت می‌بیند', links: [
    { kind: 'globals', slug: 'homepage', title: 'صفحه اصلی و پرسش‌های متداول', detail: 'متن‌ها و بخش‌های صفحه اصلی' },
    { kind: 'collections', slug: 'countries', title: 'کشورها و راهنمای وقت سفارت', detail: 'شرایط، مدارک و پذیرش درخواست' },
    { kind: 'collections', slug: 'visas', title: 'انواع ویزا', detail: 'راهنما و شرایط هر مسیر' },
    { kind: 'collections', slug: 'services', title: 'خدمات', detail: 'معرفی خدمت، مراحل و قیمت' },
    { kind: 'globals', slug: 'consultation-page', title: 'صفحه مشاوره', detail: 'توضیحات و راهنمای رزرو' },
  ] },
  { title: 'رزرو و پرداخت', description: 'هماهنگی جلسات و بررسی واریزها', links: [
    { kind: 'collections', slug: 'consultation-slots', title: 'زمان‌های قابل رزرو', detail: 'تعریف زمان، مدت و هزینه جلسه' },
    { kind: 'collections', slug: 'consultation-bookings', title: 'همه رزروهای مشاوره', detail: 'مشاهده و پیگیری وضعیت جلسات' },
    { kind: 'collections', slug: 'payment-receipts', title: 'همه رسیدهای پرداخت', detail: 'واریزهای تأییدشده و در انتظار بررسی' },
    { kind: 'globals', slug: 'payment-settings', title: 'اطلاعات کارت و واریز', detail: 'اطلاعاتی که به مشتری نمایش داده می‌شود' },
  ] },
  { title: 'مشتریان و پرونده‌ها', description: 'دسترسی به سوابق و اعضای تیم', links: [
    { kind: 'collections', slug: 'service-requests', title: 'همه درخواست‌ها', detail: 'پرونده‌ها در تمام مراحل رسیدگی' },
    { kind: 'collections', slug: 'customer-documents', title: 'همه مدارک', detail: 'مدارک ارسالی و نتیجه بررسی' },
    { kind: 'collections', slug: 'customers', title: 'مشتریان', detail: 'اطلاعات حساب مشتریان' },
    { kind: 'collections', slug: 'staff', title: 'همکاران و دسترسی‌ها', detail: 'حساب اعضای تیم و نقش هر همکار' },
  ] },
] as const

function QueueCard({ queue }: { queue: DashboardQueue }) {
  return (
    <section aria-labelledby={`queue-${queue.collection}`} className="bt:flex bt:min-w-0 bt:flex-col bt:overflow-hidden bt:rounded-2xl bt:border bt:border-solid bt:border-slate-200 bt:bg-white bt:shadow-sm">
      <div className="bt:flex bt:items-start bt:justify-between bt:gap-4 bt:p-6">
        <div className="bt:min-w-0">
          <h2 id={`queue-${queue.collection}`} className="bt:m-0 bt:text-lg bt:font-bold bt:leading-8 bt:text-[#24133f]">{queue.title}</h2>
          <p className="bt:mt-2 bt:mb-0 bt:text-sm bt:leading-7 bt:text-slate-500">{queue.description}</p>
        </div>
        <span className={`bt:flex bt:min-h-12 bt:min-w-12 bt:shrink-0 bt:items-center bt:justify-center bt:rounded-2xl bt:px-3 bt:text-xl bt:font-bold bt:tabular-nums bt:ring-1 bt:ring-inset ${tones[queue.tone]}`} aria-label={queue.total === null ? 'تعداد در دسترس نیست' : `${queue.total} مورد`}>
          {queue.total === null ? '—' : new Intl.NumberFormat('fa-IR').format(queue.total)}
        </span>
      </div>
      <div className="bt:flex-1 bt:px-6">
        {queue.total === null ? (
          <p role="status" className="bt:my-0 bt:rounded-xl bt:bg-amber-50 bt:p-4 bt:text-sm bt:leading-7 bt:text-amber-900">دریافت اطلاعات این بخش ممکن نشد. از لینک پایین، فهرست را باز کنید.</p>
        ) : queue.items.length === 0 ? (
          <div className="bt:rounded-xl bt:bg-slate-50 bt:px-5 bt:py-7">
            <p className="bt:m-0 bt:text-sm bt:leading-7 bt:text-slate-600">{queue.empty}</p>
            <p className="bt:mt-1 bt:mb-0 bt:text-xs bt:leading-6 bt:text-slate-500">موارد جدید در همین بخش نمایش داده می‌شوند.</p>
          </div>
        ) : (
          <ul className="bt:m-0 bt:list-none bt:p-0">
            {queue.items.map((item) => (
              <li key={item.id} className="bt:border-0 bt:border-t bt:border-solid bt:border-slate-100">
                <Link href={item.href} className="bt:flex bt:min-h-16 bt:items-center bt:justify-between bt:gap-4 bt:rounded-lg bt:px-2 bt:py-3 bt:text-inherit bt:no-underline bt:hover:bg-violet-50 bt:focus-visible:outline-2 bt:focus-visible:outline-offset-2 bt:focus-visible:outline-violet-600">
                  <div className="bt:min-w-0">
                    <bdi className="bt:block bt:truncate bt:text-sm bt:font-semibold bt:text-slate-800">{item.title}</bdi>
                    <p className="bt:mt-1 bt:mb-0 bt:truncate bt:text-xs bt:leading-6 bt:text-slate-500">{item.detail}</p>
                  </div>
                  <span aria-hidden="true" className="bt:shrink-0 bt:text-lg bt:text-violet-600">←</span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
      <Link href={queue.href} className="bt:mx-6 bt:my-5 bt:flex bt:min-h-11 bt:items-center bt:justify-between bt:rounded-xl bt:bg-slate-50 bt:px-4 bt:text-sm bt:font-semibold bt:text-[#5b34c4] bt:no-underline bt:hover:bg-violet-100 bt:focus-visible:outline-2 bt:focus-visible:outline-offset-2 bt:focus-visible:outline-violet-600">
        مشاهده فهرست کامل <span aria-hidden="true">←</span>
      </Link>
    </section>
  )
}

export async function AdminDashboard({ initPageResult }: AdminViewServerProps) {
  const { req, visibleEntities } = initPageResult
  if (!req.user || req.user.collection !== 'staff' || req.user.accountStatus !== 'active') {
    redirect(`${req.payload.config.routes.admin}/login`)
  }

  const queues = await getDashboardQueues(req, visibleEntities.collections)
  const groups = shortcuts.map((group) => ({
    ...group,
    links: group.links.filter((link) =>
      visibleEntities[link.kind].some((slug) => slug === link.slug)),
  })).filter((group) => group.links.length > 0)
  const date = new Intl.DateTimeFormat('fa-IR', {
    dateStyle: 'full', timeZone: 'Asia/Tehran',
  }).format(new Date())

  return (
    <Gutter className="boldtrip-dashboard bt:py-6 bt:pb-12">
      <div dir="rtl" className="bt:mx-auto bt:max-w-7xl bt:space-y-7">
        <header className="bt:flex bt:flex-wrap bt:items-start bt:justify-between bt:gap-4">
          <div>
            <p className="bt:mt-0 bt:mb-2 bt:text-sm bt:font-medium bt:text-violet-700">مدیریت بولدتریپ</p>
            <h1 className="bt:m-0 bt:text-3xl bt:font-bold bt:leading-tight bt:text-[#24133f]">پیشخوان</h1>
          </div>
          <p className="bt:m-0 bt:rounded-full bt:border bt:border-solid bt:border-slate-200 bt:bg-white bt:px-4 bt:py-2 bt:text-sm bt:text-slate-500">{date}</p>
        </header>

        <section className="bt:flex bt:flex-wrap bt:items-center bt:justify-between bt:gap-6 bt:rounded-2xl bt:bg-[#24133f] bt:p-6 bt:text-white bt:sm:p-8">
          <div className="bt:max-w-2xl">
            <p className="bt:mt-0 bt:mb-2 bt:text-xs bt:font-semibold bt:text-[#ffd46f]">همه‌چیز برای یک پیگیری روشن</p>
            <h2 className="bt:m-0 bt:text-xl bt:font-bold bt:leading-9 bt:text-white">از کارهای منتظر بررسی شروع کنید.</h2>
            <p className="bt:mt-2 bt:mb-0 bt:text-sm bt:leading-7 bt:text-violet-200">رسیدها و مدارک را بررسی کنید، درخواست‌ها را پیش ببرید و برای جلسه‌های آینده آماده شوید.</p>
          </div>
          <a href="/" target="_blank" rel="noopener noreferrer" className="bt:inline-flex bt:min-h-11 bt:shrink-0 bt:items-center bt:gap-3 bt:rounded-xl bt:bg-white bt:px-5 bt:py-3 bt:text-sm bt:font-semibold bt:text-[#24133f] bt:no-underline bt:hover:bg-violet-100 bt:focus-visible:outline-2 bt:focus-visible:outline-offset-4 bt:focus-visible:outline-white">مشاهده وب‌سایت <span aria-hidden="true">↗</span></a>
        </section>

        {queues.length > 0 && (
          <div className="bt:grid bt:gap-5 bt:xl:grid-cols-2">
            {queues.map((queue) => <QueueCard key={queue.collection} queue={queue} />)}
          </div>
        )}

        <section aria-labelledby="admin-shortcuts">
          <h2 id="admin-shortcuts" className="bt:mt-0 bt:mb-5 bt:text-xl bt:font-bold bt:text-[#24133f]">دسترسی سریع</h2>
          <div className="bt:grid bt:gap-5 bt:lg:grid-cols-2 bt:2xl:grid-cols-3">
            {groups.map((group) => (
              <div key={group.title} className="bt:rounded-2xl bt:border bt:border-solid bt:border-slate-200 bt:bg-white bt:p-6">
                <h3 className="bt:m-0 bt:text-base bt:font-bold bt:text-slate-800">{group.title}</h3>
                <p className="bt:mt-1 bt:mb-5 bt:text-xs bt:leading-6 bt:text-slate-500">{group.description}</p>
                <ul className="bt:m-0 bt:list-none bt:space-y-1 bt:p-0">
                  {group.links.map((link) => (
                    <li key={link.slug}>
                      <Link href={`${req.payload.config.routes.admin}/${link.kind}/${link.slug}`} className="bt:block bt:rounded-xl bt:px-3 bt:py-3 bt:text-inherit bt:no-underline bt:hover:bg-violet-50 bt:focus-visible:outline-2 bt:focus-visible:outline-offset-2 bt:focus-visible:outline-violet-600">
                        <span className="bt:block bt:text-sm bt:font-semibold bt:text-[#5b34c4]">{link.title}</span>
                        <span className="bt:mt-1 bt:block bt:text-xs bt:leading-6 bt:text-slate-500">{link.detail}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      </div>
    </Gutter>
  )
}
