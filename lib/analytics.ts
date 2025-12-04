import { createClient } from './supabase/client'
import { AnalyticsEventType } from './types'
import { v4 as uuidv4 } from 'uuid'

// Get or create session ID
export function getSessionId(): string {
  if (typeof window === 'undefined') return ''
  
  let sessionId = localStorage.getItem('session_id')
  if (!sessionId) {
    sessionId = uuidv4()
    localStorage.setItem('session_id', sessionId)
  }
  return sessionId
}

// Track analytics event
export async function trackEvent(
  shopId: string,
  eventType: AnalyticsEventType,
  data: {
    coffeeId?: string
    pastryId?: string
    pairingRuleId?: string
    metadata?: Record<string, any>
  } = {}
) {
  const supabase = createClient()
  const sessionId = getSessionId()

  const { error } = await supabase.from('analytics_events').insert({
    shop_id: shopId,
    session_id: sessionId,
    event_type: eventType,
    coffee_id: data.coffeeId || null,
    pastry_id: data.pastryId || null,
    pairing_rule_id: data.pairingRuleId || null,
    metadata: data.metadata || {},
  })

  if (error) {
    console.error('Analytics tracking error:', error)
  }
}

