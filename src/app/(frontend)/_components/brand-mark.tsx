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
      className={`group inline-flex shrink-0 items-center overflow-hidden rounded-xl bg-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-300 focus-visible:ring-offset-2 ${
        inverse ? 'shadow-[0_12px_30px_rgb(0_0_0/28%)]' : 'shadow-[0_8px_24px_rgb(36_19_63/12%)]'
      }`}
    >
      <Image
        src={compact ? '/assets/boldtrip-mark.png' : '/assets/boldtrip-logo.jpg'}
        alt="بولدتریپ"
        width={compact ? 72 : 246}
        height={compact ? 72 : 82}
        sizes={compact ? '64px' : '(max-width: 640px) 154px, 184px'}
        priority
        className={`h-auto object-contain motion-safe:transition-transform motion-safe:duration-300 motion-safe:group-hover:scale-[1.02] ${
          compact ? 'w-14 sm:w-16' : 'w-[10rem] sm:w-[11.5rem]'
        }`}
      />
    </Link>
  )
}
