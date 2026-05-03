import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, Users, Shield, Sparkles, Eye, EyeOff } from "lucide-react";
import heroLearn from "@/assets/hero-learn.png";
import { storeJwt, getStoredJwt } from "@workspace/replit-auth-web";
import { setAuthTokenGetter, setBaseUrl } from "@workspace/api-client-react";

function getApiBase(): string {
  return (import.meta.env.VITE_API_URL as string | undefined)?.replace(/\/+$/, "") ?? "";
}

interface LoginProps {
  onLogin: () => void;
}

const features = [
  { icon: BookOpen, text: "Learning Lab — Peer to Peer, Lishma, Study Sessions" },
  { icon: Sparkles, text: "613 Chai Habit Tracker & Daily Mitzvah" },
  { icon: Users, text: "Chevre — connect and grow with friends" },
  { icon: Shield, text: "Shabbos Mode with automatic zmanim" },
];

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path d="M17.64 9.205c0-.639-.057-1.252-.164-1.841H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
      <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853"/>
      <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
      <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
    </svg>
  );
}

export default function Login({ onLogin }: LoginProps) {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const err = params.get("auth_error");
    if (err) {
      setError(
        err === "cancelled" ? "Sign-in was cancelled. Try again."
        : err === "state_mismatch" ? "Security check failed. Please try again."
        : "Something went wrong signing in with Google. Try again.",
      );
      params.delete("auth_error");
      window.history.replaceState({}, "", window.location.pathname + (params.toString() ? `?${params}` : ""));
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const endpoint = `${getApiBase()}${mode === "signup" ? "/api/auth/signup" : "/api/auth/login"}`;
    const body: Record<string, string> = { email, password };
    if (mode === "signup" && firstName.trim()) body.firstName = firstName.trim();

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Something went wrong. Please try again.");
        return;
      }
      storeJwt(data.token);
      const apiUrl = (import.meta.env.VITE_API_URL as string | undefined)?.replace(/\/+$/, "");
      if (apiUrl) setBaseUrl(apiUrl);
      setAuthTokenGetter(getStoredJwt);
      onLogin();
    } catch {
      setError("Could not connect to the server. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row overflow-hidden">
      {/* Left panel */}
      <div className="relative md:w-1/2 h-48 md:h-screen overflow-hidden">
        <img src={heroLearn} alt="Beis Medrash" className="absolute inset-0 w-full h-full object-cover object-center" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/20 via-background/40 to-background md:block hidden" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-background/10 md:hidden" />
        <div className="absolute bottom-0 left-0 p-8 hidden md:block">
          <div className="text-4xl font-bold text-white/90 mb-2">בטחון</div>
          <div className="text-white/60 text-sm">Trust. Connect. Grow.</div>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex flex-col justify-center px-6 md:px-14 py-10 max-w-md mx-auto w-full md:max-w-none">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="max-w-sm mx-auto w-full"
        >
          {/* Header */}
          <div className="mb-7">
            <div className="text-2xl font-bold tracking-tight text-foreground mb-1">Btachon</div>
            <div className="text-xs font-bold tracking-widest uppercase text-primary mb-3">Jewish Personal Growth</div>
            <ul className="space-y-2">
              {features.map((f, i) => (
                <motion.li key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.08 * i }}
                  className="flex items-center gap-2.5 text-xs text-muted-foreground">
                  <div className="w-6 h-6 rounded-md bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                    <f.icon className="w-3 h-3 text-primary" />
                  </div>
                  {f.text}
                </motion.li>
              ))}
            </ul>
          </div>

          {/* Google */}
          <button
            onClick={onLogin}
            className="w-full h-12 flex items-center justify-center gap-3 rounded-xl border border-border bg-card hover:bg-card/70 text-foreground font-semibold text-sm transition-colors mb-4"
          >
            <GoogleIcon />
            Continue with Google
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-4">
            <div className="flex-1 h-px bg-border/50" />
            <span className="text-xs text-muted-foreground/50">or</span>
            <div className="flex-1 h-px bg-border/50" />
          </div>

          {/* Mode toggle */}
          <div className="flex rounded-xl border border-border/60 bg-card/40 p-1 mb-4">
            {(["signin", "signup"] as const).map((m) => (
              <button key={m} onClick={() => { setMode(m); setError(null); }}
                className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-all ${mode === m ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}>
                {m === "signin" ? "Sign In" : "Create Account"}
              </button>
            ))}
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3">
            <AnimatePresence>
              {mode === "signup" && (
                <motion.div key="firstName" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.2 }}>
                  <input
                    type="text"
                    placeholder="First name (optional)"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full h-11 px-4 rounded-xl border border-border/60 bg-card/50 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/60 transition-colors"
                  />
                </motion.div>
              )}
            </AnimatePresence>

            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              className="w-full h-11 px-4 rounded-xl border border-border/60 bg-card/50 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/60 transition-colors"
            />

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder={mode === "signup" ? "Create a password (min 8 chars)" : "Password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete={mode === "signup" ? "new-password" : "current-password"}
                className="w-full h-11 px-4 pr-11 rounded-xl border border-border/60 bg-card/50 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/60 transition-colors"
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/50 hover:text-muted-foreground transition-colors">
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {error && (
              <div className="px-4 py-2.5 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs text-center">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full h-11 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? "Please wait..." : mode === "signin" ? "Sign In" : "Create Account"}
            </button>
          </form>

          <p className="text-center text-xs text-muted-foreground/40 mt-4">
            Your data is private and secure
          </p>
        </motion.div>
      </div>
    </div>
  );
}
