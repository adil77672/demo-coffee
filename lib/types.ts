export interface Shop {
  id: string
  name: string
  slug: string
  qr_code: string
  settings: Record<string, any>
  created_at: string
  updated_at: string
}

export interface Coffee {
  id: string
  shop_id: string
  name: string
  roast: string | null
  origin: string | null
  tasting_notes: string[] | null
  description: string | null
  image: string | null
  price: number | null
  active: boolean
  created_at: string
  updated_at: string
}

export interface Pastry {
  id: string
  shop_id: string
  name: string
  notes: string | null
  flavor_profile: string | null
  image: string | null
  price: number | null
  active: boolean
  created_at: string
  updated_at: string
}

export interface PairingRule {
  id: string
  shop_id: string
  coffee_id: string
  pastry_id: string
  match_score: number
  reasoning: string | null
  active: boolean
  created_at: string
  updated_at: string
}

export interface PairingWithDetails extends PairingRule {
  coffee: Coffee
  pastry: Pastry
}

export interface CartItem {
  coffee: Coffee
  pastry: Pastry | null
  pairingRule: PairingRule | null
}

export type AnalyticsEventType = 
  | 'scan' 
  | 'coffee_select' 
  | 'pairing_view' 
  | 'pairing_accept' 
  | 'add_to_cart' 
  | 'checkout'

export interface AnalyticsEvent {
  id: string
  shop_id: string
  session_id: string
  event_type: AnalyticsEventType
  coffee_id: string | null
  pastry_id: string | null
  pairing_rule_id: string | null
  metadata: Record<string, any>
  created_at: string
}

