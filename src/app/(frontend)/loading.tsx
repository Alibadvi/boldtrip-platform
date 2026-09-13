export default function FrontendLoading() {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="در حال بارگذاری صفحه"
      className="fixed inset-0 z-[100] grid min-h-dvh place-items-center bg-brand-950"
    >
      <span
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-px overflow-hidden bg-white/10"
      >
        <span className="block h-full w-1/3 rounded-full bg-accent-300 motion-safe:animate-shimmer" />
      </span>

      <span
        aria-hidden="true"
        className="size-2.5 rounded-full bg-accent-300 shadow-[0_0_24px_rgb(255_215_111/55%)] motion-safe:animate-pulse"
      />

      <span className="sr-only">در حال بارگذاری صفحه</span>
    </div>
  )
}
