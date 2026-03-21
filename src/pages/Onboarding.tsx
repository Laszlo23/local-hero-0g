import { useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, ChevronRight, Check, Sparkles, Globe, Twitter, Instagram, Github, Linkedin, MessageCircle, Upload, User, MapPin } from "lucide-react";
import confetti from "canvas-confetti";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";
import heroLogo from "@/assets/hero-logo-glow.png";
import { completeOnboarding, HttpError, uploadStorageFile } from "@/lib/api";
import { type SocialKey } from "@/lib/profile";

const socialConfig: { key: SocialKey; icon: React.ReactNode; label: string; placeholder: string; color: string }[] = [
  { key: "twitter", icon: <Twitter size={16} />, label: "Twitter / X", placeholder: "@handle", color: "text-sky-400" },
  { key: "instagram", icon: <Instagram size={16} />, label: "Instagram", placeholder: "@handle", color: "text-pink-400" },
  { key: "github", icon: <Github size={16} />, label: "GitHub", placeholder: "username", color: "text-foreground" },
  { key: "linkedin", icon: <Linkedin size={16} />, label: "LinkedIn", placeholder: "profile URL", color: "text-blue-400" },
  { key: "website", icon: <Globe size={16} />, label: "Website", placeholder: "https://...", color: "text-emerald-400" },
  { key: "discord", icon: <MessageCircle size={16} />, label: "Discord", placeholder: "user#1234", color: "text-violet-400" },
];

const Onboarding = () => {
  const navigate = useNavigate();
  const { user, getAccessToken } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [step, setStep] = useState(0);
  const [displayName, setDisplayName] = useState(user?.user_metadata?.display_name || "");
  const [bio, setBio] = useState("");
  const [location, setLocation] = useState("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>(
    user?.user_metadata?.avatar_url || ""
  );
  const [socials, setSocials] = useState<Record<SocialKey, string>>({
    twitter: "", instagram: "", github: "", linkedin: "", website: "", discord: "",
  });
  const [saving, setSaving] = useState(false);
  const [rewardShown, setRewardShown] = useState(false);

  const steps = [
    { title: "Your Hero Identity", subtitle: "Set your name and photo" },
    { title: "Tell Us About You", subtitle: "Bio & location" },
    { title: "Connect Socials", subtitle: "Optional — link your accounts" },
    { title: "Welcome, Hero! 🎉", subtitle: "You earned your first reward" },
  ];

  const handleAvatarSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast({ title: "File too large", description: "Max 5MB", variant: "destructive" });
      return;
    }
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const handleFinish = useCallback(async () => {
    if (saving) return;
    setSaving(true);

    try {
      const token = await getAccessToken();
      if (!token) {
        throw new Error("No Privy access token found. Please sign in again.");
      }

      let avatarUrl: string | null = null;
      if (avatarFile) {
        try {
          const uploaded = await uploadStorageFile(token, avatarFile);
          avatarUrl = uploaded.url;
          setAvatarPreview(uploaded.url);
        } catch (uploadErr: unknown) {
          if (uploadErr instanceof HttpError && uploadErr.status === 503) {
            toast({
              title: "Avatar skipped",
              description: "0G storage is not configured on the server (set OG_0G_STORAGE_PRIVATE_KEY). Completing without photo.",
            });
            avatarUrl = null;
          } else {
            const msg = uploadErr instanceof Error ? uploadErr.message : String(uploadErr);
            toast({
              title: "Avatar upload failed",
              description: msg,
              variant: "destructive",
            });
            throw uploadErr;
          }
        }
      } else if (avatarPreview && !avatarPreview.startsWith("blob:")) {
        avatarUrl = avatarPreview;
      }

      await completeOnboarding(token, {
        displayName,
        bio,
        location,
        avatarUrl,
        socials,
      });

      setRewardShown(true);
      setStep(3);

      // Fire confetti celebration
      setTimeout(() => {
        const end = Date.now() + 2500;
        const frame = () => {
          confetti({ particleCount: 4, angle: 60, spread: 55, origin: { x: 0, y: 0.7 }, colors: ["#22c55e", "#facc15", "#f97316"] });
          confetti({ particleCount: 4, angle: 120, spread: 55, origin: { x: 1, y: 0.7 }, colors: ["#22c55e", "#facc15", "#a855f7"] });
          if (Date.now() < end) requestAnimationFrame(frame);
        };
        frame();
        setTimeout(() => confetti({ particleCount: 120, spread: 100, origin: { y: 0.5 }, colors: ["#22c55e", "#facc15", "#f97316", "#a855f7", "#3b82f6"] }), 400);
      }, 300);
    } catch (err: any) {
      toast({ title: "Error saving profile", description: err.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  }, [saving, avatarFile, avatarPreview, displayName, bio, location, socials, getAccessToken]);

  const canAdvance = step === 0 ? displayName.trim().length > 0 : true;

  const nextStep = () => {
    if (step === 2) {
      handleFinish();
    } else if (step === 3) {
      navigate("/app", { replace: true });
    } else {
      setStep(step + 1);
    }
  };

  const initials = displayName
    ? displayName.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2)
    : "?";

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-primary/5 blur-[120px] rounded-full" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[440px] relative z-10"
      >
        {/* Progress */}
        <div className="flex gap-2 mb-8">
          {steps.map((_, i) => (
            <div key={i} className={`h-1 flex-1 rounded-full transition-all duration-500 ${i <= step ? "bg-primary" : "bg-border/30"}`} />
          ))}
        </div>

        <AnimatePresence mode="wait">
          {/* Step 0: Identity */}
          {step === 0 && (
            <motion.div key="step0" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} className="space-y-6">
              <div className="text-center">
                <img src={heroLogo} alt="HERO" className="w-12 h-12 mx-auto mb-3" />
                <h1 className="font-display text-2xl font-bold text-foreground">{steps[0].title}</h1>
                <p className="text-muted-foreground text-sm mt-1">{steps[0].subtitle}</p>
              </div>

              {/* Avatar */}
              <div className="flex justify-center">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="relative group"
                >
                  <div className="w-24 h-24 rounded-full ring-4 ring-primary/30 overflow-hidden bg-secondary flex items-center justify-center">
                    {avatarPreview ? (
                      <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-2xl font-bold text-muted-foreground">{initials}</span>
                    )}
                  </div>
                  <div className="absolute inset-0 rounded-full bg-background/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Camera size={24} className="text-foreground" />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                    <Upload size={14} className="text-primary-foreground" />
                  </div>
                </button>
                <input ref={fileInputRef} type="file" accept="image/*" onChange={handleAvatarSelect} className="hidden" />
              </div>

              {/* Name */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground">Display Name</label>
                <div className="relative">
                  <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="What should we call you?"
                    className="pl-10 h-12 rounded-xl bg-secondary/50 border-border/50"
                    maxLength={50}
                  />
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 1: Bio & Location */}
          {step === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} className="space-y-6">
              <div className="text-center">
                <h1 className="font-display text-2xl font-bold text-foreground">{steps[1].title}</h1>
                <p className="text-muted-foreground text-sm mt-1">{steps[1].subtitle}</p>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-medium text-muted-foreground">Bio</label>
                  <Textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Tell the community about yourself..."
                    className="bg-secondary/50 border-border/50 text-foreground text-sm resize-none rounded-xl"
                    rows={3}
                    maxLength={160}
                  />
                  <span className="text-[10px] text-muted-foreground">{bio.length}/160</span>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-medium text-muted-foreground">Location</label>
                  <div className="relative">
                    <MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="City, Country"
                      className="pl-10 h-12 rounded-xl bg-secondary/50 border-border/50"
                      maxLength={100}
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 2: Socials */}
          {step === 2 && (
            <motion.div key="step2" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} className="space-y-6">
              <div className="text-center">
                <h1 className="font-display text-2xl font-bold text-foreground">{steps[2].title}</h1>
                <p className="text-muted-foreground text-sm mt-1">{steps[2].subtitle}</p>
              </div>

              <div className="space-y-2.5">
                {socialConfig.map((s) => (
                  <div key={s.key} className="glass-card rounded-xl p-3 flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-lg bg-secondary flex items-center justify-center ${s.color}`}>
                      {s.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] text-muted-foreground font-medium mb-1">{s.label}</p>
                      <Input
                        value={socials[s.key]}
                        onChange={(e) => setSocials({ ...socials, [s.key]: e.target.value })}
                        placeholder={s.placeholder}
                        className="h-8 text-xs bg-background/50 border-border/30 rounded-lg"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Step 3: Reward */}
          {step === 3 && (
            <motion.div key="step3" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", delay: 0.2 }}
                className="w-24 h-24 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mx-auto"
              >
                <Sparkles size={40} className="text-primary" />
              </motion.div>

              <div>
                <h1 className="font-display text-2xl font-bold text-foreground">{steps[3].title}</h1>
                <p className="text-muted-foreground text-sm mt-1">Your hero profile is ready</p>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="glass-card rounded-2xl p-6 mx-auto max-w-[280px]"
              >
                <div className="flex items-center justify-center gap-2 mb-2">
                  <span className="text-3xl">🎁</span>
                </div>
                <p className="text-sm font-bold text-foreground">+100 HERO Points</p>
                <p className="text-xs text-muted-foreground mt-1">Sign-up bonus reward</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="flex items-center justify-center gap-4"
              >
                <div className="w-12 h-12 rounded-full overflow-hidden ring-2 ring-primary/30 bg-secondary flex items-center justify-center">
                  {avatarPreview ? (
                    <img src={avatarPreview} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-sm font-bold text-muted-foreground">{initials}</span>
                  )}
                </div>
                <div className="text-left">
                  <p className="font-bold text-foreground">{displayName}</p>
                  {location && <p className="text-xs text-muted-foreground">{location}</p>}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation */}
        <div className="mt-8 flex gap-3">
          {step > 0 && step < 3 && (
            <Button
              variant="outline"
              onClick={() => setStep(step - 1)}
              className="flex-1 h-12 rounded-xl border-border/50"
            >
              Back
            </Button>
          )}
          <Button
            onClick={nextStep}
            disabled={!canAdvance || saving}
            className="flex-1 h-12 rounded-xl bg-gradient-hero-glow text-primary-foreground font-bold text-base"
          >
            {saving ? (
              <span className="animate-pulse">Saving...</span>
            ) : step === 2 ? (
              <><Check size={16} className="mr-2" /> Finish Setup</>
            ) : step === 3 ? (
              <>Enter the App <ChevronRight size={16} className="ml-2" /></>
            ) : (
              <>Continue <ChevronRight size={16} className="ml-2" /></>
            )}
          </Button>
        </div>

        {/* Skip on socials step */}
        {step === 2 && (
          <button onClick={handleFinish} className="w-full text-center text-xs text-muted-foreground hover:text-foreground mt-3 transition-colors">
            Skip for now
          </button>
        )}
      </motion.div>
    </div>
  );
};

export default Onboarding;
