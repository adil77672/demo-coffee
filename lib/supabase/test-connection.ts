// Test script to verify Supabase connection
import { createClient } from '@supabase/supabase-js'

export async function testSupabaseConnection() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey) {
    return {
      success: false,
      error: 'Missing environment variables',
    }
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseKey)
    
    // Test connection by querying a simple table
    const { data, error } = await supabase.from('shops').select('count').limit(1)

    if (error) {
      return {
        success: false,
        error: error.message,
        details: error,
      }
    }

    return {
      success: true,
      message: 'Connection successful',
    }
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Connection failed',
      details: error,
    }
  }
}

