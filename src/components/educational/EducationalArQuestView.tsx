import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  ChevronLeft,
  Focus,
  QrCode,
  Scan,
  X,
  Zap,
  BookOpen,
  GraduationCap,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import arOverlay from "@/assets/ar-overlay.png";
import arChest from "@/assets/ar-chest.png";
import arTree from "@/assets/ar-tree.png";
import arBook from "@/assets/ar-book.png";
import { awardPoints } from "@/lib/points";
import { getDeviceId } from "@/lib/profile";
import {
  fetchEducationalProgress,
  fetchEducationalQuestWithSteps,
  upsertEducationalProgress,
  type EducationalQuest,
  type EducationalQuestStep,
} from "@/lib/educationalQuests";
import { toast } from "@/hooks/use-toast";

const AR_IMG: Record<string, string> = {
  tree: arTree,
  book: arBook,
  chest: arChest,
  leaf: arTree,
  water: arOverlay,
  recycle: arChest,
};

type Props = { slug: string };

export function EducationalArQuestView({ slug }: Props) {
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [loading, setLoading] = useState(true);
  const [quest, setQuest] = useState<EducationalQuest | null>(null);
  const [steps, setSteps] = useState<EducationalQuestStep[]>([]);
  const [completed, setCompleted] = useState<number[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [finished, setFinished] = useState(false);
  const [qrMode, setQrMode] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [selectedAr, setSelectedAr] = useState(false);

  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment", width: { ideal: 1280 }, height: { ideal: 720 } },
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setCameraActive(true);
      }
    } catch {
      setCameraError(true);
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (videoRef.current?.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach((t) => t.stop());
      videoRef.current.srcObject = null;
      setCameraActive(false);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      const pack = await fetchEducationalQuestWithSteps(slug);
      if (cancelled) return;
      if (!pack || pack.steps.length === 0) {
        setQuest(null);
        setLoading(false);
        toast({ title: "Quest not found", description: "Check the link or try another from Schools.", variant: "destructive" });
        return;
      }
      setQuest(pack.quest);
      setSteps(pack.steps);
      const deviceId = getDeviceId();
      const prog = await fetchEducationalProgress(deviceId, pack.quest.id);
      if (cancelled) return;
      const done = prog?.completed_step_indices ?? [];
      setCompleted(done);
      if (prog?.completed_at) {
        setFinished(true);
        setActiveIndex(pack.steps.length);
      } else {
        const next = pack.steps.findIndex((_, i) => !done.includes(i));
        setActiveIndex(next === -1 ? pack.steps.length : next);
        if (next === -1) setFinished(true);
      }
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [slug]);

  useEffect(() => {
    if (qrMode || loading || finished) return;
    void startCamera();
    return () => stopCamera();
  }, [qrMode, loading, finished, startCamera, stopCamera]);

  const step = activeIndex < steps.length ? steps[activeIndex] : null;

  useEffect(() => {
    if (!step) return;
    if (step.evidence_type === "qr_scan") setQrMode(true);
    else setQrMode(false);
  }, [step?.evidence_type, step?.step_index]);

  const persistProgress = async (nextCompleted: number[], nextActive: number, completedAt: string | null) => {
    if (!quest) return;
    await upsertEducationalProgress({
      device_id: getDeviceId(),
      quest_id: quest.id,
      current_step_index: nextActive,
      completed_step_indices: nextCompleted,
      completed_at: completedAt,
    });
  };

  const advanceAfterStep = async (stepIndex: number, st: EducationalQuestStep) => {
    if (!quest) return;
    if (completed.includes(stepIndex)) return;
    const pts = st.points_override ?? quest.points_per_step;
    await awardPoints(pts, `Class quest: ${quest.title} · ${st.title}`);
    const nextCompleted = [...new Set([...completed, stepIndex])].sort((a, b) => a - b);
    setCompleted(nextCompleted);
    const isLast = stepIndex >= steps.length - 1;
    if (isLast) {
      await awardPoints(quest.bonus_complete, `Class quest complete: ${quest.title}`);
      await persistProgress(nextCompleted, steps.length, new Date().toISOString());
      setFinished(true);
      setActiveIndex(steps.length);
      toast({ title: "Quest complete!", description: `+${quest.bonus_complete} bonus HERO` });
    } else {
      const next = stepIndex + 1;
      setActiveIndex(next);
      await persistProgress(nextCompleted, next, null);
    }
    setSelectedAr(false);
  };

  const onTapArMarker = async () => {
    if (!step || !quest) return;
    if (step.evidence_type !== "none" && step.evidence_type !== "photo") return;
    await advanceAfterStep(step.step_index, step);
  };

  const onFieldComplete = async () => {
    if (!step || !quest) return;
    if (step.evidence_type !== "field_observation") return;
    await advanceAfterStep(step.step_index, step);
  };

  const onQuizSubmit = async (choice: "a" | "b") => {
    if (!step || !quest || step.evidence_type !== "quiz") return;
    if (choice !== step.quiz_correct) {
      toast({ title: "Not quite", description: "Try the other answer — or ask your teacher.", variant: "destructive" });
      return;
    }
    await advanceAfterStep(step.step_index, step);
  };

  const handleQrResult = async (text: string) => {
    if (!step || step.evidence_type !== "qr_scan" || !step.qr_expected) return;
    const expected = step.qr_expected.trim();
    if (text.trim() !== expected) {
      toast({ title: "Different QR", description: "Ask your teacher for the class checkpoint code.", variant: "destructive" });
      return;
    }
    await advanceAfterStep(step.step_index, step);
    setQrMode(false);
  };

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex max-w-[430px] flex-col items-center justify-center bg-background mx-auto">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        <p className="mt-4 text-sm text-muted-foreground">Loading class quest…</p>
      </div>
    );
  }

  if (!quest) {
    return (
      <div className="fixed inset-0 z-50 flex max-w-[430px] flex-col items-center justify-center gap-4 bg-background px-6 mx-auto">
        <p className="text-center text-muted-foreground">This educational quest is not available.</p>
        <button
          type="button"
          onClick={() => navigate("/app/schools")}
          className="rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground"
        >
          Back to Schools
        </button>
      </div>
    );
  }

  if (finished) {
    return (
      <div className="fixed inset-0 z-50 flex max-w-[430px] flex-col items-center justify-center bg-background/95 px-6 text-center mx-auto">
        <GraduationCap className="mb-4 h-16 w-16 text-primary" />
        <h2 className="font-display text-2xl font-bold text-gradient-hero">Great work!</h2>
        <p className="mt-2 text-sm text-muted-foreground">You finished “{quest.title}”.</p>
        <div className="mt-8 flex w-full max-w-xs flex-col gap-2">
          <button
            type="button"
            onClick={() => navigate("/app/schools")}
            className="rounded-xl bg-gradient-hero-glow py-3 text-sm font-bold text-primary-foreground"
          >
            More class quests
          </button>
          <button type="button" onClick={() => navigate("/app")} className="rounded-xl glass py-3 text-sm font-medium">
            Home
          </button>
        </div>
      </div>
    );
  }

  const showArMarker =
    step &&
    (step.evidence_type === "none" || step.evidence_type === "photo") &&
    !qrMode;

  const arImg = step ? AR_IMG[step.ar_visual] ?? arTree : arTree;

  return (
    <div className="fixed inset-0 z-50 max-w-[430px] mx-auto bg-background">
      {!qrMode && (
        <video ref={videoRef} autoPlay playsInline muted className="absolute inset-0 h-full w-full object-cover" />
      )}
      {qrMode && <QrScannerView onResult={(t) => void handleQrResult(t)} />}

      {!qrMode && !cameraActive && (
        <div className="absolute inset-0 bg-gradient-to-br from-[hsl(160_20%_8%)] via-[hsl(200_15%_12%)] to-[hsl(160_10%_6%)]">
          {cameraError && (
            <div className="flex h-full items-center justify-center px-6">
              <p className="text-center text-sm text-muted-foreground">Camera access helps with AR markers. You can still read steps below.</p>
            </div>
          )}
        </div>
      )}

      {!qrMode && cameraActive && <div className="absolute inset-0 bg-background/30" />}
      {!qrMode && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-20">
          <img src={arOverlay} alt="" className="h-80 w-80 object-contain" style={{ animation: "glow-pulse 3s ease-in-out infinite" }} />
        </div>
      )}

      <div className="pointer-events-none absolute inset-4">
        <div className={`absolute left-0 top-0 h-8 w-8 rounded-tl-lg border-l-2 border-t-2 ${qrMode ? "border-accent/60" : "border-primary/60"}`} />
        <div className={`absolute right-0 top-0 h-8 w-8 rounded-tr-lg border-r-2 border-t-2 ${qrMode ? "border-accent/60" : "border-primary/60"}`} />
        <div className={`absolute bottom-0 left-0 h-8 w-8 rounded-bl-lg border-b-2 border-l-2 ${qrMode ? "border-accent/60" : "border-primary/60"}`} />
        <div className={`absolute bottom-0 right-0 h-8 w-8 rounded-br-lg border-b-2 border-r-2 ${qrMode ? "border-accent/60" : "border-primary/60"}`} />
      </div>

      <div className="absolute left-0 right-0 top-0 z-20 p-4">
        <div className="flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={() => navigate("/app/schools")}
            className="flex h-10 w-10 items-center justify-center rounded-xl glass text-foreground"
          >
            <ChevronLeft size={20} />
          </button>
          <div className="glass max-w-[200px] rounded-full px-3 py-2">
            <p className="truncate text-center text-[10px] font-bold uppercase tracking-wide text-primary">Class quest</p>
            <p className="truncate text-center text-xs font-semibold text-foreground">{quest.title}</p>
          </div>
          <button
            type="button"
            onClick={() => setQrMode(!qrMode)}
            className={`flex h-10 w-10 items-center justify-center rounded-xl glass ${qrMode ? "text-accent" : "text-foreground"}`}
          >
            {qrMode ? <Focus size={20} /> : <QrCode size={20} />}
          </button>
        </div>
      </div>

      {showArMarker && step && (
        <button
          type="button"
          onClick={() => setSelectedAr(true)}
          className="absolute z-10"
          style={{
            left: `${Number(step.ar_x)}%`,
            top: `${Number(step.ar_y)}%`,
            transform: "translate(-50%, -50%)",
            animation: `float ${3 + (step.step_index % 3)}s ease-in-out infinite`,
          }}
        >
          <div className="relative">
            <div className="absolute inset-0 scale-150 rounded-full bg-hero-green-glow/20 blur-[20px]" />
            <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl border border-primary/30 bg-background/40 backdrop-blur-sm">
              <span className="text-3xl drop-shadow-lg">{step.ar_emoji}</span>
            </div>
            <img src={arImg} alt="" className="pointer-events-none absolute inset-1 h-14 w-14 object-contain opacity-40" />
          </div>
        </button>
      )}

      <div className="absolute bottom-0 left-0 right-0 z-20 space-y-3 p-4">
        <div className="glass-card flex items-start gap-3 rounded-2xl p-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-hero-purple/15">
            <BookOpen size={18} className="text-hero-purple" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-bold uppercase text-muted-foreground">
              Step {activeIndex + 1} / {steps.length}
            </p>
            <p className="font-display text-sm font-bold text-foreground">{step?.title}</p>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{step?.instruction}</p>
          </div>
        </div>

        {step?.evidence_type === "field_observation" && (
          <button
            type="button"
            onClick={() => void onFieldComplete()}
            className="w-full rounded-2xl bg-gradient-hero-glow py-3.5 font-display text-sm font-bold text-primary-foreground"
          >
            Mark step complete
          </button>
        )}

        {step?.evidence_type === "quiz" && step.quiz_prompt && (
          <div className="glass-card space-y-2 rounded-2xl p-4">
            <p className="text-sm font-semibold text-foreground">{step.quiz_prompt}</p>
            <div className="grid gap-2">
              <button
                type="button"
                onClick={() => void onQuizSubmit("a")}
                className="rounded-xl border border-border bg-background/60 px-3 py-2.5 text-left text-xs"
              >
                A) {step.quiz_option_a}
              </button>
              <button
                type="button"
                onClick={() => void onQuizSubmit("b")}
                className="rounded-xl border border-border bg-background/60 px-3 py-2.5 text-left text-xs"
              >
                B) {step.quiz_option_b}
              </button>
            </div>
          </div>
        )}

        {step?.evidence_type === "qr_scan" && (
          <p className="text-center text-[11px] text-muted-foreground">
            QR mode on — scan the teacher’s code ({step.qr_expected?.slice(0, 24)}…)
          </p>
        )}

        {!qrMode && step?.evidence_type !== "quiz" && step?.evidence_type !== "field_observation" && (
          <button
            type="button"
            onClick={() => {
              setScanning(true);
              setTimeout(() => setScanning(false), 1500);
            }}
            className={`flex w-full items-center justify-center gap-2 rounded-2xl py-3.5 text-sm font-bold transition-all ${
              scanning ? "glass text-primary" : "bg-gradient-hero-glow text-primary-foreground glow-green"
            }`}
          >
            <Scan size={18} className={scanning ? "animate-spin" : ""} />
            {scanning ? "Scanning…" : "Scan environment"}
          </button>
        )}
      </div>

      <AnimatePresence>
        {selectedAr && step && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-30 flex items-end justify-center bg-background/60 backdrop-blur-sm"
            onClick={() => setSelectedAr(false)}
          >
            <motion.div
              initial={{ y: 80, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 80, opacity: 0 }}
              className="w-full p-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="glass-card relative overflow-hidden rounded-3xl p-6">
                <button
                  type="button"
                  onClick={() => setSelectedAr(false)}
                  className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-lg glass text-muted-foreground"
                >
                  <X size={16} />
                </button>
                <div className="mb-4 flex items-center gap-3">
                  <span className="text-4xl">{step.ar_emoji}</span>
                  <div>
                    <p className="text-[10px] font-semibold uppercase text-primary">Outdoor / AR</p>
                    <h3 className="font-display text-lg font-bold text-foreground">{step.title}</h3>
                    <div className="mt-1 flex items-center gap-1">
                      <Zap size={12} className="text-accent" />
                      <span className="text-sm font-bold text-accent">
                        +{step.points_override ?? quest.points_per_step} HERO
                      </span>
                    </div>
                  </div>
                </div>
                <p className="mb-5 text-sm text-muted-foreground">{step.instruction}</p>
                <button
                  type="button"
                  onClick={() => void onTapArMarker()}
                  className="w-full rounded-xl bg-gradient-hero-glow py-3.5 text-sm font-bold text-primary-foreground"
                >
                  Complete this step
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const QrScannerView = ({ onResult }: { onResult: (text: string) => void }) => {
  const [Scanner, setScanner] = useState<React.ComponentType<{ onScan: (r: unknown) => void; styles?: unknown }> | null>(
    null
  );

  useEffect(() => {
    import("@yudiel/react-qr-scanner").then((mod) => {
      setScanner(() => mod.Scanner as React.ComponentType<{ onScan: (r: unknown) => void; styles?: unknown }>);
    });
  }, []);

  if (!Scanner) {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-background">
        <QrCode size={32} className="animate-pulse text-accent" />
      </div>
    );
  }

  return (
    <div className="absolute inset-0">
      <Scanner
        onScan={(result: unknown) => {
          const r = result as { rawValue?: string }[];
          if (r?.[0]?.rawValue) onResult(r[0].rawValue);
        }}
        styles={{ container: { width: "100%", height: "100%" } }}
      />
    </div>
  );
};
