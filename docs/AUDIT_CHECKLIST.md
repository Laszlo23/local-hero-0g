# Security & flow audit checklist

Use this before major releases or mainnet deploys. Automated checks: `npm test` (Vitest) + `cd contracts && forge test`.

## Authentication & identity

- [ ] Privy `VITE_PRIVY_APP_ID` and API `PRIVY_JWKS_URL` / issuer match your Privy app
- [ ] `/auth/sync` and `/me/access-status` behave as expected for new and returning users
- [ ] If using Supabase **admin** roles: `user_roles.user_id` matches how you identify users in `user_profiles` (Privy migration path documented)

## Onboarding & storage

- [ ] Onboarding completes and persists profile + optional avatar
- [ ] If using 0G avatars: `OG_0G_STORAGE_PRIVATE_KEY` funded; `PUBLIC_API_BASE_URL` matches browser-accessible API URL
- [ ] `GET /storage/files/:rootHash` returns images for stored avatar URLs

## API surface (automated)

Vitest asserts `server/src/routes.ts` still contains routes listed in `src/lib/auditConstants.ts`.

## Smart contracts (automated)

- [ ] `forge test` passes
- [ ] `forge build` passes
- Vitest verifies `LocalHeroBadges.sol` / `LocalHeroSoulboundIdentity.sol` still expose functions listed in `auditConstants.ts`

- [ ] **Manual:** `SIGNER_ROLE` is a dedicated key; not shared with unrelated services
- [ ] **Manual:** `AGENT_ROLE` and `REGISTRAR_ROLE` assigned only to known ops wallets
- [ ] **Manual:** Contract addresses and chain IDs documented for frontend (`viem` / env)

## Agents & Overmind

- [ ] `src/lib/agents.ts` matches Overmind prompt (`agents.test.ts` checks names in `overmind-chat` when present)
- [ ] `LOVABLE_API_KEY` or equivalent LLM key for `overmind-chat` is set in Supabase secrets (rename if you move off Lovable)

## App routes (automated)

Vitest `appFlows.test.ts` checks critical paths still exist in `App.tsx`.

## Admin UI

- [ ] Only intended staff receive `admin` in `user_roles`
- [ ] `/app/admin/roles` can assign **moderator** / **admin** as designed

## Dependency & supply chain

- [ ] `npm audit` reviewed for critical issues
- [ ] OpenZeppelin contracts pinned via Foundry lockfile

## 0G ecosystem / grant review

Use before sharing the repo with ecosystem or grant reviewers. Details: **`docs/0G_ECOSYSTEM_GRANT.md`**.

- [ ] **`docs/DEPLOYMENTS.md`** updated with real contract addresses and explorer links for each claimed network
- [ ] **Testnet/mainnet:** `VITE_0G_NETWORK` and RPC envs match deployed contracts; explorers show verified source where applicable
- [ ] **0G Storage:** `OG_0G_*` funded; `POST /me/storage/upload` + `GET /storage/files/:rootHash` smoke-tested from staging
- [ ] **README:** “Building on 0G” subsection present and points to grant brief + deployments register
- [ ] **Quest-draft AI:** `OG_AI_API_URL` / `OG_AI_API_KEY` documented for ops (host only in grant pack); behavior matches **OpenAI-compatible** API—note in brief if using **0G Compute** inference vs other gateway
- [ ] **Optional milestone:** If claiming 0G Compute, record inference base URL (redacted) and date in **`docs/DEPLOYMENTS.md`** environment table
- [ ] **Public copy:** Investor/marketing diagrams match implementation (0G Chain + 0G Storage, not generic IPFS unless true)

---

**Not full security audit:** This checklist is operational. For token launches, get an external smart-contract audit.
