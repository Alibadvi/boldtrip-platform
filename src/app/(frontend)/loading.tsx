import Image from 'next/image'

export default function FrontendLoading() {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="در حال بارگذاری صفحه"
      className="fixed inset-0 z-[100] grid min-h-dvh place-items-center overflow-hidden bg-[linear-gradient(145deg,#fbf9ff,#efe8ff,#fff4d4)]"
    >
      <div
        aria-hidden="true"
        className="absolute -top-28 -right-28 size-80 rounded-full bg-brand-300/30 blur-3xl"
      />

      <div
        aria-hidden="true"
        className="absolute -bottom-32 -left-24 size-80 rounded-full bg-accent-300/35 blur-3xl"
      />

      <div className="relative flex flex-col items-center">
        <span
          aria-hidden="true"
          className="absolute inset-0 rounded-full border border-brand-300/35 motion-safe:animate-pulse-ring"
        />

        <div className="relative grid size-28 place-items-center overflow-hidden rounded-[2rem] bg-brand-950 shadow-raised ring-1 ring-white/30 motion-safe:animate-loader-float">
          <Image
            src="/assets/boldtrip-logo.jpg"
            alt=""
            width={140}
            height={140}
            priority
            className="size-[120%] max-w-none object-cover mix-blend-screen"
          />
        </div>

        <strong className="mt-7 text-lg font-black text-brand-950">
          بولدتریپ
        </strong>

        <span className="mt-2 text-sm font-medium text-ink-500">
          در حال آماده‌کردن مسیر شما…
        </span>

        <span
          aria-hidden="true"
          className="mt-5 h-1.5 w-32 overflow-hidden rounded-full bg-brand-100"
        >
          <span className="block h-full w-1/2 rounded-full bg-linear-to-l from-brand-600 to-accent-400 motion-safe:animate-shimmer" />
        </span>
      </div>
    </div>
  )
}