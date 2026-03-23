---
updated: 2026-03-23
hero_title: Shipping in the open — today, next, and the trail behind us.
---

We ship fast, document transparently, and keep the community in the loop. This is the product pulse of Local Hero — one file, no deploy drama.

## Today shipped

- **Launch Readiness** manual workflow: preflight (lint, tests, web build + artifact), signed Android AAB matrix (staging + prod), iOS simulator sanity, optional Play + TestFlight uploads.
- **CI unblock:** pinned `react-leaflet` to v4 so `npm ci` matches React 18 — Preflight is green on GitHub Actions again.
- **Docs:** launch runbook + troubleshooting in `docs/LAUNCH_READINESS_WORKFLOW.md`; environments `mobile-release` and `production-release` ready for secrets when you are.
- **Build in Public** stays markdown-driven — edit this file anytime; route is `/build-in-public`.

## Next up

- Add signing + Play + ASC secrets to GitHub environments, then re-run Launch Readiness end-to-end.
- Store submission polish and release notes automation.
- iOS environment protection and staged reviewer gates on `production-release`.
- Post-release smoke checks and rollback runbook.
- Weekly public changelog snapshots for builders and supporters.

## Timeline

### Mobile CI foundations
icon: wrench
Web sanity checks, Android flavor matrix builds, and iOS simulator verification to catch cross-platform breakages early.

### Release track activation
icon: rocket
Signed Android AAB generation, Play upload hooks with gated status (draft / rollout / completed), and iOS TestFlight path behind the same workflow.

### Public accountability loop
icon: sparkles
Build in Public page driven by `src/content/build-in-public.md` — what shipped, what’s next, and a short timeline for anyone following along.
