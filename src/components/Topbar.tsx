import { motion, AnimatePresence } from "motion/react";
import { useState, useMemo, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ChevronRight, Hammer, Menu, X } from "lucide-react";
import siteConfig from "../config/site_config.json";
import projectData from "../config/projects.json";
import type { Project } from "../types";
import { SocialLinks } from "./SocialLinks";

const csvFiles = import.meta.glob("../content/csv/*.csv", {
  eager: true,
  query: "?raw",
  import: "default",
}) as Record<string, string>;

const projects = (projectData as Project[]).filter((project) => project.id !== "hero-air" && project.url);

function isUnderConstruction(project: Project): boolean {
  return project.url?.startsWith("/") === true && project.id !== "abbiamo";
}

function ProjectMenuItem({ project, onSelect }: { project: Project; onSelect?: () => void }) {
  const underConstruction = isUnderConstruction(project);
  const content = <><span className="flex min-w-0 flex-col"><strong className="truncate">{project.title}</strong><small>{underConstruction ? "Pagina in costruzione" : project.category}</small></span>{underConstruction && <Hammer aria-hidden="true" className="h-4 w-4 shrink-0" />}</>;

  if (project.url?.startsWith("http")) {
    return <a href={project.url} target="_blank" rel="noopener noreferrer" onClick={onSelect} className="project-menu__item" title={underConstruction ? "Pagina ancora in costruzione" : `Apri ${project.title}`}>{content}</a>;
  }

  return <Link to={project.url || "/link"} onClick={onSelect} className="project-menu__item" title={underConstruction ? "Pagina ancora in costruzione" : `Apri ${project.title}`}>{content}</Link>;
}

export function Topbar() {
  const location = useLocation();
  const [docMenuOpen, setDocMenuOpen] = useState(false);
  const [bilancioSubMenuOpen, setBilancioSubMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [projectsMenuOpen, setProjectsMenuOpen] = useState(false);
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
  const isHomePage = location.pathname === "/";
  const [homeArrivalPassed, setHomeArrivalPassed] = useState(() => !isHomePage);

  useEffect(() => {
    if (!isHomePage) {
      setHomeArrivalPassed(true);
      return;
    }

    setHomeArrivalPassed(false);

    const updateLogoVisibility = () => {
      const hero = document.querySelector<HTMLElement>(".home-hero");
      if (!hero) {
        setHomeArrivalPassed(false);
        return;
      }

      setHomeArrivalPassed(window.scrollY >= hero.offsetHeight - 8);
    };

    const frame = window.requestAnimationFrame(updateLogoVisibility);
    const timer = window.setTimeout(updateLogoVisibility, 0);
    window.addEventListener("scroll", updateLogoVisibility, { passive: true });
    window.addEventListener("resize", updateLogoVisibility);

    return () => {
      window.cancelAnimationFrame(frame);
      window.clearTimeout(timer);
      window.removeEventListener("scroll", updateLogoVisibility);
      window.removeEventListener("resize", updateLogoVisibility);
    };
  }, [isHomePage]);

  const showLogo = !isHomePage || homeArrivalPassed;

  const handleLogoClick = () => {
    if (location.pathname === "/") {
      window.scrollTo({ top: 0, behavior: "smooth" });
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
              <Link to="/team" className="hover:text-[#e65100] transition-colors">
                {(siteConfig.navigation as any).team || "Team"}
              </Link>
              <div className="w-full max-w-sm">
                <button type="button" onClick={() => setProjectsMenuOpen((open) => !open)} className="project-brand-trigger project-brand-trigger--mobile" aria-expanded={projectsMenuOpen}>
                  <span>PROGETTI</span>
                </button>
                <AnimatePresence initial={false}>
                  {projectsMenuOpen && <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="mt-4 overflow-hidden border-y border-[#4a1c0d]/10 py-2">{projects.map((project) => <ProjectMenuItem key={project.id} project={project} onSelect={() => setMobileMenuOpen(false)} />)}</motion.div>}
                </AnimatePresence>
              </div>
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
        className={`fixed ${isLandingPage ? "top-0 md:top-4" : "top-0"} left-0 right-0 z-[100] px-4 py-4 md:px-6 md:py-6 flex justify-between items-center pointer-events-none`}
      >
        {/* Left Hand Side: Logo Chip */}
        <div className="flex flex-1 justify-start pointer-events-auto">
          <AnimatePresence>
            {showLogo && (
              <motion.div
                className="md:hidden"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                {isLandingPage ? (
                  <a href="https://digital-heroes.me" className="flex">
                    <div className="clay-nav h-12 px-5 flex items-center justify-center hover:opacity-80 transition-opacity">
                      <img src={(siteConfig as any).logo_horizontal || "https://img.icons8.com/ios-filled/50/e65100/home.png"} alt="ABBO APS" width="128" height="28" className="h-7 w-32 object-contain drop-shadow-[0_1.5px_3px_rgba(74,28,13,0.15)]" />
                    </div>
                  </a>
                ) : (
                  <Link to="/" onClick={handleLogoClick} className="flex">
                    <div className="clay-nav h-12 px-5 flex items-center justify-center hover:opacity-80 transition-opacity">
                      <img src={(siteConfig as any).logo_horizontal || "https://img.icons8.com/ios-filled/50/e65100/home.png"} alt="ABBO APS" width="128" height="28" className="h-7 w-32 object-contain drop-shadow-[0_1.5px_3px_rgba(74,28,13,0.15)]" />
                    </div>
                  </Link>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Center: Main Bar (Desktop) */}
        <div className="hidden md:flex flex-1 justify-center pointer-events-auto">
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

              <div className="project-brand-menu" onMouseEnter={() => !showLogo && setProjectsMenuOpen(true)} onMouseLeave={() => setProjectsMenuOpen(false)}>
                <AnimatePresence mode="wait" initial={false}>
                  {showLogo ? (
                    <Link key="home-logo" to="/" onClick={handleLogoClick} className="project-brand-trigger" aria-label="Vai alla home ABBO">
                      <motion.img
                        src={(siteConfig as any).logo_horizontal}
                        alt="ABBO APS"
                        initial={{ opacity: 0, y: 3 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -3 }}
                        transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
                      />
                    </Link>
                  ) : (
                    <div key="projects-menu">
                      <button type="button" onClick={() => setProjectsMenuOpen((open) => !open)} aria-expanded={projectsMenuOpen} className={`project-brand-trigger ${projectsMenuOpen ? "project-brand-trigger--open" : ""}`}>
                        <motion.span
                          initial={{ opacity: 0, y: 3 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -3 }}
                          transition={{ duration: 0.18, ease: "easeOut" }}
                        >
                          PROGETTI
                        </motion.span>
                      </button>
                      <AnimatePresence>
                        {projectsMenuOpen && <motion.div initial={{ opacity: 0, y: -8, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -8, scale: 0.98 }} transition={{ duration: 0.18 }} className="project-menu absolute left-1/2 top-14 z-[120] -translate-x-1/2">{projects.map((project) => <ProjectMenuItem key={project.id} project={project} onSelect={() => setProjectsMenuOpen(false)} />)}</motion.div>}
                      </AnimatePresence>
                    </div>
                  )}
                </AnimatePresence>
              </div>

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
