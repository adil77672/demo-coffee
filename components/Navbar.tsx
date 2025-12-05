'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface NavbarProps {
  shopSlug?: string
}

export function Navbar({ shopSlug }: NavbarProps) {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient()
    
    // Get current user
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user)
      setIsLoading(false)
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  const cartLink = shopSlug ? `/shop/${shopSlug}/cart` : '/'
  const checkoutLink = shopSlug ? `/shop/${shopSlug}/cart` : '/'

  return (
    <nav className="bg-white border-b border-gray-200">
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
          {shopSlug && (
            <>
              <Link href={cartLink} className="text-gray-700 hover:text-gray-900">
                Cart
              </Link>
              <Link href={checkoutLink} className="text-gray-700 hover:text-gray-900">
                Checkout
              </Link>
            </>
          )}
          {isLoading ? (
            <div className="px-4 py-2 text-gray-400">Loading...</div>
          ) : user ? (
            <>
              {user.user_metadata?.role === 'admin' ? (
                <>
                  <Link
                    href="/admin"
                    className="px-3 py-1.5 bg-amber-100 text-amber-800 rounded-lg text-sm font-medium hover:bg-amber-200"
                  >
                    🛠️ Admin Dashboard
                  </Link>
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-lg">
                    <span className="text-sm text-gray-600">Admin:</span>
                    <span className="text-sm font-medium text-gray-900">
                      {user.user_metadata?.name || user.email}
                    </span>
                  </div>
                </>
              ) : (
                <>
                  <Link
                    href="/orders"
                    className="text-gray-700 hover:text-gray-900 font-medium"
                  >
                    📦 My Orders
                  </Link>
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-lg">
                    <span className="text-sm text-gray-600">Customer:</span>
                    <span className="text-sm font-medium text-gray-900">
                      {user.user_metadata?.name || user.email}
                    </span>
                  </div>
                </>
              )}
              <button
                onClick={handleLogout}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/auth/login"
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Login
              </Link>
              <Link
                href="/auth/signup"
                className="px-4 py-2 bg-amber-800 text-white rounded-lg hover:bg-amber-900 font-medium"
              >
                Sign up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}

