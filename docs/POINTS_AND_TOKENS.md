# Points → tokens

## Product intent

- **HERO points** (off-chain, in your Postgres `hero_points` ledger) remain the primary reward.
- Users **redeem** a chosen amount of points for **HERO** ERC-20 on **0G** via the API.

## What ships in this repo

1. **`contracts/src/HeroToken.sol`** — ERC-20 `HERO` (18 decimals), **max supply 77,777,777** (hard-capped on-chain), `mint` restricted to `MINTER_ROLE`. See **`docs/HERO_TOKEN_TECHNICAL_PAPER.md`** (also **[HERO Token paper](/hero-token)** in the app footer).
2. **`server/sql/002_point_redemptions.sql`** — ledger of spends + tx hashes.
3. **API**
   - `GET /me/points` — spendable balance, rate, min redeem, whether redeem is configured.
   - `POST /me/redeem` — body `{ "pointsAmount": number, "recipientAddress"?: "0x..." }` (optional recipient = primary wallet from `/auth/sync`).
4. **UI** — `/app/redeem` (linked from Profile).

## Conversion

- **`POINTS_PER_HERO_TOKEN`** (default **100**) — points required for **1 full HERO** (1e18 wei).
- Formula: `tokenWei = pointsAmount * 10^18 / POINTS_PER_HERO_TOKEN`.
- **`MIN_REDEEM_POINTS`** (default **100**) — minimum per request.

## Operator setup

1. Deploy `HeroToken` (see `contracts/script/Deploy.s.sol` or deploy only `HeroToken`).
2. Fund the **minter** wallet with **0G native gas** on the target chain (testnet faucet).
3. Set env (see `server/.env.example`):
   - `HERO_TOKEN_ADDRESS`
   - `HERO_TOKEN_MINTER_PRIVATE_KEY` — must have `MINTER_ROLE` on the token (deployer has it by default).
4. Run migration `server/sql/002_point_redemptions.sql` on your DB.

## Balance scope (important)

`GET /me/points` uses **only** the **server** Postgres `hero_points` table (e.g. signup bonus from `/me/onboarding/complete`).  
Quest/drop points that still live **only** in **Supabase** are **not** included until you sync or migrate them into this ledger.

## Legal / risk

This is a **custodial-style mint** (backend key mints to users). Review **securities / MSB / regional** rules before mainnet. Not a substitute for an external audit.
