# Educational AR + real-world quests — integration plan

How **creators** (teachers, partners, agents) can author **educational quests** that combine **AR**, **real plants / places / objects**, and **class-sized** participation — integrated cleanly with Local Hero’s current stack.

## Shipped in this repo (v1)

- **Supabase migration:** `supabase/migrations/20260321120000_educational_quests.sql` — tables `educational_quests`, `educational_quest_steps`, `educational_quest_progress` + RLS + two seed quests.
- **Client:** `src/lib/educationalQuests.ts` — list / fetch / progress upsert.
- **AR:** `/app/ar?quest=<slug>` loads `EducationalArQuestView` (step flow: AR tap, field observation, quiz, QR checkpoint).
- **Schools:** `/app/schools` lists published class trails and deep-links into AR.
- **Playground:** `/app/ar` with no `quest` param keeps the original demo AR + QR experience.

Apply the migration with Supabase CLI (`supabase db push` / `migration up`) or paste SQL in the SQL editor.

## 1. Goals & constraints

| Goal | Implication |
|------|-------------|
| Whole class participates | Support **class / cohort** identity, not only individual devices |
| Educational (curriculum-aligned) | Structured **learning objectives**, age band, optional standards tags |
| Real world (plants, sites, objects) | Quests bind to **locations** and/or **observation tasks**, not only screen fiction |
| AR | Use AR where it **adds learning value** (orientation, labeling, scavenger hunt), not as gimmick |
| Creators build content | **Authoring pipeline** + permissions (teacher, school admin, verified partner) |

**Constraints today (repo reality):**

- `/app/ar` uses **camera + 2D overlays + QR** — not native ARKit/ARCore mesh or plant-ID ML yet.
- **Schools** page uses **Supabase** (`schools`, `daily_quests`) + `useDailyQuests`.
- **Server Postgres** is the source of truth for **auth-linked** users, points ledger, redemptions.

The plan below **bridges** these without forcing a big-bang rewrite.

---

## 2. Recommended architecture (three layers)

### Layer A — **Quest definition** (content / CMS)

Store **structured quest templates** that can be instantiated per class or per run.

**Suggested fields (conceptual):**

- `slug`, `title`, `summary`, `age_min` / `age_max`
- `learning_objectives[]` (short strings)
- `subject_tags[]` (biology, geography, civics, …)
- `quest_type`: `ar_overlay` | `field_observation` | `qr_trail` | `photo_evidence` | `hybrid`
- `steps[]`: ordered steps, each with:
  - `instruction_md` (what students do)
  - `evidence_type`: `none` | `photo` | `qr_scan` | `gps_checkpoint` | `quiz`
  - optional `ar_asset_id` (2D anchor image / marker URL) or `geofence` (lat/lng/radius)
  - `rubric_hint` (for teacher review)
- `creator_id` / `org_id` (school or partner)
- `visibility`: `draft` | `published` | `archived`
- `copilot_safe` (flag for kid-friendly copy review)

**Where to store:**

- **Short term:** New Supabase tables (`educational_quests`, `educational_quest_steps`, optional `class_runs`) — fits existing Schools + daily quest patterns and RLS for schools.
- **Medium term:** Mirror **summaries** or **completion events** to **server Postgres** if you need one ledger for badges / HERO points tied to `users.id` (today’s redeem path).

Avoid duplicating full quest JSON in two DBs; use **one primary store** (Supabase) + **events** to API if needed.

### Layer B — **Runtime** (what the app does on the phone)

Evolve `/app/ar` from **hardcoded `arObjects`** to **quest-driven**:

1. **Resolve quest** — deep link, QR (`HERO-EDU:` or HTTPS with `quest_id`), or picker from Schools.
2. **Render steps** — for each step:
   - **AR overlay mode:** show camera + positioned sprites / labels from CDN (current pattern, data-driven).
   - **Field mode:** checklist + “open camera for evidence” → optional upload to **0G** or **Supabase Storage** (policy decision).
   - **QR trail:** reuse existing QR pipeline; each checkpoint unlocks next step.
3. **Complete step** — write progress to `student_quest_progress` (device + optional `user_id` + `class_run_id`).

**Plant / nature identification (progressive sophistication):**

| Phase | Technique | Effort |
|-------|-----------|--------|
| **P0** | Teacher-authored **“find this species / this sign”** + photo + honor system / peer review | Low |
| **P1** | **Pl@ntNet** or similar API (external ID from photo) behind your backend | Medium |
| **P2** | On-device ML kit in a **Capacitor/React Native** shell | High |

Start with **P0 + structured prompts** (“Count rings on stump”, “Sketch leaf shape”) — strong pedagogy, no ML dependency.

### Layer C — **Classroom orchestration**

Teachers need **one session**, not 30 unrelated accounts.

- **`class_runs`**: `id`, `quest_id`, `teacher_user_id`, `school_id`, `starts_at`, `ends_at`, `join_code` (short code).
- Students **join** with code (guest device id + nickname) or logged-in users link to run.
- **Teacher dashboard** (phase 2): completion %, photo queue for approval, export CSV.

**COPPA / privacy:** For under-13, prefer **school contract**, minimal PII, no public leaderboards of minors without consent.

---

## 3. Integration with what you already have

| Existing piece | How it plugs in |
|----------------|-----------------|
| **`ARQuest.tsx`** | Becomes **loader + step engine**; content from API/Supabase instead of `arObjects` constant |
| **`Schools.tsx`** | Section **“Class quests”** listing published `educational_quests` for linked `school_id` + CTA **Start** / **Join with code** |
| **`CreateQR`** | Extend formats for **EDU quest launch** + per-step checkpoint QRs |
| **`generate-daily-quests`** | Optional second function **`generate-edu-quest-draft`** for AI-assisted drafts; **human publish** required |
| **Server API** | New routes only if you need **cross-org reporting** or **HERO mint tied to verified completion**; else Supabase RLS may suffice for v1 |
| **Badges / NFTs** | After teacher approval, call existing mint voucher flow with **metadata** `quest_run_id` |

---

## 4. Creator UX (best practice)

1. **Wizard:** Learning goals → age → quest type → steps → preview on device → publish.
2. **Asset pipeline:** Upload **marker images** (for overlay alignment) or use **GPS-only** trails; validate file size and safe CDN URLs.
3. **Review:** Optional **school admin** must approve before students see it (toggle per org).
4. **Versioning:** Published quests immutable; edits create new version so runs stay reproducible.

---

## 5. Phased roadmap (recommended)

### Phase 1 — **Data + Schools surfacing** (1–2 sprints)

- Supabase schema: `educational_quests`, `educational_quest_steps`, optional `class_runs`.
- Seed 2–3 **static** published quests (biology walk, litter audit, tree inventory).
- Schools page: list + open deep link to AR route with `?quest=slug`.

### Phase 2 — **Dynamic AR + progress** (2–3 sprints)

- Refactor `ARQuest` to consume quest JSON; keep current overlay UX.
- Persist step completion in Supabase; show progress bar.
- **Join code** for class runs; teacher sees simple completion list (admin page or Supabase Studio at first).

### Phase 3 — **Creator tools**

- `/app` route (protected) **Create class quest** for verified creators only.
- QR generation per step; printable PDF for field trip.

### Phase 4 — **Evidence & trust**

- Photo upload + teacher **approve** before points/badge.
- Optional: integrate **Pl@ntNet** or curriculum APIs.

### Phase 5 — **Native AR (optional)**

- If you need true world tracking: **Capacitor + AR plugin** or small native module; keep quest JSON format stable so web and native share content.

---

## 6. Success metrics

- Time to author a **field trip** quest &lt; 15 minutes (template-assisted).
- % of students completing **N checkpoints** per outing.
- Teacher NPS + repeat usage per term.
- (Later) Correlation with **server `hero_points`** / badges for verified completions.

---

## 7. Open decisions (document when you choose)

1. **Primary DB** for edu quests: Supabase-only v1 vs hybrid with Postgres events.
2. **Photo storage:** Supabase Storage vs existing **0G** upload API (cost, latency, COPPA).
3. **Moderation:** All public quests reviewed vs school-private only.
4. **Offline:** Required for poor cell at park? (Service worker cache of quest JSON + queue uploads.)

---

## 8. README pointer

When Phase 1 ships, add one line under **In-app** / **Schools** in the root `README.md` linking here: **`docs/EDUCATIONAL_AR_QUESTS.md`**.
