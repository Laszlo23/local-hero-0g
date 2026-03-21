-- Anonymous / lightweight "heads-up" reports for parks, litter, etc.
-- Community leaders & agents can query `community_signals` where status = 'open'.

create table if not exists community_signals (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  category text not null check (category in (
    'litter_waste',
    'vandalism_damage',
    'overgrown',
    'safety_concern',
    'other'
  )),
  place_label text not null,
  description text not null,
  location_hint text,
  contact_email text,
  status text not null default 'open' check (status in (
    'open',
    'reviewing',
    'scheduled',
    'resolved',
    'archived'
  ))
);

create index if not exists idx_community_signals_created on community_signals (created_at desc);
create index if not exists idx_community_signals_status on community_signals (status);
