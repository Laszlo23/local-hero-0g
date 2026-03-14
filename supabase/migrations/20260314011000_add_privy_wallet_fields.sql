alter table public.user_profiles
  add column if not exists wallet_address text,
  add column if not exists wallet_provider text,
  add column if not exists privy_user_id text;
