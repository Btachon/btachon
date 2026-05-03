import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { BookOpen, Users, Shield, Sparkles } from "lucide-react";
import heroLearn from "@/assets/hero-learn.png";

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
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M17.64 9.205c0-.639-.057-1.252-.164-1.841H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
      <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853"/>
      <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
      <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
    </svg>
  );
}

export default function Login({ onLogin }: LoginProps) {
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const err = params.get("auth_error");
    if (err) {
      setAuthError(
        err === "cancelled"
          ? "Sign-in was cancelled. Try again."
          : err === "state_mismatch"
            ? "Security check failed. Please try again."
            : "Something went wrong. Please try again.",
      );
      params.delete("auth_error");
      window.history.replaceState({}, "", window.location.pathname + (params.toString() ? `?${params}` : ""));
    }
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row overflow-hidden">
      {/* Left panel — hero image */}
      <div className="relative md:w-1/2 h-56 md:h-screen overflow-hidden">
        <img
          src={heroLearn}
          alt="Beis Medrash"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/20 via-background/40 to-background md:block hidden" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-background/10 md:hidden" />
        <div className="absolute bottom-0 left-0 p-8 hidden md:block">
          <div className="text-4xl font-bold text-white/90 mb-2">בטחון</div>
          <div className="text-white/60 text-sm">Trust. Connect. Grow.</div>
        </div>
      </div>

      {/* Right panel — login */}
      <div className="flex-1 flex flex-col justify-center px-6 md:px-16 py-12 max-w-md mx-auto w-full md:max-w-none">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="max-w-sm mx-auto w-full"
        >
          <div className="mb-10">
            <div className="text-3xl font-bold tracking-tight text-foreground mb-1">Btachon</div>
            <div className="text-xs font-bold tracking-widest uppercase text-primary mb-4">Jewish Personal Growth</div>
            <p className="text-muted-foreground text-base leading-relaxed">
              Your personal space for growth, accountability, and connecting with your chevra.
            </p>
          </div>

          <ul className="space-y-3 mb-10">
            {features.map((f, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 + i * 0.07 }}
                className="flex items-start gap-3 text-sm text-muted-foreground"
              >
                <div className="w-7 h-7 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0 mt-0.5">
                  <f.icon className="w-3.5 h-3.5 text-primary" />
                </div>
                <span>{f.text}</span>
              </motion.li>
            ))}
          </ul>

          {authError && (
            <div className="mb-4 px-4 py-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm text-center">
              {authError}
            </div>
          )}

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="space-y-3"
          >
            {/* Google sign-in */}
            <button
              onClick={onLogin}
              className="w-full h-14 flex items-center justify-center gap-3 rounded-xl border border-border bg-card hover:bg-card/80 text-foreground font-semibold text-sm transition-colors shadow-sm"
            >
              <GoogleIcon />
              Continue with Google
            </button>

            <p className="text-center text-xs text-muted-foreground mt-2">
              Secure sign-in — no password needed
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
