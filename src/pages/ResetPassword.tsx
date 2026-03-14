import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, Check } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import heroLogo from "@/assets/hero-logo-glow.png";

const ResetPassword = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check for recovery token in URL
    const hash = window.location.hash;
    if (hash && hash.includes("type=recovery")) {
      // Supabase handles session automatically
    }
  }, []);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      toast({ title: "Password updated! 🎉" });
      navigate("/app");
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-[400px]">
        <div className="text-center mb-8">
          <img src={heroLogo} alt="HERO" className="w-16 h-16 mx-auto mb-4" />
          <h1 className="font-display text-2xl font-bold text-foreground">Set New Password</h1>
        </div>
        <form onSubmit={handleReset} className="space-y-3">
          <div className="relative">
            <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="New password" className="pl-10 h-12 rounded-xl bg-secondary/50 border-border/50" required minLength={6} />
          </div>
          <Button type="submit" disabled={loading} className="w-full h-12 rounded-xl bg-gradient-hero-glow text-primary-foreground font-bold">
            <Check size={16} className="mr-2" /> Update Password
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
