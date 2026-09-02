import Link from 'next/link'

export function BrandMark({ inverse = false }: { inverse?: boolean }) {
  return (
    <Link
      href="/"
      className="inline-flex shrink-0 items-center gap-3"
      aria-label="بلدتریپ؛ صفحه اصلی"
    >
      <span
        className={`relative grid size-11 place-items-center overflow-hidden rounded-[0.9rem_0.9rem_0.9rem_0.25rem] bg-linear-to-br text-[0.72rem] font-black tracking-[-0.07em] text-white shadow-[0_10px_22px_rgba(91,52,196,0.24)] before:absolute before:-top-2 before:-left-1.5 before:size-5 before:rounded-full before:bg-accent-500 ${
          inverse ? 'from-brand-300 to-brand-500' : 'from-brand-500 to-brand-800'
        }`}
        dir="ltr"
        aria-hidden="true"
      >
        BT
      </span>
      <span className="flex flex-col leading-tight">
        <strong
          className={`text-lg font-black tracking-[-0.04em] ${inverse ? 'text-white' : 'text-brand-950'}`}
          dir="ltr"
        >
          BoldTrip
        </strong>
        <small
          className={`mt-1 text-[0.625rem] font-semibold max-sm:hidden ${
            inverse ? 'text-white/55' : 'text-ink-500'
          }`}
        >
          ویزای روشن، مسیر مطمئن
        </small>
      </span>
    </Link>
  )
}
