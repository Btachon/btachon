import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import mascotGreeting from "@/assets/mascot-greeting.png";
import mascotPointing from "@/assets/mascot-pointing.png";

const NOTIFICATIONS = [
  "Daf Yomi starts in 10 minutes — your chavrusa Yossi is waiting.",
  "You haven't checked off your habits today.",
  "Mendy just sent you a commitment for Parsha.",
  "Say a perek for Chaim ben Sarah — 47 others already did.",
];

export function MascotFloater() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentNotif, setCurrentNotif] = useState(NOTIFICATIONS[0]);
  const [settings] = useLocalStorage("mascotSettings", { frequency: "Standard", quietHoursStart: "22:00", quietHoursEnd: "07:00" });

  useEffect(() => {
    if (settings.frequency === "Off") return;

    let intervalTime = 60000; // Standard
    if (settings.frequency === "Gentle") intervalTime = 120000;
    if (settings.frequency === "Intense") intervalTime = 30000;

    const interval = setInterval(() => {
      const now = new Date();
      const currentHour = now.getHours();
      const currentMinutes = now.getMinutes();
      const [startHour] = settings.quietHoursStart.split(":").map(Number);
      const [endHour] = settings.quietHoursEnd.split(":").map(Number);

      const isQuietHours = 
        startHour > endHour 
          ? (currentHour >= startHour || currentHour < endHour)
          : (currentHour >= startHour && currentHour < endHour);

      if (!isQuietHours) {
        setCurrentNotif(NOTIFICATIONS[Math.floor(Math.random() * NOTIFICATIONS.length)]);
        setIsOpen(true);
        setTimeout(() => setIsOpen(false), 5000);
      }
    }, intervalTime);

    return () => clearInterval(interval);
  }, [settings]);

  if (settings.frequency === "Off") return null;

  return (
    <div className="fixed bottom-20 md:bottom-6 right-4 md:right-6 z-50 flex flex-col items-end gap-2">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            className="bg-card border border-primary/20 p-3 rounded-lg shadow-lg max-w-[200px] text-sm text-card-foreground font-medium"
          >
            {currentNotif}
          </motion.div>
        )}
      </AnimatePresence>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 rounded-full bg-primary/10 border-2 border-primary/30 p-1 hover:bg-primary/20 transition-colors shadow-lg overflow-hidden flex items-center justify-center cursor-pointer"
      >
        <img src={isOpen ? mascotPointing : mascotGreeting} alt="Mascot" className="w-full h-full object-cover rounded-full" />
      </button>
    </div>
  );
}
