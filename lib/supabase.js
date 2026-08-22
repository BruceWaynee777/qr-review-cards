import { createClient } from '@supabase/supabase-js';

// Server-only client. Uses the service role key, which must NEVER be
// exposed to the browser — only import this file from server components
// or route handlers (files without "use client" at the top).
export function getSupabaseServer() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );
}
