import { useState, useEffect, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Mail, Smartphone, ChevronRight, Fingerprint, Wallet, Check, Sparkles, Copy, Eye, EyeOff } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import heroLogo from "@/assets/hero-logo-glow.png";
import ogLogo from "@/assets/0g-logo.png";
import { applyReferralCode } from "@/lib/referrals";
import { useAuth } from "@/contexts/AuthContext";
import { usePrivy, useWallets } from "@privy-io/react-auth";
import { syncAuthUser } from "@/lib/api";
import { toast } from "@/hooks/use-toast";

const WalletOnboarding = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user: authUser, getAccessToken } = useAuth();
  const { ready, authenticated, user: privyUser, login } = usePrivy();
  const { wallets } = useWallets();
  const [step, setStep] = useState(0);
  const [method, setMethod] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [showAddress, setShowAddress] = useState(false);
  const [refMessage, setRefMessage] = useState("");
  const [isProvisioning, setIsProvisioning] = useState(false);
  const [walletError, setWalletError] = useState<string | null>(null);
  const loginTriggered = useRef(false);
  const saveTriggered = useRef(false);
  const selectedWalletAddress = useMemo(() => wallets[0]?.address ?? "", [wallets]);

  // Apply referral code from URL
  useEffect(() => {
    const ref = searchParams.get("ref");
    if (ref) {
      applyReferralCode(ref).then((result) => {
        if (result.success) setRefMessage(result.message);
      });
    }
  }, [searchParams]);

  useEffect(() => {
    const hasAppId = Boolean(import.meta.env.VITE_PRIVY_APP_ID);
    if (!hasAppId) {
      setWalletError("Privy is not configured. Add VITE_PRIVY_APP_ID to your .env file.");
    }
  }, []);

  useEffect(() => {
    if (step !== 3) {
      loginTriggered.current = false;
      saveTriggered.current = false;
      return;
    }

    if (!ready) return;
    if (!import.meta.env.VITE_PRIVY_APP_ID) return;

    if (!authenticated) {
      if (loginTriggered.current) return;
      loginTriggered.current = true;
      setIsProvisioning(true);
      setWalletError(null);
      void login();
      return;
    }

    if (!selectedWalletAddress || saveTriggered.current) return;
    saveTriggered.current = true;
    setIsProvisioning(true);

    const saveWallet = async () => {
      const token = await getAccessToken();
      if (!token || !privyUser?.id) {
        throw new Error("Missing authenticated Privy session.");
      }
      await syncAuthUser(token, {
        privyUserId: privyUser.id,
        email: authUser?.email || privyUser.email?.address || null,
        walletAddress: selectedWalletAddress,
      });
      setStep(4);
      toast({
        title: "Wallet ready",
        description: "Your Privy wallet is now linked to your HERO profile.",
      });
    };

    void saveWallet()
      .catch((err: unknown) => {
        const description = err instanceof Error ? err.message : "Wallet setup failed.";
        setWalletError(description);
        toast({
          title: "Wallet setup failed",
          description,
          variant: "destructive",
        });
      })
      .finally(() => setIsProvisioning(false));
  }, [step, ready, authenticated, login, selectedWalletAddress, authUser?.email, privyUser?.id, privyUser?.email?.address, getAccessToken]);

  const handleMethodSelect = (m: string) => {
    if (!import.meta.env.VITE_PRIVY_APP_ID) return;
    setMethod(m);
    setWalletError(null);
    if (m === "email") setStep(2);
    else setStep(3);
  };

  const handleEmailSubmit = () => {
    if (!email) return;
    if (!import.meta.env.VITE_PRIVY_APP_ID) return;
    setStep(3);
    setWalletError(null);
  };

  const prettyAddress = useMemo(() => {
    if (!selectedWalletAddress) return "Pending wallet address";
    if (showAddress) return selectedWalletAddress;
    return `${selectedWalletAddress.slice(0, 6)}...${selectedWalletAddress.slice(-4)}`;
  }, [selectedWalletAddress, showAddress]);

  const copyAddress = async () => {
    if (!selectedWalletAddress) return;
    await navigator.clipboard.writeText(selectedWalletAddress);
    toast({ title: "Copied", description: "Wallet address copied to clipboard." });
  };

  return (
    <div className="min-h-screen bg-background max-w-[430px] mx-auto px-6 flex flex-col justify-center">
      <AnimatePresence mode="wait">
        {/* Step 0: Welcome */}
        {step === 0 && (
          <motion.div key="welcome" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-8 text-center">
            <div className="relative inline-block mx-auto">
              <div className="absolute inset-0 bg-hero-green-glow/30 blur-[50px] rounded-full scale-150" />
              <img src={heroLogo} alt="HERO" className="w-28 h-28 relative z-10 mx-auto" style={{ animation: "glow-pulse 3s ease-in-out infinite" }} />
            </div>
            <div>
              <h1 className="font-display text-3xl font-bold text-gradient-hero mb-2">Welcome, Hero</h1>
              <p className="text-muted-foreground text-sm leading-relaxed">Your journey starts with a wallet. Don't worry — we make it as easy as signing up for email.</p>
            </div>
            <div className="glass-card rounded-2xl p-4 text-left space-y-3">
              {[
                { icon: <Shield size={16} />, text: "Your wallet is your identity — no passwords to forget" },
                { icon: <Sparkles size={16} />, text: "Earn HERO tokens & collect Soulbound NFTs" },
                { icon: <Fingerprint size={16} />, text: "Powered by Privy — Web3 made simple" },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-hero-green-light flex items-center justify-center text-primary shrink-0">{item.icon}</div>
                  <span className="text-xs text-foreground">{item.text}</span>
                </div>
              ))}
            </div>
            <button onClick={() => setStep(1)} className="w-full py-4 rounded-2xl font-bold text-sm bg-gradient-hero-glow text-primary-foreground glow-green active:scale-[0.98] transition-all flex items-center justify-center gap-2">
              Create My Wallet <ChevronRight size={18} />
            </button>
            <button onClick={() => navigate("/auth")} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              I already have a wallet
            </button>
            {walletError && (
              <p className="text-xs text-destructive">{walletError}</p>
            )}
          </motion.div>
        )}

        {/* Step 1: Choose Method */}
        {step === 1 && (
          <motion.div key="method" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-6">
            <div className="text-center">
              <h2 className="font-display text-2xl font-bold text-foreground mb-1">How do you want to sign in?</h2>
              <p className="text-sm text-muted-foreground">We'll create a wallet for you behind the scenes</p>
            </div>
            <div className="space-y-3">
              {[
                { id: "email", icon: <Mail size={20} />, label: "Continue with Email", sub: "Most popular · No crypto experience needed", color: "from-cyan-500/20 to-blue-500/20", iconColor: "text-cyan-400" },
                { id: "google", icon: <span className="text-lg">G</span>, label: "Continue with Google", sub: "One-tap sign in", color: "from-red-500/20 to-orange-500/20", iconColor: "text-red-400" },
                { id: "apple", icon: <span className="text-lg"></span>, label: "Continue with Apple", sub: "Face ID or Touch ID", color: "from-purple-500/20 to-pink-500/20", iconColor: "text-purple-400" },
                { id: "phone", icon: <Smartphone size={20} />, label: "Continue with Phone", sub: "SMS verification", color: "from-emerald-500/20 to-lime-500/20", iconColor: "text-emerald-400" },
              ].map((m) => (
                <button key={m.id} onClick={() => handleMethodSelect(m.id)} className="w-full glass-card-hover rounded-2xl p-4 flex items-center gap-4 transition-all active:scale-[0.98]">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${m.color} flex items-center justify-center ${m.iconColor} shrink-0`}>{m.icon}</div>
                  <div className="text-left flex-1">
                    <p className="font-bold text-sm text-foreground">{m.label}</p>
                    <p className="text-[11px] text-muted-foreground">{m.sub}</p>
                  </div>
                  <ChevronRight size={16} className="text-muted-foreground" />
                </button>
              ))}
            </div>
            <div className="text-center">
              <button onClick={() => setStep(0)} className="text-xs text-muted-foreground hover:text-foreground transition-colors">← Back</button>
            </div>
          </motion.div>
        )}

        {/* Step 2: Email Input */}
        {step === 2 && (
          <motion.div key="email" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-6">
            <div className="text-center">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center mx-auto mb-4">
                <Mail size={28} className="text-cyan-400" />
              </div>
              <h2 className="font-display text-2xl font-bold text-foreground mb-1">Enter your email</h2>
              <p className="text-sm text-muted-foreground">We'll send a magic link — no password needed</p>
            </div>
            <div className="space-y-4">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="hero@example.com"
                className="w-full h-14 px-5 glass rounded-2xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 text-sm"
              />
              <button
                onClick={handleEmailSubmit}
                disabled={!email.includes("@")}
                className={`w-full py-4 rounded-2xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${
                  email.includes("@") ? "bg-gradient-hero-glow text-primary-foreground glow-green active:scale-[0.98]" : "bg-secondary text-muted-foreground"
                }`}
              >
                Send Magic Link <Sparkles size={16} />
              </button>
            </div>
            <button onClick={() => setStep(1)} className="w-full text-center text-xs text-muted-foreground hover:text-foreground transition-colors">← Other sign-in methods</button>
          </motion.div>
        )}

        {/* Step 3: Creating Wallet */}
        {step === 3 && (
          <motion.div key="creating" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="text-center space-y-8">
            <div className="relative inline-block">
              <div className="absolute inset-0 bg-hero-green-glow/20 blur-[40px] rounded-full scale-150 animate-pulse" />
              <div className="w-24 h-24 rounded-3xl bg-gradient-hero-glow flex items-center justify-center relative z-10 mx-auto" style={{ animation: "pulse-glow 1.5s ease-in-out infinite" }}>
                <Wallet size={40} className="text-primary-foreground" />
              </div>
              <img src={ogLogo} alt="0G" className="absolute -bottom-2 -right-2 w-8 h-8 z-20" />
            </div>
            <div>
              <h2 className="font-display text-2xl font-bold text-foreground mb-2">Creating Your Wallet</h2>
              <div className="flex items-center justify-center gap-2">
                <img src={ogLogo} alt="0G" className="w-4 h-4" />
                <p className="text-sm text-muted-foreground">
                  {isProvisioning ? "Provisioning your Privy embedded wallet..." : "Waiting for confirmation..."}
                </p>
              </div>
            </div>
            <div className="space-y-3 max-w-[280px] mx-auto">
              {[
                { label: "Authenticating with Privy", done: authenticated },
                { label: "Generating embedded wallet", done: Boolean(selectedWalletAddress) },
                { label: "Saving wallet to HERO profile", done: step === 4 },
              ].map((s, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.8 }}
                  className="flex items-center gap-3"
                >
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${
                    s.done ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground animate-pulse"
                  }`}>
                    {s.done ? <Check size={12} /> : <div className="w-2 h-2 rounded-full bg-muted-foreground" />}
                  </div>
                  <span className="text-sm text-foreground">{s.label}</span>
                </motion.div>
              ))}
            </div>
            {walletError && (
              <div className="space-y-3">
                <p className="text-xs text-destructive">{walletError}</p>
                <button
                  onClick={() => {
                    loginTriggered.current = false;
                    saveTriggered.current = false;
                    setWalletError(null);
                    setStep(3);
                  }}
                  className="text-xs text-primary hover:underline"
                >
                  Retry wallet setup
                </button>
              </div>
            )}
          </motion.div>
        )}

        {/* Step 4: Done */}
        {step === 4 && (
          <motion.div key="done" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-6 text-center">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", bounce: 0.5, delay: 0.2 }}>
              <div className="w-20 h-20 rounded-3xl bg-gradient-hero-glow flex items-center justify-center mx-auto glow-green">
                <Check size={36} className="text-primary-foreground" />
              </div>
            </motion.div>
            <div>
              <h2 className="font-display text-2xl font-bold text-gradient-hero mb-1">You're a Hero Now!</h2>
              <p className="text-sm text-muted-foreground">Your wallet is live on 0G Chain</p>
            </div>

            {/* Wallet Card */}
            <div className="glass-card rounded-2xl p-5 text-left relative overflow-hidden">
              <div className="absolute -top-8 right-0 w-32 h-32 bg-hero-green-glow/10 blur-[40px] rounded-full" />
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-bold text-primary uppercase tracking-wider">0G Chain Wallet</span>
                  <span className="text-[10px] font-semibold text-hero-yellow bg-hero-yellow-light px-2 py-0.5 rounded-full">Privy Embedded</span>
                </div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-gradient-hero-glow flex items-center justify-center">
                    <Wallet size={18} className="text-primary-foreground" />
                  </div>
                  <div className="flex-1">
                    <p className="font-mono text-sm font-bold text-foreground">{prettyAddress}</p>
                    <p className="text-[10px] text-muted-foreground">Soulbound ID Active</p>
                  </div>
                  <button onClick={() => setShowAddress(!showAddress)} className="w-8 h-8 rounded-lg glass flex items-center justify-center text-muted-foreground">
                    {showAddress ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                  <button onClick={() => void copyAddress()} className="w-8 h-8 rounded-lg glass flex items-center justify-center text-muted-foreground">
                    <Copy size={14} />
                  </button>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div className="glass rounded-xl p-2.5 text-center">
                    <p className="text-xs font-bold text-foreground">0</p>
                    <p className="text-[9px] text-muted-foreground">$HERO</p>
                  </div>
                  <div className="glass rounded-xl p-2.5 text-center">
                    <p className="text-xs font-bold text-foreground">0</p>
                    <p className="text-[9px] text-muted-foreground">NFTs</p>
                  </div>
                  <div className="glass rounded-xl p-2.5 text-center">
                    <p className="text-xs font-bold text-foreground">Lv 1</p>
                    <p className="text-[9px] text-muted-foreground">Rank</p>
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={() => navigate(authUser ? "/onboarding" : "/auth")}
              className="w-full py-4 rounded-2xl font-bold text-sm bg-gradient-hero-glow text-primary-foreground glow-green active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
              {authUser ? "Continue Profile Setup" : "Sign In to Continue"} <ChevronRight size={18} />
            </button>
            <button
              onClick={() => navigate("/")}
              className="w-full py-3 rounded-xl font-semibold text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Skip for now
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default WalletOnboarding;
