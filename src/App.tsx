import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { lazy, Suspense } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import { PrivyProvider } from "@privy-io/react-auth";

// Eager: landing page (critical path)
import Landing from "./pages/Landing";

// Lazy: everything else
const Auth = lazy(() => import("./pages/Auth"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
const HeroPaper = lazy(() => import("./pages/HeroPaper"));
const WalletOnboarding = lazy(() => import("./pages/WalletOnboarding"));
const Onboarding = lazy(() => import("./pages/Onboarding"));
const Install = lazy(() => import("./pages/Install"));
const AppLayout = lazy(() => import("./components/AppLayout"));
const AppHome = lazy(() => import("./pages/AppHome"));
const Explore = lazy(() => import("./pages/Explore"));
const Quests = lazy(() => import("./pages/Quests"));
const ARQuest = lazy(() => import("./pages/ARQuest"));
const Schools = lazy(() => import("./pages/Schools"));
const Leaderboard = lazy(() => import("./pages/Leaderboard"));
const Profile = lazy(() => import("./pages/Profile"));
const CreateQR = lazy(() => import("./pages/CreateQR"));
const MintNFT = lazy(() => import("./pages/MintNFT"));
const Contracts = lazy(() => import("./pages/Contracts"));
const Community = lazy(() => import("./pages/Community"));
const NFTDrop = lazy(() => import("./pages/NFTDrop"));
const Campaign = lazy(() => import("./pages/Campaign"));
const Agents = lazy(() => import("./pages/Agents"));
const Investors = lazy(() => import("./pages/Investors"));
const PitchDeck = lazy(() => import("./pages/PitchDeck"));
const Business = lazy(() => import("./pages/Business"));
const Roadmap = lazy(() => import("./pages/Roadmap"));
const Funding = lazy(() => import("./pages/Funding"));
const AdminChallenges = lazy(() => import("./pages/AdminChallenges"));
const AdminRoles = lazy(() => import("./pages/AdminRoles"));
const Overmind = lazy(() => import("./pages/Overmind"));
const DiscoveryDrops = lazy(() => import("./pages/DiscoveryDrops"));
const AdminDrops = lazy(() => import("./pages/AdminDrops"));
const TreasureStorm = lazy(() => import("./pages/TreasureStorm"));
const TreegensWorldRecord = lazy(() => import("./pages/TreegensWorldRecord"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const TermsOfService = lazy(() => import("./pages/TermsOfService"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();
const privyAppId = import.meta.env.VITE_PRIVY_APP_ID;
const LazyFallback = () => (
  <div className="min-h-screen bg-background flex items-center justify-center">
    <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <PrivyProvider
      appId={privyAppId || "missing-privy-app-id"}
      config={{
        loginMethods: ["email", "google", "apple", "sms"],
        embeddedWallets: {
          createOnLogin: "users-without-wallets",
        },
      }}
    >
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <Suspense fallback={<LazyFallback />}>
              <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="/heropaper" element={<HeroPaper />} />
                
                <Route path="/wallet-onboarding" element={<WalletOnboarding />} />
                <Route path="/onboarding" element={<ProtectedRoute><Onboarding /></ProtectedRoute>} />
                <Route path="/investors" element={<Investors />} />
                <Route path="/pitch" element={<PitchDeck />} />
                <Route path="/business" element={<Business />} />
                <Route path="/fund" element={<Funding />} />
                <Route path="/roadmap" element={<Roadmap />} />
                <Route path="/install" element={<Install />} />
                <Route path="/app" element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
                  <Route index element={<AppHome />} />
                  <Route path="explore" element={<Explore />} />
                  <Route path="quests" element={<Quests />} />
                  <Route path="schools" element={<Schools />} />
                  <Route path="leaderboard" element={<Leaderboard />} />
                  <Route path="profile" element={<Profile />} />
                  <Route path="create-qr" element={<CreateQR />} />
                  <Route path="mint" element={<MintNFT />} />
                  <Route path="contracts" element={<Contracts />} />
                  <Route path="community" element={<Community />} />
                  <Route path="drop" element={<NFTDrop />} />
                  <Route path="discovery" element={<DiscoveryDrops />} />
                  <Route path="storm" element={<TreasureStorm />} />
                  <Route path="campaign" element={<Campaign />} />
                  <Route path="agents" element={<Agents />} />
                </Route>
                <Route path="/app/ar" element={<ProtectedRoute><ARQuest /></ProtectedRoute>} />
                <Route path="/app/admin/challenges" element={<ProtectedRoute><AdminChallenges /></ProtectedRoute>} />
                <Route path="/app/admin/drops" element={<ProtectedRoute><AdminDrops /></ProtectedRoute>} />
                <Route path="/app/admin/roles" element={<ProtectedRoute><AdminRoles /></ProtectedRoute>} />
                <Route path="/app/overmind" element={<ProtectedRoute><Overmind /></ProtectedRoute>} />
                <Route path="/treegens" element={<TreegensWorldRecord />} />
                <Route path="/privacy" element={<PrivacyPolicy />} />
                <Route path="/terms" element={<TermsOfService />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </PrivyProvider>
  </QueryClientProvider>
);

export default App;
