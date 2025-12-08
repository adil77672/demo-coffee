import { createClient } from '@/lib/supabase/server'
import { ShopList } from '@/components/admin/ShopList'
import { requireAdmin } from '@/lib/auth'

export default async function ShopsPage() {
  await requireAdmin()
  const supabase = await createClient()

  const { data: shops } = await supabase
    .from('shops')
    .select('*')
    .order('name')

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <a
            href="/admin"
            className="text-amber-600 hover:text-amber-800 mb-4 inline-block"
          >
            ← Back to Admin
          </a>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Manage Shops</h1>
          <p className="text-gray-600">Edit shop name, description, and settings</p>
        </div>
        <ShopList shops={shops || []} />
      </div>
    </div>
  )
}

