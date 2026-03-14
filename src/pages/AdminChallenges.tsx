import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus, Trash2, Edit2, Users, Trophy, ArrowLeft, Loader2, Save, X, BarChart3,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAdmin } from "@/hooks/use-admin";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

interface ChallengeRow {
  id: string;
  title: string;
  description: string;
  emoji: string;
  goal_type: string;
  goal_target: number;
  goal_current: number;
  reward_points: number;
  reward_badge: string | null;
  starts_at: string;
  ends_at: string;
  status: string;
  participant_count: number;
  created_at: string;
}

type FormData = {
  title: string;
  description: string;
  emoji: string;
  goal_type: string;
  goal_target: string;
  reward_points: string;
  reward_badge: string;
  starts_at: string;
  ends_at: string;
  status: string;
};

const GOAL_TYPES = [
  { value: "trees_planted", label: "Trees Planted 🌳" },
  { value: "neighbors_helped", label: "Neighbors Helped 🤝" },
  { value: "miles_biked", label: "Miles Biked 🚴" },
  { value: "businesses_supported", label: "Businesses Supported 🏪" },
];

const emptyForm: FormData = {
  title: "",
  description: "",
  emoji: "🎯",
  goal_type: "trees_planted",
  goal_target: "1000",
  reward_points: "100",
  reward_badge: "",
  starts_at: new Date().toISOString().slice(0, 16),
  ends_at: new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 16),
  status: "active",
};

export default function AdminChallenges() {
  const { isAdmin, loading: adminLoading } = useAdmin();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [challenges, setChallenges] = useState<ChallengeRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormData>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [contributions, setContributions] = useState<Record<string, number>>({}); // challengeId -> count

  useEffect(() => {
    if (!adminLoading && !isAdmin) {
      navigate("/app");
    }
  }, [adminLoading, isAdmin]);

  useEffect(() => {
    if (isAdmin) loadChallenges();
  }, [isAdmin]);

  const loadChallenges = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("community_challenges")
      .select("*")
      .order("created_at", { ascending: false });

    const rows = (data || []) as ChallengeRow[];
    setChallenges(rows);

    // Load contribution counts
    const contribs: Record<string, number> = {};
    await Promise.all(
      rows.map(async (c) => {
        const { count } = await supabase
          .from("challenge_contributions")
          .select("*", { count: "exact", head: true })
          .eq("challenge_id", c.id);
        contribs[c.id] = count || 0;
      })
    );
    setContributions(contribs);
    setLoading(false);
  };

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setShowForm(true);
  };

  const openEdit = (c: ChallengeRow) => {
    setEditingId(c.id);
    setForm({
      title: c.title,
      description: c.description,
      emoji: c.emoji,
      goal_type: c.goal_type,
      goal_target: String(c.goal_target),
      reward_points: String(c.reward_points),
      reward_badge: c.reward_badge || "",
      starts_at: c.starts_at.slice(0, 16),
      ends_at: c.ends_at.slice(0, 16),
      status: c.status,
    });
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!form.title.trim() || !form.goal_target || !form.ends_at) {
      toast({ title: "Missing fields", description: "Title, goal, and end date are required.", variant: "destructive" });
      return;
    }

    setSaving(true);
    const payload = {
      title: form.title.trim(),
      description: form.description.trim(),
      emoji: form.emoji,
      goal_type: form.goal_type,
      goal_target: parseInt(form.goal_target) || 1000,
      reward_points: parseInt(form.reward_points) || 100,
      reward_badge: form.reward_badge.trim() || null,
      starts_at: new Date(form.starts_at).toISOString(),
      ends_at: new Date(form.ends_at).toISOString(),
      status: form.status,
      updated_at: new Date().toISOString(),
    };

    let error;
    if (editingId) {
      ({ error } = await supabase.from("community_challenges").update(payload).eq("id", editingId));
    } else {
      ({ error } = await supabase.from("community_challenges").insert(payload));
    }

    setSaving(false);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
      return;
    }

    toast({ title: editingId ? "Challenge updated" : "Challenge created" });
    setShowForm(false);
    loadChallenges();
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("community_challenges").delete().eq("id", id);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "Challenge deleted" });
    loadChallenges();
  };

  const updateField = (key: keyof FormData, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  if (adminLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 size={24} className="animate-spin text-primary" />
      </div>
    );
  }

  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-5 pt-12 pb-24 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/app")}
            className="w-9 h-9 rounded-xl glass flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft size={16} />
          </button>
          <div className="flex-1">
            <h1 className="font-display text-2xl font-bold text-foreground">Admin: Challenges</h1>
            <p className="text-sm text-muted-foreground">Create & manage community challenges</p>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => navigate("/app/admin/roles")} variant="outline" size="sm" className="gap-1.5">
              <Users size={14} /> Roles
            </Button>
            <Button onClick={openCreate} size="sm" className="gap-1.5">
              <Plus size={14} /> New
            </Button>
          </div>
        </div>

        {/* Form */}
        {showForm && (
          <div className="glass-card rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-foreground">
                {editingId ? "Edit Challenge" : "New Challenge"}
              </h2>
              <button onClick={() => setShowForm(false)} className="text-muted-foreground hover:text-foreground">
                <X size={16} />
              </button>
            </div>

            <div className="grid grid-cols-[60px_1fr] gap-3 items-start">
              <div>
                <label className="text-[10px] text-muted-foreground font-semibold uppercase">Emoji</label>
                <Input
                  value={form.emoji}
                  onChange={(e) => updateField("emoji", e.target.value)}
                  className="text-center text-lg h-11"
                  maxLength={4}
                />
              </div>
              <div>
                <label className="text-[10px] text-muted-foreground font-semibold uppercase">Title</label>
                <Input
                  value={form.title}
                  onChange={(e) => updateField("title", e.target.value)}
                  placeholder="e.g. 1,000 Trees This Week"
                  className="h-11"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] text-muted-foreground font-semibold uppercase">Description</label>
              <Input
                value={form.description}
                onChange={(e) => updateField("description", e.target.value)}
                placeholder="Describe the challenge..."
                className="h-11"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] text-muted-foreground font-semibold uppercase">Goal Type</label>
                <select
                  value={form.goal_type}
                  onChange={(e) => updateField("goal_type", e.target.value)}
                  className="w-full h-11 rounded-md border border-input bg-background px-3 text-sm text-foreground"
                >
                  {GOAL_TYPES.map((gt) => (
                    <option key={gt.value} value={gt.value}>{gt.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-[10px] text-muted-foreground font-semibold uppercase">Goal Target</label>
                <Input
                  type="number"
                  value={form.goal_target}
                  onChange={(e) => updateField("goal_target", e.target.value)}
                  className="h-11"
                  min={1}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] text-muted-foreground font-semibold uppercase">Reward Points</label>
                <Input
                  type="number"
                  value={form.reward_points}
                  onChange={(e) => updateField("reward_points", e.target.value)}
                  className="h-11"
                  min={0}
                />
              </div>
              <div>
                <label className="text-[10px] text-muted-foreground font-semibold uppercase">Reward Badge (optional)</label>
                <Input
                  value={form.reward_badge}
                  onChange={(e) => updateField("reward_badge", e.target.value)}
                  placeholder="e.g. Forest Guardian"
                  className="h-11"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] text-muted-foreground font-semibold uppercase">Starts At</label>
                <Input
                  type="datetime-local"
                  value={form.starts_at}
                  onChange={(e) => updateField("starts_at", e.target.value)}
                  className="h-11"
                />
              </div>
              <div>
                <label className="text-[10px] text-muted-foreground font-semibold uppercase">Ends At</label>
                <Input
                  type="datetime-local"
                  value={form.ends_at}
                  onChange={(e) => updateField("ends_at", e.target.value)}
                  className="h-11"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] text-muted-foreground font-semibold uppercase">Status</label>
              <select
                value={form.status}
                onChange={(e) => updateField("status", e.target.value)}
                className="w-full h-11 rounded-md border border-input bg-background px-3 text-sm text-foreground"
              >
                <option value="active">Active</option>
                <option value="paused">Paused</option>
                <option value="completed">Completed</option>
                <option value="draft">Draft</option>
              </select>
            </div>

            <Button onClick={handleSave} disabled={saving} className="w-full gap-1.5">
              {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
              {editingId ? "Update Challenge" : "Create Challenge"}
            </Button>
          </div>
        )}

        {/* Challenges list */}
        <div className="space-y-3">
          {challenges.map((c) => {
            const pct = Math.min(100, Math.round((c.goal_current / c.goal_target) * 100));
            return (
              <div key={c.id} className="glass-card rounded-2xl p-4 space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-lg shrink-0">
                    {c.emoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-sm text-foreground truncate">{c.title}</h3>
                      <Badge
                        variant={c.status === "active" ? "default" : "secondary"}
                        className="text-[9px] px-1.5 py-0 h-4 shrink-0"
                      >
                        {c.status}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground truncate">{c.description}</p>
                  </div>
                  <div className="flex gap-1 shrink-0">
                    <button
                      onClick={() => openEdit(c)}
                      className="w-8 h-8 rounded-lg glass flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <Edit2 size={13} />
                    </button>
                    <button
                      onClick={() => handleDelete(c.id)}
                      className="w-8 h-8 rounded-lg glass flex items-center justify-center text-muted-foreground hover:text-destructive transition-colors"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>

                {/* Progress */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">
                      {c.goal_current.toLocaleString()} / {c.goal_target.toLocaleString()}
                    </span>
                    <span className="font-bold text-primary">{pct}%</span>
                  </div>
                  <Progress value={pct} className="h-2 bg-secondary" />
                </div>

                {/* Stats row */}
                <div className="flex items-center gap-4 text-[10px] text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Users size={10} /> {c.participant_count} participants
                  </span>
                  <span className="flex items-center gap-1">
                    <BarChart3 size={10} /> {contributions[c.id] || 0} contributions
                  </span>
                  <span className="flex items-center gap-1">
                    <Trophy size={10} /> {c.reward_points} pts
                  </span>
                </div>

                {/* Date range */}
                <div className="text-[10px] text-muted-foreground/70">
                  {new Date(c.starts_at).toLocaleDateString()} → {new Date(c.ends_at).toLocaleDateString()}
                </div>
              </div>
            );
          })}

          {challenges.length === 0 && (
            <div className="glass-card rounded-2xl p-8 text-center">
              <Trophy size={32} className="text-muted-foreground mx-auto mb-2" />
              <p className="text-sm font-semibold text-foreground">No challenges yet</p>
              <p className="text-xs text-muted-foreground">Create your first community challenge</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
