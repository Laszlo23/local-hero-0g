import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { hasCompletedOnboarding } from "@/lib/onboarding";
import { getDeviceId } from "@/lib/profile";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  const location = useLocation();
  const [onboardingChecked, setOnboardingChecked] = useState(false);
  const [onboardingDone, setOnboardingDone] = useState(true);

  useEffect(() => {
    if (!user || loading) return;
    // Skip check if already on onboarding page
    if (location.pathname === "/onboarding") {
      setOnboardingChecked(true);
      return;
    }

    hasCompletedOnboarding({ userId: user.id, deviceId: getDeviceId() }).then((done) => {
      setOnboardingDone(done);
      setOnboardingChecked(true);
    });
  }, [user, loading, location.pathname]);

  if (loading || (!onboardingChecked && user)) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  if (onboardingChecked && !onboardingDone && location.pathname !== "/onboarding") {
    return <Navigate to="/onboarding" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
