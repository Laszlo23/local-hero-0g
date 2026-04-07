# Grant application pack (off-repo checklist)

Use this checklist when submitting to **0G ecosystem / Guild / growth** programs. Nothing here replaces the official form—copy answers from your notes into their portal.

**Official entry points (confirm current URLs on 0G sites):**

- [0G ecosystem program (blog overview)](https://0g.ai/blog/0g-ecosystem-program)
- [Guild — ecosystem investment](http://guild.0gfoundation.ai/)

---

## 1. Repository and build quality

- [ ] Public repo link (e.g. GitHub) is up to date on **`main`**
- [ ] [CI workflow](../.github/workflows/ci.yml) is **green** on latest commit (lint, tests, build, server typecheck, forge)
- [ ] [`docs/0G_ECOSYSTEM_GRANT.md`](0G_ECOSYSTEM_GRANT.md) read and aligned with what you actually run in staging/production

## 2. On-chain evidence

- [ ] Contracts deployed on **0G Galileo** (and/or mainnet) as claimed
- [ ] [`docs/DEPLOYMENTS.md`](DEPLOYMENTS.md) filled with **real addresses** and explorer links (not `0x…` placeholders)
- [ ] Source **verified** on explorer where the program expects it

## 3. Live demo

- [ ] **Staging or production URL** for the web/PWA app (HTTPS)
- [ ] **API base URL** if reviewers should test auth, report-a-spot, or uploads
- [ ] Short **Loom or video** (optional but strong): sign-in, one quest path, wallet on 0G if applicable, storage or redeem if you claim them

## 4. Team and legal

- [ ] Team names, roles, contact (per application form)
- [ ] Entity / jurisdiction if required
- [ ] Token and marketing: README + [HERO_TOKEN_TECHNICAL_PAPER.md](HERO_TOKEN_TECHNICAL_PAPER.md) reviewed with counsel if you mention trading or public sale

## 5. Milestones and budget

- [ ] **Milestones** match [`0G_ECOSYSTEM_GRANT.md`](0G_ECOSYSTEM_GRANT.md) (adapt dates and metrics)
- [ ] **Budget / ask** and use of funds (per form)
- [ ] Optional: **0G Compute** milestone if you pitch AI-on-0G-infra—then configure `OG_AI_*` and document host in [`DEPLOYMENTS.md`](DEPLOYMENTS.md)

## 6. After submit

- [ ] Save confirmation / submission ID
- [ ] Monitor email for qualification call
- [ ] Update **Build in Public** (`src/content/build-in-public.md`) when you ship grant-related milestones

---

**Reminder:** No checklist guarantees approval—only complete, honest evidence and fit to the program.
