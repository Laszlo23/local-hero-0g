# Local Hero × 0G — ecosystem grant brief

This document is for **0G ecosystem / Guild / growth-fund reviewers**: what we build, how we use 0G today, and how we propose to deepen integration. It complements the public repo [README](../README.md), product narrative at **`/the-idea`**, long-form **`/heropaper`**, and [**HERO token paper**](HERO_TOKEN_TECHNICAL_PAPER.md).

**External programs:** Application flows and eligibility live on 0G channels (e.g. [0G ecosystem program](https://0g.ai/blog/0g-ecosystem-program), [Guild](http://guild.0gfoundation.ai/)). This file is **evidence and technical clarity** inside the repo—not a substitute for submitting forms, demo URLs, team bios, or funding asks.

**Submission checklist (off-repo):** Use [`docs/GRANT_APPLICATION_PACK.md`](GRANT_APPLICATION_PACK.md) so forms, demo links, and milestones stay consistent with this brief.

**Continuous integration:** Default branch runs [GitHub Actions CI](https://github.com/Laszlo23/local-hero-0g/actions/workflows/ci.yml) (frontend lint/test/build, server typecheck, Foundry). A green run supports reviewer confidence; it does not guarantee funding.

---

## One-paragraph pitch

**Local Hero** is a consumer-facing app (web + PWA + Capacitor mobile) that turns neighborhoods and schools into **real-world quests**: discovery drops, AR trails, civic “report a spot” signal, and **verifiable rewards**. We anchor identity and rewards on **0G Chain** (HERO ERC-20, badges, soulbound Hero ID), persist user media on **0G Storage** where configured, and use an **OpenAI-compatible** LLM API for **AI-assisted educational quest drafts** for teachers— with a clear path to route that inference through **0G Compute Network** as a funded milestone.

---

## Why 0G

0G positions itself as a **decentralized AI operating system**: modular **chain**, **storage**, **compute**, and **DA**. Local Hero maps cleanly to that stack:

| 0G pillar | How Local Hero uses it |
|-----------|-------------------------|
| **0G Chain** | EVM L1 for `HeroToken`, `LocalHeroBadges`, `LocalHeroSoulboundIdentity`; embedded wallets via Privy; explorers for transparency |
| **0G Storage** | Optional avatar and file flows via official TypeScript SDK (`@0gfoundation/0g-ts-sdk`) |
| **0G Compute** (milestone) | Educational quest draft generation today uses any OpenAI-compatible `/chat/completions` endpoint (`OG_AI_*` env). Aligning that endpoint with [0G Compute inference](https://docs.0g.ai/docs/developer-hub/building-on-0g/compute-network/inference) is a concrete grant milestone |

We fit **consumer apps** and **AI-assisted** education narratives in ecosystem programs that emphasize agents, dApps, and real users—not only DeFi.

---

## Integration map (code + env)

| Capability | User-visible / API | Code / config |
|------------|-------------------|---------------|
| **Wallet on 0G** | Sign in → embedded EVM wallet on selected network | [`src/lib/zeroGChains.ts`](../src/lib/zeroGChains.ts), Privy in [`src/App.tsx`](../src/App.tsx) |
| **HERO + badges + SBT** | `/app/redeem`, `/app/mint`, `/app/contracts` | [`contracts/`](../contracts/), [`contracts/README.md`](../contracts/README.md) |
| **Points → HERO** | Redeem flow when API + token configured | [`server/.env.example`](../server/.env.example) (`HERO_TOKEN_*`), [`docs/POINTS_AND_TOKENS.md`](POINTS_AND_TOKENS.md) |
| **0G Storage uploads** | Profile avatar via API proxy | [`server/src/storage0g.ts`](../server/src/storage0g.ts), `POST /me/storage/upload`, `GET /storage/files/:rootHash` |
| **Quest draft AI** | Authenticated `POST /me/educational-quest-draft` | [`server/src/aiQuestDraft.ts`](../server/src/aiQuestDraft.ts), `OG_AI_API_URL`, `OG_AI_API_KEY`, `OG_AI_MODEL` |
| **Civic / agents** | `/report-spot`, `/app/agents` | [`docs/COMMUNITY_SIGNALS.md`](COMMUNITY_SIGNALS.md), [`docs/AGENTS_AND_OPERATIONS.md`](AGENTS_AND_OPERATIONS.md) |

---

## Network facts (reference)

Values mirror the app defaults in [`src/lib/zeroGChains.ts`](../src/lib/zeroGChains.ts). Confirm against [0G testnet](https://docs.0g.ai/docs/developer-hub/testnet/testnet-overview) and [mainnet](https://docs.0g.ai/docs/developer-hub/mainnet/mainnet-overview) if RPCs change.

| Network | Chain ID | Default RPC (HTTP) | Block explorer |
|---------|----------|--------------------|----------------|
| **0G Galileo Testnet** | `16602` | `https://evmrpc-testnet.0g.ai` | `https://chainscan-galileo.0g.ai` |
| **0G Mainnet** | `16661` | `https://evmrpc.0g.ai` | `https://chainscan.0g.ai` |

Frontend selection: `VITE_0G_NETWORK` (`testnet` | `mainnet`) and optional `VITE_0G_RPC_TESTNET` / `VITE_0G_RPC_MAINNET`.

Storage defaults (server): see [`server/.env.example`](../server/.env.example) (`OG_0G_EVM_RPC`, `OG_0G_INDEXER_RPC`).

---

## AI stack (accurate today)

- **Implemented:** HTTP client to **OpenAI-compatible** `POST {OG_AI_API_URL}/chat/completions` with `Bearer` key. Model string via `OG_AI_MODEL`.
- **Not implied by that alone:** Traffic is not required to hit 0G’s network until you configure `OG_AI_API_URL` to a 0G Compute (or other) OpenAI-compatible base URL.
- **Grant milestone suggestion:** Document in [DEPLOYMENTS.md](DEPLOYMENTS.md) once a **0G Compute** inference base URL is used in production/staging; link to [Compute overview](https://docs.0g.ai/docs/developer-hub/building-on-0g/compute-network/overview).

### Connecting quest-draft AI to 0G Compute (optional, stronger AI-on-0G story)

The server calls **`{OG_AI_API_URL}/chat/completions`** with an OpenAI-style JSON body ([`server/src/aiQuestDraft.ts`](../server/src/aiQuestDraft.ts)). To route traffic through **0G Compute Network** inference:

1. Follow [0G Compute — inference](https://docs.0g.ai/docs/developer-hub/building-on-0g/compute-network/inference) and [compute overview](https://docs.0g.ai/docs/developer-hub/building-on-0g/compute-network/overview) to obtain an **OpenAI-compatible API base URL** and API key from your 0G Compute setup.
2. Set **`OG_AI_API_URL`** to that base (no trailing slash; many providers use a path ending in `/v1` so the final URL becomes `.../v1/chat/completions`).
3. Set **`OG_AI_API_KEY`** and **`OG_AI_MODEL`** per the provider’s requirements.
4. Smoke-test **`POST /me/educational-quest-draft`** from a logged-in client.
5. Record the **public hostname only** (no secrets) in [DEPLOYMENTS.md](DEPLOYMENTS.md) under “Quest-draft AI” / “0G Compute inference”.

---

## Suggested milestones (template for proposals)

Adapt numbers and dates to your application.

1. **M1 — Testnet truth**  
   Deploy / verify core contracts on Galileo; fill [DEPLOYMENTS.md](DEPLOYMENTS.md) with addresses + explorer links; public staging with `VITE_0G_NETWORK=testnet`.

2. **M2 — Storage in path**  
   Fund `OG_0G_STORAGE_PRIVATE_KEY`; smoke-test avatar upload + `GET /storage/files/:rootHash` from browser.

3. **M3 — Demo + metrics**  
   Share demo URL + short Loom; track quests completed, signups, storage objects, redeem txs (define honestly what is live).

4. **M4 — 0G Compute (optional)**  
   Point quest-draft AI at 0G Compute OpenAI-compatible inference; update env + docs.

5. **M5 — Mainnet pilot**  
   Controlled mainnet deploy + multisig ops per [HERO_TOKEN_TECHNICAL_PAPER.md](HERO_TOKEN_TECHNICAL_PAPER.md).

---

## Official 0G documentation (starting points)

- [Getting started](https://docs.0g.ai/docs/developer-hub/getting-started)  
- [Understanding 0G](https://docs.0g.ai/docs/introduction/understanding-0g)  
- [Deploy contracts on 0G Chain](https://docs.0g.ai/docs/developer-hub/building-on-0g/contracts-on-0g/deploy-contracts)  
- [Storage SDK](https://docs.0g.ai/docs/developer-hub/building-on-0g/storage/sdk)  
- [Compute network overview](https://docs.0g.ai/docs/developer-hub/building-on-0g/compute-network/overview)  
- [AI context for builders](https://docs.0g.ai/docs/ai-context)  
- [Inference (Compute)](https://docs.0g.ai/docs/developer-hub/building-on-0g/compute-network/inference)  

---

## Openness & compliance

- **Open build:** [Build in Public](BUILD_IN_PUBLIC.md) changelog (`src/content/build-in-public.md`).  
- **Token/legal:** README “License / compliance” and [HERO_TOKEN_TECHNICAL_PAPER.md](HERO_TOKEN_TECHNICAL_PAPER.md) — not legal advice; review before mainnet marketing.

---

## Verifiable on-chain checklist (for reviewers)

- [ ] [DEPLOYMENTS.md](DEPLOYMENTS.md) lists contract addresses + verified explorer URLs  
- [ ] Testnet (or mainnet) RPC and chain ID match deployed artifacts  
- [ ] Storage flow demonstrable with real `rootHash` (if claiming storage integration)  
- [ ] AI endpoint documented (provider-agnostic today; note if using 0G Compute)
