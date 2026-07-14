-- Tienda schema: productos (catalog) + pedidos (orders), row-level security,
-- and Storage buckets. Paste this whole file into the Supabase SQL editor and
-- run it once. It is written to be safe to re-run.

create extension if not exists pgcrypto;

-- ---------------------------------------------------------------------------
-- productos (catalog)
-- ---------------------------------------------------------------------------
create table if not exists public.productos (
  id              uuid primary key default gen_random_uuid(),
  slug            text not null unique,
  titulo          text not null,
  descripcion     text not null,
  imagen_portada  text,
  archivo         text,                              -- storage path of the deliverable
  precio_centavos integer check (precio_centavos is null or precio_centavos > 0),
  es_gratis       boolean not null default false,
  publicado       boolean not null default false,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

-- keep updated_at fresh
create or replace function public.set_updated_at() returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists productos_set_updated_at on public.productos;
create trigger productos_set_updated_at
  before update on public.productos
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- pedidos (orders)
-- ---------------------------------------------------------------------------
do $$ begin
  create type public.pedido_estado as enum ('pendiente', 'pagado', 'entregado', 'fallido');
exception when duplicate_object then null;
end $$;

create table if not exists public.pedidos (
  id                 uuid primary key default gen_random_uuid(),
  producto_id        uuid not null references public.productos(id) on delete restrict,
  email_comprador    text not null,
  monto_centavos     integer not null check (monto_centavos > 0),
  estado             public.pedido_estado not null default 'pendiente',
  mp_preference_id   text,
  mp_payment_id      text unique,                    -- unique => idempotent webhook
  -- always mirrors the id, so a Mercado Pago notification maps straight back
  external_reference text generated always as (id::text) stored,
  download_count     integer not null default 0,
  created_at         timestamptz not null default now(),
  paid_at            timestamptz
);

create index if not exists pedidos_producto_id_idx on public.pedidos (producto_id);
create index if not exists pedidos_estado_idx on public.pedidos (estado);

-- ---------------------------------------------------------------------------
-- Row-level security
--   * The public/anon role may read ONLY published products.
--   * The public/anon role gets NOTHING on pedidos (no policy = deny).
--   * All writes and all order/file access go through the server using the
--     service-role key, which bypasses RLS.
-- ---------------------------------------------------------------------------
alter table public.productos enable row level security;
alter table public.pedidos   enable row level security;

drop policy if exists "published products are public" on public.productos;
create policy "published products are public"
  on public.productos for select
  using (publicado = true);

-- ---------------------------------------------------------------------------
-- Storage buckets
--   * productos : PRIVATE — deliverable files, served only via signed URLs the
--     server generates after payment (or for free products).
--   * portadas  : PUBLIC  — cover images, safe to serve directly.
-- Uploads happen server-side with the service role, so no permissive object
-- policies are added here (private files stay private by default).
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public) values
  ('productos', 'productos', false),
  ('portadas',  'portadas',  true)
on conflict (id) do nothing;
