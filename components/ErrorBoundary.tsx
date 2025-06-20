'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/Button'

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex h-screen items-center justify-center bg-white">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4 text-black">Something went wrong!</h2>
        <Button
          onClick={reset}
          variant="default"
          className="border border-black" // Added border for better visibility
        >
          Try again
        </Button>
      </div>
    </div>
  )
}