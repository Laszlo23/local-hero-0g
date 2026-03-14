import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Download, Share2, Twitter, Instagram, Copy, Check } from "lucide-react";
import { generateMilestoneCard, downloadCard, shareCard, type MilestoneCardData } from "@/lib/milestone-card";
import { toast } from "sonner";

interface ShareMilestoneModalProps {
  open: boolean;
  onClose: () => void;
  data: MilestoneCardData;
}

const ShareMilestoneModal = ({ open, onClose, data }: ShareMilestoneModalProps) => {
  const [cardBlob, setCardBlob] = useState<Blob | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!open) return;
    setGenerating(true);
    generateMilestoneCard(data).then((blob) => {
      setCardBlob(blob);
      setPreviewUrl(URL.createObjectURL(blob));
      setGenerating(false);
    });
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [open, data]);

  const handleDownload = () => {
    if (!cardBlob) return;
    downloadCard(cardBlob, `hero-${data.type}.png`);
    toast.success("Card downloaded!");
  };

  const handleShare = async () => {
    if (!cardBlob) return;
    await shareCard(cardBlob, data);
    toast.success("Shared!");
  };

  const handleTwitter = () => {
    const text = encodeURIComponent(
      `I just ${data.type === "quest_complete" ? "completed a quest" : data.type === "level_up" ? "leveled up" : data.type === "streak" ? "hit a streak" : "earned an achievement"} on LOCAL HERO! 🦸‍♂️\n\nFollow @0gLocalHero\n#LocalHero #0GChain\n\nhttps://localhero.space`
    );
    window.open(`https://twitter.com/intent/tweet?text=${text}`, "_blank");
  };

  const handleCopyLink = async () => {
    await navigator.clipboard.writeText(
      `Check out my HERO achievement! 🦸‍♂️ https://localhero.space\n\nFollow @0gLocalHero\n#LocalHero #0GChain`
    );
    setCopied(true);
    toast.success("Copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  if (!open) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: "spring", duration: 0.5 }}
          className="w-full max-w-md glass-card rounded-2xl p-5 space-y-4"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between">
            <h3 className="font-display text-lg font-bold text-foreground">Share Achievement</h3>
            <button onClick={onClose} className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
              <X size={16} />
            </button>
          </div>

          {/* Preview */}
          <div className="rounded-xl overflow-hidden border border-border/50">
            {generating ? (
              <div className="aspect-[1200/630] bg-secondary flex items-center justify-center">
                <div className="flex flex-col items-center gap-2">
                  <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                  <span className="text-xs text-muted-foreground">Generating card...</span>
                </div>
              </div>
            ) : previewUrl ? (
              <img src={previewUrl} alt="Milestone card" className="w-full aspect-[1200/630] object-cover" />
            ) : null}
          </div>

          {/* Share buttons */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handleShare}
              className="flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-hero-glow text-primary-foreground font-bold text-sm active:scale-[0.98] transition-transform"
            >
              <Share2 size={16} /> Share
            </button>
            <button
              onClick={handleDownload}
              className="flex items-center justify-center gap-2 py-3 rounded-xl bg-secondary text-foreground font-bold text-sm active:scale-[0.98] transition-transform"
            >
              <Download size={16} /> Download
            </button>
          </div>

          {/* Social links */}
          <div className="flex gap-2">
            <button
              onClick={handleTwitter}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-secondary text-foreground text-sm font-semibold active:scale-[0.98] transition-transform"
            >
              <Twitter size={14} /> Twitter / X
            </button>
            <button
              onClick={handleCopyLink}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-secondary text-foreground text-sm font-semibold active:scale-[0.98] transition-transform"
            >
              {copied ? <Check size={14} className="text-primary" /> : <Copy size={14} />}
              {copied ? "Copied!" : "Copy Link"}
            </button>
          </div>

          <p className="text-[10px] text-muted-foreground text-center">
            Download the card and attach it to your post for maximum impact ✨
          </p>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ShareMilestoneModal;
