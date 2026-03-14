import { useState, useEffect, useCallback } from "react";
import { Loader2, Zap, Trophy, TreePine, Star, Users } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { getDeviceId } from "@/lib/profile";
import {
  getFeed,
  getReactionsForActivities,
  toggleReaction,
  REACTION_EMOJIS,
  type ActivityEvent,
  type Reaction,
} from "@/lib/activity-feed";
import { formatDistanceToNow } from "date-fns";

const eventTypeIcons: Record<string, React.ReactNode> = {
  quest_completed: <Zap size={14} className="text-accent" />,
  badge_earned: <Trophy size={14} className="text-accent" />,
  level_up: <Star size={14} className="text-accent" />,
  tree_planted: <TreePine size={14} className="text-primary" />,
  streak_milestone: <Zap size={14} className="text-primary" />,
  joined: <Users size={14} className="text-primary" />,
};

const ActivityFeed = () => {
  const [events, setEvents] = useState<ActivityEvent[]>([]);
  const [reactions, setReactions] = useState<Record<string, Reaction[]>>({});
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const deviceId = getDeviceId();

  const loadFeed = useCallback(async (offset = 0) => {
    setLoading(true);
    const data = await getFeed(30, offset);
    const newEvents = offset === 0 ? data : [...events, ...data];
    setEvents(newEvents);
    setHasMore(data.length === 30);

    const ids = data.map((e) => e.id);
    const rxns = await getReactionsForActivities(ids);
    setReactions((prev) => (offset === 0 ? rxns : { ...prev, ...rxns }));
    setLoading(false);
  }, [events]);

  useEffect(() => {
    loadFeed(0);

    // Realtime subscription
    const channel = supabase
      .channel("activity-feed-live")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "activity_feed" }, (payload) => {
        const newEvent = payload.new as ActivityEvent;
        setEvents((prev) => [newEvent, ...prev]);
      })
      .on("postgres_changes", { event: "*", schema: "public", table: "activity_reactions" }, () => {
        // Refresh reactions for visible events
        setEvents((prev) => {
          const ids = prev.map((e) => e.id);
          getReactionsForActivities(ids).then(setReactions);
          return prev;
        });
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  const handleReaction = async (activityId: string, emoji: string) => {
    // Optimistic update
    setReactions((prev) => {
      const current = prev[activityId] || [];
      const existing = current.find((r) => r.device_id === deviceId && r.reaction === emoji);
      if (existing) {
        return { ...prev, [activityId]: current.filter((r) => r.id !== existing.id) };
      }
      return {
        ...prev,
        [activityId]: [...current, { id: "temp", activity_id: activityId, device_id: deviceId, reaction: emoji, created_at: new Date().toISOString() }],
      };
    });
    await toggleReaction(activityId, emoji);
  };

  if (loading && events.length === 0) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 size={20} className="animate-spin text-primary" />
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="text-center py-12 space-y-2">
        <p className="text-2xl">🌱</p>
        <p className="text-sm font-semibold text-foreground">No activity yet</p>
        <p className="text-xs text-muted-foreground">Complete a quest to be the first on the feed!</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {events.map((event) => (
        <FeedCard
          key={event.id}
          event={event}
          reactions={reactions[event.id] || []}
          deviceId={deviceId}
          onReact={handleReaction}
        />
      ))}
      {hasMore && !loading && (
        <button
          onClick={() => loadFeed(events.length)}
          className="w-full py-3 rounded-xl glass text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors"
        >
          Load more...
        </button>
      )}
      {loading && (
        <div className="flex justify-center py-4">
          <Loader2 size={20} className="animate-spin text-primary" />
        </div>
      )}
    </div>
  );
};

const FeedCard = ({
  event,
  reactions,
  deviceId,
  onReact,
}: {
  event: ActivityEvent;
  reactions: Reaction[];
  deviceId: string;
  onReact: (activityId: string, emoji: string) => void;
}) => {
  const [showReactions, setShowReactions] = useState(false);

  // Group reactions by emoji
  const reactionCounts: Record<string, { count: number; hasOwn: boolean }> = {};
  for (const r of reactions) {
    if (!reactionCounts[r.reaction]) reactionCounts[r.reaction] = { count: 0, hasOwn: false };
    reactionCounts[r.reaction].count++;
    if (r.device_id === deviceId) reactionCounts[r.reaction].hasOwn = true;
  }

  const timeAgo = formatDistanceToNow(new Date(event.created_at), { addSuffix: true });

  return (
    <div className="glass-card rounded-2xl p-4 space-y-2.5">
      <div className="flex items-start gap-3">
        {/* Avatar */}
        {event.avatar_url ? (
          <img src={event.avatar_url} alt="" className="w-10 h-10 rounded-xl object-cover shrink-0" />
        ) : (
          <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center text-lg shrink-0">
            {event.emoji}
          </div>
        )}

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="font-bold text-sm text-foreground truncate">{event.display_name}</p>
            {eventTypeIcons[event.event_type] || eventTypeIcons.quest_completed}
            <span className="text-[10px] text-muted-foreground ml-auto whitespace-nowrap">{timeAgo}</span>
          </div>
          <p className="text-sm text-foreground mt-0.5">{event.title}</p>
          {event.description && (
            <p className="text-xs text-muted-foreground mt-0.5">{event.description}</p>
          )}
          {event.points > 0 && (
            <span className="inline-block text-[10px] font-bold text-primary bg-primary/10 px-1.5 py-0.5 rounded mt-1">
              +{event.points} HP
            </span>
          )}
        </div>
      </div>

      {/* Reactions row */}
      <div className="flex items-center gap-1.5 flex-wrap">
        {Object.entries(reactionCounts).map(([emoji, { count, hasOwn }]) => (
          <button
            key={emoji}
            onClick={() => onReact(event.id, emoji)}
            className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs transition-colors ${
              hasOwn
                ? "bg-primary/20 text-primary border border-primary/30"
                : "glass hover:bg-secondary/80"
            }`}
          >
            <span>{emoji}</span>
            <span className="font-semibold text-[10px]">{count}</span>
          </button>
        ))}
        <button
          onClick={() => setShowReactions(!showReactions)}
          className="w-7 h-7 rounded-lg glass flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors text-xs"
        >
          +
        </button>
      </div>

      {/* Reaction picker */}
      {showReactions && (
        <div className="flex gap-1 pt-1">
          {REACTION_EMOJIS.map((emoji) => (
            <button
              key={emoji}
              onClick={() => {
                onReact(event.id, emoji);
                setShowReactions(false);
              }}
              className="w-9 h-9 rounded-xl glass hover:bg-secondary/80 flex items-center justify-center text-lg transition-transform hover:scale-110"
            >
              {emoji}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ActivityFeed;
