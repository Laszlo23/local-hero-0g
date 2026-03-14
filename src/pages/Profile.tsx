import { useState, useEffect } from "react";
import ShareMilestoneModal from "@/components/ShareMilestoneModal";
import type { MilestoneCardData } from "@/lib/milestone-card";
import { Award, ChevronRight, Edit3, Flame, LogOut, Settings, Share2, Shield, Star, QrCode, FileCode, Gem, Globe, Twitter, Instagram, Github, Linkedin, MessageCircle, ExternalLink, Check, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import NotificationCenter from "@/components/NotificationCenter";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { loadProfile, saveProfile, type SocialKey } from "@/lib/profile";
import { useAuth } from "@/contexts/AuthContext";
import { useUserStats } from "@/hooks/use-user-stats";
import { getRecentQuests } from "@/lib/quests";
import { toast } from "@/hooks/use-toast";
import { formatDistanceToNow } from "date-fns";

// Badges now loaded from founder_badges table

const socialConfig: { key: SocialKey; icon: React.ReactNode; label: string; placeholder: string; color: string }[] = [
  { key: "twitter", icon: <Twitter size={14} />, label: "Twitter / X", placeholder: "@handle", color: "text-sky-400" },
  { key: "instagram", icon: <Instagram size={14} />, label: "Instagram", placeholder: "@handle", color: "text-pink-400" },
  { key: "github", icon: <Github size={14} />, label: "GitHub", placeholder: "username", color: "text-foreground" },
  { key: "linkedin", icon: <Linkedin size={14} />, label: "LinkedIn", placeholder: "profile URL", color: "text-blue-400" },
  { key: "website", icon: <Globe size={14} />, label: "Website", placeholder: "https://...", color: "text-emerald-400" },
  { key: "discord", icon: <MessageCircle size={14} />, label: "Discord", placeholder: "user#1234", color: "text-violet-400" },
];

const defaultSocials: Record<SocialKey, string> = {
  twitter: "", instagram: "", github: "", linkedin: "", website: "", discord: "",
};

const Profile = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { stats } = useUserStats();
  const [loading, setLoading] = useState(true);
  const [editingSocials, setEditingSocials] = useState(false);
  const [bio, setBio] = useState("");
  const [editingBio, setEditingBio] = useState(false);
  const [tempBio, setTempBio] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [socials, setSocials] = useState<Record<SocialKey, string>>(defaultSocials);
  const [tempSocials, setTempSocials] = useState<Record<SocialKey, string>>(defaultSocials);
  const [recentQuests, setRecentQuests] = useState<any[]>([]);
  const [showShareModal, setShowShareModal] = useState(false);

  const userEmail = user?.email ?? "";
  const userDisplayName = stats.display_name || displayName || user?.user_metadata?.display_name || userEmail.split("@")[0] || "Hero";
  const avatarUrl = stats.avatar_url || user?.user_metadata?.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(userDisplayName)}`;

  useEffect(() => {
    loadProfile().then((p) => {
      setBio(p.bio);
      setTempBio(p.bio);
      setDisplayName(p.display_name);
      setSocials(p.socials);
      setTempSocials(p.socials);
      setLoading(false);
    });
    getRecentQuests(10).then(setRecentQuests);
  }, []);

  const activeSocials = socialConfig.filter((s) => socials[s.key]);

  const handleSaveBio = async () => {
    setBio(tempBio);
    setEditingBio(false);
    await saveProfile({ bio: tempBio });
    toast({ title: "Bio saved ✨" });
  };

  const handleSaveSocials = async () => {
    setSocials(tempSocials);
    setEditingSocials(false);
    await saveProfile({ socials: tempSocials });
    toast({ title: "Socials saved 🔗" });
  };

  const handleCancelSocials = () => {
    setTempSocials(socials);
    setEditingSocials(false);
  };

  return (
    <div className="px-5 pt-12 space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold text-foreground">Profile</h1>
        <button className="w-9 h-9 rounded-xl glass flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
          <Settings size={16} />
        </button>
      </div>

      {/* Profile Card */}
      <div className="glass-card rounded-2xl p-6 text-center relative overflow-hidden">
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-48 h-48 bg-hero-green-glow/10 blur-[60px] rounded-full" />
        <div className="relative z-10">
          <img src={avatarUrl} alt={userDisplayName} className="w-20 h-20 rounded-full mx-auto mb-3 object-cover ring-4 ring-primary/30 glow-green" />
          <h2 className="font-display text-xl font-bold text-foreground">{userDisplayName}</h2>
          <p className="text-sm text-muted-foreground mb-1">{userEmail}</p>
          <div className="mb-4" />
          <div className="flex justify-center gap-5">
            <ProfileStat icon={<Star size={14} />} label="HERO" value={stats.total_points.toLocaleString()} />
            <ProfileStat icon={<Shield size={14} />} label="Level" value={String(stats.level)} />
            <ProfileStat icon={<Flame size={14} />} label="Streak" value={String(stats.streak)} />
            <ProfileStat icon={<Award size={14} />} label="Quests" value={String(stats.quests_completed)} />
          </div>
        </div>
      </div>

      {/* Bio / Intro */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-display text-lg font-bold text-foreground">About</h3>
          <button
            onClick={() => { setEditingBio(!editingBio); setTempBio(bio); }}
            className="text-xs text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
          >
            <Edit3 size={12} />
            {editingBio ? "Cancel" : "Edit"}
          </button>
        </div>
        {editingBio ? (
          <div className="space-y-2">
            <Textarea
              value={tempBio}
              onChange={(e) => setTempBio(e.target.value)}
              placeholder="Tell the community about yourself..."
              className="bg-secondary border-border text-foreground text-sm resize-none rounded-xl"
              rows={3}
              maxLength={160}
            />
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-muted-foreground">{tempBio.length}/160</span>
              <Button size="sm" onClick={handleSaveBio} className="rounded-lg text-xs h-8 bg-primary text-primary-foreground">
                <Check size={12} className="mr-1" /> Save
              </Button>
            </div>
          </div>
        ) : (
          <div className="glass-card rounded-xl p-4">
            <p className="text-sm text-muted-foreground leading-relaxed">
              {loading ? "Loading..." : (bio || "Tap edit to add a bio...")}
            </p>
          </div>
        )}
      </div>

      {/* Socials */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-display text-lg font-bold text-foreground">Socials</h3>
          <button
            onClick={() => {
              if (editingSocials) handleCancelSocials();
              else { setEditingSocials(true); setTempSocials(socials); }
            }}
            className="text-xs text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
          >
            <Edit3 size={12} />
            {editingSocials ? "Cancel" : "Edit"}
          </button>
        </div>

        {editingSocials ? (
          <div className="space-y-2">
            {socialConfig.map((s) => (
              <div key={s.key} className="glass-card rounded-xl p-3 flex items-center gap-3">
                <div className={`w-8 h-8 rounded-lg bg-secondary flex items-center justify-center ${s.color}`}>
                  {s.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] text-muted-foreground font-medium mb-1">{s.label}</p>
                  <Input
                    value={tempSocials[s.key]}
                    onChange={(e) => setTempSocials({ ...tempSocials, [s.key]: e.target.value })}
                    placeholder={s.placeholder}
                    className="h-7 text-xs bg-background/50 border-border rounded-lg"
                  />
                </div>
              </div>
            ))}
            <Button onClick={handleSaveSocials} className="w-full rounded-xl bg-primary text-primary-foreground font-bold text-sm">
              <Check size={14} className="mr-1" /> Save Socials
            </Button>
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {activeSocials.length > 0 ? (
              activeSocials.map((s) => (
                <div key={s.key} className="glass-card rounded-xl px-3 py-2 flex items-center gap-2 cursor-pointer hover:border-primary/30 transition-all group">
                  <span className={`${s.color} group-hover:scale-110 transition-transform`}>{s.icon}</span>
                  <span className="text-xs font-semibold text-foreground">{socials[s.key]}</span>
                  <ExternalLink size={10} className="text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              ))
            ) : (
              <p className="text-xs text-muted-foreground">
                {loading ? "Loading..." : "No socials added yet. Tap edit to add yours!"}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Web3 Actions */}
      <div className="grid grid-cols-3 gap-2.5">
        <button onClick={() => navigate("/app/create-qr")} className="glass-card-hover rounded-xl p-3.5 text-center transition-all active:scale-[0.97]">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center mx-auto mb-1.5">
            <QrCode size={18} className="text-cyan-400" />
          </div>
          <p className="text-[10px] font-bold text-foreground">Create QR</p>
        </button>
        <button onClick={() => navigate("/app/mint")} className="glass-card-hover rounded-xl p-3.5 text-center transition-all active:scale-[0.97]">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 flex items-center justify-center mx-auto mb-1.5">
            <Gem size={18} className="text-amber-400" />
          </div>
          <p className="text-[10px] font-bold text-foreground">Mint NFT</p>
        </button>
        <button onClick={() => navigate("/app/contracts")} className="glass-card-hover rounded-xl p-3.5 text-center transition-all active:scale-[0.97]">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center mx-auto mb-1.5">
            <FileCode size={18} className="text-purple-400" />
          </div>
          <p className="text-[10px] font-bold text-foreground">Contracts</p>
        </button>
      </div>

      {/* Badges */}
      <div>
        <h3 className="font-display text-lg font-bold text-foreground mb-3">Badges</h3>
        <BadgesSection />
      </div>

      {/* Impact */}
      <div>
        <h3 className="font-display text-lg font-bold text-foreground mb-3">Impact</h3>
        <div className="grid grid-cols-2 gap-3">
          <ImpactStat emoji="🌳" value={String(stats.trees_planted)} label="Trees Planted" />
          <ImpactStat emoji="🤝" value={String(stats.neighbors_helped)} label="Neighbors Helped" />
          <ImpactStat emoji="🏪" value={String(stats.businesses_supported)} label="Businesses Supported" />
          <ImpactStat emoji="🚴" value={`${stats.miles_biked} mi`} label="Biked, Not Driven" />
        </div>
      </div>

      {/* Recent */}
      <div>
        <h3 className="font-display text-lg font-bold text-foreground mb-3">Recent</h3>
        <div className="space-y-2">
          {recentQuests.length > 0 ? recentQuests.map((q: any, i: number) => (
            <div key={q.id || i} className="glass-card-hover rounded-xl p-3.5 flex items-center gap-3 cursor-pointer">
              <div className="w-10 h-10 rounded-lg bg-hero-green-light flex items-center justify-center text-lg">{q.quest_emoji}</div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm text-foreground truncate">{q.quest_title}</p>
                <p className="text-xs text-muted-foreground">{formatDistanceToNow(new Date(q.completed_at), { addSuffix: true })}</p>
              </div>
              <span className="text-xs font-bold text-primary">+{q.points_awarded}</span>
            </div>
          )) : (
            <p className="text-sm text-muted-foreground text-center py-4">Complete quests to see them here!</p>
          )}
        </div>
      </div>

      {/* Notifications */}
      <NotificationCenter />

      {/* Actions */}
      <div className="space-y-2 pb-4">
        <ActionRow icon={<Share2 size={16} />} label="Share Profile" onClick={() => setShowShareModal(true)} />
        <ActionRow icon={<LogOut size={16} />} label="Log Out" destructive onClick={async () => { await signOut(); navigate("/"); }} />
      </div>
      <ShareMilestoneModal
        open={showShareModal}
        onClose={() => setShowShareModal(false)}
        data={{
          type: "level_up",
          displayName: userDisplayName,
          title: `Level ${stats.level} Hero`,
          subtitle: `${stats.quests_completed} quests completed`,
          points: stats.total_points,
          level: stats.level,
          streak: stats.streak,
          questsCompleted: stats.quests_completed,
          treesPlanted: stats.trees_planted,
          neighborsHelped: stats.neighbors_helped,
        } as MilestoneCardData}
      />
    </div>
  );
};

const ProfileStat = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) => (
  <div className="text-center">
    <div className="flex items-center justify-center gap-1 text-primary mb-0.5">{icon}</div>
    <p className="text-lg font-bold text-foreground">{value}</p>
    <p className="text-[10px] text-muted-foreground font-medium">{label}</p>
  </div>
);

const ImpactStat = ({ emoji, value, label }: { emoji: string; value: string; label: string }) => (
  <div className="glass-card rounded-xl p-4">
    <span className="text-2xl">{emoji}</span>
    <p className="text-xl font-bold text-foreground mt-1">{value}</p>
    <p className="text-xs text-muted-foreground font-medium">{label}</p>
  </div>
);

const BadgesSection = () => {
  const [badges, setBadges] = useState<{ badge_type: string; tier: string }[]>([]);
  useEffect(() => {
    const load = async () => {
      const { getDeviceId } = await import("@/lib/profile");
      const { data } = await (await import("@/integrations/supabase/client")).supabase
        .from("founder_badges")
        .select("badge_type, tier")
        .eq("device_id", getDeviceId());
      if (data) setBadges(data);
    };
    load();
  }, []);

  const tierEmoji: Record<string, string> = { bronze: "🥉", silver: "🥈", gold: "🥇", platinum: "💎" };

  if (badges.length === 0) {
    return <p className="text-xs text-muted-foreground">Complete quests to earn badges!</p>;
  }

  return (
    <div className="flex gap-2 flex-wrap">
      {badges.map((b, i) => (
        <div key={i} className="glass-card rounded-xl px-3 py-2 flex items-center gap-1.5 text-sm">
          <span>{tierEmoji[b.tier] || "🏅"}</span>
          <span className="text-xs font-semibold text-foreground capitalize">{b.badge_type.replace(/_/g, " ")}</span>
        </div>
      ))}
    </div>
  );
};

const ActionRow = ({ icon, label, destructive, onClick }: { icon: React.ReactNode; label: string; destructive?: boolean; onClick?: () => void }) => (
  <button onClick={onClick} className="w-full glass-card-hover rounded-xl p-3.5 flex items-center gap-3">
    <span className={destructive ? "text-destructive" : "text-muted-foreground"}>{icon}</span>
    <span className={`text-sm font-semibold flex-1 text-left ${destructive ? "text-destructive" : "text-foreground"}`}>{label}</span>
    <ChevronRight size={14} className="text-muted-foreground" />
  </button>
);

export default Profile;
