import { getShopByQRCode } from '@/lib/shop'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { randomUUID } from 'crypto'

interface PageProps {
  params: Promise<{ code: string }>
}

export default async function QRCodePage({ params }: PageProps) {
  const { code } = await params
  const shop = await getShopByQRCode(code)

  if (!shop) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Shop Not Found</h1>
          <p className="text-gray-600">The QR code is invalid or the shop doesn't exist.</p>
        </div>
      </div>
    )
  }

  // Track scan event
  const supabase = await createClient()
  const sessionId = randomUUID()

  await supabase.from('analytics_events').insert({
    shop_id: shop.id,
    session_id: sessionId,
    event_type: 'scan',
    metadata: {},
  })

  // Redirect to shop page
  redirect(`/shop/${shop.slug}`)
}

