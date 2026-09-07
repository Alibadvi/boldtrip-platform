import Link from 'next/link'

export function AdminIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 40 40" fill="none" role="img" aria-label="BoldTrip">
      <rect width="40" height="40" rx="13" fill="#5b34c4" />
      <path d="M27 7h6v6a6 6 0 0 1-6-6Z" fill="#f5b82e" />
      <path d="M13 11h7a5 5 0 0 1 3 9 5 5 0 0 1-3 9h-7V11Z" stroke="white" strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M13 20h7" stroke="white" strokeWidth="2.5" />
    </svg>
  )
}

export function AdminLogo() {
  return (
    <div className="bt:flex bt:flex-col bt:items-center bt:gap-3 bt:py-4">
      <AdminIcon />
      <span dir="ltr" className="bt:text-3xl bt:font-bold bt:tracking-tight bt:text-[#24133f]">BoldTrip</span>
      <span className="bt:text-sm bt:text-slate-500">پنل مدیریت خدمات و سفر</span>
    </div>
  )
}

export function AdminNavIntro() {
  return (
    <div className="bt:mb-6 bt:border-0 bt:border-b bt:border-solid bt:border-slate-200 bt:pb-5">
      <p className="bt:m-0 bt:text-lg bt:font-bold bt:text-[#24133f]">مدیریت بولدتریپ</p>
      <p className="bt:mt-1 bt:mb-3 bt:text-xs bt:leading-6 bt:text-slate-500">پرونده‌ها، رزروها و محتوای سایت</p>
      <div className="bt:flex bt:flex-wrap bt:gap-3 bt:text-sm">
        <Link href="/admin" className="bt:rounded-md bt:font-semibold bt:text-[#5b34c4] bt:no-underline bt:hover:underline bt:focus-visible:outline-2 bt:focus-visible:outline-offset-4">پیشخوان</Link>
        <span aria-hidden="true" className="bt:text-slate-300">/</span>
        <a href="/" target="_blank" rel="noopener noreferrer" className="bt:rounded-md bt:text-slate-600 bt:no-underline bt:hover:underline bt:focus-visible:outline-2 bt:focus-visible:outline-offset-4">مشاهده سایت ↗</a>
      </div>
    </div>
  )
}
