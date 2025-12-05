'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

const adminSignupSchema = z
  .object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Please enter a valid email address'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[0-9]/, 'Password must include at least one number'),
    confirmPassword: z.string(),
    cafeName: z.string().min(2, 'Café name must be at least 2 characters'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  })

type AdminSignupFormData = z.infer<typeof adminSignupSchema>

export default function AdminSignupPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AdminSignupFormData>({
    resolver: zodResolver(adminSignupSchema),
  })

  const onSubmit = async (data: AdminSignupFormData) => {
    setIsLoading(true)
    setError(null)
    setSuccess(false)

    try {
      const supabase = createClient()
      
      // Sign up the admin user with role
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            name: data.name,
            cafe_name: data.cafeName,
            role: 'admin', // Mark as admin
          },
        },
      })

      if (authError) {
        setError(authError.message || 'Failed to create account. Please try again.')
        setIsLoading(false)
        return
      }

      if (authData.user) {
        // Create shop in database
        const { error: shopError } = await supabase.from('shops').insert({
          name: data.cafeName,
          slug: data.cafeName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') + '-' + Date.now().toString().slice(-6),
          owner_email: data.email,
          active: true,
        })

        if (shopError) {
          console.error('Shop creation error:', shopError)
          // Don't fail the signup if shop creation fails - user can create shop later
        }

        setSuccess(true)
        // Redirect to login, which will then redirect to admin dashboard
        setTimeout(() => {
          router.push('/auth/login?redirect=/admin')
        }, 2000)
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
            <Link
              href="/auth/login"
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Login
            </Link>
            <Link
              href="/auth/signup/user"
              className="px-4 py-2 text-gray-700 hover:text-gray-900"
            >
              Customer signup
            </Link>
            <span className="px-4 py-2 bg-amber-800 text-white rounded-lg font-medium">
              Shop owner signup
            </span>
          </div>
        </div>
      </nav>

      <div className="w-full max-w-md px-4">
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-sm border border-amber-100 p-8">
          <div className="text-xs uppercase text-gray-400 tracking-wider mb-2">SHOP OWNER PORTAL</div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Create your QR shop</h1>
          <p className="text-gray-600 mb-6">Add your café, generate a QR, and start collecting table orders.</p>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          {success && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-800">
                Account created successfully! Redirecting to login...
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Your name</label>
              <input
                type="text"
                placeholder="Lena Brewster"
                {...register('name')}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 ${
                  errors.name ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Work email</label>
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
                placeholder="At least 8 characters"
                {...register('password')}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 ${
                  errors.password ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
              )}
              <p className="text-xs text-gray-500 mt-1">Must be 8+ characters and include a number.</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
              <input
                type="password"
                placeholder="Re-enter your password"
                {...register('confirmPassword')}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 ${
                  errors.confirmPassword ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Café name</label>
              <input
                type="text"
                placeholder="Sunrise Espresso Bar"
                {...register('cafeName')}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 ${
                  errors.cafeName ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {errors.cafeName && (
                <p className="mt-1 text-sm text-red-600">{errors.cafeName.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading || success}
              className="w-full bg-amber-800 hover:bg-amber-900 disabled:bg-amber-400 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              {isLoading ? 'Creating account...' : success ? 'Account created!' : 'Create shop'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-600 mt-6">
            Already have access?{' '}
            <Link href="/auth/login" className="text-amber-700 hover:text-amber-900 font-medium">
              Sign in
            </Link>
            {' • '}
            <Link href="/auth/signup/user" className="text-amber-700 hover:text-amber-900 font-medium">
              Customer signup
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

