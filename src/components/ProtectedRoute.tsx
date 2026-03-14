import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { getAccessStatus } from "@/lib/onboarding";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading, getAccessToken } = useAuth();
  const location = useLocation();
  const [accessChecked, setAccessChecked] = useState(false);
  const [onboardingDone, setOnboardingDone] = useState(true);
  const [walletLinked, setWalletLinked] = useState(true);

  useEffect(() => {
    if (!user || loading) return;
    let cancelled = false;
    const runCheck = async () => {
      const token = await getAccessToken();
      const status = await getAccessStatus({ accessToken: token });
      if (!cancelled) {
        setOnboardingDone(status.onboardingCompleted);
        setWalletLinked(status.walletLinked);
        setAccessChecked(true);
      }
    };

    void runCheck();
    return () => {
      cancelled = true;
    };
  }, [user, loading, location.pathname, getAccessToken]);

  if (loading || (!accessChecked && user)) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  if (accessChecked && !walletLinked && location.pathname !== "/wallet-onboarding") {
    return <Navigate to="/wallet-onboarding" replace />;
  }

  if (accessChecked && !onboardingDone && location.pathname !== "/onboarding") {
    return <Navigate to="/onboarding" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
