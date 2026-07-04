import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { SEO } from "../components/SEO";
import ambassadorConfig from "../config/ambassador.json";
import { Instagram, Youtube, User } from "lucide-react";

// Icons for different social platforms
const TwitchIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714Z" />
  </svg>
);

const TikTokIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.12-3.44-3.17-3.8-5.46-.4-2.52.54-5.18 2.45-6.84 1.69-1.46 3.98-2.11 6.13-1.78l.05 4.09c-1.07-.15-2.18-.03-3.16.48-.9.46-1.57 1.3-1.83 2.27-.37 1.36.08 2.87 1.14 3.79 1.01.89 2.5 1.1 3.74.52 1.05-.5 1.76-1.54 1.93-2.68.04-1.92.02-3.85.02-5.77 0-4.13.01-8.25-.01-12.38z" />
  </svg>
);

interface Ambassador {
  name: string;
  role_description: string;
  photo?: string;
  socials?: {
    twitch?: string;
    instagram?: string;
    tiktok?: string;
    youtube?: string;
  };
}

export function Ambassador() {
  // Store live status. Map of twitchUsername -> isLive
  const [liveStatus, setLiveStatus] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const checkLiveStatus = async () => {
      const statuses: Record<string, boolean> = {};
      
      const twitchUsers = ambassadorConfig.ambassadors
        .filter((a: Ambassador) => a.socials?.twitch)
        .map((a: Ambassador) => a.socials!.twitch!);

      // For each user with a Twitch handle, we check via DecAPI
      for (const user of twitchUsers) {
        try {
          const res = await fetch(`https://decapi.me/twitch/uptime/${user}`);
          const text = await res.text();
          // If it does NOT contain "offline", we assume they are live
          if (text && !text.toLowerCase().includes("offline") && !text.toLowerCase().includes("error")) {
            statuses[user] = true;
          } else {
            statuses[user] = false;
          }
        } catch (e) {
          console.error("Errore check live Twitch per", user, e);
          statuses[user] = false;
        }
      }
      setLiveStatus(statuses);
    };

    checkLiveStatus();
    
    // Controlliamo ogni 5 minuti per aggiornare lo stato se qualcuno va online/offline
    const interval = setInterval(checkLiveStatus, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative z-20 w-full min-h-screen pt-40 pb-0 bg-[#fffaf0]">
      <SEO title={ambassadorConfig.title} url="/ambassador" />
      
      {/* Hero Section */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="px-6 md:px-24 mb-20 max-w-7xl mx-auto flex flex-col items-center text-center"
      >
        <div className="w-16 h-1.5 bg-[#e65100] mb-8 rounded-full"></div>
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tighter mb-8 text-[#4a1c0d] max-w-4xl leading-tight">
          {ambassadorConfig.title}
        </h1>
        <p className="text-lg md:text-2xl font-medium tracking-tight leading-relaxed max-w-4xl text-[#8a3a19]">
          {ambassadorConfig.subtitle}
        </p>
      </motion.section>

      {/* Cosa fanno */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="px-6 md:px-24 mb-32 max-w-7xl mx-auto"
      >
        <div className="bg-[#fffcf5] border border-[#e65100]/10 rounded-3xl p-8 md:p-12 shadow-sm max-w-4xl mx-auto">
           <h2 className="text-2xl font-bold text-[#4a1c0d] mb-6 text-center">Cosa fanno gli Ambassador</h2>
           <ul className="space-y-4">
             {ambassadorConfig.mission_points.map((point, i) => (
               <li key={i} className="flex items-start gap-4">
                 <div className="w-6 h-6 mt-0.5 rounded-full bg-[#e65100]/10 flex items-center justify-center shrink-0">
                   <div className="w-2.5 h-2.5 rounded-full bg-[#e65100]"></div>
                 </div>
                 <p className="text-[#8a3a19] font-medium text-lg">{point}</p>
               </li>
             ))}
           </ul>
        </div>
      </motion.section>

      {/* Griglia Ambassador */}
      <section className="px-6 md:px-24 mb-32 max-w-7xl mx-auto">
        {ambassadorConfig.ambassadors.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white/50 rounded-3xl border border-[#4a1c0d]/5 border-dashed">
            <p className="text-xl font-medium text-[#8a3a19]/80 text-center">
              {ambassadorConfig.empty_message}
            </p>
          </div>
        ) : (
          <div className="flex flex-wrap justify-center gap-8 lg:gap-10 w-full">
            {ambassadorConfig.ambassadors.map((ambassador: Ambassador, idx) => {
              const isLive = ambassador.socials?.twitch ? liveStatus[ambassador.socials.twitch] : false;
              
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: idx * 0.15 }}
                  className="group flex flex-col items-center clay-member-card p-8 relative overflow-hidden w-full max-w-sm bg-white"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-[#e65100]/5 opacity-0 group-hover:opacity-100 blur-3xl transition-opacity duration-700 pointer-events-none"></div>
                  
                  <div className="relative w-44 h-44 shrink-0 rounded-full overflow-hidden bg-[#fffcf5] flex items-center justify-center mb-6 shadow-sm border-4 border-[#fffcf5]">
                    {ambassador.photo ? (
                      <img 
                        src={ambassador.photo} 
                        alt={ambassador.name} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-all duration-[1.2s] ease-out" 
                      />
                    ) : (
                      <User className="w-16 h-16 text-[#e65100] opacity-50" />
                    )}
                    
                    {/* Live Badge overlay */}
                    {isLive && ambassador.socials?.twitch && (
                      <a 
                        href={`https://twitch.tv/${ambassador.socials.twitch}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-red-600 text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow-lg flex items-center gap-1.5 animate-pulse-slow border-2 border-white hover:scale-105 transition-transform"
                      >
                        <span className="w-1.5 h-1.5 bg-white rounded-full animate-ping-slow"></span>
                        Live Ora
                      </a>
                    )}
                  </div>

                  <div className="flex-1 flex flex-col items-center text-center w-full">
                    <h3 className="font-extrabold text-2xl text-[#4a1c0d] group-hover:text-[#e65100] transition-colors mb-2">
                      {ambassador.name}
                    </h3>
                    <p className="text-sm font-medium text-[#8a3a19]/90 leading-relaxed mb-6 flex-1">
                      {ambassador.role_description}
                    </p>

                    {/* Socials */}
                    {ambassador.socials && Object.keys(ambassador.socials).length > 0 && (
                      <div className="w-full mt-auto pt-5 border-t border-[#4a1c0d]/10 flex justify-center gap-3">
                        {ambassador.socials.twitch && (
                          <a 
                            href={`https://twitch.tv/${ambassador.socials.twitch}`}
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="w-9 h-9 rounded-full bg-[#fffcf5] border border-[#e65100]/20 flex items-center justify-center text-[#4a1c0d]/60 hover:text-[#9146FF] hover:bg-[#9146FF]/10 hover:scale-110 transition-all shadow-sm"
                            aria-label="Twitch"
                          >
                            <TwitchIcon className="w-4 h-4" />
                          </a>
                        )}
                        {ambassador.socials.instagram && (
                          <a 
                            href={`https://instagram.com/${ambassador.socials.instagram.replace('@', '')}`}
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="w-9 h-9 rounded-full bg-[#fffcf5] border border-[#e65100]/20 flex items-center justify-center text-[#4a1c0d]/60 hover:text-[#E1306C] hover:bg-[#E1306C]/10 hover:scale-110 transition-all shadow-sm"
                            aria-label="Instagram"
                          >
                            <Instagram className="w-4.5 h-4.5" />
                          </a>
                        )}
                        {ambassador.socials.tiktok && (
                          <a 
                            href={`https://tiktok.com/@${ambassador.socials.tiktok.replace('@', '')}`}
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="w-9 h-9 rounded-full bg-[#fffcf5] border border-[#e65100]/20 flex items-center justify-center text-[#4a1c0d]/60 hover:text-black hover:bg-black/10 hover:scale-110 transition-all shadow-sm"
                            aria-label="TikTok"
                          >
                            <TikTokIcon className="w-4.5 h-4.5" />
                          </a>
                        )}
                        {ambassador.socials.youtube && (
                          <a 
                            href={ambassador.socials.youtube.startsWith('http') ? ambassador.socials.youtube : `https://youtube.com/@${ambassador.socials.youtube.replace('@', '')}`}
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="w-9 h-9 rounded-full bg-[#fffcf5] border border-[#e65100]/20 flex items-center justify-center text-[#4a1c0d]/60 hover:text-[#FF0000] hover:bg-[#FF0000]/10 hover:scale-110 transition-all shadow-sm"
                            aria-label="YouTube"
                          >
                            <Youtube className="w-4.5 h-4.5" />
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
