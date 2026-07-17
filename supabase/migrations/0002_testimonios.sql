-- Testimonios: the home-page testimonials, managed from the admin panel.
-- Requires 0001_tienda_schema.sql (it defines public.set_updated_at).
-- Paste this whole file into the Supabase SQL editor and run it once.
-- It is written to be safe to re-run: the seed uses fixed ids, so re-running
-- never duplicates rows and never overwrites later edits from the admin.

create table if not exists public.testimonios (
  id         uuid primary key default gen_random_uuid(),
  cita       text not null,
  autor      text not null,
  rol        text not null,
  orden      integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists testimonios_set_updated_at on public.testimonios;
create trigger testimonios_set_updated_at
  before update on public.testimonios
  for each row execute function public.set_updated_at();

-- Testimonials are public site content: anyone may read every row. All
-- writes go through the server with the service-role key (no write policy).
alter table public.testimonios enable row level security;

drop policy if exists "testimonials are public" on public.testimonios;
create policy "testimonials are public"
  on public.testimonios for select
  using (true);

-- Seed: the five testimonials that used to be hardcoded on the home page,
-- in their original display order.
insert into public.testimonios (id, cita, autor, rol, orden) values
  (
    'a1000000-0000-4000-8000-000000000001',
    'Nos acompañaron en todo el proceso: desde ordenar ideas hasta el último Reel. La comunicación de nuestra marca por fin se siente nuestra y, al mismo tiempo, profesional.',
    'Equipo fundador',
    'Marca de bienestar',
    1
  ),
  (
    'a1000000-0000-4000-8000-000000000002',
    'Por primera vez tenemos un calendario que sí usamos. El tono de voz quedó tan claro que hasta el equipo de ventas lo adoptó al toque.',
    'Directora de marketing',
    'Estudio de arquitectura',
    2
  ),
  (
    'a1000000-0000-4000-8000-000000000003',
    'Pasamos de publicar «por publicar» a contar una historia coherente. Las métricas no fueron el único cambio: la gente nos escribe distinto.',
    'Fundadora',
    'Tienda de diseño local',
    3
  ),
  (
    'a1000000-0000-4000-8000-000000000004',
    'Nos exigían rapidez y calidad al mismo tiempo. Ellas llevaron el ritmo, cuidaron el detalle y nos ahorraron reuniones infinitas.',
    'Responsable de comunicación',
    'ONG cultural',
    4
  ),
  (
    'a1000000-0000-4000-8000-000000000005',
    'Lo que más valoramos es que entendieron nuestra marca en serio. Cada pieza se siente auténtica, no genérica.',
    'Cofundadora',
    'Marca de cosmética',
    5
  )
on conflict (id) do nothing;
