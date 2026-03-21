/**
 * Single source for automated audit tests: expected HTTP surface of `server/` and contract entrypoints.
 * Update when adding routes or public contract functions.
 */

/** Express routes mounted at the API root (no trailing slash). */
export const EXPECTED_AUTH_API_ROUTES = [
  "GET /health",
  "POST /auth/sync",
  "GET /me/access-status",
  "POST /me/onboarding/complete",
  "POST /me/storage/upload",
  "GET /storage/files/:rootHash",
] as const;

/** Badge / identity contracts — user- and agent-facing functions to monitor in reviews. */
export const EXPECTED_BADGE_CONTRACT_FUNCTIONS = [
  "registerBadgeType",
  "setBadgeURI",
  "mintWithSignature",
  "agentMint",
  "pause",
  "unpause",
] as const;

export const EXPECTED_IDENTITY_CONTRACT_FUNCTIONS = [
  "claimWithSignature",
  "agentMint",
  "setBaseURI",
  "pause",
  "unpause",
] as const;
