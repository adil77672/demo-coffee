import { createClient } from '@/lib/supabase/server'
import { AnalyticsDashboard } from '@/components/admin/AnalyticsDashboard'
import { requireAdmin } from '@/lib/auth'

export default async function AnalyticsPage() {
  await requireAdmin()
  const supabase = await createClient()

  const { data: shops } = await supabase
    .from('shops')
    .select('*')
    .order('name')

  const { data: events, error: eventsError } = await supabase
    .from('analytics_events')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(1000)

  if (eventsError) {
    console.error('❌ Error fetching analytics events:', eventsError)
    console.error('Error details:', JSON.stringify(eventsError, null, 2))
  } else {
    console.log(`✅ Fetched ${events?.length || 0} analytics events`)
    if (events && events.length > 0) {
      const scanEvents = events.filter(e => e.event_type === 'scan')
      console.log(`📊 Found ${scanEvents.length} scan events`)
    }
  }

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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Analytics Dashboard</h1>
        </div>
        <AnalyticsDashboard shops={shops || []} events={events || []} />
      </div>
    </div>
  )
}

