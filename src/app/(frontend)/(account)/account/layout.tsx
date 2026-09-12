import type { ReactNode } from 'react'

import { requireCurrentCustomer } from '@/modules/identity'
import { Container } from '@/shared/ui'

import { AccountNavigation } from './_components/account-navigation'
import { LogoutButton } from './_components/logout-button'

export const dynamic = 'force-dynamic'

export default async function AccountLayout({
  children,
}: {
  children: ReactNode
}) {
  const customer = await requireCurrentCustomer('/account')
  const firstLetter = customer.name.trim().charAt(0) || 'ب'

  return (
    <section className="min-h-[70vh] bg-linear-to-b from-brand-50/70 to-canvas py-10 sm:py-14">
      <Container>
        <div className="grid items-start gap-6 lg:grid-cols-[17rem_minmax(0,1fr)]">
          <aside className="rounded-3xl border border-border bg-white p-5 shadow-card">
            <div className="mb-6 flex items-center gap-3 border-b border-border pb-5">
              <div className="grid size-12 shrink-0 place-items-center rounded-2xl bg-brand-600 text-lg font-black text-white">
                {firstLetter}
              </div>

              <div className="min-w-0">
                <p className="truncate font-extrabold text-brand-950">
                  {customer.name}
                </p>
                <p
                  className="truncate text-left text-xs text-ink-500"
                  dir="ltr"
                >
                  {customer.email}
                </p>
              </div>
            </div>

            <AccountNavigation />
            <LogoutButton />
          </aside>

          <div className="min-w-0">{children}</div>
        </div>
      </Container>
    </section>
  )
}