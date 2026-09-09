export type FaqItem = {
  answer: string
  question: string
}

const numbers = ['۰۱', '۰۲', '۰۳', '۰۴', '۰۵', '۰۶', '۰۷', '۰۸']

export function FaqList({ items }: { items: FaqItem[] }) {
  return (
    <div className="grid gap-3">
      {items.map((item, index) => (
        <details
          key={item.question}
          open={index === 0}
          className="group overflow-hidden rounded-[1.35rem] border border-border bg-white shadow-[0_6px_22px_rgb(36_19_63/4%)] transition-[border-color,background-color,box-shadow,transform] duration-300 open:border-brand-200 open:bg-brand-50/45 open:shadow-[0_15px_35px_rgb(36_19_63/8%)] motion-safe:hover:-translate-y-0.5"
        >
          <summary className="flex min-h-19 cursor-pointer list-none items-center gap-4 px-5 py-4 text-base font-black text-brand-950 sm:px-6 [&::-webkit-details-marker]:hidden">
            <span className="text-xs font-bold text-brand-400">
              {numbers[index] ?? '•'}
            </span>

            <span className="flex-1">{item.question}</span>

            <span
              aria-hidden="true"
              className="grid size-9 shrink-0 place-items-center rounded-xl border border-brand-100 bg-brand-50 text-xl font-medium text-brand-700 transition-all duration-300 group-open:rotate-45 group-open:border-brand-600 group-open:bg-brand-600 group-open:text-white"
            >
              +
            </span>
          </summary>

          <div className="px-5 pb-5 sm:px-6 sm:pb-6 motion-safe:group-open:animate-page-enter">
            <p className="m-0 border-t border-brand-100 pt-4 text-sm leading-8 text-ink-700 sm:text-[0.95rem]">
              {item.answer}
            </p>
          </div>
        </details>
      ))}
    </div>
  )
}