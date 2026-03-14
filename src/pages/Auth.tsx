import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Sparkles, Shield, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import heroLogo from "@/assets/hero-logo-glow.png";
import { getAccessStatus } from "@/lib/onboarding";

const Auth = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading, signIn, authenticated, getAccessToken } = useAuth();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!authLoading && user) {
      const checkAndRedirect = async () => {
        const token = await getAccessToken();
        const accessStatus = await getAccessStatus({ accessToken: token });
        if (!accessStatus.walletLinked) {
          navigate("/wallet-onboarding", { replace: true });
          return;
        }
        if (accessStatus.onboardingCompleted) {
          navigate("/app", { replace: true });
          return;
        }
        navigate("/onboarding", { replace: true });
      };

      void checkAndRedirect();
    }
  }, [user, authLoading, navigate, getAccessToken]);

  const handlePrivySignIn = async () => {
    setLoading(true);
    try {
      signIn();
    } catch (err) {
      console.error("Privy sign-in failed:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-primary/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-hero-green-glow/5 blur-[80px] rounded-full" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[400px] relative z-10"
      >
        <button onClick={() => navigate("/")} className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8 text-sm">
          <ArrowLeft size={16} /> Back to Home
        </button>

        <div className="text-center mb-8">
          <img src={heroLogo} alt="HERO" className="w-16 h-16 mx-auto mb-4" />
          <h1 className="font-display text-3xl font-bold text-foreground">Sign in with Privy</h1>
          <p className="text-muted-foreground text-sm mt-2">Email, phone, social login, and wallet onboarding in one flow.</p>
        </div>

        <div className="space-y-3">
          <Button
            onClick={() => void handlePrivySignIn()}
            disabled={loading || authLoading}
            className="w-full h-12 rounded-xl bg-gradient-hero-glow text-primary-foreground font-bold text-base"
          >
            {loading ? "Opening Privy..." : "Continue with Privy"}
            {!loading && <Sparkles size={16} className="ml-2" />}
          </Button>
          <Button
            onClick={() => navigate("/wallet-onboarding")}
            variant="outline"
            className="w-full h-12 rounded-xl border-border/50 bg-secondary/50 hover:bg-secondary text-foreground font-semibold"
          >
            <Wallet size={16} className="mr-2" />
            Go to Wallet Onboarding
          </Button>
        </div>

        <div className="glass-card rounded-2xl p-4 mt-5 space-y-2">
          <p className="text-xs text-foreground font-semibold flex items-center gap-2">
            <Shield size={14} className="text-primary" />
            Auth status
          </p>
          <p className="text-xs text-muted-foreground">
            {authLoading ? "Checking session..." : authenticated ? "Authenticated with Privy" : "Not signed in yet"}
          </p>
        </div>

        <p className="text-center text-xs text-muted-foreground mt-6">
          After sign in, users are redirected to wallet setup and onboarding automatically.
        </p>
      </motion.div>
    </div>
  );
};

export default Auth;
