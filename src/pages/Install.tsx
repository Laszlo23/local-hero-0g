import { useState, useEffect } from "react";
import { Download, Share, Smartphone, Check, ArrowRight, Shield, Zap, Trophy } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const Install = () => {
  const navigate = useNavigate();
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [installed, setInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    const ios = /iPad|iPhone|iPod/.test(navigator.userAgent);
    setIsIOS(ios);
    setIsStandalone(window.matchMedia("(display-mode: standalone)").matches);

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };
    window.addEventListener("beforeinstallprompt", handler);
    window.addEventListener("appinstalled", () => setInstalled(true));
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") setInstalled(true);
    setDeferredPrompt(null);
  };

  if (isStandalone) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-6">
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center">
          <div className="text-5xl mb-4">✅</div>
          <h1 className="font-display text-2xl font-bold text-foreground mb-2">Already Installed!</h1>
          <p className="text-muted-foreground text-sm mb-6">HERO is running as your app.</p>
          <button onClick={() => navigate("/app")} className="px-6 py-3 rounded-xl font-bold text-sm bg-gradient-hero-glow text-primary-foreground glow-green">
            Open App <ArrowRight size={16} className="inline ml-1" />
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background max-w-[430px] mx-auto px-6 pt-16 pb-12 space-y-8">
      {/* Hero */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
        <div className="relative inline-block mb-6">
          <div className="absolute inset-0 bg-hero-green-glow/30 blur-[40px] rounded-full scale-150" />
          <img src="/pwa-192x192.png" alt="HERO App" className="w-24 h-24 rounded-3xl relative z-10 shadow-2xl" />
        </div>
        <h1 className="font-display text-3xl font-bold text-gradient-hero mb-2">Install HERO</h1>
        <p className="text-muted-foreground text-sm">Add to your home screen for the full experience</p>
      </motion.div>

      {/* Features */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { icon: <Zap size={20} />, label: "Instant", sub: "Load" },
          { icon: <Shield size={20} />, label: "Works", sub: "Offline" },
          { icon: <Trophy size={20} />, label: "Full", sub: "Screen" },
        ].map((f, i) => (
          <motion.div
            key={f.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + i * 0.1 }}
            className="glass-card rounded-2xl p-4 text-center"
          >
            <div className="w-10 h-10 rounded-xl bg-hero-green-light flex items-center justify-center text-primary mx-auto mb-2">
              {f.icon}
            </div>
            <p className="text-xs font-bold text-foreground">{f.label}</p>
            <p className="text-[10px] text-muted-foreground">{f.sub}</p>
          </motion.div>
        ))}
      </div>

      {/* Install CTA */}
      {installed ? (
        <div className="glass-card rounded-2xl p-6 text-center">
          <Check size={32} className="text-primary mx-auto mb-2" />
          <h2 className="font-display text-xl font-bold text-foreground mb-1">Installed!</h2>
          <p className="text-sm text-muted-foreground mb-4">Find HERO on your home screen</p>
          <button onClick={() => navigate("/app")} className="w-full py-3.5 rounded-xl font-bold text-sm bg-gradient-hero-glow text-primary-foreground glow-green">
            Open App
          </button>
        </div>
      ) : deferredPrompt ? (
        <motion.button
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          onClick={handleInstall}
          className="w-full py-4 rounded-2xl font-bold text-base bg-gradient-hero-glow text-primary-foreground glow-green active:scale-[0.98] transition-all flex items-center justify-center gap-2"
        >
          <Download size={20} />
          Install HERO App
        </motion.button>
      ) : isIOS ? (
        <div className="glass-card rounded-2xl p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-hero-green-light flex items-center justify-center">
              <Smartphone size={20} className="text-primary" />
            </div>
            <h2 className="font-display text-lg font-bold text-foreground">Install on iPhone</h2>
          </div>
          <div className="space-y-3">
            {[
              { step: "1", text: "Tap the Share button", icon: <Share size={14} /> },
              { step: "2", text: "Scroll down and tap \"Add to Home Screen\"", icon: <Download size={14} /> },
              { step: "3", text: "Tap \"Add\" to confirm", icon: <Check size={14} /> },
            ].map((s) => (
              <div key={s.step} className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-lg bg-primary/20 flex items-center justify-center text-primary shrink-0">
                  <span className="text-xs font-bold">{s.step}</span>
                </div>
                <span className="text-sm text-foreground flex items-center gap-2">{s.text} {s.icon}</span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="glass-card rounded-2xl p-6 text-center">
          <Smartphone size={32} className="text-primary mx-auto mb-3" />
          <h2 className="font-display text-lg font-bold text-foreground mb-2">Install from Browser Menu</h2>
          <p className="text-sm text-muted-foreground">Open your browser menu and tap "Install app" or "Add to Home Screen"</p>
        </div>
      )}

      {/* Skip */}
      <button onClick={() => navigate("/app")} className="w-full text-center text-sm text-muted-foreground hover:text-foreground transition-colors">
        Continue in browser →
      </button>
    </div>
  );
};

export default Install;
