import { describe, it, expect } from "vitest";
import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import {
  EXPECTED_AUTH_API_ROUTES,
  EXPECTED_BADGE_CONTRACT_FUNCTIONS,
  EXPECTED_IDENTITY_CONTRACT_FUNCTIONS,
} from "./auditConstants";

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = join(__dirname, "../..");

/** Substrings that must appear in `server/src/routes.ts` for each logical route. */
const SERVER_ROUTE_SNIPPETS: Record<(typeof EXPECTED_AUTH_API_ROUTES)[number], string> = {
  "GET /health": `router.get("/health"`,
  "POST /auth/sync": `router.post("/auth/sync"`,
  "GET /me/access-status": `router.get("/me/access-status"`,
  "POST /me/onboarding/complete": `router.post("/me/onboarding/complete"`,
  "POST /me/storage/upload": `"/me/storage/upload"`,
  "GET /storage/files/:rootHash": `router.get("/storage/files/:rootHash"`,
};

describe("API route audit (server)", () => {
  it("server/src/routes.ts implements EXPECTED_AUTH_API_ROUTES", () => {
    const path = join(repoRoot, "server/src/routes.ts");
    const src = readFileSync(path, "utf8");
    for (const route of EXPECTED_AUTH_API_ROUTES) {
      expect(src, route).toContain(SERVER_ROUTE_SNIPPETS[route]);
    }
  });
});

describe("Contract surface audit (Solidity)", () => {
  it("LocalHeroBadges exposes expected external functions", () => {
    const path = join(repoRoot, "contracts/src/LocalHeroBadges.sol");
    const src = readFileSync(path, "utf8");
    for (const fn of EXPECTED_BADGE_CONTRACT_FUNCTIONS) {
      expect(src, fn).toMatch(new RegExp(`function ${fn}\\s*\\(`));
    }
  });

  it("LocalHeroSoulboundIdentity exposes expected external functions", () => {
    const path = join(repoRoot, "contracts/src/LocalHeroSoulboundIdentity.sol");
    const src = readFileSync(path, "utf8");
    for (const fn of EXPECTED_IDENTITY_CONTRACT_FUNCTIONS) {
      expect(src, fn).toMatch(new RegExp(`function ${fn}\\s*\\(`));
    }
  });
});
