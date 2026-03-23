const ALLOWED_PREFIXES = [
  "/",
  "/auth",
  "/reset-password",
  "/wallet-onboarding",
  "/onboarding",
  "/install",
  "/heropaper",
  "/hero-token",
  "/report-spot",
  "/investors",
  "/pitch",
  "/business",
  "/fund",
  "/roadmap",
  "/treegens",
  "/privacy",
  "/terms",
  "/app",
] as const;

function isAllowedPath(pathWithQuery: string): boolean {
  return ALLOWED_PREFIXES.some((p) => pathWithQuery === p || pathWithQuery.startsWith(`${p}/`) || pathWithQuery.startsWith(`${p}?`));
}

function normalizePath(rawPath: string): string {
  if (!rawPath) return "/";
  return rawPath.startsWith("/") ? rawPath : `/${rawPath}`;
}

function parseRouteLike(value: string): string | null {
  const trimmed = value.trim();
  if (!trimmed) return null;
  const normalized = normalizePath(trimmed);
  return isAllowedPath(normalized) ? normalized : null;
}

/**
 * Parse custom-scheme / universal links into an in-app route.
 * Returns null for unknown/unsafe routes.
 */
export function parseDeepLinkToRoute(url: string): string | null {
  try {
    const u = new URL(url);
    const pathWithQuery = `${normalizePath(u.pathname)}${u.search || ""}`;
    // localhero://app/redeem -> host="app", pathname="/redeem" => "/app/redeem"
    const hostPath =
      u.protocol === "localhero:" && u.host
        ? normalizePath(`/${u.host}${u.pathname || ""}`) + (u.search || "")
        : pathWithQuery;

    const candidates = [hostPath, pathWithQuery];

    // Some auth providers encode the app route in query params.
    const redirectCandidate =
      u.searchParams.get("redirect") ||
      u.searchParams.get("redirectTo") ||
      u.searchParams.get("returnTo") ||
      u.searchParams.get("path");
    if (redirectCandidate) {
      const redirectRoute = parseRouteLike(redirectCandidate);
      if (redirectRoute) return redirectRoute;
    }

    // Hash-based callbacks like https://host/#/app/redeem
    if (u.hash) {
      const hash = u.hash.startsWith("#") ? u.hash.slice(1) : u.hash;
      const hashRoute = parseRouteLike(hash);
      if (hashRoute) return hashRoute;
    }

    for (const c of candidates) {
      if (isAllowedPath(c)) return c;
    }
    return null;
  } catch {
    return null;
  }
}

