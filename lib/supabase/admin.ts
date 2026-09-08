import 'server-only'
import { createClient } from '@supabase/supabase-js'

// Service-role client for the PayTR callback: the webhook has no user session,
// so it must bypass RLS to record memberships and unlocks. Never import this
// into client components.
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !serviceKey) return null
  return createClient(url, serviceKey, { auth: { persistSession: false, autoRefreshToken: false } })
}
