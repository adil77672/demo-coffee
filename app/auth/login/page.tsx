'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/client'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

type LoginFormData = z.infer<typeof loginSchema>

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get('redirect') || '/admin'
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true)
    setError(null)
    setSuccess(false)

    try {
      const supabase = createClient()
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      })

      if (authError) {
        setError(authError.message || 'Failed to sign in. Please check your credentials.')
        setIsLoading(false)
        return
      }

      if (authData.user) {
        setSuccess(true)
        // Redirect after a brief delay to show success message
        setTimeout(() => {
          router.push(redirectTo)
          router.refresh()
        }, 1000)
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.')
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#FAF7F2' }}>
      {/* Navigation */}
      <nav className="absolute top-0 left-0 right-0 bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-amber-600 rounded flex items-center justify-center">
              <span className="text-white text-sm font-bold">☕</span>
            </div>
            <div>
              <div className="font-bold text-gray-900">AI Coffee</div>
              <div className="text-xs text-gray-500">QR cafe ordering</div>
            </div>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/" className="text-gray-700 hover:text-gray-900">
              Cart
            </Link>
            <Link href="/" className="text-gray-700 hover:text-gray-900">
              Checkout
            </Link>
            <span className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 bg-gray-50">
              Login
            </span>
            <Link
              href="/auth/signup"
              className="px-4 py-2 bg-amber-800 text-white rounded-lg hover:bg-amber-900 font-medium"
            >
              Sign up
            </Link>
          </div>
        </div>
      </nav>

      <div className="w-full max-w-md px-4">
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-sm border border-amber-100 p-8">
          <div className="text-xs uppercase text-gray-400 tracking-wider mb-2">SHOP OWNER PORTAL</div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Sign in to your shop</h1>
          <p className="text-gray-600 mb-6">Access your café dashboard and manage your menu.</p>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          {success && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-800">Sign in successful! Redirecting...</p>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input
                type="email"
                placeholder="owner@yourcafe.com"
                {...register('email')}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 ${
                  errors.email ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <input
                type="password"
                placeholder="Enter your password"
                {...register('password')}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 ${
                  errors.password ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
              )}
            </div>

            <div className="text-right">
              <Link
                href="/auth/forgot-password"
                className="text-sm text-amber-700 hover:text-amber-900 font-medium"
              >
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={isLoading || success}
              className="w-full bg-amber-800 hover:bg-amber-900 disabled:bg-amber-400 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              {isLoading ? 'Signing in...' : success ? 'Success!' : 'Sign in'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-600 mt-6">
            Don't have access?{' '}
            <Link href="/auth/signup" className="text-amber-700 hover:text-amber-900 font-medium">
              Create shop
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
