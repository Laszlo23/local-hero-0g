import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import {
  Store, TrendingUp, Users, QrCode, Megaphone, BarChart3,
  Gift, ArrowRight, CheckCircle2, Sparkles, MapPin, Star,
  Calendar, Zap, Shield, ChevronRight, Building2, Coffee,
  TreePine, Heart, Bike, BookOpen, Coins, PiggyBank,
  Target, Leaf, HandHeart, Globe, Lightbulb, Quote
} from "lucide-react";
import heroLogo from "@/assets/hero-logo-glow.png";

/* ─── Animations ─── */
const FadeIn = ({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 24 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-60px" }}
    transition={{ duration: 0.6, delay }}
  >
    {children}
  </motion.div>
);

/* ─── REAL-WORLD STORIES ─── */
const businessStories = [
  {
    name: "Bloom & Brew Coffee",
    type: "Café • Portland, OR",
    emoji: "☕",
    color: "text-hero-orange",
    bg: "bg-hero-orange/10",
    border: "border-hero-orange/20",
    story: `Sarah opened her café on a quiet side street. Foot traffic was inconsistent. She partnered with Local Hero and created a simple quest: "Clean up 5 pieces of litter on Maple Street, scan the QR at our door, and get a free drip coffee."`,
    result: "Within 3 weeks, 140 heroes completed the quest. 68% came back as paying customers. The street got visibly cleaner. Neighbors started calling it 'the cleanest block downtown.'",
    questExample: {
      title: "☕ Maple Street Cleanup",
      reward: "Free drip coffee + 30 HERO",
      action: "Pick up 5 pieces of litter on Maple St → scan QR at Bloom & Brew",
    },
    stats: [
      { label: "New Customers", value: "140" },
      { label: "Return Rate", value: "68%" },
      { label: "Street Cleanliness", value: "+4x" },
    ],
  },
  {
    name: "Green Thumb Garden Center",
    type: "Garden Shop • Austin, TX",
    emoji: "🌱",
    color: "text-primary",
    bg: "bg-primary/10",
    border: "border-primary/20",
    story: `Marcus runs a family-owned garden center. He wanted to get people planting — not just buying. He set up a "Plant a Tree Quest" sponsored by his shop: heroes pick up a free sapling, plant it in their neighborhood, snap a photo, and earn points.`,
    result: "312 trees planted in one season. Local news covered it. His shop became the go-to for community gardening, and sales grew 40% year-over-year.",
    questExample: {
      title: "🌳 Plant a Tree Challenge",
      reward: "Free sapling + 75 HERO + 'Green Guardian' badge",
      action: "Pick up sapling at Green Thumb → plant it → photo proof",
    },
    stats: [
      { label: "Trees Planted", value: "312" },
      { label: "Media Coverage", value: "3 outlets" },
      { label: "Sales Growth", value: "+40%" },
    ],
  },
  {
    name: "Pedal & Pour Bike Shop",
    type: "Bike Shop • Denver, CO",
    emoji: "🚲",
    color: "text-hero-purple",
    bg: "bg-hero-purple/10",
    border: "border-hero-purple/20",
    story: `Ava wanted to promote cycling as sustainable transport. She created a quest where heroes bike to 3 local businesses (including hers), scan QR codes at each stop, and earn points redeemable for bike tune-ups.`,
    result: "A neighborhood bike tour emerged organically. 5 businesses joined as quest stops. Average quest time: 45 minutes of pure local exploration.",
    questExample: {
      title: "🚲 Green Mile Ride",
      reward: "Free bike tune-up + 50 HERO per stop",
      action: "Bike to 3 partner shops → scan QR at each → complete the loop",
    },
    stats: [
      { label: "Quests Completed", value: "230" },
      { label: "Partner Shops", value: "5" },
      { label: "Avg. Engagement", value: "45min" },
    ],
  },
];

/* ─── STOREFRONT SPOT FEATURES ─── */
const storefrontFeatures = [
  {
    icon: <QrCode size={20} />,
    title: "QR Quest Spot",
    desc: "A branded QR code at your entrance turns your storefront into a quest checkpoint. Heroes scan it to start or complete quests in your area.",
  },
  {
    icon: <MapPin size={20} />,
    title: "Explore Map Pin",
    desc: "Your business appears on the Local Hero map. Heroes nearby see your quests, rewards, and community impact score.",
  },
  {
    icon: <Gift size={20} />,
    title: "Reward Redemption",
    desc: "Heroes redeem earned HERO points for your offers — coffee, discounts, free items. You set the terms, they bring the traffic.",
  },
  {
    icon: <Star size={20} />,
    title: "Community Score",
    desc: "Every quest you sponsor builds your public Community Score — visible to all users. The more you give, the more you're trusted.",
  },
];

/* ─── VALUE-ALIGNED QUEST EXAMPLES ─── */
const questTemplates = [
  {
    emoji: "🧹",
    title: "Sidewalk Cleanup",
    fit: "Any storefront",
    desc: "Heroes clean the block around your shop and scan your QR to claim the reward. Your street stays clean, your business gets seen.",
    tag: "Environment",
    tagColor: "text-primary",
    tagBg: "bg-primary/10",
  },
  {
    emoji: "📚",
    title: "Book Exchange",
    fit: "Bookstores, cafés, libraries",
    desc: "Drop off a book, pick up a book. Your shop hosts the exchange shelf. Heroes earn points and you get meaningful foot traffic.",
    tag: "Education",
    tagColor: "text-hero-yellow",
    tagBg: "bg-hero-yellow/10",
  },
  {
    emoji: "🌳",
    title: "Tree Planting Drive",
    fit: "Garden centers, eco brands",
    desc: "Sponsor saplings. Heroes plant them nearby, upload proof, and earn your branded badge. Real environmental impact, real brand love.",
    tag: "Green Impact",
    tagColor: "text-primary",
    tagBg: "bg-primary/10",
  },
  {
    emoji: "🍽️",
    title: "Meal Share Quest",
    fit: "Restaurants, food trucks",
    desc: "Heroes buy a meal and the business donates one to a local shelter. Double impact — the hero eats, someone in need eats too.",
    tag: "Community",
    tagColor: "text-hero-orange",
    tagBg: "bg-hero-orange/10",
  },
  {
    emoji: "🎨",
    title: "Local Art Walk",
    fit: "Galleries, creative shops",
    desc: "Create a quest trail through local art spots. Heroes visit each one, scan QR codes, and earn a special collector badge.",
    tag: "Culture",
    tagColor: "text-hero-purple",
    tagBg: "bg-hero-purple/10",
  },
  {
    emoji: "🏃",
    title: "Fitness Challenge",
    fit: "Gyms, health food shops",
    desc: "Heroes complete a fitness challenge (run, walk, bike) and scan your QR at the finish. Health meets community meets business.",
    tag: "Wellness",
    tagColor: "text-primary",
    tagBg: "bg-primary/10",
  },
];

/* ─── FUNDING TRANSPARENCY ─── */
const fundingBreakdown = [
  { label: "Quest Rewards Pool", pct: 40, color: "bg-primary", desc: "Directly funds HERO points earned by heroes completing quests" },
  { label: "Business Tools & Features", pct: 25, color: "bg-hero-yellow", desc: "Analytics, QR tools, CRM, and the Explore map infrastructure" },
  { label: "Community Programs", pct: 20, color: "bg-hero-purple", desc: "School partnerships, city-wide challenges, and nonprofit quest sponsorships" },
  { label: "Platform & Safety", pct: 15, color: "bg-hero-orange", desc: "Verification systems, moderation, and keeping the platform fair & secure" },
];

/* ─── STRIPE PRICING CONFIG ─── */
const STRIPE_TIERS = {
  growth: {
    price_id: "price_1T9rNU3v5yjCvsy4GptqXSuO",
    product_id: "prod_U87cJ0GJCYsdyu",
    mode: "subscription" as const,
  },
  boost: {
    price_id: "price_1T9rNr3v5yjCvsy4JHbep2F9",
    product_id: "prod_U87dL9Die5BYZt",
    mode: "payment" as const,
  },
};

const pricingTiers = [
  {
    name: "Starter",
    price: "Free",
    period: "",
    desc: "Test the waters — see if Local Hero works for your business",
    color: "text-primary",
    glow: "bg-primary/10",
    border: "border-primary/20",
    features: [
      "1 active quest per month",
      "Basic analytics",
      "QR code at your door",
      "Map listing",
      "Community score",
    ],
    cta: "Get Started Free",
    popular: false,
    stripeKey: null as string | null,
  },
  {
    name: "Growth",
    price: "$49",
    period: "/mo",
    desc: "For businesses ready to make Local Hero a growth channel",
    color: "text-hero-yellow",
    glow: "bg-hero-yellow/10",
    border: "border-hero-yellow/30",
    features: [
      "Unlimited quests",
      "Foot traffic analytics",
      "Custom branded QR codes",
      "Featured in Explore feed",
      "Redemption tracking & CRM",
      "Priority support",
      "Multi-quest campaigns",
    ],
    cta: "Start 14-Day Trial",
    popular: true,
    stripeKey: "growth" as string | null,
  },
  {
    name: "Community Boost",
    price: "$99",
    period: " one-time",
    desc: "30-day featured storefront spot + sponsored quest campaign",
    color: "text-hero-purple",
    glow: "bg-hero-purple/10",
    border: "border-hero-purple/20",
    features: [
      "Featured on Explore map for 30 days",
      "Sponsored quest campaign",
      "Priority map placement",
      "Impact report included",
      "Social media spotlight",
    ],
    cta: "Boost Your Business",
    popular: false,
    stripeKey: "boost" as string | null,
  },
];
const BusinessPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const [activeStory, setActiveStory] = useState(0);
  const [checkoutLoading, setCheckoutLoading] = useState<string | null>(null);

  // Show success/cancel toast
  useState(() => {
    if (searchParams.get("success") === "true") {
      toast.success("Payment successful! Welcome aboard 🎉");
    }
    if (searchParams.get("canceled") === "true") {
      toast.info("Payment canceled — no worries, you can try again anytime.");
    }
  });

  const handleCheckout = async (tierKey: string | null) => {
    if (!tierKey) {
      navigate("/auth");
      return;
    }

    if (!user) {
      toast.info("Please sign in first to subscribe.");
      navigate("/auth");
      return;
    }

    const tier = STRIPE_TIERS[tierKey as keyof typeof STRIPE_TIERS];
    if (!tier) return;

    setCheckoutLoading(tierKey);
    try {
      const { data, error } = await supabase.functions.invoke("create-checkout", {
        body: { priceId: tier.price_id, mode: tier.mode },
      });
      if (error) throw error;
      if (data?.url) {
        window.open(data.url, "_blank");
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to start checkout");
    } finally {
      setCheckoutLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* ─── NAV ─── */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass-strong border-b border-border/50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <button onClick={() => navigate("/")} className="flex items-center gap-2">
            <img src={heroLogo} alt="" className="w-7 h-7" />
            <span className="font-display font-bold text-base text-foreground">Local<span className="text-gradient-hero">Hero</span></span>
          </button>
          <div className="flex items-center gap-3">
            <button onClick={() => navigate("/auth")} className="text-sm text-muted-foreground hover:text-foreground transition-colors">Sign In</button>
            <button onClick={() => navigate("/auth")} className="px-4 py-2 rounded-lg text-sm font-bold bg-gradient-hero-glow text-primary-foreground glow-green">
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* ═══════════ HERO — STORYTELLING ═══════════ */}
      <section className="relative pt-32 pb-24 px-6 overflow-hidden">
        <div className="absolute top-20 left-1/4 w-[500px] h-[400px] bg-primary/8 blur-[150px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 right-1/3 w-[400px] h-[300px] bg-hero-yellow/5 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-5xl mx-auto relative z-10">
          <FadeIn>
            <div className="text-center">
              <div className="inline-flex items-center gap-2 glass-card rounded-full px-4 py-2 mb-6">
                <Store size={14} className="text-primary" />
                <span className="text-xs font-bold text-primary">For Local Businesses</span>
              </div>
              <h1 className="font-display text-4xl sm:text-5xl lg:text-[3.5rem] font-bold leading-[1.1] mb-6">
                <span className="text-gradient-white">Your Storefront Becomes a</span><br />
                <span className="text-gradient-hero">Quest Destination</span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-4">
                Imagine a QR code on your door that turns every passerby into a potential customer — not through ads, but through <span className="text-foreground font-medium">real community action</span>.
              </p>
              <p className="text-sm text-muted-foreground/80 max-w-xl mx-auto mb-10">
                Heroes clean your street, plant trees on your block, and help your neighbors — then walk through your door to claim their reward. 
                You don't buy attention. <span className="text-primary font-semibold">You earn it.</span>
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  onClick={() => navigate("/auth")}
                  className="px-8 py-3.5 rounded-xl font-bold text-sm bg-gradient-hero-glow text-primary-foreground glow-green active:scale-[0.98] transition-all flex items-center gap-2"
                >
                  List Your Business <ArrowRight size={16} />
                </button>
                <button
                  onClick={() => document.getElementById("stories")?.scrollIntoView({ behavior: "smooth" })}
                  className="px-8 py-3.5 rounded-xl font-bold text-sm glass hover:bg-secondary/50 transition-all text-foreground"
                >
                  See Real Examples ↓
                </button>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ═══════════ STOREFRONT SPOT ═══════════ */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <FadeIn>
            <div className="text-center mb-4">
              <div className="inline-flex items-center gap-2 glass rounded-full px-3 py-1.5 mb-4">
                <MapPin size={12} className="text-primary" />
                <span className="text-[10px] font-bold text-primary uppercase tracking-widest">The Storefront Spot</span>
              </div>
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground mb-3">
                A QR Code That <span className="text-gradient-hero">Changes Everything</span>
              </h2>
              <p className="text-muted-foreground max-w-lg mx-auto mb-12">
                Place one code at your entrance. It connects your business to every hero walking by.
              </p>
            </div>
          </FadeIn>

          {/* Visual mockup */}
          <FadeIn delay={0.1}>
            <div className="glass-card rounded-2xl p-8 mb-12 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-hero-yellow/3" />
              <div className="relative z-10 grid md:grid-cols-2 gap-8 items-center">
                {/* Left — illustration */}
                <div className="text-center">
                  <div className="inline-block glass-card rounded-2xl p-6 relative">
                    <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-primary flex items-center justify-center animate-pulse-glow">
                      <Zap size={14} className="text-primary-foreground" />
                    </div>
                    <div className="w-32 h-32 mx-auto rounded-xl bg-secondary flex items-center justify-center mb-4">
                      <QrCode size={64} className="text-primary" />
                    </div>
                    <p className="text-xs font-bold text-foreground">Scan to Start Quest</p>
                    <p className="text-[10px] text-muted-foreground">Bloom & Brew Coffee</p>
                  </div>
                </div>
                {/* Right — features */}
                <div className="space-y-4">
                  {storefrontFeatures.map((f, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                      className="flex items-start gap-3"
                    >
                      <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
                        {f.icon}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-foreground mb-0.5">{f.title}</h4>
                        <p className="text-xs text-muted-foreground leading-relaxed">{f.desc}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ═══════════ REAL STORIES ═══════════ */}
      <section id="stories" className="py-20 px-6 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/[0.02] to-transparent pointer-events-none" />
        <div className="max-w-5xl mx-auto relative z-10">
          <FadeIn>
            <div className="text-center mb-4">
              <div className="inline-flex items-center gap-2 glass rounded-full px-3 py-1.5 mb-4">
                <Quote size={12} className="text-hero-yellow" />
                <span className="text-[10px] font-bold text-hero-yellow uppercase tracking-widest">Real Stories</span>
              </div>
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground mb-3">
                Businesses That <span className="text-gradient-hero">Get It</span>
              </h2>
              <p className="text-muted-foreground max-w-lg mx-auto mb-10">
                These businesses didn't just advertise — they invested in their communities and grew because of it.
              </p>
            </div>
          </FadeIn>

          {/* Story tabs */}
          <div className="flex justify-center gap-2 mb-8">
            {businessStories.map((s, i) => (
              <button
                key={i}
                onClick={() => setActiveStory(i)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                  activeStory === i
                    ? `glass-card ${s.border} border ${s.color}`
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <span className="mr-1.5">{s.emoji}</span>
                <span className="hidden sm:inline">{s.name}</span>
              </button>
            ))}
          </div>

          {/* Active story */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeStory}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.35 }}
            >
              {(() => {
                const s = businessStories[activeStory];
                return (
                  <div className={`glass-card rounded-2xl overflow-hidden border ${s.border}`}>
                    <div className="p-8">
                      {/* Header */}
                      <div className="flex items-center gap-3 mb-6">
                        <div className={`w-12 h-12 rounded-xl ${s.bg} flex items-center justify-center text-2xl`}>
                          {s.emoji}
                        </div>
                        <div>
                          <h3 className="font-display text-lg font-bold text-foreground">{s.name}</h3>
                          <p className="text-xs text-muted-foreground">{s.type}</p>
                        </div>
                      </div>

                      {/* Story */}
                      <div className="grid md:grid-cols-2 gap-8">
                        <div>
                          <p className="text-sm text-muted-foreground leading-relaxed mb-4">{s.story}</p>
                          <div className="border-l-2 border-primary/30 pl-4 mb-6">
                            <p className="text-sm text-foreground font-medium leading-relaxed italic">{s.result}</p>
                          </div>
                          {/* Stats */}
                          <div className="flex gap-4">
                            {s.stats.map((stat, j) => (
                              <div key={j} className="text-center">
                                <p className={`text-xl font-extrabold ${s.color}`}>{stat.value}</p>
                                <p className="text-[10px] text-muted-foreground">{stat.label}</p>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Quest card preview */}
                        <div>
                          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-3">Quest Preview</p>
                          <div className="glass rounded-xl p-5 relative overflow-hidden">
                            <div className={`absolute inset-0 bg-gradient-to-br ${s.bg} opacity-30`} />
                            <div className="relative z-10">
                              <h4 className="font-display text-base font-bold text-foreground mb-2">{s.questExample.title}</h4>
                              <div className="space-y-2 mb-4">
                                <div className="flex items-start gap-2">
                                  <Target size={14} className="text-muted-foreground mt-0.5 shrink-0" />
                                  <p className="text-xs text-muted-foreground">{s.questExample.action}</p>
                                </div>
                                <div className="flex items-start gap-2">
                                  <Gift size={14} className={`${s.color} mt-0.5 shrink-0`} />
                                  <p className="text-xs text-foreground font-semibold">{s.questExample.reward}</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <div className={`w-2 h-2 rounded-full ${s.bg.replace("/10", "")} animate-pulse-glow`} />
                                <span className="text-[10px] font-bold text-muted-foreground">Active Now</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* ═══════════ QUEST TEMPLATES ═══════════ */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <FadeIn>
            <div className="text-center mb-4">
              <div className="inline-flex items-center gap-2 glass rounded-full px-3 py-1.5 mb-4">
                <Lightbulb size={12} className="text-hero-orange" />
                <span className="text-[10px] font-bold text-hero-orange uppercase tracking-widest">Quest Ideas</span>
              </div>
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground mb-3">
                Quests That Match <span className="text-gradient-hero">Your Values</span>
              </h2>
              <p className="text-muted-foreground max-w-lg mx-auto mb-12">
                We only create quests that align with Local Hero's mission: real actions that make communities better. Here's what fits.
              </p>
            </div>
          </FadeIn>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {questTemplates.map((q, i) => (
              <FadeIn key={i} delay={i * 0.06}>
                <div className="glass-card rounded-2xl p-6 h-full group hover:border-primary/20 transition-all relative overflow-hidden">
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-2xl">{q.emoji}</span>
                      <span className={`text-[10px] font-bold ${q.tagColor} ${q.tagBg} px-2 py-0.5 rounded-full`}>{q.tag}</span>
                    </div>
                    <h3 className="font-display text-sm font-bold text-foreground mb-1">{q.title}</h3>
                    <p className="text-[10px] text-muted-foreground/70 mb-2">Best for: {q.fit}</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">{q.desc}</p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ FUNDING TRANSPARENCY ═══════════ */}
      <section className="py-20 px-6 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-hero-purple/[0.02] to-transparent pointer-events-none" />
        <div className="max-w-4xl mx-auto relative z-10">
          <FadeIn>
            <div className="text-center mb-4">
              <div className="inline-flex items-center gap-2 glass rounded-full px-3 py-1.5 mb-4">
                <PiggyBank size={12} className="text-hero-yellow" />
                <span className="text-[10px] font-bold text-hero-yellow uppercase tracking-widest">Where the Money Goes</span>
              </div>
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground mb-3">
                Transparent <span className="text-gradient-hero">Funding</span>
              </h2>
              <p className="text-muted-foreground max-w-lg mx-auto mb-12">
                Every dollar from business partnerships goes back into the ecosystem. Here's exactly how.
              </p>
            </div>
          </FadeIn>

          <FadeIn delay={0.1}>
            <div className="glass-card rounded-2xl p-8 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-hero-yellow/3" />
              <div className="relative z-10">
                {/* Bar */}
                <div className="flex h-6 rounded-full overflow-hidden mb-8 gap-0.5">
                  {fundingBreakdown.map((f, i) => (
                    <motion.div
                      key={i}
                      initial={{ width: 0 }}
                      whileInView={{ width: `${f.pct}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8, delay: i * 0.15 }}
                      className={`${f.color} rounded-full relative group cursor-default`}
                    >
                      <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-primary-foreground">
                        {f.pct}%
                      </span>
                    </motion.div>
                  ))}
                </div>

                {/* Breakdown */}
                <div className="grid sm:grid-cols-2 gap-5">
                  {fundingBreakdown.map((f, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 12 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                      className="flex items-start gap-3"
                    >
                      <div className={`w-3 h-3 rounded-full ${f.color} mt-1.5 shrink-0`} />
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold text-foreground">{f.label}</h4>
                          <span className="text-xs font-bold text-muted-foreground">{f.pct}%</span>
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed">{f.desc}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Pledge */}
                <div className="mt-8 pt-6 border-t border-border/50 text-center">
                  <div className="inline-flex items-center gap-2 mb-2">
                    <Shield size={16} className="text-primary" />
                    <span className="text-sm font-bold text-foreground">Our Pledge</span>
                  </div>
                  <p className="text-xs text-muted-foreground max-w-md mx-auto">
                    We publish quarterly impact reports showing exactly where every dollar went. 
                    No hidden fees, no investor bloat — <span className="text-foreground font-medium">your contribution directly powers community action.</span>
                  </p>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ═══════════ REVENUE STREAMS ═══════════ */}
      <section className="py-20 px-6 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-hero-yellow/[0.02] to-transparent pointer-events-none" />
        <div className="max-w-5xl mx-auto relative z-10">
          <FadeIn>
            <div className="text-center mb-4">
              <div className="inline-flex items-center gap-2 glass rounded-full px-3 py-1.5 mb-4">
                <TrendingUp size={12} className="text-hero-yellow" />
                <span className="text-[10px] font-bold text-hero-yellow uppercase tracking-widest">Revenue Model</span>
              </div>
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground mb-3">
                7 Revenue Streams. <span className="text-gradient-hero">One Platform.</span>
              </h2>
              <p className="text-muted-foreground max-w-lg mx-auto mb-12">
                Multiple layered monetization streams ensure sustainable growth — no single point of dependency.
              </p>
            </div>
          </FadeIn>

          {/* Revenue cards */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
            {[
              {
                emoji: "📍",
                title: "Sponsored Discovery Drops",
                desc: "Local businesses pay to create geo-located drops — per drop, per claim, or as a recurring subscription for campaigns.",
                example: "\"First 20 visitors get 50 HERO + free coffee\"",
                tag: "Launch",
                tagColor: "text-primary",
                tagBg: "bg-primary/10",
                revenue: "Per-drop fees, claim fees, subscriptions",
              },
              {
                emoji: "⭐",
                title: "Premium Subscriptions",
                desc: "VIP explorer accounts with early access to rare drops, exclusive quests, special avatars, NFTs, and badges.",
                example: "$5–$10/month for VIP Explorer status",
                tag: "Launch",
                tagColor: "text-primary",
                tagBg: "bg-primary/10",
                revenue: "Monthly recurring revenue",
              },
              {
                emoji: "🪙",
                title: "Token Economy",
                desc: "HERO tokens with internal redemption value (quests, items, experiences) and future external value via DEX/staking.",
                example: "Staking pools, liquidity, NFT collectibles",
                tag: "Launch",
                tagColor: "text-primary",
                tagBg: "bg-primary/10",
                revenue: "Token fees, staking, liquidity pools",
              },
              {
                emoji: "🏙️",
                title: "City & Event Partnerships",
                desc: "Partner with cities for gamified tourism and festivals for sponsored drop campaigns — flat fees or revenue share.",
                example: "\"Explore Berlin\" city-sponsored quest series",
                tag: "Phase 2",
                tagColor: "text-hero-yellow",
                tagBg: "bg-hero-yellow/10",
                revenue: "Sponsorship fees, revenue share",
              },
              {
                emoji: "🛠️",
                title: "Creator Marketplace",
                desc: "Creators and businesses design custom quests. Platform takes a fee or revenue share per quest created.",
                example: "AI agents auto-generate quests at scale",
                tag: "Phase 2",
                tagColor: "text-hero-yellow",
                tagBg: "bg-hero-yellow/10",
                revenue: "Platform fees, revenue share",
              },
              {
                emoji: "🎁",
                title: "Merch & Collectibles",
                desc: "Limited edition NFTs, hero gear, AR skins from completing rare quests. Physical merch for top achievers.",
                example: "Legendary drop → exclusive digital collectible",
                tag: "Phase 3",
                tagColor: "text-hero-purple",
                tagBg: "bg-hero-purple/10",
                revenue: "NFT sales, merch, AR skin purchases",
              },
              {
                emoji: "📊",
                title: "Analytics & Data Insights",
                desc: "Aggregate anonymous engagement data — visited areas, quest effectiveness, drop redemption rates — sold to brands and cities.",
                example: "Heatmaps of community engagement by district",
                tag: "Phase 3",
                tagColor: "text-hero-purple",
                tagBg: "bg-hero-purple/10",
                revenue: "SaaS analytics subscriptions",
              },
            ].map((stream, i) => (
              <FadeIn key={i} delay={i * 0.06}>
                <div className="glass-card rounded-2xl p-6 h-full group hover:border-primary/20 transition-all relative overflow-hidden">
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-2xl">{stream.emoji}</span>
                      <span className={`text-[10px] font-bold ${stream.tagColor} ${stream.tagBg} px-2 py-0.5 rounded-full`}>{stream.tag}</span>
                    </div>
                    <h3 className="font-display text-sm font-bold text-foreground mb-2">{stream.title}</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed mb-3">{stream.desc}</p>
                    <div className="glass rounded-lg p-2.5 mb-3">
                      <p className="text-[10px] text-foreground/80 italic">💡 {stream.example}</p>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Coins size={10} className="text-hero-yellow" />
                      <p className="text-[10px] text-muted-foreground">{stream.revenue}</p>
                    </div>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>

          {/* Monetization Stack Timeline */}
          <FadeIn delay={0.2}>
            <div className="glass-card rounded-2xl p-8 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-hero-yellow/3 to-hero-purple/5" />
              <div className="relative z-10">
                <h3 className="font-display text-lg font-bold text-foreground text-center mb-6">
                  Monetization <span className="text-gradient-hero">Rollout</span>
                </h3>
                <div className="grid md:grid-cols-3 gap-5">
                  {[
                    {
                      phase: "🚀 Launch",
                      color: "text-primary",
                      border: "border-primary/30",
                      bg: "bg-primary/5",
                      items: ["Sponsored Discovery Drops", "Token-based reward system", "Premium explorer accounts"],
                      status: "ACTIVE",
                      statusColor: "text-primary bg-primary/10",
                    },
                    {
                      phase: "📈 Growth",
                      color: "text-hero-yellow",
                      border: "border-hero-yellow/30",
                      bg: "bg-hero-yellow/5",
                      items: ["City & event partnerships", "Creator / quest marketplace", "Staking & liquidity pools"],
                      status: "Q3 2026",
                      statusColor: "text-hero-yellow bg-hero-yellow/10",
                    },
                    {
                      phase: "🌍 Scale",
                      color: "text-hero-purple",
                      border: "border-hero-purple/30",
                      bg: "bg-hero-purple/5",
                      items: ["Merch & collectibles store", "Analytics SaaS for brands", "White-label city solutions"],
                      status: "2027",
                      statusColor: "text-hero-purple bg-hero-purple/10",
                    },
                  ].map((phase, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 16 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.15 }}
                      className={`rounded-xl border ${phase.border} ${phase.bg} p-5`}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <h4 className={`font-display text-sm font-bold ${phase.color}`}>{phase.phase}</h4>
                        <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${phase.statusColor}`}>{phase.status}</span>
                      </div>
                      <ul className="space-y-2">
                        {phase.items.map((item, j) => (
                          <li key={j} className="flex items-center gap-2 text-xs text-muted-foreground">
                            <CheckCircle2 size={12} className={phase.color} />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </motion.div>
                  ))}
                </div>

                <div className="mt-6 pt-5 border-t border-border/50 text-center">
                  <p className="text-xs text-muted-foreground">
                    💡 <span className="text-foreground font-medium">Strategy:</span> Monetize real-world impact first (sponsored drops + city partnerships). 
                    Token economy adds stickiness + secondary revenue over time.
                  </p>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ═══════════ HOW IT WORKS ═══════════ */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <FadeIn>
            <div className="text-center mb-14">
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground mb-3">
                Get Started in <span className="text-gradient-hero">4 Steps</span>
              </h2>
            </div>
          </FadeIn>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: <Store size={20} />, title: "Claim Your Spot", desc: "Register your business and get your unique Storefront QR code" },
              { icon: <Lightbulb size={20} />, title: "Design a Quest", desc: "Choose from templates or create a custom quest tied to your location" },
              { icon: <Coins size={20} />, title: "Fund Rewards", desc: "Add HERO points or in-store perks — you decide the budget" },
              { icon: <TrendingUp size={20} />, title: "Watch It Grow", desc: "Track completions, foot traffic, and community impact in real-time" },
            ].map((step, i) => (
              <FadeIn key={i} delay={i * 0.1}>
                <div className="glass-card rounded-2xl p-6 text-center relative group hover:border-primary/20 transition-all h-full">
                  {i < 3 && (
                    <div className="hidden lg:block absolute top-1/2 -right-3 text-muted-foreground/30 z-20">
                      <ChevronRight size={14} />
                    </div>
                  )}
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4 text-primary">
                    {step.icon}
                  </div>
                  <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">Step {i + 1}</div>
                  <h3 className="font-display text-sm font-bold text-foreground mb-2">{step.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{step.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ WHY IT WORKS ═══════════ */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <FadeIn>
            <div className="glass-card rounded-2xl p-8 lg:p-12 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-hero-yellow/5" />
              <div className="relative z-10">
                <div className="text-center mb-10">
                  <h2 className="font-display text-3xl font-bold text-foreground mb-3">
                    Why This <span className="text-gradient-hero">Actually Works</span>
                  </h2>
                  <p className="text-sm text-muted-foreground max-w-md mx-auto">
                    Traditional ads interrupt. Local Hero quests <span className="text-foreground font-medium">attract</span>.
                  </p>
                </div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[
                    { icon: <Heart size={18} />, title: "Emotional Connection", desc: "Customers who do good for your neighborhood feel bonded to your business" },
                    { icon: <Users size={18} />, title: "Pre-Qualified Traffic", desc: "Heroes are active, community-minded people — the best kind of customer" },
                    { icon: <Megaphone size={18} />, title: "Organic Word of Mouth", desc: "Every quest completion is shared on the feed — free marketing at scale" },
                    { icon: <BarChart3 size={18} />, title: "Measurable ROI", desc: "Track every scan, visit, and redemption — no vanity metrics" },
                    { icon: <Leaf size={18} />, title: "Brand with Purpose", desc: "Be the business that cleans streets, plants trees, and feeds neighbors" },
                    { icon: <HandHeart size={18} />, title: "Community Investment", desc: "Your spend doesn't go to ad networks — it goes directly to community impact" },
                  ].map((b, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
                        {b.icon}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-foreground mb-1">{b.title}</h4>
                        <p className="text-xs text-muted-foreground leading-relaxed">{b.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ═══════════ PRICING ═══════════ */}
      <section id="pricing" className="py-20 px-6 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/[0.02] to-transparent pointer-events-none" />
        <div className="max-w-5xl mx-auto relative z-10">
          <FadeIn>
            <div className="text-center mb-14">
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground mb-3">
                Simple, <span className="text-gradient-hero">Honest Pricing</span>
              </h2>
              <p className="text-muted-foreground max-w-lg mx-auto">Start free. No credit card. Upgrade when you see results.</p>
            </div>
          </FadeIn>

          <div className="grid md:grid-cols-3 gap-5">
            {pricingTiers.map((tier, i) => (
              <FadeIn key={i} delay={i * 0.1}>
                <div className={`glass-card rounded-2xl p-7 relative overflow-hidden h-full flex flex-col ${
                  tier.popular ? `border-2 ${tier.border}` : ""
                }`}>
                  {tier.popular && (
                    <div className="absolute top-0 right-0 bg-hero-yellow text-accent-foreground text-[10px] font-bold px-3 py-1 rounded-bl-xl">
                      MOST POPULAR
                    </div>
                  )}
                  <div className="mb-6">
                    <div className={`w-10 h-10 rounded-xl ${tier.glow} flex items-center justify-center ${tier.color} mb-4`}>
                      <Zap size={18} />
                    </div>
                    <h3 className="font-display text-lg font-bold text-foreground">{tier.name}</h3>
                    <div className="flex items-baseline gap-1 mt-2">
                      <span className={`text-3xl font-extrabold ${tier.color}`}>{tier.price}</span>
                      {tier.period && <span className="text-sm text-muted-foreground">{tier.period}</span>}
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">{tier.desc}</p>
                  </div>
                  <ul className="space-y-3 flex-1 mb-6">
                    {tier.features.map((f, j) => (
                      <li key={j} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <CheckCircle2 size={14} className={`${tier.color} mt-0.5 shrink-0`} />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <button
                    onClick={() => handleCheckout(tier.stripeKey)}
                    disabled={checkoutLoading === tier.stripeKey}
                    className={`w-full py-3 rounded-xl font-bold text-sm transition-all active:scale-[0.98] disabled:opacity-60 ${
                      tier.popular
                        ? "bg-gradient-hero-glow text-primary-foreground glow-green"
                        : "glass hover:bg-secondary/50 text-foreground"
                    }`}
                  >
                    {checkoutLoading === tier.stripeKey ? "Loading…" : tier.cta}
                  </button>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ FINAL CTA ═══════════ */}
      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto">
          <FadeIn>
            <div className="glass-card rounded-2xl p-10 text-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-hero-yellow/5" />
              <div className="relative z-10">
                <Globe size={32} className="text-primary mx-auto mb-4" />
                <h2 className="font-display text-2xl sm:text-3xl font-bold text-foreground mb-3">
                  Your Neighborhood Needs a Hero.
                </h2>
                <p className="text-lg text-muted-foreground mb-2">
                  <span className="text-foreground font-medium">That hero could walk through your door today.</span>
                </p>
                <p className="text-sm text-muted-foreground mb-8 max-w-md mx-auto">
                  Join the businesses that are growing by giving back. Free to start. No risk. Real results.
                </p>
                <button
                  onClick={() => navigate("/auth")}
                  className="px-10 py-3.5 rounded-xl font-bold text-sm bg-gradient-hero-glow text-primary-foreground glow-green active:scale-[0.98] transition-all inline-flex items-center gap-2"
                >
                  Get Your Storefront Spot <ArrowRight size={16} />
                </button>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ═══════════ FOOTER ═══════════ */}
      <footer className="border-t border-border py-8">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <img src={heroLogo} alt="" className="w-6 h-6" />
            <span className="font-display font-bold text-sm text-foreground">Local<span className="text-gradient-hero">Hero</span></span>
          </div>
          <div className="flex items-center gap-5">
            <button onClick={() => navigate("/")} className="text-sm text-muted-foreground hover:text-foreground transition-colors">Home</button>
            <button onClick={() => navigate("/heropaper")} className="text-sm text-muted-foreground hover:text-foreground transition-colors">HeroPaper</button>
            <button onClick={() => navigate("/investors")} className="text-sm text-muted-foreground hover:text-foreground transition-colors">Investors</button>
          </div>
          <p className="text-xs text-muted-foreground">© 2026 Local Hero · Fair by design</p>
        </div>
      </footer>
    </div>
  );
};

export default BusinessPage;
