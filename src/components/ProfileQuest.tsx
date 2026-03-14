import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, Check, ChevronRight, Fingerprint, Globe, MapPin, Sparkles, Upload, User } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { getDeviceId } from "@/lib/profile";
import { toast } from "@/hooks/use-toast";
import confetti from "canvas-confetti";
import heroLogo from "@/assets/hero-logo-glow.png";

interface ProfileQuestProps {
  onComplete: () => void;
  currentStep: number;
  stats: {
    display_name: string;
    avatar_url: string;
    location: string;
  };
}

const STEPS = [
  { title: "Your Hero Identity", subtitle: "Choose your name & photo", emoji: "🦸", icon: User },
  { title: "Your City", subtitle: "Where do you make an impact?", emoji: "📍", icon: MapPin },
  { title: "Connect & Verify", subtitle: "Link a social to boost trust", emoji: "🔗", icon: Globe },
  { title: "First Micro-Quest", subtitle: "Do one small thing right now", emoji: "⚡", icon: Sparkles },
  { title: "Hero Pledge", subtitle: "Sign your commitment", emoji: "✍️", icon: Fingerprint },
];

const MICRO_QUESTS = [
  { title: "Take a deep breath outside", emoji: "🌬️", points: 25 },
  { title: "Smile at a stranger", emoji: "😊", points: 25 },
  { title: "Pick up one piece of litter", emoji: "🧹", points: 50 },
  { title: "Say thank you to someone", emoji: "🙏", points: 25 },
  { title: "Look at a tree for 10 seconds", emoji: "🌳", points: 25 },
];

const ProfileQuest = ({ onComplete, currentStep: initialStep, stats }: ProfileQuestProps) => {
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [step, setStep] = useState(initialStep);
  const [displayName, setDisplayName] = useState(stats.display_name !== "Hero" ? stats.display_name : "");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState(stats.avatar_url || "");
  const [location, setLocation] = useState(stats.location || "");
  const [socialHandle, setSocialHandle] = useState("");
  const [selectedMicroQuest, setSelectedMicroQuest] = useState<number | null>(null);
  const [microQuestDone, setMicroQuestDone] = useState(false);
  const [pledgeSigned, setPledgeSigned] = useState(false);
  const [saving, setSaving] = useState(false);

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

  const saveStep = useCallback(async (nextStep: number) => {
    if (saving) return;
    setSaving(true);
    try {
      const deviceId = getDeviceId();
      const updates: Record<string, any> = {
        device_id: deviceId,
        profile_quest_step: nextStep,
        updated_at: new Date().toISOString(),
      };

      if (step === 0) {
        updates.display_name = displayName.trim();
        // Upload avatar
        if (avatarFile && user) {
          const ext = avatarFile.name.split(".").pop();
          const path = `${user.id}/avatar.${ext}`;
          const { error } = await supabase.storage.from("avatars").upload(path, avatarFile, { upsert: true });
          if (!error) {
            const { data: { publicUrl } } = supabase.storage.from("avatars").getPublicUrl(path);
            updates.avatar_url = publicUrl;
          }
        }
      } else if (step === 1) {
        updates.location = location.trim();
      } else if (step === 2) {
        if (socialHandle.trim()) {
          updates.socials = { twitter: socialHandle.trim() };
        }
      } else if (step === 3) {
        // Award micro-quest points
        if (selectedMicroQuest !== null) {
          const quest = MICRO_QUESTS[selectedMicroQuest];
          await supabase.from("hero_points").insert({
            device_id: deviceId,
            amount: quest.points,
            reason: "first_micro_quest",
          });
          await supabase.from("completed_quests").insert({
            device_id: deviceId,
            quest_title: quest.title,
            quest_emoji: quest.emoji,
            points_awarded: quest.points,
            quest_category: "First Quest",
            user_id: user?.id,
          });
        }
      } else if (step === 4) {
        updates.hero_pledge_signed = true;
        updates.hero_pledge_signed_at = new Date().toISOString();
        updates.onboarding_completed = true;

        // Award pledge bonus
        await supabase.from("hero_points").insert({
          device_id: deviceId,
          amount: 100,
          reason: "hero_pledge_signed",
        });
      }

      await supabase.from("user_profiles").update(updates).eq("device_id", deviceId);

      if (nextStep >= STEPS.length) {
        // Fire celebration
        const end = Date.now() + 2000;
        const frame = () => {
          confetti({ particleCount: 4, angle: 60, spread: 55, origin: { x: 0, y: 0.7 }, colors: ["#22c55e", "#facc15", "#f97316"] });
          confetti({ particleCount: 4, angle: 120, spread: 55, origin: { x: 1, y: 0.7 }, colors: ["#22c55e", "#facc15", "#a855f7"] });
          if (Date.now() < end) requestAnimationFrame(frame);
        };
        frame();
        setTimeout(() => confetti({ particleCount: 120, spread: 100, origin: { y: 0.5 } }), 300);
        setTimeout(onComplete, 2500);
      } else {
        setStep(nextStep);
      }
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  }, [saving, step, displayName, avatarFile, location, socialHandle, selectedMicroQuest, user, onComplete]);

  const canAdvance = () => {
    if (step === 0) return displayName.trim().length >= 2;
    if (step === 1) return location.trim().length >= 2;
    if (step === 3) return selectedMicroQuest !== null && microQuestDone;
    if (step === 4) return pledgeSigned;
    return true;
  };

  const initials = displayName ? displayName.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2) : "?";

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass-card rounded-2xl p-5 relative overflow-hidden"
    >
      {/* Glow */}
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/10 blur-[60px] rounded-full" />

      {/* Progress dots */}
      <div className="flex gap-1.5 mb-5">
        {STEPS.map((_, i) => (
          <motion.div
            key={i}
            className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${
              i < step ? "bg-primary" : i === step ? "bg-primary/60" : "bg-border/30"
            }`}
            animate={i === step ? { opacity: [0.6, 1, 0.6] } : {}}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        ))}
      </div>

      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <motion.div
          className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-xl"
          animate={{ rotate: [0, 5, -5, 0] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          {STEPS[step]?.emoji}
        </motion.div>
        <div>
          <h3 className="font-display font-bold text-foreground text-sm">{STEPS[step]?.title}</h3>
          <p className="text-xs text-muted-foreground">{STEPS[step]?.subtitle}</p>
        </div>
        <div className="ml-auto text-[10px] font-bold text-primary bg-primary/10 px-2 py-1 rounded-full">
          {step + 1}/{STEPS.length}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {/* Step 0: Name + Avatar */}
        {step === 0 && (
          <motion.div key="s0" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
            <div className="flex justify-center">
              <button onClick={() => fileInputRef.current?.click()} className="relative group">
                <div className="w-20 h-20 rounded-full ring-3 ring-primary/30 overflow-hidden bg-secondary flex items-center justify-center">
                  {avatarPreview ? (
                    <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-xl font-bold text-muted-foreground">{initials}</span>
                  )}
                </div>
                <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-primary flex items-center justify-center">
                  <Camera size={12} className="text-primary-foreground" />
                </div>
              </button>
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleAvatarSelect} className="hidden" />
            </div>
            <Input
              value={displayName}
              onChange={e => setDisplayName(e.target.value.slice(0, 50))}
              placeholder="Your hero name..."
              className="text-center text-lg font-display"
              maxLength={50}
            />
          </motion.div>
        )}

        {/* Step 1: Location */}
        {step === 1 && (
          <motion.div key="s1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
            <div className="flex items-center gap-3 glass rounded-xl p-3">
              <MapPin size={20} className="text-primary shrink-0" />
              <Input
                value={location}
                onChange={e => setLocation(e.target.value.slice(0, 100))}
                placeholder="City or neighborhood..."
                className="border-0 bg-transparent p-0 h-auto focus-visible:ring-0"
                maxLength={100}
              />
            </div>
            <p className="text-xs text-muted-foreground text-center">
              Connect with heroes near you and compete on city leaderboards
            </p>
          </motion.div>
        )}

        {/* Step 2: Socials */}
        {step === 2 && (
          <motion.div key="s2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
            <div className="flex items-center gap-3 glass rounded-xl p-3">
              <Globe size={20} className="text-primary shrink-0" />
              <Input
                value={socialHandle}
                onChange={e => setSocialHandle(e.target.value.slice(0, 100))}
                placeholder="@your_handle (Twitter/X)"
                className="border-0 bg-transparent p-0 h-auto focus-visible:ring-0"
                maxLength={100}
              />
            </div>
            <p className="text-xs text-muted-foreground text-center">
              Linking socials boosts your Hero Trust Score 🛡️
            </p>
            <button
              onClick={() => saveStep(step + 1)}
              className="text-xs text-muted-foreground underline w-full text-center"
            >
              Skip for now
            </button>
          </motion.div>
        )}

        {/* Step 3: Micro Quest */}
        {step === 3 && (
          <motion.div key="s3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-3">
            <p className="text-xs text-muted-foreground text-center mb-2">Pick one and do it right now 👇</p>
            {MICRO_QUESTS.map((q, i) => (
              <motion.button
                key={i}
                onClick={() => { setSelectedMicroQuest(i); setMicroQuestDone(false); }}
                className={`w-full flex items-center gap-3 glass rounded-xl p-3 text-left transition-all ${
                  selectedMicroQuest === i ? "ring-2 ring-primary bg-primary/5" : "hover:bg-secondary/50"
                }`}
                whileTap={{ scale: 0.98 }}
              >
                <span className="text-xl">{q.emoji}</span>
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">{q.title}</p>
                  <p className="text-[10px] text-primary font-bold">+{q.points} HERO</p>
                </div>
                {selectedMicroQuest === i && (
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                    <Check size={16} className="text-primary" />
                  </motion.div>
                )}
              </motion.button>
            ))}
            {selectedMicroQuest !== null && !microQuestDone && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <Button
                  onClick={() => setMicroQuestDone(true)}
                  variant="outline"
                  className="w-full mt-2"
                >
                  ✅ I did it!
                </Button>
              </motion.div>
            )}
          </motion.div>
        )}

        {/* Step 4: Hero Pledge */}
        {step === 4 && (
          <motion.div key="s4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
            <div className="glass rounded-xl p-4 text-center space-y-3">
              <motion.div
                className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-primary/20 to-accent/10 flex items-center justify-center"
                animate={{ scale: [1, 1.08, 1], boxShadow: ["0 0 0px hsl(var(--primary) / 0.3)", "0 0 30px hsl(var(--primary) / 0.4)", "0 0 0px hsl(var(--primary) / 0.3)"] }}
                transition={{ duration: 2.5, repeat: Infinity }}
              >
                <Fingerprint size={28} className="text-primary" />
              </motion.div>
              <h4 className="font-display font-bold text-foreground">The Hero Pledge</h4>
              <p className="text-sm text-muted-foreground leading-relaxed italic">
                "I pledge to show up for my community — one small act at a time. I don't need superpowers. I just need to care."
              </p>
              <p className="text-[10px] text-muted-foreground/60">
                Your pledge is recorded and will be stored on-chain in the future 🔗
              </p>
            </div>
            <motion.button
              onClick={() => setPledgeSigned(true)}
              className={`w-full py-4 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${
                pledgeSigned
                  ? "bg-primary/20 text-primary border border-primary/30"
                  : "glass hover:bg-secondary/50 text-foreground"
              }`}
              whileTap={{ scale: 0.97 }}
            >
              <Fingerprint size={18} />
              {pledgeSigned ? "Pledge Signed ✓" : "Tap to Sign Your Pledge"}
            </motion.button>
            {pledgeSigned && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-xs text-primary text-center font-semibold"
              >
                +100 HERO points earned! 🎉
              </motion.p>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Next button */}
      {!(step === 2 && !socialHandle.trim()) && (
        <Button
          onClick={() => saveStep(step + 1)}
          disabled={!canAdvance() || saving}
          className="w-full mt-5 bg-gradient-hero-glow text-primary-foreground font-bold"
        >
          {saving ? (
            <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
          ) : step === STEPS.length - 1 ? (
            <>Start Your Journey <Sparkles size={16} /></>
          ) : (
            <>Continue <ChevronRight size={16} /></>
          )}
        </Button>
      )}
    </motion.div>
  );
};

export default ProfileQuest;
