import { motion } from "framer-motion";
import { ArrowRight, TreePine, Globe, Users, Star, Tv, Trophy, Heart, Mail, ExternalLink, ChevronRight } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import heroLogo from "@/assets/hero-logo-glow.png";
import worldRecordImg from "@/assets/treegens-worldrecord.jpg";

const FadeIn = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <motion.div
    initial={{ opacity: 0, y: 40 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.12 }}
    transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
    className={className}
  >
    {children}
  </motion.div>
);

const tiers = [
  {
    name: "Seed Sponsor",
    emoji: "🌱",
    price: "$5,000",
    color: "border-primary/30 hover:border-primary/60",
    glow: "bg-hero-green-glow/10",
    benefits: [
      "Logo on event website",
      "Social media shoutout",
      "Certificate of impact",
      "Name in broadcast credits",
    ],
  },
  {
    name: "Growth Partner",
    emoji: "🌿",
    price: "$25,000",
    color: "border-hero-yellow/30 hover:border-hero-yellow/60",
    glow: "bg-hero-yellow/10",
    popular: true,
    benefits: [
      "Everything in Seed +",
      "30-second brand feature in broadcast",
      "Logo on all event materials",
      "VIP access to planting event",
      "Branded tree planting zone",
    ],
  },
  {
    name: "Canopy Leader",
    emoji: "🌳",
    price: "$100,000",
    color: "border-hero-orange/30 hover:border-hero-orange/60",
    glow: "bg-hero-orange/10",
    benefits: [
      "Everything in Growth +",
      "2-minute dedicated segment",
      "Co-branded content series",
      "Executive speaking slot",
      "Naming rights for forest section",
      "1-year brand ambassadorship",
    ],
  },
  {
    name: "Legacy Sponsor",
    emoji: "🏔️",
    price: "Custom",
    color: "border-hero-purple/30 hover:border-hero-purple/60",
    glow: "bg-hero-purple/10",
    benefits: [
      "Everything in Canopy +",
      "Title sponsorship opportunities",
      "Custom activation packages",
      "Direct partnership with TreeGens DAO",
      "Multi-year impact agreement",
      "Exclusive brand integration",
    ],
  },
];

const TreegensWorldRecord = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* ═══════════ NAV ═══════════ */}
      <nav className="fixed top-4 left-4 right-4 z-50 max-w-5xl mx-auto">
        <div className="glass-strong rounded-2xl px-5 h-14 flex items-center justify-between shadow-lg shadow-background/50">
          <Link to="/" className="flex items-center gap-2">
            <img src={heroLogo} alt="Local Hero" className="w-7 h-7" width={28} height={28} />
            <span className="font-display font-bold text-base text-foreground">
              Local<span className="text-gradient-hero">Hero</span>
            </span>
          </Link>
          <div className="flex items-center gap-3">
            <Link to="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors hidden sm:block">
              ← Back to Home
            </Link>
            <a
              href="mailto:sponsor@localhero.space?subject=TreeGens World Record Sponsorship"
              className="bg-gradient-hero-glow text-primary-foreground px-5 py-2 rounded-full text-sm font-semibold hover:opacity-90 transition-all"
            >
              Become a Sponsor
            </a>
          </div>
        </div>
      </nav>

      {/* ═══════════ HERO ═══════════ */}
      <section className="relative min-h-screen flex items-center pt-24 pb-20 overflow-hidden" aria-label="TreeGens World Record Hero">
        <div className="absolute inset-0">
          <img src={worldRecordImg} alt="TreeGens DAO world record tree planting event" className="w-full h-full object-cover" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-background/40" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/70 via-transparent to-background/50" />

        {/* Floating trees */}
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-2xl"
            style={{ left: `${10 + i * 18}%`, top: `${15 + (i % 3) * 20}%` }}
            animate={{ y: [0, -15, 0], opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 3 + i * 0.5, repeat: Infinity, delay: i * 0.7 }}
          >
            🌳
          </motion.div>
        ))}

        <div className="relative z-10 max-w-5xl mx-auto px-6 w-full">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <div className="inline-flex items-center gap-2 glass rounded-full px-5 py-2.5 mb-6">
              <TreePine size={14} className="text-primary" />
              <span className="text-xs font-semibold text-foreground tracking-wide">TreeGens DAO × Local Hero × HubCast Media</span>
            </div>

            <h1 className="font-display text-5xl sm:text-6xl lg:text-[5.5rem] font-bold leading-[1.05] mb-6 tracking-tight">
              <span className="text-gradient-hero">1 Billion Trees.</span>
              <br />
              <span className="text-gradient-white">One World Record.</span>
            </h1>

            <p className="text-lg sm:text-xl text-foreground/80 max-w-2xl mb-4 leading-relaxed">
              TreeGens DAO is attempting a <span className="text-primary font-semibold">Guinness World Record</span> for the largest tree planting initiative in history — broadcast to <span className="text-hero-yellow font-semibold">billions</span> worldwide through HubCast Media.
            </p>

            <p className="text-base text-muted-foreground max-w-xl mb-8">
              Led by Richard Lukens — the visionary behind <strong className="text-foreground">Live Aid</strong> (1.9B viewers) — this broadcast aims to match that historic scale.
            </p>

            <div className="flex flex-wrap gap-4 mb-10">
              <motion.a
                href="mailto:sponsor@localhero.space?subject=TreeGens World Record Sponsorship"
                className="group bg-gradient-hero-glow text-primary-foreground px-8 py-4 rounded-2xl text-lg font-bold glow-green flex items-center gap-3"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <Mail size={20} /> Become a Sponsor <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </motion.a>
              <motion.button
                onClick={() => navigate("/fund")}
                className="glass-card px-8 py-4 rounded-2xl text-base font-semibold text-foreground hover:border-primary/30 transition-all flex items-center gap-2"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <Heart size={16} className="text-hero-orange" /> Support the Mission
              </motion.button>
            </div>

            {/* Key stats */}
            <div className="flex flex-wrap gap-6">
              {[
                { value: "1B", label: "Trees Target", icon: <TreePine size={16} className="text-primary" /> },
                { value: "1.9B", label: "Live Aid Viewers", icon: <Tv size={16} className="text-hero-yellow" /> },
                { value: "5M+", label: "Last Event Viewers", icon: <Users size={16} className="text-hero-orange" /> },
                { value: "2026", label: "World Record Year", icon: <Trophy size={16} className="text-hero-purple" /> },
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + i * 0.1 }}
                  className="glass rounded-xl px-5 py-3 flex items-center gap-3"
                >
                  {stat.icon}
                  <div>
                    <p className="font-display text-lg font-bold text-foreground">{stat.value}</p>
                    <p className="text-[11px] text-muted-foreground">{stat.label}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════ THE MISSION ═══════════ */}
      <section className="py-24 relative">
        <div className="absolute top-0 left-1/3 w-[400px] h-[400px] rounded-full bg-hero-green-glow/5 blur-[120px]" />
        <div className="max-w-5xl mx-auto px-6">
          <FadeIn>
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-2 mb-4">
                <Globe size={14} className="text-primary" />
                <span className="text-xs font-semibold text-foreground">The Mission</span>
              </div>
              <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
                Planting a <span className="text-gradient-hero">Forest for the Future</span>
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                TreeGens DAO unites communities worldwide to plant 1 billion trees — verified on-chain, celebrated on screen, and powered by everyday heroes like you.
              </p>
            </div>
          </FadeIn>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                emoji: "🌍",
                title: "Global Movement",
                desc: "Communities across every continent plant trees simultaneously, setting a Guinness World Record for collective environmental action.",
              },
              {
                emoji: "📺",
                title: "Broadcast to Billions",
                desc: "HubCast Media and Richard Lukens (Live Aid) are producing a global broadcast aiming for Live Aid-scale viewership of 1.9 billion people.",
              },
              {
                emoji: "⛓️",
                title: "Verified On-Chain",
                desc: "Every tree planted is verified and recorded through TreeGens DAO, creating permanent, transparent proof of impact.",
              },
            ].map((card, i) => (
              <FadeIn key={i}>
                <div className="glass-card rounded-2xl p-7 h-full hover:border-primary/20 transition-all group">
                  <span className="text-4xl mb-4 block">{card.emoji}</span>
                  <h3 className="font-display text-lg font-bold text-foreground mb-2">{card.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{card.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ THE BROADCAST ═══════════ */}
      <section className="py-24 relative">
        <div className="absolute top-1/2 right-0 w-[300px] h-[300px] rounded-full bg-hero-yellow/5 blur-[100px]" />
        <div className="max-w-5xl mx-auto px-6">
          <FadeIn>
            <div className="glass-card rounded-3xl p-8 md:p-12 relative overflow-hidden">
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-hero-yellow/10 blur-[60px] rounded-full" />
              <div className="relative z-10">
                <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-2 mb-6">
                  <Tv size={14} className="text-hero-yellow" />
                  <span className="text-xs font-semibold text-foreground">The Broadcast</span>
                </div>
                <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground mb-6">
                  From <span className="text-hero-yellow">Live Aid</span> to <span className="text-gradient-hero">Tree Aid</span>
                </h2>
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <p className="text-base text-foreground/80 leading-relaxed mb-6">
                      Richard Lukens was a key leader behind <strong className="text-foreground">Live Aid</strong> — the biggest broadcast in history with <strong className="text-hero-yellow">1.9 billion viewers</strong>. Now he's partnering with HubCast Media and TreeGens DAO to create the next global phenomenon.
                    </p>
                    <p className="text-base text-foreground/80 leading-relaxed mb-6">
                      HubCast Media's last event reached <strong className="text-primary">5 million+ unique viewers</strong>. The goal for the TreeGens World Record broadcast? Nothing less than Live Aid scale.
                    </p>
                    <p className="text-sm text-muted-foreground italic">
                      "This isn't just a broadcast — it's a movement. Every viewer becomes a witness to history." — HubCast Media
                    </p>
                  </div>
                  <div className="space-y-4">
                    {[
                      { icon: <Star size={18} className="text-hero-yellow" />, title: "1.9B Viewer Target", desc: "Matching Live Aid's historic reach" },
                      { icon: <Globe size={18} className="text-primary" />, title: "Multi-Platform", desc: "Streaming across TV, web, and mobile simultaneously" },
                      { icon: <Users size={18} className="text-hero-orange" />, title: "Celebrity & Influencer Line-up", desc: "Global voices amplifying the tree planting mission" },
                      { icon: <Trophy size={18} className="text-hero-purple" />, title: "Guinness Adjudicators On-Site", desc: "Official verification of the world record attempt" },
                    ].map((item, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.1 }}
                        className="flex items-start gap-4 glass rounded-xl p-4"
                      >
                        <div className="mt-0.5">{item.icon}</div>
                        <div>
                          <p className="text-sm font-bold text-foreground">{item.title}</p>
                          <p className="text-xs text-muted-foreground">{item.desc}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ═══════════ SPONSORSHIP TIERS ═══════════ */}
      <section className="py-24 relative" id="sponsor">
        <div className="absolute top-1/4 left-0 w-[400px] h-[400px] rounded-full bg-primary/5 blur-[120px]" />
        <div className="max-w-6xl mx-auto px-6">
          <FadeIn>
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-2 mb-4">
                <Star size={14} className="text-hero-yellow" />
                <span className="text-xs font-semibold text-foreground">Sponsor the Movement</span>
              </div>
              <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
                Prime <span className="text-gradient-hero">Brand Exposure</span> at Scale
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Get your brand in front of billions while making genuine environmental impact. Choose the tier that fits your vision.
              </p>
            </div>
          </FadeIn>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {tiers.map((tier, i) => (
              <FadeIn key={i}>
                <motion.div
                  className={`glass-card rounded-2xl p-6 h-full relative ${tier.color} transition-all`}
                  whileHover={{ y: -4 }}
                >
                  {tier.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-hero text-primary-foreground px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                      Most Popular
                    </div>
                  )}
                  <div className={`absolute -top-8 -right-8 w-24 h-24 ${tier.glow} blur-[30px] rounded-full`} />
                  <div className="relative z-10">
                    <span className="text-3xl mb-3 block">{tier.emoji}</span>
                    <h3 className="font-display text-lg font-bold text-foreground mb-1">{tier.name}</h3>
                    <p className="font-display text-2xl font-bold text-primary mb-5">{tier.price}</p>
                    <ul className="space-y-2.5">
                      {tier.benefits.map((b, j) => (
                        <li key={j} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <ChevronRight size={14} className="text-primary mt-0.5 shrink-0" />
                          {b}
                        </li>
                      ))}
                    </ul>
                    <motion.a
                      href={`mailto:sponsor@localhero.space?subject=TreeGens Sponsorship: ${tier.name}`}
                      className="mt-6 w-full glass rounded-xl py-3 text-sm font-bold text-foreground hover:bg-primary/10 transition-all flex items-center justify-center gap-2 block"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Mail size={14} /> Get in Touch
                    </motion.a>
                  </div>
                </motion.div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ HOW LOCAL HERO HELPS ═══════════ */}
      <section className="py-24 relative">
        <div className="max-w-5xl mx-auto px-6">
          <FadeIn>
            <div className="glass-card rounded-3xl p-8 md:p-12 relative overflow-hidden">
              <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-primary/10 blur-[60px] rounded-full" />
              <div className="relative z-10">
                <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-2 mb-6">
                  <img src={heroLogo} alt="" className="w-4 h-4" />
                  <span className="text-xs font-semibold text-foreground">Local Hero × TreeGens DAO</span>
                </div>
                <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground mb-6">
                  How <span className="text-gradient-hero">Local Hero</span> Powers the Mission
                </h2>
                <div className="grid md:grid-cols-3 gap-6">
                  {[
                    {
                      emoji: "🎮",
                      title: "Gamified Quests",
                      desc: "Local Hero turns tree planting into fun daily quests. Complete them, earn HERO points, and contribute to the 1 billion tree goal.",
                    },
                    {
                      emoji: "🔗",
                      title: "On-Chain Verification",
                      desc: "TreeGens DAO records every tree on-chain. Your impact is permanent, transparent, and verifiable — no greenwashing.",
                    },
                    {
                      emoji: "🏆",
                      title: "United for the Record",
                      desc: "The world record unites both platforms: Local Hero engages the community, TreeGens verifies the impact, HubCast broadcasts it all.",
                    },
                  ].map((item, i) => (
                    <div key={i} className="text-center">
                      <span className="text-4xl mb-3 block">{item.emoji}</span>
                      <h3 className="font-display text-base font-bold text-foreground mb-2">{item.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ═══════════ FINAL CTA ═══════════ */}
      <section className="py-24 relative">
        <div className="absolute inset-0 bg-gradient-to-t from-primary/5 to-transparent" />
        <div className="max-w-3xl mx-auto px-6 text-center relative z-10">
          <FadeIn>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6">
              Be Part of <span className="text-gradient-hero">History</span>
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
              Whether you're a brand looking for exposure, a community ready to plant, or an individual who wants to make a difference — there's a place for you.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <motion.a
                href="mailto:sponsor@localhero.space?subject=TreeGens World Record Sponsorship"
                className="group bg-gradient-hero-glow text-primary-foreground px-10 py-5 rounded-2xl text-lg font-bold glow-green flex items-center justify-center gap-3"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <Mail size={20} /> Sponsor the World Record
              </motion.a>
              <motion.button
                onClick={() => navigate("/fund")}
                className="glass-card px-8 py-4 rounded-2xl text-base font-semibold text-foreground hover:border-primary/30 transition-all flex items-center gap-2 justify-center"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <Heart size={16} className="text-hero-orange" /> Fund the Mission
              </motion.button>
            </div>
            <p className="text-sm text-muted-foreground">
              Questions? Reach out at{" "}
              <a href="mailto:sponsor@localhero.space" className="text-primary hover:underline">
                sponsor@localhero.space
              </a>
            </p>
          </FadeIn>
        </div>
      </section>

      {/* ═══════════ FOOTER ═══════════ */}
      <footer className="border-t border-border py-10">
        <div className="max-w-5xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <img src={heroLogo} alt="" className="w-6 h-6" />
            <span className="font-display font-bold text-sm text-foreground">
              Local<span className="text-gradient-hero">Hero</span> × TreeGens DAO
            </span>
          </div>
          <div className="flex items-center gap-5">
            <Link to="/" className="text-xs text-muted-foreground hover:text-foreground transition-colors">Home</Link>
            <Link to="/privacy" className="text-xs text-muted-foreground hover:text-foreground transition-colors">Privacy</Link>
            <Link to="/terms" className="text-xs text-muted-foreground hover:text-foreground transition-colors">Terms</Link>
          </div>
          <p className="text-xs text-muted-foreground">© 2026 Local Hero</p>
        </div>
      </footer>
    </div>
  );
};

export default TreegensWorldRecord;
