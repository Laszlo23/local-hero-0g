import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = join(__dirname, "../..");

/**
 * Snippets that must remain in `src/App.tsx` for critical journeys.
 * Nested routes under `/app` use `path="segment"` without a leading slash.
 */
const APP_TSX_ROUTE_SNIPPETS = [
  'path="/auth"',
  'path="/onboarding"',
  'path="/wallet-onboarding"',
  'path="/app"',
  'path="quests"',
  'path="profile"',
  'path="/app/overmind"',
  'path="/app/admin/roles"',
  'path="contracts"',
] as const;

describe("App routing (flow coverage)", () => {
  it("App.tsx still wires critical route snippets", () => {
    const appTsx = readFileSync(join(repoRoot, "src/App.tsx"), "utf8");
    for (const snippet of APP_TSX_ROUTE_SNIPPETS) {
      expect(appTsx, snippet).toContain(snippet);
    }
  });
});
