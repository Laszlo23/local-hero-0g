-- MVP creator policies for educational quest authoring from web client.
-- TODO: tighten with role-based checks once creator roles are enforced.

drop policy if exists "Educational quests insert" on public.educational_quests;
drop policy if exists "Educational quests update" on public.educational_quests;
drop policy if exists "Educational steps insert" on public.educational_quest_steps;
drop policy if exists "Educational steps update" on public.educational_quest_steps;

create policy "Educational quests insert"
  on public.educational_quests for insert
  with check (true);

create policy "Educational quests update"
  on public.educational_quests for update
  using (true);

create policy "Educational steps insert"
  on public.educational_quest_steps for insert
  with check (true);

create policy "Educational steps update"
  on public.educational_quest_steps for update
  using (true);

