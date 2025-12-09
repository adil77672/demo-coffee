import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const supabase = await createClient()
    
    // Test: Get all events
    const { data: events, error } = await supabase
      .from('analytics_events')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10)

    if (error) {
      return NextResponse.json(
        { 
          success: false, 
          error: error.message,
          details: error 
        },
        { status: 500 }
      )
    }

    // Test: Try to insert a test event
    const testSessionId = `test_${Date.now()}`
    const { data: insertData, error: insertError } = await supabase
      .from('analytics_events')
      .insert({
        shop_id: '00000000-0000-0000-0000-000000000000', // Dummy ID for test
        session_id: testSessionId,
        event_type: 'scan',
        metadata: { test: true },
      })
      .select()

    return NextResponse.json({
      success: true,
      existingEvents: events?.length || 0,
      events: events,
      testInsert: {
        success: !insertError,
        error: insertError?.message,
        data: insertData,
      },
      message: 'Analytics test completed',
    })
  } catch (error: any) {
    return NextResponse.json(
      { 
        success: false, 
        error: error.message,
        stack: error.stack 
      },
      { status: 500 }
    )
  }
}

