import { createClient } from '@/lib/supabase/server'
import { requireAdmin } from '@/lib/auth'
import { Navbar } from '@/components/Navbar'

export default async function AdminPage() {
  // Require admin role - redirects to login if not authenticated or not admin
  const user = await requireAdmin()
  
  const supabase = await createClient()
  
  const { data: shops } = await supabase
    .from('shops')
    .select('*')
    .order('name')

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FAF7F2' }}>
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 mb-6">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl">🛠️</span>
              <h1 className="text-3xl font-bold text-amber-900">Admin Dashboard</h1>
            </div>
            <p className="text-amber-800">
              Welcome, <strong>{user.user_metadata?.name || user.email}</strong>! 
              You're logged in as an <strong>Admin</strong>.
            </p>
            <p className="text-amber-700 text-sm mt-2">
              Manage your coffee shop menu, pairings, and view analytics.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <a
            href="/admin/coffees"
            className="bg-white/95 backdrop-blur-sm rounded-xl shadow-sm border border-amber-100 hover:shadow-md hover:border-amber-200 transition-all p-6"
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Coffees</h2>
            <p className="text-gray-600 text-sm">Manage coffee menu items</p>
          </a>
          <a
            href="/admin/pastries"
            className="bg-white/95 backdrop-blur-sm rounded-xl shadow-sm border border-amber-100 hover:shadow-md hover:border-amber-200 transition-all p-6"
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Pastries</h2>
            <p className="text-gray-600 text-sm">Manage pastry menu items</p>
          </a>
          <a
            href="/admin/pairings"
            className="bg-white/95 backdrop-blur-sm rounded-xl shadow-sm border border-amber-100 hover:shadow-md hover:border-amber-200 transition-all p-6"
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Pairings</h2>
            <p className="text-gray-600 text-sm">Manage coffee-pastry pairings</p>
          </a>
        </div>

        <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-sm border border-amber-100 p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Shops</h2>
          <div className="space-y-2">
            {shops && shops.length > 0 ? (
              shops.map((shop: any) => (
                <div key={shop.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <div>
                    <p className="font-medium text-gray-900">{shop.name}</p>
                    <p className="text-sm text-gray-600">Slug: {shop.slug}</p>
                  </div>
                  <a
                    href={`/shop/${shop.slug}`}
                    target="_blank"
                    className="text-amber-600 hover:text-amber-800 text-sm"
                  >
                    View Shop →
                  </a>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No shops found</p>
            )}
          </div>
        </div>

        <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-sm border border-amber-100 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Analytics</h2>
          <a
            href="/admin/analytics"
            className="text-amber-600 hover:text-amber-800"
          >
            View Analytics Dashboard →
          </a>
        </div>
      </div>
    </div>
  )
}

