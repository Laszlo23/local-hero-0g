-- Point → HERO token redemptions (off-chain points ledger + on-chain mint)

create table if not exists point_redemptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  points_spent integer not null check (points_spent > 0),
  token_amount_wei text not null,
  recipient_address text not null,
  chain_id integer not null,
  status text not null default 'processing' check (status in ('processing', 'completed', 'failed')),
  tx_hash text,
  failure_reason text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_point_redemptions_user_id on point_redemptions(user_id);
create index if not exists idx_point_redemptions_status on point_redemptions(status);
