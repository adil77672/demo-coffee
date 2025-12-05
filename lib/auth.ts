import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export type UserRole = 'admin' | 'customer'

/**
 * Get the current authenticated user
 * Returns null if not authenticated
 */
export async function getCurrentUser() {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()
  
  if (error || !user) {
    return null
  }
  
  return user
}

/**
 * Get the user's role from metadata
 */
export function getUserRole(user: { user_metadata?: Record<string, any> }): UserRole {
  return user.user_metadata?.role === 'admin' ? 'admin' : 'customer'
}

/**
 * Check if user is an admin
 */
export async function isAdmin(): Promise<boolean> {
  const user = await getCurrentUser()
  if (!user) return false
  return getUserRole(user) === 'admin'
}

/**
 * Require authentication - redirects to login if not authenticated
 * Returns the authenticated user
 */
export async function requireAuth() {
  const user = await getCurrentUser()
  
  if (!user) {
    redirect('/auth/login?redirect=' + encodeURIComponent('/admin'))
  }
  
  return user
}

/**
 * Require admin role - redirects to login if not authenticated or not admin
 * Returns the authenticated admin user
 */
export async function requireAdmin() {
  const user = await requireAuth()
  const role = getUserRole(user)
  
  if (role !== 'admin') {
    redirect('/auth/login?redirect=' + encodeURIComponent('/admin') + '&error=admin_required')
  }
  
  return user
}

/**
 * Verify that the user ID matches the requested resource
 * Prevents user impersonation attacks
 */
export function verifyUserId(userId: string, requestedUserId: string): boolean {
  if (!userId || !requestedUserId) {
    return false
  }
  
  // Strict comparison to prevent type coercion attacks
  return userId === requestedUserId
}

/**
 * Require authentication and verify user owns the resource
 * Throws error if verification fails
 */
export async function requireAuthAndOwnership(requestedUserId: string) {
  const user = await requireAuth()
  
  if (!verifyUserId(user.id, requestedUserId)) {
    throw new Error('Unauthorized: You do not have permission to access this resource')
  }
  
  return user
}

