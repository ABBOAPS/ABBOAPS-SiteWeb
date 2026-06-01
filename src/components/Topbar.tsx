import { motion, AnimatePresence } from "motion/react";
import { useState, useMemo, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ChevronRight, Menu, X } from "lucide-react";
import siteConfig from "../config/site_config.json";

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
              <Link to="/notizie" className="hover:text-[#e65100] transition-colors">
                {(siteConfig.navigation as any).news || "News"}
              </Link>
              <Link to="/documenti" className="hover:text-[#e65100] transition-colors">
                {siteConfig.navigation.documenti}
              </Link>
              <Link to="/sostienici" className="hover:text-[#e65100] transition-colors">
                {siteConfig.navigation.sostienici}
              </Link>
              <Link to="/contatti" className="hover:text-[#e65100] transition-colors">
                {siteConfig.navigation.contatti}
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, ease: "easeOut", delay: 0.1 }}
        className="fixed top-0 left-0 right-0 z-[100] px-6 py-6 md:px-10 md:py-10 flex justify-between items-center pointer-events-none"
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
                <Link to="/" onClick={handleLogoClick} className="flex">
                  <div className="clay-nav h-12 px-5 flex items-center justify-center hover:opacity-80 transition-opacity">
                    <img src={(siteConfig as any).logo_horizontal || "https://img.icons8.com/ios-filled/50/e65100/home.png"} alt="Abbo Logo" width="100" height="20" className="h-5 w-auto object-contain" />
                  </div>
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Center: Main Bar (Desktop) */}
        <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 pointer-events-auto">
          <div className="clay-nav h-12 px-8 flex items-center justify-center">
            <nav className="flex items-center space-x-6 md:space-x-8 text-[11px] md:text-xs uppercase tracking-widest font-bold text-[#4a1c0d]/60">
              <Link
                to="/chi-siamo"
                className={`hover:text-[#e65100] transition-colors flex items-center h-12 ${location.pathname === "/chi-siamo" ? "text-[#e65100]" : ""}`}
              >
                {siteConfig.navigation.chi_siamo}
              </Link>

              <Link
                to="/notizie"
                className={`hover:text-[#e65100] transition-colors flex items-center h-12 ${location.pathname === "/notizie" || location.pathname.startsWith("/news/") ? "text-[#e65100]" : ""}`}
              >
                {(siteConfig.navigation as any).news || "News"}
              </Link>

              <Link
                to="/documenti"
                className={`hover:text-[#e65100] transition-colors flex items-center h-12 ${location.pathname.startsWith("/documenti") ? "text-[#e65100]" : ""}`}
              >
                {siteConfig.navigation.documenti}
              </Link>

              <Link
                to="/sostienici"
                className={`hover:text-[#e65100] transition-colors flex items-center h-12 ${location.pathname === "/sostienici" ? "text-[#e65100]" : ""}`}
              >
                {siteConfig.navigation.sostienici}
              </Link>
              
              <Link
                to="/contatti"
                className={`hover:text-[#e65100] transition-colors flex items-center h-12 ${location.pathname === "/contatti" ? "text-[#e65100]" : ""}`}
              >
                {siteConfig.navigation.contatti}
              </Link>
            </nav>
          </div>
        </div>

        {/* Right Hand Side: Socials Chip & Hamburger Menu */}
        <div className="flex-1 flex justify-end pointer-events-auto">
          {/* Desktop Socials */}
          <div className="hidden md:flex clay-nav h-12 px-5 items-center justify-center gap-5 text-[#4a1c0d]/60 shadow-xl">
            <a
              href={siteConfig.socials.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center hover:text-[#e65100] hover:scale-110 transition-all"
              aria-label="Instagram"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                 <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                 <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                 <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
              </svg>
            </a>
            <a
              href={siteConfig.socials.discord}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center hover:text-[#e65100] hover:scale-110 transition-all"
              aria-label="Discord"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="none">
                 <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z"/>
              </svg>
            </a>
            <a
              href={siteConfig.socials.patreon}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center hover:text-[#e65100] hover:scale-110 transition-all"
              aria-label="Patreon"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="none">
                 <path d="M15.3859 0.000183105C11.5362 0.000183105 8.41406 3.12242 8.41406 6.97204C8.41406 10.8217 11.5362 13.9439 15.3859 13.9439C19.2355 13.9439 22.3577 10.8217 22.3577 6.97204C22.3577 3.12242 19.2355 0.000183105 15.3859 0.000183105ZM1.6416 23.9998H6.12643V0.000183105H1.6416V23.9998Z"/>
              </svg>
            </a>
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

