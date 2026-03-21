# Community signals (“Report a spot”)

## Purpose

Anyone — **including people who do not play Local Hero** — can submit a **heads-up** about a place that needs attention (e.g. litter in a park, overgrowth, damage). Submissions are stored server-side so **community leaders and agents** can review them and organize cleanups or quests.

## User-facing

- **Web:** `/report-spot` (public, no login).
- **API:** `POST /public/community-signal` (JSON body, rate-limited per IP).

## Database

Run migration:

- `server/sql/003_community_signals.sql`

Table: **`community_signals`**

| Column | Notes |
|--------|--------|
| `category` | `litter_waste`, `vandalism_damage`, `overgrown`, `safety_concern`, `other` |
| `place_label` | Short human label (park name + hint) |
| `description` | Free text |
| `location_hint` | Optional (city, cross streets, link) |
| `contact_email` | Optional |
| `status` | `open` (default), `reviewing`, `scheduled`, `resolved`, `archived` |

## Operator / agent workflow

1. Query open signals, e.g. `select * from community_signals where status = 'open' order by created_at desc;`
2. Update `status` as you triage (`reviewing` → `scheduled` → `resolved`).
3. Optionally build an internal admin page or connect Overmind / tooling to the same table.

## Rate limiting

The API allows a limited number of submissions per client IP per hour (see `server/src/routes.ts`). Adjust constants if needed.

## Privacy

Submissions may contain location and optional email. Treat as **personal/community data**; align with your Privacy Policy and retention policy.
