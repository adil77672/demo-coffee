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
              Complete control: Manage shops, coffees, pastries, pairings, prices, images, and analytics.
            </p>
            <div className="mt-4 p-4 bg-white rounded-lg border border-amber-200">
              <h3 className="font-semibold text-amber-900 mb-2 text-sm">📖 Quick Guide:</h3>
              <ol className="text-xs text-amber-800 space-y-1 list-decimal list-inside">
                <li>Add Coffees → Select shop, fill details, add image & price</li>
                <li>Add Pastries → Select shop, fill details, add image & price</li>
                <li>Create Pairings → Link coffee to pastry, set match score & reasoning</li>
                <li>Manage Shop → Edit name, description, view QR code</li>
              </ol>
            </div>
          </div>
        </div>

        {/* Management Capabilities Overview */}
        <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-sm border border-amber-100 p-5 md:p-6 mb-8">
          <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4">What You Can Manage</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <span className="text-amber-600 text-xl">☕</span>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Coffees</h3>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>✓ Create, Edit, Delete</li>
                    <li>✓ Manage Name, Roast, Origin</li>
                    <li>✓ Set Prices & Images</li>
                    <li>✓ Add Tasting Notes & Description</li>
                    <li>✓ Activate/Deactivate</li>
                  </ul>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-amber-600 text-xl">🥐</span>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Pastries</h3>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>✓ Create, Edit, Delete</li>
                    <li>✓ Manage Name & Flavor Profile</li>
                    <li>✓ Set Prices & Images</li>
                    <li>✓ Add Notes & Description</li>
                    <li>✓ Activate/Deactivate</li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <span className="text-amber-600 text-xl">🔗</span>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Pairings</h3>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>✓ Create Coffee-Pastry Pairings</li>
                    <li>✓ Set Match Scores (1-100)</li>
                    <li>✓ Add Reasoning Text</li>
                    <li>✓ Activate/Deactivate</li>
                    <li>✓ Manage Multiple Pairings per Coffee</li>
                  </ul>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-amber-600 text-xl">🏪</span>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Shop Settings</h3>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>✓ Edit Shop Name</li>
                    <li>✓ Update Description</li>
                    <li>✓ View QR Code</li>
                    <li>✓ Manage Shop Details</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
          <a
            href="/admin/shops"
            className="bg-white/95 backdrop-blur-sm rounded-xl shadow-sm border border-amber-100 hover:shadow-md hover:border-amber-200 transition-all p-5 md:p-6"
          >
            <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-2">Shops</h2>
            <p className="text-gray-600 text-xs md:text-sm">Manage shop settings</p>
          </a>
          <a
            href="/admin/coffees"
            className="bg-white/95 backdrop-blur-sm rounded-xl shadow-sm border border-amber-100 hover:shadow-md hover:border-amber-200 transition-all p-5 md:p-6"
          >
            <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-2">Coffees</h2>
            <p className="text-gray-600 text-xs md:text-sm">Manage coffee menu items</p>
          </a>
          <a
            href="/admin/pastries"
            className="bg-white/95 backdrop-blur-sm rounded-xl shadow-sm border border-amber-100 hover:shadow-md hover:border-amber-200 transition-all p-5 md:p-6"
          >
            <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-2">Pastries</h2>
            <p className="text-gray-600 text-xs md:text-sm">Manage pastry menu items</p>
          </a>
          <a
            href="/admin/pairings"
            className="bg-white/95 backdrop-blur-sm rounded-xl shadow-sm border border-amber-100 hover:shadow-md hover:border-amber-200 transition-all p-5 md:p-6"
          >
            <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-2">Pairings</h2>
            <p className="text-gray-600 text-xs md:text-sm">Manage coffee-pastry pairings</p>
          </a>
        </div>

        <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-sm border border-amber-100 p-5 md:p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg md:text-xl font-semibold text-gray-900">Quick Shop Access</h2>
            <a
              href="/admin/shops"
              className="text-amber-600 hover:text-amber-800 text-sm md:text-base font-medium"
            >
              Manage Shops →
            </a>
          </div>
          <div className="space-y-2">
            {shops && shops.length > 0 ? (
              shops.map((shop: any) => (
                <div key={shop.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">{shop.name}</p>
                    <p className="text-xs md:text-sm text-gray-600 truncate">Slug: {shop.slug}</p>
                  </div>
                  <a
                    href={`/shop/${shop.slug}`}
                    target="_blank"
                    className="text-amber-600 hover:text-amber-800 text-xs md:text-sm ml-2 flex-shrink-0"
                  >
                    View →
                  </a>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-sm md:text-base">No shops found</p>
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

