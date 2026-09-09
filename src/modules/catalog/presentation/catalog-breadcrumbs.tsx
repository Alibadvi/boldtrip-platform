import Link from 'next/link'

type BreadcrumbItem = {
  href?: string
  label: string
}

export function CatalogBreadcrumbs({
  items,
  inverse = false,
}: {
  items: BreadcrumbItem[]
  inverse?: boolean
}) {
  return (
    <nav aria-label="مسیر صفحه">
      <ol
        className={`flex list-none flex-wrap items-center gap-2 p-0 text-sm ${
          inverse ? 'text-white/55' : 'text-ink-500'
        }`}
      >
        {items.map((item, index) => {
          const isCurrent = index === items.length - 1

          return (
            <li className="flex items-center gap-2" key={`${item.href ?? 'current'}-${item.label}`}>
              {index > 0 ? <span aria-hidden="true">/</span> : null}
              {item.href && !isCurrent ? (
                <Link
                  className={
                    inverse
                      ? 'font-bold text-white/75 hover:text-accent-300'
                      : 'font-bold hover:text-brand-700'
                  }
                  href={item.href}
                >
                  {item.label}
                </Link>
              ) : (
                <span aria-current={isCurrent ? 'page' : undefined}>{item.label}</span>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
