
import { createClient } from '@supabase/supabase-js';
import { env } from '@/lib/env';

// Client for Server Components (Public Data Only - No Auth/Cookies)
// This bypasses potential issues with createBrowserClient in server context
export const supabaseServerPublic = createClient(
  env.NEXT_PUBLIC_SUPABASE_URL,
  env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);
