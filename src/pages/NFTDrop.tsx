import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, Gift, Coins, Key, Box, Sparkles, QrCode, Send, Check, Copy } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { QRCodeSVG } from "qrcode.react";
import { createDrop, type DropType } from "@/lib/nft-drops";
import ogLogo from "@/assets/0g-logo.png";

const dropTypes = [
  { id: "token" as DropType, icon: <Coins size={20} />, label: "Token Drop", desc: "Send HERO tokens", color: "from-primary/20 to-primary/5", iconColor: "text-primary" },
  { id: "nft" as DropType, icon: <Gift size={20} />, label: "NFT Gift", desc: "Mint a Soulbound NFT", color: "from-hero-purple/20 to-hero-purple/5", iconColor: "text-hero-purple" },
  { id: "seed_phrase" as DropType, icon: <Key size={20} />, label: "Seed Phrase", desc: "Hide a wallet seed", color: "from-accent/20 to-accent/5", iconColor: "text-accent" },
  { id: "mystery_box" as DropType, icon: <Box size={20} />, label: "Mystery Box", desc: "Random reward inside", color: "from-hero-orange/20 to-hero-orange/5", iconColor: "text-hero-orange" },
];

const NFTDrop = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(0); // 0=type, 1=details, 2=creating, 3=done
  const [selectedType, setSelectedType] = useState<DropType | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");
  const [tokenAmount, setTokenAmount] = useState("50");
  const [qrCode, setQrCode] = useState("");
  const [copied, setCopied] = useState(false);

  const handleCreate = async () => {
    if (!selectedType || !title) return;
    setStep(2);

    const result = await createDrop({
      title,
      description,
      dropType: selectedType,
      content: content || `${tokenAmount} HERO tokens`,
      tokenAmount: parseInt(tokenAmount) || 50,
    });

    if (result.success && result.qrCode) {
      setQrCode(result.qrCode);
      setStep(3);
    } else {
      setStep(1);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(qrCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-background max-w-[430px] mx-auto px-5 pt-6 pb-24">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-xl glass flex items-center justify-center text-foreground">
          <ChevronLeft size={20} />
        </button>
        <div className="flex-1">
          <h1 className="font-display text-xl font-bold text-foreground">Drop NFT</h1>
          <p className="text-[10px] text-muted-foreground">Leave treasures for others to find</p>
        </div>
        <img src={ogLogo} alt="0G" className="w-8 h-8 opacity-60" />
      </div>

      {/* 0G Chain Badge */}
      <div className="flex items-center gap-2 mb-5 px-3 py-2 rounded-xl bg-primary/5 border border-primary/10">
        <img src={ogLogo} alt="0G Chain" className="w-5 h-5" />
        <span className="text-[10px] font-bold text-primary">Powered by 0G Chain</span>
        <span className="text-[9px] text-muted-foreground ml-auto">Testnet Ready</span>
      </div>

      <AnimatePresence mode="wait">
        {/* Step 0: Choose Type */}
        {step === 0 && (
          <motion.div key="type" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-3">
            <h2 className="font-display text-lg font-bold text-foreground mb-1">What are you dropping?</h2>
            <p className="text-xs text-muted-foreground mb-4">Choose what treasure you want to leave</p>
            {dropTypes.map((type) => (
              <button
                key={type.id}
                onClick={() => { setSelectedType(type.id); setStep(1); }}
                className="w-full glass-card-hover rounded-2xl p-4 flex items-center gap-4 transition-all active:scale-[0.98]"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${type.color} flex items-center justify-center ${type.iconColor} shrink-0`}>
                  {type.icon}
                </div>
                <div className="text-left flex-1">
                  <p className="font-bold text-sm text-foreground">{type.label}</p>
                  <p className="text-[11px] text-muted-foreground">{type.desc}</p>
                </div>
                <ChevronLeft size={16} className="text-muted-foreground rotate-180" />
              </button>
            ))}
          </motion.div>
        )}

        {/* Step 1: Details */}
        {step === 1 && (
          <motion.div key="details" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-4">
            <div>
              <h2 className="font-display text-lg font-bold text-foreground mb-1">Drop Details</h2>
              <p className="text-xs text-muted-foreground">Fill in the details for your {selectedType} drop</p>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-foreground mb-1 block">Title</label>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Hidden Treasure at the Park"
                  className="w-full h-12 px-4 rounded-xl bg-secondary text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-foreground mb-1 block">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Leave a clue or message..."
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl bg-secondary text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 resize-none"
                />
              </div>

              {selectedType === "token" && (
                <div>
                  <label className="text-xs font-bold text-foreground mb-1 block">Token Amount (HERO)</label>
                  <input
                    type="number"
                    value={tokenAmount}
                    onChange={(e) => setTokenAmount(e.target.value)}
                    className="w-full h-12 px-4 rounded-xl bg-secondary text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                  />
                </div>
              )}

              {selectedType === "seed_phrase" && (
                <div>
                  <label className="text-xs font-bold text-foreground mb-1 block">Seed Phrase / Private Key</label>
                  <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Enter the seed phrase to encrypt..."
                    rows={3}
                    className="w-full px-4 py-3 rounded-xl bg-secondary text-foreground placeholder:text-muted-foreground text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary/40 resize-none"
                  />
                  <p className="text-[9px] text-muted-foreground mt-1 flex items-center gap-1">
                    <Key size={8} /> Encrypted with AES-256 before storage
                  </p>
                </div>
              )}

              {selectedType === "nft" && (
                <div>
                  <label className="text-xs font-bold text-foreground mb-1 block">NFT Name</label>
                  <input
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="e.g. Hero's First Badge"
                    className="w-full h-12 px-4 rounded-xl bg-secondary text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                  />
                </div>
              )}
            </div>

            <div className="flex gap-3 pt-2">
              <button onClick={() => setStep(0)} className="flex-1 py-3.5 rounded-xl font-bold text-sm glass text-foreground">
                Back
              </button>
              <button
                onClick={handleCreate}
                disabled={!title}
                className={`flex-1 py-3.5 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${
                  title ? "bg-gradient-hero-glow text-primary-foreground active:scale-[0.98]" : "bg-secondary text-muted-foreground"
                }`}
              >
                <Send size={14} /> Create Drop
              </button>
            </div>
          </motion.div>
        )}

        {/* Step 2: Creating */}
        {step === 2 && (
          <motion.div key="creating" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-12 space-y-6">
            <div className="relative inline-block">
              <div className="absolute inset-0 bg-hero-green-glow/20 blur-[40px] rounded-full scale-150 animate-pulse" />
              <div className="w-20 h-20 rounded-3xl bg-gradient-hero-glow flex items-center justify-center relative z-10 mx-auto">
                <Gift size={36} className="text-primary-foreground animate-bounce" />
              </div>
            </div>
            <div>
              <h2 className="font-display text-xl font-bold text-foreground mb-1">Creating Drop...</h2>
              <p className="text-sm text-muted-foreground">Preparing on 0G Chain</p>
            </div>
            <img src={ogLogo} alt="0G" className="w-10 h-10 mx-auto opacity-40 animate-spin" style={{ animationDuration: "3s" }} />
          </motion.div>
        )}

        {/* Step 3: Done */}
        {step === 3 && (
          <motion.div key="done" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center space-y-5">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", bounce: 0.5 }}>
              <div className="w-16 h-16 rounded-3xl bg-gradient-hero-glow flex items-center justify-center mx-auto glow-green">
                <Check size={32} className="text-primary-foreground" />
              </div>
            </motion.div>

            <div>
              <h2 className="font-display text-xl font-bold text-gradient-hero mb-1">Drop Created!</h2>
              <p className="text-sm text-muted-foreground">Share the QR code for others to find</p>
            </div>

            {/* QR Code */}
            <div className="glass-card rounded-2xl p-6 inline-block mx-auto">
              <div className="bg-white rounded-xl p-4 mb-3">
                <QRCodeSVG
                  value={`HERO-DROP:${qrCode}`}
                  size={180}
                  level="H"
                  imageSettings={{
                    src: ogLogo,
                    height: 30,
                    width: 30,
                    excavate: true,
                  }}
                />
              </div>
              <div className="flex items-center justify-center gap-2">
                <span className="font-mono text-xs font-bold text-foreground">{qrCode}</span>
                <button onClick={handleCopy} className="w-7 h-7 rounded-lg glass flex items-center justify-center text-muted-foreground">
                  {copied ? <Check size={12} className="text-primary" /> : <Copy size={12} />}
                </button>
              </div>
            </div>

            {/* 0G Badge */}
            <div className="flex items-center justify-center gap-2 text-[10px] text-muted-foreground">
              <img src={ogLogo} alt="0G" className="w-4 h-4" />
              <span>Ready to deploy on 0G Chain · ERC-721</span>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => { setStep(0); setTitle(""); setDescription(""); setContent(""); setQrCode(""); }}
                className="flex-1 py-3.5 rounded-xl font-bold text-sm glass text-foreground"
              >
                Create Another
              </button>
              <button
                onClick={() => navigate("/app")}
                className="flex-1 py-3.5 rounded-xl font-bold text-sm bg-gradient-hero-glow text-primary-foreground active:scale-[0.98]"
              >
                Done
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NFTDrop;
