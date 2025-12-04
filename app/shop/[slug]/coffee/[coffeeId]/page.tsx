import { getShopBySlug } from '@/lib/shop'
import { createClient } from '@/lib/supabase/server'
import { getPairingsForCoffee } from '@/lib/pairing'
import { PairingView } from '@/components/PairingView'
import { notFound } from 'next/navigation'
import Link from 'next/link'

interface PageProps {
  params: Promise<{ slug: string; coffeeId: string }>
}

export default async function CoffeePairingPage({ params }: PageProps) {
  const { slug, coffeeId } = await params
  const shop = await getShopBySlug(slug)

  if (!shop) {
    notFound()
  }

  const supabase = await createClient()

  const { data: coffee } = await supabase
    .from('coffees')
    .select('*')
    .eq('id', coffeeId)
    .eq('shop_id', shop.id)
    .single()

  if (!coffee) {
    notFound()
  }

  const pairings = await getPairingsForCoffee(shop.id, coffeeId)

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
            <Link href={`/shop/${shop.slug}/cart`} className="text-gray-700 hover:text-gray-900">
              Cart
            </Link>
            <Link href={`/shop/${shop.slug}/checkout`} className="text-gray-700 hover:text-gray-900">
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
        <PairingView shop={shop} coffee={coffee} pairings={pairings} />
      </div>
    </div>
  )
}

