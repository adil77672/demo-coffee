import { createClient } from './supabase/client'
import { Shop } from './types'

// Get shop by slug
export async function getShopBySlug(slug: string): Promise<Shop | null> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('shops')
    .select('*')
    .eq('slug', slug)
    .single()

  if (error || !data) {
    console.error('Error fetching shop:', error)
    return null
  }

  return data as Shop
}

// Get shop by QR code
export async function getShopByQRCode(qrCode: string): Promise<Shop | null> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('shops')
    .select('*')
    .eq('qr_code', qrCode)
    .single()

  if (error || !data) {
    console.error('Error fetching shop by QR:', error)
    return null
  }

  return data as Shop
}

