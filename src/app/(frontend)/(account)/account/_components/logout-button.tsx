'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

import { Button } from '@/shared/ui'

export function LogoutButton() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleLogout = async () => {
    setError(null)
    setLoading(true)

    try {
      const response = await fetch('/api/customers/logout', {
        method: 'POST',
        credentials: 'include',
      })

      if (!response.ok) {
        throw new Error('خروج از حساب انجام نشد.')
      }

      router.replace('/sign-in')
      router.refresh()
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : 'خروج از حساب انجام نشد.',
      )
      setLoading(false)
    }
  }

  return (
    <div className="mt-5 border-t border-border pt-5">
      <Button
        fullWidth
        loading={loading}
        onClick={handleLogout}
        variant="secondary"
      >
        خروج از حساب
      </Button>

      {error ? (
        <p className="mt-3 text-center text-sm text-danger" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  )
}