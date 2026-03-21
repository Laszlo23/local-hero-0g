import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Leaf,
  MapPin,
  MessageSquare,
  Send,
  Shield,
  Sparkles,
  Users,
  Loader2,
} from "lucide-react";
import heroLogo from "@/assets/hero-logo-glow.png";
import { SiteMarketingFooter } from "@/components/SiteMarketingFooter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { submitCommunitySignal, HttpError, type CommunitySignalCategory } from "@/lib/api";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const CATEGORY_OPTIONS: { value: CommunitySignalCategory; label: string; hint: string }[] = [
  { value: "litter_waste", label: "Litter & waste", hint: "Trash, illegal dumping, full bins" },
  { value: "overgrown", label: "Overgrown / upkeep", hint: "Grass, hedges, broken fixtures" },
  { value: "vandalism_damage", label: "Vandalism / damage", hint: "Graffiti, broken equipment" },
  { value: "safety_concern", label: "Safety concern", hint: "Glass, hazards, lighting" },
  { value: "other", label: "Something else", hint: "Anything neighbors should know" },
];

const ReportSpot = () => {
  const [category, setCategory] = useState<CommunitySignalCategory | "">("");
  const [placeLabel, setPlaceLabel] = useState("");
  const [description, setDescription] = useState("");
  const [locationHint, setLocationHint] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [doneId, setDoneId] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!category) {
      toast({ title: "Pick a category", variant: "destructive" });
      return;
    }
    if (placeLabel.trim().length < 2) {
      toast({ title: "Add a place name", description: "e.g. Riverside Park, north playground", variant: "destructive" });
      return;
    }
    if (description.trim().length < 15) {
      toast({ title: "Tell us a bit more", description: "At least a few sentences help organizers plan.", variant: "destructive" });
      return;
    }

    setSubmitting(true);
    try {
      const res = await submitCommunitySignal({
        category,
        placeLabel: placeLabel.trim(),
        description: description.trim(),
        locationHint: locationHint.trim() || null,
        contactEmail: contactEmail.trim() || null,
      });
      setDoneId(res.id);
      toast({ title: "Thanks — your heads-up is saved", description: "Community leaders and agents can use this to organize action." });
      setPlaceLabel("");
      setDescription("");
      setLocationHint("");
      setContactEmail("");
      setCategory("");
    } catch (err) {
      const msg = err instanceof HttpError ? err.message : "Something went wrong";
      toast({ title: "Could not send", description: msg.slice(0, 200), variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-background">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-32 left-1/4 h-[380px] w-[480px] -translate-x-1/2 rounded-full bg-primary/10 blur-[100px]" />
        <div className="absolute top-1/4 -right-24 h-[320px] w-[420px] rounded-full bg-hero-green-glow/10 blur-[90px]" />
        <div className="absolute bottom-0 left-0 h-[240px] w-[360px] rounded-full bg-hero-yellow/5 blur-[80px]" />
      </div>

      <header className="sticky top-0 z-50 border-b border-border/40 bg-background/75 backdrop-blur-xl">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:h-16 sm:px-6">
          <Link
            to="/"
            className="group flex items-center gap-2 text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft size={18} className="transition-transform group-hover:-translate-x-0.5" />
            <span className="text-sm font-medium">Home</span>
          </Link>
          <Link to="/auth" className="text-xs font-semibold text-primary hover:underline sm:text-sm">
            Play in the app
          </Link>
        </div>
      </header>

      <section className="relative mx-auto max-w-3xl px-4 pb-8 pt-10 sm:px-6 sm:pt-14">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
          className="mb-10 flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between"
        >
          <div className="flex gap-4">
            <div className="relative shrink-0">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-hero-green-glow to-primary opacity-35 blur-lg" />
              <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-gradient-to-br from-hero-green-glow/25 to-primary/20">
                <img src={heroLogo} alt="" className="h-9 w-9 object-contain" />
              </div>
            </div>
            <div>
              <span className="mb-2 inline-flex items-center gap-1.5 rounded-full border border-hero-green-glow/30 bg-hero-green-glow/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest text-hero-green-glow">
                <Leaf size={11} />
                No account needed
              </span>
              <h1 className="mt-2 font-display text-3xl font-bold leading-tight tracking-tight text-foreground sm:text-4xl">
                <span className="text-gradient-white">Report a spot</span>
                <br />
                <span className="text-gradient-hero">that needs care</span>
              </h1>
              <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
                Not playing Local Hero? You can still flag a park, playground, or street that has{" "}
                <strong className="text-foreground">a lot of garbage</strong>, overgrowth, or damage. Our{" "}
                <strong className="text-foreground">community leaders and agents</strong> use these heads-ups to plan
                cleanups and quests — you stay in control of how much you share.
              </p>
            </div>
          </div>
        </motion.div>

        <div className="mb-10 grid gap-3 sm:grid-cols-3">
          {[
            { icon: MessageSquare, title: "Quick form", desc: "2–3 minutes. Optional email only if you want follow-up." },
            { icon: Users, title: "For organizers", desc: "Signals land in a secure queue for leaders & agent tooling." },
            { icon: Shield, title: "Privacy-minded", desc: "No game profile required. Be as specific as you’re comfortable." },
          ].map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 * i + 0.15 }}
              className="rounded-2xl border border-border/70 bg-card/40 p-4 backdrop-blur-sm"
            >
              <s.icon className="mb-2 h-5 w-5 text-primary" />
              <p className="font-display text-sm font-bold text-foreground">{s.title}</p>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{s.desc}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="rounded-3xl border border-primary/15 bg-card/50 p-6 shadow-xl shadow-black/15 backdrop-blur-md sm:p-8"
        >
          {doneId ? (
            <div className="py-8 text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/15 text-primary">
                <Sparkles className="h-7 w-7" />
              </div>
              <h2 className="font-display text-xl font-bold text-foreground">You’re on the map</h2>
              <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
                Reference <span className="font-mono text-xs text-primary/90">{doneId.slice(0, 8)}…</span> if you email
                us. Want to join the next cleanup when it’s scheduled? Leave your email next time or sign up in the app.
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-2">
                <Button variant="outline" className="rounded-xl" onClick={() => setDoneId(null)}>
                  Send another heads-up
                </Button>
                <Button className="rounded-xl bg-gradient-hero-glow" asChild>
                  <Link to="/auth">Create a Hero account</Link>
                </Button>
              </div>
            </div>
          ) : (
            <form onSubmit={(e) => void handleSubmit(e)} className="space-y-6">
              <div className="space-y-2">
                <Label className="text-foreground">What’s going on?</Label>
                <Select
                  value={category || undefined}
                  onValueChange={(v) => setCategory(v as CommunitySignalCategory)}
                >
                  <SelectTrigger className="h-12 rounded-xl border-border/80 bg-background/60">
                    <SelectValue placeholder="Choose a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORY_OPTIONS.map((c) => (
                      <SelectItem key={c.value} value={c.value}>
                        {c.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {category ? (
                  <p className="text-[11px] text-muted-foreground">
                    {CATEGORY_OPTIONS.find((c) => c.value === category)?.hint}
                  </p>
                ) : null}
              </div>

              <div className="space-y-2">
                <Label htmlFor="place" className="flex items-center gap-2 text-foreground">
                  <MapPin className="h-3.5 w-3.5 text-primary" />
                  Place name
                </Label>
                <Input
                  id="place"
                  value={placeLabel}
                  onChange={(e) => setPlaceLabel(e.target.value)}
                  placeholder="e.g. Oakwood Park — east field near the creek"
                  className="h-12 rounded-xl bg-background/60"
                  maxLength={160}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="desc" className="text-foreground">
                  What should organizers know?
                </Label>
                <Textarea
                  id="desc"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Roughly how big is the issue? Best entrance or landmark? Time you noticed it? Anything unsafe?"
                  className="min-h-[140px] rounded-xl border-border/80 bg-background/60 text-[15px] leading-relaxed"
                  maxLength={4000}
                />
                <p className="text-[11px] text-muted-foreground">{description.trim().length}/4000 · min 15 characters</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="hint" className="text-muted-foreground">
                  Location hint <span className="font-normal">(optional)</span>
                </Label>
                <Input
                  id="hint"
                  value={locationHint}
                  onChange={(e) => setLocationHint(e.target.value)}
                  placeholder="City / neighborhood, cross streets, or map link"
                  className="h-11 rounded-xl bg-background/50"
                  maxLength={400}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-muted-foreground">
                  Contact email <span className="font-normal">(optional)</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  placeholder="Only if you’re OK being reached about a cleanup"
                  className="h-11 rounded-xl bg-background/50"
                />
              </div>

              <Button
                type="submit"
                disabled={submitting}
                className={cn(
                  "h-12 w-full rounded-xl bg-gradient-to-r from-primary to-hero-green-glow font-display text-base font-bold shadow-lg shadow-primary/20 sm:w-auto sm:min-w-[200px]"
                )}
              >
                {submitting ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Send to community queue
                  </>
                )}
              </Button>
              <p className="text-[11px] leading-relaxed text-muted-foreground">
                By submitting, you agree we may store this information to coordinate community action. No spam — see{" "}
                <Link to="/privacy" className="text-primary underline-offset-2 hover:underline">
                  Privacy
                </Link>
                .
              </p>
            </form>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-10 rounded-2xl border border-border/60 bg-secondary/20 px-5 py-6 text-sm text-muted-foreground"
        >
          <p className="font-display font-semibold text-foreground">For organizers & agents</p>
          <p className="mt-2 leading-relaxed">
            Reports are stored in Postgres as <code className="rounded bg-background/80 px-1 py-0.5 text-xs">community_signals</code>{" "}
            (<span className="text-foreground">status = open</span>). Run migration{" "}
            <code className="text-xs">003_community_signals.sql</code> and query the table from your ops dashboard or
            Overmind workflows. See <code className="text-xs">docs/COMMUNITY_SIGNALS.md</code>.
          </p>
        </motion.div>
      </section>

      <SiteMarketingFooter />
    </div>
  );
};

export default ReportSpot;
