import { getShopBySlug } from '@/lib/shop'
import { createClient } from '@/lib/supabase/server'
import { CartView } from '@/components/CartView'
import { Navbar } from '@/components/Navbar'
import { notFound } from 'next/navigation'

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
      <Navbar shopSlug={shop.slug} />
      <div className="container mx-auto px-4 py-8">
        <CartView shop={shop} coffee={coffee} pastry={pastry} pairing={pairing} />
      </div>
    </div>
  )
}

