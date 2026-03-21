# Local Hero (0G)

Web app and backend for **Local Hero** — community quests, profiles, and on-chain badges on **[0G](https://0g.ai/)** (Galileo testnet / mainnet).

## Stack

- **Frontend**: Vite, React, TypeScript, Tailwind CSS, shadcn-ui  
- **Auth**: [Privy](https://privy.io/) (embedded wallet)  
- **API**: Node (Express) in `server/` + Postgres  
- **Storage**: [0G decentralized storage](https://docs.0g.ai/) for avatars (optional)  
- **Contracts**: Foundry + OpenZeppelin in `contracts/` (ERC-1155 badges, soulbound Hero ID)

## Prerequisites

- Node.js 18+ and npm  
- Postgres (local or Docker) for the API  
- Optional: [Foundry](https://book.getfoundry.sh/) for Solidity build/test  

## Quick start — frontend

```sh
git clone <repo-url>
cd local-hero-0g
cp .env.example .env   # set VITE_PRIVY_APP_ID, VITE_API_BASE_URL
npm install
npm run dev
```

## Quick start — API

```sh
cd server
cp .env.example .env   # DATABASE_URL, Privy JWKS, optional 0G storage keys
npm install
npm run dev
```

Apply the schema: `server/sql/001_init.sql` on your Postgres database.

### Frontend environment

| Variable | Purpose |
|----------|---------|
| `VITE_PRIVY_APP_ID` | Privy application ID |
| `VITE_API_BASE_URL` | Base URL of the API (e.g. `http://localhost:8787`) |
| `VITE_0G_NETWORK` | Optional: `testnet` or `mainnet` for default 0G chain |
| `VITE_0G_RPC_TESTNET` / `VITE_0G_RPC_MAINNET` | Optional RPC overrides |

### 0G storage (avatars)

The API can upload files to 0G storage and serve them at `GET /storage/files/:rootHash` (public, suitable for `avatar_url`).

1. Set `OG_0G_STORAGE_PRIVATE_KEY` and related vars in `server/.env` (see `server/.env.example`).  
2. Set `PUBLIC_API_BASE_URL` to the API origin the browser uses for image URLs.  
3. Onboarding uses `POST /me/storage/upload` before profile completion.  

If storage is not configured, onboarding can still complete without an avatar.

## Smart contracts

See **`contracts/README.md`** for:

- `LocalHeroBadges` (ERC-1155) — signature-based mints, agent mints, registrars  
- `LocalHeroSoulboundIdentity` (ERC-721 soulbound)  

EIP-712 helpers for signing: **`src/lib/badgesEip712.ts`**.

```sh
cd contracts
forge build
forge test
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Vite dev server |
| `npm run build` | Production build |
| `npm run lint` | ESLint |
| `npm test` | Vitest (agents, API route audit, contract surface, App routes) |
| `npm run test:contracts` | Foundry tests in `contracts/` |
| `npm run test:all` | Vitest + Foundry |

## Agents, roles & audits

- **Operations guide:** [`docs/AGENTS_AND_OPERATIONS.md`](docs/AGENTS_AND_OPERATIONS.md) — six Overmind agents, 777 program, Supabase admin/moderator, on-chain `AGENT_ROLE`.
- **Release checklist:** [`docs/AUDIT_CHECKLIST.md`](docs/AUDIT_CHECKLIST.md) — auth, storage, contracts, admin.

