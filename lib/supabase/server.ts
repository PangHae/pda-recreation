import { createClient as createSupabaseClient } from '@supabase/supabase-js'

// Service role client — server only, never expose to client
export function createServerClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}
