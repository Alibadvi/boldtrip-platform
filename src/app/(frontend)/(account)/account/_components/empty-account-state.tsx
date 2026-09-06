import Link from 'next/link'

import { buttonVariants, Card } from '@/shared/ui'

type EmptyAccountStateProps = {
  actionHref: string
  actionLabel: string
  description: string
  title: string
}

export function EmptyAccountState({
  actionHref,
  actionLabel,
  description,
  title,
}: EmptyAccountStateProps) {
  return (
    <Card className="border-brand-100 bg-white p-8 text-center shadow-card sm:p-12">
      <div className="mx-auto grid size-16 place-items-center rounded-2xl bg-brand-50 text-2xl text-brand-700">
        ◇
      </div>

      <h1 className="mt-6 text-2xl font-black text-brand-950">{title}</h1>

      <p className="mx-auto mt-3 max-w-xl leading-8 text-ink-700">
        {description}
      </p>

      <Link
        className={buttonVariants({ className: 'mt-7' })}
        href={actionHref}
      >
        {actionLabel}
      </Link>
    </Card>
  )
}