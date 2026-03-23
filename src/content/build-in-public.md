---
updated: 2026-03-14
hero_title: What happened today and what got done.
---

We ship fast, document transparently, and keep the community in the loop. This is the daily product pulse of Local Hero.

## Today shipped

- Shipped signed Android release lanes with keystore-based CI configuration.
- Added Google Play internal upload automation with rollout controls and safety validation.
- Implemented semver/tag-aware version handling for mobile release artifacts.
- Added iOS TestFlight scaffold with signing secret checks and archive/export flow.
- Documented the release runbook and environment protection strategy for safer deployments.
- Added this Build in Public page with a markdown changelog you can edit in one file.

## Next up

- Store submission polish and release notes automation.
- iOS environment protection and staged reviewer gates.
- Post-release smoke checks and rollback runbook.
- Weekly public changelog snapshots for builders and supporters.

## Timeline

### Mobile CI foundations
icon: wrench
Introduced web sanity checks, Android flavor matrix builds, and iOS simulator verification to catch cross-platform breakages early.

### Release track activation
icon: rocket
Enabled signed Android AAB generation and Play internal uploads with gated status transitions (draft, rollout, completed).

### Public accountability loop
icon: sparkles
Shipped a Build in Public surface so the community can follow what shipped and what is next — update `src/content/build-in-public.md` anytime.
