// The Supabase URL and anon key may be provided as NEXT_PRIVATE_* (current
// .env.local / Vercel names) or as the legacy NEXT_PUBLIC_* names. The code
// reads the NEXT_PUBLIC_* names, and two call sites (admin login, product
// form) run in the browser, where only build-time-inlined values exist — so
// map whichever name is set onto the NEXT_PUBLIC_* keys via `env`, which
// inlines into both server and client bundles. The anon key is Supabase's
// public browser key (gated by RLS), so exposing it client-side is by design.
const supabaseEnv = {};
const supabaseUrl =
  process.env.NEXT_PRIVATE_SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey =
  process.env.NEXT_PRIVATE_SUPABASE_ANON_KEY ??
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
if (supabaseUrl) supabaseEnv.NEXT_PUBLIC_SUPABASE_URL = supabaseUrl;
if (supabaseAnonKey) supabaseEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY = supabaseAnonKey;

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: supabaseEnv,
  images: {
    // Cover images are served from the public Supabase Storage bucket.
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**"
      }
    ]
  }
};

export default nextConfig;

