import type { Metadata } from 'next'
import { Suspense } from 'react'

import { ResetPasswordForm } from '@/modules/identity/presentation/password-recovery-form'
import { Card, Container } from '@/shared/ui'

export const metadata: Metadata = {
  title: 'ثبت رمز عبور جدید',
}

export default function ResetPasswordPage() {
  return (
    <Container className="py-16">
      <Card className="mx-auto max-w-lg border-border bg-white p-7 shadow-raised sm:p-9">
        <p className="text-sm font-extrabold text-primary">
          حساب مشتری
        </p>
        <h1 className="mt-2 text-3xl font-black text-ink">
          رمز عبور جدید
        </h1>
        <p className="mt-3 leading-8 text-muted">
          یک رمز امن با حداقل ۸ کاراکتر انتخاب کنید.
        </p>
        <div className="mt-7">
          <Suspense>
            <ResetPasswordForm />
          </Suspense>
        </div>
      </Card>
    </Container>
  )
}
