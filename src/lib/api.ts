const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || "").replace(/\/$/, "");

function toApiUrl(path: string): string {
  if (/^https?:\/\//.test(path)) return path;
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${API_BASE_URL}${normalized}`;
}

export async function apiRequest<T>(
  path: string,
  options: RequestInit & { accessToken?: string | null } = {}
): Promise<T> {
  const { accessToken, headers, ...rest } = options;
  const response = await fetch(toApiUrl(path), {
    ...rest,
    headers: {
      "Content-Type": "application/json",
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      ...(headers || {}),
    },
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || `API request failed (${response.status})`);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}

export interface SyncAuthPayload {
  privyUserId: string;
  email?: string | null;
  walletAddress?: string | null;
}

export interface SyncAuthResponse {
  id: string;
  privyUserId: string;
  email?: string | null;
  walletAddress?: string | null;
  onboardingCompleted?: boolean;
  metadata?: {
    display_name?: string;
    avatar_url?: string;
  };
}

export async function syncAuthUser(accessToken: string, payload: SyncAuthPayload): Promise<SyncAuthResponse> {
  return apiRequest<SyncAuthResponse>("/auth/sync", {
    method: "POST",
    accessToken,
    body: JSON.stringify(payload),
  });
}

export interface AccessStatusResponse {
  onboardingCompleted: boolean;
  walletLinked: boolean;
}

export async function getMeAccessStatus(accessToken: string): Promise<AccessStatusResponse> {
  return apiRequest<AccessStatusResponse>("/me/access-status", {
    method: "GET",
    accessToken,
  });
}

export interface CompleteOnboardingPayload {
  displayName: string;
  bio?: string;
  location?: string;
  avatarUrl?: string | null;
  socials?: Record<string, string>;
}

export async function completeOnboarding(accessToken: string, payload: CompleteOnboardingPayload): Promise<{ ok: boolean }> {
  return apiRequest<{ ok: boolean }>("/me/onboarding/complete", {
    method: "POST",
    accessToken,
    body: JSON.stringify(payload),
  });
}
