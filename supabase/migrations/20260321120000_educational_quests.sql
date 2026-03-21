-- Educational / class AR quests (see docs/EDUCATIONAL_AR_QUESTS.md)

create table if not exists public.educational_quests (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  slug text not null unique,
  title text not null,
  summary text not null default '',
  age_min int not null default 8,
  age_max int not null default 16,
  learning_objectives jsonb not null default '[]'::jsonb,
  subject_tags text[] not null default '{}',
  quest_type text not null default 'hybrid'
    check (quest_type in ('ar_overlay', 'field_observation', 'qr_trail', 'photo_evidence', 'hybrid')),
  points_per_step int not null default 15,
  bonus_complete int not null default 40,
  visibility text not null default 'draft'
    check (visibility in ('draft', 'published', 'archived')),
  sort_order int not null default 0
);

create table if not exists public.educational_quest_steps (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  quest_id uuid not null references public.educational_quests (id) on delete cascade,
  step_index int not null,
  title text not null,
  instruction text not null,
  evidence_type text not null default 'none'
    check (evidence_type in ('none', 'photo', 'qr_scan', 'gps_checkpoint', 'quiz', 'field_observation')),
  ar_visual text not null default 'leaf'
    check (ar_visual in ('tree', 'book', 'chest', 'leaf', 'water', 'recycle')),
  ar_x numeric not null default 50,
  ar_y numeric not null default 50,
  ar_emoji text not null default '🌿',
  qr_expected text,
  quiz_prompt text,
  quiz_option_a text,
  quiz_option_b text,
  quiz_correct text check (quiz_correct is null or quiz_correct in ('a', 'b')),
  points_override int,
  unique (quest_id, step_index)
);

create index if not exists idx_edu_quest_steps_quest on public.educational_quest_steps (quest_id);

create table if not exists public.educational_quest_progress (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  device_id text not null,
  quest_id uuid not null references public.educational_quests (id) on delete cascade,
  current_step_index int not null default 0,
  completed_step_indices int[] not null default '{}',
  completed_at timestamptz,
  unique (device_id, quest_id)
);

create index if not exists idx_edu_progress_device on public.educational_quest_progress (device_id);

alter table public.educational_quests enable row level security;
alter table public.educational_quest_steps enable row level security;
alter table public.educational_quest_progress enable row level security;

drop policy if exists "Published educational quests are readable" on public.educational_quests;
create policy "Published educational quests are readable"
  on public.educational_quests for select
  using (visibility = 'published');

drop policy if exists "Steps of published quests are readable" on public.educational_quest_steps;
create policy "Steps of published quests are readable"
  on public.educational_quest_steps for select
  using (
    exists (
      select 1 from public.educational_quests q
      where q.id = quest_id and q.visibility = 'published'
    )
  );

drop policy if exists "Educational progress select" on public.educational_quest_progress;
drop policy if exists "Educational progress insert" on public.educational_quest_progress;
drop policy if exists "Educational progress update" on public.educational_quest_progress;

create policy "Educational progress select"
  on public.educational_quest_progress for select
  using (true);

create policy "Educational progress insert"
  on public.educational_quest_progress for insert
  with check (true);

create policy "Educational progress update"
  on public.educational_quest_progress for update
  using (true);

-- Seed (idempotent)
insert into public.educational_quests (
  slug, title, summary, age_min, age_max, learning_objectives, subject_tags,
  quest_type, points_per_step, bonus_complete, visibility, sort_order
)
select * from (values
  (
    'park-nature-walk',
    'Park nature walk',
    'Observe real plants and practice describing habitats. Good for a class outing or small groups.',
    8, 14,
    '["Name two living things you see outdoors","Describe one way plants help the park"]'::jsonb,
    array['biology', 'outdoors', 'observation']::text[],
    'hybrid', 18, 45, 'published', 1
  ),
  (
    'schoolyard-litter-audit',
    'Schoolyard litter audit',
    'Count types of waste safely, then confirm with a class QR checkpoint.',
    10, 18,
    '["Sort waste into categories","Discuss one change that would reduce litter"]'::jsonb,
    array['civics', 'environment', 'math']::text[],
    'hybrid', 15, 35, 'published', 2
  )
) v(slug, title, summary, age_min, age_max, learning_objectives, subject_tags, quest_type, points_per_step, bonus_complete, visibility, sort_order)
where not exists (select 1 from public.educational_quests eq where eq.slug = v.slug);

-- Steps: park-nature-walk
insert into public.educational_quest_steps (
  quest_id, step_index, title, instruction, evidence_type, ar_visual, ar_x, ar_y, ar_emoji
)
select q.id, 0, 'Find the habitat marker',
  'In AR mode, tap the glowing marker. Outside, stand near trees or shrubs — what do you notice about light and shade?',
  'none', 'tree', 22, 48, '🌳'
from public.educational_quests q
where q.slug = 'park-nature-walk'
  and not exists (
    select 1 from public.educational_quest_steps s where s.quest_id = q.id and s.step_index = 0
  );

insert into public.educational_quest_steps (
  quest_id, step_index, title, instruction, evidence_type, ar_visual, ar_x, ar_y, ar_emoji
)
select q.id, 1, 'Sketch or describe one plant',
  'Pick one plant or tree you can see. Write 2–3 sentences or draw in your notebook, then tap Complete.',
  'field_observation', 'leaf', 50, 50, '📓'
from public.educational_quests q
where q.slug = 'park-nature-walk'
  and not exists (
    select 1 from public.educational_quest_steps s where s.quest_id = q.id and s.step_index = 1
  );

insert into public.educational_quest_steps (
  quest_id, step_index, title, instruction, evidence_type, ar_visual, ar_x, ar_y, ar_emoji,
  quiz_prompt, quiz_option_a, quiz_option_b, quiz_correct
)
select q.id, 2, 'Quick check',
  'Answer the question below to lock in what you learned.',
  'quiz', 'book', 78, 55, '❓',
  'Which is most true for plants in a park?',
  'They only matter for decoration.',
  'They clean air, give shade, and support insects and birds.',
  'b'
from public.educational_quests q
where q.slug = 'park-nature-walk'
  and not exists (
    select 1 from public.educational_quest_steps s where s.quest_id = q.id and s.step_index = 2
  );

-- Steps: schoolyard-litter-audit
insert into public.educational_quest_steps (
  quest_id, step_index, title, instruction, evidence_type, ar_visual, ar_x, ar_y, ar_emoji
)
select q.id, 0, 'Count what you see (safely)',
  'With gloves if needed: tally plastic, paper, food waste, and “other” in one area. Do not pick up sharp objects — tell an adult.',
  'field_observation', 'recycle', 50, 40, '♻️'
from public.educational_quests q
where q.slug = 'schoolyard-litter-audit'
  and not exists (
    select 1 from public.educational_quest_steps s where s.quest_id = q.id and s.step_index = 0
  );

insert into public.educational_quest_steps (
  quest_id, step_index, title, instruction, evidence_type, ar_visual, ar_x, ar_y, ar_emoji, qr_expected
)
select q.id, 1, 'Scan the class checkpoint',
  'Switch to QR mode. Your teacher displays a code starting with HERO-EDU. Scan it to finish.',
  'qr_scan', 'chest', 60, 62, '📱',
  'HERO-EDU:schoolyard-litter-audit:1'
from public.educational_quests q
where q.slug = 'schoolyard-litter-audit'
  and not exists (
    select 1 from public.educational_quest_steps s where s.quest_id = q.id and s.step_index = 1
  );
