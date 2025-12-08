import { getShopBySlug } from '@/lib/shop'
import { createClient } from '@/lib/supabase/server'
import { getPairingsForCoffee } from '@/lib/pairing'
import { PairingView } from '@/components/PairingView'
import { Navbar } from '@/components/Navbar'
import { CoffeeSelectionTracker } from '@/components/CoffeeSelectionTracker'
import { notFound } from 'next/navigation'

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
      <Navbar shopSlug={shop.slug} />
      <CoffeeSelectionTracker shopId={shop.id} coffeeId={coffeeId} />
      <div className="container mx-auto px-4 py-6 md:py-8">
        <PairingView shop={shop} coffee={coffee} pairings={pairings} />
      </div>
    </div>
  )
}

