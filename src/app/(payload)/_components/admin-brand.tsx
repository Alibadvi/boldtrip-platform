import Image from 'next/image'
import Link from 'next/link'

export function AdminIcon() {
  return (
    <Image
      src="/assets/boldtrip-mark.png"
      alt="BoldTrip"
      width={40}
      height={40}
      className="bt:size-10 bt:object-contain"
    />
  )
}

export function AdminLogo() {
  return (
    <div className="bt:flex bt:flex-col bt:items-center bt:gap-3 bt:py-4">
      <Image
        src="/assets/boldtrip-logo.png"
        alt="BoldTrip"
        width={246}
        height={82}
        className="bt:h-auto bt:w-[220px] bt:object-contain"
        priority
      />
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
