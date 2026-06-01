import siteConfig from "../config/site_config.json";
import footerConfig from "../config/footer.json";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";

interface Patron {
  id: string;
  name: string;
  imageUrl: string;
}

export function Footer() {
  const navigate = useNavigate();
  const [patrons, setPatrons] = useState<Patron[]>([]);
  const [isHovered, setIsHovered] = useState(false);
  const [copiedCF, setCopiedCF] = useState(false);

  useEffect(() => {
    fetch("/patrons.json")
      .then((res) => {
        if (!res.ok) return;
        return res.json();
      })
      .then((data) => {
        if (data && data.patrons) {
          setPatrons(data.patrons);
        }
      })
      .catch((err) => console.error("Error loading patrons in footer:", err));
  }, []);

  const handlePatronClick = () => {
    navigate("/sostienici#support-options");
    setTimeout(() => {
      const element = document.getElementById("support-options");
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }, 100);
  };

  return (
    <footer className="w-full py-16 px-6 flex flex-col items-center justify-center bg-transparent border-t border-[#e65100]/20 relative z-[80]">
      <div className="clay-panel w-full max-w-7xl p-10 flex flex-col items-center justify-center">
        
        <div className="w-full flex flex-col md:flex-row items-start md:items-center justify-between gap-8 opacity-80 text-[10px] md:text-xs font-mono uppercase tracking-widest text-[#4a1c0d]">
          <div className="flex flex-col gap-2 mb-4 md:mb-0">
            <div className="flex items-center mb-4">
              <img src={(siteConfig as any).logo_horizontal || "https://img.icons8.com/ios-filled/50/e65100/home.png"} alt="Abbo Logo" width="160" height="40" className="h-10 w-auto object-contain grayscale opacity-80" />
            </div>
            <span>Sede Legale: {footerConfig.legal_address}</span>
            <span>Codice Fiscale: {footerConfig.fiscal_code}</span>
          </div>

          <div className="flex flex-row flex-wrap justify-center gap-4 md:gap-8 text-[#4a1c0d]/70 items-center">
            {footerConfig.links.map((link, index) => (
              <Link
                key={index}
                to={link.url}
                className="hover:text-[#e65100] hover:scale-105 transition-all"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        {patrons.length > 0 && (
          <div className="w-full mt-12 py-6 border-t border-[#4a1c0d]/10 relative group overflow-hidden cursor-pointer" 
               onMouseEnter={() => setIsHovered(true)}
               onMouseLeave={() => setIsHovered(false)}
               onClick={handlePatronClick}
          >
            <div className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-[#fcf7f2] to-transparent w-16 z-10 pointer-events-none"></div>
            <div className="absolute right-0 top-0 bottom-0 bg-gradient-to-l from-[#fcf7f2] to-transparent w-16 z-10 pointer-events-none"></div>
            
            <div className="flex flex-row items-center relative h-16 w-full">
              <AnimatePresence>
                {isHovered && (
                  <motion.div
                    initial={{ opacity: 0, x: -20, filter: "blur(4px)" }}
                    animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                    exit={{ opacity: 0, x: -10, filter: "blur(2px)" }}
                    transition={{ duration: 0.3 }}
                    className="absolute left-1/2 -translate-x-1/2 md:left-auto md:translate-x-0 md:relative z-20 whitespace-nowrap text-[#ff424d] font-extrabold uppercase tracking-widest bg-[#fcf7f2]/90 backdrop-blur-sm px-4 py-2 rounded-full border border-[#ff424d]/20 shadow-xl md:mr-8"
                  >
                    I Nostri Mecenati
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="flex overflow-hidden relative w-full h-full">
                <motion.div 
                  className="flex items-center gap-4 absolute"
                  animate={{ x: ["0%", "-50%"] }}
                  transition={{ ease: "linear", duration: 120, repeat: Infinity }}
                  style={{ width: "fit-content" }}
                >
                  {(() => {
                    const repeatedPatrons = Array(Math.ceil(60 / Math.max(1, patrons.length)))
                      .fill(patrons)
                      .flat();
                    return [...repeatedPatrons, ...repeatedPatrons].map((patron, i) => (
                      <div key={`${patron.id}-${i}`} className="w-12 h-12 shrink-0 rounded-full overflow-hidden clay-card border-2 border-[#ff424d]/20 bg-white">
                        <img 
                          src={patron.imageUrl} 
                          alt={patron.name} 
                          className="w-full h-full object-cover rounded-full"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                    ));
                  })()}
                </motion.div>
              </div>
            </div>
          </div>
        )}

        <div className="w-full max-w-7xl mt-8 pt-8 border-t border-[#4a1c0d]/10 grid grid-cols-1 md:grid-cols-3 gap-6 items-center opacity-80 text-[10px] md:text-xs font-mono tracking-widest text-[#4a1c0d]">
          {/* Left Column: 5 per mille on two lines */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left select-all gap-1.5 cursor-pointer hover:text-[#e65100] transition-colors"
               onClick={() => {
                 navigator.clipboard.writeText("#########");
                 setCopiedCF(true);
                 setTimeout(() => setCopiedCF(false), 2000);
               }}
          >
            <span className="font-semibold uppercase text-[#e65100]/80">Destina il tuo 5 per mille ad ABBO APS</span>
            <div className="flex items-center gap-2">
              <span>C.F. <strong className="font-mono font-bold">#########</strong></span>
              <span className="text-[8px] px-1.5 py-0.5 rounded bg-[#e65100]/10 text-[#e65100] font-sans font-bold uppercase tracking-normal">{copiedCF ? "Copiato!" : "Copia"}</span>
            </div>
          </div>

          {/* Center Column: Copyright */}
          <div className="text-center">
            <span>{footerConfig.copyright}</span>
          </div>

          {/* Right Column: Credits */}
          <div className="text-center md:text-right">
            <span>
              {footerConfig.made_with} <a href={footerConfig.developer_url} target="_blank" rel="noopener noreferrer" className="hover:text-[#e65100] transition-colors underline decoration-[#e65100]/30 hover:decoration-[#e65100]">{footerConfig.developer_name}</a>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
