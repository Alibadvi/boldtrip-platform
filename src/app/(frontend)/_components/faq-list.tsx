export type FaqItem = {
  answer: string
  question: string
}

export function FaqList({ items }: { items: FaqItem[] }) {
  return (
    <div className="grid gap-3">
      {items.map((item, index) => (
        <details
          className="group overflow-hidden rounded-2xl border border-border bg-white transition-colors open:border-brand-200 open:bg-brand-50/40"
          key={item.question}
          open={index === 0}
        >
          <summary className="flex min-h-18 cursor-pointer list-none items-center justify-between gap-5 px-5 py-4 text-base font-extrabold text-ink-950 [&::-webkit-details-marker]:hidden">
            <span>{item.question}</span>
            <i
              className="grid size-8 shrink-0 place-items-center rounded-lg bg-brand-50 text-xl font-medium not-italic text-brand-700 motion-safe:transition-transform motion-safe:duration-300 group-open:rotate-45 group-open:bg-brand-600 group-open:text-white"
              aria-hidden="true"
            >
              +
            </i>
          </summary>
          <div className="px-5 pb-5 motion-safe:group-open:animate-page-enter">
            <p className="m-0 max-w-3xl border-t border-border pt-4 text-[0.93rem] leading-8 text-ink-700">
              {item.answer}
            </p>
          </div>
        </details>
      ))}
    </div>
  )
}
