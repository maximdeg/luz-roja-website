/**
 * Server-side Supabase auth client (anon key + request cookies). This is the
 * SESSION client — it answers "who is logged in?" for server components and
 * server actions. It is deliberately separate from the service-role client in
 * `../tienda/supabase-server`, which does the privileged writes only after this
 * one confirms an authenticated founder.
 */

import "server-only";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import type { User } from "@supabase/supabase-js";

export async function createServerSupabase() {
  const cookieStore = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          // Setting cookies is only allowed in Server Actions / Route Handlers;
          // in a Server Component render it throws, so swallow it there.
          try {
            for (const { name, value, options } of cookiesToSet) {
              cookieStore.set(name, value, options);
            }
          } catch {
            /* called from a Server Component — middleware refreshes instead */
          }
        }
      }
    }
  );
}

/** The logged-in founder, or null. Uses getUser() so the token is verified. */
export async function getCurrentUser(): Promise<User | null> {
  const supabase = await createServerSupabase();
  const {
    data: { user }
  } = await supabase.auth.getUser();
  return user;
}
