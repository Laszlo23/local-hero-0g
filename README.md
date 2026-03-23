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
| **Build in Public** | `/build-in-public` | Daily ship log; content from `src/content/build-in-public.md` (see `docs/BUILD_IN_PUBLIC.md`) |
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
| `POST` | `/me/educational-quest-draft` | Privy | Generate a structured class-quest draft via configured 0G AI gateway |
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

## Mobile (Capacitor) quick start

Capacitor is initialized in this repo with:

- `appId`: `space.localhero.app`
- `appName`: `Local Hero`
- native projects: `ios/` and `android/`

Useful commands:

```sh
# build web assets + sync to native
npm run mobile:sync

# open native projects in Xcode / Android Studio
npm run mobile:ios
npm run mobile:android
```

Optional live-reload from Vite dev server:

```sh
CAPACITOR_DEV_SERVER_URL=http://<your-lan-ip>:8080 npm run mobile:ios
```

(`capacitor.config.ts` reads `CAPACITOR_DEV_SERVER_URL` and enables cleartext dev server mode.)

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
| `npm run mobile:sync` | Build + `cap sync` (updates iOS/Android web assets + plugins) |
| `npm run mobile:copy` | Build + `cap copy` (assets only) |
| `npm run mobile:sync:dev` | Sync with `space.localhero.app.dev` + app name `Local Hero Dev` |
| `npm run mobile:sync:staging` | Sync with `space.localhero.app.staging` + app name `Local Hero Staging` |
| `npm run mobile:sync:prod` | Sync with production app id/name |
| `npm run mobile:ios` | Build/sync and open Xcode project |
| `npm run mobile:android` | Build/sync and open Android Studio project |
| `npm run mobile:run:ios` | Build/sync and run on iOS target |
| `npm run mobile:run:android` | Build/sync and run on Android target |
| `npm run mobile:android:assemble:dev` | Build Android dev flavor debug APK |
| `npm run mobile:android:assemble:staging` | Build Android staging flavor release APK |
| `npm run mobile:android:assemble:prod` | Build Android prod flavor release APK |
| `npm run mobile:android:bundle:staging` | Build Android staging release AAB |
| `npm run mobile:android:bundle:prod` | Build Android prod release AAB |
| `npm run mobile:ios:build:sim` | Build unsigned iOS simulator app (CI/local verification) |
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
| [`docs/MOBILE_APP_STORE_LAUNCH_PLAN.md`](docs/MOBILE_APP_STORE_LAUNCH_PLAN.md) | Week-by-week plan to ship iOS + Android store apps via Capacitor |
| [`docs/MOBILE_CAPACITOR_WEEK2_SETUP.md`](docs/MOBILE_CAPACITOR_WEEK2_SETUP.md) | Current Capacitor bootstrap status, commands, and pre-production checklist |
| [`docs/MOBILE_WEEK3_DEEPLINK_AUTH_QA.md`](docs/MOBILE_WEEK3_DEEPLINK_AUTH_QA.md) | Deep-link/auth implementation notes and QA checklist for mobile week 3 |
| [`docs/MOBILE_WEEK3_QA_MATRIX.md`](docs/MOBILE_WEEK3_QA_MATRIX.md) | Device/network test matrix for week 3 mobile verification |
| [`docs/MOBILE_CI_PIPELINE.md`](docs/MOBILE_CI_PIPELINE.md) | GitHub Actions mobile CI scaffold (web sanity + Android flavors + signed Android + Play internal + iOS TestFlight lane) |
| [`docs/BUILD_IN_PUBLIC.md`](docs/BUILD_IN_PUBLIC.md) | How to edit the Build in Public changelog (`src/content/build-in-public.md`) |
| [`contracts/README.md`](contracts/README.md) | Solidity contracts & deploy |

---

## License / compliance

Token and reward features may be regulated in your jurisdiction — obtain appropriate legal review before mainnet and public marketing.
