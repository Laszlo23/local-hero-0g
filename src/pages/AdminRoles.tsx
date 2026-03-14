import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Loader2, Plus, Trash2, Shield, UserPlus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAdmin } from "@/hooks/use-admin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

interface RoleRow {
  id: string;
  user_id: string;
  role: string;
  email?: string;
}

export default function AdminRoles() {
  const { isAdmin, loading: adminLoading } = useAdmin();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [roles, setRoles] = useState<RoleRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [selectedRole, setSelectedRole] = useState<"admin" | "moderator">("moderator");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!adminLoading && !isAdmin) navigate("/app");
  }, [adminLoading, isAdmin]);

  useEffect(() => {
    if (isAdmin) loadRoles();
  }, [isAdmin]);

  const loadRoles = async () => {
    setLoading(true);
    const { data } = await supabase.from("user_roles").select("id, user_id, role");
    if (data) {
      // Fetch emails from user_profiles
      const userIds = data.map((r) => r.user_id);
      const { data: profiles } = await supabase
        .from("user_profiles")
        .select("user_id, email, display_name")
        .in("user_id", userIds);

      const profileMap = new Map(
        (profiles || []).map((p) => [p.user_id, p.email || p.display_name || "Unknown"])
      );

      setRoles(
        data.map((r) => ({
          ...r,
          email: profileMap.get(r.user_id) || r.user_id.slice(0, 8) + "...",
        }))
      );
    }
    setLoading(false);
  };

  const handleAdd = async () => {
    if (!email.trim()) return;
    setSaving(true);

    // Look up user by email in user_profiles
    const { data: profile } = await supabase
      .from("user_profiles")
      .select("user_id")
      .eq("email", email.trim().toLowerCase())
      .maybeSingle();

    if (!profile?.user_id) {
      toast({ title: "User not found", description: "No account found with that email.", variant: "destructive" });
      setSaving(false);
      return;
    }

    const { error } = await supabase.from("user_roles").insert({
      user_id: profile.user_id,
      role: selectedRole,
    });

    setSaving(false);
    if (error) {
      if (error.code === "23505") {
        toast({ title: "Already assigned", description: "This user already has that role.", variant: "destructive" });
      } else {
        toast({ title: "Error", description: error.message, variant: "destructive" });
      }
      return;
    }

    toast({ title: `${selectedRole} role assigned to ${email}` });
    setEmail("");
    loadRoles();
  };

  const handleRemove = async (id: string) => {
    const { error } = await supabase.from("user_roles").delete().eq("id", id);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "Role removed" });
    loadRoles();
  };

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
      <div className="max-w-2xl mx-auto px-5 pt-12 pb-24 space-y-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/app/admin/challenges")}
            className="w-9 h-9 rounded-xl glass flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft size={16} />
          </button>
          <div className="flex-1">
            <h1 className="font-display text-2xl font-bold text-foreground">Admin: Roles</h1>
            <p className="text-sm text-muted-foreground">Manage user roles & permissions</p>
          </div>
        </div>

        {/* Add role form */}
        <div className="glass-card rounded-2xl p-5 space-y-3">
          <h2 className="font-bold text-foreground flex items-center gap-2">
            <UserPlus size={16} /> Assign Role
          </h2>
          <div className="flex gap-2">
            <Input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="user@email.com"
              className="flex-1 h-11"
              onKeyDown={(e) => e.key === "Enter" && handleAdd()}
            />
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value as "admin" | "moderator")}
              className="h-11 rounded-md border border-input bg-background px-3 text-sm text-foreground"
            >
              <option value="moderator">Moderator</option>
              <option value="admin">Admin</option>
            </select>
            <Button onClick={handleAdd} disabled={saving} className="h-11 gap-1.5">
              {saving ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
              Add
            </Button>
          </div>
        </div>

        {/* Roles list */}
        <div className="space-y-2">
          {roles.map((r) => (
            <div key={r.id} className="glass-card rounded-xl p-4 flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                <Shield size={16} className="text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground truncate">{r.email}</p>
                <p className="text-[10px] text-muted-foreground font-mono">{r.user_id.slice(0, 12)}...</p>
              </div>
              <Badge variant={r.role === "admin" ? "default" : "secondary"} className="text-[10px]">
                {r.role}
              </Badge>
              <button
                onClick={() => handleRemove(r.id)}
                className="w-8 h-8 rounded-lg glass flex items-center justify-center text-muted-foreground hover:text-destructive transition-colors"
              >
                <Trash2 size={13} />
              </button>
            </div>
          ))}
          {roles.length === 0 && (
            <div className="glass-card rounded-2xl p-8 text-center">
              <Shield size={32} className="text-muted-foreground mx-auto mb-2" />
              <p className="text-sm font-semibold text-foreground">No roles assigned</p>
              <p className="text-xs text-muted-foreground">Add users above to grant permissions</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
