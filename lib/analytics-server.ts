import { createClient } from './supabase/server'

/**
 * Server-side function to track scan events
 * Used by QR code page to ensure event is saved before redirect
 */
export async function trackScanEvent(shopId: string, qrCode: string) {
  const supabase = await createClient()
  
  // Create a unique session ID for this scan
  const sessionId = `qr_scan_${Date.now()}_${Math.random().toString(36).substring(7)}`
  
  const eventData = {
    shop_id: shopId,
    session_id: sessionId,
    event_type: 'scan',
    metadata: {
      qr_code: qrCode,
      timestamp: new Date().toISOString(),
      source: 'qr_scan',
    },
  }

  console.log('🔍 [QR Scan] Tracking scan event:', {
    shop_id: shopId,
    session_id: sessionId,
    qr_code: qrCode,
  })

  const { error, data } = await supabase
    .from('analytics_events')
    .insert(eventData)
    .select()

  if (error) {
    console.error('❌ [QR Scan] Error tracking scan event:', error)
    console.error('Error details:', JSON.stringify(error, null, 2))
    throw error
  }

  if (data && data.length > 0) {
    console.log('✅ [QR Scan] Event tracked successfully!')
    console.log('Event ID:', data[0].id)
    return data[0]
  }

  throw new Error('No data returned from insert')
}

