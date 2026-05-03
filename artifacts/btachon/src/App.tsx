import { useState } from "react";
import { Layout } from "./components/Layout";
import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider, useQueryClient } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@workspace/replit-auth-web";
import { useGetProfile, useUpsertProfile, getGetProfileQueryKey } from "@workspace/api-client-react";

import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/dashboard";
import Learn from "@/pages/learn";
import Grow from "@/pages/grow";
import Blocker from "@/pages/blocker";
import Chevre from "@/pages/chevre";
import Pulse from "@/pages/pulse";
import Settings from "@/pages/settings";
import Login from "@/pages/login";
import Onboarding from "@/pages/onboarding";
import Tefillah from "@/pages/tefillah";
import Welcome from "@/pages/welcome";

const queryClient = new QueryClient();
const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");
const WELCOME_KEY = "btachon:welcome:seen:v1";

function AppRoutes() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/pulse" component={Pulse} />
      <Route path="/learn" component={Learn} />
      <Route path="/grow" component={Grow} />
      <Route path="/blocker" component={Blocker} />
      <Route path="/chevre" component={Chevre} />
      <Route path="/settings" component={Settings} />
      <Route path="/tefillah" component={Tefillah} />
      <Route component={NotFound} />
    </Switch>
  );
}

function AppGate() {
  const { user, isLoading: authLoading, login } = useAuth();
  const qc = useQueryClient();
  const [welcomeSeen, setWelcomeSeen] = useState(
    () => localStorage.getItem(WELCOME_KEY) === "1"
  );

  const { data: profile, isLoading: profileLoading } = useGetProfile({
    query: {
      enabled: !!user && welcomeSeen,
      retry: false,
      queryKey: getGetProfileQueryKey(),
    },
  });

  const upsertProfile = useUpsertProfile();

  const handleOnboardingComplete = async (data: {
    displayName: string;
    shabbosCity: string;
    bio: string;
    hobbies: string;
    growthGoals: string;
    profileType: string;
  }) => {
    await upsertProfile.mutateAsync({
      data: {
        displayName: data.displayName,
        shabbosCity: data.shabbosCity,
        bio: data.bio || null,
        hobbies: data.hobbies || null,
        growthGoals: data.growthGoals || null,
        onboardingComplete: true,
      },
    });
    if (data.shabbosCity) localStorage.setItem("btachon:shabbosLocation", JSON.stringify(data.shabbosCity));
    if (data.profileType) localStorage.setItem("btachon:profileType", JSON.stringify(data.profileType));
    qc.invalidateQueries({ queryKey: getGetProfileQueryKey() });
  };

  // 1. Block on auth loading only
  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="text-3xl font-bold text-foreground">Btachon</div>
          <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
        </div>
      </div>
    );
  }

  // 2. Not logged in → Login
  if (!user) return <Login onLogin={login} />;

  // 3. Logged in but hasn't seen welcome → show Welcome (Ben Adam L screen) immediately
  if (!welcomeSeen) {
    return (
      <Welcome
        onEnter={() => {
          localStorage.setItem(WELCOME_KEY, "1");
          setWelcomeSeen(true);
        }}
      />
    );
  }

  // 4. Welcome seen — now load profile
  if (profileLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // 5. Profile loaded but onboarding not complete → Onboarding
  if (profile && !profile.onboardingComplete) {
    return <Onboarding onComplete={handleOnboardingComplete} />;
  }

  // 6. No profile yet (safety net)
  if (!profile) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // 7. All good → Main app
  return (
    <Layout>
      <AppRoutes />
    </Layout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={BASE}>
          <AppGate />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
