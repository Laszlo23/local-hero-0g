import { useState, useEffect } from "react";
import { Trophy, Users, Clock, Flame, ChevronRight, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  Challenge,
  getActiveChallenges,
  getTimeRemaining,
  getUserContributions,
} from "@/lib/challenges";

const goalLabels: Record<string, string> = {
  trees_planted: "trees planted",
  neighbors_helped: "neighbors helped",
  miles_biked: "miles biked",
  businesses_supported: "businesses supported",
};

export default function CommunityChallenges() {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);
  const [contributions, setContributions] = useState<Record<string, number>>({});

  const loadChallenges = async () => {
    const data = await getActiveChallenges();
    setChallenges(data);
    // Load user contributions for each
    const contribs: Record<string, number> = {};
    await Promise.all(
      data.map(async (c) => {
        contribs[c.id] = await getUserContributions(c.id);
      })
    );
    setContributions(contribs);
    setLoading(false);
  };

  useEffect(() => {
    loadChallenges();

    // Realtime updates for live progress
    const channel = supabase
      .channel("challenges-live")
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "community_challenges" },
        (payload) => {
          setChallenges((prev) =>
            prev.map((c) =>
              c.id === payload.new.id ? { ...c, ...(payload.new as Partial<Challenge>) } : c
            )
          );
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 size={20} className="animate-spin text-primary" />
      </div>
    );
  }

  if (challenges.length === 0) {
    return (
      <div className="glass-card rounded-2xl p-6 text-center">
        <Trophy size={32} className="text-muted-foreground mx-auto mb-2" />
        <p className="text-sm font-semibold text-foreground">No active challenges</p>
        <p className="text-xs text-muted-foreground">Check back soon for new community goals!</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 mb-1">
        <Flame size={16} className="text-accent" />
        <h2 className="font-display text-lg font-bold text-foreground">Active Challenges</h2>
      </div>

      {challenges.map((challenge) => {
        const pct = Math.min(100, Math.round((challenge.goal_current / challenge.goal_target) * 100));
        const timeLeft = getTimeRemaining(challenge.ends_at);
        const userContrib = contributions[challenge.id] || 0;

        return (
          <div key={challenge.id} className="glass-card rounded-2xl p-4 space-y-3">
            {/* Header */}
            <div className="flex items-start gap-3">
              <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center text-xl shrink-0">
                {challenge.emoji}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-sm text-foreground">{challenge.title}</h3>
                <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">
                  {challenge.description}
                </p>
              </div>
            </div>

            {/* Progress */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-foreground">
                  {challenge.goal_current.toLocaleString()} / {challenge.goal_target.toLocaleString()}{" "}
                  <span className="text-muted-foreground font-normal">
                    {goalLabels[challenge.goal_type] || challenge.goal_type}
                  </span>
                </span>
                <span className="font-bold text-primary">{pct}%</span>
              </div>
              <Progress value={pct} className="h-2.5 bg-secondary" />
            </div>

            {/* Meta row */}
            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                <Users size={10} />
                <span>{challenge.participant_count} heroes</span>
              </div>
              <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                <Clock size={10} />
                <span>{timeLeft}</span>
              </div>
              <Badge variant="secondary" className="text-[9px] px-1.5 py-0 h-4">
                🏆 {challenge.reward_points} pts
              </Badge>
              {challenge.reward_badge && (
                <Badge className="text-[9px] px-1.5 py-0 h-4 bg-accent/20 text-accent border-accent/30">
                  🎖️ {challenge.reward_badge}
                </Badge>
              )}
            </div>

            {/* User contribution */}
            {userContrib > 0 && (
              <div className="flex items-center gap-2 pt-1 border-t border-border/50">
                <span className="text-[10px] text-primary font-semibold">
                  ✨ Your contribution: {userContrib} {goalLabels[challenge.goal_type] || ""}
                </span>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
