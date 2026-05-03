import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
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

export default function Login({ onLogin }: LoginProps) {
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

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <Button
              size="lg"
              className="w-full h-14 text-base font-bold shadow-lg shadow-primary/20"
              onClick={onLogin}
            >
              Log in to continue
            </Button>
            <p className="text-center text-xs text-muted-foreground mt-4">
              No password needed — quick and secure sign-in
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
