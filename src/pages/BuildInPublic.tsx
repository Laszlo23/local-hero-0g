import { motion } from "framer-motion";
import { ArrowRight, Calendar, CheckCircle2, Rocket, Sparkles, Wrench } from "lucide-react";
import { Link } from "react-router-dom";
import { SiteMarketingFooter } from "@/components/SiteMarketingFooter";
import buildInPublicMd from "@/content/build-in-public.md?raw";
import { parseBuildInPublicMarkdown, type BuildInPublicTimelineIcon } from "@/lib/buildInPublic";

const ICON_MAP: Record<BuildInPublicTimelineIcon, typeof Wrench> = {
  wrench: Wrench,
  rocket: Rocket,
  sparkles: Sparkles,
};

const DEFAULT_HERO_TITLE = (
  <>
    What happened <span className="text-gradient-hero">today</span> and what got done.
  </>
);

export default function BuildInPublic() {
  const parsed = parseBuildInPublicMarkdown(buildInPublicMd);
  const heroTitle = parsed.heroTitle?.trim();

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
            <p className="mb-4 inline-flex flex-wrap items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-4 py-1 text-xs font-semibold text-primary">
              <Calendar size={14} /> Build in Public
              {parsed.updated ? (
                <span className="font-normal text-muted-foreground">· Updated {parsed.updated}</span>
              ) : null}
            </p>
            <h1 className="font-display text-4xl font-bold leading-tight md:text-6xl">
              {heroTitle ? (
                heroTitle
              ) : (
                DEFAULT_HERO_TITLE
              )}
            </h1>
            <p className="mt-6 max-w-2xl text-base text-muted-foreground md:text-lg">
              {parsed.intro ||
                "We ship fast, document transparently, and keep the community in the loop. Edit the changelog markdown to post today’s update."}
            </p>
            <p className="mt-3 max-w-2xl text-xs text-muted-foreground/80">
              Source: <code className="rounded bg-muted px-1.5 py-0.5">src/content/build-in-public.md</code>
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
            {parsed.todayShipped.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Nothing listed yet — add <code className="rounded bg-muted px-1">- bullets</code> under{" "}
                <code className="rounded bg-muted px-1">## Today shipped</code> in the markdown file.
              </p>
            ) : (
              <ul className="space-y-3">
                {parsed.todayShipped.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-muted-foreground">
                    <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-hero-green-glow" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="rounded-2xl border border-border bg-card/70 p-6">
            <h2 className="mb-5 font-display text-2xl font-bold">Next up</h2>
            {parsed.nextUp.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Add items under <code className="rounded bg-muted px-1">## Next up</code> in the same file.
              </p>
            ) : (
              <ul className="space-y-3 text-sm text-muted-foreground">
                {parsed.nextUp.map((line) => (
                  <li key={line} className="flex gap-2">
                    <span className="text-primary">→</span>
                    <span>{line}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-20">
        <h2 className="mb-6 font-display text-2xl font-bold">Build log timeline</h2>
        {parsed.timeline.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Add a <code className="rounded bg-muted px-1">## Timeline</code> section with{" "}
            <code className="rounded bg-muted px-1">### Step title</code> blocks. Optional first line:{" "}
            <code className="rounded bg-muted px-1">icon: wrench</code>,{" "}
            <code className="rounded bg-muted px-1">rocket</code>, or{" "}
            <code className="rounded bg-muted px-1">sparkles</code>.
          </p>
        ) : (
          <div className="space-y-4">
            {parsed.timeline.map((entry, idx) => {
              const Icon = ICON_MAP[entry.icon] ?? Sparkles;
              return (
                <motion.article
                  key={`${entry.title}-${idx}`}
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
                  <p className="mt-2 whitespace-pre-wrap text-sm text-muted-foreground">{entry.detail}</p>
                </motion.article>
              );
            })}
          </div>
        )}
      </section>

      <SiteMarketingFooter />
    </main>
  );
}
