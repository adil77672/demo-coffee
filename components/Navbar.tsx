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
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-3 md:px-4 py-3 md:py-4">
        <div className="flex items-center justify-between gap-2 md:gap-4">
          <Link href="/" className="flex items-center gap-2 min-w-0 flex-shrink-0">
            <div className="w-7 h-7 md:w-8 md:h-8 bg-amber-600 rounded flex items-center justify-center flex-shrink-0">
              <span className="text-white text-xs md:text-sm font-bold">☕</span>
          </div>
            <div className="min-w-0">
              <div className="font-bold text-gray-900 text-sm md:text-base truncate">AI Coffee</div>
              <div className="text-xs text-gray-500 hidden sm:block">QR cafe ordering</div>
          </div>
        </Link>
          <div className="flex items-center gap-2 md:gap-4 flex-shrink-0">
          {shopSlug && (
            <>
                <Link 
                  href={cartLink} 
                  className="text-gray-700 hover:text-gray-900 text-sm md:text-base px-2 md:px-0"
                >
                  <span className="hidden sm:inline">Cart</span>
                  <span className="sm:hidden">🛒</span>
              </Link>
            </>
          )}
          {isLoading ? (
              <div className="px-2 md:px-4 py-2 text-gray-400 text-xs md:text-sm">Loading...</div>
          ) : user ? (
            <>
              {user.user_metadata?.role === 'admin' ? (
                <>
                  <Link
                    href="/admin"
                      className="px-2 md:px-3 py-1.5 bg-amber-100 text-amber-800 rounded-lg text-xs md:text-sm font-medium hover:bg-amber-200 transition-colors"
                  >
                      <span className="hidden sm:inline">🛠️ Admin</span>
                      <span className="sm:hidden">🛠️</span>
                  </Link>
                    <div className="hidden md:flex items-center gap-2 px-2 md:px-3 py-1.5 bg-gray-100 rounded-lg">
                      <span className="text-xs md:text-sm text-gray-600">Admin:</span>
                      <span className="text-xs md:text-sm font-medium text-gray-900 truncate max-w-[100px]">
                        {user.user_metadata?.name || user.email?.split('@')[0]}
                    </span>
                  </div>
                </>
              ) : (
                <>
                  <Link
                    href="/orders"
                      className="text-gray-700 hover:text-gray-900 font-medium text-xs md:text-sm px-2 md:px-0"
                  >
                      <span className="hidden sm:inline">📦 Orders</span>
                      <span className="sm:hidden">📦</span>
                  </Link>
                    <div className="hidden md:flex items-center gap-2 px-2 md:px-3 py-1.5 bg-gray-100 rounded-lg">
                      <span className="text-xs md:text-sm text-gray-600">User:</span>
                      <span className="text-xs md:text-sm font-medium text-gray-900 truncate max-w-[100px]">
                        {user.user_metadata?.name || user.email?.split('@')[0]}
                    </span>
                  </div>
                </>
              )}
              <button
                onClick={handleLogout}
                  className="px-2 md:px-4 py-1.5 md:py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 text-xs md:text-sm transition-colors"
              >
                  <span className="hidden sm:inline">Logout</span>
                  <span className="sm:hidden">↪</span>
              </button>
            </>
          ) : (
            <>
              <Link
                href="/auth/login"
                  className="px-2 md:px-4 py-1.5 md:py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 text-xs md:text-sm transition-colors"
              >
                Login
              </Link>
              <Link
                href="/auth/signup"
                  className="px-2 md:px-4 py-1.5 md:py-2 bg-amber-800 text-white rounded-lg hover:bg-amber-900 font-medium text-xs md:text-sm transition-colors"
              >
                Sign up
              </Link>
            </>
          )}
          </div>
        </div>
      </div>
    </nav>
  )
}

