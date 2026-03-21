import {
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  Coins,
  FileCode2,
  Layers,
  Link2,
  Lock,
  Shield,
  Sparkles,
  Users,
  Zap,
} from "lucide-react";
import { Link } from "react-router-dom";
import { motion, useScroll, useSpring } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { Components } from "react-markdown";
import heroLogo from "@/assets/hero-logo-glow.png";
import { SiteMarketingFooter } from "@/components/SiteMarketingFooter";
import { cn } from "@/lib/utils";
import heroTokenPaperMd from "../../docs/HERO_TOKEN_TECHNICAL_PAPER.md?raw";

const statCards = [
  {
    label: "Max supply",
    value: "77,777,777",
    sub: "HERO · hard-capped on-chain",
    icon: Coins,
    accent: "from-hero-yellow/30 to-amber-500/10",
    iconClass: "text-hero-yellow",
  },
  {
    label: "Decimals",
    value: "18",
    sub: "ERC-20 standard precision",
    icon: Layers,
    accent: "from-primary/25 to-cyan-500/10",
    iconClass: "text-primary",
  },
  {
    label: "Governance",
    value: "Multisig",
    sub: "Safe + hot minter split",
    icon: Users,
    accent: "from-hero-purple/30 to-violet-500/10",
    iconClass: "text-hero-purple",
  },
  {
    label: "Liquidity",
    value: "Lock-first",
    sub: "LP lockers · verifiable",
    icon: Lock,
    accent: "from-hero-green-glow/25 to-emerald-500/10",
    iconClass: "text-hero-green-glow",
  },
] as const;

const mdComponents: Components = {
  h1: () => null,
  h2: ({ children }) => (
    <h2 className="group font-display text-2xl sm:text-[1.65rem] font-bold text-foreground mt-14 mb-6 scroll-mt-24">
      <span className="flex items-start gap-4">
        <span
          className="mt-1.5 w-1.5 min-h-[1.75rem] rounded-full bg-gradient-to-b from-primary via-hero-purple to-hero-yellow shrink-0 shadow-[0_0_12px_hsl(var(--primary)/0.45)]"
          aria-hidden
        />
        <span className="leading-tight pt-0.5">{children}</span>
      </span>
    </h2>
  ),
  h3: ({ children }) => (
    <h3 className="font-display text-lg font-semibold text-foreground/95 mt-8 mb-3 flex items-center gap-2">
      <Zap className="w-4 h-4 text-primary shrink-0 opacity-80" aria-hidden />
      {children}
    </h3>
  ),
  p: ({ children }) => (
    <p className="text-[15px] sm:text-base text-muted-foreground leading-relaxed mb-4 last:mb-0">{children}</p>
  ),
  strong: ({ children }) => <strong className="font-semibold text-foreground">{children}</strong>,
  ul: ({ children, className }) => (
    <ul
      className={cn(
        "my-5 list-none space-y-3 pl-0",
        className?.includes("contains-task-list") && "space-y-3.5"
      )}
    >
      {children}
    </ul>
  ),
  ol: ({ children }) => (
    <ol className="my-5 list-decimal space-y-2.5 pl-6 marker:font-display marker:text-sm marker:font-bold marker:text-primary">
      {children}
    </ol>
  ),
  li: ({ children, className }) => {
    const isTask = className?.includes("task-list-item");
    if (isTask) {
      return (
        <li className={cn("task-list-item flex gap-3.5 items-start text-[15px] text-muted-foreground", className)}>
          {children}
        </li>
      );
    }
    return (
      <li className="relative pl-7 text-[15px] leading-relaxed text-muted-foreground">
        <CheckCircle2 className="absolute left-0 top-1.5 h-4 w-4 text-primary/65" aria-hidden />
        <div className="space-y-1.5 [&_p]:mb-0">{children}</div>
      </li>
    );
  },
  input: ({ type, checked, disabled, ...props }) => {
    if (type === "checkbox") {
      return (
        <span
          className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border border-primary/45 bg-primary/10"
          aria-hidden
        >
          {checked ? <CheckCircle2 className="h-3.5 w-3.5 text-primary" /> : null}
          <input type="checkbox" checked={checked} disabled={disabled} readOnly className="sr-only" {...props} />
        </span>
      );
    }
    return <input type={type} checked={checked} disabled={disabled} {...props} />;
  },
  hr: () => (
    <div className="my-10 flex items-center gap-4" aria-hidden>
      <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent" />
      <Sparkles className="w-4 h-4 text-primary/40" />
      <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent" />
    </div>
  ),
  code: ({ className, children, ...props }) => {
    const isBlock = /language-\w+/.test(className || "");
    if (isBlock) {
      return (
        <code
          className={cn("block font-mono text-[13px] leading-relaxed text-foreground/90", className)}
          {...props}
        >
          {children}
        </code>
      );
    }
    return (
      <code
        className="rounded-md border border-border/60 bg-secondary/80 px-1.5 py-0.5 font-mono text-[13px] text-primary-foreground/90"
        {...props}
      >
        {children}
      </code>
    );
  },
  pre: ({ children }) => (
    <pre className="my-5 overflow-x-auto rounded-xl border border-border/80 bg-card/50 p-4 backdrop-blur-sm">
      {children}
    </pre>
  ),
  table: ({ children }) => (
    <div className="my-8 overflow-x-auto rounded-2xl border border-primary/15 bg-gradient-to-br from-card/80 to-secondary/20 shadow-[inset_0_1px_0_0_hsl(var(--primary)/0.08)]">
      <table className="w-full min-w-[520px] border-collapse text-left text-sm">{children}</table>
    </div>
  ),
  thead: ({ children }) => <thead className="border-b border-primary/20 bg-primary/5">{children}</thead>,
  th: ({ children }) => (
    <th className="px-4 py-3.5 font-display font-semibold text-foreground first:rounded-tl-2xl last:rounded-tr-2xl">
      {children}
    </th>
  ),
  td: ({ children }) => (
    <td className="border-t border-border/50 px-4 py-3 text-muted-foreground align-top">{children}</td>
  ),
  tr: ({ children }) => <tr className="transition-colors hover:bg-primary/[0.04]">{children}</tr>,
  a: ({ href, children }) => (
    <a
      href={href}
      className="font-medium text-primary underline decoration-primary/30 underline-offset-4 transition-colors hover:decoration-primary"
      target={href?.startsWith("http") ? "_blank" : undefined}
      rel={href?.startsWith("http") ? "noreferrer" : undefined}
    >
      {children}
    </a>
  ),
  blockquote: ({ children }) => (
    <blockquote className="my-6 rounded-xl border-l-4 border-primary/50 bg-primary/5 px-5 py-4 text-muted-foreground italic">
      {children}
    </blockquote>
  ),
};

/**
 * Technical paper for HERO ERC-20 (max supply, multisig, liquidity).
 * Source of truth: `docs/HERO_TOKEN_TECHNICAL_PAPER.md`.
 */
const HeroTokenPaper = () => {
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 28, restDelta: 0.001 });

  return (
    <div className="min-h-screen bg-background relative overflow-x-hidden">
      {/* Reading progress */}
      <motion.div
        className="fixed top-0 left-0 right-0 z-[100] h-[3px] origin-left bg-gradient-to-r from-primary via-hero-purple to-hero-yellow"
        style={{ scaleX: progress }}
      />

      {/* Ambient */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/4 h-[420px] w-[520px] -translate-x-1/2 rounded-full bg-primary/12 blur-[120px]" />
        <div className="absolute top-1/3 -right-32 h-[380px] w-[480px] rounded-full bg-hero-purple/10 blur-[100px]" />
        <div className="absolute bottom-0 left-0 h-[300px] w-[400px] rounded-full bg-hero-yellow/5 blur-[90px]" />
        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, hsl(var(--foreground)) 1px, transparent 0)`,
            backgroundSize: "32px 32px",
          }}
        />
      </div>

      <header className="sticky top-0 z-50 border-b border-border/40 bg-background/70 backdrop-blur-xl supports-[backdrop-filter]:bg-background/55">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
          <Link
            to="/"
            className="group flex items-center gap-2 text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft size={20} className="transition-transform group-hover:-translate-x-0.5" />
            <span className="font-medium">Home</span>
          </Link>
          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              to="/heropaper"
              className="hidden items-center gap-1.5 rounded-full border border-border/60 bg-card/40 px-3 py-1.5 text-xs font-medium text-muted-foreground transition-all hover:border-primary/30 hover:text-primary sm:flex"
            >
              <BookOpen size={14} />
              HeroPaper
            </Link>
            <Link
              to="/app/redeem"
              className="flex items-center gap-1.5 rounded-full bg-gradient-to-r from-primary/90 to-hero-purple/80 px-3.5 py-1.5 text-xs font-bold text-primary-foreground shadow-lg shadow-primary/20 transition-transform hover:scale-[1.02]"
            >
              <Sparkles size={14} />
              Redeem
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative px-4 pb-16 pt-10 sm:px-6 sm:pb-20 sm:pt-14">
        <div className="mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, ease: [0.25, 0.1, 0.25, 1] }}
            className="relative overflow-hidden rounded-3xl border border-primary/20 bg-gradient-to-br from-card/90 via-card/50 to-secondary/30 p-8 shadow-[0_0_0_1px_hsl(var(--primary)/0.06),0_24px_80px_-24px_hsl(var(--primary)/0.25)] sm:p-12 lg:p-14"
          >
            <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-gradient-to-br from-primary/20 to-transparent blur-3xl" />
            <div className="absolute -bottom-16 left-1/2 h-48 w-96 -translate-x-1/2 rounded-full bg-hero-purple/15 blur-3xl" />

            <div className="relative flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between lg:gap-12">
              <div className="max-w-2xl space-y-6">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-primary">
                    <FileCode2 size={12} />
                    Technical paper
                  </span>
                  <span className="text-xs text-muted-foreground">v1.0 · March 2026</span>
                </div>

                <div className="flex items-start gap-4">
                  <div className="relative shrink-0">
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary to-hero-purple opacity-40 blur-lg" />
                    <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-gradient-to-br from-primary/30 to-hero-purple/20 shadow-inner">
                      <img src={heroLogo} alt="" className="h-10 w-10 object-contain drop-shadow-md" />
                    </div>
                  </div>
                  <div>
                    <h1 className="font-display text-3xl font-bold leading-[1.1] tracking-tight text-foreground sm:text-4xl lg:text-[2.75rem]">
                      <span className="text-gradient-white">HERO Token</span>
                      <br />
                      <span className="text-gradient-hero">Security & tokenomics</span>
                    </h1>
                    <p className="mt-4 max-w-xl text-base text-muted-foreground sm:text-lg">
                      Fixed supply ERC-20 on <strong className="text-foreground">0G Chain</strong>. Multisig governance,
                      separated minter keys, and a lock-first liquidity playbook—documented for transparency.
                    </p>
                  </div>
                </div>
              </div>

              <motion.div
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.15, duration: 0.55, ease: [0.34, 1.56, 0.64, 1] }}
                className="relative shrink-0 lg:pb-2"
              >
                <div className="rounded-2xl border border-hero-yellow/25 bg-gradient-to-br from-hero-yellow/10 via-background/80 to-primary/10 px-8 py-6 text-center shadow-[inset_0_1px_0_0_hsl(var(--hero-yellow)/0.2)]">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-hero-yellow/90">Max supply</p>
                  <p className="mt-1 font-display text-4xl font-bold tabular-nums tracking-tight text-foreground sm:text-5xl">
                    77,777,777
                  </p>
                  <p className="mt-2 text-xs text-muted-foreground">No inflation beyond this cap · enforced in Solidity</p>
                </div>
              </motion.div>
            </div>

            {/* Stat grid */}
            <div className="relative mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {statCards.map((s, i) => (
                <motion.div
                  key={s.label}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.08 * i + 0.2, duration: 0.45 }}
                  className={cn(
                    "group relative overflow-hidden rounded-2xl border border-border/60 bg-card/40 p-4 backdrop-blur-sm transition-all hover:border-primary/25 hover:shadow-lg hover:shadow-primary/5"
                  )}
                >
                  <div
                    className={cn(
                      "absolute inset-0 bg-gradient-to-br opacity-0 transition-opacity group-hover:opacity-100",
                      s.accent
                    )}
                  />
                  <div className="relative flex items-start gap-3">
                    <div
                      className={cn(
                        "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/5 bg-background/50",
                        s.iconClass
                      )}
                    >
                      <s.icon className="h-5 w-5" strokeWidth={1.75} />
                    </div>
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{s.label}</p>
                      <p className="font-display text-lg font-bold text-foreground">{s.value}</p>
                      <p className="text-[11px] leading-snug text-muted-foreground/90">{s.sub}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Document body */}
      <main className="relative mx-auto max-w-3xl px-4 pb-24 sm:px-6">
        <motion.article
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="rounded-3xl border border-border/50 bg-card/30 px-5 py-10 shadow-xl shadow-black/20 backdrop-blur-md sm:px-10 sm:py-12 lg:px-14 lg:py-16 [&>h2:first-of-type]:mt-6"
        >
          <div className="mb-10 flex items-center gap-3 border-b border-border/60 pb-6">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/15 text-primary">
              <Shield className="h-5 w-5" strokeWidth={1.75} />
            </div>
            <div>
              <p className="font-display text-sm font-bold text-foreground">Full specification</p>
              <p className="text-xs text-muted-foreground">Abstract through references · GitHub-flavored markdown</p>
            </div>
          </div>

          <div className="prose prose-invert max-w-none prose-p:max-w-none">
            <ReactMarkdown remarkPlugins={[remarkGfm]} components={mdComponents}>
              {heroTokenPaperMd}
            </ReactMarkdown>
          </div>
        </motion.article>

        {/* Footer CTA strip */}
        <motion.footer
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-12 flex flex-col items-center gap-4 rounded-2xl border border-primary/15 bg-gradient-to-r from-primary/5 via-transparent to-hero-purple/5 px-6 py-8 text-center sm:flex-row sm:justify-between sm:text-left"
        >
          <div className="flex items-center gap-3">
            <Link2 className="h-5 w-5 shrink-0 text-primary" />
            <div>
              <p className="font-display text-sm font-bold text-foreground">Questions or integrations?</p>
              <p className="text-xs text-muted-foreground">
                Source: <code className="text-[10px] text-primary/90">contracts/src/HeroToken.sol</code> · Points redeem
                in-app.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap justify-center gap-2">
            <Link
              to="/"
              className="rounded-xl border border-border bg-background/80 px-4 py-2 text-xs font-medium text-foreground transition-colors hover:border-primary/40"
            >
              Home
            </Link>
            <Link
              to="/heropaper"
              className="rounded-xl border border-border bg-background/80 px-4 py-2 text-xs font-medium text-foreground transition-colors hover:border-primary/40"
            >
              HeroPaper
            </Link>
            <Link
              to="/app/redeem"
              className="rounded-xl border border-primary/30 bg-primary/10 px-4 py-2 text-xs font-bold text-primary transition-colors hover:bg-primary/20"
            >
              Redeem HERO
            </Link>
          </div>
        </motion.footer>
      </main>

      <SiteMarketingFooter />
    </div>
  );
};

export default HeroTokenPaper;
