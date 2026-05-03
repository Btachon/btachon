import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, BookOpen, Users, ShieldCheck, Sparkles } from "lucide-react";
import { storeJwt, getStoredJwt } from "@workspace/replit-auth-web";
import { setAuthTokenGetter, setBaseUrl } from "@workspace/api-client-react";

function getApiBase(): string {
  return (import.meta.env.VITE_API_URL as string | undefined)?.replace(/\/+$/, "") ?? "";
}

interface LoginProps {
  onLogin: () => void;
}

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

const PILLARS = [
  { label: "Ben Adam LaMakom", sub: "You & Hashem" },
  { label: "Ben Adam LaChavero", sub: "You & Others" },
  { label: "Ben Adam LeAtzmo", sub: "You & Yourself" },
];

const FEATURES = [
  { icon: BookOpen, text: "Learning Lab & Shiurim" },
  { icon: Sparkles, text: "613 Chai Habit Tracker" },
  { icon: Users, text: "Chevre & Accountability" },
  { icon: ShieldCheck, text: "Shabbos Mode + Zmanim" },
];

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
        err === "cancelled" ? "Sign-in was cancelled. Please try again."
        : err === "state_mismatch" ? "Security check failed. Please try again."
        : "Something went wrong with Google sign-in. Try again.",
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
      setError("Could not reach the server. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center relative overflow-hidden px-4 py-10">

      {/* Ambient glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/6 blur-[120px]" />
        <div className="absolute bottom-0 left-1/4 w-[300px] h-[300px] rounded-full bg-primary/4 blur-[80px]" />
      </div>

      <div className="relative z-10 w-full max-w-sm">
        {/* Brand header */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <div dir="rtl" className="text-5xl font-black text-primary tracking-tight leading-none mb-1">בטחון</div>
          <div className="text-xs font-bold tracking-[0.2em] uppercase text-muted-foreground/60 mt-1">Btachon · Jewish Personal Growth</div>

          {/* Three pillars */}
          <div className="flex items-center justify-center gap-2 mt-5 flex-wrap">
            {PILLARS.map((p, i) => (
              <motion.div
                key={p.label}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 + i * 0.08 }}
                className="flex flex-col items-center px-3 py-1.5 rounded-lg border border-primary/20 bg-primary/5"
              >
                <span className="text-[10px] font-bold text-primary leading-tight">{p.label}</span>
                <span className="text-[9px] text-muted-foreground/60 leading-tight">{p.sub}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Auth card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.1 }}
          className="rounded-2xl border border-border/60 bg-card/80 backdrop-blur-sm shadow-2xl shadow-black/30 p-6"
        >
          {/* Google */}
          <button
            onClick={onLogin}
            className="w-full h-12 flex items-center justify-center gap-3 rounded-xl border border-border bg-secondary/40 hover:bg-secondary/70 text-foreground font-semibold text-sm transition-all hover:border-primary/30"
          >
            <GoogleIcon />
            Continue with Google
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3 my-4">
            <div className="flex-1 h-px bg-border/40" />
            <span className="text-[11px] text-muted-foreground/40 font-medium">or create a Btachon account</span>
            <div className="flex-1 h-px bg-border/40" />
          </div>

          {/* Mode toggle */}
          <div className="flex rounded-xl border border-border/50 bg-background/40 p-1 mb-4">
            {(["signin", "signup"] as const).map((m) => (
              <button
                key={m}
                onClick={() => { setMode(m); setError(null); }}
                className={`flex-1 py-2 rounded-lg text-xs font-bold tracking-wide transition-all ${
                  mode === m
                    ? "bg-primary text-primary-foreground shadow"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {m === "signin" ? "Sign In" : "Create Account"}
              </button>
            ))}
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3">
            <AnimatePresence>
              {mode === "signup" && (
                <motion.div
                  key="firstName"
                  initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                  animate={{ opacity: 1, height: "auto", marginBottom: 0 }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <input
                    type="text"
                    placeholder="Your name (e.g. Moshe, Rivka)"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full h-11 px-4 rounded-xl border border-border/50 bg-background/60 text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-primary/50 focus:bg-background/80 transition-all"
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
              className="w-full h-11 px-4 rounded-xl border border-border/50 bg-background/60 text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-primary/50 focus:bg-background/80 transition-all"
            />

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder={mode === "signup" ? "Create a password (8+ characters)" : "Password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete={mode === "signup" ? "new-password" : "current-password"}
                className="w-full h-11 px-4 pr-11 rounded-xl border border-border/50 bg-background/60 text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-primary/50 focus:bg-background/80 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/40 hover:text-muted-foreground transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="px-3.5 py-2.5 rounded-xl bg-destructive/10 border border-destructive/25 text-destructive text-xs text-center"
                >
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 rounded-xl bg-primary text-primary-foreground font-bold text-sm tracking-wide hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary/20"
            >
              {loading
                ? "Please wait..."
                : mode === "signin"
                ? "Sign In to Btachon"
                : "Create My Btachon Account"}
            </button>
          </form>

          {/* Feature hints */}
          <div className="grid grid-cols-2 gap-1.5 mt-5 pt-4 border-t border-border/30">
            {FEATURES.map((f) => (
              <div key={f.text} className="flex items-center gap-1.5 text-[10px] text-muted-foreground/50">
                <f.icon className="w-3 h-3 text-primary/50 shrink-0" />
                <span>{f.text}</span>
              </div>
            ))}
          </div>
        </motion.div>

        <p className="text-center text-[10px] text-muted-foreground/30 mt-4">
          Private, secure, and ad-free
        </p>
      </div>
    </div>
  );
}
