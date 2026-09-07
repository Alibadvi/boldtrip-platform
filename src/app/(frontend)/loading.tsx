import { TravelIcon } from './_components/travel-icon'

export default function Loading() {
  return (
    <div
      role="status"
      aria-live="polite"
      className="grid min-h-[65svh] place-items-center px-6 py-20 text-center"
    >
      <div>
        <div
          aria-hidden="true"
          className="relative mx-auto mb-8 grid size-28 place-items-center rounded-full bg-brand-50"
        >
          <span className="absolute inset-0 rounded-full border border-dashed border-brand-300 motion-safe:animate-orbit" />
          <span className="absolute inset-3 rounded-full border border-brand-100" />
          <TravelIcon
            name="plane"
            className="size-11 text-brand-600 motion-safe:animate-loader-float"
          />
        </div>
        <p className="text-lg font-bold text-brand-950">در حال آماده‌سازی مسیر شما…</p>
        <p className="mt-2 text-sm text-ink-500">اطلاعات صفحه در حال دریافت است.</p>
      </div>
    </div>
  )
}
