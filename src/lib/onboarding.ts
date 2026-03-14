import { getMeAccessStatus } from "@/lib/api";

interface OnboardingStatusParams {
  accessToken?: string | null;
}

export interface AccessStatus {
  onboardingCompleted: boolean;
  walletLinked: boolean;
}

export async function getAccessStatus({ accessToken }: OnboardingStatusParams): Promise<AccessStatus> {
  if (!accessToken) {
    return { onboardingCompleted: false, walletLinked: false };
  }

  try {
    const status = await getMeAccessStatus(accessToken);
    return {
      onboardingCompleted: status.onboardingCompleted,
      walletLinked: status.walletLinked,
    };
  } catch (error) {
    console.error("Failed to check access status:", error);
    return { onboardingCompleted: false, walletLinked: false };
  }
}

export async function hasCompletedOnboarding({ accessToken }: OnboardingStatusParams): Promise<boolean> {
  const status = await getAccessStatus({ accessToken });
  return status.onboardingCompleted;
}

export async function hasLinkedWallet({ accessToken }: OnboardingStatusParams): Promise<boolean> {
  const status = await getAccessStatus({ accessToken });
  return status.walletLinked;
}
