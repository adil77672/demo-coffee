import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { getShopByQRCode } from '@/lib/shop'

export async function POST(request: NextRequest) {
  try {
    const { qrCode } = await request.json()

    if (!qrCode) {
      return NextResponse.json(
        { success: false, error: 'QR code is required' },
        { status: 400 }
      )
    }

    // Get shop by QR code
    const shop = await getShopByQRCode(qrCode)

    if (!shop) {
      return NextResponse.json(
        { success: false, error: 'Shop not found' },
        { status: 404 }
      )
    }

    // Create session ID
    const sessionId = `qr_scan_${Date.now()}_${Math.random().toString(36).substring(7)}`

    // Track scan event
    const supabase = await createClient()
    const { error, data } = await supabase
      .from('analytics_events')
      .insert({
        shop_id: shop.id,
        session_id: sessionId,
        event_type: 'scan',
        metadata: {
          qr_code: qrCode,
          timestamp: new Date().toISOString(),
          source: 'qr_scan',
        },
      })
      .select()

    if (error) {
      console.error('❌ Error tracking scan event:', error)
      return NextResponse.json(
        { 
          success: false, 
          error: error.message,
          details: error 
        },
        { status: 500 }
      )
    }

    console.log('✅ Scan event tracked successfully:', data?.[0]?.id)

    return NextResponse.json({
      success: true,
      eventId: data?.[0]?.id,
      shopSlug: shop.slug,
      sessionId,
    })
  } catch (error: any) {
    console.error('❌ Exception in track-scan:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: error.message 
      },
      { status: 500 }
    )
  }
}

