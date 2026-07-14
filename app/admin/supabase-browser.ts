/**
 * Browser Supabase client for the admin login form. Uses the public anon key
 * and stores the session in cookies (via @supabase/ssr) so the middleware and
 * server components can read the logged-in founder on subsequent requests.
 */

import { createBrowserClient } from "@supabase/ssr";

export function createBrowserSupabase() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
