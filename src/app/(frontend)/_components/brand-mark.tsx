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
      className={`group inline-flex shrink-0 items-center rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-300 focus-visible:ring-offset-2 ${
        inverse ? 'bg-white/95 px-2.5 py-1.5 shadow-[0_12px_30px_rgb(0_0_0/18%)]' : ''
      }`}
    >
      <Image
        src={compact ? '/assets/boldtrip-mark.png' : '/assets/boldtrip-logo.png'}
        alt="بولدتریپ"
        width={compact ? 72 : 246}
        height={compact ? 72 : 82}
        sizes={compact ? '64px' : '(max-width: 640px) 154px, 184px'}
        priority
        className={`h-auto object-contain motion-safe:transition-transform motion-safe:duration-300 motion-safe:group-hover:scale-[1.025] ${
          compact ? 'w-14 sm:w-16' : 'w-[9.6rem] sm:w-[11.5rem]'
        }`}
      />
    </Link>
  )
}
