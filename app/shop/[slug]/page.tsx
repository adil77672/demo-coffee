import { getShopBySlug } from '@/lib/shop'
import { createClient } from '@/lib/supabase/server'
import { ScanTracker } from '@/components/ScanTracker'
import { ShopMenu } from '@/components/ShopMenu'
import { Navbar } from '@/components/Navbar'
import { notFound } from 'next/navigation'

interface PageProps {
  params: Promise<{ slug: string }>
}

export default async function ShopPage({ params }: PageProps) {
  const { slug } = await params
  const shop = await getShopBySlug(slug)

  if (!shop) {
    notFound()
  }

  const supabase = await createClient()
  
  // Check if user is logged in and their role
  const { data: { user } } = await supabase.auth.getUser()
  
  const { data: coffees } = await supabase
    .from('coffees')
    .select('*')
    .eq('shop_id', shop.id)
    .eq('active', true)
    .order('name')

  const { data: pastries } = await supabase
    .from('pastries')
    .select('*')
    .eq('shop_id', shop.id)
    .eq('active', true)
    .order('name')

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FAF7F2' }}>
      <ScanTracker shop={shop} />
      <Navbar shopSlug={shop.slug} />
      <div className="container mx-auto px-4 py-8">
        {user && (
          <div className="mb-6">
            {user.user_metadata?.role === 'admin' ? (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 md:p-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <h3 className="text-base md:text-lg font-bold text-amber-900 mb-2">
                      🛠️ Admin Mode Active
                    </h3>
                    <p className="text-sm md:text-base text-amber-800 mb-3">
                      You're viewing this shop as an admin. Manage your shop's menu, pairings, and settings from the admin dashboard.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <a
                        href="/admin"
                        className="inline-block px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-lg transition-colors text-sm"
                      >
                        Admin Dashboard →
                      </a>
                      <a
                        href="/admin/coffees"
                        className="inline-block px-4 py-2 bg-white hover:bg-amber-100 text-amber-700 border border-amber-300 font-semibold rounded-lg transition-colors text-sm"
                      >
                        Add Coffees
                      </a>
                      <a
                        href="/admin/pastries"
                        className="inline-block px-4 py-2 bg-white hover:bg-amber-100 text-amber-700 border border-amber-300 font-semibold rounded-lg transition-colors text-sm"
                      >
                        Add Pastries
                      </a>
                      <a
                        href="/admin/pairings"
                        className="inline-block px-4 py-2 bg-white hover:bg-amber-100 text-amber-700 border border-amber-300 font-semibold rounded-lg transition-colors text-sm"
                      >
                        Manage Pairings
                  </a>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  <strong>Customer Mode:</strong> You're logged in as {user.user_metadata?.name || user.email}. 
                  Your orders will be saved to your account.
                  <a href="/orders" className="ml-2 text-blue-600 hover:text-blue-800 underline">
                    View My Orders →
                  </a>
                </p>
              </div>
            )}
          </div>
        )}
        <ShopMenu shop={shop} coffees={coffees || []} pastries={pastries || []} />
      </div>
    </div>
  )
}
