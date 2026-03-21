# Local Hero (0G)

Web app and backend for **Local Hero** — community quests, profiles, and on-chain rewards on **[0G](https://0g.ai/)** (Galileo testnet / mainnet).

## Stack

| Layer | Tech |
|-------|------|
| **Frontend** | Vite, React, TypeScript, Tailwind CSS, shadcn-ui, Framer Motion, PWA (installable) |
| **Auth** | [Privy](https://privy.io/) — email / Google / Apple / SMS + embedded EVM wallet |
| **API** | Node (Express) in `server/` + Postgres |
| **Client data** | [Supabase](https://supabase.com/) — quests, activity feed, challenges, drops (where configured) |
| **Storage** | [0G decentralized storage](https://docs.0g.ai/) — optional avatar uploads via API |
| **Contracts** | Foundry + OpenZeppelin — `HeroToken`, `LocalHeroBadges`, `LocalHeroSoulboundIdentity` |

---

## Features

### Public website (no login)

| Feature | Route / entry | Notes |
|---------|----------------|--------|
| **Landing** | `/` | Marketing, ecosystem story, footer nav |
| **HeroPaper** | `/heropaper` | Long-form narrative / vision |
| **HERO Token paper** | `/hero-token` | Tokenomics, max supply, multisig & liquidity playbook (from `docs/HERO_TOKEN_TECHNICAL_PAPER.md`) |
| **Report a spot** | `/report-spot` | Civic heads-up (litter, parks, upkeep) — no account; `POST /public/community-signal` |
| **Install** | `/install` | PWA / app install hints |
| **Investors** | `/investors` | Investor-facing content |
| **Pitch deck** | `/pitch` | Deck view |
| **Business** | `/business` | B2B / partners |
| **Funding** | `/fund` | Support the project |
| **Roadmap & FAQ** | `/roadmap` | Product direction |
| **TreeGens world record** | `/treegens` | Campaign / story page |
| **Privacy** | `/privacy` | Privacy policy |
| **Terms** | `/terms` | Terms of service |

### Auth & onboarding

| Feature | Route | Notes |
|---------|--------|--------|
| **Sign in / sign up** | `/auth` | Privy |
| **Reset password** | `/reset-password` | Privy flow |
| **Wallet onboarding** | `/wallet-onboarding` | Embedded wallet setup |
| **Profile onboarding** | `/onboarding` | Display name, bio, location, avatar (protected) |

### In-app experience (logged in, `/app/*`)

| Feature | Route | Notes |
|---------|--------|--------|
| **Home** | `/app` | Dashboard / entry |
| **Explore** | `/app/explore` | Map / discovery |
| **Quests** | `/app/quests` | Story & daily-style quests; ties into Supabase points / impact where wired |
| **AR Quest** | `/app/ar` | AR quest flow |
| **Schools** | `/app/schools` | School leaderboard + **class AR trails** (published `educational_quests` in Supabase) → `/app/ar?quest=…` |
| **Leaderboard** | `/app/leaderboard` | Rankings |
| **Profile** | `/app/profile` | User profile + links (e.g. redeem, mint, contracts) |
| **Redeem HERO** | `/app/redeem` | Exchange **server** HERO points for on-chain **HERO** ERC-20 (when API + token configured) |
| **Create QR** | `/app/create-qr` | QR generation for quests / sharing |
| **Mint NFT** | `/app/mint` | Badge / NFT minting UX (contracts + vouchers) |
| **Contracts** | `/app/contracts` | Web3 contract helpers / links |
| **Community** | `/app/community` | Community / guide chat (Supabase edge where configured) |
| **NFT drop** | `/app/drop` | Drop participation |
| **Discovery drops** | `/app/discovery` | Location / discovery drops |
| **Treasure storm** | `/app/storm` | Treasure-storm experience |
| **Campaign** | `/app/campaign` | Campaign UI |
| **777 Agents** | `/app/agents` | Agent program preview + link to **Report a spot** / `community_signals` |

### Admin & operations (protected)

| Feature | Route | Notes |
|---------|--------|--------|
| **Admin challenges** | `/app/admin/challenges` | Community challenges |
| **Admin drops** | `/app/admin/drops` | Drop administration |
| **Admin roles** | `/app/admin/roles` | Role management |
| **Overmind** | `/app/overmind` | Operations / agent control surface |

### Backend API (`server/`)

| Method | Path | Auth | Purpose |
|--------|------|------|---------|
| `GET` | `/health` | — | Liveness |
| `POST` | `/public/community-signal` | — | Anonymous place / cleanup heads-ups (rate-limited) |
| `POST` | `/auth/sync` | Privy JWT | Sync user + wallet into Postgres |
| `GET` | `/me/points` | Privy | Spendable points, redeem config, optional on-chain supply snapshot |
| `POST` | `/me/redeem` | Privy | Points → HERO mint (when configured) |
| `GET` | `/me/access-status` | Privy | Onboarding / wallet flags |
| `POST` | `/me/onboarding/complete` | Privy | Complete profile; optional avatar URL |
| `POST` | `/me/storage/upload` | Privy | Multipart upload to 0G storage |
| `GET` | `/storage/files/:rootHash` | — | Public proxy for stored files (avatars) |

### Smart contracts (`contracts/`)

| Contract | Standard | Purpose |
|----------|----------|---------|
| **HeroToken** | ERC-20 | **HERO**; **max supply 77,777,777**; `MINTER_ROLE` mint for redemptions |
| **LocalHeroBadges** | ERC-1155 | Badge collection; EIP-712 vouchers; agent / registrar roles |
| **LocalHeroSoulboundIdentity** | ERC-721 | Soulbound Hero ID; vouchers + agent mint |

Deploy: `contracts/script/Deploy.s.sol`. Details: **`contracts/README.md`**. EIP-712 helpers: **`src/lib/badgesEip712.ts`**.

### Database migrations (Postgres)

Run in order on the API database:

1. **`server/sql/001_init.sql`** — users, profiles, wallets, `hero_points`  
2. **`server/sql/002_point_redemptions.sql`** — `point_redemptions` (redeem ledger)  
3. **`server/sql/003_community_signals.sql`** — `community_signals` (report-a-spot queue)  

---

## Prerequisites

- Node.js 18+ and npm  
- Postgres for the API  
- Optional: [Foundry](https://book.getfoundry.sh/) for Solidity  
- Optional: Supabase project (for client-side quests, feed, edge functions)  
- Privy app + 0G RPC for wallet / chain features  

## Quick start — frontend

```sh
git clone <repo-url>
cd local-hero-0g
cp .env.example .env   # VITE_PRIVY_APP_ID, VITE_API_BASE_URL, etc.
npm install
npm run dev
```

## Quick start — API

```sh
cd server
cp .env.example .env   # DATABASE_URL, Privy JWKS, optional 0G + HERO_TOKEN_*
npm install
npm run dev
```

Apply all SQL files in **`server/sql/`** (see order above).

### Frontend environment (high level)

| Variable | Purpose |
|----------|---------|
| `VITE_PRIVY_APP_ID` | Privy application ID |
| `VITE_API_BASE_URL` | API origin (required for auth sync, redeem, report-a-spot) |
| `VITE_0G_NETWORK` | Optional: `testnet` or `mainnet` |
| `VITE_0G_RPC_TESTNET` / `VITE_0G_RPC_MAINNET` | Optional RPC overrides |

### Optional: points → HERO redeem

Deploy **`HeroToken`**, set **`HERO_TOKEN_ADDRESS`**, **`HERO_TOKEN_MINTER_PRIVATE_KEY`**, fund minter with gas. See **`server/.env.example`** and **`docs/POINTS_AND_TOKENS.md`**.

### Optional: 0G avatars

Set **`OG_0G_STORAGE_PRIVATE_KEY`**, **`PUBLIC_API_BASE_URL`**, and related vars. **`POST /me/storage/upload`** + **`GET /storage/files/:rootHash`**.

### Optional: report-a-spot

After **`003_community_signals.sql`**, public form at **`/report-spot`** works against your API. See **`docs/COMMUNITY_SIGNALS.md`**.

---

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Vite dev server |
| `npm run build` | Production build (PWA precache) |
| `npm run lint` | ESLint |
| `npm test` | Vitest (agents, API route audit, contract surface, App routes) |
| `npm run test:contracts` | Foundry tests |
| `npm run test:all` | Vitest + Foundry |

```sh
cd contracts && forge build && forge test
```

---

## Documentation index

| Doc | Topic |
|-----|--------|
| [`docs/AGENTS_AND_OPERATIONS.md`](docs/AGENTS_AND_OPERATIONS.md) | Overmind agents, 777 program, Supabase roles |
| [`docs/AUDIT_CHECKLIST.md`](docs/AUDIT_CHECKLIST.md) | Release / security checklist |
| [`docs/POINTS_AND_TOKENS.md`](docs/POINTS_AND_TOKENS.md) | HERO points + token redeem |
| [`docs/HERO_TOKEN_TECHNICAL_PAPER.md`](docs/HERO_TOKEN_TECHNICAL_PAPER.md) | Token cap, multisig, liquidity (also **`/hero-token`**) |
| [`docs/COMMUNITY_SIGNALS.md`](docs/COMMUNITY_SIGNALS.md) | Public heads-up reports & `community_signals` table |
| [`docs/EDUCATIONAL_AR_QUESTS.md`](docs/EDUCATIONAL_AR_QUESTS.md) | Plan: class-sized educational AR + real-world / plant quests for creators |
| [`contracts/README.md`](contracts/README.md) | Solidity contracts & deploy |

---

## License / compliance

Token and reward features may be regulated in your jurisdiction — obtain appropriate legal review before mainnet and public marketing.
