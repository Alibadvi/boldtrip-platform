import Image from 'next/image'
import Link from 'next/link'

export function BrandMark({
  inverse = false,
  onNavigate,
}: {
  inverse?: boolean
  onNavigate?: () => void
}) {
  return (
    <Link
      href="/"
      onClick={onNavigate}
      className="group inline-flex shrink-0 items-center gap-3 rounded-2xl"
      aria-label="بولدتریپ؛ صفحه اصلی"
    >
      <span className="relative block h-16 w-21 shrink-0 overflow-hidden rounded-2xl bg-[#170b28] ring-1 ring-white/15 sm:h-18 sm:w-24">
        <Image
          src="/assets/boldtrip-logo.jpg"
          alt=""
          width={112}
          height={112}
          sizes="112px"
          className="absolute top-1/2 left-1/2 w-28 max-w-none -translate-x-1/2 -translate-y-1/2 mix-blend-screen motion-safe:transition-transform motion-safe:duration-300 motion-safe:group-hover:scale-105"
        />
      </span>
      <span className="flex flex-col gap-1 max-[380px]:hidden">
        <strong
          className={`text-base font-extrabold sm:text-lg ${inverse ? 'text-white' : 'text-brand-950'}`}
        >
          بولدتریپ
        </strong>
        <small className={`text-[0.65rem] ${inverse ? 'text-white/65' : 'text-ink-500'}`}>
          ویزای روشن، مسیر مطمئن
        </small>
      </span>
    </Link>
  )
}
