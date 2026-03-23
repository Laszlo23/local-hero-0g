import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Compass,
  Gift,
  Lightbulb,
  QrCode,
  School,
  Shield,
  Sparkles,
  Trees,
  Wallet,
} from "lucide-react";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { SiteMarketingFooter } from "@/components/SiteMarketingFooter";
import heroCommunity from "@/assets/hero-community.jpg";
import schoolsOutdoor from "@/assets/schools-outdoor.jpg";
import arBook from "@/assets/ar-book.png";

const Fade = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <motion.div
    initial={{ opacity: 0, y: 28 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.12 }}
    transition={{ duration: 0.55, ease: [0.25, 0.1, 0.25, 1] }}
    className={className}
  >
    {children}
  </motion.div>
);

export default function TheIdea() {
  useEffect(() => {
    const prev = document.title;
    document.title = "The idea — Local Hero";
    return () => {
      document.title = prev;
    };
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center px-6">
          <Link
            to="/"
            className="flex items-center gap-2 text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft size={20} />
            <span className="font-medium">Home</span>
          </Link>
        </div>
      </header>

      <section className="relative overflow-hidden border-b border-border/60">
        <div className="pointer-events-none absolute -left-32 top-10 h-72 w-72 rounded-full bg-primary/20 blur-[100px]" />
        <div className="pointer-events-none absolute -right-24 top-0 h-96 w-96 rounded-full bg-hero-purple/15 blur-[120px]" />
        <div className="mx-auto max-w-6xl px-6 py-16 md:py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="max-w-3xl"
          >
            <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-4 py-1 text-xs font-semibold text-primary">
              <Lightbulb size={14} /> Why Local Hero exists
            </p>
            <h1 className="font-display text-4xl font-bold leading-tight md:text-6xl">
              Real places.{" "}
              <span className="text-gradient-hero">Real quests.</span> Rewards you can trust.
            </h1>
            <p className="mt-6 max-w-2xl text-lg text-muted-foreground md:text-xl">
              Local Hero is a community game layer for the physical world: explore your neighborhood, join
              quests and discovery drops, bring classrooms outside with AR trails, and earn verifiable rewards
              — with an optional path to on-chain HERO on{" "}
              <span className="text-foreground/90">0G</span>.
            </p>
            <div className="mt-10 flex flex-wrap gap-3">
              <Link
                to="/auth"
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-hero px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-transform hover:scale-[1.02]"
              >
                Get started <ArrowRight size={14} />
              </Link>
              <Link
                to="/install"
                className="inline-flex items-center gap-2 rounded-xl border border-border bg-background/70 px-5 py-2.5 text-sm font-semibold text-foreground hover:border-primary/40"
              >
                Install the app
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16 md:py-20">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <Fade>
            <h2 className="font-display text-3xl font-bold md:text-4xl">The gap we’re closing</h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              Most “engagement” lives in feeds that forget where you are. Civic pride, outdoor play, and
              local businesses rarely share one loop — and digital rewards are often opaque or locked inside a
              single app.
            </p>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              <strong className="text-foreground">Local Hero</strong> starts from the map: your streets,
              schools, and community spots. We make showing up playful, measurable, and worth repeating —
              whether you’re hunting a discovery drop, finishing a class trail, or reporting a spot that needs
              care.
            </p>
          </Fade>
          <Fade>
            <div className="overflow-hidden rounded-2xl border border-border/60 shadow-lg">
              <img
                src={heroCommunity}
                alt="People together outdoors — community energy Local Hero is built around"
                className="h-64 w-full object-cover md:h-80"
              />
            </div>
          </Fade>
        </div>
      </section>

      <section className="border-y border-border/60 bg-muted/20">
        <div className="mx-auto max-w-6xl px-6 py-16 md:py-22">
          <Fade className="text-center">
            <h2 className="font-display text-3xl font-bold md:text-4xl">What you actually do</h2>
            <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
              Three pillars — same product, different front doors.
            </p>
          </Fade>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {[
              {
                icon: <Compass className="h-6 w-6" />,
                title: "Explore & quests",
                body: "Discover what’s happening near you: story-led quests, challenges, and reasons to move — not endless scrolling.",
                color: "from-primary/20 to-transparent",
              },
              {
                icon: <QrCode className="h-6 w-6" />,
                title: "Drops & proof of place",
                body: "QR codes and geo-aware drops connect digital rewards to real-world moments — so rewards match real participation.",
                color: "from-hero-yellow/20 to-transparent",
              },
              {
                icon: <School className="h-6 w-6" />,
                title: "Schools & AR trails",
                body: "Bring lessons outside: class-sized trails and educational AR quests that teachers can publish and students can run on device.",
                color: "from-hero-green-glow/20 to-transparent",
              },
            ].map((card) => (
              <Fade key={card.title}>
                <div className="glass-card relative h-full overflow-hidden rounded-2xl p-6 md:p-8">
                  <div
                    className={`pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-gradient-to-br ${card.color} blur-2xl`}
                  />
                  <div className="relative z-10 mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    {card.icon}
                  </div>
                  <h3 className="font-display text-lg font-bold text-foreground">{card.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{card.body}</p>
                </div>
              </Fade>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16 md:py-20">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <Fade className="order-2 lg:order-1">
            <div className="grid grid-cols-2 gap-3">
              <div className="overflow-hidden rounded-xl border border-border/60">
                <img src={schoolsOutdoor} alt="Learning outdoors" className="h-44 w-full object-cover" />
              </div>
              <div className="overflow-hidden rounded-xl border border-border/60">
                <img src={arBook} alt="AR learning" className="h-44 w-full object-cover object-top" />
              </div>
            </div>
          </Fade>
          <Fade className="order-1 lg:order-2">
            <h2 className="font-display text-3xl font-bold md:text-4xl">Rewards that can travel with you</h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              You sign in with familiar options (email, Google, Apple, SMS) and get an embedded wallet when
              you’re ready — no crypto jargon required to start playing.
            </p>
            <ul className="mt-6 space-y-4">
              {[
                { icon: <Gift size={18} />, text: "HERO points for impact and participation (server-tracked)." },
                { icon: <Wallet size={18} />, text: "Optional redeem path from points to on-chain HERO where the stack is configured." },
                { icon: <Shield size={18} />, text: "Built for transparency: open build notes, public changelog, and docs for token holders." },
              ].map((row) => (
                <li key={row.text} className="flex gap-3 text-sm text-muted-foreground">
                  <span className="mt-0.5 shrink-0 text-primary">{row.icon}</span>
                  <span>{row.text}</span>
                </li>
              ))}
            </ul>
          </Fade>
        </div>
      </section>

      <section className="border-t border-border/60 bg-gradient-to-b from-background to-muted/15">
        <div className="mx-auto max-w-6xl px-6 py-16 md:py-20">
          <Fade className="mx-auto max-w-3xl text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <Trees className="h-7 w-7" />
            </div>
            <h2 className="font-display text-3xl font-bold md:text-4xl">Rooted in community</h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              We care about civic signal too: you can{" "}
              <Link to="/report-spot" className="font-medium text-primary underline-offset-4 hover:underline">
                report a spot
              </Link>{" "}
              (litter, parks, upkeep) without an account — part of the same “show up for your place” ethos.
            </p>
            <div className="mt-10 flex flex-wrap justify-center gap-3">
              <Link
                to="/heropaper"
                className="inline-flex items-center gap-2 rounded-xl border border-border bg-background/80 px-5 py-2.5 text-sm font-semibold hover:border-primary/40"
              >
                <BookOpen size={16} /> Read HeroPaper
              </Link>
              <Link
                to="/hero-token"
                className="inline-flex items-center gap-2 rounded-xl border border-border bg-background/80 px-5 py-2.5 text-sm font-semibold hover:border-primary/40"
              >
                HERO token paper
              </Link>
              <Link
                to="/build-in-public"
                className="inline-flex items-center gap-2 rounded-xl border border-border bg-background/80 px-5 py-2.5 text-sm font-semibold hover:border-primary/40"
              >
                <Sparkles size={16} /> Build in Public
              </Link>
            </div>
          </Fade>
        </div>
      </section>

      <SiteMarketingFooter />
    </div>
  );
}
