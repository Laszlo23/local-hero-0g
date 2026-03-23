-- Track quest ownership at device level (MVP creator identity).

alter table public.educational_quests
  add column if not exists creator_device_id text;

create index if not exists idx_educational_quests_creator_device
  on public.educational_quests (creator_device_id);

-- Ensure creator screens can read drafts to filter "only mine" in-app.
drop policy if exists "Educational quests select" on public.educational_quests;
create policy "Educational quests select"
  on public.educational_quests for select
  using (true);

