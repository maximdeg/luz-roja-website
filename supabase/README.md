# Supabase setup for the tienda

One-time setup that unblocks the real backend (catalog, orders, file storage,
admin auth). Only the project owner can do steps 1–5; after that the code drops
onto the existing repository seams.

## 1. Create the project

Go to <https://supabase.com>, create a free project. Suggested region:
**São Paulo (`sa-east-1`)** — closest to Argentina. Name it e.g. `luz-roja`.

## 2. Run the schema

Open **SQL Editor** in the project, paste the entire contents of
[`migrations/0001_tienda_schema.sql`](migrations/0001_tienda_schema.sql), and
**Run**. This creates the `productos` and `pedidos` tables, row-level security,
and the `productos` (private) + `portadas` (public) Storage buckets. It's safe
to re-run.

## 3. Copy the API keys

**Project Settings → API**, copy three values:

- Project URL
- `anon` `public` key
- `service_role` key (secret)

## 4. Fill `.env.local`

Copy `.env.example` to `.env.local` (already gitignored) and paste the values:

```
NEXT_PRIVATE_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PRIVATE_SUPABASE_ANON_KEY=eyJ...
NEXT_PRIVATE_SUPABASE_SERVICE_ROLE_KEY=eyJ...
```

**Keep the `service_role` key only in `.env.local`.** It bypasses all security
rules — never commit it and never paste it into chat. The Project URL and `anon`
key are safe to share.

## 5. Create the admin user (for the admin panel)

**Authentication → Users → Add user**, create an email/password account for each
founder. These are the only logins that will reach `/admin`.

## What happens next

Once `.env.local` is filled, the implementation wires onto the existing seams:

- `SupabaseCatalogRepository` implements `CatalogRepository`
- `SupabasePedidoRepository` implements `PedidoRepository`
- the `/tienda` page reads real published products
- deliverable files upload to the private `productos` bucket and are served via
  short-lived signed URLs

Nothing that already depends on the repository interfaces has to change.
