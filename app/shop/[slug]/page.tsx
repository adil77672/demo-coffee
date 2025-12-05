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
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <p className="text-sm text-amber-800">
                  <strong>Admin Mode:</strong> You're viewing this shop as an admin. 
                  <a href="/admin" className="ml-2 text-amber-600 hover:text-amber-800 underline">
                    Go to Admin Dashboard →
                  </a>
                </p>
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
