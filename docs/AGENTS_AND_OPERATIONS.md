# Agents, roles, and operations

This document maps **who does what** in Local Hero so engineering, support, and on-chain ops stay aligned.

## 1. Six ecosystem agents (Overmind)

These are **AI personas** coordinated by the Overmind assistant (`/app/overmind`).

| Agent | Responsibility (product / ops) |
|-------|--------------------------------|
| **Quest Agent** | Quest generation, daily/local adaptation |
| **Growth Agent** | Acquisition, growth loops |
| **Partner Agent** | Business onboarding, sponsored quests |
| **Reward Agent** | HERO economy, incentives, abuse prevention |
| **Community Agent** | Support, moderation, storytelling |
| **Impact Agent** | Impact metrics (trees, neighbors, businesses, etc.) |

**Source of truth (names + responsibilities):** `src/lib/agents.ts`  
**UI:** `src/pages/Overmind.tsx`  
**LLM system prompt:** `supabase/functions/overmind-chat/index.ts` — keep agent names consistent with `agents.ts` (Vitest checks this when the file is present).

> When you rename or add an agent, update `agents.ts`, the Overmind UI, and the edge prompt together.

## 2. “777 Agents” program

The **Bronze → Diamond** tiers and earning mechanics on `/app/agents` are a **separate product surface** (community agent program). They are **not** the same IDs as the six ecosystem agents above.

## 3. App roles (Supabase)

Stored in `user_roles` with `app_role` enum: `admin`, `moderator`, `user`.

| Role | Intended use |
|------|----------------|
| **admin** | Full admin UI, Overmind access (`useAdmin`), role assignment (`AdminRoles`), challenges/drops admin where wired |
| **moderator** | Scoped moderation (depends on RLS policies per table) |
| **user** | Default |

**Caveat:** Admin detection uses Supabase `user_roles` joined to `user.id` from the client. If you use **Privy-only** auth without linking Supabase `auth.users` / `user_profiles.user_id` to the same identifier, admin checks may not match real users. Track this in `AUDIT_CHECKLIST.md` for your deployment.

## 4. On-chain roles (contracts)

See `contracts/README.md`. Summary:

| Role | Use |
|------|-----|
| `REGISTRAR_ROLE` | Register badge types, URIs |
| `SIGNER_ROLE` | Sign EIP-712 mint vouchers (backend hot key) |
| `AGENT_ROLE` | `agentMint` for campaigns / special events |
| `DEFAULT_ADMIN_ROLE` | Pause, grant roles |

These are **not** the same as Supabase `admin` or the six Overmind agents.

## 5. Who does support vs quest creation?

| Need | How it’s covered today |
|------|-------------------------|
| **Automated quest ideas** | Quest Agent (Overmind) + optional `generate-daily-quests` edge function |
| **Human support** | Community Agent persona + real ops; assign **moderator** / **admin** in Supabase for tooling |
| **Partner / business** | Partner Agent persona + **Partner** flows in product |
| **On-chain badge drops** | Contract `AGENT_ROLE` + registrar setup |

For production, define explicit **runbooks** (who owns moderation, who holds `SIGNER_ROLE` keys, rotation, incident pause).
