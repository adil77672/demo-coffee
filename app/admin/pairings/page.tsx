import { createClient } from '@/lib/supabase/server'
import { PairingList } from '@/components/admin/PairingList'
import { requireAuth } from '@/lib/auth'

export default async function PairingsPage() {
  await requireAuth()
  const supabase = await createClient()

  const { data: shops } = await supabase
    .from('shops')
    .select('*')
    .order('name')

  const { data: pairings } = await supabase
    .from('pairing_rules')
    .select(`
      *,
      coffee:coffees(name),
      pastry:pastries(name)
    `)
    .order('created_at', { ascending: false })

  const { data: coffees } = await supabase
    .from('coffees')
    .select('*')
    .eq('active', true)
    .order('name')

  const { data: pastries } = await supabase
    .from('pastries')
    .select('*')
    .eq('active', true)
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Manage Pairings</h1>
        </div>
        <PairingList
          shops={shops || []}
          coffees={coffees || []}
          pastries={pastries || []}
          pairings={pairings || []}
        />
      </div>
    </div>
  )
}

