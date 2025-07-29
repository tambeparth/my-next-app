"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'

interface AuthGuardProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

export default function AuthGuard({ children, fallback }: AuthGuardProps) {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    const checkAuth = () => {
      // If still loading auth context, wait
      if (isLoading) {
        return
      }

      // If no user is logged in, redirect to login
      if (!user) {
        router.push('/LogIn')
        return
      }

      // User is authenticated
      setIsChecking(false)
    }

    checkAuth()
  }, [user, isLoading, router])

  // Show loading while checking authentication
  if (isLoading || isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Checking authentication...</p>
        </div>
      </div>
    )
  }

  // Show fallback if provided and not authenticated
  if (!user && fallback) {
    return <>{fallback}</>
  }

  // If user is not authenticated and no fallback, don't render anything
  // (router.push will handle redirect)
  if (!user) {
    return null
  }

  // User is authenticated, render children
  return <>{children}</>
}

// Higher-order component for easy wrapping
export function withAuthGuard<P extends object>(
  Component: React.ComponentType<P>,
  fallback?: React.ReactNode
) {
  return function AuthGuardedComponent(props: P) {
    return (
      <AuthGuard fallback={fallback}>
        <Component {...props} />
      </AuthGuard>
    )
  }
}
