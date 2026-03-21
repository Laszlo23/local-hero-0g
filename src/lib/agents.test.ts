import { describe, it, expect } from "vitest";
import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { ECOSYSTEM_AGENTS, ECOSYSTEM_AGENT_IDS, getEcosystemAgent } from "./agents";

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = join(__dirname, "../..");

describe("Ecosystem agents (Overmind)", () => {
  it("defines exactly six agents with unique ids", () => {
    expect(ECOSYSTEM_AGENTS).toHaveLength(6);
    expect(new Set(ECOSYSTEM_AGENT_IDS).size).toBe(6);
  });

  it("exposes stable ids and display names for UI + docs", () => {
    for (const a of ECOSYSTEM_AGENTS) {
      expect(a.name.length).toBeGreaterThan(3);
      expect(a.shortDesc.length).toBeGreaterThan(5);
      expect(a.responsibilities.length).toBeGreaterThan(0);
      expect(getEcosystemAgent(a.id)?.id).toBe(a.id);
    }
  });

  it("keeps supabase overmind-chat prompt in sync with agent names", () => {
    const path = join(repoRoot, "supabase/functions/overmind-chat/index.ts");
    if (!existsSync(path)) return;
    const source = readFileSync(path, "utf8");
    for (const a of ECOSYSTEM_AGENTS) {
      expect(source, `overmind-chat should mention ${a.name}`).toContain(a.name);
    }
  });
});
