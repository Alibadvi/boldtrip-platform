export default function FrontendLoading() {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="در حال بارگذاری صفحه"
      className="relative min-h-[55vh]"
    >
      <span
        aria-hidden="true"
        className="pointer-events-none fixed inset-x-0 top-0 z-[200] h-0.5 overflow-hidden bg-brand-100/70"
      >
        <span className="block h-full w-1/3 rounded-full bg-linear-to-r from-brand-500 via-accent-300 to-brand-500 motion-safe:animate-shimmer" />
      </span>

      <span className="sr-only">در حال بارگذاری صفحه</span>
    </div>
  )
}
