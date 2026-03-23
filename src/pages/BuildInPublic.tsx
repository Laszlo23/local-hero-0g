import { motion } from "framer-motion";
import { ArrowRight, Calendar, CheckCircle2, Rocket, Sparkles, Wrench } from "lucide-react";
import { Link } from "react-router-dom";
import { SiteMarketingFooter } from "@/components/SiteMarketingFooter";

const highlights = [
  "Shipped signed Android release lanes with keystore-based CI configuration.",
  "Added Google Play internal upload automation with rollout controls and safety validation.",
  "Implemented semver/tag-aware version handling for mobile release artifacts.",
  "Added iOS TestFlight scaffold with signing secret checks and archive/export flow.",
  "Documented the release runbook and environment protection strategy for safer deployments.",
];

const updates = [
  {
    title: "Mobile CI foundations",
    detail:
      "Introduced web sanity checks, Android flavor matrix builds, and iOS simulator verification to catch cross-platform breakages early.",
    icon: Wrench,
  },
  {
    title: "Release track activation",
    detail:
      "Enabled signed Android AAB generation and Play internal uploads with gated status transitions (draft, rollout, completed).",
    icon: Rocket,
  },
  {
    title: "Public accountability loop",
    detail:
      "Created this Build in Public page so the community can follow exactly what was shipped and what is coming next.",
    icon: Sparkles,
  },
];

export default function BuildInPublic() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <section className="relative overflow-hidden border-b border-border/60">
        <div className="pointer-events-none absolute -left-32 top-16 h-80 w-80 rounded-full bg-primary/20 blur-[120px]" />
        <div className="pointer-events-none absolute -right-20 top-0 h-96 w-96 rounded-full bg-hero-purple/15 blur-[140px]" />
        <div className="mx-auto max-w-6xl px-6 py-20 md:py-28">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl"
          >
            <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-4 py-1 text-xs font-semibold text-primary">
              <Calendar size={14} /> Build in Public
            </p>
            <h1 className="font-display text-4xl font-bold leading-tight md:text-6xl">
              What happened <span className="text-gradient-hero">today</span> and what got done.
            </h1>
            <p className="mt-6 max-w-2xl text-base text-muted-foreground md:text-lg">
              We ship fast, document transparently, and keep the community in the loop. This is the
              daily product pulse of Local Hero.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/auth"
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-hero px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-transform hover:scale-[1.02]"
              >
                Join the movement <ArrowRight size={14} />
              </Link>
              <Link
                to="/hero-token"
                className="inline-flex items-center gap-2 rounded-xl border border-border bg-background/70 px-5 py-2.5 text-sm font-semibold text-foreground hover:border-primary/40"
              >
                Read HERO token paper
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-14">
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-border bg-card/70 p-6">
            <h2 className="mb-5 font-display text-2xl font-bold">Today shipped</h2>
            <ul className="space-y-3">
              {highlights.map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-muted-foreground">
                  <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-hero-green-glow" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-border bg-card/70 p-6">
            <h2 className="mb-5 font-display text-2xl font-bold">Next up</h2>
            <div className="space-y-3 text-sm text-muted-foreground">
              <p>1) Store submission polish and release notes automation.</p>
              <p>2) iOS environment protection and staged reviewer gates.</p>
              <p>3) Post-release smoke checks and rollback runbook.</p>
              <p>4) Weekly public changelog snapshots for builders and supporters.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-20">
        <h2 className="mb-6 font-display text-2xl font-bold">Build log timeline</h2>
        <div className="space-y-4">
          {updates.map((entry, idx) => {
            const Icon = entry.icon;
            return (
              <motion.article
                key={entry.title}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: idx * 0.07 }}
                className="relative rounded-2xl border border-border bg-card/70 p-6"
              >
                <div className="mb-2 flex items-center gap-2 text-primary">
                  <Icon size={16} />
                  <span className="text-xs font-semibold uppercase tracking-wide">Update {idx + 1}</span>
                </div>
                <h3 className="font-display text-lg font-semibold">{entry.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{entry.detail}</p>
              </motion.article>
            );
          })}
        </div>
      </section>

      <SiteMarketingFooter />
    </main>
  );
}

