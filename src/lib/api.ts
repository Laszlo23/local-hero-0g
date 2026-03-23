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
export interface MePointsResponse {
  balance: number;
  pointsPerToken: number;
  minRedeemPoints: number;
  tokenSymbol: string;
  redeemEnabled: boolean;
  chainId: number;
  tokenAddress?: string | null;
  /** On-chain totals when RPC + HERO_TOKEN_ADDRESS configured */
  tokenTotalSupplyWei?: string;
  tokenRemainingMintableWei?: string;
  tokenMaxSupplyWei?: string;
}

export async function getMePoints(accessToken: string): Promise<MePointsResponse> {
  return apiRequest<MePointsResponse>("/me/points", {
    method: "GET",
    accessToken,
  });
}

export interface RedeemResponse {
  ok: boolean;
  txHash: string;
  pointsSpent: number;
  tokenWei: string;
  recipient: string;
  chainId: number;
}

export async function redeemPoints(
  accessToken: string,
  payload: { pointsAmount: number; recipientAddress?: string }
): Promise<RedeemResponse> {
  return apiRequest<RedeemResponse>("/me/redeem", {
    method: "POST",
    accessToken,
    body: JSON.stringify(payload),
  });
}

export type CommunitySignalCategory =
  | "litter_waste"
  | "vandalism_damage"
  | "overgrown"
  | "safety_concern"
  | "other";

export interface SubmitCommunitySignalPayload {
  category: CommunitySignalCategory;
  placeLabel: string;
  description: string;
  locationHint?: string | null;
  contactEmail?: string | null;
}

export interface SubmitCommunitySignalResponse {
  ok: boolean;
  id: string;
}

export interface EducationalQuestDraftStep {
  title: string;
  instruction: string;
  evidenceType: "none" | "field_observation" | "qr_scan" | "quiz" | "photo";
  arVisual: "tree" | "book" | "chest" | "leaf" | "water" | "recycle";
  arEmoji: string;
  arX: number;
  arY: number;
  qrExpected?: string;
  quizPrompt?: string;
  quizOptionA?: string;
  quizOptionB?: string;
  quizCorrect?: "a" | "b";
  pointsOverride?: number;
}

export interface EducationalQuestDraft {
  slug: string;
  title: string;
  summary: string;
  ageMin: number;
  ageMax: number;
  learningObjectives: string[];
  subjectTags: string[];
  questType: "ar_overlay" | "field_observation" | "qr_trail" | "photo_evidence" | "hybrid";
  pointsPerStep: number;
  bonusComplete: number;
  steps: EducationalQuestDraftStep[];
}

export interface GenerateEducationalQuestDraftPayload {
  titleHint: string;
  ageMin: number;
  ageMax: number;
  subjectTags: string[];
  locationContext: string;
  classSize?: number;
  durationMinutes?: number;
  focus: string;
  classCheckpointPrefix?: string;
}

export interface GenerateEducationalQuestDraftResponse {
  ok: boolean;
  draft: EducationalQuestDraft;
}

/** No auth — public heads-up for organizers (rate-limited server-side). */
export async function submitCommunitySignal(
  payload: SubmitCommunitySignalPayload
): Promise<SubmitCommunitySignalResponse> {
  const response = await fetch(toApiUrl("/public/community-signal"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      category: payload.category,
      placeLabel: payload.placeLabel,
      description: payload.description,
      locationHint: payload.locationHint ?? undefined,
      contactEmail: payload.contactEmail ?? undefined,
    }),
  });
  if (!response.ok) {
    let msg = `Request failed (${response.status})`;
    try {
      const j = (await response.json()) as { error?: string };
      if (j.error) msg = j.error;
    } catch {
      /* ignore */
    }
    throw new HttpError(msg, response.status);
  }
  return (await response.json()) as SubmitCommunitySignalResponse;
}

export async function generateEducationalQuestDraft(
  accessToken: string,
  payload: GenerateEducationalQuestDraftPayload
): Promise<GenerateEducationalQuestDraftResponse> {
  return apiRequest<GenerateEducationalQuestDraftResponse>("/me/educational-quest-draft", {
    method: "POST",
    accessToken,
    body: JSON.stringify(payload),
  });
}

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
