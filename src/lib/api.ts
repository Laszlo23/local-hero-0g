const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || "").replace(/\/$/, "");

/** Thrown for failed API responses; use `status` to branch (e.g. 503 storage unavailable). */
export class HttpError extends Error {
  constructor(
    message: string,
    public readonly status: number
  ) {
    super(message);
    this.name = "HttpError";
  }
}

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
    throw new HttpError(text || `API request failed (${response.status})`, response.status);
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

export interface StorageUploadResponse {
  rootHash: string;
  txHash?: string;
  url: string;
}

/** Upload a file to 0G via the API (multipart field name: `file`). */
export async function uploadStorageFile(accessToken: string, file: File): Promise<StorageUploadResponse> {
  const form = new FormData();
  form.append("file", file);
  const response = await fetch(toApiUrl("/me/storage/upload"), {
    method: "POST",
    headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {},
    body: form,
  });
  if (!response.ok) {
    const text = await response.text();
    throw new HttpError(text || `Upload failed (${response.status})`, response.status);
  }
  return (await response.json()) as StorageUploadResponse;
}
