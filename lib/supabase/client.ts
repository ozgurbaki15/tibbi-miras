import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

/**
 * True only when both Supabase env vars are present. Consumers can use this to
 * render a graceful fallback instead of crashing when the environment is not
 * yet configured.
 */
const validSupabaseUrl = supabaseUrl?.startsWith('http://') || supabaseUrl?.startsWith('https://')
export const isSupabaseConfigured = Boolean(validSupabaseUrl && supabaseAnonKey)

/**
 * Supabase client used across the app. We avoid throwing at module load so a
 * missing environment does not hard-crash every route; instead callers check
 * `isSupabaseConfigured` and show a friendly message.
 */
export const supabase = createClient(
  validSupabaseUrl ? supabaseUrl! : 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-anon-key',
)
