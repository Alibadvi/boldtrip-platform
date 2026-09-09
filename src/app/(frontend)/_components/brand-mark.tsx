import Image from 'next/image'
import Link from 'next/link'

type BrandMarkProps = {
  inverse?: boolean
  compact?: boolean
  onNavigate?: () => void
}

export function BrandMark({
  inverse = false,
  compact = false,
  onNavigate,
}: BrandMarkProps) {
  return (
    <Link
      href="/"
      onClick={onNavigate}
      aria-label="بولدتریپ؛ صفحه اصلی"
      className="group inline-flex shrink-0 items-center gap-3 rounded-2xl focus-visible:outline-none"
    >
      <span className="relative grid size-14 shrink-0 place-items-center overflow-hidden rounded-[1.15rem] bg-linear-to-br from-brand-950 via-brand-800 to-brand-600 shadow-[0_12px_30px_rgb(74_42_150/25%)] ring-1 ring-white/20 sm:size-16">
        <span
          aria-hidden="true"
          className="absolute inset-0 bg-linear-to-tr from-transparent via-white/10 to-white/25"
        />

        <Image
          src="/assets/boldtrip-logo.jpg"
          alt=""
          width={120}
          height={120}
          sizes="64px"
          priority
          className="relative size-[118%] max-w-none object-cover mix-blend-screen motion-safe:transition-transform motion-safe:duration-500 motion-safe:group-hover:scale-110 motion-safe:group-hover:-rotate-2"
        />

        <span
          aria-hidden="true"
          className="absolute -top-2 -right-2 size-5 rounded-full bg-accent-300 shadow-[0_0_20px_rgb(255_212_111/80%)]"
        />
      </span>

      {!compact && (
        <span className="hidden flex-col sm:flex">
          <strong
            className={`text-lg font-black leading-6 ${
              inverse ? 'text-white' : 'text-brand-950'
            }`}
          >
            بولدتریپ
          </strong>

          <small
            className={`mt-1 text-[0.67rem] font-medium ${
              inverse ? 'text-white/60' : 'text-ink-500'
            }`}
          >
            ویزا، مهاجرت و سفر
          </small>
        </span>
      )}
    </Link>
  )
}