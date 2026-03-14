import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { usePrivy } from "@privy-io/react-auth";
import { syncAuthUser } from "@/lib/api";

interface AuthContextType {
  user: {
    id: string;
    email?: string | null;
    user_metadata?: {
      display_name?: string;
      avatar_url?: string;
    };
  } | null;
  session: null;
  authenticated: boolean;
  loading: boolean;
  signIn: () => void;
  getAccessToken: () => Promise<string | null>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  authenticated: false,
  loading: true,
  signIn: () => {},
  getAccessToken: async () => null,
  signOut: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { ready, authenticated, user: privyUser, login, logout, getAccessToken } = usePrivy();
  const [syncedUser, setSyncedUser] = useState<{ display_name?: string; avatar_url?: string } | null>(null);

  useEffect(() => {
    if (!ready || !authenticated || !privyUser) {
      setSyncedUser(null);
      return;
    }

    let cancelled = false;
    const runSync = async () => {
      try {
        const accessToken = await getAccessToken();
        if (!accessToken) return;

        const response = await syncAuthUser(accessToken, {
          privyUserId: privyUser.id,
          email: privyUser.email?.address || null,
          walletAddress: privyUser.wallet?.address || null,
        });

        if (!cancelled) {
          setSyncedUser(response.metadata || null);
        }
      } catch (error) {
        console.warn("Auth sync skipped (backend unavailable):", error);
      }
    };

    void runSync();
    return () => {
      cancelled = true;
    };
  }, [ready, authenticated, privyUser, getAccessToken]);

  const user = useMemo(() => {
    if (!authenticated || !privyUser) return null;
    return {
      id: privyUser.id,
      email: privyUser.email?.address || null,
      user_metadata: {
        display_name: syncedUser?.display_name,
        avatar_url: syncedUser?.avatar_url,
      },
    };
  }, [authenticated, privyUser, syncedUser]);

  const signOut = async () => {
    await logout();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session: null,
        authenticated,
        loading: !ready,
        signIn: () => login(),
        getAccessToken,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
