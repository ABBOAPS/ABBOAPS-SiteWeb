import { motion, AnimatePresence } from "motion/react";
import { useState, useMemo, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ChevronRight, Menu, X } from "lucide-react";
import siteConfig from "../config/site_config.json";
import { SocialLinks } from "./SocialLinks";

const csvFiles = import.meta.glob("../content/csv/*.csv", {
  eager: true,
  query: "?raw",
  import: "default",
}) as Record<string, string>;

export function Topbar() {
  const location = useLocation();
  const [docMenuOpen, setDocMenuOpen] = useState(false);
  const [bilancioSubMenuOpen, setBilancioSubMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);

  // Extract years dynamically from CSV files
  const bilanciYears = useMemo(() => {
    return Object.keys(csvFiles)
      .map((path) => {
        const match = path.match(/bilancio_(\d{4})\.csv/);
        // Fallback matching to balance_sheet_ just in case
        const englishMatch = path.match(/balance_sheet_(\d{4})\.csv/);
        return match ? match[1] : englishMatch ? englishMatch[1] : null;
      })
      .filter(Boolean)
      .sort((a, b) => Number(b) - Number(a)); // sort descending
  }, [csvFiles]);

  useEffect(() => {
    const handleEvent = (e: any) => setActiveProjectId(e.detail);
    window.addEventListener("project-changed", handleEvent);
    return () => window.removeEventListener("project-changed", handleEvent);
  }, []);

  // Close mobile menu on path changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const isLandingPage = location.pathname.startsWith("/landing");

  const showLogo =
    location.pathname !== "/" ||
    (activeProjectId && activeProjectId !== "hero-air");

  const handleLogoClick = () => {
    if (location.pathname === "/") {
      window.dispatchEvent(new CustomEvent("go-home"));
    }
  };

  return (
    <>
      {!isLandingPage && (
        <div className="fixed top-0 left-0 right-0 z-[200] bg-[#e65100] text-[#fffcf5] text-center py-1.5 md:py-2 text-[10px] md:text-xs font-bold uppercase tracking-widest shadow-md flex justify-center items-center">
          Il sito web è ancora in costruzione, seguiranno aggiornamenti.
        </div>
      )}

      {/* Background Dimming Overlay when docMenu is open */}
      <AnimatePresence>
        {docMenuOpen && !mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-white/40 backdrop-blur-md z-[90] pointer-events-none hidden md:block"
          />
        )}
      </AnimatePresence>

      {/* Mobile Fullscreen Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-[90] bg-[#fffcf5] pt-32 px-6 flex flex-col items-center pointer-events-auto pb-6 overflow-y-auto md:hidden"
          >
            <nav className="flex flex-col items-center space-y-8 text-xl uppercase tracking-widest font-extrabold text-[#4a1c0d]">
              <Link to="/chi-siamo" className="hover:text-[#e65100] transition-colors">
                {siteConfig.navigation.chi_siamo}
              </Link>
              <Link to="/team" className="hover:text-[#e65100] transition-colors">
                {(siteConfig.navigation as any).team || "Team"}
              </Link>
              <Link to="/notizie" className="hover:text-[#e65100] transition-colors">
                {(siteConfig.navigation as any).news || "News"}
              </Link>
              <Link to="/sostienici" className="hover:text-[#e65100] transition-colors">
                {siteConfig.navigation.sostienici}
              </Link>
              <Link to="/contatti" className="hover:text-[#e65100] transition-colors">
                {siteConfig.navigation.contatti}
              </Link>
            </nav>
            <SocialLinks variant="header" className="mt-10 justify-center" />
          </motion.div>
        )}
      </AnimatePresence>

      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, ease: "easeOut", delay: 0.1 }}
        className={`fixed ${isLandingPage ? "top-0 md:top-4" : "top-8"} left-0 right-0 z-[100] px-6 py-6 md:px-10 md:py-10 flex justify-between items-center pointer-events-none`}
      >
        {/* Left Hand Side: Logo Chip */}
        <div className="flex-1 flex justify-start pointer-events-auto">
          <AnimatePresence>
            {(showLogo || mobileMenuOpen) && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                {isLandingPage ? (
                  <a href="https://digital-heroes.me" className="flex">
                    <div className="clay-nav h-12 px-5 flex items-center justify-center hover:opacity-80 transition-opacity">
                      <img src={(siteConfig as any).logo_horizontal || "https://img.icons8.com/ios-filled/50/e65100/home.png"} alt="Abbo Logo" width="100" height="20" className="h-5 w-auto object-contain drop-shadow-[0_1.5px_3px_rgba(74,28,13,0.15)]" />
                    </div>
                  </a>
                ) : (
                  <Link to="/" onClick={handleLogoClick} className="flex">
                    <div className="clay-nav h-12 px-5 flex items-center justify-center hover:opacity-80 transition-opacity">
                      <img src={(siteConfig as any).logo_horizontal || "https://img.icons8.com/ios-filled/50/e65100/home.png"} alt="Abbo Logo" width="100" height="20" className="h-5 w-auto object-contain drop-shadow-[0_1.5px_3px_rgba(74,28,13,0.15)]" />
                    </div>
                  </Link>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Center: Main Bar (Desktop) */}
        <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 pointer-events-auto">
          <div className="clay-nav h-12 px-8 flex items-center justify-center">
            <nav className="flex items-center space-x-6 md:space-x-8 text-[11px] md:text-xs uppercase tracking-widest font-bold text-[#4a1c0d]/60">
              {isLandingPage ? (
                <a href="https://digital-heroes.me/chisiamo" className="hover:text-[#e65100] transition-colors flex items-center h-12">
                  {siteConfig.navigation.chi_siamo}
                </a>
              ) : (
                <Link
                  to="/chi-siamo"
                  className={`hover:text-[#e65100] transition-colors flex items-center h-12 ${location.pathname === "/chi-siamo" ? "text-[#e65100]" : ""}`}
                >
                  {siteConfig.navigation.chi_siamo}
                </Link>
              )}

              {isLandingPage ? (
                <a href="https://digital-heroes.me/team" className="hover:text-[#e65100] transition-colors flex items-center h-12">
                  {(siteConfig.navigation as any).team || "Team"}
                </a>
              ) : (
                <Link
                  to="/team"
                  className={`hover:text-[#e65100] transition-colors flex items-center h-12 ${location.pathname === "/team" ? "text-[#e65100]" : ""}`}
                >
                  {(siteConfig.navigation as any).team || "Team"}
                </Link>
              )}

              <Link
                to="/notizie"
                className={`hover:text-[#e65100] transition-colors flex items-center h-12 ${location.pathname === "/notizie" || location.pathname.startsWith("/news/") ? "text-[#e65100]" : ""}`}
              >
                {(siteConfig.navigation as any).news || "News"}
              </Link>

              <Link
                to="/sostienici"
                className={`hover:text-[#e65100] transition-colors flex items-center h-12 ${location.pathname === "/sostienici" ? "text-[#e65100]" : ""}`}
              >
                {siteConfig.navigation.sostienici}
              </Link>
              
              {isLandingPage ? (
                <a href="https://digital-heroes.me/contatti" className="hover:text-[#e65100] transition-colors flex items-center h-12">
                  {siteConfig.navigation.contatti}
                </a>
              ) : (
                <Link
                  to="/contatti"
                  className={`hover:text-[#e65100] transition-colors flex items-center h-12 ${location.pathname === "/contatti" ? "text-[#e65100]" : ""}`}
                >
                  {siteConfig.navigation.contatti}
                </Link>
              )}
            </nav>
          </div>
        </div>

        {/* Right Hand Side: Socials Chip & Hamburger Menu */}
        <div className="flex-1 flex justify-end pointer-events-auto">
          {/* Desktop Socials */}
          <div className="hidden md:flex clay-nav h-12 px-3 items-center justify-center text-[#4a1c0d]/60 shadow-xl">
            <SocialLinks variant="header" />
          </div>

          {/* Mobile Hamburger Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Menu"
            className="md:hidden clay-nav h-12 w-12 flex items-center justify-center shadow-xl text-[#4a1c0d] hover:text-[#e65100] transition-colors"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </motion.header>
    </>
  );
}
