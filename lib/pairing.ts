import { createClient } from './supabase/client'
import { Coffee, Pastry, PairingWithDetails } from './types'

// Get pairings for a coffee
export async function getPairingsForCoffee(
  shopId: string,
  coffeeId: string
): Promise<PairingWithDetails[]> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('pairing_rules')
    .select(`
      *,
      coffee:coffees(*),
      pastry:pastries(*)
    `)
    .eq('shop_id', shopId)
    .eq('coffee_id', coffeeId)
    .eq('active', true)
    .order('match_score', { ascending: false })

  if (error) {
    console.error('Error fetching pairings:', error)
    return []
  }

  return (data || []).map((item: any) => ({
    ...item,
    coffee: item.coffee,
    pastry: item.pastry,
  })) as PairingWithDetails[]
}

