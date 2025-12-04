import { createClient } from '@/lib/supabase/server'
import { PastryList } from '@/components/admin/PastryList'

export default async function PastriesPage() {
  const supabase = await createClient()

  const { data: shops } = await supabase
    .from('shops')
    .select('*')
    .order('name')

  const { data: pastries } = await supabase
    .from('pastries')
    .select('*, shop:shops(name, slug)')
    .order('created_at', { ascending: false })

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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Manage Pastries</h1>
        </div>
        <PastryList shops={shops || []} pastries={pastries || []} />
      </div>
    </div>
  )
}

