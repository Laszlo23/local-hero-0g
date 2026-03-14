import { useState } from "react";
import { motion } from "framer-motion";
import { QRCodeSVG } from "qrcode.react";
import { MapPin, Sparkles, Plus, ChevronLeft, Copy, Share2, Download, Zap, TreePine, Heart, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";

const questTypes = [
  { id: "cleanup", label: "Cleanup", emoji: "🧹", color: "from-cyan-500/20 to-blue-500/20", iconColor: "text-cyan-400" },
  { id: "plant", label: "Plant", emoji: "🌳", color: "from-emerald-500/20 to-lime-500/20", iconColor: "text-emerald-400" },
  { id: "help", label: "Help", emoji: "🤝", color: "from-rose-500/20 to-amber-500/20", iconColor: "text-rose-400" },
  { id: "teach", label: "Teach", emoji: "📚", color: "from-purple-500/20 to-pink-500/20", iconColor: "text-purple-400" },
];

const CreateQR = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(0); // 0=type, 1=details, 2=fund, 3=generated
  const [questType, setQuestType] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [reward, setReward] = useState("50");
  const [carbonCredits, setCarbonCredits] = useState("1");
  const [copied, setCopied] = useState(false);

  const mockQRData = `hero://quest/${questType}/${Date.now()}`;
  const selectedType = questTypes.find((t) => t.id === questType);

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="px-5 pt-12 pb-8 space-y-5">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button onClick={() => step > 0 ? setStep(step - 1) : navigate("/app")} className="w-9 h-9 rounded-xl glass flex items-center justify-center text-foreground">
          <ChevronLeft size={18} />
        </button>
        <div>
          <h1 className="font-display text-xl font-bold text-foreground">Create Quest QR</h1>
          <p className="text-xs text-muted-foreground">Generate a QR code for your quest or geodrop</p>
        </div>
      </div>

      {/* Progress */}
      <div className="flex gap-2">
        {["Type", "Details", "Fund", "QR Code"].map((s, i) => (
          <div key={s} className="flex-1">
            <div className={`h-1.5 rounded-full transition-all ${i <= step ? "bg-gradient-hero-glow glow-green" : "bg-secondary"}`} />
            <p className={`text-[9px] font-semibold mt-1 ${i <= step ? "text-primary" : "text-muted-foreground"}`}>{s}</p>
          </div>
        ))}
      </div>

      {/* Step 0: Quest Type */}
      {step === 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
          <p className="text-sm font-semibold text-foreground">What kind of quest?</p>
          <div className="grid grid-cols-2 gap-3">
            {questTypes.map((t) => (
              <button
                key={t.id}
                onClick={() => { setQuestType(t.id); setStep(1); }}
                className={`glass-card-hover rounded-2xl p-5 text-center transition-all active:scale-[0.97] ${questType === t.id ? "border-primary/50" : ""}`}
              >
                <span className="text-3xl block mb-2">{t.emoji}</span>
                <p className="font-bold text-sm text-foreground">{t.label}</p>
              </button>
            ))}
          </div>
          <div className="glass-card rounded-2xl p-4">
            <p className="text-xs text-muted-foreground">
              <span className="text-primary font-semibold">GeoDrops:</span> Place QR codes at physical locations. Anyone who scans them completes the quest and earns rewards.
            </p>
          </div>
        </motion.div>
      )}

      {/* Step 1: Details */}
      {step === 1 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">Quest Title</label>
            <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder={`e.g. ${selectedType?.label} at Central Park`} className="w-full h-12 px-4 glass rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30" />
          </div>
          <div>
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">Location</label>
            <div className="relative">
              <MapPin size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Search or drop a pin..." className="w-full h-12 pl-10 pr-4 glass rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30" />
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">HERO Reward</label>
            <div className="flex gap-2">
              {["25", "50", "100", "250"].map((v) => (
                <button key={v} onClick={() => setReward(v)} className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${reward === v ? "bg-gradient-hero-glow text-primary-foreground glow-green" : "glass text-muted-foreground"}`}>
                  {v}
                </button>
              ))}
            </div>
          </div>
          <button onClick={() => setStep(2)} disabled={!title} className={`w-full py-3.5 rounded-xl font-bold text-sm transition-all ${title ? "bg-gradient-hero-glow text-primary-foreground glow-green active:scale-[0.98]" : "bg-secondary text-muted-foreground"}`}>
            Next: Fund Quest
          </button>
        </motion.div>
      )}

      {/* Step 2: Fund with Carbon Credits */}
      {step === 2 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
          <div className="glass-card rounded-2xl p-5 relative overflow-hidden">
            <div className="absolute -top-8 right-0 w-32 h-32 bg-hero-green-glow/10 blur-[40px] rounded-full" />
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-3">
                <TreePine size={16} className="text-primary" />
                <span className="text-xs font-bold text-primary uppercase tracking-wider">Carbon Credit Funding</span>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Your carbon credits fund this quest. They're converted to green BTC mining hashrate, and mining rewards flow back to quest completers.
              </p>
              <div>
                <label className="text-xs font-semibold text-muted-foreground mb-2 block">Credits to Allocate</label>
                <div className="flex gap-2">
                  {["1", "5", "10", "25"].map((v) => (
                    <button key={v} onClick={() => setCarbonCredits(v)} className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${carbonCredits === v ? "bg-gradient-hero-glow text-primary-foreground" : "glass text-muted-foreground"}`}>
                      {v}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Summary */}
          <div className="glass-card rounded-2xl p-4 space-y-2.5">
            <div className="flex justify-between text-sm"><span className="text-muted-foreground">Quest</span><span className="font-semibold text-foreground">{title || "Untitled"}</span></div>
            <div className="flex justify-between text-sm"><span className="text-muted-foreground">Type</span><span className="font-semibold text-foreground">{selectedType?.emoji} {selectedType?.label}</span></div>
            <div className="flex justify-between text-sm"><span className="text-muted-foreground">Reward</span><span className="font-bold text-primary">+{reward} HERO</span></div>
            <div className="flex justify-between text-sm"><span className="text-muted-foreground">Carbon Credits</span><span className="font-bold text-hero-yellow">{carbonCredits} CC</span></div>
            <div className="border-t border-border/50 pt-2.5 flex justify-between text-sm">
              <span className="text-muted-foreground">Est. BTC Yield</span>
              <span className="font-bold text-hero-orange">~{(Number(carbonCredits) * 0.00012).toFixed(5)} BTC</span>
            </div>
          </div>

          <button onClick={() => setStep(3)} className="w-full py-3.5 rounded-xl font-bold text-sm bg-gradient-hero-glow text-primary-foreground glow-green active:scale-[0.98] transition-all flex items-center justify-center gap-2">
            <Zap size={16} /> Generate QR Code
          </button>
        </motion.div>
      )}

      {/* Step 3: Generated QR */}
      {step === 3 && (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-5">
          <div className="glass-card rounded-3xl p-6 text-center relative overflow-hidden">
            <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-48 h-48 bg-hero-green-glow/15 blur-[60px] rounded-full" />
            <div className="relative z-10">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-bold mb-4">
                <Check size={10} /> Quest Created on 0G Chain
              </div>
              <div className="bg-white rounded-2xl p-4 inline-block mb-4">
                <QRCodeSVG
                  value={mockQRData}
                  size={200}
                  level="H"
                  fgColor="#0f1a14"
                  imageSettings={{
                    src: "",
                    height: 0,
                    width: 0,
                    excavate: false,
                  }}
                />
              </div>
              <h3 className="font-display text-lg font-bold text-foreground mb-1">{title || "Quest"}</h3>
              <p className="text-xs text-muted-foreground mb-4">{selectedType?.emoji} {selectedType?.label} · +{reward} HERO · {carbonCredits} CC</p>

              <div className="flex gap-2">
                <button onClick={handleCopy} className="flex-1 py-3 rounded-xl font-bold text-sm glass flex items-center justify-center gap-2 text-foreground active:scale-[0.98] transition-all">
                  {copied ? <><Check size={14} /> Copied!</> : <><Copy size={14} /> Copy Link</>}
                </button>
                <button className="flex-1 py-3 rounded-xl font-bold text-sm bg-gradient-hero-glow text-primary-foreground glow-green flex items-center justify-center gap-2 active:scale-[0.98] transition-all">
                  <Share2 size={14} /> Share
                </button>
              </div>
            </div>
          </div>

          <div className="glass-card rounded-xl p-4">
            <p className="text-xs text-muted-foreground">
              <span className="text-primary font-semibold">Tip:</span> Print this QR code and place it at the quest location. Anyone who scans it can start the quest and earn {reward} HERO + their share of BTC mining rewards.
            </p>
          </div>

          <button onClick={() => { setStep(0); setTitle(""); setLocation(""); setQuestType(null); }} className="w-full py-3 rounded-xl font-bold text-sm glass text-foreground flex items-center justify-center gap-2">
            <Plus size={16} /> Create Another Quest
          </button>
        </motion.div>
      )}
    </div>
  );
};

export default CreateQR;
