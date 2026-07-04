import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import ambassadorConfig from "../config/ambassador.json";
import { X, ChevronLeft } from "lucide-react";

interface Ambassador {
  name: string;
  socials?: {
    twitch?: string;
  };
}

export function TwitchLiveWidget() {
  const [liveAmbassador, setLiveAmbassador] = useState<Ambassador | null>(null);
  const [isMinimized, setIsMinimized] = useState(false);
  const [hasChecked, setHasChecked] = useState(false);

  useEffect(() => {
    const checkLiveStatus = async () => {
      const twitchUsers = ambassadorConfig.ambassadors.filter(
        (a: Ambassador) => a.socials?.twitch
      );

      if (twitchUsers.length === 0) return;

      const liveUsers: Ambassador[] = [];

      for (const a of twitchUsers) {
        try {
          const res = await fetch(`https://decapi.me/twitch/uptime/${a.socials!.twitch}`);
          const text = await res.text();
          if (text && !text.toLowerCase().includes("offline") && !text.toLowerCase().includes("error")) {
            liveUsers.push(a);
          }
        } catch (e) {
          console.error("Errore widget Twitch per", a.name, e);
        }
      }

      setHasChecked(true);

      if (liveUsers.length > 0) {
        // Pick one randomly
        const randomLive = liveUsers[Math.floor(Math.random() * liveUsers.length)];
        setLiveAmbassador(randomLive);
      } else {
        setLiveAmbassador(null);
      }
    };

    // First check after 2 seconds to not block main render
    const timeoutId = setTimeout(() => {
      checkLiveStatus();
    }, 2000);

    // Then check every 5 minutes
    const intervalId = setInterval(checkLiveStatus, 5 * 60 * 1000);

    return () => {
      clearTimeout(timeoutId);
      clearInterval(intervalId);
    };
  }, []);

  if (!liveAmbassador || !hasChecked) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end">
      <AnimatePresence mode="wait">
        {!isMinimized ? (
          <motion.div
            key="expanded"
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.3, type: "spring", stiffness: 300, damping: 25 }}
            className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-[#e65100]/20 p-5 flex flex-col gap-4 w-72 md:w-80 relative overflow-hidden"
          >
            {/* Top red bar accent */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-red-600"></div>

            <button 
              onClick={() => setIsMinimized(true)}
              className="absolute top-3 right-3 text-[#4a1c0d]/40 hover:text-[#4a1c0d] transition-colors p-1"
              aria-label="Minimizza widget Twitch"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex flex-col gap-1 pr-6">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse"></span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-red-600">
                  In diretta ora
                </span>
              </div>
              <p className="text-sm font-semibold text-[#4a1c0d] leading-tight">
                Il nostro Ambassador <span className="text-[#e65100] font-bold">{liveAmbassador.name}</span> è live su Twitch!
              </p>
            </div>

            <a 
              href={`https://twitch.tv/${liveAmbassador.socials!.twitch}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 w-full clay-btn !bg-[#9146FF] !text-white hover:!bg-[#7c39de] px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-center flex items-center justify-center gap-2 rounded-xl transition-transform hover:scale-105 active:scale-95"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714Z" />
              </svg>
              Guarda la live
            </a>
          </motion.div>
        ) : (
          <motion.button
            key="minimized"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            onClick={() => setIsMinimized(false)}
            className="bg-[#9146FF] text-white p-3 rounded-l-xl rounded-tr-xl shadow-lg border-2 border-white flex items-center justify-center gap-2 hover:scale-105 transition-transform"
            aria-label="Espandi widget Twitch"
          >
            <ChevronLeft className="w-5 h-5" />
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714Z" />
            </svg>
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white animate-pulse"></div>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
