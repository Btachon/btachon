import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff } from "lucide-react";
import heroLearn from "@/assets/hero-learn.png";
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
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
      <path d="M17.64 9.205c0-.639-.057-1.252-.164-1.841H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
      <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853"/>
      <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
      <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
    </svg>
  );
}

const PILLARS = [
  { hebrew: "בֵּן אָדָם לַמָּקוֹם", en: "Ben Adam LaMakom", sub: "Between you and Hashem" },
  { hebrew: "בֵּן אָדָם לַחֲבֵרוֹ", en: "Ben Adam LaChavero", sub: "Between you and others" },
  { hebrew: "בֵּן אָדָם לְעַצְמוֹ", en: "Ben Adam LeAtzmo", sub: "Between you and yourself" },
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
    const detail = params.get("auth_detail");
    if (err) {
      setError(
        err === "cancelled" ? "Sign-in was cancelled. Please try again."
          : err === "state_mismatch" ? "Security check failed. Please try again."
          : detail ? `Google sign-in error: ${detail}`
          : "Something went wrong with Google sign-in. Please try again.",
      );
      params.delete("auth_detail");
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
      // Reload so useAuth re-initialises and picks up the stored JWT
      window.location.href = window.location.origin + window.location.pathname;
    } catch {
      setError("Could not reach the server. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0d0c0a] flex flex-col md:flex-row overflow-hidden">

      {/* ── Left panel — image + pillars ── */}
      <div className="relative md:w-[52%] h-52 md:h-screen flex-shrink-0 overflow-hidden">
        <img
          src={heroLearn}
          alt=""
          className="absolute inset-0 w-full h-full object-cover object-center scale-105"
        />

        {/* Gradients */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-black/80 md:bg-gradient-to-r md:from-black/50 md:via-black/20 md:to-black/90" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent md:hidden" />

        {/* Content */}
        <div className="absolute inset-0 flex flex-col justify-between p-6 md:p-10">
          {/* Top: wordmark */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="text-4xl md:text-6xl font-black text-white/95 tracking-tight leading-none drop-shadow-lg">
              בטחון
            </div>
            <div className="text-[10px] md:text-xs font-bold tracking-[0.25em] uppercase text-white/50 mt-1.5 hidden md:block">
              Jewish Personal Growth
            </div>
          </motion.div>

          {/* Bottom: three pillars (desktop only) */}
          <div className="hidden md:block">
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-xs text-white/40 font-medium tracking-widest uppercase mb-4"
            >
              Three dimensions of growth
            </motion.p>
            <div className="space-y-2">
              {PILLARS.map((p, i) => (
                <motion.div
                  key={p.en}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.35 + i * 0.1, duration: 0.45 }}
                  className="flex items-center gap-3"
                >
                  <div className="w-0.5 h-8 rounded-full bg-primary/70 shrink-0" />
                  <div>
                    <div dir="rtl" className="text-sm font-semibold text-primary/90 leading-tight">{p.hebrew}</div>
                    <div className="text-xs text-white/50 mt-0.5">{p.sub}</div>
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="mt-8 text-sm font-medium text-white/30 italic"
            >
              "Trust. Connect. Grow."
            </motion.p>
          </div>
        </div>
      </div>

      {/* ── Right panel — auth form ── */}
      <div className="flex-1 flex flex-col justify-center px-6 md:px-12 py-8 md:py-0 bg-[#0d0c0a]">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.15 }}
          className="w-full max-w-[360px] mx-auto"
        >
          {/* Header */}
          <div className="mb-7">
            <h1 className="text-2xl font-bold text-white tracking-tight">
              {mode === "signin" ? "Welcome back" : "Join Btachon"}
            </h1>
            <p className="text-sm text-white/40 mt-1">
              {mode === "signin"
                ? "Sign in to continue your growth journey."
                : "Create your free account and begin."}
            </p>
          </div>

          {/* Google */}
          <button
            onClick={onLogin}
            className="w-full h-12 flex items-center justify-center gap-3 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-white font-semibold text-sm transition-all hover:border-white/20"
          >
            <GoogleIcon />
            Continue with Google
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-white/8" />
            <span className="text-[11px] text-white/25">or</span>
            <div className="flex-1 h-px bg-white/8" />
          </div>

          {/* Mode tabs */}
          <div className="flex rounded-xl bg-white/5 border border-white/8 p-1 mb-5">
            {(["signin", "signup"] as const).map((m) => (
              <button
                key={m}
                onClick={() => { setMode(m); setError(null); }}
                className={`flex-1 py-2 rounded-lg text-xs font-bold tracking-wide transition-all duration-200 ${
                  mode === m
                    ? "bg-primary text-[#1a1200] shadow"
                    : "text-white/40 hover:text-white/70"
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
                  key="name"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <input
                    type="text"
                    placeholder="Your name (e.g. Moshe, Rivka)"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full h-11 px-4 rounded-xl border border-white/10 bg-white/5 text-sm text-white placeholder:text-white/25 focus:outline-none focus:border-primary/50 focus:bg-white/8 transition-all"
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
              className="w-full h-11 px-4 rounded-xl border border-white/10 bg-white/5 text-sm text-white placeholder:text-white/25 focus:outline-none focus:border-primary/50 focus:bg-white/8 transition-all"
            />

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder={mode === "signup" ? "Create a password (8+ characters)" : "Password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete={mode === "signup" ? "new-password" : "current-password"}
                className="w-full h-11 px-4 pr-11 rounded-xl border border-white/10 bg-white/5 text-sm text-white placeholder:text-white/25 focus:outline-none focus:border-primary/50 focus:bg-white/8 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/25 hover:text-white/60 transition-colors"
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
                  className="px-4 py-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs text-center"
                >
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 rounded-xl bg-primary text-[#1a1200] font-bold text-sm tracking-wide hover:brightness-110 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary/20 mt-1"
            >
              {loading
                ? "Please wait..."
                : mode === "signin" ? "Sign In" : "Create My Account"}
            </button>
          </form>

          {/* Three pillars — mobile only */}
          <div className="mt-8 pt-6 border-t border-white/8 md:hidden">
            <p className="text-[10px] text-white/30 font-medium tracking-widest uppercase mb-3">
              Three dimensions of growth
            </p>
            <div className="space-y-2">
              {PILLARS.map((p) => (
                <div key={p.en} className="flex items-center gap-2.5">
                  <div className="w-0.5 h-6 rounded-full bg-primary/60 shrink-0" />
                  <div>
                    <span dir="rtl" className="text-xs font-semibold text-primary/80">{p.hebrew}</span>
                    <span className="text-[10px] text-white/35 ml-2">{p.sub}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <p className="text-center text-[10px] text-white/20 mt-6">
            Private, secure, and ad-free
          </p>
        </motion.div>
      </div>
    </div>
  );
}
