import type { Metadata } from 'next'
import Link from 'next/link'

import { ForgotPasswordForm } from '@/modules/identity/presentation/password-recovery-form'
import { Card, Container } from '@/shared/ui'

export const metadata: Metadata = {
  title: 'بازیابی رمز عبور',
}

export default function ForgotPasswordPage() {
  return (
    <Container className="py-16">
      <Card className="mx-auto max-w-lg border-border bg-white p-7 shadow-raised sm:p-9">
        <p className="text-sm font-extrabold text-brand-700">
          حساب مشتری
        </p>
        <h1 className="mt-2 text-3xl font-black text-brand-950">
          بازیابی رمز عبور
        </h1>
        <p className="mt-3 leading-8 text-ink-500">
          ایمیل حساب را وارد کنید تا لینک تغییر رمز
          برای شما ارسال شود.
        </p>
        <div className="mt-7">
          <ForgotPasswordForm />
        </div>
        <Link
          className="mt-6 block text-center text-sm font-bold text-brand-700"
          href="/sign-in"
        >
          بازگشت به ورود
        </Link>
      </Card>
    </Container>
  )
}
