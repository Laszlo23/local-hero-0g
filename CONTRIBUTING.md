# Contributing to Local Hero

Thanks for helping improve Local Hero. This repo combines a Vite/React client, a Node API, Solidity contracts, and Capacitor mobile shells.

## Before you open a PR

1. **Scope:** Keep changes focused on one concern (feature, fix, or doc). Avoid drive-by refactors.
2. **Tests:** From repo root:
   - `npm test`
   - `npm run lint`
   - `npm run build` (for UI changes)
   - `cd contracts && forge test` (for contract changes)
3. **Secrets:** Never commit `.env`, keys, keystores, or production URLs with credentials.

## Local setup (short)

- **Frontend:** `cp .env.example .env`, `npm install`, `npm run dev`
- **API:** `cd server`, copy `server/.env.example` → `.env`, apply `server/sql/*.sql` in order, `npm install`, `npm run dev`
- **Contracts:** See [`contracts/README.md`](contracts/README.md)

## Docs

- Product and 0G integration summary: [`docs/0G_ECOSYSTEM_GRANT.md`](docs/0G_ECOSYSTEM_GRANT.md)
- Changelog for “Build in Public”: [`docs/BUILD_IN_PUBLIC.md`](docs/BUILD_IN_PUBLIC.md)

## Questions

Use issues or your team’s usual channel. For grant or ecosystem questions, see the grant brief above.
