import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Mail, Lock, User, Eye, EyeOff, Sparkles } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";
import heroLogo from "@/assets/hero-logo-glow.png";
import { getDeviceId } from "@/lib/profile";



const Auth = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [mode, setMode] = useState<"login" | "signup" | "forgot">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // If already logged in, check onboarding then go to app
  useEffect(() => {
    if (!authLoading && user) {
      const checkAndRedirect = async () => {
        const deviceId = getDeviceId();

        // Check if profile exists with onboarding completed
        const { data: profileByUser } = await supabase
          .from("user_profiles")
          .select("id, onboarding_completed")
          .eq("user_id", user.id)
          .maybeSingle();

        if (profileByUser?.onboarding_completed) {
          navigate("/app", { replace: true });
          return;
        }

        // Also check by device_id
        const { data: profileByDevice } = await supabase
          .from("user_profiles")
          .select("id, onboarding_completed")
          .eq("device_id", deviceId)
          .maybeSingle();

        if (profileByDevice?.onboarding_completed) {
          // Link user_id if missing
          if (!profileByDevice.id) {
            await supabase.from("user_profiles").update({ user_id: user.id }).eq("device_id", deviceId);
          }
          navigate("/app", { replace: true });
          return;
        }

        // No completed onboarding — send to onboarding
        navigate("/onboarding", { replace: true });
      };

      void checkAndRedirect();
    }
  }, [user, authLoading, navigate]);

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (mode === "forgot") {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/reset-password`,
        });
        if (error) throw error;
        toast({ title: "Check your email 📧", description: "We sent you a password reset link." });
        setMode("login");
      } else if (mode === "signup") {
        const deviceId = getDeviceId();
        const { data: signUpData, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/app`,
            data: { display_name: displayName, device_id: deviceId },
          },
        });
        if (error) throw error;
        // If auto-confirm is enabled, user gets a session immediately — skip the email toast
        if (!signUpData.session) {
          toast({ title: "Check your email ✉️", description: "Verify your email to activate your hero account." });
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        navigate("/app");
      }
    } catch (err: any) {
      toast({ title: "Oops", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      const { error } = await lovable.auth.signInWithOAuth("google", {
        redirect_uri: window.location.origin,
      });
      if (error) throw error;
    } catch (err: any) {
      toast({ title: "Google sign-in failed", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleAppleSignIn = async () => {
    setLoading(true);
    try {
      const { error } = await lovable.auth.signInWithOAuth("apple", {
        redirect_uri: window.location.origin,
      });
      if (error) throw error;
    } catch (err: any) {
      toast({ title: "Apple sign-in failed", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-primary/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-hero-green-glow/5 blur-[80px] rounded-full" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[400px] relative z-10"
      >
        {/* Back */}
        <button onClick={() => navigate("/")} className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8 text-sm">
          <ArrowLeft size={16} /> Back to Home
        </button>

        {/* Logo */}
        <div className="text-center mb-8">
          <img src={heroLogo} alt="HERO" className="w-16 h-16 mx-auto mb-4" />
          <h1 className="font-display text-3xl font-bold text-foreground">
            {mode === "login" ? "Welcome back, Hero" : mode === "signup" ? "Begin your journey" : "Reset password"}
          </h1>
          <p className="text-muted-foreground text-sm mt-2">
            {mode === "login"
              ? "Sign in to continue your quest"
              : mode === "signup"
              ? "Create your hero identity"
              : "We'll send you a reset link"}
          </p>
        </div>

        {/* Social Sign-In */}
        {mode !== "forgot" && (
          <div className="space-y-2.5 mb-4">
            <Button
              onClick={handleGoogleSignIn}
              disabled={loading}
              variant="outline"
              className="w-full h-12 rounded-xl border-border/50 bg-secondary/50 hover:bg-secondary text-foreground font-semibold flex items-center gap-3"
            >
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Continue with Google
            </Button>
            <Button
              onClick={handleAppleSignIn}
              disabled={loading}
              variant="outline"
              className="w-full h-12 rounded-xl border-border/50 bg-secondary/50 hover:bg-secondary text-foreground font-semibold flex items-center gap-3"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
              </svg>
              Continue with Apple
            </Button>
          </div>
        )}

        {mode !== "forgot" && (
          <div className="flex items-center gap-3 mb-4">
            <div className="flex-1 h-px bg-border/50" />
            <span className="text-xs text-muted-foreground">or</span>
            <div className="flex-1 h-px bg-border/50" />
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleEmailAuth} className="space-y-3">
          <AnimatePresence mode="wait">
            {mode === "signup" && (
              <motion.div key="name" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}>
                <div className="relative">
                  <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="Hero name"
                    className="pl-10 h-12 rounded-xl bg-secondary/50 border-border/50"
                    required
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="relative">
            <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email address"
              className="pl-10 h-12 rounded-xl bg-secondary/50 border-border/50"
              required
            />
          </div>

          {mode !== "forgot" && (
            <div className="relative">
              <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="pl-10 pr-10 h-12 rounded-xl bg-secondary/50 border-border/50"
                required
                minLength={6}
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          )}

          {mode === "login" && (
            <button type="button" onClick={() => setMode("forgot")} className="text-xs text-primary hover:underline">
              Forgot password?
            </button>
          )}

          <Button type="submit" disabled={loading} className="w-full h-12 rounded-xl bg-gradient-hero-glow text-primary-foreground font-bold text-base">
            {loading ? (
              <span className="animate-pulse">Loading...</span>
            ) : mode === "login" ? (
              <>Sign In <Sparkles size={16} className="ml-2" /></>
            ) : mode === "signup" ? (
              <>Create Account <Sparkles size={16} className="ml-2" /></>
            ) : (
              "Send Reset Link"
            )}
          </Button>
        </form>

        {/* Toggle */}
        <p className="text-center text-sm text-muted-foreground mt-6">
          {mode === "login" ? (
            <>Don't have an account?{" "}<button onClick={() => setMode("signup")} className="text-primary font-semibold hover:underline">Sign up</button></>
          ) : mode === "signup" ? (
            <>Already a hero?{" "}<button onClick={() => setMode("login")} className="text-primary font-semibold hover:underline">Sign in</button></>
          ) : (
            <button onClick={() => setMode("login")} className="text-primary font-semibold hover:underline">Back to sign in</button>
          )}
        </p>
      </motion.div>
    </div>
  );
};

export default Auth;
