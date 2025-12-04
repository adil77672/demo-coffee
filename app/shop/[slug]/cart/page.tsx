import { getShopBySlug } from '@/lib/shop'
import { createClient } from '@/lib/supabase/server'
import { CartView } from '@/components/CartView'
import { notFound } from 'next/navigation'
import Link from 'next/link'

interface PageProps {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ coffee?: string; pastry?: string; pairing?: string }>
}

export default async function CartPage({ params, searchParams }: PageProps) {
  const { slug } = await params
  const { coffee: coffeeId, pastry: pastryId, pairing: pairingId } = await searchParams
  const shop = await getShopBySlug(slug)

  if (!shop) {
    notFound()
  }

  const supabase = await createClient()

  let coffee = null
  let pastry = null
  let pairing = null

  if (coffeeId) {
    const { data } = await supabase
      .from('coffees')
      .select('*')
      .eq('id', coffeeId)
      .single()
    coffee = data
  }

  if (pastryId) {
    const { data } = await supabase
      .from('pastries')
      .select('*')
      .eq('id', pastryId)
      .single()
    pastry = data
  }

  if (pairingId) {
    const { data } = await supabase
      .from('pairing_rules')
      .select('*')
      .eq('id', pairingId)
      .single()
    pairing = data
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FAF7F2' }}>
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href={`/shop/${shop.slug}`} className="flex items-center gap-2">
            <div className="w-8 h-8 bg-amber-600 rounded flex items-center justify-center">
              <span className="text-white text-sm font-bold">☕</span>
            </div>
            <div>
              <div className="font-bold text-gray-900">AI Coffee</div>
              <div className="text-xs text-gray-500">QR cafe ordering</div>
            </div>
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-gray-700 font-medium border-b-2 border-amber-800 pb-1">
              Cart
            </span>
            <Link href={`/shop/${shop.slug}/checkout?coffee=${coffee?.id || ''}&pastry=${pastry?.id || ''}&pairing=${pairing?.id || ''}`} className="text-gray-700 hover:text-gray-900">
              Checkout
            </Link>
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
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <CartView shop={shop} coffee={coffee} pastry={pastry} pairing={pairing} />
      </div>
    </div>
  )
}

