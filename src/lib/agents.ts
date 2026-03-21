/**
 * Canonical definitions for the six **Overmind ecosystem agents** (AI personas + responsibilities).
 * Used by `Overmind.tsx` UI. Keep the system prompt in `supabase/functions/overmind-chat/index.ts`
 * aligned with these names and duties (manual review when changing either side).
 *
 * **Separate concepts** (do not confuse):
 * - **777 Agents** — growth program / tiers in `Agents.tsx` (Bronze–Diamond); marketing, not these IDs.
 * - **On-chain `AGENT_ROLE`** — smart contract role in `contracts/` for `agentMint` (badges / soulbound ID).
 * - **App roles** — `admin` | `moderator` | `user` in Supabase `user_roles` (`AdminRoles.tsx`, `use-admin.ts`).
 */

export type EcosystemAgentId = "quest" | "growth" | "partner" | "reward" | "community" | "impact";

export interface EcosystemAgent {
  id: EcosystemAgentId;
  /** Display name (must stay consistent with Overmind edge prompt) */
  name: string;
  /** Short UI blurb */
  shortDesc: string;
  /** What this agent covers for ops / support / product */
  responsibilities: string[];
}

export const ECOSYSTEM_AGENTS: readonly EcosystemAgent[] = [
  {
    id: "quest",
    name: "Quest Agent",
    shortDesc: "Generates & adapts daily quests",
    responsibilities: [
      "Quest creation and adaptation (daily/local)",
      "Align quests with city, season, and community goals",
    ],
  },
  {
    id: "growth",
    name: "Growth Agent",
    shortDesc: "User acquisition & virality",
    responsibilities: ["Acquisition campaigns", "Social / Farcaster / X / Web3 growth loops"],
  },
  {
    id: "partner",
    name: "Partner Agent",
    shortDesc: "Business onboarding",
    responsibilities: ["Local business onboarding", "Sponsored quests and redemptions"],
  },
  {
    id: "reward",
    name: "Reward Agent",
    shortDesc: "HERO economy management",
    responsibilities: ["Points economy balance", "Anti-abuse and incentive design"],
  },
  {
    id: "community",
    name: "Community Agent",
    shortDesc: "Support & moderation",
    responsibilities: ["User support", "Moderation", "Highlighting hero stories"],
  },
  {
    id: "impact",
    name: "Impact Agent",
    shortDesc: "Real-world impact tracking",
    responsibilities: ["Trees, cleanups, neighbors helped, businesses supported (metrics)"],
  },
] as const;

export const ECOSYSTEM_AGENT_IDS: readonly EcosystemAgentId[] = ECOSYSTEM_AGENTS.map((a) => a.id);

export function getEcosystemAgent(id: string): EcosystemAgent | undefined {
  return ECOSYSTEM_AGENTS.find((a) => a.id === id);
}
